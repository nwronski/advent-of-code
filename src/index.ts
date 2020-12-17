import { expect } from 'chai';
import { readFile } from 'fs';
import glob from 'glob';
import { resolve } from 'path';
import { promisify } from 'util';

import { ANSWERS, IRunResult, ISolutionFile } from './answers';

const readFileAsync = promisify(readFile);
const globAsync = promisify(glob);

async function run(day: number): Promise<IRunResult> {
  const { solution } = await import(`./day-${day}`) as ISolutionFile;
  const contents = await readFileAsync(resolve(`./input/day-${day}.txt`), 'utf-8');
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
  return { day, ...result };
}

async function cli(arg: string) {
  let days = [ arg ];
  if (arg === '--all') {
    const files = await globAsync('./src/day-*.ts');
    days = files.map((file) => {
      const [ , dayStr ] = /day-(\d+)\.ts$/.exec(file)!;
      return dayStr;
    });
  }

  const dayNumbers = days.map((d) => parseInt(d, 10)).sort((a, b) => a - b);
  for (const day of dayNumbers) {
    const result = await run(day);
    // eslint-disable-next-line no-console
    console.log(result);
  }
}

// eslint-disable-next-line no-console
cli(process.argv[2]).catch(console.error);
