// SIMPLIFICATION TODO
// (1) Follow the simplification steps from Symbolab for the string below
// (2) Buy book on Math (e.g., the GRE book) in order to get a full set of simplification rules
// (3) First simplification strategy to tackle: add like terms
// (4) Figure out if Regular Expressions can addentify which terms are candidates for the adding like terms
// (5) The end goal: Type Latex in, get simplified latex out 

let verbose = true

let str1 = `-x11y+xy2-\\left(\\frac{\\left(45xy\\cdot 2y4x\\right)}{\\left(7yx-8xy-8xy\\right)}\\right)98xy`
let corr1 = `-9xy+3920x^2y^2`

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

const processAddLikeTerms = (matchObjArr, str) => {
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
		name: 'addLikeTerms',
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
	console.log(`\nLATEX STRING = ${_str}`)
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
	let patt = pattObj.patt
	let isStepDone = true
  // match object properties:
  let matchObjArr = getAllMatchesAndPositions(str, patt)
	console.log(`\nmatchObjArr = ${JSON.stringify(matchObjArr)}`)
			filtArr     = filterAdjacentMatches(matchObjArr) || []
			isStepDone  = areAdjacentMatchesExhausted(matchObjArr)

  if (filtArr.length > 0) {

    switch(name) {
      case 'addLikeTerms':
        str = processAddLikeTerms(filtArr, str)
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

  } else if (filtArr.length == 0 && step < simplificationPatterns.length - 1) {
    step++ // update (2) step
    if (verbose) console.log(`>>>>>>>>>step -> ${step} (${patterns[step].name})\n`)
    res  = simplify(str, step)
		str  = res.str
		step = res.step
  } else if (filtArr.length == 0 && step == simplificationPatterns.length - 1) {
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
console.log(`\n+-------------\n|input   = ${str1}\n|\nresult   = ${res.str}\n|correct = ${corr1}\n+-------------`)