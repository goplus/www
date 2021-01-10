// +build ignore

package main

import (
	"log"

	"github.com/qiniu/goplus/ast"
	"github.com/qiniu/goplus/cl"
	exec "github.com/qiniu/goplus/exec/bytecode"
	"github.com/qiniu/goplus/parser"
	"github.com/qiniu/goplus/token"

	_ "github.com/qiniu/goplus/lib"
)

func buildGoplus(data string) {
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, "", data, 0)
	pkg := &ast.Package{
		Name:  "main",
		Files: make(map[string]*ast.File)}
	pkg.Files["main"] = file
	if err != nil {
		log.Printf("ParseDir failed:", err)
	}
	cl.CallBuiltinOp = exec.CallBuiltinOp

	b := exec.NewBuilder(nil)
	_, err = cl.NewPackage(b.Interface(), pkg, fset, cl.PkgActClMain) // pkgs["main"])
	if err != nil {
		log.Printf("cl.NewPackage failed:", err)
	}
	code := b.Resolve()
	ctx := exec.NewContext(code)
	ctx.Exec(0, code.Len())
}
