/**
 * @file Examples for Intro
 * @todo Use the same resource with `playground/examples/`
 */

import basic from './examples/basic.xgo'
import error from './examples/error.xgo'
import hello from './examples/hello.xgo'
import listmap from './examples/listmap.xgo'
import range from './examples/range.xgo'
import rational from './examples/rational.xgo'
import slice from './examples/slice.xgo'

const examples = [
  { name: 'Hello, XGo', code: hello },
  { name: 'XGo Basic', code: basic },
  { name: 'Error wrap', code: error },
  { name: 'List/Map comprehension', code: listmap },
  { name: 'Range', code: range },
  { name: 'Rational', code: rational },
  { name: 'Slice literal', code: slice }
]

export default examples
