import { BaseN, CartesianProduct } from 'js-combinatorics';

import { clone } from './helpers';

type Grid3D = number[][][];
type Grid4D = number[][][][];

const bubble3D = new BaseN([ 0, 1, -1 ], 3);
const bubble4D = new CartesianProduct<number[] | number>(bubble3D, [ 0, 1, -1 ]).toArray().map((c) => c.flat());

const adjacent3D = bubble3D.toArray().slice(1);
const adjacent4D = bubble4D.slice(1);

function countOccupied(layout: Grid3D | Grid4D): number {
  return layout.flat(3).reduce((a, b) => a + b , 0);
}

function locatePoint(layout: Grid3D | Grid4D, coords: number[]): number {
  let current: unknown = layout;
  for (let c = coords.length - 1; c >= 0; c -= 1) {
    current = (current as number[])?.[coords[c]];
  }
  return Number(current ?? 0);
}

function getOccupied(
  layout: Grid3D | Grid4D,
  coords: number[],
  transforms: number[][],
): number {
  let count = 0;
  for (const transform of transforms) {
    const adjacent = coords.map((pos, c) => pos + transform[c]);
    count += locatePoint(layout, adjacent);
  }
  return count;
}

function makePlane([ x, y ]: number[]) {
  return Array(y).fill(null).map(() => Array<number>(x).fill(0));
}

function makeCube([ x, y, z ]: number[]) {
  return Array(z).fill(null).map(() => makePlane([ x, y ]));
}

function expand3D(layout: Grid3D, [ x, y ]: number[]): Grid3D {
  const nextPlane = makePlane([ x, y ]);
  const nextRow = nextPlane[0];
  return [
    nextPlane,
    ...layout.map((plane) => ([
      nextRow.slice(),
      ...plane.map((row) => ([ 0, ...row, 0 ])),
      nextRow.slice(),
    ])),
    nextPlane,
  ];
}

function expand4D(layout: Grid4D, [ x, y, z ]: number[]): Grid4D {
  const nextCube = makeCube([ x, y, z ]);
  return [
    nextCube,
    ...layout.map((cube) => expand3D(cube, [ x, y, z ])),
    nextCube,
  ];
}

function nextValue(
  layout: Grid3D | Grid4D,
  coords: number[],
  transforms: number[][],
) {
  const occupied = getOccupied(layout, coords, transforms);
  let cell = locatePoint(layout, coords);
  switch (cell) {
    case 1: {
      cell = (occupied === 2 || occupied === 3) ? 1 : 0;
      break;
    }
    case 0: {
      cell = occupied === 3 ? 1 : 0;
      break;
    }
  }
  return cell;
}

function explore3D(current: Grid3D, spaceSize: number[]) {
  const prev = expand3D(current, spaceSize);
  const next = clone(prev);
  for (let z = 0; z < next.length; z += 1) {
    for (let y = 0; y < next[z].length; y += 1) {
      for (let x = 0; x < next[z][y].length; x += 1) {
        next[z][y][x] = nextValue(prev, [ x, y, z ], adjacent3D);
      }
    }
  }
  return next;
}

function explore4D(current: Grid4D, spaceSize: number[]) {
  const prev = expand4D(current, spaceSize);
  const next = clone(prev);
  for (let t = 0; t < next.length; t += 1) {
    for (let z = 0; z < next[t].length; z += 1) {
      for (let y = 0; y < next[t][z].length; y += 1) {
        for (let x = 0; x < next[t][z][y].length; x += 1) {
          next[t][z][y][x] = nextValue(prev, [ x, y, z, t ], adjacent4D);
        }
      }
    }
  }
  return next;
}

function space<T = Grid3D>(
  layout: T,
  initialSpace: number[],
  exploreFunc: (current: T, spaceSize: number[]) => T,
  generationCount: number,
): T {
  let generation = 0;
  let current = clone(layout);
  let spaceSize = initialSpace.slice();
  while (generation++ < generationCount) {
    spaceSize = spaceSize.map((c) => c + 2);
    current = exploreFunc(current, spaceSize);
  }
  return current;
}

/**
 * Day 17
 * yarn start 17
 * @see {@link https://adventofcode.com/2020/day/17}
 */
export function solution(contents: string) {
  const initial: number[][] = contents.split(/\n/)
    .map((line) => {
      return line.split('').map((c: string) => c === '#' ? 1 : 0); // active (1) | inactive (0)
    });

  const x = initial[0].length;
  const y = initial.length;

  const result1 = space([ initial ], [ x, y, 1 ], explore3D, 6);
  const part1 = countOccupied(result1);

  const result2 = space([ [ initial ] ], [ x, y, 1, 1 ], explore4D, 6);
  const part2 = countOccupied(result2);

  return { part1, part2 };
}
