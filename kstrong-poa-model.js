const tuples = (n,k) => {
  // generate all integer tupples in I_n
  // make nxnxn matrix, skipping the e+x+o>n entries
  //   and the e+x+o<k entries
  const I = [];
  for(let e = 0; e <= n; e++) {
    I[e] = [];
    for(let x = 0; e+x <= n; x++) {
      I[e][x] = [];
      for(let o = 0; e+x+o <= n; o++) {
        //if(e+x+o >= k) {
          I[e][x][o] = {e,x,o};
        //}
      }
    }
  }
  return I.flat(2)
}

const buildModel = (f,w,n,k) => {
  const model = {
    optimize: "wxo",
    opType: "max",
    constraints: {
      wex: { equal: 1 },
    },
    variables: {},
  };
  for(let i = 1; i <= k; i++) {
    model.constraints['equilibriumTerm' + i] = { min: 0 }
  }

  tuples(n,k).reverse().forEach(({ e, x, o }) => {
    model.variables[`${e}-${x}-${o}`] = {
      wex: w(e + x),
      wxo: w(x + o),
    };
    for(let i = 1; i <= k; i++) {
      model.variables[`${e}-${x}-${o}`]['equilibriumTerm' + i] = 
        eqTerm(i, n, f, e, x, o)
    }
  });

  return model;
};

const eqTerm = (k, n, w, e, x, o) => {
  const eqwelfare = poch(n, k) * w(e + x)
  const alternateTerm = (a, b) =>
    binom(k, a) * binom(k-a,b) * poch(e, a) * poch(o, b) *
      poch(n-e-o, k-a-b) * w(e+x+b-a)
  const alphas = [...Array(k+1)].map((_, i) => i)
  const summation = alphas.map(a => 
    [...Array(k-a+1)].map((_,b) => alternateTerm(a, b)).reduce(sum, 0)
  ).reduce(sum, 0)
  return eqwelfare - summation
}

const sum = (a, b) => a + b

// the n!/(n-k)! thing is called a falling factorial, the
// pochhammer symbol is used for falling and rising versions
const poch = (x,y) => {
  if(x < y || x < 0 || y < 0) {
    return 0
  }
  const bottom = x - y
  let result = 1
  for(let i = x; i > bottom; i--) {
    result *= i
  }
  return result
}

const fact = n => (n <= 1) ? 1 : (n * fact(n - 1))

// newton generalization of binomial says binom(a,b) = poch(a,b)/k!
const binom = (a,b) => poch(a,b) / fact(b)

// const fuck = (x, y) => fact(x)/fact(x-y)
// 
// for(let i = 0; i < 10; i++) {
//   const row = []
//   for(let j = 0; j <= i; j++) {
//     //console.log([i,j],poch(i,j), fuck(i,j),poch(i,j)=== fuck(i,j))
//     row.push(binom(i,j))
//   }
//   console.log(row)
// }

module.exports = buildModel
