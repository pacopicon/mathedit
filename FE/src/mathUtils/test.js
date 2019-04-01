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
  return /[a-zA-Z]/g.test(x)
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
    if ((isNum(algarr[i]) || (i == 0 && algarr[i] == '-')) && algarr[i] != ' ') {
      num += algarr[i]
      mode = 'num'
			if (isLetter(algarr[i-1]) && algarr[i-1] != ' ') {
				output.push('*')
			}
      if (i == algarr.length - 1) {
        output.push(num)
      }   
    } else if (isLetter(algarr[i]) && algarr[i] != ' ') {
      if (mode == 'num' && num != '') {
        output.push(num)
        num = ''
      }
			if (isAlphaNum(algarr[i-1]) && algarr[i-1] != ' ') {
				output.push('*')
			}
      output.push(algarr[i])
      mode = 'lett'
    } else if (isOp(algarr[i]) && algarr[i] != ' ') {
      if (mode == 'num' && num != '') {
        output.push(num)
        num = ''
      }
      output.push(algarr[i])
      mode = 'opp'
    }
  }
  return output
}

const createExpression = (prev, opp, curr) => {
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
    default:
      console.log('not an operator')
  }
  return obj
}

const returnAlgebraicStructure = (str) => {
 
  const varArr = organizeVars(str)
  const algFormula = []
  let wasParDeclared = false
  for (let i=0; i<varArr.length; i++) {
    let exp = ''
    let recepticle = ''
    
    if (isAlphaNum(varArr[i])) {

      if (wasParDeclared || (varArr[i-1] == '(' && (isAlphaNum(varArr[i-2]) || (varArr[i-2] == '-' && varArr[i-3])))) {
        if (!wasParDeclared) {
          wasParDeclared = true
          algFormula.push('')
        }
        let last = algFormula.length - 1
        recepticle = algFormula[last]

      } 
      if (!wasParDeclared) {
        let last = algFormula.length - 1
        recepticle = algFormula[last-1]
      }

      if (isAlphaNum(varArr[i-2]) && isOp(varArr[i-1]) && varArr[i-1] != '(' && varArr[i-1] != ')') {
        let prev = varArr[i-2]
        let opp  = arArr[i-1]
        let curr = varArr[i]
        let obj  = createExpression(prev, opp, curr)
            exp  = obj.item
        
      } else {
            exp  = new Expression(Number(varArr[i]))
      }

      recepticle.push({
        type: 'exp',
        item: exp
      })
      
    } else if (isOp(varArr[i])) {
      if (varArr[i] == ')') {
        wasParDeclared = false
      } else if (varArr[i] == '(' && (isAlphaNum(varArr[i-1]) || varArr[i-1] == '-')) {
        wasParDeclared = true

        // modify organizeVars in order to put a '*' between AlphaNum and '(' and/or replace '-' with '-1' and add a '*' after
        
      } 
    }
  }
}



// const one = new Expression(1)
// const two = new Expression(2)
// const a = new Expression('a')
// const b = new Expression('b')

// let ex1 = one.multiply(1)
// let ex2 = two.multiply(ex1)
// let ex3 = a.multiply(ex2)
// let ex4 = b.multiply(ex3)
// ex4 = ex4.simplify()

// console.log(ex1.toString())
// console.log(ex2.toString())
// console.log(ex3.toString())
// console.log(ex4.toString())

const encodeAlgebra = (str) => {
  let output = {}
  let order = 0
  let mode = ''
  let num = ''
  let extra = ''

	const encode = (order, sym) => {
		if (sym) {
			output[`||${order}||`].push(sym)
		}
	}

  for (let i=0; i<str.length; i++) {
		if (!Array.isArray(output[`||${order}||`])) {
			output[`||${order}||`] = []
		}
    if (isLetter(str[i])) {
      if (mode == 'num') {
        encode(order, num)
        num = ''
      }
			if (isAlphaNum(str[i+1])) {
				encode(order, str[i])
      	encode(order, '*')
			} else {
        encode(order, str[i])
			}
      
    } else if (isNum(str[i])) {
      mode = 'num'
      num += str[i]
			if (isLetter(str[i+1])) {
				encode(order, num)
				num = ''
      	encode(order, '*')
			}
    } else if (isOp(str[i])) {
			if (mode == 'num') {
				encode(order, num)
        num = ''
      }
			if ((!str[i-1] && str[i] == '-')) {
				encode(order, '-1')
				encode(order, '*')
			} else if ((str[i] == '-' && str[i+1] == '(')) {
				encode(order, '-')
				encode(order, '1')
				encode(order, '*')
			} else if (str[i] == '(') {
				order++
				encode(order-1, `||${order}||`)
			} else if (str[i] == ')') {
				order--
			} else {
				encode(order, str[i])
			}
    }
  }
  return output
}

let str = `-x11y+xy2-(45xy*2y4x/7y-8x)`

let res1 = encodeAlgebra(str)

console.log(str)
console.log(res1)
for (let i=0; i<str.length; i++) {
  console.log(`str[${i}] = ${str[i]}`)
}