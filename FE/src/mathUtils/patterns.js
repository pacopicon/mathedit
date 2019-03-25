const GREEK = `\\alpha|\\beta|\\gamma|\\delta|\\epsilon|\\zeta|\\eta|\\theta|\\iota|\\kappa|\\lambda|\\mu|\\nu|\\xi|\\pi|\\rho|\\sigma|\\tau|\\upsilon|\\phi|\\chi|\\psi|\\omega`

const letter = `\\w|${GREEK}`

const VAR = `((\\-)?\\d+(${letter})*|(\\-)?(${letter})+\\d*|\\|\\|\\d+\\|\\|)`

const OP = `(\\+|\\-|\\\\cdot\\s|\\\\cdot|\\\\div\\s|\\\\div)`

const buildExponentPattern = () => {
  const template = `(${OP})?(?<!(\\}\\^${VAR}))(\\\\left\\(|\\()?${VAR}(\\\\right\\)|\\))?\\^((?<!\\])(\\{)?${VAR})(\\^((?<!\\])(\\{)?${VAR}(\\})*))*`
  return new RegExp(template, 'g')
}

const buildArithPatt = () => {
  const OPEX = `(\\+|\\^|\\-|\\\\cdot\\s|\\\\cdot|\\\\div\\s|\\\\div)`
  const VAR_or_EXPR = `(${VAR})(${OP}?(${VAR}))*`
  const VAR_or_EXPREX = `(${VAR})(${OPEX}?(${VAR}))*`
  const NOT = `(\\}|ln\\s|\\}\\^${VAR_or_EXPR}|sin|cos|tan|cot|csc|sec)`
  const N_BF_L = `((?<!${NOT})\\\\left\\()*`
  const N_BF_R = `((?<!(${NOT}\\\\left\\(${VAR_or_EXPREX}))\\\\right\\))*`
  const template = `(${OP})?${N_BF_L}${VAR}${N_BF_R}((\\+|\\-(?=(${N_BF_L}${VAR}))|\\\\cdot\\s|\\\\cdot|\\\\div\\s|\\\\div)*${N_BF_L}${VAR}*${N_BF_R})*`
  return new RegExp(template, 'g')
}

const buildFractionPattern = () => {
  const template = `(${OP})?\\\\frac\\{((\\-)?\\d+(${letter})*|(\\-)?(${letter})+\\d*|(\\|\\|\\d+\\|\\|)+)\\}\\{((\\-)?\\d+(${letter})*|(\\-)?(${letter})+\\d*|(\\|\\|\\d+\\|\\|)+)\\}`
  return new RegExp(template, 'g')
}

const buildRootPattern = () => {
  const template = `(${OP})?(\\\\sqrt(\\[${VAR}\\])?\\{${VAR}\\})`
  return new RegExp(template, 'g')
}

const buildLogarithmPattern = () => {
  const logVar = `(\\-)?(\\\\left\\()*${VAR}(\\\\right\\))*((\\+|\\-(?=((\\\\left\\()*${VAR}))|\\\\cdot\\s|\\\\cdot|\\\\div\\s|\\\\div)*(\\\\left\\()*${VAR}*(\\\\right\\))*)*
  (\\-)?(\\\\left\\()*${VAR}(\\\\right\\))*((\\+|\\-(?=((\\\\left\\()*${VAR}))|\\\\cdot\\s|\\\\cdot|\\\\div\\s|\\\\div)*(\\\\left\\()*${VAR}*(\\\\right\\))*)*`
  const template = `(${OP})?\\\\log\\s\\_\\{${logVar}\\}\\\\left\\(${logVar}\\\\right\\)`
  return new RegExp(template, 'g')
}

const buildNaturalLogarithm = () => {
  const template = `(${OP})?(\\\\ln\\s\\\\left\\(${VAR}\\\\right\\))`
  return new RegExp(template, 'g')
}

const buildSummationPattern = () => {
  const template = `(${OP})?\\sum\s\_\{${VAR}((\=)${VAR})?\}\^(\{\\infty\s\}|${VAR}(\\left\()${VAR}(\\right\)))`
  return new RegExp(template, 'g')
}

const buildTrigPatt = () => {
  const template = `(${OP})?((sin|cos|tan|cot|csc|sec)\\\\left\\(${VAR}\\\\right\\))`
  return new RegExp(template, 'g')
}

exports.patterns = [
  {
    pattern: buildExponentPattern(),
    name: 'exponent',
    disqualifiers: []
  },
  {
    pattern: buildArithPatt(),
    name: 'arithmetic',
    disqualifiers: ['frac', 'sqrt', 'log', '_', 'right', 'left', 'ln', 'sum', 'tan', 'cos', 'sin', 'cot', 'csc', 'sec', 'i']
  },
  {
    pattern: buildFractionPattern(),
    name: 'fraction',
    disqualifiers: []
  },
  {
    pattern: buildRootPattern(),
    name: 'root',
    disqualifiers: []
  },
  {
    pattern: buildLogarithmPattern(),
    name: 'logarithm',
    disqualifiers: []
  },
  {
    pattern: buildNaturalLogarithm(),
    name: 'naturalLogarithm',
    disqualifiers: []
  },
  {
    pattern: buildSummationPattern(),
    name: 'sum',
    disqualifiers: []
  },
  {
    pattern: buildTrigPatt(),
    name: 'trigFunction',
    disqualifiers: []
  }
]