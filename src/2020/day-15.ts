function game(n: number, list: number[]) {
  const copy = list.slice();
  const cache = new Map<number, number>(
    list.map((l: number, i: number): [ number, number ] => ([ l, i ])),
  );
  for (let i = copy.length - 1; i < n; i += 1) {
    const last = copy[i];
    const found = cache.get(last)!;
    if (found != null) {
      copy.push(i - found);
    } else {
      copy.push(0);
    }
    cache.set(last, i);
  }
  return copy[n - 1];
}

/**
 * Day 15 (2020)
 * yarn start --year 2020 15
 * @see {@link https://adventofcode.com/2020/day/15}
 */
export function solution(contents: string) {
  const [ line ] = contents.split(/\n/);
  const list = line.split(',').map((n) => parseInt(n, 10));
  const part1 = game(2_020, list);
  const part2 = game(30_000_000, list);
  return { part1, part2 };
}
