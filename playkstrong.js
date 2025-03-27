const solver = require("javascript-lp-solver");
const buildModel = require("./kstrong-poa-model.js");


// coverage welfare
const w = n => i => (i === 0 || i > n) ? 0 : 1;

// welfare utility
if(process.argv[2] === "welfare") {
  if(process.argv[3] === 'inspect') {
    const tests = [ 2, 3, 4, 20 ]
    tests.forEach(i => {
      const cmc = buildModel(fmc(i),w(i),i,2)
      console.log(`cover mc ${i}: `, solver.Solve(cmc))
      i < 4 && console.table(cmc.variables)
    })
  } else {
    ([...Array(20)].map((_, i) => i + 1)).forEach(i => {
      const cmc = buildModel(w(20),w(20),20,i)
      console.log(solver.Solve(cmc).result)
    })
  }
}

// mc utility
if(process.argv[2] === "mc") {
  const fmc = n => i => i === 1 ? 1 : 0;

  if(process.argv[3] === 'inspect') {
    const tests = [ 2, 3, 4, 20 ]
    tests.forEach(i => {
      const cmc = buildModel(fmc(i),w(i),i,1)
      console.log(`cover mc ${i}: `, solver.Solve(cmc))
      i < 4 && console.table(cmc.variables)
    })
  } else {
    ([...Array(20)].map((_, i) => i + 1)).forEach(i => {
      const cmc = buildModel(fmc(20),w(20),20,i)
      console.log(solver.Solve(cmc).result)
    })
  }
}

// es utility
// TODO: kstrong?
if(process.argv[2] === "es") {
  const fes = n => i => i > 0 && i <= n ? 1/i : 0;

  if(process.argv[3] === 'inspect') {
    const tests = [ 2, 3, 4, 20 ]
    tests.forEach(i => {
      const cmc = buildModel(fes(i),w(i),i,1)
      console.log(`cover mc ${i}: `, solver.Solve(cmc))
      i < 4 && console.table(cmc.variables)
    })
  } else {
    ([...Array(20)].map((_, i) => i + 1)).forEach(i => {
      const cmc = buildModel(fes(20),w(20),20,i)
      console.log(solver.Solve(cmc).result)
    })
  }
}

// fstar utility
// TODO: kstrong?
if(process.argv[2] === "star") {
  const fact = n => n <= 0 ? 1 : n * fact(n-1);
  const sumna = j => j > 0 ? [...Array(j-1).keys()]
    .map(i => 1/fact(i))
    .reduce((a,b) => a + b, 0) : 0;

  const fstar = n => i => fact(i-1)/(Math.E - 1) * (Math.E - sumna(i));

  if(process.argv[3] === 'inspect') {
    const tests = [ 2, 3, 4, 20 ]
    tests.forEach(i => {
      const cmc = buildModel(fstar(i),w(i),i,1)
      console.log(`cover mc ${i}: `, solver.Solve(cmc))
      i < 4 && console.table(cmc.variables)
    })
  } else {
    ([...Array(20)].map((_, i) => i + 1)).forEach(i => {
      const cmc = buildModel(fstar(20),w(20),20,i)
      console.log(solver.Solve(cmc).result)
    })
  }
}
