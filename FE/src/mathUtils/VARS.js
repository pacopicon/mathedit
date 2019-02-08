const POW = '^'
const ADD = '+'
const SUB = '-'
const MUL = '*'
const OP_PO = '^{'
const CLO_BR = '}'
const OP_NUM = '\\frac{'
const NUM_DEN = '}{'
const OP_PAR = '\\left('
const CLO_PAR = '\\right)'
const NUM = {
  name: 'num',
  OPEN: OP_NUM,
  CLOSE: NUM_DEN,
  braceWidth: 6
}
const DENOM = {
  name: 'denom',
  OPEN: NUM_DEN,
  CLOSE: CLO_BR,
  CLOSE_PATT: /\}(?!\{)/g,
  braceWidth: 2
}
const FRAC = {
  name: 'frac',
  OPEN: NUM.OPEN,
  CLOSE: DENOM.CLOSE,
  braceWidth: 6
}
const POWER = {
  name: 'power',
  OPEN: OP_PO,
  CLOSE: CLO_BR,
  operator: POW,
  braceWidth: 2
}
const P_SES = {
  name: 'parentheses',
  OPEN: OP_PAR,
  CLOSE: CLO_PAR,
  braceWidth: 6
}

module.exports = {
  POW,
  ADD,
  SUB,
  MUL,
  OP_PO,
  CLO_BR,
  OP_NUM,
  NUM_DEN,
  OP_PAR,
  CLO_PAR,
  NUM,
  DENOM,
  FRAC,
  POWER,
  P_SES
}