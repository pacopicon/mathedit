var algebra = require('algebra.js');

var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;

var exp = new Expression("x").add(2);

var exp2 = exp.pow(3);

var exp3 = new Expression("x")

var exp4 = exp2.add(exp3)

console.log(exp2.toString());

console.log(exp4.toString())
