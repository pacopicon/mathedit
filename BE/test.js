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


const sepByEq = (str, _output) => {
// (1) splitting into left and right of eq sign 
  const output = _output ? _output : []
  const equal = /\=/g
  const eqPos = str.search(equal)
  let leftExpression = ''
  let rightExpression = ''

  if (eqPos == -1) {
    leftExpression = str
    output.push(leftExpression)
  } else {
    leftExpression = str.slice(0, eqPos)
    rightExpression = str.slice(eqPos+1, str.length)
    output.push(leftExpression)
    sepByEq(rightExpression, output)
  }
  return output
}

// let init = sepByEq(str)[0]
// let mid = sepByEq(str)[1]
// let last = sepByEq(str)[2]

const isObjEmpty = (obj) => {
  let result = true
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      result = false
    }
  }
  return result
}

const spliceStr = (str, i, numToReplace, newStr) => {
  let strArr = str.split('')
  strArr.splice(i, numToReplace, newStr)
  return strArr.join('') 
}
  
const POW = '^'
const ADD = '+'
const SUB = '-'
const MUL = '*'
const OP_PO = '^{'
const CLO_BR = '}'
const OP_NUM = '\\frac{'
const NUM_DEN = '}{'
const OP_PAR = '\\left('
const CLO_PAR = '\\right)'
const NUM = {
  name: 'num',
  OPEN: OP_NUM,
  CLOSE: NUM_DEN,
  braceWidth: 6
}
const DENOM = {
  name: 'denom',
  OPEN: NUM_DEN,
  CLOSE: CLO_BR,
  CLOSE_PATT: /\}(?!\{)/g,
  braceWidth: 2
}
const FRAC = {
  name: 'frac',
  OPEN: NUM.OPEN,
  CLOSE: DENOM.CLOSE,
  braceWidth: 6
}
const POWER = {
  name: 'power',
  OPEN: OP_PO,
  CLOSE: CLO_BR,
  operator: POW,
  braceWidth: 2
}
const P_SES = {
  name: 'parentheses',
  OPEN: OP_PAR,
  CLOSE: CLO_PAR,
  braceWidth: 6
}

const indexOfPattern = (str, patt, matches) => {
  let match = patt.exec(str)
  if (match != null) {
    matches.push(match.index)
  } else {
    matches.push(-1)
  }
  return matches[0]
}

const negLookAheadBoolean = (i, str, pos, neg) => {
  let boolean = false
  let query = str.substr(i, pos.length)
  let avoid = str.substr(i, neg.length)
  if (query == pos && avoid != neg) {
    boolean = true
  } 
  return boolean
}

const negLookAhead = (str, pos, neg) => {
  for (let i = 0; i<str.length; i++) {
    let query = str.substr(i, pos.length)
    let avoid = str.substr(i, neg.length)
    if (query == pos && avoid != neg) {
      return i
    }
  }
}

// const patt = /\\frac\{((\d+(\^|\+|\*|\-|\*\*)|)(\d+(\^|\+|\*|\-|\*\*)\(\d+(\^|\+|\*|\-|\*\*)\d+\)|\|\|\d\|\|)|(\d))\}\{(?!\\frac\{)/g

const doesUnnestedFracExist = (str) => {
  return patt.test(str)
}

const getIdxOfNestedNum = (str, i, order) => {
  let output = ''
  const patt = /\\frac\{((\d+(\^|\+|\*|\-|\*\*)|)(\d+(\^|\+|\*|\-|\*\*)\(\d+(\^|\+|\*|\-|\*\*)\d+\)|\|\|\d\|\|)|(\d))\}\{(?!\\frac\{)/g
  let match = patt.exec(str)
  // console.log(`\nINSIDE getIdxOfNestedNum =======================>>>\n|str = ${str}\n|order = ${order}\n|match = ${match}\n|match.index = ${match.index}\nINSIDE getIdxOfNestedNum =======================>>>`)
  if (i => 0) {
    output = match.index == i
  } else {
    output = match.index
  }
  return output
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log(`\nINIT => str = ${fracStr3} \n`)
const orderOperations = (verbose, stop, str, _enclosure, _order, _ltxOutput, _jsOutput, _hasJSpars, specialIdx) => {

  // console.log(`SPOT\nstr = ${str}\n_enclosure = ${JSON.stringify(_enclosure)}\n_order = ${_order}\n_ltxOutput = ${JSON.stringify(_ltxOutput)}\n_jsOutput = ${JSON.stringify(_jsOutput)}\n_hasJSpars = ${_hasJSpars}\nspecialIdx = ${specialIdx}\n`)
 
  let ltxOutput = _ltxOutput ? {..._ltxOutput} : {}
  let order = _order ? _order : 0
  let jsOutput = _jsOutput ? _jsOutput : {}
  let enclosure = _enclosure
  let hasJSpars = _hasJSpars ? _hasJSpars : false

  // if (verbose) {
  //   console.log(`\nENTERING orderOperations============================>>> \n|order = ${order}\n|str = ${str} \nENTERING orderOperations============================>>>`)
  // }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
if (order < stop) { 
  // Private functions called inside the loop:

  // (1): power operator snipper:

  const searchAndReplaceSimplePair = (i, str, enclosure, order, ltxOutput, jsOutput, verbose, stop, iOfNxtOP, strAfterOpen) => {
    
    let encName = enclosure.name
    let indexOfSnip = i
    // let indexOfNextCLOSE = str.indexOf(enclosure.CLOSE)
    // let indexOfNextCLOSE = encName == NUM.name ? negLookAhead(str, '}', '}{') : str.indexOf(CLOSE)
    let indexOfNextCLOSE = encName == NUM.name ? negLookAhead(str, '}', '}{') : strAfterOpen.indexOf(CLOSE) + indexOfSnip
    let snip = str.slice(indexOfSnip, indexOfNextCLOSE)
    let begStr = ''
    let endStr = ''
    let iOfShortStr = str.indexOf(strAfterOpen) // unneeded.  Also erase in console.log entitled INSIDE searchAndReplaceSimplePair 

    if (encName == P_SES.name) {
      begStr = str.slice(0, indexOfSnip-6)
      endStr = str.slice(indexOfNextCLOSE+7)
    } else if (encName == POWER.name) {
      begStr = str.slice(0, indexOfSnip-1)
      endStr = str.slice(indexOfNextCLOSE+1)
    } else if (encName == NUM.name) {
      begStr = str.slice(0, indexOfSnip-6)
      endStr = str.slice(indexOfNextCLOSE+1)
      snip = snip.replace('}{', '/')
    }

    let group = `||${order}||`
    let newStr = begStr + group + endStr
    ltxOutput[group] = snip
    let last = snip.length - 1
    let expression = ''

    if (snip[0] != '(' && snip[last] != ')') {
      expression = `(${snip})`
    } else {
      expression = snip
    }

    // console.log(`expression = ${expression}`)    

    // if (verbose) { 
    //   console.log(`SNIP=========================================\n|snip = ${snip}\n|snip[0] = ${snip[0]}\n|snip[last] = ${snip[last]}\n|order = ${order}\n|encName = ${encName}\nSNIP=========================================`)
    // }

    jsOutput[group] = expression

    if (verbose) {
      console.log(`\nINSIDE searchAndReplaceSimplePair============================>>>\n|snip = ${snip} \n|iOfShortStr = ${iOfShortStr} \n|in_str = ${str} \n|indexOfSnip = ${indexOfSnip} \n|iOfNxtOP = ${iOfNxtOP} \n|indexOfNextCLOSE = ${indexOfNextCLOSE} \n|strAfterOpen = ${strAfterOpen} \n|str.slice(indexOfSnip) = ${str.slice(indexOfSnip)} \n|str.slice(indexOfNextCLOSE) = ${str.slice(indexOfNextCLOSE)} \n|out_str = ${newStr} \n|jsOutput = ${JSON.stringify(jsOutput)} \n|expression = ${expression} \n|order = ${order} \n|encName = ${encName} \nINSIDE searchAndReplaceSimplePair============================>>>`)
    }

    order++

    const limit = 20

    if (order > limit) {
      console.log(`LIMIT OF ${limit} REACHED, RETURNING`)
      return {
        order,
        ltxOutput,
        jsOutput,
        str: newStr,
        verbose,
        stop
      }
    } else {
      let res = orderOperations(verbose, stop, newStr, enclosure, order, ltxOutput, jsOutput, hasJSpars)
      order = res.order
      ltxOutput = {...res.ltxOutput}
      jsOutput = {...res.jsOutput}
      newStr = res.str
      stop = res.stop

      // if (verbose) {
      //   console.log(`\nAfter orderOperations call => \norder = ${order}, \nnewStr = ${newStr}, \nltxOutput = ${JSON.stringify(ltxOutput)}, \njsOutput = ${JSON.stringify(jsOutput)}, \nenclosure.name = ${enclosure.name} \n<<END searchAndReplaceSimplePair>>`)
      // }

      return {
        order,
        ltxOutput,
        jsOutput,
        str: newStr,
        verbose,
        stop
      }
    
    }

    
  } // END searchAndReplaceSimplePair

  let encName = enclosure.name
  let OPEN = enclosure.OPEN
  let CLOSE = enclosure.CLOSE
  let operator = enclosure.operator
  let braceWidth = enclosure.braceWidth

  // if (verbose) {
  //   console.log(`\n<<BEFORE LOOP>>\nstr = ${str}, \nOPEN = ${OPEN}, \nCLOSE = ${CLOSE}, \nstr has OPEN AND CLOSE? => ${str.includes(OPEN) && str.includes(CLOSE)}, \norder = ${order}, \nencName = ${encName}`)
  // }

  // if (verbose) {
  //   console.log(`\nBEFORE CONDITIONAL============================>>> \n|order = ${order}\n|str = ${str}\n|str.includes(OPEN) && str.includes(CLOSE) = ${str.includes(OPEN) && str.includes(CLOSE)} \nBEFORE CONDITIONAL============================>>>`)
  // }

  if (str.includes(OPEN) && str.includes(CLOSE)) {

    for (let i=0; i<str.length; i++) {
      // if (verbose) {
      //   console.log(`\nINSIDE CONDITIONAL no 1 ============================>>> \n|order = ${order}\n|str = ${str}\n|encName = ${encName} \nINSIDE CONDITIONAL no 1 ============================>>>`)
      // }

      let condition = '' 
      
      if (encName == NUM.name) { 
        condition = getIdxOfNestedNum(str, i, order) // looking for the beginning of a non-nested numerator
        // if (verbose) {
        //   console.log(`\nINSIDE CONDITIONAL no 2 ============================>>> \n|order = ${order}\n|str = ${str}\n|getIdxOfNestedNum(str, i, order) = ${getIdxOfNestedNum(str, i, order)} \nINSIDE CONDITIONAL no 2 ============================>>>`)
        // }
      } else {
        condition = str.substr(i, braceWidth) == OPEN
      }   

      if (condition) {
        let startIdx = i
        let currIdx = startIdx + braceWidth
        i += braceWidth // fast-forward to index after opening power brace
        let strAfterOpen = str.slice(currIdx)
        // let iOfNxtOP = strAfterOpen.indexOf(OPEN)
        let iOfNxtOP = encName == NUM.name ? negLookAhead(strAfterOpen, '\\frac{', '\\frac{\\frac{') : strAfterOpen.indexOf(OPEN)
        let indexOfNextCLOSE = encName == NUM.name ? negLookAhead(strAfterOpen, '}', '}{') : strAfterOpen.indexOf(CLOSE)

        // if (verbose) {
        //   console.log(`\n<1--INDEX MONITOR>\niOfNxtOP = ${iOfNxtOP}, \nindexOfNextCLOSE = ${indexOfNextCLOSE}, \n-->str = ${str}, \n\n-->strAfterOpen = ${strAfterOpen}, \norder = ${order} \n<1--INDEX MONITOR>`)
        // }
        
        if (iOfNxtOP < indexOfNextCLOSE && iOfNxtOP != -1) {
    
          continue
          
        } else if (typeof iOfNxtOP == 'undefined' || iOfNxtOP == -1 || iOfNxtOP > indexOfNextCLOSE) {
          // if (verbose) {
          //   console.log(`\n<2--INDEX MONITOR>\niOfNxtOP = ${iOfNxtOP}, \nindexOfNextCLOSE = ${indexOfNextCLOSE}, \n-->str = ${str}, \n\n-->strAfterOpen = ${strAfterOpen}, \norder = ${order} \<2--INDEX MONITOR>`)
          // }

          let res = ''
          if (encName == POWER.name) {
            
          }
          if (encName == P_SES.name || encName == POWER.name || encName == NUM.name) {
            res = searchAndReplaceSimplePair(i, str, enclosure, order, ltxOutput, jsOutput, verbose, stop, iOfNxtOP, strAfterOpen)
          }
          let beforeStr = str
          let beforeLtxOutput = {...res.ltxOutput}
          let beforeJsOutput = {...res.jsOutput}

          order = res.order
          ltxOutput = {...res.ltxOutput}
          jsOutput = {...res.jsOutput}
          str = res.str
          verbose = res.verbose
          stop = res.stop

          order = res.order
          ltxOutput = {...res.ltxOutput}
          jsOutput = {...res.jsOutput}
          str = res.str
          verbose = res.verbose
          stop = res.stop

          if (order > 15) {
            return {
              ltxOutput,
              jsOutput,
              order,
              enclosure,
              str,
              hasJSpars,
              verbose,
              stop
            }
          }
        } else {
          return 'Number of opening power braces does not match the number of closing braces'
        }
      } else {
        // the enclosure here should be switched
        // the return below is only for testing
        // return output
        
      }
    }
  } else if (!hasJSpars) {
    group = `||${order}||`
    ltxOutput[group] = str

    let exp = ''
    let last = str.length - 1
    if (str[0] == '(' && str[last] == ')') {
      exp = str
    } else {
      exp = `(${str})`
    }
    
    jsOutput[group] = exp
    // if (verbose) {
      console.log(`\nINSIDE hasJSpars CONDITION============================>>> \n|enclosure.name = ${enclosure.name} \n|str = ${str} \n|order = ${order} \n|exp = ${exp} \n|ltxOutput = ${JSON.stringify(ltxOutput)} \n|jsOutput = ${JSON.stringify(jsOutput)} \nINSIDE hasJSpars CONDITION============================>>>`)
    // }
    hasJSpars = true
    
  }
    
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////
} 

  return {
    ltxOutput,
    jsOutput,
    order,
    enclosure,
    str,
    hasJSpars,
    verbose,
    stop
  }
} // END OF orderOperations


const shouldTrimPars = (_str) => {
  let last = _str.length - 1
  let str = _str
  if (_str[0] == '(' && _str[last] == ')') {
    str = _str.slice(1, last)
  } else {
    return false
  }
  const openArr = []
  const closeArr = []

  for (let i=0; i<str.length; i++) {
    if (str[i] == '(') {
      openArr.push(i)
    } else if (str[i] == ')') {
      closeArr.push(i)
    }
  }
  if (openArr.length != closeArr.length) {
    return false
  }
  for (let k=0; k<openArr.length; k++) {
    if (openArr[k] > closeArr[k]) {
      return false
    }
  }
  return true
}

const trim = (str, count) => {
  let output = ''
  let last = str.length - 1
  if (!shouldTrimPars(str)) {
    output = str
  } else if (shouldTrimPars(str)) {
    let newStr = str.slice(1, last)
    output = trim(newStr, count+1)
  }
  return output
}

const trim2 = (str, count) => {
  let output = ''
  let last = str.length - 1
  if (!shouldTrimPars(str)) {
    output = str
  } else if (shouldTrimPars(str)) {
    let newStr = str.slice(1, last)
    output = trim(newStr, count+1)
  }
  return output
}

const trimDoubledPars = (str) => {
  let arr = str.match(/\(|\)/g)
  let par2 = arr[1]
  let penultPar = arr[arr.length-2]
  let last = str.length - 1
  if (str[0] == '(' && str[last] == ')' && par2 != ')' && penultPar != '(') {
    str = str.slice(1, last)
    str = trimDoubledPars(str)
  }
  return str
}

const parsIntoMult = (str) => {
  for (let i=1; i<str.length; i++) {
    let befCurrIdx = str.substr(i-1,1)
    let thisIdx = str.substr(i,1)
    if (befCurrIdx != '{' && befCurrIdx != '/' && befCurrIdx != '*' && befCurrIdx != '(' && thisIdx == '(') {
      str = spliceStr(str, i, 1, '*(')
    }
  }
  for (let i=0; i<str.length; i++) {
    let last = str.length-1
    thisIdx = str.substr(i,1)
    let nextIdx = str.substr(i+1,1)
    if (thisIdx == '}' && thisIdx == ')' && i != last && nextIdx != '*' && nextIdx != ')') {
      str = spliceStr(str, i, 1, ')*')
    }
  }
  return str
}

const insertPower = (str) => {
  for (let i=1; i<str.length; i++) {
    if (str[i] == '^') {
      str = spliceStr(str, i, 1, '**')
    }
  }
  return str
}

const nestProps = (_jsStr, i, jsOutput) => {
  
  jsStr = _jsStr ? _jsStr : jsOutput[`||${i}||`]

  if (jsStr.includes('||') && i > -1) {
    let pos = jsStr.indexOf('||') + 2
    let num = jsStr[pos]

    jsStr = jsStr.replace(/\|\|\d\|\|/, jsOutput[`||${num}||`])
  
    nestProps(jsStr, i-1, jsOutput)
  }
  
  return jsStr
}

const processStr = (_str, enclosure, verbose, stop) => {

  let res = orderOperations(verbose, stop, _str, enclosure)

  let ltxOutput = ''
  let jsOutput = ''
  let order = ''
  let str = ''

  if (enclosure.name != 'num' && res.str.includes('frac')) {
    ltxOutput = {...res.ltxOutput}
    jsOutput  = {...res.jsOutput}
    order     = res.order
    str       = res.str
    res       = orderOperations(verbose, stop, str, NUM, order, ltxOutput, jsOutput)
  }

  console.log(`res = ${JSON.stringify(res)}`)
  
  // console.log('<<AFTER orderOperations>>\n')
  // console.log(JSON.stringify(res))
  // console.log('\n<<AFTER orderOperations>>\n')
  ltxOutput = res.ltxOutput
  jsOutput = res.jsOutput
  ltxKeys = Object.keys(ltxOutput)
  jsKeys = Object.keys(jsOutput)
  keyLen = ltxKeys.length
  // VARS FOR TESTING ONLY, ERASE OR COMMENT OUT AFTER TESTING
  verbose = res.verbose
  // let stop = res.stop

  // let rest = {
  //   ltxOutput,
  //   jsOutput
  // } // this is not used yet

  if (keyLen != jsKeys.length) {
    return 'the number of latex properties does not match the number of js properties'
  }
  str = ''
  str = nestProps(str, keyLen-1, jsOutput)

  // if (str.includes('/') && verbose) {
  //   console.log(`INSIDE processStr===================\nstr = ${str}\nINSIDE processStr===================`)
  // }

  // str = trimDoubledPars(str)
  str = trim(str)

  return str

}

const mathObjIntoStr = (verbose, stop, latexStr) => {
  let jsStr = ''
  jsStr = processStr(latexStr, POWER, verbose, stop)
  if (verbose) {
    console.log(`\nINSIDE mathObjIntoStr=========== \n|jsStr after POWER, before NUM = ${jsStr}`)
  }
  jsStr = processStr(jsStr, P_SES, verbose, stop)
  // jsStr = processStr(jsStr, NUM, verbose, stop)  
  jsStr = insertPower(jsStr)
  jsStr = parsIntoMult(jsStr)
  return jsStr
}

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