const solver = require("javascript-lp-solver");
const buildModel = require("./poa-model.js");


// coverage welfare
const w = n => i => (i === 0 || i === n+1) ? 0 : 1;

// mc utility
const fmc = i => i === 1 ? 1 : 0;

const cmc2 = buildModel(fmc,w(2),2)
console.log("cover mc 2: ", solver.Solve(cmc2))
const cmc3 = buildModel(fmc,w(3),3)
console.log("cover mc 3: ", solver.Solve(cmc3))
const cmc20 = buildModel(fmc,w(20),20)
console.log("cover mc 20: ", solver.Solve(cmc20))
// not sure what to make of the same thetas coming out above.
//console.log(cmc2, cmc3, cmc20)


// es utility
const fes = i => i > 0 ? 1/i : 0;

const ces2 = buildModel(fes,w(2),2)
console.log("cover es 2: ", solver.Solve(ces2))
const ces3 = buildModel(fes,w(3),3)
console.log("cover es 3: ", solver.Solve(ces3))
const ces20 = buildModel(fes,w(20),20)
console.log("cover es 20: ", solver.Solve(ces20))
//console.log(ces2, ces3, ces20)


// fstar utility
const fstar = i => i > 0 ? 1/i : 0;

const cstar2 = buildModel(fstar,w(2),2)
console.log("cover star 2: ", solver.Solve(cstar2))
const cstar3 = buildModel(fstar,w(3),3)
console.log("cover star 3: ", solver.Solve(cstar3))
const cstar20 = buildModel(fstar,w(20),20)
console.log("cover star 20: ", solver.Solve(cstar20))
//console.log(cstar2, cstar3, cstar20)

