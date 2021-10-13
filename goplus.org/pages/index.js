// import React from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { CodeBlock } from 'react-code-blocks'

// import Layout from '../components/Layout'

// import styles from './style.module.css'

// function Main() {
//   return (
//     <main className={styles.main}>
//       <Intro />
//       <Summary />
//       <Features />
//     </main>
//   )
// }

// function Intro() {
//   return (
//     <div className={styles.introWrap}>
//       <div className={styles.section}>
//         <div className={styles.goPlus}>
//           <Image width={120} height={34} src="/go_plus.svg" alt="Go Plus Logo" />
//         </div>
//         <div className={styles.title}>The Go+ language for engineering, STEM education, and data science</div>
//         <div className={styles.btnsWrap}>
//           <a href="" className={styles.primaryBtn}>
//             Try Go+
//           </a>
//           <a href="" className={styles.btn}>
//             <Image width={24} height={16} src="/download.svg" alt="Download Logo" />
//             <span>Download Go+</span>
//           </a>
//         </div>
//         <Image width={172} height={133} src="/qiniu_doll.png" alt="Qiniu Doll Logo" />
//       </div>
//     </div>
//   )
// }

// function Summary() {
//   const [selected, setSelected] = React.useState(0)
//   const items = React.useRef([
//     {
//       title: 'For Engineering',
//       advantages: [
//         'Compatible with full.',
//         'The grammar is simpler and more elegant, which is closer to natural language than Go.',
//         'The entry barrier is low, and the complexity of engineering is shielded when entry is used.',
//         'Strengthen the ability of each line of code, and the amount of code required to complete the function is less.'
//       ]
//     },
//     {
//       title: 'For STEM Education',
//       advantages: [
//         'Compatible with full.',
//         'The grammar is simpler and more elegant, which is closer to natural language than Go.',
//         'The entry barrier is low, and the complexity of engineering is shielded when entry is used.',
//         'Strengthen the ability of each line of code, and the amount of code required to complete the function is less.'
//       ]
//     },
//     {
//       title: 'For Data Science',
//       advantages: [
//         'Compatible with full.',
//         'The grammar is simpler and more elegant, which is closer to natural language than Go.',
//         'The entry barrier is low, and the complexity of engineering is shielded when entry is used.',
//         'Strengthen the ability of each line of code, and the amount of code required to complete the function is less.'
//       ]
//     }
//   ])
//   return (
//     <div className={styles.section}>
//       <div className={styles.title}>Why Go+</div>
//       <div className={styles.tabs}>
//         {items.current.map((item, index) => (
//           <div
//             className={`${styles.tab} ${selected === index ? styles.selected : ''}`}
//             key={item.title}
//             onClick={() => setSelected(index)}
//           >
//             {item.title}
//           </div>
//         ))}
//       </div>
//       <ul className={styles.advantages}>
//         {items.current[selected].advantages.map((advantage, index) => (
//           <li className={styles.advantage} key={index}>
//             {advantage}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// const rationalNumberCode = `var a bigint = 1r << 65  // bigint, large than int64
// var b bigrat = 4/5r      // bigrat
// c := b - 1/3r + 3 * 1/2r // bigrat
// println(a, b, c)

// var x *big.Int = 1r << 65 // (1r << 65) is untyped bigint, and can be assigned to *big.Int
// var y *big.Rat = 4/5r
// println(x, y)`

// const mapliteralCode = `x := {"Hello": 1, "xsw": 3.4} // map[string]float64
// y := {"Hello": 1, "xsw": "Go+"} // map[string]interface{}
// z := {"Hello": 1, "xsw": 3} // map[string]int
// empty := {} // map[string]interface{}
// `

// const sliceLiteral = `x := [1, 3.4] // []float64
// y := [1] // []int
// z := [1+2i, "xsw"] // []interface{}
// a := [1, 3.4, 3+4i] // []complex128
// b := [5+6i] // []complex128
// c := ["xsw", 3] // []interface{}
// empty := [] // []interface{}
// `

// const deduceStructLiteral1 = `type Config struct {
//   Dir   string
//   Level int
// }

// func foo(conf *Config) {
//   // ...
// }

// foo({Dir: "/foo/bar", Level: 1})
// `

// const deduceStructLiteral2 = `type Result struct {
//   Text string
// }

// func foo() *Result {
//   return {Text: "Hi, Go+"} // return &Result{Text: "Hi, Go+"}
// }
// `

// const listComprehension = `a := [x*x for x <- [1, 3, 5, 7, 11]]
// b := [x*x for x <- [1, 3, 5, 7, 11], x > 3]
// c := [i+v for i, v <- [1, 3, 5, 7, 11], i%2 == 1]
// d := [k+","+s for k, s <- {"Hello": "xsw", "Hi": "Go+"}]

// arr := [1, 2, 3, 4, 5, 6]
// e := [[a, b] for a <- arr, a < b for b <- arr, b > 2]

// x := {x: i for i, x <- [1, 3, 5, 7, 11]}
// y := {x: i for i, x <- [1, 3, 5, 7, 11], i%2 == 1}
// z := {v: k for k, v <- {1: "Hello", 3: "Hi", 5: "xsw", 7: "Go+"}, k > 3}
// `

// const fromCollectionCode = `type student struct {
//   name  string
//   score int
// }

// students := [student{"Ken", 90}, student{"Jason", 80}, student{"Lily", 85}]

// unknownScore, ok := {x.score for x <- students, x.name == "Unknown"}
// jasonScore := {x.score for x <- students, x.name == "Jason"}

// println(unknownScore, ok) // output: 0 false
// println(jasonScore) // output: 80
// `

// const checkIfDataExistsInACollection = `type student struct {
//   name  string
//   score int
// }

// students := [student{"Ken", 90}, student{"Jason", 80}, student{"Lily", 85}]

// hasJason := {for x <- students, x.name == "Jason"} // is any student named Jason?
// hasFailed := {for x <- students, x.score < 60}     // is any student failed?`

// const forLoop = `sum := 0
// for x <- [1, 3, 5, 7, 11, 13, 17], x > 3 {
//     sum += x
// }
// `

// const forRangeOfUDT = `type Foo struct {
// }

// // Gop_Enum(proc func(val ValType)) or:
// // Gop_Enum(proc func(key KeyType, val ValType))
// func (p *Foo) Gop_Enum(proc func(key int, val string)) {
//     // ...
// }

// foo := &Foo{}
// for k, v := range foo {
//     println(k, v)
// }

// for k, v <- foo {
//     println(k, v)
// }

// println({v: k for k, v <- foo})
// `

// const forRangeOfUDT2 = `type FooIter struct {
// }

// // (Iterator) Next() (val ValType, ok bool) or:
// // (Iterator) Next() (key KeyType, val ValType, ok bool)
// func (p *FooIter) Next() (key int, val string, ok bool) {
//     // ...
// }

// type Foo struct {
// }

// // Gop_Enum() Iterator
// func (p *Foo) Gop_Enum() *FooIter {
//     // ...
// }

// foo := &Foo{}
// for k, v := range foo {
//     println(k, v)
// }

// for k, v <- foo {
//     println(k, v)
// }

// println({v: k for k, v <- foo})
// `

// const lambdaExpression = `func plot(fn func(x float64) float64) {
//   // ...
// }

// func plot2(fn func(x float64) (float64, float64)) {
//   // ...
// }

// plot(x => x * x)           // plot(func(x float64) float64 { return x * x })
// plot2(x => (x * x, x + x)) // plot2(func(x float64) (float64, float64) { return x * x, x + x })
// `

// const overloadOperators = `import "math/big"

// type MyBigInt struct {
//     *big.Int
// }

// func Int(v *big.Int) MyBigInt {
//     return MyBigInt{v}
// }

// func (a MyBigInt) + (b MyBigInt) MyBigInt { // binary operator
//     return MyBigInt{new(big.Int).Add(a.Int, b.Int)}
// }

// func (a MyBigInt) += (b MyBigInt) {
//     a.Int.Add(a.Int, b.Int)
// }

// func -(a MyBigInt) MyBigInt { // unary operator
//     return MyBigInt{new(big.Int).Neg(a.Int)}
// }

// a := Int(1r)
// a += Int(2r)
// println(a + Int(3r))
// println(-a)
// `

// const errorHandle1 = `expr! // panic if err
// expr? // return if err
// expr?:defval // use defval if err
// `
// const errorHandle2 = `import (
//   "strconv"
// )

// func add(x, y string) (int, error) {
//   return strconv.Atoi(x)? + strconv.Atoi(y)?, nil
// }

// func addSafe(x, y string) int {
//   return strconv.Atoi(x)?:0 + strconv.Atoi(y)?:0
// }

// println(\`add("100", "23"):\`, add("100", "23")!)

// sum, err := add("10", "abc")
// println(\`add("10", "abc"):\`, sum, err)

// println(\`addSafe("10", "abc"):\`, addSafe("10", "abc"))
// `

// const errorHandle3 = `add("100", "23"): 123
// add("10", "abc"): 0 strconv.Atoi: parsing "abc": invalid syntax

// ===> errors stack:
// main.add("10", "abc")
//     /Users/xsw/goplus/tutorial/15-ErrWrap/err_wrap.gop:6 strconv.Atoi(y)?

// addSafe("10", "abc"): 10
// `

// const autoProperty1 = `import "github.com/goplus/gop/ast/goptest"

// doc := goptest.New(\`... Go+ code ...\`)!

// println(doc.Any().FuncDecl().Name())
// `

// const autoProperty2 = `
// import "github.com/goplus/gop/ast/goptest"

// doc := goptest.New(\`... Go+ code ...\`)!

// println(doc.any.funcDecl.name)
// `

// const unixShebang = `#!/usr/bin/env -S gop run

// println("Hello, Go+")

// println(1r << 129)
// println(1/3r + 2/7r*2)

// arr := [1, 3, 5, 7, 11, 13, 17, 19]
// println(arr)
// println([x*x for x <- arr, x > 3])

// m := {"Hi": 1, "Go+": 2}
// println(m)
// println({v: k for k, v <- m})
// println([k for k, _ <- m])
// println([v for v <- m])
// `

// function Features() {
//   return (
//     <div className={styles.section}>
//       <div className={styles.title}>Go+ features</div>
//       <div>
//         <aside></aside>
//         <div>
//           <a className={styles.title} id="rational-number">
//             Rational number: bigint, bigrat, bigfloat
//           </a>
//           <div>
//             {
//               'We introduce the rational number as native Go+ types. We use suffix r to denote rational literals. For example, (1r << 200) means a big int whose value is equal to 2200. And 4/5r means the rational constant 4/5.'
//             }
//           </div>
//           <CodeBlock text={rationalNumberCode} language="go" />
//           <a className={styles.title} id="map-literal">
//             Map literal
//           </a>
//           <CodeBlock text={mapliteralCode} language="go" />
//           <a className={styles.title} id="slice-literal">
//             Slice literal
//           </a>
//           <CodeBlock text={sliceLiteral} language="go" />
//           <a className={styles.title} id="deduce-struct-type">
//             Deduce struct type
//           </a>
//           <CodeBlock text={deduceStructLiteral1} language="go" />
//           <div>
//             Here <code>{`foo({Dir: "/foo/bar", Level: 1})`}</code> is equivalent to{' '}
//             <code>{`foo(&amp;Config{Dir: "/foo/bar", Level: 1})`}</code>{`. However, you can't replace`}
//             <code>{`foo(&Config{"/foo/bar", 1}`}</code> with <code>{`foo({('/foo/bar', 1)})`}</code>, because it is
//             confusing to consider <code>{`{('/foo/bar', 1)}`}</code> as a struct literal.
//           </div>
//           <div>You also can omit struct types in a return statement. For example:</div>
//           <CodeBlock text={deduceStructLiteral2} language="go" />
//           <a className={styles.title} id="list-comprehension">
//             List comprehension
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//           <a className={styles.title} id="select-data-from-a-collection">
//             Select data from a collection
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//           <a className={styles.title} id="rational-number">
//             Check if data exists in a collection
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//           <a className={styles.title} id="rational-number">
//             For loop
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//           <a className={styles.title} id="rational-number">
//             For range of UDT
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//           <a className={styles.title} id="rational-number">
//             For range of UDT2
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//           <a className={styles.title} id="rational-number">
//             Lambda expression
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//           <a className={styles.title} id="rational-number">
//             Overload operators
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//           <a className={styles.title} id="rational-number">
//             Error handling
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//           <a className={styles.title} id="rational-number">
//             Auto property
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//           <a className={styles.title} id="rational-number">
//             Unix shebang
//           </a>
//           <CodeBlock text={listComprehension} language="go" />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function Home() {
//   return (
//     <Layout>
//       <Main />
//     </Layout>
//   )
// }
