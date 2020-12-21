/**
 * Day 19
 * yarn start 19
 * @see {@link https://adventofcode.com/2020/day/19}
 */
export function solution(contents: string) {
  const [ rules, lines ] = contents.split(/\n{2}/).map((part) => part.split(/\n/));

  let part1 = 0;
  let part2 = 0;

  const defs = new Map<number, (v: string) => number>();
  for (const rule of rules) {

    const [ num, value ] = rule.split(': ');
    const ruleNum = parseInt(num, 10);

    if (/^"[a-z]/i.test(value)) {
      const [ , expected ] = /"([a-z]+)"/i.exec(value)!;
      const len = expected.length;
      const func = (v: string): number => {
        if (v.slice(0, len) === expected) {
          return len;
        }
        return 0;
      };
      defs.set(ruleNum, func);
    } else {
      const options = value.split(' | ').map((vv) => vv.split(' ').map((o) => parseInt(o, 10)));
      const func = (v: string): number => {
        outer:
        for (const option of options) {
          let copy = v;
          for (const t of option) {
            const r = defs.get(t)!(copy);
            if (r === 0) {
              continue outer;
            }
            copy = copy.slice(r);
          }
          return v.length - copy.length;
        }
        return 0;
      };
      defs.set(ruleNum, func);
    }
  }

  next:
  for (const line of lines) {
    const rule = defs.get(0)!;
    if (rule(line) === line.length) { part1 += 1; }

    // Is this cheating?
    const start = defs.get(42)!;
    const end = defs.get(31)!;
    let copy = line;

    const startResult1 = start(copy);
    if (startResult1 === 0) {
      continue;
    }
    copy = copy.slice(startResult1);

    tl:
    while (copy.length > 0) {
      let repeatCount = 0;
      let repeatCopy = copy;
      while (repeatCopy.length > 0) {
        const repeatStartResult = start(repeatCopy);
        if (repeatStartResult === 0) {
          break;
        }
        repeatCount += 1;
        repeatCopy = repeatCopy.slice(repeatStartResult);
      }

      while (repeatCount > 0) {
        const repeatEndResult = end(repeatCopy);
        if (repeatEndResult === 0) {
          break;
        }
        repeatCopy = repeatCopy.slice(repeatEndResult);
        repeatCount -= 1;
        if (repeatCount === 0) {
          copy = repeatCopy;
          break tl;
        }
      }

      const startResult2 = start(copy);
      if (startResult2 === 0) {
        continue next;
      }
      copy = copy.slice(startResult2);

      if (copy.length === 0) {
        continue next;
      }
    }

    if (copy.length === 0) {
      part2 += 1;
    }
  }

  return { part1, part2 };
}
