class FancyCircleNode {
  public next: FancyCircleNode | null = null;
  constructor(public readonly value: number) {}
}

class FancyCircle {
  public head: FancyCircleNode | null = null;
  public tail: FancyCircleNode | null = null;
  public min = Infinity;
  public max = -Infinity;

  protected _index: Map<number, FancyCircleNode> = new Map<number, FancyCircleNode>();

  constructor(items: number[] = []) {
    for (const item of items) {
      this.push(item);
    }
  }

  get(val: number): FancyCircleNode { return this._index.get(val)!; }

  push(val: number): FancyCircleNode {
    const node = new FancyCircleNode(val);
    if (this.head == null) {
      this.head = node;
    }
    if (this.tail != null) {
      this.tail.next = node;
    }
    this.tail = node;
    this.tail.next = this.head;
    this.min = Math.min(this.min, val);
    this.max = Math.max(this.max, val);
    this._index.set(val, node);
    return node;
  }

  toString(start?: FancyCircleNode | null) {
    let result = '';
    for (const { value } of this.nodes(start)) {
      result += `${value}`;
    }
    return result;
  }

  * nodes(start: FancyCircleNode | null = this.head) {
    if (start != null) {
      let cursor = start;
      yield start;
      while (cursor.next !== start) {
        cursor = cursor.next;
        yield cursor;
      }
    }
  }

  [ Symbol.iterator ]() { return this.nodes(); }
}

function game(circle: FancyCircle, roundCount: number): FancyCircle {
  let round = 0;
  let current: FancyCircleNode = circle.head;

  while (round++ < roundCount) {
    let cursor = current.value;

    const first = current.next;
    const second = current.next.next;
    const third = current.next.next.next;
    const pickup = [ first, second, third ] as const;

    let destination: FancyCircleNode | null = null;
    while (destination == null || pickup.includes(destination)) {
      cursor = cursor > circle.min ? cursor - 1 : circle.max;
      destination = circle.get(cursor);
    }

    const node = destination.next;
    destination.next = first;
    const tail = third.next;
    current.next = tail;
    third.next = node;

    current = current.next;
  }

  return circle;
}

/**
 * Day 23 (2020)
 * yarn start --year 2020 23
 * @see {@link https://adventofcode.com/2020/day/23}
 */
export function solution(contents: string) {
  const cups = contents.trim().split('').map((cup: string) => parseInt(cup, 10));

  const circle1 = new FancyCircle(cups);
  game(circle1, 100);
  const part1 = circle1.toString(circle1.get(1).next).slice(0, -1);

  const circle2 = new FancyCircle(cups);
  const start = circle2.max + 1;
  for (let i = 0; i <  1_000_000 - cups.length; i += 1) {
    circle2.push(start + i);
  }
  game(circle2, 10_000_000);
  const one = circle2.get(1);
  const part2 = one.next.value * one.next.next.value;

  return { part1, part2 };
}
