const solver = require("javascript-lp-solver");
const buildModel = require("./poa-model.js");


// coverage welfare
const w = n => i => (i === 0 || i > n) ? 0 : 1;

if(process.argv[2] == "blind") {
  const fblind = n => i => 1;
  const cblind2 = buildModel(fblind(3),w(3),3)
  console.log("cover blind 2: ", solver.Solve(cblind2))
  console.table(cblind2.variables)
}

// mc utility
if(process.argv[2] === "mc") {
  const fmc = n => i => i === 1 ? 1 : 0;

  const cmc2 = buildModel(fmc(2),w(2),2)
  console.log("cover mc 2: ", solver.Solve(cmc2))
  console.table(cmc2.variables)
  const cmc3 = buildModel(fmc(3),w(3),3)
  console.log("cover mc 3: ", solver.Solve(cmc3))
  console.table(cmc3.variables)
  const cmc20 = buildModel(fmc(20),w(20),20)
  console.log("cover mc 20: ", solver.Solve(cmc20))
  //console.table(cmc20.variables)

  // seems legit, pretty consistently get poa 1/2
  // the wierd thing is which tuples get theta > 0
  // if I feed them to the lp solver in the order I
  // generate them, it settles on the first one that
  // gives that max result, which for n>2 often doesn't
  // have all agents on opt or ne. Sending the tuples
  // in reverse seems to "fix" that.
}

// es utility
if(process.argv[2] === "es") {
  const fes = n => i => i > 0 && i <= n ? 1/i : 0;

  const ces2 = buildModel(fes(2),w(2),2)

  let thems2 = {};
  // goal: rotate model. variables
  for(let i = 0; i < Object.keys(ces2.variables).length; i++) {
    ces2.variables = Object.fromEntries( [ ...Object.entries(ces2.variables).slice(1), Object.entries(ces2.variables)[0] ])
    thems2 = { ...thems2, ...solver.Solve(ces2) }
  }
  console.log(2, thems2)

  const ces3 = buildModel(fes(3),w(3),3)
  let thems3 = {};
  for(let i = 0; i < Object.keys(ces3.variables).length; i++) {
    ces3.variables = Object.fromEntries( [ ...Object.entries(ces3.variables).slice(1), Object.entries(ces3.variables)[0] ])
    thems3 = { ...thems3, ...solver.Solve(ces3) }
  }
  console.log(3, thems3)

  const ces4 = buildModel(fes(4),w(4),4)
  let thems4 = {};
  for(let i = 0; i < Object.keys(ces4.variables).length; i++) {
    ces4.variables = Object.fromEntries( [ ...Object.entries(ces4.variables).slice(1), Object.entries(ces4.variables)[0] ])
    thems4 = { ...thems4, ...solver.Solve(ces4) }
  }
  console.log(4, thems4)

  // const ces20 = buildModel(fes(20),w(20),20)
  // let thems20 = {};
  // for(let i = 0; i < Object.keys(ces20.variables).length; i++) {
  //   ces20.variables = Object.fromEntries( [ ...Object.entries(ces20.variables).slice(1), Object.entries(ces20.variables)[0] ])
  //   thems20 = { ...thems20, ...solver.Solve(ces20) }
  // }
  // console.log(20, thems20)

  // my guess here is that this method tends toward poa 1/2
  // as n -> Infinity for f^es
  // which seems right according to dr brown
}

// fstar utility
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

  // this seems right (maybe?) for n = 2, but not for anything else...
}
console.log(Math.E, 1/Math.E, 1-1/Math.E)
