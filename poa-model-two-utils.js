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
        for(let aB = 0; aN+xN+bN+aB <= n; aB++) {
          I[aN][xN][bN][aB] = [];
          for(let xB = 0; aN+xN+bN+aB+xB <= n; xB++) {
            I[aN][xN][bN][aB][xB] = [];
            for(let bB = 0; aN+xN+bN+aB+xB+bB <= n; bB++) {
              I[aN][xN][bN][aB][xB][bB] = {aN,xN,bN,aB,xB,bB};
            }
          }
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

  tuples(n).reverse().forEach(({ aN, xN, bN, aB, xB, bB }) => {
    model.variables[`${aN}-${xN}-${bN}-${aB}-${xB}-${bB}`] = {
      // number choosing node in ne
      // times utility of choosing it as a function of agents
      // minus
      // number choosing node in opt
      // times utility choosing it as function of agents plus defector?
      defectionTerm: aN * fM(aN+xN+aB+xB) - bN * fM(aN + xN + 1 + aB + xB), // A^T
      blindDefectionTerm: aB * fB(aN+xN+aB+xB) - bB * fB(aN + xN + 1 + aB + xB), // A^T
      // comes from U(ne) - U(opti, ne-i)
      // paper claims U(opti,ne-i) = [xf(a+x) - bf(a+x+1)]\theta(axb)
      wax: w(aN + xN + aB + xB), // B^T
      wxb: w(xN + bN + xB + bB), // C^T
      axbNom: aN + xN + bN,
      axbBli: aB + xB + bB,
    };
  });

  return model;
};

module.exports = buildModel
