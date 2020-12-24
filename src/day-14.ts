import { BaseN } from 'js-combinatorics';

function getSum(mem: Map<unknown, number>) {
  return Array.from(mem.values()).reduce((prev, cur) => prev + cur, 0);
}

function getMask(line: string) {
  const [ , mask ] = /mask = ([01X]+)$/.exec(line)!;
  return mask;
}
function getOperation(line: string): [ string, string ] {
  const [ , loc, val ] = /mem\[(\d+)\]\s=\s(\d+)$/.exec(line)!;
  return [ loc, val ];
}
function strIntToBinStr(value: string) {
  return (parseInt(value, 10) >>> 0).toString(2).padStart(36, '0');
}

function replaceAt(value: string, char: string, index: number) {
  return `${value.slice(0, index)}${char}${value.slice(index + 1)}`;
}

function applyMask(
  value: string,
  mask: string,
  replacer: (c: string, m: string) => string | null,
) {
  let result = value;
  for (let i = 0; i < result.length; i += 1) {
    const maskChar = mask[mask.length - result.length + i];
    const nextChar = replacer(result[i], maskChar);
    if (nextChar != null) {
      result = replaceAt(result, nextChar, i);
    }
  }
  return result;
}

function loadMemory(
  instructions: string[],
  loadOperation: (op: [ string, string ], mask: string) => Generator<[ number, number ], void>,
): Map<number, number> {
  const memory = new Map<number, number>();
  let mask: string;
  for (const instruction of instructions) {
    if (instruction.startsWith('mask')) {
      mask = getMask(instruction);
      continue;
    }
    const operation = getOperation(instruction);
    for (const [ loc, value ] of loadOperation(operation, mask)) {
      memory.set(loc, value);
    }
  }
  return memory;
}

/**
 * Day 14
 * yarn start 14
 * @see {@link https://adventofcode.com/2020/day/14}
 */
export function solution(contents: string) {
  const instructions = contents.split(/\n/);

  const memory1 = loadMemory(
    instructions,
    function * ([ loc, value ]: [ string, string ], mask: string) {
      const nextValue = applyMask(
        strIntToBinStr(value),
        mask,
        (nextChar: string, maskChar: string) => {
          switch (maskChar) {
            case '0':
            case '1': {
              if (nextChar !== maskChar) {
                return maskChar;
              }
            }
          }
          return null;
        },
      );
      yield [ parseInt(loc, 10), parseInt(nextValue, 2) ];
    },
  );
  const part1 = getSum(memory1);

  const memory2 = loadMemory(
    instructions,
    function * ([ loc, value ]: [ string, string ], mask: string) {
      const permCount = (mask.match(/X/g) ?? []).length;
      for (const perm of new BaseN([ '0', '1' ], permCount)) {
        let x = 0;
        const nextLoc = applyMask(
          strIntToBinStr(loc),
          mask,
          (_nextChar: string, maskChar: string) => {
            switch (maskChar) {
              case 'X': {
                return perm[x++];
              }
              case '1': {
                return '1';
              }
            }
            return null;
          },
        );
        yield [ parseInt(nextLoc, 2), parseInt(value, 10) ];
      }
    },
  );
  const part2 = getSum(memory2);

  return { part1, part2 };
}
