type TestFunc = (v: number) => boolean;
interface IRuleList extends Record<string, TestFunc> {}

function getTickets(str: string) {
  return str.split(/\n/)
    .slice(1)
    .map((ticket) => {
      return ticket.trim().split(',').map((v) => parseInt(v, 10));
    });
}

/**
 * Day 16 (2020)
 * yarn start --year 2020 16
 * @see {@link https://adventofcode.com/2020/day/16}
 */
export function solution(contents: string) {
  const [ rawRules, rawMyTicket, rawOtherTickets ] = contents.split(/\n{2}/);
  const rules = rawRules
    .split(/\n/)
    .reduce(
      (prev: IRuleList, rule: string) => {
        const [ ruleName, ruleValues ] = rule.split(': ');
        const pairs = ruleValues
          .split(' or ')
          .map((val) => {
            return val.split('-').map((v) => parseInt(v, 10)) as [ number, number ];
          });
        return {
          ...prev,
          [ ruleName ]: (val: number) => {
            return pairs.some(([ low, high ]) => {
              return low <= val && val <= high;
            });
          },
        };
      },
      Object.create(null) as IRuleList,
    );

  const [ myTicket ] = getTickets(rawMyTicket);
  const otherTickets = getTickets(rawOtherTickets);
  const validTickets = [];
  const ruleTests = Object.values(rules);
  let part1 = 0;
  for (const ticket of otherTickets) {
    const current = part1;
    ticketLoop:
    for (const value of ticket) {
      for (const rule of ruleTests) {
        if (rule(value)) {
          continue ticketLoop;
        }
      }
      part1 += value;
    }
    if (part1 === current) {
      validTickets.push(ticket);
    }
  }

  const ruleNames = Object.keys(rules);
  const fieldMap = new Map<string, number[]>();
  const columnFreqs  = new Map<number, number>();
  for (const [ key, rule ] of Object.entries(rules)) {
    const candidates: number[] = [];
    nextColumn:
    for (let index = 0; index < myTicket.length; index += 1) {
      for (const ticket of validTickets) {
        if (!rule(ticket[index])) {
          continue nextColumn;
        }
      }
      candidates.push(index);
      columnFreqs.set(index, (columnFreqs.get(index) ?? 0) + 1);
    }
    fieldMap.set(key, candidates);
  }

  const columnCandidateFreqs = Array.from(columnFreqs.entries()).sort(([ , a ], [ , b ]) => a - b);
  for (const [ columnIndex ] of columnCandidateFreqs) {
    const columnFieldCandidates = Array.from(fieldMap).filter(([ , c ]) => c.includes(columnIndex));
    candidateLoop:
    for (const [ key ] of columnFieldCandidates) {
      for (const [ fieldKey, fieldCandidates ] of fieldMap) {
        if (fieldKey !== key) { continue; }
        if (!fieldCandidates.some((fc) => fc !== columnIndex)) {
          continue candidateLoop;
        }
      }
      for (const ruleName of ruleNames) {
        fieldMap.set(
          ruleName,
          ruleName !== key ?
            fieldMap.get(ruleName)!.filter((c) => c !== columnIndex) :
            [ columnIndex ],
        );
      }
    }
  }

  const part2 = ruleNames
    .filter((key) => /^departure/i.test(key))
    .reduce(
      (prev: number, cur: string) => {
        const [ index ] = fieldMap.get(cur)!;
        return prev * myTicket[index];
      },
      1,
    );

  return { part1, part2 };
}
