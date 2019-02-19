
// complex strings
let ar = '9+8-7\\cdot 6\\left(5+4-3\\left(2\\right)\\left(6\\right)\\right)8-\\left(4\\right)2\\left(3\\right)'

let ar2 = '\\left(1a+2b-aa\\cdot 3c+45\\div 4d-21\\right)\\div \\left(\\left(abcd+1234-5678\\cdot qwer\\cdot 9\\right)\\left(abcd+1234-5678\\cdot qwer\\div 9\\right)\\right)\\div abcd+1234-5678\\cdot qwer\\cdot 9\\div \\left(a+b-c\\div d\\cdot e\\right)\\left(a+b-c\\div d\\cdot e\\right)\\left(a+b-c\\div d\\cdot e\\left(a+b-c\\div d\\cdot e\\right)\\right)\\left(a+b-c\\div d\\cdot e\\left(a+b-c\\div d\\cdot e\\right)\\right)'

let fs = '\\frac{\\frac{1-ab+22\\left(\\left(3\\cdot se+43-g\\left(5\\right)\\right)\\left(ad\\right)\\right)64-\\left(i\\right)7\\left(jl\\right)}{\\frac{85+b-9\\cdot dd\\left(13+fr-2\\left(h\\right)\\left(43\\right)\\right)4-\\left(ai\\right)65\\left(j\\right)}{\\frac{6+xb-77\\cdot d\\left(e+8-gd\\left(\\left(39\\right)\\left(d\\right)\\right)\\right)b-\\left(i\\right)h\\left(12\\right)}{\\frac{a+b-c\\cdot d\\left(e+f-g\\left(h\\right)\\left(d\\right)\\right)b-\\left(i\\right)h\\left(j\\right)}{a+b-c\\cdot d\\left(e+f-g\\left(h\\right)\\left(d\\right)\\right)b-\\left(i\\right)h\\left(9\\div a\\right)}}}}}{\\frac{a+b-c\\cdot d\\left(e+f-g\\left(h\\right)\\left(d\\right)\\right)b-\\left(i\\right)h\\left(j\\right)}{\\frac{a\\div 3+b-c\\cdot d\\left(e+f-g\\left(9\\div a\\right)\\left(d\\right)\\right)9\\div a-\\left(i\\right)h\\left(j\\right)}{\\frac{a+b-c\\cdot d\\left(e+f-g\\left(h\\right)\\left(d\\right)\\right)b-\\left(i\\right)9\\div a\\left(j\\right)}{\\frac{a+b-9\\div a\\cdot d\\left(e+f-g\\left(h\\right)\\left(d\\right)\\right)b-\\left(i\\right)9\\div 3}{\\left(a\\left(b\\left(c\\left(d\\left(e\\left(f\\cdot g\\right)h\\right)i\\right)j\\right)k\\right)l\\right)m\\left(a\\right)\\left(b\\right)\\left(c\\right)\\left(\\left(d\\right)\\right)\\left(\\left(\\left(e\\right)\\right)\\right)}}}}}'
  

  
// simple strings
let fracStr = '\\frac{\\frac{1}{\\frac{2}{\\frac{3}{\\frac{4}{5}}}}}{\\frac{6}{\\frac{7}{\\frac{8}{\\frac{9}{10}}}}}'
let fracStr1 = '\\frac{\\frac{1}{2}}{\\frac{3}{4}}'
let fracStr2 = '\\frac{\\frac{1^{2^3}}{2^{2^3}}}{\\frac{3^{2^3}}{4^{2^3}}}'
let fracStr3 = '\\frac{\\frac{1}{4^{8^9}}\\cdot \\frac{5}{5^{\\frac{7^{\\frac{7}{4}}}{8}}}}{\\frac{4}{\\frac{5}{6}}}'
let parStr = '\\left(a\\left(b\\left(c\\left(d\\left(e\\left(f\\right)\\right)\\right)\\right)\\right)\\right)'
let parStr1 = '\\left(1\\left(2\\left(3\\left(4\\left(5\\left(6\\right)\\right)\\right)\\right)\\right)\\right)'
let parStr2 = '7\\left(1\\left(2\\left(3\\left(4\\left(5\\left(6\\right)+2\\right)-3\\right)\\cdot 4\\right)^5\\right)6\\right)10'
let powStr = '1^{2^{3^{4^5}}}'

let powParStr = '\\left(5^2\\right)\\left(4^3\\right)^4\\left(3^{\\left(2+3\\right)}\\right)'


let mixStr = '5^3\\left(23-\\left(\\frac{\\left(3^7\\left(\\frac{1}{2}\\right)^{\\frac{3}{4}}\\right)\\log8 }{\\sqrt9 }\\right)-6\\right)'

let mixStr1 = 'f_1=\\left(F_t-F_0\\right)d\\left(t,T\\right)=\\frac{S_t\\left(1+\\frac{r_t}{n}\\right)^{n\\left(T-t\\right)}-S_0\\left(1+\\frac{r_0}{n}\\right)^{nT}}{\\left(1+\\frac{r}{n}\\right)^{n\\left(T-t\\right)}}'

let quad = 'x=\frac{-b\pm \sqrt{\left(b^2-4ac\right)}}{2a}'

const spliceStr = (str, i, numToReplace, newStr) => {
  let strArr = str.split('')
  strArr.splice(i, numToReplace, newStr)
  return strArr.join('') 
}

const parsIntoMult = (str) => {
  for (let i=1; i<str.length; i++) {
    let befCurrIdx = str.substr(i-1,1)
    let thisIdx = str.substr(i,1)
    if (befCurrIdx != '{' && befCurrIdx != '/' && befCurrIdx != '+' && befCurrIdx != '-' && befCurrIdx != '*' && befCurrIdx != '(' && thisIdx == '(') {
      str = spliceStr(str, i, 1, '*(')
    }
  }
  for (let i=0; i<str.length; i++) {
    let last = str.length-1
    thisIdx = str.substr(i,1)
    let nextIdx = str.substr(i+1,1)
    if (thisIdx != '}' && thisIdx == ')' && i != last && nextIdx != '-' && nextIdx != '+' && nextIdx != '*' && nextIdx != ')') {
      str = spliceStr(str, i, 1, ')*')
    }
  }
  return str
}

const arith = (str) => {
  str = str.replace('\\cdot', '*')
  str = str.replace('\\cdot ', '*')
  str = str.replace('\\div', '/')
  str = str.replace('\\div ', '/')

  if (str.includes('\\cdot')) {
    str = arith(str)
  }
  return str
}

const processPars = (str) => {
  str = str.replace('\\left(', '(')
  str = str.replace('\\right)', ')')
  if (str.includes('\\left(') || str.includes('\\right)')) {
    str = processPars(str)
  }
  return str
}

let expStr = '9+8-(7)*6*(5+4-3*(2)*(6))*8-(4)*2*(3)'

const processSimpleFracs = (str) => {
  let patt = /\\frac\{(\d+|\w+|\W+)\}\{(?!\\frac\{)(\d+|\w+|\W+)\}/g
  // str = str.replace(patt, )
  let nestedFracArr = patt.exec(str)
  let nestedFrac = nestedFracArr[0]
  let processedNum = nestedFrac.replace('\\frac{', '(')
  let processedDivisor = processedNum.replace('}{', '/')
  let processedDenom = processedDivisor.replace('}', ')')
  let processedFrac = str.replace(nestedFrac, processedDenom)
  return processedFrac
}

let patt = /(?:(frac\{|\{))((\()?)+(\d+|\w+)((\))?)+((\+|\-|\*|\*\*|\\cdot\s|\\cdot|\\div\s|\\div|)((\()?)+(\d+|\w+)((\))?)+)+(?:\})/g

const processComplexFracs = (obj) => {
  let str = obj.str
  let order = obj.order
  let refs = obj.refs

  let arithPatt = /(?:(\\frac\{|\{))\(*(\d+|\w+)((\))?)+((\+|\-|\*|\*\*|\^|\\cdot\s|\\cdot|\\div\s|\\div|)\(*(\d+|\w+)\)*)+(?:\})/gm
  let matchArr = arithPatt.exec(str)
  let bookEndedMatch = matchArr[0] 
  let matchWithRightBrac = ''
  let fracBrac =  '\\frac{'
  let brac = '{'
  if (bookEndedMatch.includes(fracBrac)) {
    matchWithRightBrac = bookEndedMatch.replace(fracBrac, '')
  } else if (bookEndedMatch.includes(brac)) {
    matchWithRightBrac = bookEndedMatch.replace(brac, '')
  }
  let match = matchWithRightBrac.replace('}', '')
  let strWithRef = str.replace(match, `||${order}||`)
  refs[`||${order}||`] = arith(match)

  const pos = strWithRef.search(arithPatt)
  
  if (pos > -1) {
    order++
    let _obj = {}
    _obj.str = strWithRef
    _obj.order = order
    _obj.refs = {...refs}

    // console.log('_obj = ', JSON.stringify(_obj))

    let res = processComplexFracs(_obj)
    strWithRef = res.strWithRef 
    order = res.order 
    refs = res.refs
  } 

  return {
    strWithRef, 
    order, 
    refs
  }
 
}

const testStr = (str) => {
  let arithPatt = /(?:(\\frac\{|\{))\(*(\d+|\w+)((\))?)+((\+|\-|\*|\*\*|\\cdot\s|\\cdot|\\div\s|\\div|)\(*(\d+|\w+)\)*)+(?:\})/g
  return arithPatt.test(str)
}

const convertLatexStrIntoJSmathStr = (str) => {
  str = processPars(str)
  let obj = {
    str,
    order: 0,
    refs: {}
  }
  obj = processComplexFracs(obj)
  
  return obj
}

const getBaseLog = (b, x) => {
  return Math.log(x) / Math.log(b);
}

const nthroot = (root, n) => {
  return Math.pow(n, 1/root)
}

const iTerm = (i) => i**2

const summation = (i, n) => {
  let total = 0
  for (i; i<n+1; i++) {
    total += iTerm(i)
  }
  return total
}

const summate = (i, n, exp) => {
  const iTerm = (i) => eval(exp)

  const summation = (i, n) => {
    let total = 0
    for (i; i<n+1; i++) {
      total += iTerm(i)
    }
      return total
    }
  return summation(i,n)
}

const production = (i, n) => {
  let total = iTerm(i)
  for (i; i<n; i++) {
    total *= iTerm(i)
  }
  return total
}

const cot = (x) => 1 / Math.tan(x)

const csc = (x) => 1 / Math.sin(x)

const sec = (x) => 1 / Math.cos(x)

let rest = '\\frac{\\frac{||0||}{\\frac{||1||}{\\frac{||2||}{\\frac{||3||}||4||}}}}}{\\frac{||5||}{\\frac{||6||}{\\frac{||7||}{\\frac{||8||}{(a(b(c(d(e(f\\cdot g)h)i)j)k)l)m(a)(b)(c)((d))(((e)))}}}}}'

let arithPatt = /(?:(\\frac\{|\{))\(*(\d+|\w+)((\))?)+((\+|\-|\*|\*\*|\\cdot\s|\\cdot|\\div\s|\\div|)\(*(\d+|\w+)\)*)+(?:\})/g

let arithPatt2 = /(?:(\\\\frac\{|\{))\(*(\d+|\w+)((\))?)+((\+|\-|\*|\*\*|\\\\cdot\s|\\\\cdot|\\\\div\s|\\\\div|)\(*(\d+|\w+)\)*)+(?:\})/g
// latex strings
// 1
let ari = '1a+2b-aa\cdot 3c+45/4d-21'
// 2
let fr = '\\frac{1}{2}'
// 3
let par = '\\left(2\\right)'
// 4
let sqrt = '\\sqrt{4}'
// 5
let nthrt = '\\\\sqrt[3]{27}'
// 6
let pow = '1^{2^{3^{4^5}}}'
// 7
let log = '\\log _2\\left(4\\right)'
// 8
let ln = '\\ln \\left(2\right)'
// 9
let sum = '\sum _{i=3}^6\left(i^2\right)'

// 10
let sin = '\\sin \\left(5\\right)'
let cos = '\\cos \\left(5\\right)'
let tan = '\\tan \\left(5\\right)'
let cot1 = '\\cot \\left(5\\right)'
let csc1 = '\\csc \\left(5\\right)'
let sec1 = '\\sec \\left(5\\right)'

// js strings
// 1
let ariJS = '1a + 2b - aa * 3c + 45/4d - 21'
// 2
let frJS = '1/2'
// 3
let parJS = '(2)'
// 4
let sqrtJS = 'nthroot(2,4)'
// 5
let nthrtJS = 'nthroot(3,27)'
// 6
let powJS = '1**(2**(3**(4**5)))'
// 7
let logJS = 'getBaseLog(2,4)'
// 8
let lnJS = 'Math.log(2)'
// 9
let sumJS = 'iTerm(i) => i**2 && summation(3,6)'

// 10
let sinJS = 'Math.sin(5)'
let cosJS = 'Math.cos(5)'
let tanJS = 'Math.tan(5)'
let cotJS = 'cot(5)'
let cscJS = '\\csc \\left(5\\right)'
let secJS = '\\sec \\left(5\\right)'


// constants

// Euler's number
let e = Math.E
let pi = Math.PI 



let obj = convertLatexStrIntoJSmathStr(fs)

console.log(JSON.stringify(obj))

const findUnnestedExp = (str) => {
  let arith = /(\\\\left\()*(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)*(\\\\right\)|\\\\left\()*((\+|\-|\\\\cdot\s|\\\\cdot)*(\\\\left\()*(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)*(\\\\right\))*)*/g
  let simpFrac = /\\\\frac\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}/g
  let simpSqrt = /\\\\sqrt\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}/g
  let simpNthrt = /\\\\sqrt\[(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\]\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}/g
  let compPow = /\^\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\^(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}/g
  let simpPow = /(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\^(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)/g
  let simpLog = /\\\\log\s\_(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\\\\left\((\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\\\\right\)/g
  let simpLn = /\\\\ln\s\\\\left\((\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\\\\right\)/g
  let 


}

// regexr

let current_regexp = /\\\\sum\s\_\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)((\=)(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|))?\}\^(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)(\\\\left\(){1,}(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)*(\\\\right\)|\\\\left\()*((\+|\-|\\\\cdot\s|\\\\cdot)*(\\\\left\()*(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)*(\\\\right\))*)*\\\\right\)/g



let pow = 1^{2^{3^{4^{5^{6^7}}}}}
let pow = ||1||^{||2||^{||3||^{||4||^{||5||^{||6||^||7||}}}}}
// 7
let log = \\log _2\\left(4\\right)
let log = \\log _||2||\\left(||4||\\right)
// 8
let ln = \\ln \\left(2\\right)
let ln = \\ln \\left(||2||\\right)
// 9
let sum = \\sum _{i=3}^6\\left(1-i+22\\left(\\left(3\\cdot i+43-g\\left(5\\right)\\right)\\left(ad\\right)\\right)64-\\left(i\\right)7\\left(i\\right)\\right)
let sum = \\sum _{i}^6\\left(1-i+22\\left(\\left(3\\cdot i+43-g\\left(5\\right)\\right)\\left(ad\\right)\\right)64-\\left(i\\right)7\\left(i\\right)\\right)
let sum = \\sum _{i=||3||}^||6||\\left(||1||-||2||+||3||\\left(\\left(||4||\\cdot ||5||+||6||-||7||\\left(||8||\\right)\\right)\\left(||9||\\right)\\right)||10||-\\left(||11||\\right)||12||\\left(||13||\\right)\\right)
let sum = \\sum _{||3||}^||6||\\left(||1||-||2||+||3||\\left(\\left(||4||\\cdot ||5||+||6||-||7||\\left(||8||\\right)\\right)\\left(||9||\\right)\\right)||10||-\\left(||11||\\right)||12||\\left(||13||\\right)\\right)

let sum = \sum _{n=0}^{\\infty }

// 10
let sin = '\\sin \\left(5\\right)'
let cos = '\\cos \\left(5\\right)'
let tan = '\\tan \\left(5\\right)'
let cot1 = '\\cot \\left(5\\right)'
let csc1 = '\\csc \\left(5\\right)'
let sec1 = '\\sec \\left(5\\right)'

let sin = '\\sin \\left(||5||\\right)'
let cos = '\\cos \\left(||5||\\right)'
let tan = '\\tan \\left(||5||\\right)'
let cot1 = '\\cot \\left(||5||\\right)'
let csc1 = '\\csc \\left(||5||\\right)'
let sec1 = '\\sec \\left(||5||\\right)'



// 1
let ariJS = '1a + 2b - aa * 3c + 45/4d - 21'
// 2
let frJS = '1/2'
// 3
let parJS = '(2)'
// 4
let sqrtJS = 'nthroot(2,4)'
// 5
let nthrtJS = 'nthroot(3,27)'
// 6
let powJS = '1**(2**(3**(4**5)))'
// 7
let logJS = 'getBaseLog(2,4)'
// 8
let lnJS = 'Math.log(2)'
// 9
let sumJS = 'iTerm(i) => i**2 && summation(3,6)'

// 10
let sinJS = 'Math.sin(5)'
let cosJS = 'Math.cos(5)'
let tanJS = 'Math.tan(5)'
let cotJS = 'cot(5)'
let cscJS = '\\csc \\left(5\\right)'
let secJS = '\\sec \\left(5\\right)'