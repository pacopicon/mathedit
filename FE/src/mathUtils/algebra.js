const algebra = require('algebra.js');
const AlgebraLatex = require('algebra-latex')
const CQ = require("coffeequate");
// const Fraction = algebra.Fraction;
// const Expression = algebra.Expression;
// const Equation = algebra.Equation;

// const x = 'x'
// const y = 'y'

// const exp1 = new Expression(-1).multiply(x).multiply(11).multiply(y)
// const exp2 = new Expression(x).multiply(y).multiply(2)

// const exp3 = new Expression(45).multiply(x).multiply(y).multiply(2).multiply(y).multiply(4).multiply(x)

// const exp4 = new Expression(7).multiply(y)
// const exp5 = new Expression(8).multiply(x)
// const exp6 = exp4.subtract(exp5)

// const exp7 = new Fraction(exp3, exp6)

// // const exp5 = new Equation(exp1, 0)
// // const exp6 = algebra.toTex(exp5)

// console.log(exp1.toString());
// console.log(exp2.toString());
// console.log(exp3.toString());
// console.log(exp4.toString());
// console.log(exp5.toString());
// console.log(exp6.toString());
// console.log(exp7.toString());

// const latexInput1 = `1a+2b-\\frac{b-5a^q\\left(34\\cdot 5^{3^2}+\\left(-3\\right)^2\\right)\\sqrt[3^9]{27^5}\\log _{10}\\left(1000\\right)cot\\left(2\\right)\\ln \\left(9\\right)\\sum _{i=3}^6\\left(i^2\\right)sin\\left(2\\right)}{5a^q\\cdot \\left(34\\cdot 5^{3^2}+3^2\\right)+\\sqrt[3^9]{27^5}-\\log _{10}\\left(1000\\right)+cot\\left(2\\right)\\cdot \\ln \\left(9\\right)-\\sum _{i=3}^6\\left(i^2\\right)\\div sin\\left(2\\right)}\\cdot 1a+2b`
// const latexInput =  '9+8-7\\cdot 6\\left(5+4-3\\left(2\\right)\\left(6\\right)\\right)8-\\left(4\\right)2\\left(3\\right)'

// const LATEXalgebraObj = new AlgebraLatex().parseLatex(latexInput)
 
// // ... or parse from regular math string
// const mathInput = '1/sqrt(2)*x=10'
// const JSalgebraObj = new AlgebraLatex().parseMath(mathInput)
 
// console.log(`JS: ${LATEXalgebraObj.toMath()}`)
// console.log(`JS: ${JSalgebraObj.toMath()}`) 
// console.log(`LATEX: ${LATEXalgebraObj.toLatex()}`)
// console.log(`LATEX: ${JSalgebraObj.toLatex()}`) 

let cof1 = '-x*11*y+x*y*2-45*x*y*2*y4*x/(7*y-8*x)*98*x*y'
let solveFor = 'y'
let res1 = CQ(cof1).solve(solveFor)
console.log(res1)