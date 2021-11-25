/**
 * Day 6 (2020)
 * yarn start --year 2020 6
 * @see {@link https://adventofcode.com/2020/day/6}
 */
export function solution(contents: string) {
  const groups = contents.split(/\n{2,}/);
  let part1 = 0;
  let part2 = 0;
  for (const group of groups) {
    const answers = new Set(group.replace(/\s+/g, '').split(''));
    const people = group.split(/\n/);
    part1 += answers.size;
    for (const answer of Array.from(answers)) {
      if (!people.every((person) => person.includes(answer))) {
        answers.delete(answer);
      }
    }
    part2 += answers.size;
  }
  return { part1, part2 };
}
