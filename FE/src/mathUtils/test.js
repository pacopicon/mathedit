const algebra = require('algebra.js');
const Fraction = algebra.Fraction;
const Expression = algebra.Expression;
const Equation = algebra.Equation;

let match1 = `1a+2b`
let match2 = `b-5a^q`
let match3 = `(34x * 5y^3^2x+(-3y)^2)`
let match4 = `3^9`
let match5 = `5a^q*(34* 5^3^2+3^2)`

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

const getAllMatchesAndPositions = (str, patt) => {
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

const isNum = (x) => {
  return /\d+/g.test(Number(x))
}
const isLetter = (x) => {
  return /\w+/g.test(x)
}
const isOp = (x) => {
  return /(\+|\^|\(|\)|\-|\*|\/)/g.test(x)
}
const isAlphaNum = (x) => {
  return (isNum(x) || isLetter(x))
}

const organizeVars = (str) => {
  let algarr = str.split('')
  let output = []
  let mode = ''
  let num = ''

  for (let i=0; i<algarr.length; i++) {
    let item = algarr[i]
    if ((isNum(item) || (i == 0 && item == '-')) && item != ' ') {
      num += item
      mode = 'num'
      if (i == algarr.length - 1) {
        output.push(num)
      }   
    } else if (isLetter(item) && item != ' ') {
      if (mode == 'num' && num != '') {
        output.push(num)
        num = ''
      }
      output.push(item)
      mode = 'lett'
    } else if (isOp(item) && item != ' ') {
      if (mode == 'num' && num != '') {
        output.push(num)
        num = ''
      }
      output.push(item)
      mode = 'opp'
    }
  }
  return output
}

const createExpression = (prev, opp, curr, beginPar, isPar) => {
  let obj = ''
  switch(opp) {
    case '+':
      obj = {
        type: 'exp',
        item: prev.add(curr)
      }
      break;
    case '-':
      obj = {
        type: 'exp',
        item: prev.subtract(curr)
      }
      break;
    case '*':
      obj = {
        type: 'exp',
        item: prev.multiply(curr)
      }
      break;
    case '/':
      obj = {
        type: 'exp',
        item: prev.divide(curr)
      }
      break;
    case '^':
      obj = {
        type: 'exp',
        item: prev.pow(curr)
      }
      break;
    case '(':
      if (!beginPar) {
        beginPar = true
      }
      isPar = true
      break;
    case ')':
      isPar = false
      break;
    default:
      console.log('not an operator')
  }
  return {
    obj,
    isPar,
    beginPar
  }
}

const returnAlgebraicStructure = (str) => {
 
  const varArr = organizeVars(str)
  const algObj = {}
  let beginPar = false
  let isPar = false
  for (let i=0; i<varArr.length; i++) {

    if (isAlphaNum(varArr[i])) {
      if (beginPar) {
        beginPar = false
      }

      if (isAlphaNum(varArr[i-2]) && isOp(varArr[i-1])) {
        let prev     = varArr[i-2]
        let opp      = arArr[i-1]
        let curr     = varArr[i]
        let res      = createExpression(prev, opp, curr, beginPar, isPar)
            exp      = res.obj.item
            beginPar = res.beginPar
            isPar    = res.isPar
        algObj[`${i}`] = {
          type: 'exp',
          item: exp
        }
      } else {
        algObj[`${i}`] = {
          type: 'exp',
          item: new Expression(Number(varArr[i]))
        }
      }
      
    }
    if (isLetter(item)) {
      algObj[`${i}`] = {
        type: 'exp',
        item: new Expression(item)
      }
    }
    if (isOp(item)) {
      algObj[`${i}`] = {
        type: 'opp',
        item: item
      }  
    }
  }
}



const one = new Expression(1)
const two = new Expression(2)
const a = new Expression('a')
const b = new Expression('b')

let ex1 = one.multiply(1)
let ex2 = two.multiply(ex1)
let ex3 = a.multiply(ex2)
let ex4 = b.multiply(ex3)
ex4 = ex4.simplify()

console.log(ex1.toString())
console.log(ex2.toString())
console.log(ex3.toString())
console.log(ex4.toString())