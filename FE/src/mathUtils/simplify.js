// SIMPLIFICATION TODO
// (1) implement simplification steps in this order:
//		(a) Resolve all (nested) exponents
//		(b) get product of all adjacent factors
//		(c) Add like terms
// (2) Make sure to test strings with only one match for simplification type.  You want to ascertain that getAllMatchesAndPositions() will get matches and positions for singleton strings with the 'g' flag.  If not, you will have to take the flag out of all the RegExp patterns and derive the 'lastIndex' of the matched string from its length and its starting position. 
// (5) The end goal: Type Latex in, get simplified latex out 

let verbose = true

let str1 = `-x^{2^{2^4}}\\sqrt[3]{x}11y^{3^{2^4}}\\sqrt[3]{27}+x^{4^2}\\sqrt[y]{27}y^{5^2}2+y^{3^{2^4}}x^{2^{2^4}}2-\\left(\\frac{\\left(45x^{4^4}y\\cdot 2y^{x^4}4x^{x^y}\\cdot 6y^3x^2\\right)}{\\left(7yx-8xy-8xy\\cdot \\sqrt{25}\\right)}\\right)98xy+\\left(-5\\right)^6`
let regexr1 = `-x^{2^{2^4}}\sqrt[3]{x}11y^{3^{2^4}}\sqrt[3]{27}+x^{4^2}\sqrt[y]{27}y^{5^2}2+y^{3^{2^4}}x^{2^{2^4}}2-\left(\frac{\left(45x^{4^4}y\cdot 2y^{x^4}4x^{x^y}\cdot 6y^3x^2\right)}{\left(7yx-8xy-8xy\cdot \sqrt{25}\right)}\right)98xy+\left(-5\right)^6`

const isLetter = (x) => {
  return /[a-zA-Z]/g.test(x)
}

const spliceString = (str, start, end, insert) => {
	let origStr = str
	let head = str.slice(0, start)
	let tail   = str.slice(end)
	let res = `${head}${insert}${tail}`
	let reduction = origStr.length - res.length
	console.log(`\norigStr = ${origStr}\nstart = ${start}\nend = ${end}\nhead = ${head}\ninsert = ${insert}\ntail = ${tail}\nreduction = ${reduction}\nresult = ${res}`)
	return { 
		str: res,
		reduction 
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
	// console.log(`+-------------\n|origStr = ${origStr}\n|start = ${start}\n|end = ${end}\n|match = ${match}\n|base = ${base}\n|expon = ${expon}\n|power = ${power}\n|head = ${head}\n|\n|tail = ${tail}\n|\n|output2 = ${output2}\n|\n|wBrack.test(output) || WObrack.test(output) = ${wBrack.test(output) || WObrack.test(output)}\n+-------------`)
	if (wBrack.test(output) || WObrack.test(output) || wPar.test(output)) {
		output = resolveExponents(output)
	} 
	if (!wBrack.test(output) && !WObrack.test(output) && !wPar.test(output)) {
		// console.log('output = ', output)
		return output
	}
}

const processlikeTerms = (matchObjArr, str) => {
	// console.log(`\nmatchObjArr = ${JSON.stringify(matchObjArr)}`)
	let mathString = ''
	let setOfLetters = new Set()
	let reduction = 0
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
			res 			 = spliceString(str, currStart-reduction, currEnd-reduction, '')
			str 			 = res.str
			// console.log(`\n${i}${i == 1 ? 'st' : (i == 2 ? 'nd' : (i == 3 ? 'rd' : 'th'))} str = ${str}`)
			reduction += res.reduction
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
			res = spliceString(str, currStart-reduction, currEnd-reduction, strRes)
			str = res.str
			// console.log(`\nlast str = ${str}`)
		}
	}
	return str
}

const simplificationPatterns = [
	{
		name:'exponents',
		patt: /((((\\left\()(?=((\+|\-)?\w+\\right\))))?(\+|\-)?\w+((?<=((\\left\()(\+|\-)?\w+))(\\right\)))?)(?=\^)(?<!\}(\^))\^(\{)?)*(?<=\^)(\w+)(\})?((?<=\})(\}))?/g
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
	let patt = ''
	let matchObjArr = ''
	let isStepDone  = true
  
	if (name != 'exponents') {
			patt        = pattObj.patt
		// match object properties:
  		matchObjArr = getAllMatchesAndPositions(str, patt)
		// console.log(`\nmatchObjArr = ${JSON.stringify(matchObjArr)}`)
			matchObjArr = filterAdjacentMatches(matchObjArr) || []
			isStepDone  = areAdjacentMatchesExhausted(matchObjArr)
	} else {
		  
	}
	console.log(`+-----(1) BEFORE PROCESSING ---\n|LATEX STRING = ${_str}\n|step name = ${name}\n|matchObjArr = ${JSON.stringify(matchObjArr)}\n+-----(1) BEFORE PROCESSING ---\n`)
  if (matchObjArr.length > 0 || name == 'exponents') {

    switch(name) {
      case 'exponents':
        str = resolveExponents(str)
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
			res = simplify(str, step)
			str  = res.str
			step = res.step
			// console.log(`\nRECURSION\nstr = ${str}\nstep = ${step}`)
		} else {
			return {
				str,
				step
			}
		}

  } else if (matchObjArr.length == 0 && step < simplificationPatterns.length - 1) {
    step++ // update (2) step
    if (verbose) console.log(`>>>>>>>>>step -> ${step} (${patterns[step].name})\n`)
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

let res = simplify(str1)
console.log(`\n+-------------\n|input   = ${str1}\n|\nresult   = ${res.str}`)