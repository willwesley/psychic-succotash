const tuples = n => {
  // generate all integer tupples in I_n
  // make nxnxn matrix, skipping the a+x+b>n entries
  const I = [];
  for(let a = 0; a <= n; a++) {
    I[a] = [];
    for(let x = 0; a+x <= n; x++) {
      I[a][x] = [];
      for(let b = 0; a+x+b <= n; b++) {
        I[a][x][b] = {a,x,b};
      }
    }
  }
  return I.flat(2)
}

const buildModel = (f,w,n) => {
  const model = {
    optimize: "wxb",
    opType: "max",
    constraints: {
      // defection term is the A^t: a*f(a+x)-b*f(a+x+1)
      // not sure defection is the right name for it
      defectionTerm: { min: 0 },
      wax: { equal: 1 },
    },
    variables: {},
  };

  tuples(n).forEach(({ a, x, b }) => {
    model.variables[`${a}-${x}-${b}`] = {
      defectionTerm: a * f(a+x) - b * f(a + x +1),
      wax: w(a + x),
      wxb: w(x + b),
    };
  });

  return model;
};

module.exports = buildModel
