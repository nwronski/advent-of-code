/**
 * Day 5 (2020)
 * yarn start --year 2020 5
 * @see {@link https://adventofcode.com/2020/day/5}
 */
export function solution(contents: string) {
  const lines: string[] = contents.split(/\n/);
  const reducer = ([ low, high ]: [ number, number ], cur: string): [ number, number ] => {
    const mid = Math.round((high - low) / 2 + low);
    return [ 'L', 'F' ].includes(cur) ? [ low, mid ] : [ mid, high ];
  };
  const getId = (line: string): number => {
    const chars = line.split('');
    const [ row ] = chars.slice(0, 7).reduce(reducer, [ 0, 127 ]);
    const [ col ] = chars.slice(7).reduce(reducer, [ 0, 7 ]);
    return row * 8 + col;
  };
  const ids = lines.map(getId).sort((a, b) => a - b);
  const part1 = ids[ids.length - 1];
  let part2;
  for (let i = 0; i < ids.length; i += 1) {
    const id = ids[i] + 1;
    if (id !== ids[i + 1]) {
      part2 = id;
      break;
    }
  }
  return { part1, part2 };
}
