// Copyright 2012 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"strings"

	"golang.org/x/mod/modfile"
	"golang.org/x/tools/imports"
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
				tmpGoFile := filepath.Join(tmpDir, "prog.go")
				tmpGopFile := filepath.Join(tmpDir, "prog.gop")
				if err = os.WriteFile(tmpGoFile, in, 0644); err != nil {
					json.NewEncoder(w).Encode(fmtResponse{Error: err.Error()})
					return
				}
				cmd := exec.Command("gop", "fmt", "-smart", "-mvgo", tmpGoFile)
				//gop fmt returns error result in stdout, so we do not need to handle stderr
				//err is to check gop fmt return code
				var fmtErr []byte
				fmtErr, err = cmd.Output()
				if err != nil {
					json.NewEncoder(w).Encode(fmtResponse{Error: strings.Replace(string(fmtErr), tmpGoFile, "prog.go", -1)})
					return
				}
				out, err = ioutil.ReadFile(tmpGopFile)
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
}

func formatGoMod(file string, data []byte) ([]byte, error) {
	f, err := modfile.Parse(file, data, nil)
	if err != nil {
		return nil, err
	}
	return f.Format()
}
