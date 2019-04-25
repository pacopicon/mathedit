let str1 = 'x^{2+2^{3+4}+4-7776}x'

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

const processNestedExponent = (_str) => {
	let str = _str
	let patt = /\}/g
	let output = getAllMatchesAndPositions(str, patt)
	// console.log('output = ', output)
	for (let i=0; i<output.length; i++) {
		let clBracket = output[i].match
		str = str.replace(clBracket, '')
		varArr.push(clBracket)
	}
}