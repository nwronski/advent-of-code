export interface IAnswers extends Record<string, unknown> {
  part1: number | bigint;
  part2: number | bigint;
}
export type SolutionFunc = (contents: string) => IAnswers;
export interface ISolutionFile { solution: SolutionFunc; }
export interface IRunResult extends IAnswers { day: number; }

export const ANSWERS = new Map<number, IAnswers>([
  [ 1, { part1: 964875, part2: 158661360 } ],
  [ 2, { part1: 458, part2: 342 } ],
  [ 3, { part1: 244, part2: 9406609920 } ],
  [ 4, { part1: 204, part2: 179 } ],
  [ 5, { part1: 919, part2: 642 } ],
  [ 6, { part1: 6583, part2: 3290 } ],
  [ 7, { part1: 316, part2: 11310 } ],
  [ 8, { part1: 1475, part2: 1270 } ],
  [ 9, { part1: 675280050, part2: 96081673 } ],
  [ 10, { part1: 2210, part2: 7086739046912 } ],
  [ 11, { part1: 2344, part2: 2076 } ],
  [ 12, { part1: 2228, part2: 42908 } ],
  [ 13, { part1: 2305, part2: BigInt('552612234243498') } ],
  [ 14, { part1: 2346881602152, part2: 3885232834169 } ],
  [ 15, { part1: 475, part2: 11261 } ],
  [ 16, { part1: 25059, part2: 3253972369789 } ],
  [ 17, { part1: 304, part2: 1868 } ],
  [ 18, { part1: 11004703763391, part2: 290726428573651 } ],

  // ---------------------------------
  [ 19, { part1: 111, part2: 222 } ],
  [ 20, { part1: 111, part2: 222 } ],
  [ 21, { part1: 111, part2: 222 } ],
  [ 22, { part1: 111, part2: 222 } ],
  [ 23, { part1: 111, part2: 222 } ],
  [ 24, { part1: 111, part2: 222 } ],
  [ 25, { part1: 111, part2: 222 } ],
]);
