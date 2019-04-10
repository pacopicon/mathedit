let str1 = '3x^3x\\left(y^4\\right)+\\left(-y\\right)^2\\left(y\\right)2\\left(y\\right)x^2\\cdot x5x-x^4y^4\\sqrt[3]{27}-\\sin \\left(x^4-yx^4\\right)\\left(\\frac{\\left(45x^2xy^3x\\cdot yx-4x5y\\left(2y3x\\right)^2x^2y^2-yx\\right)}{7yx-8xy+2x^3xx^xx\\cdot 3x^5\\cdot 2x^{x^y}\\cdot 3x^{3+y}x}\\right)'

let matchObjArr1 = [ { start: 0, end: 5, match: '3x^3x' },
  { start: 77, end: 80, match: 'x5x' },
  { start: 81, end: 87, match: 'x^4y^4' },
  { start: 115, end: 119, match: 'yx^4' },
  { start: 144, end: 154, match: '45x^2xy^3x' },
  { start: 160, end: 162, match: 'yx' },
  { start: 163, end: 167, match: '4x5y' },
  { start: 173, end: 177, match: '2y3x' },
  { start: 184, end: 192, match: '^2x^2y^2' },
  { start: 193, end: 195, match: 'yx' },
  { start: 204, end: 207, match: '7yx' },
  { start: 208, end: 211, match: '8xy' },
  { start: 212, end: 221, match: '2x^3xx^xx' },
  { start: 237, end: 245, match: '2x^{x^y}' },
  { start: 251, end: 261, match: '3x^{3+y}x}' } ]

const processlikeTerms = (matchObjArr, str) => {
	// console.log(`\nmatchObjArr = ${JSON.stringify(matchObjArr)}`)
	let mathString = ''
	let setOfLetters = new Set()
	let offset = 0
	for (let i=0; i<matchObjArr.length; i++) {
		let currStr   = matchObjArr[i].match
		let currStart = matchObjArr[i].start
		let currEnd		= matchObjArr[i].end
		let nextStart = matchObjArr[i+1] ? matchObjArr[i+1].start : 'NA'
		let lastEnd   = matchObjArr[i-1] ? matchObjArr[i-1].end : 'NA'
		let digits    = currStr.split('')


		// (1) take letters out and keep a unique list of them
		for (let k=0; k<digits.length; k++) {
			let digit = digits[k]
			if (isLetter(digit)) {
				setOfLetters.add(digit)
				currStr = currStr.replace(digit, '')
				
			}
		}
		// (2) add only numbers to running mathString
		mathString += currStr
		
		if (i < matchObjArr.length - 1) {
			// (3) delete the current match string from orignal latex string
			res 			 = spliceString(str, currStart-offset, currEnd-offset, '')
			str 			 = res.str
			// console.log(`\n${i}${i == 1 ? 'st' : (i == 2 ? 'nd' : (i == 3 ? 'rd' : 'th'))} str = ${str}`)
			offset += res.offset
		} else {
			// during very last iteration...
			// (4) evaluate mathString
			let mathRes = eval(mathString)
			// (5) get math solution and turn it into a string
			let strRes = mathRes.toString()
			// (6) add the letters to the end
			setOfLetters.forEach( (letter) => {
				strRes += letter
			})
			// (7) delete the last match string from orignal latex string and replace it with the evaluated string.
			res = spliceString(str, currStart-offset, currEnd-offset, strRes)
			str = res.str
			// console.log(`\nlast str = ${str}`)
		}
	}
	return str
}

const constructString = (start, end, str) => {
  let string = ''
  for (let i=start; i<end; i++) {
    string+= str[i]
  }
  return string
} 

const spliceString = (str, start, end, insert) => {
	// console.log(`\nstr = ${str}\nstart = ${start}\nend = ${end}\ninsert = ${insert}`)
	let origStr = str
	let head    = str.slice(0, start)
	let tail    = str.slice(end)
	let res     = `${head}${insert}${tail}`
	let offset  = origStr.length - res.length
	console.log(`+----BEGIN SPLICE${'-'.repeat(40)}\n|insert = ${insert}\n|replaced = ${constructString(start, end, str)}\n|origStr = ${origStr}\n|head = ${head}\n|tail = ${tail}\n|result = ${res}\n+----BEGIN SPLICE${'-'.repeat(40)}\n`)
	return { 
		str: res,
		offset 
	}
}

// Need to filter out strings of type 
// 	(a) yx^4 and x^4y^4 (they seem complex, but cannot be simplified)
// 	(b) {x4y3x^{3xx}x} (the match within the external brackets is fine, but filter out the right closing bracket)
// 	(c) yx and 7yx (8xy)
// 	(d) 2x^{x^y}

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

const canBeEvaled = (str) => {
	try {
		return typeof eval(str) == 'number'
	} catch (err) {
		return false
	}
}

const sliceString = (str, start, end) => {
  let strArr = str.split('')
      strArr = end ? strArr.slice(start, end) : strArr.slice(start)
  return strArr.join('')
}

const spliceOut = (str, start, end) => {
	let head = start ? sliceString(str, 0, start) : ''
  let tail = sliceString(str, end)
  console.log(`spliceOut -> str = ${str}, start = ${start}, end = ${end}, head = ${head}, tail = ${tail}`)
	return head + tail
}

const separateCoefficientsFromVars = (str) => {
	let coeff = ''
	let output = []
	for (let i=0; i<str.length; i++) {
		let char = str[i]
		if (isNum(char)) {
			coeff += char
		} else if (isLetter(char)) {
			if (coeff) {
				output.push(coeff)
				coeff = ''
			}
			output.push(char)
		}
	}
	return output
}

let setOfVariables = ['x', 'y']

const packageVars = (varArr) => {
	let obj = {}
	for (let i=0; i<varArr.length; i++) {
		let letter = varArr[i]
		obj[letter] = {
      coeff: 0,
      simple: [],
			complex: ''
		}
	}
	return obj
}

const emptyVars = (letterVars) => {
  for (let VAR in letterVars) {
    letterVars[VAR]['coeff'] = 0
    letterVars[VAR]['simple'] = []
    letterVars[VAR]['complex'] = ''
  }
}

const addPowersToVars = (letterVars, baseVar, _exponent) => {
  console.log(`\nBEGIN letterVars = ${JSON.stringify(letterVars)}\n, baseVar = ${baseVar}, _exponent = ${_exponent}`)
  let exponent = _exponent
  for (let VAR in letterVars) {
    if (VAR == baseVar) {
      if (canBeEvaled(exponent)) {
        exponent     = eval(exponent)
        letterVars[VAR]['coeff'] += exponent
      } else {
        if (letterVars[VAR]['complex'].length > 0 && exponent[0] != '-') {
          letterVars[VAR]['complex'] += `+${exponent}`
        } else {
          letterVars[VAR]['complex'] += exponent
        }
      }
    }
  }
  console.log(`\nEND letterVars = ${JSON.stringify(letterVars)}\n`)
}

const resolveProximateFactors = (matchObjArr, _str, setOfVariables) => {
	let str              = _str
	let brackPatt        = /\{(\w+(\+|\-|\^)\w+)\}/
	let offset           = 0
  let letterVars       = packageVars(setOfVariables)

	const processComplexExponent = (currStr) => {

    let match          = brackPatt.exec(currStr)
    let baseVarPos     = currStr.indexOf('^') - 1
    let baseVar        = currStr[baseVarPos]
    console.log(`currStr = ${currStr}, baseVarPos = ${baseVarPos}, baseVar = ${baseVar}`)
		let brackContents  = match[0]
				brackContents  = brackContents.replace('{', '')
        brackContents  = brackContents.replace('}', '')

    
        
    addPowersToVars(letterVars, baseVar, brackContents)
    currStr = currStr.replace(match[0], '')
    currStr = currStr.replace('^', '')
		console.log(`match[0] = ${match[0]}, match = ${JSON.stringify(match)}, currStr = ${currStr}`)
		if (brackPatt.test(currStr)) {
			currStr          = processComplexExponent(currStr)
		} 
		if (!brackPatt.test(currStr)) {
			return currStr
		}
  }
  
  const processSimpleExponent = (currStr) => {
    let carrotPos    = currStr.indexOf('^')
    let basePos      = carrotPos - 1
    let exponentPos  = carrotPos + 2
    let baseVar      = currStr[carrotPos - 1]
    let exponent     = currStr[carrotPos + 1]
    
    addPowersToVars(letterVars, baseVar, exponent)
    currStr          = spliceOut(currStr, basePos, exponentPos)
    console.log(`after spliceOut currStr = ${currStr}`)
    
    if (currStr.includes('^')) {
      currStr        = processSimpleExponent(currStr)
    }
    if (!currStr.includes('^')) {
      return currStr
    }
  }

	const product        = (accumulator, currVal) => {
    return accumulator * currVal
  }

	for (let i=0; i<matchObjArr.length; i++) {
		let currStr        = matchObjArr[i].match
		let currStart      = matchObjArr[i].start
    let currEnd		     = matchObjArr[i].end
    let coefficients   = []

    // (1) ignore strings that begin with '^' (will cause infinite recursion)
    if (currStr[0] != '^') {

      // (2) separate exponent substrings (^x or ^{xx}) from matched proximate factors string
      if (brackPatt.test(currStr)) {
        currStr          = processComplexExponent(currStr)
      } else if (currStr.includes('^')) {
        currStr          = processSimpleExponent(currStr)
        
      }
      
      let digits         = separateCoefficientsFromVars(currStr)
      console.log(`\ndigits = ${digits}\n`)
        // (3) split away variables from coefficients
      for (let k=0; k<digits.length; k++) {

        let digit        = digits[k]
        if (isLetter(digit)) {
          for (let VAR in letterVars) {
            if (VAR == digit) {
              letterVars[VAR]['simple'].push(digit)
              currStr    = currStr.replace(digit, '')
            }
          }
        } else if (isNum(digit)) {
          coefficients.push(Number(digit))
          currStr        = currStr.replace(digit, '')
        }
      }

      let coefficient    = coefficients.length > 0 ? coefficients.reduce(product) : ''
      let mathStr        = `${coefficient}`
      // console.log(`\nletterVars = ${JSON.stringify(letterVars)}\n`)
      for (let VAR in letterVars) {
        let bracks       = 0
        let power        = letterVars[VAR]['coeff']
            bracks       = power > 9 ? 1 : 0
        if (letterVars[VAR]['simple'].length > 0) {
          power         += letterVars[VAR]['simple'].length
          bracks        += power.length > 1 ? 1 : 0
        }
        if (letterVars[VAR]['complex'].length > 0) {
          power          = power == `1` ? '' : power 
          let varPower   = letterVars[VAR]['complex']
          console.log(`\n>>>>>>>>>>>>>>>varPower = ${varPower}\n`)
          if (power > 0 && varPower[0] != '-') {
            power        = `${power}+${varPower}`
            bracks      += power.length > 1 ? 1 : 0
          } else {
            power        =  `${power}${varPower}`
            bracks      += power.length > 1 ? 1 : 0
          }
        }
      
        if (power == `1`) {
          mathStr +=`${VAR}`
        } else if (power != `0`) {
          mathStr += bracks > 0 ? `${VAR}^{${power}}` : `${VAR}^${power}`
        } 
          
        
      }

      let solution       = mathStr
      let res            = spliceString(str, currStart-offset, currEnd-offset, solution)
          str            = res.str
          offset        += res.offset
      emptyVars(letterVars)

    }
     
  }
	return str
}

console.log('matchObjArr1 = ', matchObjArr1)

let res1 = resolveProximateFactors(matchObjArr1, str1, setOfVariables)
console.log('res1 = ', res1)




////////////////////////////////////////////////////

const buildProxFactorPatt = () => {
  // let VAR = `(\1(\^\w+)?)?`.repeat(10)
  // let template = `(\w)(\^\w+)?(\1(\^\w+)?)` 
  // return new RegExp(template)
}

// let res2 = buildProxFactorPatt()
// console.log(res2)





