const solver = require("javascript-lp-solver");
const buildModel = require("./kstrong-poa-model.js");


// coverage welfare
const w = n => i => (i === 0 || i > n) ? 0 : 1;
// const w = n => i => (i === 0 || i > n) ? 0 : i;
// const w = n => i => (i < 2 || i > n) ? 0 : 1;

// mc utility
if(process.argv[2] === "mc") {
  const fmc = n => i => i === 1 ? 1 : 0;
  // const fmc = n => i => i === i ? i : 0;
  // const fmc = n => i => i === 2 || i === 1 ? 0.5 : 0;
  // const fmc = n => i => i === 2 ? 1 : 0;

  const tests = [ 2, 3, 4, 20 ]
  tests.forEach(i => {
    const cmc = buildModel(fmc(i),w(i),i,2)
    console.log(`cover mc ${i}: `, solver.Solve(cmc))
    i < 4 && console.table(cmc.variables)
  })

}

// es utility
// TODO: kstrong?
if(process.argv[2] === "es") {
  const fes = n => i => i > 0 && i <= n ? 1/i : 0;

  const tests = [ 2, 3, 4 ]
  tests.forEach(j => {
    const ces = buildModel(fes(j),w(j),j)

    let thems = {};
    // goal: rotate model. variables
    for(let i = 0; i < Object.keys(ces.variables).length; i++) {
      ces.variables = Object.fromEntries( [
        ...Object.entries(ces.variables).slice(1),
        Object.entries(ces.variables)[0]
      ])
      thems = { ...thems, ...solver.Solve(ces) }
    }
    console.log(j, thems)
    console.table(thems)
  })

  // my guess here is that this method tends toward poa 1/2
  // as n -> Infinity for f^es
  // which seems right according to dr brown
}

// fstar utility
// TODO: kstrong?
if(process.argv[2] === "star") {
  const fact = n => n <= 0 ? 1 : n * fact(n-1);
  const sumna = j => j > 0 ? [...Array(j-1).keys()]
    .map(i => 1/fact(i))
    .reduce((a,b) => a + b, 0) : 0;

  const fstar = n => i => fact(i-1)/(Math.E - 1) * (Math.E - sumna(i));

  const cstar2 = buildModel(fstar(2),w(2),2)
  console.log("cover star 2: ", solver.Solve(cstar2))
  console.table(cstar2.variables)
  const cstar3 = buildModel(fstar(3),w(3),3)
  console.log("cover star 3: ", solver.Solve(cstar3))
  console.table(cstar3.variables)
  const cstar20 = buildModel(fstar(20),w(20),20)
  console.log("cover star 20: ", solver.Solve(cstar20))
  // console.table(cstar20.variables)
}
