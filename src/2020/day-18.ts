function tokenize(eq: string): string[] {
  return eq.split(/\s+/);
}

function math1([ lStr, ...toks ]: string[]) {
  let acc = parseInt(lStr, 10);
  while (toks.length > 0) {
    const [ op, rStr ] = toks.splice(0, 2);
    const right = parseInt(rStr, 10);
    switch (op) {
      case '+': {
        acc += right;
        break;
      }
      case '*': {
        acc *= right;
        break;
      }
    }
  }
  return acc;
}

function math2(toks: string[]) {
  let idx;
  while ((idx = toks.indexOf('+')) !== -1) {
    const [ left, , right ] = toks.slice(idx - 1, idx + 2).map((str) => parseInt(str, 10));
    toks.splice(idx - 1, 3, `${left + right}`);
  }
  return math1(toks);
}

const bracketRe = /\(([0-9\s+*]+?)\)/g;
function countEm(equations: string[], mathFunc: (toks: string[]) => number) {
  let acc = 0;
  for (const equation of equations) {
    let cur = equation;
    while (bracketRe.test(cur)) {
      cur = cur.replace(bracketRe, (_m, $1) => `${mathFunc(tokenize($1))}`);
    }
    acc += mathFunc(tokenize(cur));
  }
  return acc;
}

/**
 * Day 18 (2020)
 * yarn start --year 2020 18
 * @see {@link https://adventofcode.com/2020/day/18}
 */
export function solution(contents: string) {
  const equations = contents.split(/\n/);

  const part1 = countEm(equations, math1);
  const part2 = countEm(equations, math2);

  return { part1, part2 };
}
