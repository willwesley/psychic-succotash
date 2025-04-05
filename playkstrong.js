const { argv } = require('yargs')
const solver = require("javascript-lp-solver");
const buildModel = require("./kstrong-poa-model.js");

// number of agents
const N = argv.N || 20
// max size of coalitions
const K = argv.K || 1
// coverage requirement
const Z = argv.Z || 1

// coverage welfare
const w = n => i => (i < Z || i > n) ? 0 : 1;

// utility function
let f
switch(argv.F) {
  case 'mc':
    f = n => i => w(n)(i) - w(n)(i - 1)
    break
  case 'es':
    f = n => i => w(n)(i)/i
    break
  case 'star':
    const fact = n => n <= 0 ? 1 : n * fact(n-1);
    const sumna = j => j > 0 ? [...Array(j-1).keys()]
      .map(i => 1/fact(i))
      .reduce((a,b) => a + b, 0) : 0;
    f = n => i => fact(i-1)/(Math.E - 1) * (Math.E - sumna(i));
    break
}

if(argv.inspect) {
  const tests = [ 2, 3, 4, 20 ]
  tests.forEach(i => {
    const W = buildModel(f(i),w(i),i,K)
    console.log(`N=${i}: `, solver.Solve(W))
    i < 4 && console.table(W.variables)
  })
} else {
  ([...Array(N)].map((_, i) => i + 1)).forEach(i => {
    const W = buildModel(w(N),w(N),N,i)
    console.log(solver.Solve(W).result)
  })
}
