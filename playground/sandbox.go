// Copyright 2014 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// TODO(andybons): add logging
// TODO(andybons): restrict memory use

package main

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"go/ast"
	"go/doc"
	"go/parser"
	"go/token"
	"html/template"
	"io"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode"
	"unicode/utf8"

	"cloud.google.com/go/compute/metadata"
	"github.com/bradfitz/gomemcache/memcache"
	"github.com/goplus/www/playground/internal/gcpdial"
	"github.com/goplus/www/playground/sandbox/sandboxtypes"
)

const (
	maxCompileTime = 5 * time.Second
	maxRunTime     = 5 * time.Second

	// progName is the implicit program name written to the temp
	// dir and used in compiler and vet errors.
	progName = "prog.go"
)

const (
	goBuildTimeoutError = "timeout running go build"
	runTimeoutError     = "timeout running program"
)

// internalErrors are strings found in responses that will not be cached
// due to their non-deterministic nature.
var internalErrors = []string{
	"out of memory",
	"cannot allocate memory",
}

type request struct {
	Body    string
	WithVet bool // whether client supports vet response in a /compile request (Issue 31970)
}

type response struct {
	Errors      string
	Events      []Event
	Status      int
	IsTest      bool
	TestsFailed int

	// VetErrors, if non-empty, contains any vet errors. It is
	// only populated if request.WithVet was true.
	VetErrors string `json:",omitempty"`
	// VetOK reports whether vet ran & passsed. It is only
	// populated if request.WithVet was true. Only one of
	// VetErrors or VetOK can be non-zero.
	VetOK bool `json:",omitempty"`
}

// commandHandler returns an http.HandlerFunc.
// This handler creates a *request, assigning the "Body" field a value
// from the "body" form parameter or from the HTTP request body.
// If there is no cached *response for the combination of cachePrefix and request.Body,
// handler calls cmdFunc and in case of a nil error, stores the value of *response in the cache.
// The handler returned supports Cross-Origin Resource Sharing (CORS) from any domain.
func (s *server) commandHandler(cachePrefix string, cmdFunc func(context.Context, *request) (*response, error)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cachePrefix := cachePrefix // so we can modify it below
		w.Header().Set("Access-Control-Allow-Origin", "*")
		if r.Method == "OPTIONS" {
			// This is likely a pre-flight CORS request.
			return
		}

		var req request
		// Until programs that depend on golang.org/x/tools/godoc/static/playground.js
		// are updated to always send JSON, this check is in place.
		if b := r.FormValue("body"); b != "" {
			req.Body = b
			req.WithVet, _ = strconv.ParseBool(r.FormValue("withVet"))
		} else if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			s.log.Errorf("error decoding request: %v", err)
			http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
			return
		}

		if req.WithVet {
			cachePrefix += "_vet" // "prog" -> "prog_vet"
		}

		resp := &response{}
		key := cacheKey(cachePrefix, req.Body)
		if err := s.cache.Get(key, resp); err != nil {
			if !errors.Is(err, memcache.ErrCacheMiss) {
				s.log.Errorf("s.cache.Get(%q, &response): %v", key, err)
			}
			resp, err = cmdFunc(r.Context(), &req)
			if err != nil {
				s.log.Errorf("cmdFunc error: %v", err)
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				return
			}
			if strings.Contains(resp.Errors, goBuildTimeoutError) || strings.Contains(resp.Errors, runTimeoutError) {
				// TODO(golang.org/issue/38576) - This should be a http.StatusBadRequest,
				// but the UI requires a 200 to parse the response. It's difficult to know
				// if we've timed out because of an error in the code snippet, or instability
				// on the playground itself. Either way, we should try to show the user the
				// partial output of their program.
				s.writeResponse(w, resp, http.StatusOK)
				return
			}
			for _, e := range internalErrors {
				if strings.Contains(resp.Errors, e) {
					s.log.Errorf("cmdFunc compilation error: %q", resp.Errors)
					http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
					return
				}
			}
			for _, el := range resp.Events {
				if el.Kind != "stderr" {
					continue
				}
				for _, e := range internalErrors {
					if strings.Contains(el.Message, e) {
						s.log.Errorf("cmdFunc runtime error: %q", el.Message)
						http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
						return
					}
				}
			}
			if err := s.cache.Set(key, resp); err != nil {
				s.log.Errorf("cache.Set(%q, resp): %v", key, err)
			}
		}

		s.writeResponse(w, resp, http.StatusOK)
	}
}

func (s *server) writeResponse(w http.ResponseWriter, resp *response, status int) {
	var buf bytes.Buffer
	if err := json.NewEncoder(&buf).Encode(resp); err != nil {
		s.log.Errorf("error encoding response: %v", err)
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(status)
	if _, err := io.Copy(w, &buf); err != nil {
		s.log.Errorf("io.Copy(w, &buf): %v", err)
		return
	}
}

func cacheKey(prefix, body string) string {
	h := sha256.New()
	io.WriteString(h, body)
	return fmt.Sprintf("%s-%s-%x", prefix, runtime.Version(), h.Sum(nil))
}

// isTestFunc tells whether fn has the type of a testing function.
func isTestFunc(fn *ast.FuncDecl) bool {
	if fn.Type.Results != nil && len(fn.Type.Results.List) > 0 ||
		fn.Type.Params.List == nil ||
		len(fn.Type.Params.List) != 1 ||
		len(fn.Type.Params.List[0].Names) > 1 {
		return false
	}
	ptr, ok := fn.Type.Params.List[0].Type.(*ast.StarExpr)
	if !ok {
		return false
	}
	// We can't easily check that the type is *testing.T
	// because we don't know how testing has been imported,
	// but at least check that it's *T or *something.T.
	if name, ok := ptr.X.(*ast.Ident); ok && name.Name == "T" {
		return true
	}
	if sel, ok := ptr.X.(*ast.SelectorExpr); ok && sel.Sel.Name == "T" {
		return true
	}
	return false
}

// isTest tells whether name looks like a test (or benchmark, according to prefix).
// It is a Test (say) if there is a character after Test that is not a lower-case letter.
// We don't want mistaken Testimony or erroneous Benchmarking.
func isTest(name, prefix string) bool {
	if !strings.HasPrefix(name, prefix) {
		return false
	}
	if len(name) == len(prefix) { // "Test" is ok
		return true
	}
	r, _ := utf8.DecodeRuneInString(name[len(prefix):])
	return !unicode.IsLower(r)
}

// getTestProg returns source code that executes all valid tests and examples in src.
// If the main function is present or there are no tests or examples, it returns nil.
// getTestProg emulates the "go test" command as closely as possible.
// Benchmarks are not supported because of sandboxing.
func getTestProg(src []byte) []byte {
	fset := token.NewFileSet()
	// Early bail for most cases.
	f, err := parser.ParseFile(fset, progName, src, parser.ImportsOnly)
	if err != nil || f.Name.Name != "main" {
		return nil
	}

	// importPos stores the position to inject the "testing" import declaration, if needed.
	importPos := fset.Position(f.Name.End()).Offset

	var testingImported bool
	for _, s := range f.Imports {
		if s.Path.Value == `"testing"` && s.Name == nil {
			testingImported = true
			break
		}
	}

	// Parse everything and extract test names.
	f, err = parser.ParseFile(fset, progName, src, parser.ParseComments)
	if err != nil {
		return nil
	}

	var tests []string
	for _, d := range f.Decls {
		n, ok := d.(*ast.FuncDecl)
		if !ok {
			continue
		}
		name := n.Name.Name
		switch {
		case name == "main":
			// main declared as a method will not obstruct creation of our main function.
			if n.Recv == nil {
				return nil
			}
		case isTest(name, "Test") && isTestFunc(n):
			tests = append(tests, name)
		}
	}

	// Tests imply imported "testing" package in the code.
	// If there is no import, bail to let the compiler produce an error.
	if !testingImported && len(tests) > 0 {
		return nil
	}

	// We emulate "go test". An example with no "Output" comment is compiled,
	// but not executed. An example with no text after "Output:" is compiled,
	// executed, and expected to produce no output.
	var ex []*doc.Example
	// exNoOutput indicates whether an example with no output is found.
	// We need to compile the program containing such an example even if there are no
	// other tests or examples.
	exNoOutput := false
	for _, e := range doc.Examples(f) {
		if e.Output != "" || e.EmptyOutput {
			ex = append(ex, e)
		}
		if e.Output == "" && !e.EmptyOutput {
			exNoOutput = true
		}
	}

	if len(tests) == 0 && len(ex) == 0 && !exNoOutput {
		return nil
	}

	if !testingImported && (len(ex) > 0 || exNoOutput) {
		// In case of the program with examples and no "testing" package imported,
		// add import after "package main" without modifying line numbers.
		importDecl := []byte(`;import "testing";`)
		src = bytes.Join([][]byte{src[:importPos], importDecl, src[importPos:]}, nil)
	}

	data := struct {
		Tests    []string
		Examples []*doc.Example
	}{
		tests,
		ex,
	}
	code := new(bytes.Buffer)
	if err := testTmpl.Execute(code, data); err != nil {
		panic(err)
	}
	src = append(src, code.Bytes()...)
	return src
}

var testTmpl = template.Must(template.New("main").Parse(`
func main() {
	matchAll := func(t string, pat string) (bool, error) { return true, nil }
	tests := []testing.InternalTest{
{{range .Tests}}
		{"{{.}}", {{.}}},
{{end}}
	}
	examples := []testing.InternalExample{
{{range .Examples}}
		{"Example{{.Name}}", Example{{.Name}}, {{printf "%q" .Output}}, {{.Unordered}}},
{{end}}
	}
	testing.Main(matchAll, tests, nil, examples)
}
`))

var failedTestPattern = "--- FAIL"

// compileAndRun tries to build and run a user program.
// The output of successfully ran program is returned in *response.Events.
// If a program cannot be built or has timed out,
// *response.Errors contains an explanation for a user.
// compileAndRun tries to build and run a user program.
// The output of successfully ran program is returned in *response.Events.
// If a program cannot be built or has timed out,
// *response.Errors contains an explanation for a user.
func compileAndRun(ctx context.Context, req *request) (*response, error) {
	// TODO(andybons): Add semaphore to limit number of running programs at once.
	tmpDir, err := os.MkdirTemp("", "sandbox")
	if err != nil {
		return nil, fmt.Errorf("error creating temp directory: %v", err)
	}
	defer os.RemoveAll(tmpDir)

	br, err := sandboxBuildGoplus(ctx, tmpDir, []byte(req.Body), req.WithVet)
	if err != nil {
		return nil, err
	}
	if br.errorMessage != "" {
		return &response{Errors: br.errorMessage}, nil
	}

	execRes, err := sandboxRun(ctx, br.exePath, br.testParam)
	if err != nil {
		return nil, err
	}
	if execRes.Error != "" {
		return &response{Errors: execRes.Error}, nil
	}

	rec := new(Recorder)
	rec.Stdout().Write(execRes.Stdout)
	rec.Stderr().Write(execRes.Stderr)
	events, err := rec.Events()
	if err != nil {
		log.Printf("error decoding events: %v", err)
		return nil, fmt.Errorf("error decoding events: %v", err)
	}
	var fails int
	if br.testParam != "" {
		// In case of testing the TestsFailed field contains how many tests have failed.
		for _, e := range events {
			fails += strings.Count(e.Message, failedTestPattern)
		}
	}
	return &response{
		Events:      events,
		Status:      execRes.ExitCode,
		IsTest:      br.testParam != "",
		TestsFailed: fails,
		VetErrors:   br.vetOut,
		VetOK:       req.WithVet && br.vetOut == "",
	}, nil
}

var errTimeout = errors.New("process timed out")

func runTimeout(cmd *exec.Cmd, d time.Duration) error {
	if err := cmd.Start(); err != nil {
		return err
	}
	errc := make(chan error, 1)
	go func() {
		errc <- cmd.Wait()
	}()
	t := time.NewTimer(d)
	select {
	case err := <-errc:
		t.Stop()
		return err
	case <-t.C:
		cmd.Process.Kill()
		return errTimeout
	}
}

// buildResult is the output of a sandbox build attempt.
type buildResult struct {
	// goPath is a temporary directory if the binary was built with module support.
	// TODO(golang.org/issue/25224) - Why is the module mode built so differently?
	goPath string
	// exePath is the path to the built binary.
	exePath string
	// useModules is true if the binary was built with module support.
	useModules bool
	// testParam is set if tests should be run when running the binary.
	testParam string
	// errorMessage is an error message string to be returned to the user.
	errorMessage string
	// vetOut is the output of go vet, if requested.
	vetOut string
}

// cleanup cleans up the temporary goPath created when building with module support.
func (b *buildResult) cleanup() error {
	if b.useModules && b.goPath != "" {
		return os.RemoveAll(b.goPath)
	}
	return nil
}

// sandboxBuildGoplus build the goplus program in a temp directory and not run it;
func sandboxBuildGoplus(_ context.Context, tmpDir string, in []byte, vet bool) (*buildResult, error) {
	err := os.WriteFile(filepath.Join(tmpDir, "prog.gop"), []byte(in), 0644)
	if err != nil {
		return nil, err
	}

	br := new(buildResult)

	qgo, err := exec.LookPath("gop")
	if err != nil {
		return nil, fmt.Errorf("error find qgo command: %v", err)
	}
	os.WriteFile(filepath.Join(tmpDir, "go.mod"), []byte(`
module playgrounddemo

go 1.19

require github.com/goplus/gop main

`), 0644)

	dumyCmd := exec.Command("mkdir", filepath.Join(tmpDir, "dummy"))
	dumyCmd.Run()
	os.WriteFile(filepath.Join(tmpDir, "dummy", "dummy.go"), []byte(`
package dummy

import (
	_ "github.com/goplus/gop/ast"
	_ "github.com/goplus/spx"
	_ "github.com/qiniu/x/errors"
)
`), 0644)

	tidyCmd := exec.Command("go", "mod", "tidy")
	tidyCmd.Dir = tmpDir
	tidyCmd.Run()

	cmdGenerate := exec.Command(qgo, "build", "-o", "a.out", ".")
	cmdGenerate.Dir = tmpDir

	out := &bytes.Buffer{}
	cmdGenerate.Stderr, cmdGenerate.Stdout = out, out

	if err := runTimeout(cmdGenerate, maxRunTime); err != nil {
		if err == errTimeout {
			return nil, fmt.Errorf("process took too long")
		}
		if _, ok := err.(*exec.ExitError); ok {
			br.errorMessage = br.errorMessage + trimGopBuild(string(out.Bytes()))
			return br, nil
		}
	}

	br.exePath = filepath.Join(tmpDir, "a.out")
	const maxBinarySize = 100 << 20
	if fi, err := os.Stat(br.exePath); err != nil || fi.Size() == 0 || fi.Size() > maxBinarySize {
		if err != nil {
			return nil, fmt.Errorf("failed to stat binary: %v", err)
		}
		return nil, fmt.Errorf("invalid binary size %d", fi.Size())
	}

	return br, nil
}

// try to handle gop build output
func trimGopBuild(output string) string {
	var res []string
	for _, v := range strings.Split(output, "\n") {
		if !strings.Contains(v, "GenGo") && strings.TrimSpace(v) != "" {
			//here we hard code the "./prog.gop" to prog.go, the frontend need this variable
			//TODO: move frontend variable prog.go to prog.gop
			res = append(res, strings.Replace(v, "./prog.gop", "prog.go", -1))
		}
	}
	return strings.Join(res, "\n")
}

// sandboxRun runs a Go binary in a sandbox environment.
func sandboxRun(ctx context.Context, exePath string, testParam string) (sandboxtypes.Response, error) {
	var execRes sandboxtypes.Response
	exeBytes, err := os.ReadFile(exePath)
	if err != nil {
		return execRes, err
	}
	ctx, cancel := context.WithTimeout(ctx, maxRunTime)
	defer cancel()
	sreq, err := http.NewRequestWithContext(ctx, "POST", sandboxBackendURL(), bytes.NewReader(exeBytes))
	if err != nil {
		return execRes, fmt.Errorf("NewRequestWithContext %q: %w", sandboxBackendURL(), err)
	}
	sreq.Header.Add("Idempotency-Key", "1") // lets Transport do retries with a POST
	if testParam != "" {
		sreq.Header.Add("X-Argument", testParam)
	}
	sreq.GetBody = func() (io.ReadCloser, error) { return io.NopCloser(bytes.NewReader(exeBytes)), nil }
	res, err := sandboxBackendClient().Do(sreq)
	if err != nil {
		if errors.Is(ctx.Err(), context.DeadlineExceeded) {
			execRes.Error = runTimeoutError
			return execRes, nil
		}
		return execRes, fmt.Errorf("POST %q: %w", sandboxBackendURL(), err)
	}
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		log.Printf("unexpected response from backend: %v", res.Status)
		return execRes, fmt.Errorf("unexpected response from backend: %v", res.Status)
	}
	if err := json.NewDecoder(res.Body).Decode(&execRes); err != nil {
		log.Printf("JSON decode error from backend: %v", err)
		return execRes, errors.New("error parsing JSON from backend")
	}
	return execRes, nil
}

// allowModuleDownloads reports whether the code snippet in src should be allowed
// to download modules.
func allowModuleDownloads(files *fileSet) bool {
	if files.Num() == 1 && bytes.Contains(files.Data(progName), []byte(`"code.google.com/p/go-tour/`)) {
		// This domain doesn't exist anymore but we want old snippets using
		// these packages to still run, so the Dockerfile adds these packages
		// at this name in $GOPATH. Any snippets using this old name wouldn't
		// have expected (or been able to use) third-party packages anyway,
		// so disabling modules and proxy fetches is acceptable.
		return false
	}
	v, _ := strconv.ParseBool(os.Getenv("ALLOW_PLAY_MODULE_DOWNLOADS"))
	return v
}

// playgroundGoproxy returns the GOPROXY environment config the playground should use.
// It is fetched from the environment variable PLAY_GOPROXY. A missing or empty
// value for PLAY_GOPROXY returns the default value of https://proxy.golang.org.
func playgroundGoproxy() string {
	proxypath := os.Getenv("PLAY_GOPROXY")
	if proxypath != "" {
		return proxypath
	}
	return "https://proxy.golang.org"
}

// healthCheck attempts to build a binary from the source in healthProg.
// It returns any error returned from sandboxBuild, or nil if none is returned.
func (s *server) healthCheck(ctx context.Context) error {
	tmpDir, err := os.MkdirTemp("", "sandbox")
	if err != nil {
		return fmt.Errorf("error creating temp directory: %v", err)
	}
	defer os.RemoveAll(tmpDir)
	br, err := sandboxBuildGoplus(ctx, tmpDir, []byte(healthProg), false)
	if err != nil {
		return err
	}
	if br.errorMessage != "" {
		return errors.New(br.errorMessage)
	}
	return nil
}

// sandboxBackendURL returns the URL of the sandbox backend that
// executes binaries. This backend is required for Go 1.14+ (where it
// executes using gvisor, since Native Client support is removed).
//
// This function either returns a non-empty string or it panics.
func sandboxBackendURL() string {
	if v := os.Getenv("SANDBOX_BACKEND_URL"); v != "" {
		return v
	}
	id, _ := metadata.ProjectID()
	switch id {
	case "golang-org":
		return "http://sandbox.play-sandbox-fwd.il4.us-central1.lb.golang-org.internal/run"
	}
	panic(fmt.Sprintf("no SANDBOX_BACKEND_URL environment and no default defined for project %q", id))
}

var sandboxBackendOnce struct {
	sync.Once
	c *http.Client
}

func sandboxBackendClient() *http.Client {
	sandboxBackendOnce.Do(initSandboxBackendClient)
	return sandboxBackendOnce.c
}

// initSandboxBackendClient runs from a sync.Once and initializes
// sandboxBackendOnce.c with the *http.Client we'll use to contact the
// sandbox execution backend.
func initSandboxBackendClient() {
	id, _ := metadata.ProjectID()
	switch id {
	case "golang-org":
		// For production, use a funky Transport dialer that
		// contacts backend directly, without going through an
		// internal load balancer, due to internal GCP
		// reasons, which we might resolve later. This might
		// be a temporary hack.
		tr := http.DefaultTransport.(*http.Transport).Clone()
		rigd := gcpdial.NewRegionInstanceGroupDialer("golang-org", "us-central1", "play-sandbox-rigm")
		tr.DialContext = func(ctx context.Context, netw, addr string) (net.Conn, error) {
			if addr == "sandbox.play-sandbox-fwd.il4.us-central1.lb.golang-org.internal:80" {
				ip, err := rigd.PickIP(ctx)
				if err != nil {
					return nil, err
				}
				addr = net.JoinHostPort(ip, "80") // and fallthrough
			}
			var d net.Dialer
			return d.DialContext(ctx, netw, addr)
		}
		sandboxBackendOnce.c = &http.Client{Transport: tr}
	default:
		sandboxBackendOnce.c = http.DefaultClient
	}
}

const healthProg = `
package main

import "fmt"

func main() { fmt.Print("ok") }
`
