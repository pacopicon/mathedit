const { fracStr, fracStr1, fracStr2, fracStr3, parStr, parStr1, parStr2, powStr, powParStr,
  mixStr, mixStr1, quad } = require('./testStrings')
const { mathObjIntoStr } = require('./mathParser')

let stop = 10
let exp = ''
let jsStr = ''

// jsStr = mathObjIntoStr(false, stop, fracStr3)
// exp = '((1/(4**(8**9)))*(5/(5**(7**(7/4)/(8))))/(4/(5/6))'
// console.log('(7) => frac no. 3 str name......: "fracStr3"')
// console.log('(7) => frac no. 3 input.........: ', fracStr3)
// console.log('(7) => frac no. 3 expected......: ', exp)
// console.log('(7) => frac no. 3 result........: ', jsStr + (jsStr == exp ? '👍' : '👎'))
// console.log('(7) => frac no. 3 eval expected.: ', eval(exp))
// console.log('(7) => frac no. 3 eval result...: ', eval(jsStr))

jsStr = mathObjIntoStr(false, stop, fracStr2)
exp = '(1**(2**3)/2**(2**3))/(3**(2**3)/4**(2**3))'
console.log('\n(7) => frac no. 3 str name......: "fracStr2"')
console.log('(7) => frac no. 3 input.........: ', fracStr2)
console.log('(7) => frac no. 3 expected......: ', exp)
console.log('(7) => frac no. 3 result........: ', jsStr + (jsStr == exp ? '👍' : '👎'))
console.log('(7) => frac no. 3 eval expected.: ', eval(exp))
console.log('(7) => frac no. 3 eval result...: ', eval(jsStr))

jsStr = mathObjIntoStr(false, stop, fracStr1)
exp = '(1/2)/(3/4)'
console.log('\n(6) => frac no. 2 str name......: "fracStr1"')
console.log('(6) => frac no. 2 input.........: ', fracStr1)
console.log('(6) => frac no. 2 expected......: ', exp)
console.log('(6) => frac no. 2 result........: ', jsStr + (jsStr == exp ? '👍' : '👎'))
console.log('(6) => frac no. 2 eval expected.: ', eval(exp))
console.log('(6) => frac no. 2 eval result...: ', eval(jsStr))

jsStr = mathObjIntoStr(false, stop, fracStr)
exp = '(1/(2/(3/(4/5))))/(6/(7/(8/(9/10))))'
console.log('\n(5) => frac no. 1 str name......: "fracStr"')
console.log('(5) => frac no. 1 input.........: ', fracStr)
console.log('(5) => frac no. 1 expected......: ', exp)
console.log('(5) => frac no. 1 result........: ', jsStr + (jsStr == exp ? '👍' : '👎'))
console.log('(5) => frac no. 1 eval expected.: ', eval(exp))
console.log('(5) => frac no. 1 eval result...: ', eval(jsStr))

jsStr = mathObjIntoStr(false, stop, powParStr)
exp = '(5**2)*(4**3)**4*(3**(2+3))'
console.log('\n(4) => PowPar no. 1 str name......: "powParStr"')
console.log('(4) => PowPar no. 1 input.........: ', powParStr)
console.log('(4) => PowPar no. 1 expected......: ', exp)
console.log('(4) => PowPar no. 1 result........: ', jsStr + (jsStr == exp ? '👍' : '👎'))
console.log('(4) => PowPar no. 1 eval expected.: ', eval(exp))
console.log('(4) => PowPar no. 1 eval result...: ', eval(jsStr))

jsStr = mathObjIntoStr(false, stop, parStr1)
exp = '1*(2*(3*(4*(5*(6)))))'
console.log('\n(3) => Parenthesis no. 2 str name.: "parStr1"')
console.log('(3) => Parenthesis no. 2 expected.: ', exp)
console.log('(3) => Parenthesis no. 2 result...: ', jsStr + (jsStr == exp ? '👍' : '👎'))

jsStr = mathObjIntoStr(false, stop, parStr)
exp = 'a*(b*(c*(d*(e*(f)))))'
console.log('(2) => Parenthesis no. 1 str name.......: "parStr"')
console.log('(2) => Parenthesis no. 1 expected.: ', exp)
console.log('(2) => Parenthesis no. 1 result...: ', jsStr + (jsStr == exp ? '👍' : '👎'))

jsStr = mathObjIntoStr(false, stop, powStr)
exp = '1**(2**(3**(4**5)))'
console.log('\n(1) => Power no. 1 str name.......: "powStr"')
console.log('(1) => Power no. 1 expected.......: ', exp)
console.log('(1) => Power no. 1 result.........: ', jsStr + (jsStr == exp ? '👍' : '👎'))