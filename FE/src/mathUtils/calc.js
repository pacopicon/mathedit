const { ar, ar2, ar3, arExp, fs, fr, frExp, par, parExp, nthrt, power, logar} = require('./testStrings')

const { isCurrMatchAsimpleRef, parsIntoMult, log, baseLog, nthroot, production, processPars, processArithmetic, processSimpleFracs, processRoot, pow, processExponent, processLogarithm, processNaturalLogarithm, summateOrProduce, processSummation, tan, cos, cot, sin, sec, scs, getTrigonometricValue, processTrig} = require('./processors')

const { patterns} = require('./patterns')

let verbose = true
let stop = 20

  // currently there are >> 8 << patterns.  Please update every time you add another pattern.

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

const switchOutMatchedSubstrWithRef = (str, begin, end, order) => {
  let ref = `||${order}||`
  return str.slice(0, begin) + ref + str.slice(end)
}

const matchPattern = (str, arrOfPattObjByIndex, order) => {

  let patt = arrOfPattObjByIndex.pattern
  let pattName = arrOfPattObjByIndex.name
  let disqualifiers = arrOfPattObjByIndex.disqualifiers

  let matches = getAllMatchesAndPositions(str, patt)
  // let matches = str.match(patt)
  if (matches && matches.length > 0) {
    for (let i=0; i<matches.length; i++) {
      let matchAndPos = matches[i]
      let currMatch   = matchAndPos.match
      let currStart   = matchAndPos.start
      let currEnd     = matchAndPos.end
      
      if (disqualifiers && disqualifiers.length > 0) {
        let conditions = disqualifiers.length
        for (let k=0; k<disqualifiers.length; k++) {
          let disqualifier = disqualifiers[k]
          let verdict = isCurrMatchAsimpleRef(currMatch)
          if ( currMatch != disqualifier && !verdict ) {
            conditions--
            if (conditions == 0) {
              if (verbose) console.log(`(1)-------PATTERN-SUBBED-WITH-REF-----\n|pattern name = ${pattName}\n|verdict = ${verdict}\n|order = ${order}\n|currMatch = ${currMatch}\n|currStart = ${currStart}\n|disqualifiers = ${disqualifiers}\n+------------------`)
              return matchAndPos
            }
          }
        }
      } else if (!disqualifiers || disqualifiers.length == 0) {
        let verdict = isCurrMatchAsimpleRef(currMatch)
        if (!verdict || pattName == 'exponent') {
          if (verbose) console.log(`(1)-------PATTERN-SUBBED-WITH-REF--------\n|pattern name = ${pattName}\n|verdict = ${verdict}\n|order = ${order}\n|currMatch = ${currMatch}\n|disqualifiers = ${disqualifiers}\n+------------------`)
          return matchAndPos
        }
      }
    }
  } 
  return false
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

const isObjEmpty = (obj) => {
  let outcome = true
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      outcome = false
    }
  }
  return outcome
}

const checkIfStrIsOnlyRef = (str) => {
  let _str = str.slice(2, str.length-2)
  let num = Number(_str)
  return Number.isInteger(num) && Number.isFinite(num) && !Number.isNaN(num)
}



// START findUnnestedExp
const findUnnestedExp = (input) => {
  // input is composed of 4 properties: 
  let str = input.str // (1) string to be processed and also updated
  let checkStep = input.checkStep ? input.checkStep : 0 // (2) checkStep correlates to pattern string being checked against
  let refs = input.refs && isKeyValueObject(input.refs) ? {...input.refs} : {}  // (3) the refs object contains every subchild
  let order = input.order ? input.order : 0 // (4) each subchild is stored as a prop ID'ed by order in the refs object
  let currentPattern = patterns[checkStep].pattern
  let currentPatternName = patterns[checkStep].name
  let res = ''
  // match object properties:
  let matchAndPos = matchPattern(str, patterns[checkStep], order)
  let patternStr = matchAndPos.match
  let matchStart = matchAndPos.start
  let matchEnd   = matchAndPos.end

  if ((patternStr)) {

    let strWithRef = switchOutMatchedSubstrWithRef(str, matchStart, matchEnd, order)// update (1) string
                                                             // checkstep (2) is updated by recursively calling findUnnestedExp (see below)
     
    let processedStr = ''

    switch(currentPatternName) {
      case 'arithmetic':
        processedObj = processPars(processArithmetic(patternStr))
        break;
      case 'fraction':
        processedObj = processSimpleFracs(patternStr)
        break;
      case 'exponent':
        processedObj = processExponent(patternStr)
        break;
      case 'root':
        processedObj = processRoot(patternStr)
        break;
      case 'logarithm':
        processedObj = processLogarithm(patternStr)
        break;
      case 'naturalLogarithm':
        processedObj = processNaturalLogarithm(patternStr)
        break;
      case 'sum':
        processedObj = processSummation(patternStr)
        break;
      case 'trigFunction':
        processedObj = processTrig(patternStr, 'degrees')
        break;
      default:
        console.log('no operation was specified to process the given match')
    }
    
    refs[`||${order}||`] = processedObj                     // update (3) refs
    // { string: processedStr, algebra: '', latex: '' }

    if (verbose) console.log(`\n(2)------RESULT---------\n|strWithRef = ${strWithRef}\n|processedStr = ${JSON.stringify(processedObj)}\n+---------------\n`)

    order++                                                 // update (4) order
    input = { 
      str: strWithRef,
      checkStep,
      order,
      refs
    }

    // console.log('strWithRef = ', strWithRef)
  
    if (checkIfStrIsOnlyRef(strWithRef)) {
          // console.log('this path was chosen -> 1')
      return input
    } else {
            // console.log('this path was chosen -> 2')                                      
      if (order < stop) {
        res = findUnnestedExp(input)
      } else {
        res = {...input}
      }

    }
 
  } else if (!patternStr && checkStep < 7) {
    input.checkStep++ // update (2) checkStep
    if (verbose) console.log(`>>>>>>>>>checkStep -> ${input.checkStep} (${patterns[input.checkStep].name})\n`)
    if (order < stop) {
      res = findUnnestedExp(input)
    } else {
      res = {...input}
    }
  } else if (!patternStr && checkStep == 7) {
    // console.log('this path was chosen -> 3')
    input.checkStep = 0 // update (2) checkStep
    res = findUnnestedExp(input)
  }

  return res

} // END findUnnestedExp


const unzipRefs = (_str, refs) => {
  let str = _str
  for (let p in refs) {
    if (str.includes(p)) {
      str = str.replace(p, refs[p].string)
    }
  }

  if (str.includes('||')) {
    str = unzipRefs(str, refs)
  }
  return str
}

let convertLatexToJS = (input) => {
  let res = findUnnestedExp(input)
  res = unzipRefs(res.str, res.refs)
  return parsIntoMult(res)
}

// TESTING 

let input = ''
let res = ''

input = { str: ar3 }
res = convertLatexToJS(input)
exp = `1*a+2*b-b-(((5*a**q*(34*((5**3)**2)+((-3)**2))*nthroot(3**9, 27**5)*baseLog(10, 1000)*log(9)*summateOrProduce(3,6,'i**2', true)*sin(2))/(5*(a**q))*1*a+2*b`
console.log(`ar3 result = ${JSON.stringify(res)}\n`)
console.log(`expected result = ${exp}`)

'1a+2b-\frac{b-5a^q\left(34\cdot 5^{3^2}+\left(-3\right)^2\right)\sqrt[3^9]{27^5}\log _{10}\left(1000\right)cot\left(2\right)\ln \left(9\right)\sum _{i=3}^6\left(i^2\right)sin\left(2\right)}{5a^q\cdot \left(34\cdot 5^{3^2}+3^2\right)+\sqrt[3^9]{27^5}-\log _{10}\left(1000\right)+cot\left(2\right)\cdot \ln \left(9\right)-\sum _{i=3}^6\left(i^2\right)\div sin\left(2\right)}\cdot 1a+2b'
