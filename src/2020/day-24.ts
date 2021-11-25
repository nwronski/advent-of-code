import pegjs from 'pegjs';

enum Color {
  White = 0,
  Black = 1,
}
enum Direction {
  E = 0,
  SE = 1,
  SW = 2,
  W = 3,
  NW = 4,
  NE = 5,
}

const parser = pegjs.generate(`
  { const DIRECTIONS = { E: 0, SE: 1, SW: 2, W: 3, NW: 4, NE: 5 }; }

  start = direction+
  direction = direction_names { return DIRECTIONS[text().toUpperCase()]; }
  direction_names = "se" / "sw" / "ne" / "nw" / "e" / "w"
`);

function parseDirections(input: string): Direction[] {
  return parser.parse(input) as Direction[];
}

class Tile {
  get edges() { return this._edges; }
  get color() { return this._color; }
  get neighbors(): Set<Tile> {
    return new Set<Tile>(this._edges.filter((neighbor) => neighbor != null));
  }

  protected _color: Color = Color.White;
  protected _edges: (Tile | null)[] = Array(Floor.surfaces.length).fill(null) as (Tile | null)[];

  constructor(
    protected _floor: Floor,
    public readonly id: number,
  ) {}

  flip() { this._color = this._color === Color.White ? Color.Black : Color.White; }

  get(direction: Direction, expand = true): Tile {
    if (expand && this._edges[direction] == null) {
      this._floor.expand();
    }
    return this._edges[direction];
  }
  set(direction: Direction, tile: Tile |  null) {
    this._edges[direction] = tile;
  }
}

class Floor {
  static surfaces: readonly Direction[] = [
    Direction.E, Direction.SE, Direction.SW, Direction.W, Direction.NW, Direction.NE,
  ] as const;
  static readonly edges: Record<Direction, Direction> = {
    [ Direction.NE ]: Direction.SW,
    [ Direction.E ]: Direction.W,
    [ Direction.NW ]: Direction.SE,
    [ Direction.SW ]: Direction.NE,
    [ Direction.W ]: Direction.E,
    [ Direction.SE ]: Direction.NW,
  };
  static readonly outerEdges: Record<Direction, Direction> = {
    [ Direction.NE ]: Direction.W,
    [ Direction.E ]: Direction.NW,
    [ Direction.NW ]: Direction.SW,
    [ Direction.SW ]: Direction.E,
    [ Direction.W ]: Direction.SE,
    [ Direction.SE ]: Direction.NE,
  };

  get origin(): Tile { return this._origin; }

  protected _maxId = 0;
  protected readonly _origin: Tile = new Tile(this, ++this._maxId);
  protected readonly _tiles: Set<Tile> = new Set<Tile>([ this._origin ]);
  protected readonly _outerRing: Set<Tile> = new Set<Tile>([ this._origin ]);

  locate(directions: Direction[]): Tile {
    return directions.reduce((current, direction) => current.get(direction), this.origin);
  }

  expand() {
    const lastRing = Array.from(this._outerRing);
    this._outerRing.clear();
    for (const origin of lastRing) {
      const neighbors = origin.edges.map((tile) => {
        if (tile == null) {
          tile = new Tile(this, ++this._maxId);
          this._tiles.add(tile);
          this._outerRing.add(tile);
        }
        return tile;
      });
      for (let i = 0; i < Floor.surfaces.length; i += 1) {
        const direction = Floor.surfaces[i];
        const neighbor = neighbors[i];
        origin.set(direction, neighbor);
        neighbor.set(Floor.edges[direction], origin);

        const prevRingNeighbor = neighbors[(i === 0 ? Floor.surfaces.length : i) - 1];
        const ringNeighborEdge = Floor.outerEdges[direction];
        neighbor.set(ringNeighborEdge, prevRingNeighbor);
        prevRingNeighbor.set(Floor.edges[ringNeighborEdge], neighbor);
      }
    }
  }

  countColor(tiles: Set<Tile> = this._tiles): number {
    let acc = 0;
    tiles.forEach((tile: Tile) => { acc += tile?.color ?? 0; });
    return acc;
  }

  [ Symbol.iterator ]() { return this._tiles.values(); }
}

function flippy(floor: Floor, dayCount: number): Floor {
  let days = 0;
  while (days++ < dayCount) {
    const flips = [];
    for (const tile of floor) {
      const neighborCount = floor.countColor(tile.neighbors);
      if (
        (tile.color === Color.Black && (neighborCount === 0 || neighborCount > 2)) ||
        (tile.color === Color.White && neighborCount === 2)
      ) {
        flips.push(tile);
      }
    }
    flips.forEach((t) => t.flip());
    floor.expand();
  }
  return floor;
}

/**
 * Day 24 (2020)
 * yarn start --year 2020 24
 * @see {@link https://adventofcode.com/2020/day/24}
 */
export function solution(contents: string) {
  const lines = contents.split(/\n/);

  const floor = new Floor();
  for (const line of lines) {
    const directions = parseDirections(line);
    floor.locate(directions).flip();
  }

  const part1 = floor.countColor();
  const part2 = flippy(floor, 100).countColor();

  return { part1, part2 };
}
