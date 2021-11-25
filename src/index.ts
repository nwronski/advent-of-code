import { expect } from 'chai';
import { readFile } from 'fs/promises';
import glob from 'glob';
import { resolve } from 'path';
import { promisify } from 'util';
import parse from 'yargs-parser';

import { IAnswerFile, IRunResult, ISolutionFile } from './types';

const globAsync = promisify(glob);

const CURRENT_YEAR = 2021;

async function run(day: number, year: number): Promise<IRunResult> {
  const { solution } = await import(`./${year}/day-${day}`) as ISolutionFile;
  const contents = await readFile(resolve(`./input/${year}/day-${day}.txt`), 'utf-8');
  const { ANSWERS } = await import(`./${year}/answers`) as IAnswerFile;
  const expected = ANSWERS.get(day);
  const result = solution(contents.trim());
  if (expected != null) {
    const partNames = Object.keys(expected);
    for (const answer of partNames) {
      expect(
        `${String(result[answer])}`).to.eq(`${String(expected[answer])}`,
        `Incorrect answer for day ${day} ${answer}`,
      );
    }
  }
  return { year, day, ...result };
}

export interface IOptions {
  year: number;
  _: string;
}

async function cli({ year, _: [ day ] }: IOptions) {
  let days = [ day ];
  if (day == null) {
    const files = await globAsync(`./src/${year}/day-*.ts`);
    days = files.map((file) => {
      const [ , dayStr ] = /day-(\d+)\.ts$/.exec(file)!;
      return dayStr;
    });
  }

  const dayNumbers = days.map((d) => parseInt(d, 10)).sort((a, b) => a - b);
  for (const dayNum of dayNumbers) {
    const result = await run(dayNum, year);
    // eslint-disable-next-line no-console
    console.log(result);
  }
}

const options = parse(
  process.argv.slice(2),
  { default: { year: CURRENT_YEAR }, alias: { year: [ 'y' ] } },
) as unknown as IOptions;
// eslint-disable-next-line no-console
cli(options).catch(console.error);
