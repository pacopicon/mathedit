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

let str1 = '\frac{ab}{\frac{cd}{\frac{ef}{\frac{gh}{ij}}}}'
let str2 = '\left(a\left(b\left(c\left(d\left(e\left(f\right)\right)\right)\right)\right)\right)'
let str3 = '1^{2^{3^{4^5}}}'

let str4 = 'f_1=\\left(F_t-F_0\\right)d\\left(t,T\\right)=\\frac{S_t\\left(1+\\frac{r_t}{n}\\right)^{n\\left(T-t\\right)}-S_0\\left(1+\\frac{r_0}{n}\\right)^{nT}}{\\left(1+\\frac{r}{n}\\right)^{n\\left(T-t\\right)}}'

let str5 = '5^3\\left(23-\\left(\\frac{\\left(3^7\\left(\\frac{1}{2}\\right)^{\\frac{3}{4}}\\right)\\log8 }{\\sqrt9 }\\right)-6\\right)'

let str6 = '\\frac{\\frac{1}{4^{8^9}}\\cdot \\frac{5}{5^{\\frac{7^{\\frac{7}{4}}}{8}}}}{\\frac{4}{\\frac{5}{6}}}'

let str7 = 'x=\frac{-b\pm \sqrt{\left(b^2-4ac\right)}}{2a}'

let res = findSmallestChild(str3, str3, 'power')

writeLog('res = ', res)
