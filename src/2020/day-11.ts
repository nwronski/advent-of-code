import { BaseN } from 'js-combinatorics';

import { clone, printLayout2D } from '../helpers';

type State = 'L' | '#' | '.';
type Coords = [ number, number ];

function countOccupied(layout: (State[] | State | null)[]): number {
  return layout.flat(1).reduce((a, b) => a + (b === '#' ? 1 : 0), 0);
}

const cache = new Map<number, number[][]>();
function getTransforms(amp: number): number[][] {
  if (!cache.has(amp)) {
    const [ , ...transforms ] = new BaseN([ 0, amp, -amp ], 2).toArray();
    cache.set(amp, transforms);
  }
  return cache.get(amp)!;
}

const stopStates = new Set([ '#', 'L' ]);
function getOccupied(
  layout: State[][],
  [ x, y ]: Coords,
  adjacentFanOut: boolean,
): number {
  const found = Array(8).fill(null) as (State | null)[];
  let stop = false;
  let amp = 1;
  while (!stop) {
    const adjacent = getTransforms(amp);
    let hit = false;
    adjacent.forEach(([ dX, dY ], i) => {
      const position = layout[y + dY]?.[x + dX];
      if (position != null) {
        hit = true;
        if (stopStates.has(position)) {
          found[i] ??= position;
        }
      }
    });
    amp += 1;
    stop = !adjacentFanOut || !hit || !found.some((p) => p == null);
  }
  return countOccupied(found);
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
    if (print) { printLayout2D(next, ++generation); }

    let changed = false;
    for (let y = 0; y < current.length; y += 1) {
      for (let x = 0; x < current[y].length; x += 1) {
        let cell = current[y][x];
        const occupied = getOccupied(current, [ x, y ], adjacentFanOut);
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
        changed ||= cell !== next[y][x];
        next[y][x] = cell;
      }
    }

    current = next;
    done = !changed;
  }
  return current;
}

/**
 * Day 11 (2020)
 * yarn start --year 2020 11
 * @see {@link https://adventofcode.com/2020/day/11}
 */
export function solution(contents: string) {
  const layout = contents.split(/\n/).map((line) => line.split('') as State[]);
  const part1 = countOccupied(nature(layout, 4, false));
  const part2 = countOccupied(nature(layout, 5, true));
  return { part1, part2 };
}
