import Graph from 'graphology';
import { toSimple } from 'graphology-operators';
import shortestPath from 'graphology-shortest-path/unweighted';

import { clone } from '../helpers';

function searchableSea(image: string[][][][]): string[][] {
  return image.flatMap((row) => {
    return row[0]
      .map((_chunks: any, y: number) => {
        return row.flatMap((plane) => plane[y]);
      });
  });
}
function printableSea(grid: string[][]): string {
  return grid.flatMap((row) => row.join('')).join('\n');
}

function rotate<T>(grid: T[][]): T[][] {
  return grid[0].map((_, col) => grid.map((row) => row[col]));
}

function flip<T>(grid: T[][]): T[][] {
  return grid.map((row) => row.slice()).reverse();
}

function orientations<T>(grid: T[][]): T[][][] {
  let current: T[][] = grid;
  const results: T[][][] = [];
  for (let i = 0; i < 2; i += 1) {
    results.push(current, rotate(current), clone(rotate(current)).reverse());
    current = rotate(flip(current));
    results.push(current, clone(current).reverse());
  }
  return results;
}

interface IEdges { left: string; top: string; bottom: string; right: string; }
function getEdges(grid: string[][]): IEdges {
  const bottom = grid[grid.length - 1].join('');
  const top = grid[0].join('');
  const left = grid.map((r) => r[0]).flat().join('');
  const right = grid.map((r) => r[r.length - 1]).flat().join('');
  return { left, top, bottom, right };
}

function removeBorder(grid: string[][]) {
  return grid.slice(1, grid.length - 1).map((row) => row.slice(1, row.length - 1));
}

function countHash(gridStr: string) {
  return gridStr.replace(/[^#]+/g, '').length;
}

/**
 * Day 20 (2020)
 * yarn start --year 2020 20
 * @see {@link https://adventofcode.com/2020/day/20}
 */
export function solution(contents: string) {
  const lines = contents.split(/\n{2}/);

  const images = new Map<string, string[][][]>();
  const graph = new Graph<{ edges: Set<string>; }>({ multi: true });
  for (const line of lines) {
    const [ id, ...data ] = line.split(/\n/);
    const [ , tileId ] = /Tile (\d+):/i.exec(id)!;
    const tileData = data.map((l) => l.trim().split(''));
    const tileOrientations = orientations(tileData);
    const edges: Set<string> = new Set<string>(
      tileOrientations
        .map((orientation) => {
          return Object.values(getEdges(orientation)) as string[];
        })
        .flat(),
    );

    const key = graph.addNode(tileId, {
      edges,
    });
    images.set(key, tileOrientations);
  }
  const tileIds = new Set(images.keys());
  const dims = Math.sqrt(images.size);

  for (const { node: tileId, attributes: { edges } } of graph.nodeEntries()) {
    edges.forEach((edge: string) => {
      graph.forEachNode((otherTileId: string, { edges: otherEdges }) => {
        if (otherTileId !== tileId && otherEdges.has(edge)) {
          graph.addUndirectedEdge(tileId, otherTileId, { edge });
        }
      });
    });
  }

  const imageGraph = toSimple(graph);
  const corners = [ ...tileIds ].filter((tileId) => [ ...imageGraph.edges(tileId) ].length === 2);
  const part1 = corners.reduce((a, b) => a * parseInt(b, 10), 1);

  const tileIdGrid = Array(dims).fill(null).map(() => Array(dims).fill(null) as string[]);
  const imageGrid = Array(dims).fill(null).map(() => Array(dims).fill(null) as string[][][]);
  let [ c1, ...otherCorners ] = corners;
  const isNotAdjacentCorner = (next: string) => shortestPath(graph, c1, next)!.length !== dims;
  const [ c4 ] = otherCorners.splice(otherCorners.findIndex(isNotAdjacentCorner)!, 1);

  let count = 2;
  cornerLoop:
  while (count-- > 0) {
    let [ c2, c3 ] = otherCorners;
    tileIdGrid[0] = shortestPath(graph, c1, c2)! as string[];
    tileIdGrid[dims - 1] = shortestPath(graph, c3, c4)! as string[];

    for (let x = 0; x < dims; x += 1) {
      const column = shortestPath(graph, tileIdGrid[0][x], tileIdGrid[dims - 1][x])!;
      for (let y = 0; y < dims; y += 1) {
        tileIdGrid[y][x] = column[y];
      }
    }

    for (let y = 0; y < dims; y += 1) {
      colLoop:
      for (let x = 0; x < dims; x += 1) {
        const tileId = tileIdGrid[y][x];
        let candidates = images.get(tileId)!.slice();
        rotateLoop:
        while (candidates.length > 0) {
          const current = candidates.shift()!;
          const currentEdges = getEdges(current);

          if (x < dims - 1) {
            let [ next, ...rest ] = images.get(tileIdGrid[y][x + 1])!;
            while (currentEdges.right !== getEdges(next).left) {
              next = rest.shift()!;
              if (next == null) { continue rotateLoop; }
            }
            imageGrid[y][x + 1] = removeBorder(next);
          }
          if (x > 0) {
            let [ next, ...rest ] = images.get(tileIdGrid[y][x - 1])!;
            while (currentEdges.left !== getEdges(next).right) {
              next = rest.shift()!;
              if (next == null) { continue rotateLoop; }
            }
            imageGrid[y][x - 1] = removeBorder(next);
          }
          if (y < dims - 1) {
            let [ next, ...rest ] = images.get(tileIdGrid[y + 1][x])!;
            while (currentEdges.bottom !== getEdges(next).top) {
              next = rest.shift()!;
              if (next == null) { continue rotateLoop; }
            }
            imageGrid[y + 1][x] = removeBorder(next);
          }
          if (y > 0) {
            let [ next, ...rest ] = images.get(tileIdGrid[y - 1][x])!;
            while (currentEdges.top !== getEdges(next).bottom) {
              next = rest.shift()!;
              if (next == null) { continue rotateLoop; }
            }
            imageGrid[y - 1][x] = removeBorder(next);
          }

          imageGrid[y][x] = removeBorder(current);
          continue colLoop;
        }

        otherCorners = otherCorners.reverse();
        continue cornerLoop;
      }
    }
    break;
  }

  let part2 = 0;
  const snek =
`                  #
#    ##    ##    ###
 #  #  #  #  #  #`;
  let snekParts = snek.split('\n');
  const snakeX = Math.max(...snekParts.map((line) => line.length));
  const snakeY = snekParts.length;
  snekParts = snekParts.map((line) => line.padEnd(snakeX));

  let best = searchableSea(imageGrid);
  let snakeCount = 0;
  const snakeFinder = (sea: string[][]) => {
    let snakes = 0;
    for (let y = 0; y < sea.length; y += 1) {
      seaLoop:
      for (let x = 0; x < sea[0].length; x += 1) {
        for (let sY = 0; sY < snakeY; sY += 1) {
          for (let sX = 0; sX < snakeX; sX += 1) {
            if (snekParts[sY][sX] === '#') {
              if (sea[y + sY]?.[x + sX] !== '#') {
                continue seaLoop;
              }
            }
          }
        }
        snakes += 1;
      }
    }
    if (snakes > snakeCount) {
      best = sea;
      snakeCount = snakes;
    }
  };
  for (const grid of orientations(best)) {
    snakeFinder(grid);
  }

  const printableBest = printableSea(best);
  part2 = countHash(printableBest) - (countHash(snek) * snakeCount);
  // eslint-disable-next-line no-console
  // console.log(printableBest, '\n');

  return { part1, part2 };
}
