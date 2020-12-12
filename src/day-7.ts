export class Bag {
  public readonly children: Set<Bag> = new Set<Bag>();
  public readonly parents: Set<Bag> = new Set<Bag>();
  public readonly counts: WeakMap<Bag, number> = new WeakMap<Bag, number>();

  constructor(
    public readonly color: string,
  ) {}

  add(bag: Bag, count: number) {
    this.children.add(bag);
    bag.parents.add(this);
    this.counts.set(bag, count);
  }

  canCarry(seen = new Set<Bag>()): Set<Bag> {
    for (const parent of this.parents) {
      if (!seen.has(parent)) {
        seen.add(parent);
        parent.canCarry(seen);
      }
    }
    return seen;
  }

  containCount(): number {
    let count = 0;
    for (const child of this.children) {
      const childCount = this.counts.get(child) ?? 0;
      count += childCount + (childCount * child.containCount());
    }
    return count;
  }
}

export class Bagman extends Map<string, Bag> {
  get(color: string): Bag {
    if (!super.has(color)) {
      const bag = new Bag(color);
      super.set(color, bag);
    }
    return super.get(color)!;
  }

  canCarryCount(color: string) {
    return this.get(color).canCarry().size;
  }

  containCount(color: string) {
    return this.get(color).containCount();
  }
}

/**
 * Day 7
 * yarn start 7
 * @see {@link https://adventofcode.com/2020/day/7}
 */
export function solution(contents: string) {
  const lines: string[] = contents.split(/\n/);
  const parentPattern = /^(?<parentColor>[\S]+ [\S]+) bags contain/;
  const childPattern = /(?<childCount>[\d]+) (?<childColor>[\S]+ [\S]+) bag[s]?/g;
  const bags = new Bagman();
  for (const line of lines) {
    const parentColor = parentPattern.exec(line)!.groups!.parentColor;
    const parent = bags.get(parentColor);
    for (const { groups } of line.matchAll(childPattern)) {
      parent.add(
        bags.get(groups!.childColor),
        parseInt(groups!.childCount, 10),
      );
    }
  }
  const part1 = bags.canCarryCount('shiny gold');
  const part2 = bags.containCount('shiny gold');
  return { part1, part2 };
}
