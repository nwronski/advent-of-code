/**
 * Day 1 (2020)
 * yarn start --year 2020 1
 * @see {@link https://adventofcode.com/2020/day/1}
 */
export function solution(contents: string) {
  const lines: string[] = contents.split(/\n/);
  const numbers = lines.map((line: string) => parseInt(line, 10));
  const stuff = new Set();
  let part1;
  for (const num1 of numbers) {
    const num2 = 2020 - num1;
    if (stuff.has(num2)) {
      part1 = num1 * num2;
      break;
    }
    stuff.add(num1);
  }
  let part2;
  done2:
  for (let i = 0; i < numbers.length; i += 1) {
    for (let j = 0; j < numbers.length; j += 1) {
      for (let k = 0; k < numbers.length; k += 1) {
        if (numbers[i] + numbers[j] + numbers[k] === 2020 && i !== j && j !== k) {
          part2 = numbers[i] * numbers[j] * numbers[k];
          break done2;
        }
      }
    }
  }
  return { part1, part2 };
}
