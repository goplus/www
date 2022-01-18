/**
 * @file Examples for Intro
 * @todo Use the same resource with `playground/examples/`
 */

import basic from './examples/basic.gop'
import error from './examples/error.gop'
import hello from './examples/hello.gop'
import listmap from './examples/listmap.gop'
import range from './examples/range.gop'
import rational from './examples/rational.gop'
import slice from './examples/slice.gop'

const examples = [
  { name: 'Hello, Go+', code: hello },
  { name: 'Go+ Basic', code: basic },
  { name: 'Error wrap', code: error },
  { name: 'List/Map comprehension', code: listmap },
  { name: 'Range', code: range },
  { name: 'Rational', code: rational },
  { name: 'Slice literal', code: slice }
]

export default examples
