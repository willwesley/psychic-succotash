if(!process.argv[2]) {
  console.error("Provide model file name.");
  process.exit(1)
}

const solver = require("javascript-lp-solver");
const model = require(`./${process.argv[2]}`);

let results = solver.Solve(model)
console.log(results)
