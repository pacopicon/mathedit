export const parseLatex = (_latex, _inputs) => {
  let latex = _latex
  let inputs = _inputs
  const limit = 2*(latex.length)
  let   count = 0
  const HANDLE = /\\operatorname\{(arccosh|arccot|arccoth|arccsc|arcsinh|arcsec|arcsech|arctanh|sech)\}/g
  
  const RESERVED = /(\\text\{|:|=|>|<|\+|-|\\pm|\\cdot|\\times|\\div|\\frac\{|\}\{|(\})(?!\{)|\]\{|\||\'|\\sqrt\{|\\sqrt\[|!|\.|\\int|∂|\\partial(\s)?|\\left(\(|\[|\|)|\\right(\)|\]|\|)|\\binom\{|\\to|\\infty|\\ge(\s)?|\\le(\s)?|\\circ(\s)?|\\sum|\\prod|\\operatorname\{(arccosh|arccot|arccoth|arccsc|arcsinh|arcsec|arcsech|arctanh|sech)\}|\\begin\{pmatrix\}|\\end\{pmatrix\}|&|\\\\|\\rightarrow|\\overline\{|\\vec\{|\\in|\\forall|\\notin|\\exists|\\mathbb\{R\}|\\mathbb\{C\}|\\mathbb\{N\}|\\mathbb\{Z\}|\\alpha(\s)?|\\beta(\s)?|\\gamma(\s)?|\\Gamma(\s)?|\\delta(\s)?|\\Delta(\s)?|\\epsilon(\s)?|\\varepsilon(\s)?|\\zeta(\s)?|\\eta(\s)?|\\theta(\s)?|\\Theta(\s)?|\\vartheta(\s)?|\\iota(\s)?|\\kappa(\s)?|\\lambda(\s)?|\\Lambda(\s)?|\\mu(\s)?|\\nu(\s)?|\\xi(\s)?|\\Xi(\s)?|\\pi(\s)?|\\Pi(\s)?|\\varpi(\s)?|\\rho(\s)?|\\varrho(\s)?|\\sigma(\s)?|\\varsigma(\s)?|\\Sigma(\s)?|\\tau(\s)?|\\upsilon(\s)?|\\Upsilon(\s)?|\\phi(\s)?|\\varphi(\s)?|\\chi(\s)?|\\psi(\s)?|\\Psi(\s)?|\\omega(\s)?|\\Omega(\s)?|\\a|\\c|\\l|\\s|\\t|\\\s)/g

  // const RESERVED = /(\\text\{|:|=|>|<|\+|-|\\pm|\\cdot|\\times|\\div|\\frac\{|\}\{|(\})(?!\{)|\]\{|\||\'|\\sqrt\{|\\sqrt\[|!|\.|\\int|∂|\\partial(\s)?|\\left(\(|\[|\|)|\\right(\)|\]|\|)|\\binom\{|\\to|\\infty|\\ge(\s)?|\\le(\s)?|\\circ(\s)?|\\sum|\\prod|\\operatorname\{(arccosh|arccot|arccoth|arccsc|arcsinh|arcsec|arcsech|arctanh|sech)\}|\\begin\{pmatrix\}|\\end\{pmatrix\}|&|\\\\|\\rightarrow|\\overline\{|\\vec\{|\\in|\\forall|\\notin|\\exists|\\mathbb\{R\}|\\mathbb\{C\}|\\mathbb\{N\}|\\mathbb\{Z\}|\\alpha(\s)?|\\beta(\s)?|\\gamma(\s)?|\\Gamma(\s)?|\\delta(\s)?|\\Delta(\s)?|\\epsilon(\s)?|\\varepsilon(\s)?|\\zeta(\s)?|\\eta(\s)?|\\theta(\s)?|\\Theta(\s)?|\\vartheta(\s)?|\\iota(\s)?|\\kappa(\s)?|\\lambda(\s)?|\\Lambda(\s)?|\\mu(\s)?|\\nu(\s)?|\\xi(\s)?|\\Xi(\s)?|\\pi(\s)?|\\Pi(\s)?|\\varpi(\s)?|\\rho(\s)?|\\varrho(\s)?|\\sigma(\s)?|\\varsigma(\s)?|\\Sigma(\s)?|\\tau(\s)?|\\upsilon(\s)?|\\Upsilon(\s)?|\\phi(\s)?|\\varphi(\s)?|\\chi(\s)?|\\psi(\s)?|\\Psi(\s)?|\\omega(\s)?|\\Omega(\s)?|\\\s)/g

  const SUPER = '^{'
  const SUB = '_{'

  const SP_NumOrSuperOrSubInput = () => {
    if (latex[0] != ' ') {
      for (let n = 0; n<10; n++) {
        if (latex[0] == SUPER[0]) {
          if (latex[1] == '{') {
            inputs.push(SUPER)
            latex = latex.replace(SUPER, '')
          } else {
            inputs.push(SUPER[0])
            latex = latex.replace(SUPER[0], '')
          }
        } else if (latex[0] == SUB[0]) {
          if (latex[1] == '{') {
            inputs.push(SUB)
            latex = latex.replace(SUB, '')
          } else {
            inputs.push(SUB[0])
            latex = latex.replace(SUB[0], '')
          }
        } else if (latex[0] == n) {
          inputs.push(n)
          latex = latex.replace(n, '')
        } 
      }
    }
  }

  const pushLetters = (oldWord, inputs) => {
    let word = oldWord.replace('\\operatorname{', '')
        word = word.replace('}', '')
    for (let i=0; i<word.length; i++) {
      let letter = word[i]
      inputs.push(letter)
    }
    return inputs
  }

  const SP_varInput = () => {
    let alpha = 'abcdefghijklmnopqrstuvwxyz'
    if (latex[0] != ' ') {
      
      if (0 == latex.search(RESERVED)) {
        let match = ''
        while (match = RESERVED.exec(latex)) {
          let start = match.index
          let letter = match[0]
          if (start == 0) {
            // console.log('letter = ', letter)
            if (HANDLE.test(letter)) {
              // console.log('letter = ', letter)
              inputs = [...pushLetters(letter, inputs)]
            } else {
              inputs.push(letter)
            }
            // \\operatorname\{(arccosh|arccot|arccoth|arccsc|arcsinh|arcsec|arcsech|arctanh|sech)\}
            
            latex = latex.replace(letter, '')
          }
        }
      } else {
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
  }

  const addScriptBrace = (script) => {

    const INPUT = script == 'sub' ? SUB[0] : SUPER[0]
    const head = []
    const tail = []
    for (let i=0; i<inputs.length; i++) {
      if (inputs[i-2] == INPUT) {
        head.push('}')
        head.push(inputs[i])
      } else if (i == inputs.length - 1 && inputs[inputs.length - 2] == INPUT) {
        head.push(inputs[i])
        head.push('}')
      } else if (inputs[i] == INPUT) {
        head.push(inputs[i] + '{')
      } else {
        head.push(inputs[i])
      }	
    }
    inputs = [...head,...tail]
  }

	while (latex.length > 0 && count < limit) {
		// while (latex.length > 0) {
		SP_NumOrSuperOrSubInput()
		SP_varInput()
		// console.log('count = ', count)
		// console.log('latex = ', latex)
		// console.log('inputs = ', inputs)
		count++
	}
	// processSub()
		addScriptBrace('sub')
    addScriptBrace('super')
    return inputs
}
