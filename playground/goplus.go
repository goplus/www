// +build ignore

package main

import (
	"log"

	"github.com/goplus/gop/ast"
	"github.com/goplus/gop/cl"
	exec "github.com/goplus/gop/exec/bytecode"
	"github.com/goplus/gop/parser"
	"github.com/goplus/gop/token"

	_ "github.com/goplus/gop/lib"
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
