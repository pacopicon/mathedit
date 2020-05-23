var algebra = require('algebra.js');

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

const subLeadingOps = (_str) => {
  let str = _str
  str = str.replaceAll('\\cdot', '*')
  str = str.replaceAll('\\cdot ', '*')
  str = str.replaceAll('\\div', '/')
  str = str.replaceAll('\\div ', '/')
  str = str.replaceAll(' ', '')

  

  let leadingOp = ''
  if (str[0] == '*' || str[0] == '+' || str[0] == '-' || str[0] == '/') {
    leadingOp = str[0]
    str = str.replace(str[0], '')
  }

  return {
    leadingOp,
    latex: _str
  }
}

const spliceStr = (str, i, numToReplace, newStr) => {
  let strArr = str.split('')
  strArr.splice(i, numToReplace, newStr)
  return strArr.join('') 
}

exports.getAllMatchesAndPositions = (str, patt) => {
  let output = []
  while (match = patt.exec(str)) {
    let obj = {}
    obj.start = match.index
    obj.end   = patt.lastIndex
    obj.match = match[0]
    output.push(obj)
    // console.log(`\nmatch[0] = ${match[0]}\nstr.slice(start, obj.end) = ${str.slice(obj.start, obj.end)}\nobj.start = ${obj.start}\nobj.end = ${obj.end}\n`);
  }
  return output
}

exports.parsIntoMult = (str) => {
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

const isComputable = (numCandidate) => {
  let verdict = false
  if (typeof numCandidate == 'number' && !Number.isNaN(numCandidate)) {
    verdict = true
  }
  return verdict
}

const isAlgebraic = (str) => {
  const alpha = 'abcdefghijklmnopqrstuvwzyz'
  let outcome = false
  for (let k=0; k<alpha.length; k++) {
    let letter = alpha[k]
    if (str.includes(letter)) {
      outcome = letter
    }
  }
  return outcome
}

const returnAlgebraicStructure = (str) => {
  let opPatt = /(\+|\^|\-|\*|\/)/g
  let mathArr = str.split(opPatt)
  let mathStr = ''
  for (let i=0; i<mathArr.length; i++) {
    let item = mathArr[i]
    let letter = isAlgebraic(item)
    if (opPatt.test(item)) {
      switch(item) {
        case '+':
          processedObj = processPars(processArithmetic(patternStr))
          break;
        case '-':
          processedObj = processTrig(patternStr, 'degrees')
          break;
        case '*':
          processedObj = processTrig(patternStr, 'degrees')
          break;
        case '/':
          processedObj = processTrig(patternStr, 'degrees')
          break;
        case '^':
          processedObj = processTrig(patternStr, 'degrees')
          break;
        default:
          console.log('no operation was specified to process the given match')
      }
      if (item.includes('+')) {

      }
    }
  }
}

exports.isCurrMatchAsimpleRef = (match) => {
  let outcome = false
  let numStr = match.replaceAll('||', '')
  let numCandidate = Number(numStr)
  if (!Number.isNaN(numCandidate)) {
    outcome = true
  }
  return outcome
}

exports.log = (x) => {
  return Math.log(x)
}

exports.baseLog = (b, x) => {
  return Math.log(x) / Math.log(b);
}

exports.nthroot = (root, n) => {
  return Math.pow(n, 1/root)
}

exports.processPars = (str) => {
  str = str.replace('\\left(', '(')
  str = str.replace('\\right)', ')')
  if (str.includes('\\left(') || str.includes('\\right)')) {
    str = exports.processPars(str)
  }
  return str
}

exports.processArithmetic = (_str) => {
  let res = subLeadingOps(_str)
  let leadingOp = res.leadingOp
  let str = res.str
  
  let string = `${leadingOp}(${str})`

  let JSmathStr = exports.parsIntoMult(string)
  let algebra = ''
  if (isAlgebraic(JSmathStr)) {

  }

  let output = {
    string,
    algebra,
    latex: ''
  }
  return output
}

exports.processSimpleFracs = (_str) => {
  let res = subLeadingOps(_str)
  let leadingOp = res.leadingOp
  let str = res.str

  let processedNum = str.replace('\\frac{', '')
  let processedDivisor = processedNum.replace('}{', '/')
  let processedDenom = processedDivisor.replace('}', '')
  let processedFrac = str.replace(str, processedDenom)
  let string = `${leadingOp}(${processedFrac})`

  let output = {
    string,
    algebra: '',
    latex: ''
  }
  return output
}

exports.processRoot = (_str) => {
  let res = subLeadingOps(_str)
  let leadingOp = res.leadingOp
  let str = res.str

  let str         = str.replace('\sqrt', '')
  let indexStr    = str.includes('[') ? str.slice(2, str.indexOf(']')) : 2 
  let radicandStr = str.slice(str.indexOf('{')+1, str.indexOf('}'))
  let radicandNum = Number(radicandStr)
  let indexNum    = Number(indexStr)
  // return `(${outcome})`

  let string = `${leadingOp}(${processedFrac})`

  let output = {
    string: isComputable(radicandNum) && isComputable(indexNum) ? exports.nthroot(indexNum, radicandNum) : '',
    algebra: '',
    latex: !isComputable(radicandNum) || !isComputable(indexNum) ? `\\sqrt[${indexStr}]{${radicandStr}}` : ''
  }
  return output
}

exports.pow = (base, power) => {
  return Math.pow(base, power)
}

exports.processExponent = (_str) => {
  let output = ''
  if (_str.includes('||')) {
    output = _str
  } else {
    let leadingNeg = ''
    let str = ''
    if (_str.includes('-') && _str.indexOf('-') == 0) {
      str = _str.slice(1)
      leadingNeg = '-'
    } else {
      str = _str
    }
    str = str.replace('\\left\(', '(')
    str = str.replace('\\right\)', ')')
    str = str.replace('{', '')
    str = str.replace('}', '')
    let base = str.slice(0, str.indexOf('^'))
    let power = str.slice(str.lastIndexOf('^')+1)
    output = `${leadingNeg}(pow(${base},${power}))`
  }
  return output
}

exports.processLogarithm = (str) => {
  let baseStart = str.indexOf('{') + 1
  let baseEnd   = str.indexOf('}')
  let baseStr   = str.slice(baseStart, baseEnd)
  let xStart    = str.indexOf('(') + 1
  let xEnd      = str.indexOf('\\right')
  let xStr      = str.slice(xStart, xEnd)
  let baseNum   = Number(baseStr)
  let xNum      = Number(xStr)
  let outcome   = isComputable(baseNum) && isComputable(xNum) ? exports.baseLog(baseNum, xNum) : `\\log _{${baseStr}}\\left(${xStr}\\right)`
  return `(${outcome})`
}

exports.processNaturalLogarithm = (str) => {
  let xStart    = str.indexOf('(') + 1
  let xEnd      = str.indexOf('\\right')
  let xStr      = str.slice(xStart, xEnd)
  let xNum      = Number(xStr)
  let outcome   = isComputable(xNum) ? Math.log(xNum) : `\\ln \\left(${xStr}\\right)`
  return `(${outcome})`
}

exports.summateOrProduce = (lowerBound, upperBound, term, isSummation) => {
  // term must have an 'i' variable
  const iTerm = (i) => eval(term)

  const summation = (lowerBound, upperBound) => {
    let total = 0
    let n = upperBound
    let i = lowerBound
    for (i; i<n+1; i++) {
      if (isSummation) {
        total += iTerm(i)
      } else {
        total *= iTerm(i)
      }
    }
    return total
  }
  return summation(lowerBound, upperBound)
}

exports.processSummation = (str) => {
  let lowBoundStart = str.indexOf('=') + 1
  let lowBoundEnd   = str.indexOf('}')
  let upBoundStart  = str.indexOf('^') + 1
  let upBoundEnd    = str.indexOf('\\left')
  let termStart     = str.indexOf('(') + 1
  let termEnd       = str.indexOf('\\right')
  let upperBound    = str.slice(upBoundStart, upBoundEnd)
  let lowerBound    = str.slice(lowBoundStart, lowBoundEnd)
  let term          = str.slice(termStart, termEnd)
  let outcome       = isComputable(upperBound) && isComputable(lowerBound) && exports.isAlgebraicallyComputable(term) ? exports.summate(lowerBound, upperBound, term) : `\\sum _{i=${lowerBound}}^${upperBound}\\left(${term}\\right)`
  // console.log('sum outcome = ', outcome)
  return outcome

}

exports.tan = (value) => {
  return Math.tan(value)
}

exports.cos = (value) => {
  return Math.cos(value)
}

exports.cot = (value) => {
  return 1 / Math.tan(value)
}

exports.sin = (value) => {
  return Math.sin(value)
}

exports.sec = (value) => {
  return 1 / Math.cos(value)
}

exports.scs = (value) => {
  return 1 / Math.sin(value)
}

exports.getTrigonometricValue = (_value, unit, op) => {
  // _value input needs to be in Radians or Degrees
  let value = unit == 'degrees' ? (_value * Math.PI)/180 : _value
  let output = ''
  switch (op) {
    case 'tan':
      output = exports.tan(value)
      break;
    case 'cos':
      output = exports.cos(value)
      break;
    case 'sin':
      output = exports.sin(value)
      break;
    case 'cot':
      output = exports.cot(value)
      break;
    case 'sec':
      output = exports.sec(value)
      break;
    case 'csc':
      output = exports.csc(value)
      break;
    default:
      console.log('no trigonometric operation was specified')
  }
  return `(${output})`
}


exports.processTrig = (str, unit) => {
  let op = str.slice(0,3)
  let end = str.indexOf('\\right')
  let value = str.slice(9, end)
  return exports.getTrigonometricValue(value, unit, op)
}