
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

const negLookAhead = (str, pos, neg) => {
  for (let i = 0; i<str.length; i++) {
    let query = str.substr(i, pos.length)
    let avoid = str.substr(i, neg.length)
    if (query == pos && avoid != neg) {
      return i
    }
  }
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

const doesUnnestedFracExist = (str) => {
  const patt = /\\frac\{((\d+(\^|\+|\*|\-|\*\*)|)(\d+(\^|\+|\*|\-|\*\*)\(\d+(\^|\+|\*|\-|\*\*)\d+\)|\|\|\d\|\|)|(\d))\}\{(?!\\frac\{)/g
  return patt.test(str)
}

const doesUnnestedPowerExist = (str) => {
  const patt = /\d+\^(?!\{)/g
  return patt.test(str)
}

const doesUnnestedParExist = (str) => {
  const patt = /\\frac\{((\d+(\^|\+|\*|\-|\*\*)|)(\d+(\^|\+|\*|\-|\*\*)\(\d+(\^|\+|\*|\-|\*\*)\d+\)|\|\|\d\|\|)|(\d))\}\{(?!\\frac\{)/g
  return patt.test(str)
}



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

// const trimDoubledPars = (str) => {
//   let arr = str.match(/\(|\)/g)
//   let par2 = arr[1]
//   let penultPar = arr[arr.length-2]
//   let last = str.length - 1
//   if (str[0] == '(' && str[last] == ')' && par2 != ')' && penultPar != '(') {
//     str = str.slice(1, last)
//     str = trimDoubledPars(str)
//   }
//   return str
// }

module.exports = {
  sepByEq,
  isObjEmpty,
  parsIntoMult,
  insertPower,
  negLookAhead,
  getIdxOfNestedNum,
  doesUnnestedFracExist,
  trim,
  nestProps
}