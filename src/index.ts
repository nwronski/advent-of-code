import { readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

export type SolutionFunc = (contents: string) => Record<string, unknown>;

async function run(day: string) {
  const { solution } = await import(`./day-${day}`) as { solution: SolutionFunc; };
  const contents = await readFileAsync(resolve(`./input/day-${day}.txt`), 'utf-8');
  return solution(contents.trim());
}

// eslint-disable-next-line no-console
run(process.argv[2]).then(console.log, console.error);
