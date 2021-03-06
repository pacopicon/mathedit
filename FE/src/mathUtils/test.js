let str1 = '\\frac{x^2x5x\\left(45x^2xy^3xyx-4x5y\\right)xx\\left(\\alpha x\\right)x^2\\gamma \\left(x^{2+2^{3+4}+4-7776}x\\right)}{2\\phi ^3\\phi ^{\\phi }3\\phi ^5y^02\\phi ^{\\phi ^y}2\\phi ^0\\phi ^03\\phi ^{3+y}\\phi \\left(\\phi ^{2+2}\\phi \\right)\\phi \\phi ^{2+2}\\left(\\phi 5\\right)5\\phi \\left(5\\phi \\phi \\right)\\phi 5\\phi \\left(2\\phi 3\\phi \\right)2\\phi ^3\\phi \\left(\\phi 2\\phi ^3\\right)2\\phi ^22\\phi ^3\\left(\\phi \\phi \\right)\\phi 5\\phi \\left(x\\phi x\\phi \\right)\\phi x\\phi \\left(5\\phi 5\\right)}'

let matchObjArr1 = [ { start: 6, end: 12, match: 'x^2x5x' },
  { start: 18, end: 30, match: '45x^2xy^3xyx' },
  { start: 65, end: 75, match: 'x^2\\gamma ' },
  { start: 81, end: 102, match: 'x^{2+2^{3+4}+4-7776}x' },
  { start: 110,
    end: 191,
    match:
    '{2\\phi ^3\\phi ^{\\phi }3\\phi ^5y^02\\phi ^{\\phi ^y}2\\phi ^0\\phi ^03\\phi ^{3+y}\\phi ' },
  { start: 197, end: 213, match: '\\phi ^{2+2}\\phi ' },
  { start: 220, end: 236, match: '\\phi \\phi ^{2+2}' },
  { start: 321, end: 334, match: '2\\phi ^3\\phi ' },
  { start: 340, end: 353, match: '\\phi 2\\phi ^3' },
  { start: 360, end: 376, match: '2\\phi ^22\\phi ^3' } 
]

let setOfVariables = ['x', 'y', '\\alpha ', '\\gamma ', '\\phi ']

let verbose = true
let count = 0

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
  count++
  if (verbose) console.log(`\n(${count})----BEGIN SPLICE${'-'.repeat(40)}\n|RESULT = ${insert}\n|INPUT = ${constructString(start, end, str)}\n|origStr = ${origStr}\n|head = ${head}\n|tail = ${tail}\n|result = ${res}\n+----${'-'.repeat(52)}`)
  count = 0
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

const separateCoefficientsFromGREEKVars = (_str, varArr) => {
	let str = _str
	let patt = /(\\alpha\s|\\beta\s|\\gamma\s|\\Gamma\s|\\delta\s|\\Delta\s|(?<!c)d[a-zA-Z]|\\epsilon\s|\\varepsilon\s|\\zeta\s|\\eta\s|\\theta\s|\\Theta\s|\\vartheta\s|\\iota\s|\\kappa\s|\\lambda\s|\\Lambda\s|\\mu\s|\\nu\s|\\xi\s|\\Xi\s|\\pi\s|\\Pi\s|\\varpi\s|\\partial\s([a-zA-Z])?|\\rho\s|\\varrho\s|\\sigma\s|\\varsigma\s|\\Sigma\s|\\tau\s|\\upsilon\s|\\Upsilon\s|\\phi\s|\\varphi\s|\\chi\s|\\psi\s|\\Psi\s|\\omega\s|\\Omega\s)/g
  let output = getAllMatchesAndPositions(str, patt)
	// console.log('output = ', output)
	for (let i=0; i<output.length; i++) {
		let greekVar = output[i].match
		str = str.replace(greekVar, '')
		varArr.push(greekVar)
	}
	return {
		str,
		varArr
	}
}

const separateCoefficientsFromVars = (str) => {
  count++
  if (verbose) console.log(`\n(${count})----BEGIN separateCoefficientsFromVars${'-'.repeat(40)}\nstr = ${str}\n+----${'-'.repeat(74)}`)
	let coeff  = ''
  let output = []
  let res    = separateCoefficientsFromGREEKVars(str, output)
      output = res.varArr
      str    = res.str
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
  count++
  if (verbose) console.log(`\n(${count})----END separateCoefficientsFromVars${'-'.repeat(40)}\n digits = ${output}\n+-----${'-'.repeat(72)}`)
	return output
}



const packageVars = (varArr) => {
	let obj = {}
	for (let i=0; i<varArr.length; i++) {
		let VAR  = varArr[i]
		obj[VAR] = {
      coeff: 0,
      zero: false,
      simple: [],
			complex: ''
		}
	}
	return obj
}

const emptyVars = (letterVars) => {
  for (let VAR in letterVars) {
    letterVars[VAR]['coeff'] = 0
    letterVars[VAR]['zero'] = false
    letterVars[VAR]['simple'] = []
    letterVars[VAR]['complex'] = ''
  }
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
    let origStr      = currStr
        currStr      = currStr.replace('{', '')
    let carrotPos    = currStr.indexOf('^')
    let basePos      = carrotPos - 1
    let compExpPos   = isComplex ? currStr.indexOf('}') : '' 
    let exponentPos  = isComplex ? compExpPos : carrotPos + 2
    let baseVar      = currStr[carrotPos - 1]
    let exponent     = isComplex ? currStr.slice(carrotPos + 1, compExpPos) : currStr[carrotPos + 1]
    let origExpo     = exponent
        
    
    for (let VAR in letterVars) {
      if (VAR == baseVar) {
        if (exponent == '0') {
          letterVars[VAR]['zero'] = true
        } else if (canBeEvaled(exponent)) {
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

    count++
      if (verbose) console.log(`\n(${count})----BEGIN processExponent${'-'.repeat(40)}\norigStr = ${origStr}\ncurrStr = ${currStr}\nbasePos = ${basePos}\nexponentPos = ${exponentPos}\nbaseVar = ${baseVar}\norigExpo = ${origExpo}\nexponent = ${exponent}\nletterVars = ${JSON.stringify(letterVars)}+-------------------------${'-'.repeat(40)}`)

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
      }
      
      let digits         = separateCoefficientsFromVars(currStr)
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
      count++
      if (verbose) console.log(`\n(${count})----letterVars${'-'.repeat(40)}\nletterVars = ${JSON.stringify(letterVars)}\n+----${'-'.repeat(50)}`)
      for (let VAR in letterVars) {
        // the bracks var keeps track of the size of the exponent, an exponent string of length > 1 needs brackets in Latex
        let bracks       = 0
        // was there a variable raised to Zeroth power?
        let isThereAZero = letterVars[VAR]['zero']
        let exponent     = letterVars[VAR]['coeff']
            // is exponent single or multiple-digit, i.e. is the exponent string length > 1 ?
            bracks       = exponent > 9 ? 1 : 0
        if (letterVars[VAR]['simple'].length > 0) {
          // i.e. [xxxx].length == 4 => bc x^4 is the standard way of writing xxxx
          exponent      += letterVars[VAR]['simple'].length
          bracks        += exponent.length > 1 ? 1 : 0
        }
        if (letterVars[VAR]['complex'].length > 0) {
          // A zero is expressed via omission, so if exponent = 0, then we drop it.
          exponent       = exponent == 0  ? '' : exponent 
          let varExpo    = letterVars[VAR]['complex']
          let termOp     = (exponent > 0 && varExpo[0] != '-') ? '+' : ''
          count++
          if (verbose) console.log(`\n(${count})----termOp${'-'.repeat(40)}\nexponent = ${exponent}\nvarExpo = ${varExpo}\ntermOp = ${termOp}\n+----${'-'.repeat(50)}`)
          // peek in varExpo to see if there is a coefficient hiding as a string, if so, add it to exponent
          let op         = /(\+|\-|cdot\s|cdiv\s|\*|\^)/g
          let firstOp    = varExpo.search(op)
          // grab operand
          let hidCoeff   = varExpo.slice(0, firstOp)
          count++
          if (verbose) console.log(`\n(${count})----building hidCoeff${'-'.repeat(40)}\nfirstOp = ${firstOp}\nhidCoeff = ${hidCoeff}\n+----${'-'.repeat(50)}`)

          if (hidCoeff && isNum(hidCoeff)) {
            // if operand is a coefficient, take it out of varExpo
            varExpo      = varExpo.replace(hidCoeff, '') 
            // make it and exponent into Number datatype, so that you can add them mathematically
            hidCoeff     = Number(hidCoeff)
            exponent     = Number(exponent)
            // if the input string was well-formed, there should already be an operator after the hidden coefficient.  therefore, we empty the termOp variable assigned above
            termOp       = ''
            count++
            if (verbose) console.log(`\n(${count})----handling hidCoeff${'-'.repeat(40)}\nvarExpo = ${varExpo}\nhidCoeff = ${hidCoeff}\nexponent = ${exponent}\ntermOp = ${termOp}\n+----${'-'.repeat(50)}`)
          } else {
            // if operand is not a coefficient, let it go by reassigning its variable as empty string
            hidCoeff     = ''
          }
          origExpo       = exponent
          exponent       = `${exponent + hidCoeff}${termOp}${varExpo}`
          bracks        += exponent.length > 1 ? 1 : 0
          count++
          if (verbose) console.log(`\n(${count})----building exponent${'-'.repeat(40)}\norigExpo = ${origExpo}\nhidCoeff = ${hidCoeff}\ntermOp = ${termOp}\nvarExpo = ${varExpo}\nexponent = ${exponent}\nbracks = ${bracks}\n+----${'-'.repeat(50)}`)
        }
      
        if (isThereAZero && mathStr.length == 0 && !exponent) {
          mathStr = '1'
        } else if (exponent == `1`) {
          // numbers raised to the power of one (e.g., one can imagine each number in the the entire set of whole numbers as being raised to the power of one) are never written as x^1, but just as x.
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





