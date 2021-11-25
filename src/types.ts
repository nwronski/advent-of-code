export interface IAnswers extends Record<string, unknown> {
  part1: number | bigint | string;
  part2: number | bigint | string;
}
export type SolutionFunc = (contents: string) => IAnswers;
export interface ISolutionFile { solution: SolutionFunc; }
export interface IRunResult extends IAnswers { day: number; }
export interface IAnswerFile { ANSWERS: Map<number,IAnswers>; }
