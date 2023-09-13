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

  // reversing the order so that tuples with more coverage appear first
  // seems to affect which variables are selected. for example, n=3, 
  // w=coverage, f=mc -> theta in { (0,0,1), (1,0,1) } when the interated
  // order is used, but the second point is (1,0,2) when reversed. I
  // have no idea what that means.
  tuples(n).reverse().forEach(({ a, x, b }) => {
    model.variables[`${a}-${x}-${b}`] = {
      defectionTerm: a * f(a+x) - b * f(a + x +1), // A^T
      wax: w(a + x), // B^T
      wxb: w(x + b), // C^T
    };
  });

  return model;
};

module.exports = buildModel
