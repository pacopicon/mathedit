const { fracStr, fracStr1, fracStr2, fracStr3, parStr, parStr1, parStr2, powStr, powParStr,
  mixStr, mixStr1, quad } = require('./testStrings')

const { parsIntoMult, insertPower, trim, nestProps } = require('../mathUtils/macroFns')

const { POW, ADD, SUB, MUL, OP_PO, CLO_BR, OP_NUM, NUM_DEN, OP_PAR, CLO_PAR, NUM, DENOM, FRAC, POWER, P_SES } = require('../mathUtils/VARS')

const { orderOperations } = require('../mathUtils/orderOperations')


console.log(`\nINIT => str = ${fracStr3} \n`)


const processStr = (_str, enclosure, verbose, stop) => {

  let res = orderOperations(verbose, stop, _str, enclosure)

  let ltxOutput = ''
  let jsOutput = ''
  let order = ''
  let str = ''

  if (enclosure.name != 'num' && res.str.includes('frac')) {
    ltxOutput = {...res.ltxOutput}
    jsOutput  = {...res.jsOutput}
    order     = res.order
    str       = res.str
    res       = orderOperations(verbose, stop, str, NUM, order, ltxOutput, jsOutput)
  }

  console.log(`res = ${JSON.stringify(res)}`)
  
  // console.log('<<AFTER orderOperations>>\n')
  // console.log(JSON.stringify(res))
  // console.log('\n<<AFTER orderOperations>>\n')
  ltxOutput = res.ltxOutput
  jsOutput = res.jsOutput
  ltxKeys = Object.keys(ltxOutput)
  jsKeys = Object.keys(jsOutput)
  keyLen = ltxKeys.length
  // VARS FOR TESTING ONLY, ERASE OR COMMENT OUT AFTER TESTING
  verbose = res.verbose
  // let stop = res.stop

  // let rest = {
  //   ltxOutput,
  //   jsOutput
  // } // this is not used yet

  if (keyLen != jsKeys.length) {
    return 'the number of latex properties does not match the number of js properties'
  }
  str = ''
  str = nestProps(str, keyLen-1, jsOutput)

  // if (str.includes('/') && verbose) {
  //   console.log(`INSIDE processStr===================\nstr = ${str}\nINSIDE processStr===================`)
  // }

  // str = trimDoubledPars(str)
  str = trim(str)

  return str

}

const mathObjIntoStr = (verbose, stop, latexStr) => {
  let jsStr = ''
  jsStr = processStr(latexStr, POWER, verbose, stop)
  if (verbose) {
    console.log(`\nINSIDE mathObjIntoStr=========== \n|jsStr after POWER, before NUM = ${jsStr}`)
  }
  jsStr = processStr(jsStr, P_SES, verbose, stop)
  // jsStr = processStr(jsStr, NUM, verbose, stop)  
  jsStr = insertPower(jsStr)
  jsStr = parsIntoMult(jsStr)
  return jsStr
}

module.exports = { mathObjIntoStr }