let str = 'mq-root-block mq-hasCursor'

const rp = (str) => {
  patt = /(\w*mq-hasCursor)/g
  return str.match(patt) ? true : false
}

let x = rp(str)

console.log(x)