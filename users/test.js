

function aa() {
  const p = {
    a: {
      b: 1,
    },
  };
  console.log(p.a);
  console.log(p.a.b);
  if (p.e) {
    if (p.a.c) console.log("found");
  }
}

aa();
