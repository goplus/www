// Copyright 2012 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"encoding/json"
	"go/format"
	"net/http"
	"path"

	xmodfile "github.com/goplus/mod/modfile"
	xformat "github.com/goplus/xgo/x/format"
	"golang.org/x/mod/modfile"
)

type fmtResponse struct {
	Body  string
	Error string
}

func handleFmt(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == "OPTIONS" {
		// This is likely a pre-flight CORS request.
		return
	}
	w.Header().Set("Content-Type", "application/json")

	data, err := formatCode([]byte(r.FormValue("body")))
	if err != nil {
		json.NewEncoder(w).Encode(fmtResponse{Error: err.Error()})
		return
	}
	json.NewEncoder(w).Encode(fmtResponse{Body: string(data)})
	/*
		fs, err := splitFiles([]byte(r.FormValue("body")))
		if err != nil {
			json.NewEncoder(w).Encode(fmtResponse{Error: err.Error()})
			return
		}

		fixImports := r.FormValue("imports") != ""
		for _, f := range fs.files {
			switch {
			case path.Ext(f) == ".go":
				var out []byte
				var err error
				in := fs.Data(f)
				if fixImports {
					// TODO: pass options to imports.Process so it
					// can find symbols in sibling files.
					out, err = imports.Process(f, in, nil)
				} else {
					var tmpDir string
					tmpDir, err = os.MkdirTemp("", "gopformat")
					if err != nil {
						json.NewEncoder(w).Encode(fmtResponse{Error: err.Error()})
						return
					}
					defer os.RemoveAll(tmpDir)
					tmpGopFile := filepath.Join(tmpDir, "prog.gop")
					if err = os.WriteFile(tmpGopFile, in, 0644); err != nil {
						json.NewEncoder(w).Encode(fmtResponse{Error: err.Error()})
						return
					}
					cmd := exec.Command("gop", "fmt", "-smart", tmpGopFile)
					//gop fmt returns error result in stdout, so we do not need to handle stderr
					//err is to check gop fmt return code
					var fmtErr []byte
					fmtErr, err = cmd.Output()
					if err != nil {
						json.NewEncoder(w).Encode(fmtResponse{Error: strings.Replace(string(fmtErr), tmpGopFile, "prog.gop", -1)})
						return
					}
					out, err = os.ReadFile(tmpGopFile)
					if err != nil {
						err = errors.New("interval error when formatting gop code")
					}
				}
				if err != nil {
					errMsg := err.Error()
					if !fixImports {
						// Unlike imports.Process, format.Source does not prefix
						// the error with the file path. So, do it ourselves here.
						errMsg = fmt.Sprintf("%v:%v", f, errMsg)
					}
					json.NewEncoder(w).Encode(fmtResponse{Error: errMsg})
					return
				}
				fs.AddFile(f, out)
			case path.Base(f) == "go.mod":
				out, err := formatGoMod(f, fs.Data(f))
				if err != nil {
					json.NewEncoder(w).Encode(fmtResponse{Error: err.Error()})
					return
				}
				fs.AddFile(f, out)
			}
		}

		json.NewEncoder(w).Encode(fmtResponse{Body: string(fs.Format())})
	*/
}

func formatGoMod(file string, data []byte) ([]byte, error) {
	f, err := modfile.Parse(file, data, nil)
	if err != nil {
		return nil, err
	}
	return f.Format()
}

func formatXGoMod(file string, data []byte) ([]byte, error) {
	f, err := xmodfile.Parse(file, data, nil)
	if err != nil {
		return nil, err
	}
	return modfile.Format(f.Syntax), nil
}

func formatCode(src []byte) ([]byte, error) {
	ar, err := splitFiles(src)
	if err != nil {
		return nil, err
	}
	for _, file := range ar.files {
		in := ar.Data(file)
		var data []byte
		var err error
		switch path.Ext(file) {
		case ".go":
			data, err = format.Source(in)
		case ".gop", ".xgo":
			data, err = xformat.XGoStyleSource(in, false, file)
		case ".gox":
			data, err = xformat.XGoStyleSource(in, true, file)
		case ".mod":
			switch path.Base(file) {
			case "go.mod":
				data, err = formatGoMod(file, in)
			case "xgo.mod":
				data, err = formatXGoMod(file, in)
			}
		default:
			data, err = xformat.XGoStyleSource(in, true, file)
		}
		if err != nil {
			return nil, err
		}
		ar.AddFile(file, data)
	}
	return ar.Format(), nil
}
