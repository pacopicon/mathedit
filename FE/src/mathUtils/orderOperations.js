const { POW, ADD, SUB, MUL, OP_PO, CLO_BR, OP_NUM, NUM_DEN, OP_PAR, CLO_PAR, NUM, DENOM, FRAC, POWER, P_SES } = require('./VARS')

const { negLookAhead, getIdxOfNestedNum } = require('../mathUtils/macroFns')

const orderOperations = (verbose, stop, str, _enclosure, _order, _ltxOutput, _jsOutput, _hasJSpars, specialIdx) => {

  // console.log(`SPOT\nstr = ${str}\n_enclosure = ${JSON.stringify(_enclosure)}\n_order = ${_order}\n_ltxOutput = ${JSON.stringify(_ltxOutput)}\n_jsOutput = ${JSON.stringify(_jsOutput)}\n_hasJSpars = ${_hasJSpars}\nspecialIdx = ${specialIdx}\n`)
 
  let ltxOutput = _ltxOutput ? {..._ltxOutput} : {}
  let order = _order ? _order : 0
  let jsOutput = _jsOutput ? _jsOutput : {}
  let enclosure = _enclosure
  let hasJSpars = _hasJSpars ? _hasJSpars : false

  // if (verbose) {
  //   console.log(`\nENTERING orderOperations============================>>> \n|order = ${order}\n|str = ${str} \nENTERING orderOperations============================>>>`)
  // }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
if (order < stop) { 
  // Private functions called inside the loop:

  // (1): power operator snipper:

  const searchAndReplaceSimplePair = (i, str, enclosure, order, ltxOutput, jsOutput, verbose, stop, iOfNxtOP, strAfterOpen) => {
    
    let encName = enclosure.name
    let indexOfSnip = i
    // let indexOfNextCLOSE = str.indexOf(enclosure.CLOSE)
    // let indexOfNextCLOSE = encName == NUM.name ? negLookAhead(str, '}', '}{') : str.indexOf(CLOSE)
    let indexOfNextCLOSE = encName == NUM.name ? negLookAhead(str, '}', '}{') : strAfterOpen.indexOf(CLOSE) + indexOfSnip
    let snip = str.slice(indexOfSnip, indexOfNextCLOSE)
    let begStr = ''
    let endStr = ''
    let iOfShortStr = str.indexOf(strAfterOpen) // unneeded.  Also erase in console.log entitled INSIDE searchAndReplaceSimplePair 

    if (encName == P_SES.name) {
      begStr = str.slice(0, indexOfSnip-6)
      endStr = str.slice(indexOfNextCLOSE+7)
    } else if (encName == POWER.name) {
      begStr = str.slice(0, indexOfSnip-1)
      endStr = str.slice(indexOfNextCLOSE+1)
    } else if (encName == NUM.name) {
      begStr = str.slice(0, indexOfSnip-6)
      endStr = str.slice(indexOfNextCLOSE+1)
      snip = snip.replace('}{', '/')
    }

    let group = `||${order}||`
    let newStr = begStr + group + endStr
    ltxOutput[group] = snip
    let last = snip.length - 1
    let expression = ''

    if (snip[0] != '(' && snip[last] != ')') {
      expression = `(${snip})`
    } else {
      expression = snip
    }

    // console.log(`expression = ${expression}`)    

    // if (verbose) { 
    //   console.log(`SNIP=========================================\n|snip = ${snip}\n|snip[0] = ${snip[0]}\n|snip[last] = ${snip[last]}\n|order = ${order}\n|encName = ${encName}\nSNIP=========================================`)
    // }

    jsOutput[group] = expression

    if (verbose) {
      console.log(`\nINSIDE searchAndReplaceSimplePair============================>>>\n|snip = ${snip} \n|iOfShortStr = ${iOfShortStr} \n|in_str = ${str} \n|indexOfSnip = ${indexOfSnip} \n|iOfNxtOP = ${iOfNxtOP} \n|indexOfNextCLOSE = ${indexOfNextCLOSE} \n|strAfterOpen = ${strAfterOpen} \n|str.slice(indexOfSnip) = ${str.slice(indexOfSnip)} \n|str.slice(indexOfNextCLOSE) = ${str.slice(indexOfNextCLOSE)} \n|out_str = ${newStr} \n|jsOutput = ${JSON.stringify(jsOutput)} \n|expression = ${expression} \n|order = ${order} \n|encName = ${encName} \nINSIDE searchAndReplaceSimplePair============================>>>`)
    }

    order++

    const limit = 20

    if (order > limit) {
      console.log(`LIMIT OF ${limit} REACHED, RETURNING`)
      return {
        order,
        ltxOutput,
        jsOutput,
        str: newStr,
        verbose,
        stop
      }
    } else {
      let res = orderOperations(verbose, stop, newStr, enclosure, order, ltxOutput, jsOutput, hasJSpars)
      order = res.order
      ltxOutput = {...res.ltxOutput}
      jsOutput = {...res.jsOutput}
      newStr = res.str
      stop = res.stop

      // if (verbose) {
      //   console.log(`\nAfter orderOperations call => \norder = ${order}, \nnewStr = ${newStr}, \nltxOutput = ${JSON.stringify(ltxOutput)}, \njsOutput = ${JSON.stringify(jsOutput)}, \nenclosure.name = ${enclosure.name} \n<<END searchAndReplaceSimplePair>>`)
      // }

      return {
        order,
        ltxOutput,
        jsOutput,
        str: newStr,
        verbose,
        stop
      }
    
    }

    
  } // END searchAndReplaceSimplePair

  let encName = enclosure.name
  let OPEN = enclosure.OPEN
  let CLOSE = enclosure.CLOSE
  let operator = enclosure.operator
  let braceWidth = enclosure.braceWidth

  // if (verbose) {
  //   console.log(`\n<<BEFORE LOOP>>\nstr = ${str}, \nOPEN = ${OPEN}, \nCLOSE = ${CLOSE}, \nstr has OPEN AND CLOSE? => ${str.includes(OPEN) && str.includes(CLOSE)}, \norder = ${order}, \nencName = ${encName}`)
  // }

  // if (verbose) {
  //   console.log(`\nBEFORE CONDITIONAL============================>>> \n|order = ${order}\n|str = ${str}\n|str.includes(OPEN) && str.includes(CLOSE) = ${str.includes(OPEN) && str.includes(CLOSE)} \nBEFORE CONDITIONAL============================>>>`)
  // }

  if (str.includes(OPEN) && str.includes(CLOSE)) {

    for (let i=0; i<str.length; i++) {
      // if (verbose) {
      //   console.log(`\nINSIDE CONDITIONAL no 1 ============================>>> \n|order = ${order}\n|str = ${str}\n|encName = ${encName} \nINSIDE CONDITIONAL no 1 ============================>>>`)
      // }

      let condition = '' 
      
      if (encName == NUM.name) { 
        condition = getIdxOfNestedNum(str, i, order) // looking for the beginning of a non-nested numerator
        // if (verbose) {
        //   console.log(`\nINSIDE CONDITIONAL no 2 ============================>>> \n|order = ${order}\n|str = ${str}\n|getIdxOfNestedNum(str, i, order) = ${getIdxOfNestedNum(str, i, order)} \nINSIDE CONDITIONAL no 2 ============================>>>`)
        // }
      } else {
        condition = str.substr(i, braceWidth) == OPEN
      }   

      if (condition) {
        let startIdx = i
        let currIdx = startIdx + braceWidth
        i += braceWidth // fast-forward to index after opening power brace
        let strAfterOpen = str.slice(currIdx)
        // let iOfNxtOP = strAfterOpen.indexOf(OPEN)
        let iOfNxtOP = encName == NUM.name ? negLookAhead(strAfterOpen, '\\frac{', '\\frac{\\frac{') : strAfterOpen.indexOf(OPEN)
        let indexOfNextCLOSE = encName == NUM.name ? negLookAhead(strAfterOpen, '}', '}{') : strAfterOpen.indexOf(CLOSE)

        // if (verbose) {
        //   console.log(`\n<1--INDEX MONITOR>\niOfNxtOP = ${iOfNxtOP}, \nindexOfNextCLOSE = ${indexOfNextCLOSE}, \n-->str = ${str}, \n\n-->strAfterOpen = ${strAfterOpen}, \norder = ${order} \n<1--INDEX MONITOR>`)
        // }
        
        if (iOfNxtOP < indexOfNextCLOSE && iOfNxtOP != -1) {
    
          continue
          
        } else if (typeof iOfNxtOP == 'undefined' || iOfNxtOP == -1 || iOfNxtOP > indexOfNextCLOSE) {
          // if (verbose) {
          //   console.log(`\n<2--INDEX MONITOR>\niOfNxtOP = ${iOfNxtOP}, \nindexOfNextCLOSE = ${indexOfNextCLOSE}, \n-->str = ${str}, \n\n-->strAfterOpen = ${strAfterOpen}, \norder = ${order} \<2--INDEX MONITOR>`)
          // }

          let res = ''
          if (encName == POWER.name) {
            
          }
          if (encName == P_SES.name || encName == POWER.name || encName == NUM.name) {
            res = searchAndReplaceSimplePair(i, str, enclosure, order, ltxOutput, jsOutput, verbose, stop, iOfNxtOP, strAfterOpen)
          }
          let beforeStr = str
          let beforeLtxOutput = {...res.ltxOutput}
          let beforeJsOutput = {...res.jsOutput}

          order = res.order
          ltxOutput = {...res.ltxOutput}
          jsOutput = {...res.jsOutput}
          str = res.str
          verbose = res.verbose
          stop = res.stop

          order = res.order
          ltxOutput = {...res.ltxOutput}
          jsOutput = {...res.jsOutput}
          str = res.str
          verbose = res.verbose
          stop = res.stop

          if (order > 15) {
            return {
              ltxOutput,
              jsOutput,
              order,
              enclosure,
              str,
              hasJSpars,
              verbose,
              stop
            }
          }
        } else {
          return 'Number of opening power braces does not match the number of closing braces'
        }
      } else {
        // the enclosure here should be switched
        // the return below is only for testing
        // return output
        
      }
    }
  } else if (!hasJSpars) {
    group = `||${order}||`
    ltxOutput[group] = str

    let exp = ''
    let last = str.length - 1
    if (str[0] == '(' && str[last] == ')') {
      exp = str
    } else {
      exp = `(${str})`
    }
    
    jsOutput[group] = exp
    // if (verbose) {
      console.log(`\nINSIDE hasJSpars CONDITION============================>>> \n|enclosure.name = ${enclosure.name} \n|str = ${str} \n|order = ${order} \n|exp = ${exp} \n|ltxOutput = ${JSON.stringify(ltxOutput)} \n|jsOutput = ${JSON.stringify(jsOutput)} \nINSIDE hasJSpars CONDITION============================>>>`)
    // }
    hasJSpars = true
    
  }
    
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////
} 

  return {
    ltxOutput,
    jsOutput,
    order,
    enclosure,
    str,
    hasJSpars,
    verbose,
    stop
  }
} // END OF orderOperations

module.exports = { orderOperations }