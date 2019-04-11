let str1 = '3x^3x\\left(y^4\\right)+\\left(-y\\right)^2\\left(y\\right)2\\left(y\\right)x^2\\cdot x5x-x^4y^4\\sqrt[3]{27}-\\sin \\left(x^4-yx^4\\right)\\left(\\frac{\\left(45x^2xy^3x\\cdot yx-4x5y\\left(2y3x\\right)^2x^2y^2-yx\\right)}{7yx-8xy+2x^3xx^xx\\cdot 3x^5\\cdot 2x^{x^y}\\cdot 2x^0\\cdot x^0\\cdot 3x^{3+y}x}\\right)'

let matchObjArr1 = [ { start: 0, end: 5, match: '3x^3x' },
{ start: 11, end: 14, match: 'y^4' },
{ start: 29, end: 30, match: 'y' },
{ start: 45, end: 46, match: 'y' },
{ start: 60, end: 61, match: 'y' },
{ start: 68, end: 71, match: 'x^2' },
{ start: 77, end: 80, match: 'x5x' },
{ start: 81, end: 85, match: 'x^4y' },
{ start: 111, end: 114, match: 'x^4' },
{ start: 115, end: 119, match: 'yx^4' },
{ start: 144, end: 154, match: '45x^2xy^3x' },
{ start: 160, end: 162, match: 'yx' },
{ start: 163, end: 167, match: '4x5y' },
{ start: 173, end: 177, match: '2y3x' },
{ start: 184, end: 190, match: '^2x^2y' },
{ start: 193, end: 195, match: 'yx' },
{ start: 204, end: 207, match: '7yx' },
{ start: 208, end: 211, match: '8xy' },
{ start: 212, end: 221, match: '2x^3xx^xx' },
{ start: 227, end: 231, match: '3x^5' },
{ start: 237, end: 245, match: '2x^{x^y}' },
{ start: 251, end: 255, match: '2x^0' },
{ start: 261, end: 264, match: 'x^0' },
{ start: 270, end: 280, match: '3x^{3+y}x}' } ]

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
	return head + tail
}

const separateCoefficientsFromVars = (str) => {
  console.log(`+----BEGIN separateCoefficientsFromVars${'-'.repeat(40)}\nstr = ${str}\n+----BEGIN separateCoefficientsFromVars${'-'.repeat(40)}\n`)
	let coeff = ''
	let output = []
	for (let i=0; i<str.length; i++) {
		let char = str[i]
		if (isNum(char)) {
      coeff += char
		} else {
			if (coeff) {
				output.push(coeff)
				coeff = ''
			}
			output.push(char)
    }
    if (coeff && str.length < 2) {
      output.push(coeff)
      coeff = ''
    }
  }
  console.log(`+----END separateCoefficientsFromVars${'-'.repeat(40)}\noutput = ${output}\n+----END separateCoefficientsFromVars${'-'.repeat(40)}\n`)
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
  console.log(`+----BEGIN addPowersToVars${'-'.repeat(40)}\nbaseVar = ${baseVar}\n_exponent = ${_exponent}\n+----BEGIN addPowersToVars${'-'.repeat(40)}\n`)
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
  console.log(`+----END addPowersToVars${'-'.repeat(40)}\nletterVars = ${JSON.stringify(letterVars)}\n+----END addPowersToVars${'-'.repeat(40)}\n`)
}

let brackOffset    = 0 // this global var is "owned" by the fn below

const eliminateUnmatchedBrackets = (matchObj, offset) => {
	let str          = matchObj.match
	let op           = /\{/g
	let cl           = /\}/g
	let open         = str.match(op) || []
	let close        = str.match(cl) || []
	let temp         = []
	// (1) if the number of opening brackets is different from the number of closing brackets, then proceed with the operation
	if (open.length != close.length) {
		while (match   = cl.exec(str)) {
	// (2) push the start index of every closing bracket into a temporary array
			temp.push(match.index)
		}
	}
	// (3) if the conditional in (1) is true, and temp has indexes, then get the index of the last bracket.  Otherwise get the length of the string.
	let last         = temp.length > 0 ? temp.pop() : str.length
	// (4) record the length of the original string
	let origLength    = str.length
	// (5) update the start index of the current string (within the general math string) based upon an offset that may have been updated by a processed unmatched bracket in a string prior to the current string.  If no previous unmatched brackets have been processed, offset is 0.
	matchObj.start   = matchObj.start - offset
	// (6) if the str is not to be changed, the "last" variable in the slice operation is the length of the string which means the string will remain the same length.  Otherwise, the operation will slice out the last bracket.
	let tempOffset   = offset
			str          = str.slice(0, last)
			offset 	    += origLength - str.length
	matchObj.match   = str
	let latentOffset = tempOffset != offset ? offset : 0 
	// (7) update the end index of the string based upon either original or updated length.
	matchObj.end     = matchObj.start + str.length - latentOffset
	// console.log(`\ntempOffset = ${tempOffset}\noffset = ${offset}\nlatentOffset = ${latentOffset}\n`)
	return matchObj
}

const resolveProximateFactors = (matchObjArr, _str, setOfVariables) => {
	let str              = _str
	let brackPatt        = /\{(\w+(\+|\-|\^)\w+)\}/
  let offset           = 0
  let brackOffset      = 0
  let letterVars       = packageVars(setOfVariables)

  const processExponent = (currStr) => {

    let isComplex    = brackPatt.test(currStr)
        currStr      = currStr.replace('{', '')
    let carrotPos    = currStr.indexOf('^')
    let basePos      = carrotPos - 1
    let compExpPos   = isComplex ? currStr.indexOf('}') : '' 
    let exponentPos  = isComplex ? compExpPos : carrotPos + 2
    let baseVar      = currStr[carrotPos - 1]
    let exponent     = isComplex ? currStr.slice(carrotPos + 1, compExpPos) : currStr[carrotPos + 1]
        

    console.log(`+----BEGIN processExponent${'-'.repeat(40)}\ncurrStr = ${currStr}\nbasePos = ${basePos}\nexponentPos = ${exponentPos}\nbaseVar = ${baseVar}\nexponent = ${exponent}\n+----BEGIN processExponent${'-'.repeat(40)}\n`)
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
  
    currStr          = spliceOut(currStr, basePos, exponentPos)
    currStr          = currStr.replace('}', '')

    if (currStr.includes('^')) {
      currStr        = processExponent(currStr)
    }
    if (!currStr.includes('^')) {
      return currStr
    }
  }

	const product        = (accumulator, currVal) => {
    return accumulator * currVal
  }

	for (let i=0; i<matchObjArr.length; i++) {
    let matchObj     = eliminateUnmatchedBrackets(matchObjArr[i], brackOffset)
    let currStr      = matchObj.match
    let currStart    = matchObj.start
    let currEnd		   = matchObj.end
    let coefficients = []

    // (1) ignore strings that begin with '^' (will cause infinite recursion)
    if (currStr[0] != '^' && currStr.length > 2) {

      // (2) separate exponent substrings (^x or ^{xx}) from matched proximate factors string for processing
      if (currStr.includes('^')) {
        currStr          = processExponent(currStr)
        // console.log(`+----END processExponent${'-'.repeat(40)}\ncurrStr = ${currStr}\nletterVars = ${JSON.stringify(letterVars)}\n+----END processExponent${'-'.repeat(40)}\n`)
      }
      
      let digits         = separateCoefficientsFromVars(currStr)
      console.log(`\ndigits = ${digits}\n`)
        // (3) split away variables from coefficients
      for (let k=0; k<digits.length; k++) {

        let digit        = digits[k]
        if (isLetter(digit)) {
          for (let VAR in letterVars) {
            if (VAR == digit) {
              // collect all meaningful instances of same variable in 'simple' array, later the length of this array determines the exponent for this variable.
              letterVars[VAR]['simple'].push(digit)
              currStr    = currStr.replace(digit, '')
            }
          }
        } else if (isNum(digit)) {
          // collect all base coefficients, later their product is derived
          coefficients.push(Number(digit))
          currStr        = currStr.replace(digit, '')
        }
      }
      // get product of all base coefficients collected
      let coefficient    = coefficients.length > 0 ? coefficients.reduce(product) : ''
      let mathStr        = `${coefficient}`
      console.log(`+----letterVars${'-'.repeat(40)}\nletterVars = ${JSON.stringify(letterVars)}\n+----letterVars${'-'.repeat(40)}\n`)
      for (let VAR in letterVars) {
        // the bracks var keeps track of the size of the exponent, an exponent string of length > 1 needs brackets in Latex
        let bracks       = 0
        let exponent     = letterVars[VAR]['coeff']
            // is exponent single or multiple-digit, i.e. is the exponent string length > 1 ?
            bracks       = exponent > 9 ? 1 : 0
        if (letterVars[VAR]['simple'].length > 0) {
          // i.e. [xxxx].length == 4 => bc x^4 is the standard way of writing xxxx
          exponent      += letterVars[VAR]['simple'].length
          console.log(`\n>>>>>>>>>>>>>>>letterVars[VAR]['simple'] = ${letterVars[VAR]['simple']}\n`)
          bracks        += exponent.length > 1 ? 1 : 0
        }
        if (letterVars[VAR]['complex'].length > 0) {
          // A zero is expressed via omission, so if exponent = 0, then we drop it.
          exponent       = exponent == 0  ? '' : exponent 
          let varExpo    = letterVars[VAR]['complex']
          console.log(`\n>>>>>>>>>>>>>>>varExpo = ${varExpo}\n`)
          
          let termOp     = (exponent > 0 && varExpo[0] != '-') ? '+' : ''
          // peek in varExpo to see if there is a coefficient hiding as a string, if so, add it to exponent
          let op         = /(\+|\-|cdot\s|cdiv\s|\*|\^)/g
          let firstOp    = varExpo.search(op)
          // grab operand
          let hidCoeff   = varExpo.slice(0, firstOp)
          console.log(`\n>>>>>>>>>>>>>>>firstOp = ${firstOp}\n`)

          if (isNum(hidCoeff)) {
            // if operand is a coefficient, take it out of varExpo
            varExpo      = varExpo.replace(hidCoeff, '') 
            // make it and exponent into Number datatype, so that you can add them mathematically
            hidCoeff     = Number(hidCoeff)
            exponent     = Number(exponent)
            // if the input string was well-formed, there should already be an operator after the hidden coefficient.  therefore, we empty the termOp variable assigned above
            termOp       = ''
          } else {
            // if operand is not a coefficient, let it go by reassigning its variable as empty string
            hidCoeff     = ''
          }
          exponent       = `${exponent + hidCoeff}${termOp}${varExpo}`
          bracks        += exponent.length > 1 ? 1 : 0
        }
      
        if (exponent == `1`) {
          // numbers raised to the power of one (e.g., the entire set of whole numbers) are never written as x^1, but just as x.
          mathStr +=`${VAR}`
        } else if (exponent != `0`) {
          mathStr += bracks > 0 ? `${VAR}^{${exponent}}` : `${VAR}^${exponent}`
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





