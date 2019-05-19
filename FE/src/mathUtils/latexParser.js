// let lat = '\\frac{100}{x^2}'
// let lat = '\\frac{100}{x^{22}}'
let lat = '\\frac{\\sqrt[3]{27}}{x^{22}}'

// PATTERNS
const denom = {
	patt: /\\frac\{/g,
	str: '\\frac{'
}
const divis = {
	patt: /\}\{/g,
	str: '}{'
}
const endBrack = {
	patt: /\}/g,
	str: '}'
}
const lastBrace = {
	patt: /(\})(?!\{)/g,
	str: '}'
}
const lastNthrootBrack = {
	patt: /\]\{/g,
	str: ']{'
}
const sqrt = {
	patt: /\\sqrt\{/g,
	str: '\\sqrt{'
}
const nthroot = {
	patt: /\\sqrt\[/g,
	str: '\\sqrt['
}

const reservedPatt = /(\\binom|\\sqrt|\\frac|\\log|\\right|\\left|\\infty\s|\\int\s|\\ge\s|\\le\s|\\cdot\s|\\div\s|\\circ\s|\\ln\s|\\partial\s|\\lim\s|\\sum\s|\\sin\s|\\cos\s|\\tan\s|\\cot\s|\\csc\s|\\sec\s|\\sinh\s|\\cosh\s|\\tanh\s|\\coth\s|\\sech\s|\\arcsin\s|\\arccos\s|\\arctan\s|\\arccot\s|\\arccsc\s|\\arcsinh\s|\\arccosh\s|\\arctanh\s|\\arccoth\s|\\arcsech\s|\\times\s|\\rightarrow\s|\\overline|\\vec|\\in\s|\\forall\s|\\notin\s|\\exists\s|\\mathbb{R}|\\mathbb{C}\s|\\mathbb{N}\s|\\mathbb{Z}\s|\\pm\s)/g

const inputs = []

const SP_varInput = () => {
	let alpha = 'abcdefghijklmnopqrstuvwxyz'
	if (latex[0] != ' ') {
		for (let l = 0; l<alpha.length; l++) {
			let lowerCase = alpha[l]
			let upperCase = alpha[l].toUpperCase()
			if (latex[0] == lowerCase) {
				inputs.push(lowerCase)
				latex = latex.replace(lowerCase, '')
			} else if (latex[0] == upperCase) {
				inputs.push(upperCase)
				latex = latex.replace(upperCase, '')
			}
		}
	}
}

const SP_BrackInput = (obj) => {
	if (0 == latex.search(obj.patt)) {
		latex = latex.replace(obj.str, '')
		inputs.push(obj.str)
		// console.log(`i = ${i}, inputs = ${inputs}`)
	}
}

const SP_complexExp = (latex) => {
	let patt = /\^\{/g
	if (0 == latex.search(patt)) {
		
	}
}
const SP_NumInput = () => {
	let EXP = '^{'
	if (latex[0] != ' ') {
		for (let n = 0; n<9; n++) {
			if (latex[0] == '^') {
				inputs.push(EXP)
				if (latex[1] == '{') {
					latex = latex.replace('^{', '')
				} else {
					latex = latex.replace('^', '')
				}
			} else if (latex[0] == n) {
				inputs.push(n)
				latex = latex.replace(n, '')
			}
		}
	}
}
let latex = lat
let count = 0
let countLatexInputs = () => {
	while (latex.length > 0 && count < 20) {
		SP_BrackInput(denom) 
		SP_BrackInput(divis)
		SP_BrackInput(nthroot)
		SP_NumInput()
		SP_varInput()
		SP_BrackInput(lastBrace)
		SP_BrackInput(lastNthrootBrack)
		console.log('inputs = ', inputs)
		console.log('latex = ', latex)
		count++
	}
	
}

countLatexInputs(lat)
console.log('inputs = ', inputs)

let greekVars = [
	'\\alpha ',
  '\\beta ',
  '\\gamma ',
  '\\Gamma ',
  '\\delta ',
  '\\Delta ',
  '\\epsilon ',
  '\\varepsilon ',
  '\\zeta ',
  '\\eta ',
  '\\theta ',
  '\\Theta ',
  '\\vartheta ',
  '\\iota ',
  '\\kappa ',
  '\\lambda ',
  '\\Lambda ',
  '\\mu ',
  '\\nu ',
  '\\xi ',
  '\\Xi ',
  '\\pi ',
  '\\Pi ',
  '\\varpi ',
  '\\rho ',
  '\\varrho ',
  '\\sigma ',
  '\\varsigma ',
  '\\Sigma ',
  '\\tau ',
  '\\upsilon ',
  '\\Upsilon ',
  '\\phi ',
  '\\varphi ',
  '\\chi ',
  '\\psi ',
  '\\Psi ',
  '\\omega ',
  '\\Omega '
]

let reservedWords = [
	'\binom',
	'\frac',
	'\log',
	'\right',
	'\left',
	'\infty ',
	'\int ',
	'\ge ',
	'\le ',
	'\cdot ',
	'\div ',
	'\circ ',
	'\ln ',
	'\partial ',
	'\lim ',
	'\sum ',
	'\sin ',
	'\cos ',
	'\tan ',
	'\cot ',
	'\csc ',
	'\sec ',
	'\sinh ',
	'\cosh ',
	'\tanh ',
	'\coth ',
	'\sech ',
	'\arcsin ',
	'\arccos ',
	'\arctan ',
	'\arccot ',
	'\arccsc ',
	'\arcsinh ',
	'\arccosh ',
	'\arctanh ',
	'\arccoth ',
	'\arcsech ',
	'\times ',
	'\rightarrow ',
	'\overline',
	'\vec',
	'\in ',
	'\forall ',
	'\notin ',
	'\exists ',
	'\mathbb{R}',
	'\mathbb{C} ',
	'\mathbb{N} ',
	'\mathbb{Z} ',
	'\pm '
]

// (\\binom|
// \\sqrt|
// \\frac|
// \\log|
// \\right|
// \\left|
// \\infty\s|
// \\int\s|
// \\ge\s|
// \\le\s|
// \\cdot\s|
// \\div\s|
// \\circ\s|
// \\ln\s|
// \\partial\s|
// \\lim\s|
// \\sum\s|
// \\sin\s|
// \\cos\s|
// \\tan\s|
// \\cot\s|
// \\csc\s|
// \\sec\s|
// \\sinh\s|
// \\cosh\s|
// \\tanh\s|
// \\coth\s|
// \\sech\s|
// \\arcsin\s|
// \\arccos\s|
// \\arctan\s|
// \\arccot\s|
// \\arccsc\s|
// \\arcsinh\s|
// \\arccosh\s|
// \\arctanh\s|
// \\arccoth\s|
// \\arcsech\s|
// \\times\s|
// \\rightarrow\s|
// \\overline|
// \\vec|
// \\in\s|
// \\forall\s|
// \\notin\s|
// \\exists\s|
// \\mathbb{R}|
// \\mathbb{C}\s|
// \\mathbb{N}\s|
// \\mathbb{Z}\s|
// \\pm\s)




