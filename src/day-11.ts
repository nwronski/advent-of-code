type State = 'L' | '#' | '.';

function countOccupied(layout: State[][]): number {
  return layout.reduce(
    (prev, row) => {
      const current = row.filter((seat) => seat === '#').length;
      return prev + current;
    },
    0,
  );
}

function clone(layout: State[][]): State[][] { return layout.map((row) => row.slice()); }

const div = '='.repeat(30);
function printLayout(layout: State[][], generation: number) {
  // eslint-disable-next-line no-console
  console.log(
    `${generation.toString().padStart(30)}\n${div}\n${layout.map((row) => row.join('')).join('\n')}\n${div}\n`,
  );
}

interface IAdjacentResult { next: State[]; done: boolean; }
function adjacentToPoint(
  layout: State[][],
  r: number,
  c: number,
  amp: number,
): IAdjacentResult {
  const bottomEdge = layout.length - 1;
  const rightEdge = layout[r].length - 1;
  const yLow = r - amp;
  const yHigh = r + amp;
  const xLow = c - amp;
  const xHigh = c + amp;
  return {
    next: [
      layout[yLow]?.[xLow],
      layout[yLow]?.[xHigh],
      layout[yHigh]?.[xLow],
      layout[yHigh]?.[xHigh],
      layout[r]?.[xLow],
      layout[r]?.[xHigh],
      layout[yLow]?.[c],
      layout[yHigh]?.[c],
    ],
    done: yLow <= 0 && yHigh >= bottomEdge && xLow <= 0 && xHigh >= rightEdge,
  };
}

const stopStates = new Set([ '#', 'L' ]);
function getOccupied(
  layout: State[][],
  r: number,
  c: number,
  adjacentFanOut: boolean,
): number {
  const found = Array(8).fill(null) as (State | null)[];
  let stop = false;
  let amp = 1;
  while (!stop) {
    const { next, done } = adjacentToPoint(layout, r, c, amp);
    next.forEach((position, i) => {
      if (stopStates.has(position)) {
        found[i] ??= position;
      }
    });
    amp += 1;
    stop = !adjacentFanOut || done;
  }
  return found.filter((seat) => seat === '#').length;
}

function nature(
  layout: State[][],
  occupiedCount: number,
  adjacentFanOut: boolean,
  print = false,
): State[][] {
  let generation = 0;
  let done = false;
  let current = clone(layout);
  while (!done) {
    const next = clone(current);
    if (print) { printLayout(next, ++generation); }

    let changed = false;
    for (let r = 0; r < current.length; r += 1) {
      const row = current[r];
      for (let c = 0; c < row.length; c += 1) {
        let cell = row[c];
        const occupied = getOccupied(current, r, c, adjacentFanOut);
        switch (cell) {
          case 'L': {
            if (occupied === 0) {
              cell = '#';
            }
            break;
          }
          case '#': {
            if (occupied >= occupiedCount) {
              cell = 'L';
            }
            break;
          }
        }
        changed ||= cell !== next[r][c];
        next[r][c] = cell;
      }
    }

    current = next;
    done = !changed;
  }
  return current;
}

/**
 * Day 11
 * yarn start 11
 * @see {@link https://adventofcode.com/2020/day/11}
 */
export function solution(contents: string) {
  const layout = contents.split(/\n/).map((line) => line.split('') as State[]);
  const part1 = countOccupied(nature(layout, 4, false));
  const part2 = countOccupied(nature(layout, 5, true));
  return { part1, part2 };
}
