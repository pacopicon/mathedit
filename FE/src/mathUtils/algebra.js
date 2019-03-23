var algebra = require('algebra.js');

var fr = algebra.Fraction;
var exp = algebra.Expression;
var eq = algebra.Equation;

let formula = ''

let x = new exp('x')

formula = x.add(3)

console.log(formula.toString())
console.log(formula)

// let y = new fr(1,3)

// let yy = new fr(1,2)

// formula = y.multiply(yy)

// console.log('fraction multiplication => ', formula.toString())

// let z = new exp("z");

// let eq1 = new eq(z.subtract(4).divide(9), z.add(6));
// console.log(eq1.toString());

// let eq2 = new eq(z.add(4).multiply(9), 6);
// console.log(eq2.toString());

// let eq3 = 'new eq(z.divide(2).multiply(7), new fr(1, 4))'

// eq4 = eval(eq3)
// console.log(eq4.toString());

// // let a = new exp("a").add(2);
// let a = new exp("a")
// let expo = 900
// formula = a.pow(expo);

// console.log("(" + a.toString() + `)^${expo} = ` + formula.toString());

// let answer = formula.eval({a: 2})

// console.log('answer = ', answer.toString())
