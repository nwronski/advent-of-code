/**
 * Day 25
 * yarn start 25
 * @see {@link https://adventofcode.com/2020/day/25}
 */
export function solution(contents: string) {
  const [ card, door ] = contents.split(/\n/).map((line) => parseInt(line, 10));
  let loopCount = 1;
  let publicKey = 1;
  let encryptionKey: number;

  const transform = (value = 1, subject = 7) => (value * subject) % 20201227;

  while ((publicKey = transform(publicKey)) !== card) { loopCount += 1; }
  while (loopCount-- > 0) { encryptionKey = transform(encryptionKey, door); }

  return { part1: encryptionKey, part2: 0 };
}
