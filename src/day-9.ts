function validate(expected: number, numbers: number[]): { num1: number; num2: number; } | null {
  const stuff = new Set();
  for (const num1 of numbers) {
    const num2 = expected - num1;
    if (stuff.has(num2)) {
      return { num1, num2 };
    }
    stuff.add(num1);
  }
  return null;
}

function findInvalid(numbers: number[], preamble: number): number | null {
  for (let i = preamble; i < numbers.length; i += 1) {
    const num = numbers[i];
    const result = validate(num, numbers.slice(i - preamble, i));
    if (result == null) {
      return num;
    }
  }
  return null;
}

/**
 * Day 9
 * yarn start 9
 * @see {@link https://adventofcode.com/2020/day/9}
 */
export function solution(contents: string) {
  const lines = contents.split(/\n/).map((line) => parseInt(line, 10));
  const part1 = findInvalid(lines, 25)!;
  let part2 = 0;
  done2:
  for (let i = 0; i < lines.length; i += 1) {
    let acc = lines[i];
    let j = i + 1;
    while (acc < part1) {
      acc += lines[j];
      if (acc === part1) {
        const result = lines.slice(i, j + 1).sort((a, b) => a - b);
        part2 = result[0] + result[result.length - 1];
        break done2;
      }
      j += 1;
    }
  }
  return { part1, part2 };
}
