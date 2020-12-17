function getPermutations<T>(items: T[], count: number): T[][] {
  function traverse(results: T[][], curCount: number, totalCount: number): T[][] {
    if (curCount === totalCount) { return results; }
    for (let i = 0, len = results.length; i < len; i += 1) {
      const nextItem = results.shift()!;
      results.push(...items.map((item) => ([ ...nextItem, item ])));
    }
    return traverse(results, curCount + 1, totalCount);
  }
  return traverse(items.map((val: T): T[] => ([ val ])), 1, count);
}

function getSum(mem: Map<unknown, number>) {
  return Array.from(mem.values()).reduce((prev, cur) => prev + cur, 0);
}

function getMask(line: string) {
  const [ , mask ] = /mask = ([01X]+)$/.exec(line)!;
  return mask;
}
function getOperation(line: string) {
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

/**
 * Day 14
 * yarn start 14
 * @see {@link https://adventofcode.com/2020/day/14}
 */
export function solution(contents: string) {
  const lines = contents.split(/\n/);
  const memory = new Map();
  let mask: string;
  for (const line of lines) {
    if (line.startsWith('mask')) {
      mask = getMask(line);
    } else {
      const [ loc, value ] = getOperation(line);
      const nextValue = applyMask(
        strIntToBinStr(value),
        mask!,
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
      memory.set(parseInt(loc, 10), parseInt(nextValue, 2));
    }
  }
  const part1 = getSum(memory);

  memory.clear();
  for (const line of lines) {
    if (line.startsWith('mask')) {
      mask = getMask(line);
    } else {
      const operation = getOperation(line);
      const loc = strIntToBinStr(operation[0]);
      const value = parseInt(operation[1], 10);
      const permCount = (mask!.match(/X/g) ?? []).length;
      const perms = getPermutations([ '0', '1' ], permCount);
      for (const perm of perms) {
        let x = 0;
        const nextLoc = applyMask(
          loc,
          mask!,
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
        memory.set(parseInt(nextLoc, 2), value);
      }
    }
  }
  const part2 = getSum(memory);
  return { part1, part2 };
}
