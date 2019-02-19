
// complex strings
let ar = '9+8-7\\cdot 6\\left(5+4-3\\left(2\\right)\\left(6\\right)\\right)8-\\left(4\\right)2\\left(3\\right)'

let ar2 = '\\left(1a+2b-aa\\cdot 3c+45\\div 4d-21\\right)\\div \\left(\\left(abcd+1234-5678\\cdot qwer\\cdot 9\\right)\\left(abcd+1234-5678\\cdot qwer\\div 9\\right)\\right)\\div abcd+1234-5678\\cdot qwer\\cdot 9\\div \\left(a+b-c\\div d\\cdot e\\right)\\left(a+b-c\\div d\\cdot e\\right)\\left(a+b-c\\div d\\cdot e\\left(a+b-c\\div d\\cdot e\\right)\\right)\\left(a+b-c\\div d\\cdot e\\left(a+b-c\\div d\\cdot e\\right)\\right)'

let ar3 = `1a+2b-\\frac{5a^q\\left(34\\cdot 5^{3^2}+3^2\\right)\\sqrt[3^9]{27^5}\\log _{10}\\left(1000\\right)\\ln \\left(9\\right)\\sum _{i=3}^6\\left(i^2\\right)sin\\left(2\\right)}{5a^q\\left(34\\cdot 5^3+3^2\\right)\\sqrt[3^9]{27^5}\\log _{10}\\left(1000\\right)\\ln \\left(9\\right)\\sum _{i=3}^6\\left(i^2\\right)tan\\left(2\\right)}*1a+2b`

let ar3Exp = `1a+2b-(  5a**q(34*5**(3**2)+3**2) * nthroot(3**9,27**5) * getBaseLog(10,1000) * Math.log(9) * summate(3,6,'i**2') * Math.sin(2))*1a+2b`

let fs = `\\frac{\\frac{1-ab+22\\left(\\left(3\\cdot se+43-g\\left(5\\right)\\right)\\left(ad\\right)\\right)64-\\left(i\\right)7\\left(jl\\right)}{\\frac{85+b-9\\cdot dd\\left(13+fr-2\\left(h\\right)\\left(43\\right)\\right)4-\\left(ai\\right)65\\left(j\\right)}{\\frac{6+xb-77\\cdot d\\left(e+8-gd\\left(\\left(39\\right)\\left(d\\right)\\right)\\right)b-\\left(i\\right)h\\left(12\\right)}{\\frac{a+b-c\\cdot d\\left(e+f-g\\left(h\\right)\\left(d\\right)\\right)b-\\left(i\\right)h\\left(j\\right)}{a+b-c\\cdot d\\left(e+f-g\\left(h\\right)\\left(d\\right)\\right)b-\\left(i\\right)h\\left(9\\div a\\right)}}}}}{\\frac{a+b-c\\cdot d\\left(e+f-g\\left(h\\right)\\left(d\\right)\\right)b-\\left(i\\right)h\\left(j\\right)}{\\frac{a\\div 3+b-c\\cdot d\\left(e+f-g\\left(9\\div a\\right)\\left(d\\right)\\right)9\\div a-\\left(i\\right)h\\left(j\\right)}{\\frac{a+b-c\\cdot d\\left(e+f-g\\left(h\\right)\\left(d\\right)\\right)b-\\left(i\\right)9\\div a\\left(j\\right)}{\\frac{a+b-9\\div a\\cdot d\\left(e+f-g\\left(h\\right)\\left(d\\right)\\right)b-\\left(i\\right)9\\div 3}{\\left(a\\left(b\\left(c\\left(d\\left(e\\left(f\\cdot g\\right)h\\right)i\\right)j\\right)k\\right)l\\right)m\\left(a\\right)\\left(b\\right)\\left(c\\right)\\left(\\left(d\\right)\\right)\\left(\\left(\\left(e\\right)\\right)\\right)}}}}}`

let fr = `\\frac{5a^q\\left(34\\cdot 5^{3^2}+3^2\\right)\\sqrt[3^9]{27^5}\\log _{10}\\left(1000\\right)-\\frac{4\\left(3\\cdot 5^{6^7}\\sqrt[3]{27}\\log _{10}\\left(100\\right)\\right)}{5\\ln \\left(9\\right)}+\\ln \\left(9\\right)\\sum _{i=3}^6\\left(i^2\\right)sin\\left(2\\right)}{5a^q\\left(34\\cdot 5^3+3^2\\right)\\sqrt[3^9]{27^5}\\log _{10}\\left(1000\\right)\\cdot \\frac{4\\left(3\\cdot 5^{6^7}\\sqrt[3]{27}\\log _{10}\\left(100\\right)\\right)}{5\\ln \\left(9\\right)}\\ln \\left(9\\right)\\sum _{i=3}^6\\left(i^2\\right)tan\\left(2\\right)}`

let frExp = ``

let par = `\\left(\\frac{5a^q\\left(34\\cdot 5^{3^2}+3^2\\right)\\left(\\sqrt[3^9]{27^5}\\right)\\left(\\log _{10}\\left(1000\\right)\\right)-\\left(\\frac{4\\left(3\\cdot 5^{6^7}\\sqrt[3]{27}\\log _{10}\\left(100\\right)\\right)}{\\ln \\left(9\\right)}\\right)+\\left(\\ln \\left(9\\right)\\right)\\left(\\sum _{i=3}^6\\right)\\left(i^2\\right)sin\\left(2\\right)}{\\left(5a^q\\left(34\\cdot 5^3+3^2\\right)\\sqrt[3^9]{27^5}\\log _{10}\\left(1000\\right)\\cdot 4\\left(3\\cdot 5^{6^7}\\sqrt[3]{27}\\log _{10}\\left(1000\\right)\\right)5\\ln \\left(9\\right)\\ln \\left(9\\right)\\sum _{i=3}^6\\left(i^2\\right)tan\\left(2\\right)\\right)}\\right)`

let parExp = ``

let nthrt = `\\sqrt[1+3-5^5]{\\frac{\\left(4+\\log _{10}\\left(1000\\right)\\right)^5-\\left(7^3\\right)\\cdot \\frac{8^5}{3}}{5-\\sum _{i=3}^6\\left(i^2\\right)}\\cdot \\cos \\left(2\\right)-\\log _{10}\\left(1000\\right)\\left(\\ln \\left(2\\right)\\right)}`

let pow = `2^{3=4-5\\cdot \\frac{7}{3}\\left(3\\right)\\left(\\sqrt[3]{27-5^2}\\right)\\log _{10}\\left(1000\\right)\\cos \\left(2\\right)\\left(\\ln \\left(10\\right)\\right)\\left(\\sum _{i=3}^6\\left(i^2\\right)\\right)}`

let log = `\\log _{3+4-5\\cdot \\frac{7}{3}\\left(3\\right)\\left(\\sqrt[3]{27-5^2}\\right)\\log _{10}\\left(1000\\right)\\cos \\left(2\\right)\\left(\\ln \\left(10\\right)\\right)\\left(\\sum _{i=3}^6\\left(i^2\\right)\\right)}\\left(3+4-5\\cdot \\frac{7}{3}\\left(3\\right)\\left(\\sqrt[3]{27-5^2}\\right)\\log _{10}\\left(1000\\right)\\cos \\left(2\\right)\\left(\\ln \\left(10\\right)\\right)\\left(\\sum _{i=3}^6\\left(i^2\\right)\\right)\\right)`
  

  
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

const processPars = (str) => {
  str = str.replace('\\left(', '(')
  str = str.replace('\\right)', ')')
  if (str.includes('\\left(') || str.includes('\\right)')) {
    str = processPars(str)
  }
  return str
}

const processArith = (str) => {
  str = str.replace('\\cdot', '*')
  str = str.replace('\\cdot ', '*')
  str = str.replace('\\div', '/')
  str = str.replace('\\div ', '/')

  if (str.includes('\\cdot')) {
    str = processArith(str)
  }
  return str
}

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
  refs[`||${order}||`] = processArith(match)

  const pos = strWithRef.search(processArithPatt)
  
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

let trig = ['sin', 'cos', 'tan', 'cot', 'csc', 'sec']

trigPatt = (op) => {
  let template = `\\${op}\\s\\left\((\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\\right\)`
  return new RegExp(template, 'g')
}


const patterns = [
    {
      pattern: /(\\left\()*(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)*(\\right\)|\\left\()*((\+|\-|\\cdot\s|\\cdot)*(\\left\()*(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)*(\\right\))*)*/g,
      name: 'arith',
      disqualifiers: ['frac']
    },
    {
      pattern: /\\frac\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}/g,
      name: 'simpFrac'
    },
    {
      pattern: /\\sqrt\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}/g,
      name: 'simpSqrt'
    },
    {
      pattern: /\\sqrt\[(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\]\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}/g,
      name: 'simpNthrt'
    },
    {
      pattern: /\^\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\^(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}/g,
      name: 'compPow'
    },
    {
      pattern: /(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\^(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)/g,
      name: 'simpPow'
    },
    {
      pattern: /\\log\s\_(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\\left\((\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\\right\)/g,
      name: 'simpLog'
    },
    {
      pattern: /\\ln\s\\left\((\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\\right\)/g,
      name: 'simpLn'
    },
    {
      pattern: /\\sum\s\_\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)((\=)(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|))?\}\^(\{\\infty\s\}|(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)(\\left\(){1,}(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)*(\\right\)|\\left\()*((\+|\-|\\cdot\s|\\cdot)*(\\left\()*(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)*(\\right\))*)*\\right\))/g,
      name: 'sum'
    },
    {
      pattern: trigPatt('sin'),
      name: 'sin'
    },
    {
      pattern: trigPatt('cos'),
      name: 'cos'
    },
    {
      pattern: trigPatt('tan'),
      name: 'tan'
    },
    {
      pattern: trigPatt('cot'),
      name: 'cot'
    },
    {
      pattern: trigPatt('csc'),
      name: 'csc'
    },
    {
      pattern: trigPatt('sec'),
      name: 'sec'
    }
  ]
  // currently there are >> 15 << patterns.  Please update every time you add another pattern.

const searchStrForPattern = (str, arrOfPattObjByIndex) => {
  let patt = arrOfPattObjByIndex.pattern
  let disq = arrOfPattObjByIndex.disqualifiers
  for (let i=0; i<str.length; i++) {
     let patternPosition = str.search(patt)

    if (patternPosition > -1) {
      let checkedSection = str.slice(i)
      let matchArr      = patt.exec(checkedSection)
      let patternStr    = matchArr[0]
      console.log('patternStr = ', patternStr)
      let disqualified = false

      for (let k=0; k<patternStr.length; k++) {
        if (patternStr.includes(disq[k])) {
          disqualified = true
        }
      }

      if (patternStr && !disqualified) {
        return patternStr
      } 
    } else {
      return false
    }
  } 
}

const isKeyValueObject = (obj) => {
  let res = false
  obj.test = ''
  if (obj.hasOwnProperty('test') && !Array.isArray(obj)) {
    res = true
    delete obj.test
  }
  return res
}

const findUnnestedExp = (input) => {
  // input is composed of 4 properties: 
  let str = input.str // (1) string to be processed and also updated
  let checkStep = input.checkStep ? input.checkStep : 0 // (2) checkStep correlates to pattern string is checked against
  let refs = input.refs && isKeyValueObject(input.refs) ? {...input.refs} : {}  // (3) the refs object contains every subchild
  let order = input.order ? input.order : 0 // (4) each subchild is stored as a prop ID'ed by order in the refs object


  let currentPattern = patterns[checkStep].pattern
  let res = ''
  let patternPosition = str.search(currentPattern)
  let patternStr = ''

  if (patternPosition > -1) {
    

    patternStr    = searchStrForPattern(str, patterns[checkStep])
    
    let strWithRef = str.replace(patternStr, `||${order}||`) // update (1) string
                                                             // checkstep (2) is updated by recursively calling findUnnestedExp (see below)
    let processedStr = processPars(processArith(patternStr))
    refs[`||${order}||`] = processedStr                     // update (3) refs
    order++                                                  // update (4) order
    
    input = { 
      str: strWithRef,
      checkStep,
      order,
      refs
    }

    console.log(`\n\n str = ${str}, \n\n strWithRef = ${strWithRef}, \n\n checkStep = ${checkStep}, \n\n order = ${order}, \n\n refs = ${JSON.stringify(refs)}\n`)

    if (order < 5) {
      res = findUnnestedExp(input)
    } else {
      res = {...input}
    }
 
  } else if (patternPosition == -1 && checkStep < 14) {
    input.checkStep++ // update (2) checkStep
    if (order < 5) {
      res = findUnnestedExp(input)
    } else {
      res = {...input}
    }
  }

  return res

} // END findUnnestedExp



let input = {
  str: fs
}

let res = findUnnestedExp(input)
console.log('result = ', JSON.stringify(res))

let p1 = `1^{2^{3^{4^{5^{6^7}}}}}`
let p2 = `||1||^{||2||^{||3||^{||4||^{||5||^{||6||^||7||}}}}}`
// 7
let lg1 = `\\log _2\\left(4\\right)`
let lg2 = `\\log _||2||\\left(||4||\\right)`
// 8
let ln1 = `\\ln \\left(2\\right)`
let ln2 = `\\ln \\left(||2||\\right)`
// 9
let sm1 = `\\sum _{i=3}^6\\left(1-i+22\\left(\\left(3\\cdot i+43-g\\left(5\\right)\\right)\\left(ad\\right)\\right)64-\\left(i\\right)7\\left(i\\right)\\right)`
let sm2 = `\\sum _{i}^6\\left(1-i+22\\left(\\left(3\\cdot i+43-g\\left(5\\right)\\right)\\left(ad\\right)\\right)64-\\left(i\\right)7\\left(i\\right)\\right)`
let sm3 = `\\sum _{i=||3||}^||6||\\left(||1||-||2||+||3||\\left(\\left(||4||\\cdot ||5||+||6||-||7||\\left(||8||\\right)\\right)\\left(||9||\\right)\\right)||10||-\\left(||11||\\right)||12||\\left(||13||\\right)\\right)`
let sm4 = `\\sum _{||3||}^||6||\\left(||1||-||2||+||3||\\left(\\left(||4||\\cdot ||5||+||6||-||7||\\left(||8||\\right)\\right)\\left(||9||\\right)\\right)||10||-\\left(||11||\\right)||12||\\left(||13||\\right)\\right)`
let sm5 = `\\sum _{n=0}^{\\infty }`

// 10
let sin1 = '\\sin \\left(5\\right)'
let cos1 = '\\cos \\left(5\\right)'
let tan1 = '\\tan \\left(5\\right)'
let cot1 = '\\cot \\left(5\\right)'
let csc1 = '\\csc \\left(5\\right)'
let sec1 = '\\sec \\left(5\\right)'

let sin2 = '\\sin \\left(||5||\\right)'
let cos2 = '\\cos \\left(||5||\\right)'
let tan2 = '\\tan \\left(||5||\\right)'
let cot2 = '\\cot \\left(||5||\\right)'
let csc2 = '\\csc \\left(||5||\\right)'
let sec2 = '\\sec \\left(||5||\\right)'
