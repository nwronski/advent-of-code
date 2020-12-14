const cache = new Map<string, number>();
function permute(
  jolts: number,
  expected: number,
  lines: number[],
) {
  const key = JSON.stringify(lines);
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  let count = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const rest = lines.slice(i + 1);
    if ((line - jolts) <= 3) {
      if (line + 3 >= expected) {
        count += 1;
      } else if (rest.length > 0) {
        count += permute(line, expected, rest);
      }
    } else {
      break;
    }
  }
  cache.set(key, count);
  return count;
}

/**
 * Day 10
 * yarn start 10
 * @see {@link https://adventofcode.com/2020/day/10}
 */
export function solution(contents: string) {
  const lines = contents.split(/\n/)
    .map((line) => parseInt(line, 10))
    .sort((a, b) => a - b);
  const expected = lines[lines.length - 1] + 3;
  const diffs = new Map<number, number>();
  let jolts = 0;
  for (const line of [ ...lines, expected ]) {
    const diff = line - jolts;
    diffs.set(diff, (diffs.get(diff) ?? 0) + 1);
    jolts = line;
  }
  const part1 = diffs.get(1)! * diffs.get(3)!;
  const part2 = permute(0, expected, lines);
  return { part1, part2 };
}
