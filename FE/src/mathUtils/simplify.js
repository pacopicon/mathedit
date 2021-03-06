// SIMPLIFICATION TODO
// (1) implement simplification steps in this order:
//    (a) Get a list of all variables so they can be used in simpPatterns OR make simpPatterns be able to analyze any number of variables
//		(b) Resolve all (nested) exponents
//		(c) get product of all adjacent proximateVariableMultiplication
//		(d) Add like terms
// (2) Exponents
//    (a) The current exponent processor returns the output of its process, presupposing that there will always be exponents to process.  A Latex input without exponents will break the procedure.
// (3) Proximate Multiplication
// 		(a) return the product of all matched coefficients
// 		(b) consolidate like variables into exponential notation, like variables add their exponents
// 		(c) if variables have variable exponents, make sure to still consolidate these variable bases with other variable bases
// 		(d) A special case of (c) is when a variable has an exponent consisting of a coefficient and a variable or an integer term and a variable term.  In terms of Latex, these complex exponents will be enclosed in brackets ('{}'), brackets that will not have been eliminated by the earlier exponent resolving process.  So you will need to handle these
// (4) Make sure that the Add Like Terms step can handle searching polynomials with increasing variable complexity: first 2x-7x^3, then 2xy-7x^3y^2, then 2xyz - 2y + 4x + 5z, and so on.
// (4) Make sure to test strings with only one match for simplification type.  You want to ascertain that getAllMatchesAndPositions() will get matches and positions for singleton strings with the 'g' flag.  If not, you will have to take the flag out of all the RegExp patterns and derive the 'lastIndex' of the matched string from its length and its starting position.
// (5) Most if not all patterns will need to be constructed by a function that takes mathematical variables as inputs.  This input will need to be gathered by another pattern matching and match-processing procedure.  The matching and processing will need to occur first. 
// (6) The end goals: 
//    (a) Type Latex in, get simplified latex out 
// 		(b) Solve for x, solve for y
//    (c) Solve for 0
//    (d) substitute var x or y for constant

let verbose = true
let failSafe = 0

let str1 = `3x^3x\\left(y^{2^2}\\right)+\\left(-y\\right)^2\\left(y\\right)2\\left(y\\right)x^2\\cdot x5x-x^{2^2}y^{2^2}\\sqrt[3]{27}-\\sin \\left(x^{2^2}-yx^{2^2}\\right)\\left(\\frac{\\left(45x^2xy^3x\\cdot yx-4x5y\\left(2y3x\\right)^2x^2y^2-yx\\right)}{7yx-8xy+2x^3xx^xx\\cdot 3x^5y^0\\cdot 2x^{x^y}\\cdot 2x^0\\cdot x^0\\cdot 3x^{3+y}x}\\right)`

let regexr1 = `3x^3x\left(y^{2^2}\right)+\left(-y\right)^2\left(y\right)2\left(y\right)x^2\cdot x5x-x^{2^2}y^{2^2}\sqrt[3]{27}-\sin \left(x^{2^2}-yx^{2^2}\right)\left(\frac{\left(45x^2xy^3x\cdot yx-4x5y\left(2y3x\right)^2x^2y^2-yx\right)}{7yx-8xy+2x^3xx^xx\cdot 3x^5y^0\cdot 2x^{x^y}\cdot 2x^0\cdot x^0\cdot 3x^{3+y}x}\right)`

let str2 = `\\frac{x^2\\cdot x5x\\left(45x^2xy^3x\\cdot yx-4x5y\\right)x\\cdot x\\left(\\alpha \\cdot x\\right)x^2\\cdot \\gamma \\left(x^{2+2^{3+4}+4-6^5}\\cdot x\\right)}{2\\phi ^3\\phi ^{\\phi }\\cdot 3\\phi ^5y^0\\cdot 2\\phi ^{\\phi ^y}\\cdot 2\\phi ^0\\cdot \\phi ^0\\cdot 3\\phi ^{3+y}\\phi \\left(\\phi ^{2+2}\\cdot \\phi \\right)\\phi \\cdot \\phi ^{2+2}\\left(\\phi \\cdot 5\\right)5\\cdot \\phi \\left(5\\phi \\cdot \\phi \\right)\\phi \\cdot 5\\phi \\left(2\\phi \\cdot 3\\phi \\right)2\\phi ^3\\cdot \\phi \\left(\\phi \\cdot 2\\phi ^3\\right)2\\phi ^2\\cdot 2\\phi ^3\\left(\\phi \\phi \\right)\\phi 5\\phi \\left(x\\phi x\\phi \\right)\\phi x\\phi \\left(5\\phi 5\\right)}`

let regexr2 = `\frac{x^2\cdot x5x\left(45x^2xy^3x\cdot yx-4x5y\right)x\cdot x\left(\alpha \cdot x\right)x^2\cdot \gamma \left(x^{2+2^{3+4}+4-6^5}\cdot x\right)}{2\phi ^3\phi ^{\phi }\cdot 3\phi ^5y^0\cdot 2\phi ^{\phi ^y}\cdot 2\phi ^0\cdot \phi ^0\cdot 3\phi ^{3+y}\phi \left(\phi ^{2+2}\cdot \phi \right)\phi \cdot \phi ^{2+2}\left(\phi \cdot 5\right)5\cdot \phi \left(5\phi \cdot \phi \right)\phi \cdot 5\phi \left(2\phi \cdot 3\phi \right)2\phi ^3\cdot \phi \left(\phi \cdot 2\phi ^3\right)2\phi ^2\cdot 2\phi ^3\left(\phi \phi \right)\phi 5\phi \left(x\phi x\phi \right)\phi x\phi \left(5\phi 5\right)}`

let str3 = `\\frac{\\alpha ^2\\cdot \\gamma 5\\delta \\left(45\\epsilon ^2\\zeta ^3\\eta \\cdot \\theta \\iota -4\\kappa 5\\lambda \\right)\\mu \\cdot \\nu \\left(\\xi \\cdot \\pi \\right)\\rho ^2\\cdot \\gamma \\left(\\sigma ^{2+2^{3+4}+4-6^5}\\cdot \\tau \\right)}{2\\phi ^3\\phi \\phi ^{\\phi }\\phi \\cdot 3\\chi ^5\\upsilon ^0\\cdot 2\\chi ^{\\psi ^{\\omega }}\\cdot 2\\alpha ^0\\cdot \\beta ^0\\cdot 3\\gamma ^{3+\\gamma }\\delta \\left(\\delta ^{2+2}\\cdot \\delta \\right)\\epsilon \\cdot \\varepsilon ^{2+2}\\left(\\zeta \\cdot 5\\right)5\\cdot \\eta \\left(5\\theta \\cdot \\theta \\right)\\iota \\cdot 5\\kappa \\left(2\\lambda \\cdot 3\\mu \\right)2\\nu ^3\\cdot \\xi \\left(\\pi \\cdot 2\\rho ^3\\right)2\\varsigma ^2\\cdot 2\\tau ^3}`

// let regexr3 = `\frac{\alpha ^2\cdot \gamma 5\delta \left(45\epsilon ^2\zeta ^3\eta \cdot \theta \iota -4\kappa 5\lambda \right)\mu \cdot \nu \left(\xi \cdot \pi \right)\rho ^2\cdot \gamma \left(\sigma ^{2+2^{3+4}+4-6^5}\cdot \tau \right)}{2\phi ^3\phi \phi ^{\phi }\phi \cdot 3\chi ^5\upsilon ^0\cdot 2\chi ^{\psi ^{\omega }}\cdot 2\alpha ^0\cdot \beta ^0\cdot 3\gamma ^{3+\gamma }\delta \left(\delta ^{2+2}\cdot \delta \right)\epsilon \cdot \varepsilon ^{2+2}\left(\zeta \cdot 5\right)5\cdot \eta \left(5\theta \cdot \theta \right)\iota \cdot 5\kappa \left(2\lambda \cdot 3\mu \right)2\nu ^3\cdot \xi \left(\pi \cdot 2\rho ^3\right)2\varsigma ^2\cdot 2\tau ^3}`

let corr1 = `\\frac{-y\\sin \\left(x^4-x^4y\\right)\\left(45x^4y^3-720x^4y^4-1\\right)+10x^4y^4\\left(36x^{x+x^y+y+13}-y\\right)}{-y+36x^{x+x^y+y+13}}`

let setOfVariables = []
let setOfConstants = []

const collectVariables = (matchObjArr) => {
	if (matchObjArr.length > 0) {
		let setOfVar   = new Set()
		let setOfConst = new Set()
		for (let i=0; i<matchObjArr.length; i++) {
			let operand    = matchObjArr[i].match
			if (operand == 'e' || operand == '\\pi ' || operand == '\\Pi ') {
				let constant = operand
				setOfConst.add(constant)
			} else {
				let variable = operand
				setOfVar.add(variable)
			}
  	}
		setOfConst.forEach( (_const) => {
			setOfConstants.push(_const)
		})
		setOfVar.forEach( (_var) => {
			setOfVariables.push(_var)
    })
    console.log('+-----COLLECTING VARS AND CONSTS--------\n|setOfConstants = ', setOfConstants)
    console.log('|setOfVariables = ', setOfVariables)
    console.log('+-----COLLECTING VARS AND CONSTS--------\n')
	}
}


const isLetter = (x) => {
  return /[a-zA-Z]/g.test(x)
}

const spliceString = (str, start, end, insert) => {
	let origStr = str
	let head = str.slice(0, start)
	let tail   = str.slice(end)
	let res = `${head}${insert}${tail}`
	let offset = origStr.length - res.length
	// console.log(`\norigStr = ${origStr}\nstart = ${start}\nend = ${end}\nhead = ${head}\ninsert = ${insert}\ntail = ${tail}\noffset = ${offset}\nresult = ${res}`)
	return { 
		str: res,
		offset 
	}
} 

const resolveExponents = (str) => {
	let origStr  = str
	let wBrack   = /\{\d+\^\d+\}/
	let WObrack  = /\d+\^\d+/
	let wPar     = /\\left\((\-)?\d+\\right\)\^\d+/
	let patt     = ''
	let isBracks = false
	let isPars   = false
	if (wBrack.test(str)) {
		patt     = wBrack
		isBracks = true
	} else if (WObrack.test(str)) {
		patt     = WObrack
	} else if (wPar.test(str)) {
		patt     = wPar
		isPars   = true
	}
	let match  = patt.exec(str);
	let start  = match.index
			match  = match[0]
	let end    = match.length + start
			match  = match.replace('{', '')
			match  = match.replace('}', '')
	let beg    = isPars ? 6 : 0
	let base   = match.slice(beg, match.indexOf(isPars ? '\\right' : '^'))
	let expon  = match.slice(match.indexOf('^') + 1)
	let power  = Math.pow(base, expon)
	let head   = str.slice(0, start)
	let tail   = str.slice(end)	
	let output = `${head}${power}${tail}`
	let output2 = `${head}!!!!!${power}!!!!!${tail}`  		
	console.log(`+---------------PROCESSING EXPONENTS------------------\n|origStr = ${origStr}\n|start = ${start}\n|end = ${end}\n|match = ${match}\n|base = ${base}\n|expon = ${expon}\n|power = ${power}\n|head = ${head}\n|\n|tail = ${tail}\n|\n|output2 = ${output2}\n|\n|wBrack.test(output) || WObrack.test(output) || wPar.test(output) = ${wBrack.test(output) || WObrack.test(output) || wPar.test(output)}\n+---------------PROCESSING EXPONENTS------------------`)
	if (wBrack.test(output) || WObrack.test(output) || wPar.test(output)) {
		output = resolveExponents(output)
	} 
	if (!wBrack.test(output) && !WObrack.test(output) && !wPar.test(output)) {
		// console.log('output = ', output)
		return output
	}
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

const simplifyDotMultiplication = (matchObjArr, _str, msg) => {
  let str         = _str
  let offset      = 0
  let logObj      = []
	for (let i=0; i<matchObjArr.length; i++) {
		let currStr   = matchObjArr[i].match
		let currStart = matchObjArr[i].start
		let currEnd		= matchObjArr[i].end
		let solution  = currStr.replaceAll('\\cdot ', '')
		if (( (currStr.includes('{') && currStr.includes('}')) || (!currStr.includes('{') && !currStr.includes('}')) ) && str[currStart-offset-1] != '^') {
      let matchedStr = `${str[currStart-offset-1]}|${currStr}|${str[currEnd-offset]}`
      let res     = spliceString(str, currStart-offset, currEnd-offset, solution)
			    str     = res.str
          offset += res.offset
          let obj = {}
          obj.matchedStr = matchedStr
          obj.insert     = solution
          logObj.push(obj)
			// console.log(`${msg}\n|isStepDone = ${isStepDone}\n|failSafe = ${failSafe}\n|str = ${str}\n|head = ${str.slice(0, currStart-offset)}\n|tail = ${str.slice(currEnd-offset)}\n|output str = ${res.str}\n|matchedStr = ${str[currStart-offset-1]}|${currStr}|${str[currEnd-offset]}\n|INSERT = ${solution}\n${msg}`)
		} 
  }
  console.log(`${msg}\n|failSafe = ${failSafe}\n|ORIG str = ${_str}\n|FINAL str = ${str}`)
  console.log('\n|logObj = ', logObj)
  console.log(`${msg}\n`)
  
	return str
}

const resolveProximateVariableMultiplication = (matchObjArr, _str) => {
	let str    = _str
	let offset = 0
	for (let i=0; i<matchObjArr.length; i++) {
		let currStr   = matchObjArr[i].match
		let currStart = matchObjArr[i].start
		let currEnd		= matchObjArr[i].end
		let numInstan = currStr.length
		let solution  = `${currStr[0]}^${numInstan}`
		let res       = spliceString(str, currStart-offset, currEnd-offset, solution)
				str       = res.str
				offset += res.offset 
	}
	return str
}

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

const simplificationPatterns = [
  {
    name:'variableCollection',
    patt: /(\\alpha\s|\\beta\s|\\gamma\s|\\Gamma\s|\\delta\s|\\Delta\s|(?<!c)d[a-zA-Z]|\\epsilon\s|\\varepsilon\s|\\zeta\s|\\eta\s|\\theta\s|\\Theta\s|\\vartheta\s|\\iota\s|\\kappa\s|\\lambda\s|\\Lambda\s|\\mu\s|\\nu\s|\\xi\s|\\Xi\s|\\pi\s|\\Pi\s|\\varpi\s|\\partial\s([a-zA-Z])?|\\rho\s|\\varrho\s|\\sigma\s|\\varsigma\s|\\Sigma\s|\\tau\s|\\upsilon\s|\\Upsilon\s|\\phi\s|\\varphi\s|\\chi\s|\\psi\s|\\Psi\s|\\omega\s|\\Omega\s)|(?<!(\\|\\(a|b|c|d|D|e|f|g|G|i|k|l|L|m|n|o|O|p|P|r|s|S|t|T|u|U|v|x|X|z)|\\ar|\\arc|\\arc|\\arcc|\\arccs|\\arcs|\\arcse|\\arcsec|\\arcsi|\\arcsin|\\arcco|\\arccos|\\arccot|\\arct|\\arcta|\\arctan|\\bi|\\bin|\\bino|\\cd|\\cdo|\\co|\\cos|\\cot|\\cs|\\di|\\fr|\\fra|\\in|\\inf|\\inft|\\le|\\lef|\\li|\\lo|\\pa|\\par|\\part|\\parti|\\partia|\\ri|\\rig|\\righ|\\se|\\sec|\\si|\\sin|\\sq|\\sqr|\\su|\\ta|\\tan))([a-zA-Z])/g
  },
	{
		name:'exponents'
  },
  {
    name:'dotMultiplicationOfAtLeastOneSingleVariable',
    patt: /(((\d+)(\^)?(\\)?([a-zA-Z]+)?(\s)?)(\^((\{)?(\+|\-|\^)?\w+(\+|\-|\^)?(\{)?(\})?)+)?(\\cdot\s)(\\)?[a-zA-Z]+(\s)?)|(\d+)?((\\)?[a-zA-Z]+(\s)?)(\^((\{)?(\+|\-|\^)?\w+(\+|\-|\^)?(\{)?(\})?)+)?(\\cdot\s)(\d+)?((\\)?[a-zA-Z]+(\s)?)|(((\\)?[a-zA-Z]+(\s)?)(\^((\{)?(\+|\-|\^)?\w+(\+|\-|\^)?(\{)?(\})?)+)?(?<!(\d+(\w+)?(\^((\{)?(\+|\-|\^)?\w+(\+|\-|\^)?(\{)?(\})?)+)?))(\\cdot\s)\d+(\\)?([a-zA-Z]+)?(\s)?)/g
  },
  {
    name: 'dotMultiplicationOfLeadingVarCoeffAndCoeff',
    patt: /(\d+(\\)?[a-zA-Z]+(\s)?(\^((\{)?(\+|\-|\^)?(\\)?([a-zA-Z]+|\d+)(\s)?(\+|\-|\^)?(\{)?(\})?)*)?(\\cdot\s)(\d+)(?!(\w+))(\^((\{)?(\+|\-|\^)?\w+(\+|\-|\^)?(\{)?(\})?)+)?)/g
  },
  {
    name: 'dotMultiplicationOfCoeffAndVarCoeff',
    patt: /((?<!(\w+|\w+\^))(\d+)(\^((\{)?(\+|\-|\^)?\d+(\+|\-|\^)?(\{)?(\})?)+)?(\\cdot\s)(\d+)((\\)?(\w+)(\s)?)+(\^((\{)?(\+|\-|\^)?(\\)?(\w+)(\s)?(\+|\-|\^)?(\{)?(\})?)+)?)/g
  },
  {
    name: 'dotMultiplicationOfIdenticalVariableExponents',
    patt: /\d+(\^((\{)?(\+|\-|\^)?(\\)?[a-zA-Z]+(\s)?(\+|\-|\^)?(\{)?(\})?)+)(\\cdot\s)\d+(\1)/g
  },
	{
		name:'proximateVariableMultiplicationWithExponents',
		patt: /(?<!((\)|\}|\|)\^))((((\w+|\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s))+)(?<=((\w+|\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s))+))(\^((\w+|\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s))+))+)|((?<!\\frac)(\{)?(\w|\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s))+(\^((?<!\\frac)(\{)?(\w|\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s))+(\^|\+|\-)?(?<!\\frac)(\{)?(\w|\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s))*(\})*(\^|\+|\-)?)+)+)+)/g
  },
  {
		name:'proximateVariableMultiplicationWithAlternationAndDuplication',
		patt: /(\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s)){2,}|([a-zA-Z](\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s)))([a-zA-Z](\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s))?)+|(\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s)(\w+))(\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s)(\w+)?)+|((\d+)(\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s)))((\d+)(\\(?!(cdot|div|sin)\s)(?<=\\)([a-zA-Z]+\s))?)+|(\d+([a-zA-Z]+))(\d+([a-zA-Z]+)?)+|(([a-zA-Z]+)\d+)(([a-zA-Z]+)(\d+)?)+|(?<!(\\|\\.|\\..|\\...|\\....|\\.....|\\......|\\.......|\\........))([a-zA-Z])([a-zA-Z])+/g
  },
	{
		name: 'likeTerms',
		patt: /(\+|\-)*(\d*(x\d*y|y\d*x)\d*)/g
	},
	{
		name: 'consolidate',
		patt: /(\+|\-)*(\d*(x\d*y|y\d*x)\d*)/g
	}
]

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

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

const filterAdjacentMatches = (matchObjArr) => {
	let output = []
	let lastEnd = ''
	for (let i=0; i<matchObjArr.length; i++) {
		if (matchObjArr.length > 1) {
			if (!lastEnd) {
				if (matchObjArr[i].end == matchObjArr[i+1].start) {
					output.push(matchObjArr[i])
					lastEnd = matchObjArr[i].end
				}
			} else if (i > 0 && matchObjArr[i].start == lastEnd) {
				output.push(matchObjArr[i])
				lastEnd = matchObjArr[i].end
			}
		}
	}
	return output
}

const areAdjacentMatchesExhausted = (matchObjArr) => {
	let outcome = true
	for (let i=0; i<matchObjArr.length; i++) {
		if (i > 0 && matchObjArr[i].start == matchObjArr[i-1].end) {
			outcome = false
		}
	}
	return outcome
}

const isKeyValueObject = (obj) => {
  let res = false
  obj.test = ''
  if (obj.hasOwnProperty('test') && !Array.isArray(obj)) {
    res = true
    delete obj.test
  }
  return res
}

// const switchOutMatchedSubstrWithRef = (str, begin, end, order) => {
//   let ref = `||${order}||`
//   return str.slice(0, begin) + ref + str.slice(end)
// }

const simplify = (_str, _step) => {
  let res = ''
	let str = _str
	let step = _step ? _step : 0
	let pattObj = simplificationPatterns[step]
	if (!pattObj || !pattObj.name) {
		return {
			str,
			step
		}
	}
	let name = pattObj.name
	let matchObjArr = ''
  let isStepDone  = true
  
  if (name == 'exponents') {
    // get only matches that are adjacent to each other, filter non-adjacent out
    matchObjArr = filterAdjacentMatches(matchObjArr) || []
    isStepDone  = areAdjacentMatchesExhausted(matchObjArr)
  } else {
    let patt = pattObj.patt
		// match object properties:
  		  matchObjArr = getAllMatchesAndPositions(str, patt)
		// console.log(`\nmatchObjArr = ${JSON.stringify(matchObjArr)}`)
  }
  
  // console.log(`+-----(1) BEFORE PROCESSING ---\n|LATEX STRING = ${_str}\n|step name = ${name}\n|matchObjArr = ${JSON.stringify(matchObjArr)}\n+-----(1) BEFORE PROCESSING ---\n`)
  // console.log(`\n>>>>>>>>> step -> ${step} (${simplificationPatterns[step].name})\n>>>>>>>>> matchObjArr.length -> ${matchObjArr.length}\n`)
  if (matchObjArr.length > 0 || name == 'exponents') {

    // console.log(`\n+===== BEFORE SWITCH =====\n|failSafe = ${failSafe}`)
    // console.log('|matchObjArr = ', matchObjArr)
    // console.log('|pattern name = ', name)
    // console.log(`+===== BEFORE SWITCH =====\n`)
    let lead = ''
    switch(name) {
      case 'variableCollection':
      // console.log('+-----ANALYSIS--------\n|pattern name = ', name)
      // console.log('|matchObjArr    = ', matchObjArr)
      // console.log('|str            = ', str)
      // console.log('|setOfVariables = ', setOfVariables)
      // console.log('|setOfConstants = ', setOfConstants)
      // console.log('+-----ANALYSIS--------\n')
        // return {
        //   str
        // }
        collectVariables(matchObjArr)
        break;
      case 'exponents':
        str = resolveExponents(str)
        break;
      case 'dotMultiplicationOfAtLeastOneSingleVariable':
        // console.log(`+-----ANALYSIS of ${name}--------`)
        // console.log('|matchObjArr    = ', matchObjArr)
        // console.log('|str            = ', str)
        // console.log('|setOfVariables = ', setOfVariables)
        // console.log('|setOfConstants = ', setOfConstants)
        // console.log('+-----ANALYSIS--------\n')
        // return {
        //   str
        // }
        lead = `\n+---------------PROCESSING ONE VAR MULT---------------`
        str        = simplifyDotMultiplication(matchObjArr, str, lead)
        break;
      case 'dotMultiplicationOfLeadingVarCoeffAndCoeff':
        // console.log(`+-----ANALYSIS of ${name}--------`)
        // console.log('|matchObjArr    = ', matchObjArr)
        // console.log('|str            = ', str)
        // console.log('|setOfVariables = ', setOfVariables)
        // console.log('|setOfConstants = ', setOfConstants)
        // console.log('+-----ANALYSIS--------\n')
        // return {
        //   str
        // }
        lead = `\n+---------------PROCESSING LEADING VAR MULT---------------`
        str        = simplifyDotMultiplication(matchObjArr, str, lead)
        break;
      case 'dotMultiplicationOfCoeffAndVarCoeff':
        console.log(`+-----ANALYSIS of ${name}--------`)
        console.log('|matchObjArr    = ', matchObjArr)
        console.log('|str            = ', str)
        console.log('|setOfVariables = ', setOfVariables)
        console.log('|setOfConstants = ', setOfConstants)
        console.log('+-----ANALYSIS--------\n')
        return {
          str
        }
        // res        = simplifyDotMultiplicationOfCoeffAndVarCoeff(matchObjArr, _str, isStepDone)
        // str        = res.str
        // isStepDone = res.isStepDone
        break;
      case 'dotMultiplicationOfIdenticalVariableExponents':
        console.log(`+-----ANALYSIS of ${name}--------`)
        console.log('|matchObjArr    = ', matchObjArr)
        console.log('|str            = ', str)
        console.log('|setOfVariables = ', setOfVariables)
        console.log('|setOfConstants = ', setOfConstants)
        console.log('+-----ANALYSIS--------\n')
        return {
          str
        }
        // res        = simplifyDotMultiplicationOfIdenticalVariableExponents(matchObjArr, _str, isStepDone)
        // str        = res.str
        // isStepDone = res.isStepDone
        break;
      case 'proximateVariableMultiplicationWithExponents':
        console.log(`+-----ANALYSIS of ${name}--------`)
        console.log('|matchObjArr    = ', matchObjArr)
        console.log('|str            = ', str)
        console.log('|setOfVariables = ', setOfVariables)
        console.log('|setOfConstants = ', setOfConstants)
        console.log('+-----ANALYSIS--------\n')
        return {
          str
        }
        // str = resolveProximateVariableMultiplicationWithExponents(matchObjArr, _str)
        break;
      case 'proximateVariableMultiplicationWithAlternationAndDuplication':
        console.log(`+-----ANALYSIS of ${name}--------`)
        console.log('|matchObjArr    = ', matchObjArr)
        console.log('|str            = ', str)
        console.log('|setOfVariables = ', setOfVariables)
        console.log('|setOfConstants = ', setOfConstants)
        console.log('+-----ANALYSIS--------\n')
        return {
          str
        }
        // str = resolveProximateVariableMultiplicationWithAlternationAndDuplication(matchObjArr, _str)
        break;
      case 'parentheticalMultiplication':
        str = processlikeTerms(matchObjArr, str)
        break;
      case 'likeTerms':
        str = processlikeTerms(matchObjArr, str)
        break;
      default:
        console.log('no operation was specified to process the given match')
    }

		if (isStepDone) {
			step++
		}
		
		if (step <= simplificationPatterns.length - 1) {
      // console.log(`\n>>>>>>>>> failSafe -> ${failSafe}`)
      // console.log(`\n>>>>>>>>> step -> ${step} (${simplificationPatterns[step].name})`)
      // console.log('\n>>>>>>>>> matchObjArr = ', matchObjArr)
      failSafe++
      if (failSafe == 20) {
        return {
          str,
          step
        }
      }
			res = simplify(str, step)
			str  = res.str
			step = res.step
		} else {
			return {
				str,
				step
			}
		}

  } else if (matchObjArr.length == 0 && step < simplificationPatterns.length - 1) {
    if (verbose) {
      console.log(`\n>>>>>>>>> step -> ${step} (${simplificationPatterns[step].name})\n>>>>>>>>> matchObjArr.length -> ${matchObjArr.length}\n`)
    }
    step++ // update (2) step
    res  = simplify(str, step)
		str  = res.str
		step = res.step
  } else if (matchObjArr.length == 0 && step == simplificationPatterns.length - 1) {
    res = {
			str,
			step
		}
  	return res
  }
	
	res = {
		str,
		step
	}
  return res

} // END simplify

// let res1 = simplify(str1)
// console.log(`\n+-------------\n|input   = ${str1}\n|\nresult   = ${res1.str}\n|corr1 = ${corr1}`)

let res2 = simplify(str2)
console.log(`\n+-------------\n|input   = ${str2}\n|\nresult   = ${res2.str}\n`)

// let res3 = simplify(str3)
// console.log(`\n+-------------\n|input   = ${str3}\n|\nresult   = ${res3.str}\n`)