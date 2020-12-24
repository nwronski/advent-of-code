type Bearing = 'N' | 'E' | 'S' | 'W';
type Turn = 'R' | 'L';
type Move = 'F';
type Direction = Bearing | Turn | Move;
type Coords = [ number, number ];
type Directions = [ Direction, number ][];

function transformOrigin(
  origin: Coords,
  transformation: Coords,
  magnitude: number,
): Coords {
  const [ x, y ] = transformation.map((c) => c * magnitude);
  const [ bX, bY ] = origin;
  return [ bX + x, bY + y ];
}

const bearings: Record<Bearing, Coords> = {
  N: [ 0, 1 ],
  E: [ 1, 0 ],
  S: [ 0, -1 ],
  W: [ -1, 0 ],
};
const bearingKeys: Bearing[] = [ 'N', 'E', 'S', 'W' ];
const bearingCount = bearingKeys.length;

function manhattanDistance([ x, y ]: Coords) {
  return Math.abs(x) + Math.abs(y);
}

interface IBoatState {
  bearing: Bearing;
  origin: Coords;
  waypoint: Coords;
}
function boatyBoat(
  directions: Directions,
  initialBoat: Partial<IBoatState>,
  processFunc: (dir: Direction, val: number, boat: IBoatState) => void,
): IBoatState {
  const boaty: IBoatState = {
    bearing: 'E',
    origin: [ 0, 0 ],
    waypoint: [ 0, 0 ],
    ...initialBoat,
  };
  for (const [ direction, value ] of directions) {
    processFunc(direction, value, boaty);
  }
  return boaty;
}

/**
 * Day 12
 * yarn start 12
 * @see {@link https://adventofcode.com/2020/day/12}
 */
export function solution(contents: string) {
  const directions = contents.split(/\n/).map((line: string): [ Direction, number ] => {
    const { groups } = /(?<direction>[NSEWLRF])(?<value>\d+)/i.exec(line)!;
    return [ groups.direction as Direction, parseInt(groups.value, 10) ];
  });

  const { origin: origin1 } = boatyBoat(
    directions,
    {},
    (direction: Direction, value: number, boat: IBoatState) => {
      switch (direction) {
        case 'N':
        case 'S':
        case 'E':
        case 'W':
        case 'F': {
          const heading = direction === 'F' ? boat.bearing : direction;
          boat.origin = transformOrigin(boat.origin, bearings[heading], value);
          break;
        }
        case 'L':
        case 'R': {
          let turns = value / 90;
          let index = bearingKeys.indexOf(boat.bearing);
          while (turns-- > 0) {
            index += direction === 'L' ? -1 : 1;
            if (index < 0) {
              index += bearingCount;
            } else if (index >= bearingCount) {
              index -= bearingCount;
            }
          }
          boat.bearing = bearingKeys[index];
          break;
        }
      }
    },
  );

  const { origin: origin2 } = boatyBoat(
    directions,
    { waypoint: [ 10, 1 ] },
    (direction: Direction, value: number, boat: IBoatState) => {
      switch (direction) {
        case 'N':
        case 'S':
        case 'E':
        case 'W': {
          boat.waypoint = transformOrigin(boat.waypoint, bearings[direction], value);
          break;
        }
        case 'L':
        case 'R': {
          let turns = value / 90;
          while (turns-- > 0) {
            const [ x, y ] = boat.waypoint;
            boat.waypoint = direction === 'R' ? [ y, -1 * x ] : [ -1 * y, x ];
          }
          break;
        }
        case 'F': {
          boat.origin = transformOrigin(boat.origin, boat.waypoint, value);
          break;
        }
      }
    },
  );

  const part1 = manhattanDistance(origin1);
  const part2 = manhattanDistance(origin2);

  return { part1, part2 };
}
