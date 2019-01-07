const { writeLog } = require('./utils')

const fsc = (str, _enclosure, _order, _output) => {

  const w = (i, num) => {
    let word = ''
    for (let k=0; k<num; k++) {
      word += str[i+k]
    }
      return word
  }

  const OP_PO = '^{'
  const CLO_BR = '}'
  const OP_DEN = '\\frac{'
  const CLO_DEN_OP_NUM = '}{'
  const OP_PAR = '\\left('
  const CLO_PAR = '\\right)'
  const DENOM = 'denom'
  const NUM = 'num'
  const POWER = 'power'
  const P_SES = 'parentheses'

  let enclosures = [P_SES, DENOM, NUM, POWER]

  let output = _output ? {..._output} : {}
  let order = _order ? _order : 0

  if (order == 10) {
    return {
      output,
      str
    }
  }
  
  let last = enclosures.length-1
  let enclosure = _enclosure ? _enclosure : enclosures[last]
  // (str, _enclosure, _order, _output)
  // console.log('str = ', str)
  for (let i=0; i<str.length; i++) {
    if (enclosure == POWER) {
      // console.log(`str = ${str}, enclosure = ${enclosure}, order = ${order}, output = ${JSON.stringify(output)} `)
      // console.log('i = ', i)
      if (w(i,2) == OP_PO) {
        let currIdx = i+2
        i+=2 // fast-forward to index after opening power brace
        let newStr = str.slice(currIdx)
        let iOfnxtOP = newStr.indexOf(OP_PO)
        let iOfnxtCL = newStr.indexOf(CLO_BR)
        
        if (iOfnxtOP < iOfnxtCL && iOfnxtOP != -1) {
          continue
        } else if (iOfnxtOP == -1 || iOfnxtOP > iOfnxtCL) {
          let snipIdx = i
          let iOfnxtCL = str.indexOf(CLO_BR)
          let snip = str.slice(snipIdx, iOfnxtCL)
          let begStr = str.slice(0, snipIdx-1)
          let endStr = str.slice(iOfnxtCL+1)
          let group = `||${order}||`
          newStr = begStr + group + endStr
          output[group] = snip
          order++
          console.log(`iOfnxtCL = ${iOfnxtCL}, snipIdx = ${snipIdx}, str = ${str}, snip = ${snip}, begStr = ${begStr}, endStr = ${endStr}, newStr = ${newStr} `)
          fsc(newStr, POWER, order, output)
        } else {
          return 'Number of opening power braces does not match the number of closing braces'
        }
      } else {
        // the enclosure here should be switched
        // the return below is only for testing
        // return {
        //   output,
        //   str
        // } 
      }
    } else if (enclosure == DENOM) {

      if (w(i,6) == OP_DEN) {

      } else if (w(i,2) == CLO_DEN_OP_NUM) {

      } 
    } else if (enclosure == NUM) {
      if (w(i,2) == CLO_DEN_OP_NUM) {

      } else if (w(i,1) == CLO_BR && w(i,2) != CLO_DEN_OP_NUM) {

      }
    } else if (enclosure == P_SES) {

    } else {
      // enclosures.pop()
      return
    }
  }
  return {
    output,
    str
  }
}

let str1 = '\\frac{\\frac{1}{\\frac{2}{\\frac{3}{\\frac{4}{5}}}}}{\\frac{6}{\\frac{7}{\\frac{8}{\\frac{9}{10}}}}}'
let strA = '\\frac{ \\frac{1}{2}}  {\\frac{3}{4} }'
let str2 = '\left(a\left(b\left(c\left(d\left(e\left(f\right)\right)\right)\right)\right)\right)'
let str3 = '1^{2^{3^{4^5}}}'

let str4 = 'f_1=\\left(F_t-F_0\\right)d\\left(t,T\\right)=\\frac{S_t\\left(1+\\frac{r_t}{n}\\right)^{n\\left(T-t\\right)}-S_0\\left(1+\\frac{r_0}{n}\\right)^{nT}}{\\left(1+\\frac{r}{n}\\right)^{n\\left(T-t\\right)}}'

let str5 = '5^3\\left(23-\\left(\\frac{\\left(3^7\\left(\\frac{1}{2}\\right)^{\\frac{3}{4}}\\right)\\log8 }{\\sqrt9 }\\right)-6\\right)'

let str6 = '\\frac{\\frac{1}{4^{8^9}}\\cdot \\frac{5}{5^{\\frac{7^{\\frac{7}{4}}}{8}}}}{\\frac{4}{\\frac{5}{6}}}'

let str7 = 'x=\frac{-b\pm \sqrt{\left(b^2-4ac\right)}}{2a}'

// let res = findSmallestChild(str3, str3, 'power')

console.log( Math.pow(3,999) )

// writeLog('res = ', res)


const orderOperations = (str, _enclosure, _order, _ltxOutput, _jsOutput, specialIdx) => {
  const w = (i, num) => {
    let word = ''
    for (let k=0; k<num; k++) {
      word += str[i+k]
    }
      return word
  }
  const POW = '^'
  const ADD = '+'
  const SUB = '-'
  const MUL = '*'
  const OP_PO = '^{'
  const CLO_BR = '}'
  const OP_DEN = '\\frac{'
  const DEN_NUM = '}{'
  const OP_PAR = '\\left('
  const CLO_PAR = '\\right)'
  const DENOM = 'denom'
  const NUM = 'num'
  const POWER = 'power'
  const P_SES = 'parentheses'

  let enclosures = [P_SES, DENOM, NUM, POWER]
  let ltxOutput = _ltxOutput ? {..._ltxOutput} : {}
  let order = _order ? _order : 0
  let jsOutput = _jsOutput ? _jsOutput : {}
  let last = enclosures.length-1
  let enclosure = _enclosure ? _enclosure : enclosures[last]

  // Private functions called inside the loop:

  // (1): power operator snipper:
  const replaceOperatorSymbol = (ltxOp, snip) => {
    let operator = ''
    if (ltxOp == POW) {
      operator = '**'
    }

    let iOfLtxOp = snip.indexOf(ltxOp)
    let primary = snip.slice(0, iOfLtxOp)
    let secondary = snip.slice(iOfLtxOp+1)
    let expression = `(${primary}${operator}${secondary})`
    return expression
  }

  const searchAndReplaceSimplePair = (i, str, CLOSE, enclosure, order, ltxOutput, jsOutput, operator) => {

    let snipInitIdx = i
    let iOfNxtCL = str.indexOf(CLOSE)
    let snip = str.slice(snipInitIdx, iOfNxtCL)
    let begStr = str.slice(0, snipInitIdx-1)
    let endStr = str.slice(iOfNxtCL+1)
    let group = `||${order}||`
    newStr = begStr + group + endStr
    ltxOutput[group] = snip
    // Replacing Operator
    let expression = replaceOperatorSymbol(operator, snip)
    jsOutput[group] = expression
    // 
    order++

    if (!(newStr.includes(CLOSE))) {
      group = `||${order}||`
      ltxOutput[group] = newStr
      if (newStr.includes(operator)) {
        // Replacing Operator
        let expression = replaceOperatorSymbol(operator, newStr)
        jsOutput[group] = expression
        //
      }
    }
    
    let res = orderOperations(newStr, enclosure, order, ltxOutput, jsOutput)
    ltxOutput = {...res.ltxOutput}
    jsOutput = {...res.jsOutput}

    return {
      order,
      ltxOutput,
      jsOutput
    }
  }

  for (let i=0; i<str.length; i++) {
    let OPEN = ''
    let CLOSE = ''
    let operator = ''
    let braceWidth = ''

    if (enclosure == POWER) {
      OPEN = OP_PO
      CLOSE = CLO_BR
      operator = POW
      braceWidth = 2
    } else if (enclosure == DENOM) {
      OPEN = OP_DEN
      CLOSE = CLO_BR
      // operator = DEN_NUM
      braceWidth = 6
    } else if (enclosure == NUM) {
      OPEN = DEN_NUM
      CLOSE = CLO_BR
      // operator = DEN_NUM
      braceWidth = 2
      
    if (w(i,braceWidth) == OPEN) {
      let startIdx = i
      let currIdx = i + braceWidth
      i += braceWidth // fast-forward to index after opening power brace
      let bracePairStr = str.slice(currIdx)
      let iOfNxtOP = bracePairStr.indexOf(OPEN)
      let iOfNxtCL = bracePairStr.indexOf(CLOSE)
      
      if (iOfNxtOP < iOfNxtCL && iOfNxtOP != -1) {
        continue
      } else if (iOfNxtOP == -1 || iOfNxtOP > iOfNxtCL) {
        let res = ''
        
        if (enclosure == DENOM) {
          res = orderOperations(str, NUM, order, ltxOutput, jsOutput, startIdx)
          ltxOutput = {...res.ltxOutput}
          jsOutput = {...res.jsOutput}
        } else if (enclosure == NUM) {
          res = searchAndReplaceSimplePair(i, str, CLOSE, enclosure, order, ltxOutput, jsOutput, operator)
        } else {
          res = searchAndReplaceSimplePair(i, str, CLOSE, enclosure, order, ltxOutput, jsOutput, operator)
        }

        order = res.order
        ltxOutput = {...res.ltxOutput}
        jsOutput = {...res.jsOutput}
      } else {
        return 'Number of opening power braces does not match the number of closing braces'
      }
    } else {
      // the enclosure here should be switched
      // the return below is only for testing
      // return output
    }
  }

  return {
    ltxOutput,
    jsOutput
  }
}

const mathObjIntoStr = (dualObj) => {
  const ltxOutput = dualObj.ltxOutput
  const jsOutput = dualObj.jsOutput
  const ltxKeys = Object.keys(ltxOutput)
  const jsKeys = Object.keys(jsOutput)
  const keyLen = ltxKeys.length

  if (keyLen != jsKeys.length) {
    return 'the number of latex properties does not match the number of js properties'
  }
  let jsStr = ''
  const nestProps = (_jsStr, i) => {
    jsStr = _jsStr ? _jsStr : jsOutput[`||${i}||`]
    // console.log(`i = ${i}, jsStr.includes('||') = ${jsStr.includes('||')}, jsStr = ${jsStr}`)
    if (jsStr.includes('||') && i > -1) {
      let pos = jsStr.indexOf('||') + 2
      let num = jsStr[pos]
      // console.log(`jsStr = ${jsStr}, pos = ${pos}, num = ${num}`)
      jsStr = jsStr.replace(/\|\|\d\|\|/, jsOutput[`||${num}||`])
      nestProps(jsStr, i-1)
    }
    return jsStr
  }

  jsStr = nestProps(jsStr, keyLen-1)
  // console.log('jsStr = ', jsStr)
  return jsStr
}

let o = orderOperations(str3, 'power')
let jsStr = mathObjIntoStr(o)

let res = eval(jsStr)