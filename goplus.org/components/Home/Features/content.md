### Rational number: bigint, bigrat, bigfloat

We introduce the rational number as native Go+ types. We use suffix `r` to denote rational literals. For example, (1r << 200) means a big int whose value is equal to 2<sup>200</sup>. And 4/5r means the rational constant 4/5.

```gop
import "math/big"

var a bigint = 1r << 65  // bigint, large than int64
var b bigrat = 4/5r      // bigrat
c := b - 1/3r + 3 * 1/2r // bigrat
println a, b, c

var x *big.Int = 1r << 65 // (1r << 65) is untyped bigint, and can be assigned to *big.Int
var y *big.Rat = 4/5r
println x, y
```

### Large integer: uint128, int128

```gop
var x uint128 = 1 << 65
var y = x + 1
println x // output: 36893488147419103232
println y // output: 36893488147419103233
```

### Convert bool to number types

```gop
println int(true)       // output: 1
println float64(true)   // output: 1
println complex64(true) // output: (1+0i)
```

### Map literal

```gop
x := {"Hello": 1, "xsw": 3.4}   // map[string]float64
y := {"Hello": 1, "xsw": "Go+"} // map[string]interface{}
z := {"Hello": 1, "xsw": 3}     // map[string]int
empty := {}                     // map[string]interface{}

println x, y, z, empty
```

### Slice literal

```gop
x := [1, 3.4]       // []float64
y := [1]            // []int
z := [1+2i, "xsw"]  // []interface{}
a := [1, 3.4, 3+4i] // []complex128
b := [5+6i]         // []complex128
c := ["xsw", 3]     // []interface{}
empty := []         // []interface{}

println x, y, z, a, b, c, empty
```

### Lambda expression

```gop
func plot(fn func(x float64) float64) {
    // ...
}

func plot2(fn func(x float64) (float64, float64)) {
    // ...
}

plot x => x * x           // plot(func(x float64) float64 { return x * x })
plot2 x => (x * x, x + x) // plot2(func(x float64) (float64, float64) { return x * x, x + x })
```

### Deduce struct type

```gop
type Config struct {
    Dir   string
    Level int
}

func foo(conf *Config) {
    // ...
}

foo {Dir: "/foo/bar", Level: 1}
```

Here `foo {Dir: "/foo/bar", Level: 1}` is equivalent to `foo(&Config{Dir: "/foo/bar", Level: 1})`. However, you can't replace `foo(&Config{"/foo/bar", 1})` with `foo {"/foo/bar", 1}`, because it is confusing to consider `{"/foo/bar", 1}` as a struct literal.

You also can omit struct types in a return statement. For example:

```gop
type Result struct {
    Text string
}

func foo() *Result {
    return {Text: "Hi, Go+"} // return &Result{Text: "Hi, Go+"}
}

println foo()
```


### List comprehension

```gop
a := [x*x for x <- [1, 3, 5, 7, 11]]
b := [x*x for x <- [1, 3, 5, 7, 11], x > 3]
c := [i+v for i, v <- [1, 3, 5, 7, 11], i%2 == 1]
d := [k+","+s for k, s <- {"Hello": "xsw", "Hi": "Go+"}]

arr := [1, 2, 3, 4, 5, 6]
e := [[a, b] for a <- arr, a < b for b <- arr, b > 2]

x := {x: i for i, x <- [1, 3, 5, 7, 11]}
y := {x: i for i, x <- [1, 3, 5, 7, 11], i%2 == 1}
z := {v: k for k, v <- {1: "Hello", 3: "Hi", 5: "xsw", 7: "Go+"}, k > 3}

println a, b, c, d, arr, e, x, y, z
```

### Select data from a collection

```gop
type student struct {
    name  string
    score int
}

students := [student{"Ken", 90}, student{"Jason", 80}, student{"Lily", 85}]

unknownScore, ok := {x.score for x <- students, x.name == "Unknown"}
jasonScore := {x.score for x <- students, x.name == "Jason"}

println unknownScore, ok // output: 0 false
println jasonScore // output: 80
```

### Check if data exists in a collection

```gop
type student struct {
    name  string
    score int
}

students := [student{"Ken", 90}, student{"Jason", 80}, student{"Lily", 85}]

hasJason := {for x <- students, x.name == "Jason"} // is any student named Jason?
hasFailed := {for x <- students, x.score < 60}     // is any student failed?

println hasJason, hasFailed
```

### For loop

```gop
sum := 0
for x <- [1, 3, 5, 7, 11, 13, 17], x > 3 {
    sum += x
}

println sum
```


### Range expression (`start:end:step`)

```gop
for i <- :10 {
    println i
}

for i := range :10:2 {
    println i
}

for i := range 1:10:3 {
    println i
}

for range :10 {
    println "Range expression"
}
```


### For range of UDT

```gop
type Foo struct {
}

// Gop_Enum(proc func(val ValType)) or:
// Gop_Enum(proc func(key KeyType, val ValType))
func (p *Foo) Gop_Enum(proc func(key int, val string)) {
    // ...
}

foo := &Foo{}
for k, v := range foo {
    println k, v
}

for k, v <- foo {
    println k, v
}

println {v: k for k, v <- foo}
```

**Note: you can't use break/continue or return statements in for range of udt.Gop_Enum(callback).**


### For range of UDT2

```gop
type FooIter struct {
}

// (Iterator) Next() (val ValType, ok bool) or:
// (Iterator) Next() (key KeyType, val ValType, ok bool)
func (p *FooIter) Next() (key int, val string, ok bool) {
    // ...
}

type Foo struct {
}

// Gop_Enum() Iterator
func (p *Foo) Gop_Enum() *FooIter {
    // ...
}

foo := &Foo{}
for k, v := range foo {
    println k, v
}

for k, v <- foo {
    println k, v
}

println {v: k for k, v <- foo}
```

### Overload operators

```gop
import "math/big"

type MyBigInt struct {
    *big.Int
}

func Int(v *big.Int) MyBigInt {
    return MyBigInt{v}
}

func (a MyBigInt) + (b MyBigInt) MyBigInt { // binary operator
    return MyBigInt{new(big.Int).Add(a.Int, b.Int)}
}

func (a MyBigInt) += (b MyBigInt) {
    a.Int.Add(a.Int, b.Int)
}

func -(a MyBigInt) MyBigInt { // unary operator
    return MyBigInt{new(big.Int).Neg(a.Int)}
}

a := Int(1r)
a += Int(2r)
println a + Int(3r)
println -a
```


### Error handling

We reinvent the error handling specification in Go+. We call them `ErrWrap expressions`:

```gop|raw
expr! // panic if err
expr? // return if err
expr?:defval // use defval if err
```

How to use them? Here is an example:

```gop
import (
    "strconv"
)

func add(x, y string) (int, error) {
    return strconv.Atoi(x)? + strconv.Atoi(y)?, nil
}

func addSafe(x, y string) int {
    return strconv.Atoi(x)?:0 + strconv.Atoi(y)?:0
}

println `add("100", "23"):`, add("100", "23")!

sum, err := add("10", "abc")
println `add("10", "abc"):`, sum, err

println `addSafe("10", "abc"):`, addSafe("10", "abc")
```

The output of this example is:

```gop|raw
add("100", "23"): 123
add("10", "abc"): 0 strconv.Atoi: parsing "abc": invalid syntax

===> errors stack:
main.add("10", "abc")
    /Users/xsw/tutorial/15-ErrWrap/err_wrap.gop:6 strconv.Atoi(y)?

addSafe("10", "abc"): 10
```

Compared to corresponding Go code, It is clear and more readable.

And the most interesting thing is, the return error contains the full error stack. When we got an error, it is very easy to position what the root cause is.

How these `ErrWrap expressions` work? See [Error Handling](https://github.com/goplus/gop/wiki/Error-Handling) for more information.


### Auto property

Let's see an example written in Go+:

```gop
import "gop/ast/goptest"

doc := goptest.New(`... Go+ code ...`)!

println doc.Any().FuncDecl().Name()
```

In many languages, there is a concept named `property` who has `get` and `set` methods.

Suppose we have `get property`, the above example will be:

```gop
import "gop/ast/goptest"

doc := goptest.New(`... Go+ code ...`)!

println doc.any.funcDecl.name
```

In Go+, we introduce a concept named `auto property`. It is a `get property`, but is implemented automatically. If we have a method named `Bar()`, then we will have a `get property` named `bar` at the same time.


### Unix shebang

You can use Go+ programs as shell scripts now. For example:

```gop
#!/usr/bin/env -S gop run

println "Hello, Go+"

println 1r << 129
println 1/3r + 2/7r*2

arr := [1, 3, 5, 7, 11, 13, 17, 19]
println arr
println [x*x for x <- arr, x > 3]

m := {"Hi": 1, "Go+": 2}
println m
println {v: k for k, v <- m}
println [k for k, _ <- m]
println [v for v <- m]
```

Go [20-Unix-Shebang/shebang](https://github.com/goplus/tutorial/blob/main/20-Unix-Shebang/shebang) to get the source code.