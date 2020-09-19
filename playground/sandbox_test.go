// Copyright 2020 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"go/token"
	"os"
	"os/exec"
	"reflect"
	"runtime"
	"strings"
	"testing"
)

// TestIsTest verifies that the isTest helper function matches
// exactly (and only) the names of functions recognized as tests.
func TestIsTest(t *testing.T) {
	cmd := exec.Command(os.Args[0], "-test.list=.")
	out, err := cmd.CombinedOutput()
	if err != nil {
		t.Fatalf("%s: %v\n%s", strings.Join(cmd.Args, " "), err, out)
	}
	t.Logf("%s:\n%s", strings.Join(cmd.Args, " "), out)

	isTestFunction := map[string]bool{}
	lines := strings.Split(string(out), "\n")
	for _, line := range lines {
		isTestFunction[strings.TrimSpace(line)] = true
	}

	for _, tc := range []struct {
		prefix string
		f      interface{}
		want   bool
	}{
		{"Test", Test, true},
		{"Test", nameOf, false},
		{"Test", TestIsTest, true},
		{"Test", Test1IsATest, true},
		{"Test", TestÑIsATest, true},

		{"Test", TestisNotATest, false},

		{"Example", Example, true},
		{"Example", ExampleTest, true},
		{"Example", Example_isAnExample, true},
		{"Example", ExampleTest_isAnExample, true},

		// Example_noOutput has a valid example function name but lacks an output
		// declaration, but the isTest function operates only on the test name
		// so it cannot detect that the function is not a test.

		{"Example", Example1IsAnExample, true},
		{"Example", ExampleisNotAnExample, false},

		{"Benchmark", Benchmark, true},
		{"Benchmark", BenchmarkNop, true},
		{"Benchmark", Benchmark1IsABenchmark, true},

		{"Benchmark", BenchmarkisNotABenchmark, false},
	} {
		name := nameOf(t, tc.f)
		t.Run(name, func(t *testing.T) {
			if tc.want != isTestFunction[name] {
				t.Fatalf(".want (%v) is inconsistent with -test.list", tc.want)
			}
			got := isTest(name, tc.prefix)
			if got != tc.want {
				t.Errorf(`isTest(%q, %q) = %v; want %v`, name, tc.prefix, got, tc.want)
			}
		})
	}
}

// nameOf returns the runtime-reported name of function f.
func nameOf(t *testing.T, f interface{}) string {
	t.Helper()

	v := reflect.ValueOf(f)
	if v.Kind() != reflect.Func {
		t.Fatalf("%v is not a function", f)
	}

	rf := runtime.FuncForPC(v.Pointer())
	if rf == nil {
		t.Fatalf("%v.Pointer() is not a known function", f)
	}

	fullName := rf.Name()
	parts := strings.Split(fullName, ".")

	name := parts[len(parts)-1]
	if !token.IsIdentifier(name) {
		t.Fatalf("%q is not a valid identifier", name)
	}
	return name
}

// TestisNotATest is not a test function, despite appearances.
//
// Please ignore any lint or vet warnings for this function.
func TestisNotATest(t *testing.T) {
	panic("This is not a valid test function.")
}

// Test11IsATest is a valid test function.
func Test1IsATest(t *testing.T) {
}

// Test is a test with a minimal name.
func Test(t *testing.T) {
}

// TestÑIsATest is a test with an interesting Unicode name.
func TestÑIsATest(t *testing.T) {
}

func Example() {
	// Output:
}

func ExampleTest() {
	// This is an example for the function Test.
	// ❤ recursion.
	Test(nil)

	// Output:
}

func Example1IsAnExample() {
	// Output:
}

// ExampleisNotAnExample is not an example function, despite appearances.
//
// Please ignore any lint or vet warnings for this function.
func ExampleisNotAnExample() {
	panic("This is not a valid example function.")

	// Output:
	// None. (This is not really an example function.)
}

func Example_isAnExample() {
	// Output:
}

func ExampleTest_isAnExample() {
	Test(nil)

	// Output:
}

func Example_noOutput() {
	// No output declared: should be compiled but not run.
}

func Benchmark(b *testing.B) {
	for i := 0; i < b.N; i++ {
	}
}

func BenchmarkNop(b *testing.B) {
	for i := 0; i < b.N; i++ {
	}
}

func Benchmark1IsABenchmark(b *testing.B) {
	for i := 0; i < b.N; i++ {
	}
}

// BenchmarkisNotABenchmark is not a benchmark function, despite appearances.
//
// Please ignore any lint or vet warnings for this function.
func BenchmarkisNotABenchmark(b *testing.B) {
	panic("This is not a valid benchmark function.")
}

func TestGetTestProg(t *testing.T) {
	tcs := []struct {
		name string
		src  []byte
		want []byte
	}{
		{
			name: "import_parse_error",
		},
		{
			name: "not_main_package",
			src:  []byte("package notmain\n"),
		},
		{
			name: "with_main_method",
			src: []byte(`package main
import "testing"

func main(){}

func TestMain(t *testing.T){}
`),
		},
		{
			name: "no_test",
			src: []byte(`package main
import "testing"
`),
		},
		{
			name: "no_testing_import",
			src: []byte(`package main
func TestMain(t *testing.T){}
`),
		},
		{
			name: "parse_error",
			src: []byte(`package main
import "testing"
func TestMain(t *testing.T){ // no }
`),
		},
		{
			name: "test_true",
			src: []byte(`package main
import "testing"

func TestTrue(t *testing.T){
}
`),
			want: []byte(`package main
import "testing"

func TestTrue(t *testing.T){
}

func main() {
	matchAll := func(t string, pat string) (bool, error) { return true, nil }
	tests := []testing.InternalTest{

		{"TestTrue", TestTrue},

	}
	examples := []testing.InternalExample{

	}
	testing.Main(matchAll, tests, nil, examples)
}
`)},
		{name: "example_hello",
			src: []byte(`package main
import "fmt"
func ExampleHello(){
    fmt.Println("hello")
    // Output:
    // hello
}
`),
			want: []byte(`package main;import "testing";
import "fmt"
func ExampleHello(){
    fmt.Println("hello")
    // Output:
    // hello
}

func main() {
	matchAll := func(t string, pat string) (bool, error) { return true, nil }
	tests := []testing.InternalTest{

	}
	examples := []testing.InternalExample{

		{"ExampleHello", ExampleHello, "hello\n", false},

	}
	testing.Main(matchAll, tests, nil, examples)
}
`),
		},
		{
			name: "example_without_output",
			src: []byte(`package main
func ExampleHello(){}
				`),
			want:[]byte(`package main;import "testing";
func ExampleHello(){}
				
func main() {
	matchAll := func(t string, pat string) (bool, error) { return true, nil }
	tests := []testing.InternalTest{

	}
	examples := []testing.InternalExample{

	}
	testing.Main(matchAll, tests, nil, examples)
}
`),
		},
	}
	for _, tc := range tcs {
		t.Run(tc.name, func(t *testing.T) {
			want := getTestProg(tc.src)
			if !reflect.DeepEqual(tc.want, want) {
				t.Log(string(tc.want))
				t.Log(string(want))
				t.Fatal()
			}
		})
	}
}
