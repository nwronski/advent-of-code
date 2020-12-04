/**
 * Day 2
 * yarn start 2
 * @see {@link https://adventofcode.com/2020/day/2}
 */
export function solution(contents: string) {
  const lines: string[] = contents.split(/\n/);
  let part1 = 0;
  let part2 = 0;
  for (const line of lines) {
    const [ l, h, [ letter ], pass ] = line.trim().split(/[-\s]/);
    const [ low, high ] = [ l, h ].map((n: string) => parseInt(n, 10));
    const matches = pass.matchAll(new RegExp(letter, 'g'));
    const matchCount = Array.from(matches)?.length ?? 0;
    if (low <= matchCount && matchCount <= high) {
      part1 += 1;
    }
    const freqCount = [ low, high ].filter((pos: number) => pass[pos - 1] === letter).length;
    if (freqCount === 1) {
      part2 += 1;
    }
  }
  return { part1, part2 };
}
