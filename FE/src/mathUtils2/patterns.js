buildTrigPatt = (op) => {
  let template = `${op}\\\\left\\(((\\-)?\\d+\\w*|(\\-)?\\w+\\d*|\\|\\|\\d+\\|\\|)\\\\right\\)`
  return new RegExp(template, 'g')
}

const buildArithPatt = () => {
  let VAR = `((\\-)?\\d+\\w*|(\\-)?\\w+\\d*|\\|\\|\\d+\\|\\|)`
  let OP = `(\\+|\\-|\\\\cdot\\s|\\\\cdot|\\\\div\\s|\\\\div)`
  let OPEX = `(\\+|\\^|\\-|\\\\cdot\\s|\\\\cdot|\\\\div\\s|\\\\div)`
  let VAR_or_EXPR = `(${VAR})(${OP}?(${VAR}))*`
  let VAR_or_EXPREX = `(${VAR})(${OPEX}?(${VAR}))*`
  let NOT = `(\\}|ln\\s|\\}\\^${VAR_or_EXPR}|sin|cos|tan|cot|csc|sec)`
  let N_BF_L = `((?<!${NOT})\\\\left\\()*`
  let N_BF_R = `((?<!(${NOT}\\\\left\\(${VAR_or_EXPREX}))\\\\right\\))*`
  let template = `(\\-)?${N_BF_L}${VAR}${N_BF_R}((\\+|\\-(?=(${N_BF_L}${VAR}))|\\\\cdot\\s|\\\\cdot|\\\\div\\s|\\\\div)*${N_BF_L}${VAR}*${N_BF_R})*`
  return new RegExp(template, 'g')
}

exports.patterns = [
  {
    pattern: /(\-)?(?<!(\}\^((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)))(\\left\(|\()?((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)(\\right\)|\))?\^((?<!\])(\{)?((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|))(\^((?<!\])(\{)?((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)(\})*))*/g,
    name: 'exponent',
    disqualifiers: []
  },
  {
    pattern: buildArithPatt(),
    name: 'arithmetic',
    disqualifiers: ['frac', 'sqrt', 'log', '_', 'right', 'left', 'ln', 'sum', 'tan', 'cos', 'sin', 'cot', 'csc', 'sec', 'i']
  },
  {
    // pattern: /\\frac\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}\{(\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\}/g,
    pattern: /(-)?\\frac\{((\-)?\d+\w*|(\-)?\w+\d*|(\|\|\d+\|\|)+)\}\{((\-)?\d+\w*|(\-)?\w+\d*|(\|\|\d+\|\|)+)\}/g,
    name: 'fraction',
    disqualifiers: []
  },
  {
    pattern: /\\sqrt(\[((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)\])?\{((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)\}/g,
    name: 'root',
    disqualifiers: []
  },
  {
    pattern: /(\-)?\\log\s\_\{(\-)?(\\left\()*((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)(\\right\))*((\+|\-(?=((\\left\()*((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)))|\\cdot\s|\\cdot|\\div\s|\\div)*(\\left\()*((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)*(\\right\))*)*\}\\left\((\-)?(\\left\()*((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)(\\right\))*((\+|\-(?=((\\left\()*((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)))|\\cdot\s|\\cdot|\\div\s|\\div)*(\\left\()*((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)*(\\right\))*)*\\right\)/g,
    name: 'logarithm',
    disqualifiers: []
  },
  {
    pattern: /\\ln\s\\left\((\d+|\w+|\|\|\d+\|\||\|\|\w+\|\|)\\right\)/g,
    name: 'naturalLogarithm',
    disqualifiers: []
  },
  {
    pattern: /(\-)?\\sum\s\_\{((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)((\=)((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|))?\}\^(\{\\infty\s\}|((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)(\\left\()((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)(\\right\)))/g,
    name: 'sum',
    disqualifiers: []
  },
  {
    pattern: /(sin|cos|tan|cot|csc|sec)\\left\(((\-)?\d+\w*|(\-)?\w+\d*|\|\|\d+\|\|)\\right\)/g,
    name: 'trigFunction',
    disqualifiers: []
  }
]