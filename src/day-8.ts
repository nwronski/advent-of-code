interface IInstruction { instruction: string; value: number; }
interface IState { cursor: number; acc: number; seen: Set<number>; }
function run(
  instructions: IInstruction[],
  { cursor, acc, seen }: IState = { cursor: 0, acc: 0, seen: new Set<number>() },
) {
  let cycle = false;
  while (!(cycle = seen.has(cursor)) && cursor < instructions.length) {
    const { instruction, value } = instructions[cursor];
    seen.add(cursor);
    switch (instruction) {
      case 'acc':
        acc += value;
        cursor += 1;
        break;
      case 'jmp':
        cursor += value;
        break;
      case 'nop':
        cursor += 1;
        break;
    }
  }
  return { acc, cycle };
}

/**
 * Day 8
 * yarn start 8
 * @see {@link https://adventofcode.com/2020/day/8}
 */
export function solution(contents: string) {
  const lines = contents.split(/\n/)
    .map((line): IInstruction => {
      const { groups } = /(?<instruction>\w+)\s(?<value>[+-]\d+)/.exec(line)!;
      return {
        instruction: groups!.instruction,
        value: parseInt(groups!.value, 10),
      };
    });
  const { acc: part1 } = run(lines);
  let part2 = 0;
  let cursor = 0;
  let acc = 0;
  const seen = new Set<number>();
  while (!seen.has(cursor) && cursor < lines.length) {
    const { instruction, value } = lines[cursor];
    if ([ 'jmp', 'nop' ].includes(instruction)) {
      const newInstructions = [
        ...lines.slice(0, cursor),
        { instruction: instruction === 'jmp' ? 'nop' : 'jmp', value },
        ...lines.slice(cursor + 1),
      ];
      const { acc: nextAcc, cycle } = run(
        newInstructions,
        { cursor, acc, seen: new Set(seen) },
      );
      if (!cycle) {
        part2 = nextAcc;
        break;
      }
    }
    seen.add(cursor);
    switch (instruction) {
      case 'acc':
        acc += value;
        cursor += 1;
        break;
      case 'jmp':
        cursor += value;
        break;
      case 'nop':
        cursor += 1;
        break;
    }
  }
  return { part1, part2 };
}
