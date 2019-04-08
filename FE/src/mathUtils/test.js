
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

const spliceString = (str, start, end, insert) => {
	// console.log(`\nstr = ${str}\nstart = ${start}\nend = ${end}\ninsert = ${insert}`)
	let origStr = str
	let head    = str.slice(0, start)
	let tail    = str.slice(end)
	let res     = `${head}${insert}${tail}`
	let offset  = origStr.length - res.length
	console.log(`\norigStr = ${origStr}\nstart = ${start}\nend = ${end}\nhead = ${head}\ninsert = ${insert}\ntail = ${tail}\noffset = ${offset}\nresult = ${res}`)
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

const isLetter = (x) => {
  return /[a-zA-Z]/g.test(x)
}

const isNum = (x) => {
  return /\d+/g.test(Number(x))
}

const canBeEvaled = (str) => {
	try {
		return typeof eval(str) == 'number'
	} catch (err) {
		return false
	}
}

const resolveProximateFactors = (matchObjArr, _str) => {
	let str    = _str
	let brackPatt = /\{(\w+(\+|\-|\^)\w+)\}/
	let offset = 0
	let coefficients = []
	const processBracket = (currStr) => {
		let exponent = ''
		let match = brackPatt.exec(currStr)
			let brackContents = match[0]
					brackContents = brackContents.replace('{', '')
					brackContents = brackContents.replace('}', '')
			if (canBeEvaled(brackContents)) {
				exponent += eval(brackContents)
			} else {
				exponent += brackContents
			}
			currStr.replace(match[0], '')
			if (brackPatt.test(currStr)) {
				res      = processBracket(currStr)
				currStr  = res.currStr
				exponent = res.exponent
			} 
			if (!brackPatt.test(currStr)) {
				return {
					currStr,
					exponent
				}
			}
	}
	for (let i=0; i<matchObjArr.length; i++) {
		let currStr   = matchObjArr[i].match
		let currStart = matchObjArr[i].start
		let currEnd		= matchObjArr[i].end
		let exponent  = ''

		if (brackPatt.test(currStr)) {
			let res  = processBracket(currStr)
			currStr  = res.currStr
			exponent += res.exponent
		} else if (currStr.includes('^')) {
			exponent += currStr[currStr.indexOf('^') + 1]
		}
		
		for (let k=0; k<currStr.length; k++) {
			let char = currStr[i]
			if (isNum(char)) {
				coefficients.push(char)
			}
		}
		
		let numInstan = currStr.length
		let solution  = `${currStr[0]}^${numInstan}`
		let res       = spliceString(str, currStart-offset, currEnd-offset, solution)
				str       = res.str
				offset += res.offset 
	}
	return str
}

console.log('matchObjArr1 = ', matchObjArr1)

let res1 = resolveProximateFactors(matchObjArr1, str1)
console.log('res1 = ', res1)

const buildProxFactorPatt = () => {
  let VAR = `(\1(\^\w+)?)?`.repeat(10)
  let template = `(\w)(\^\w+)?(\1(\^\w+)?)` 
  return new RegExp(template)
}

let res = buildProxFactorPatt()
console.log(res)



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

