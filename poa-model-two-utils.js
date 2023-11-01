const tuples = n => {
  // generate all integer tuples in I_n
  // make nxBxnxBxnxB matrix, skipping the a+x+b>n entries
  const I = [];
  for(let aN = 0; aN <= n; aN++) {
    I[aN] = [];
    for(let xN = 0; aN+xN <= n; xN++) {
      I[aN][xN] = [];
      for(let bN = 0; aN+xN+bN <= n; bN++) {
        I[aN][xN][bN] = [];
        for(let B = 0; aN+xN+bN+B <= n; B++) {
          I[aN][xN][bN][B] = {aN,xN,bN,B};
        }
      }
    }
  }
  return I.flat(5)
}

const buildModel = (fM,fB,w,n,k) => {
  const model = {
    optimize: "wxb",
    opType: "max",
    constraints: {
      defectionTerm: { min: 0 },
      blindDefectionTerm: { min: 0 },
      wax: { equal: 1 },
      axbNom: { max: n - k },
      axbBli: { max: k },
    },
    variables: {},
  };

  tuples(n).reverse().forEach(({ aN, xN, bN, B }) => {
    model.variables[`${aN}-${xN}-${bN}-${B}`] = {
      // number choosing node in ne
      // times utility of choosing it as a function of agents
      // minus
      // number choosing node in opt
      // times utility choosing it as function of agents plus defector?
      defectionTerm: aN * fM(aN+xN+B) - bN * fM(aN + xN + 1 + B), // A^T
      //blindDefectionTerm: B * fB(aN+xN+B) - B * fB(aN + xN + 1 + B), // A^T
      // comes from U(ne) - U(opti, ne-i)
      // paper claims U(opti,ne-i) = [xf(a+x) - bf(a+x+1)]\theta(axb)
      wax: w(aN + xN + B), // B^T
      wxb: w(xN + bN + B), // C^T
      axbNom: aN + xN + bN,
      axbBli: B,
    };
  });

  return model;
};

module.exports = buildModel
