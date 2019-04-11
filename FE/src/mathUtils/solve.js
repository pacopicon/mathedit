// contents:
// (1) unFOILtrinomial, a function that factorizes a trinomial into the product of two binomials........line 28

let trinomialPatt = ``

let trin = `24x^2-34x-45`

const primeFactorize = (str, sign) => {
	let num = Number(str)
	console.log('num = ', num)
	let setOfNumbersTillNum = []
	for (let i=0; i<num+1; i++) {
		if (num % i == 0) {
			let pair = [Number(sign+i)]
			pair.push(num/i)
			setOfNumbersTillNum.push(pair)
		}
	}
	return setOfNumbersTillNum
}

const isNeg = (numOrStr) => {
	let num = typeof numOrStr == 'string' ? Number(numOrStr) : numOrStr
	return 0 + num < 0
}

// (1)
const unFOILtrinomial = (str) => {
	let signPatt 			= /(\+|\-)/g
	let signs 				= [] 

	while (match = signPatt.exec(str)) {
		let obj       	= {}
				obj.index 	= match.index
    		obj.sign  	= match[0]
		signs.push(obj)
	}
	// if signs.length == 2, that means 'a' is unsigned positive, but we still need to register its '+' sign.  if signs.length == 3, that means that 'a' is negative, and that 'b' and 'c' are signed for positive or negative
	if (signs.length == 2) {
		let obj   			= {}
		obj.index 			= 0
		obj.sign  			= '+'

		signs.reverse().push(obj)
		signs.reverse()
	}
	let a 						= str.slice(0, str.indexOf('x'))
	let tempStr 			= str.replace('x', '')
	let b 						= str.slice(signs[1].index, tempStr.indexOf('x')+1)
	let c 						= str.slice(signs[2].index)
	let tempA 				= a.replace('-', '')
	let aFactors 			= primeFactorize(tempA, signs[0].sign)
	let tempC 				= c.replace('-', '')
	let cFactors 			= primeFactorize(tempC, signs[2].sign)
			b 						= Number(b)
			c 						= Number(c)
	let output 				= undefined

	for (let i=0; i<aFactors.length; i++) {
		for (let k=0; k<cFactors.length; k++) {
			let sum 			= (aFactors[i][0] * cFactors[k][0]) + (aFactors[i][1] * cFactors[k][1])
			let prod 			= cFactors[k][0] * cFactors[k][1]
			// console.log(`aFactors[i][0] (${aFactors[i][0]}) * cFactors[k][0]) (${cFactors[k][0]}) (= ${aFactors[i][0] * cFactors[k][0]}) + aFactors[i][1] (${aFactors[i][1]}) * cFactors[k][1]) (${cFactors[k][1]}) (= ${aFactors[i][1] * cFactors[k][1]}) ${sum}, prod = ${prod}`)
			if (sum == b && prod == c) {
				let signed1 = isNeg(cFactors[k][0]) ? cFactors[k][0] : `+${cFactors[k][0]}`
				let signed2 = isNeg(cFactors[k][1]) ? cFactors[k][1] : `+${cFactors[k][1]}`
				output = `(${aFactors[i][1]}x${signed1})(${aFactors[i][0]}x${signed2})`
			}
		}
	}
	return output
}

unFOILtrinomial(trin)