const fs = require('node:fs')
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
  default:
    f = w
}

if(argv.inspect) {
  const W = buildModel(f(N),w(N),N,K)
  console.log(solver.Solve(W))
  console.table(W.variables)
} else {
  const values = [...Array(N)].map((_, i) => i + 1).map(i => {
    const W = buildModel(f(N),w(N),N,i)
    const { result } = solver.Solve(W)
    console.log(result)
    return 1/result
  })
  fs.writeFile('out.json', JSON.stringify(values), console.log)
}
