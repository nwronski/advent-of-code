/**
 * Day 3
 * yarn start 3
 * @see {@link https://adventofcode.com/2020/day/3}
 */
export function solution(contents: string) {
  const lines: string[] = contents.split(/\n/);
  const trees = (right: number, down: number) => {
    let count = 0;
    let row = 0;
    let col = 0;
    while ((row += down) < lines.length) {
      col += right;
      const line = lines[row];
      while (col >= line.length) {
        col -= line.length;
      }
      if (line[col] === '#') {
        count += 1;
      }
    }
    return count;
  };
  const part1 = trees(3, 1);
  const part2 = [
    [ 1, 1 ],
    [ 3, 1 ],
    [ 5, 1 ],
    [ 7, 1 ],
    [ 1, 2 ],
  ].reduce(
    (prev: number, [ right, down ]) => {
      return prev * trees(right, down);
    },
    1,
  );
  return { part1, part2 };
}
