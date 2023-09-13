const buildModel = require("./poa-model.js");

// coverage welfare
const w = i => ([0, 1, 1, 0])[i];
// mc utility
const f = i => ([0, 1, 0, 0])[i];
// es utility
// const f = i => ([0, 1, 1, 0])[i];

module.exports = buildModel(f,w,2)
