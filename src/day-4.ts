/**
 * Day 4
 * yarn start 4
 * @see {@link https://adventofcode.com/2020/day/4}
 */
export function solution(contents: string) {
  const expected = [
    'byr', // (Birth Year)
    'iyr', // (Issue Year)
    'eyr', // (Expiration Year)
    'hgt', // (Height)
    'hcl', // (Hair Color)
    'ecl', // (Eye Color)
    'pid', // (Passport ID)
    // 'cid', // (Country ID) [optional]
  ] as const;
  const people = contents.split(/\n{2,}/)
    .map((group: string) => {
      return Array.from(group.matchAll(/(?<fieldKey>\w+):(?<fieldValue>\S+)/gim))
        .reduce(
          (prev, cur) => ({
            ...prev,
            [ cur.groups!.fieldKey ]: cur.groups!.fieldValue,
          }),
          {} as Record<string, string>,
        );
    });
  /**
   * byr (Birth Year) - four digits; at least 1920 and at most 2002.
   * iyr (Issue Year) - four digits; at least 2010 and at most 2020.
   * eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
   * hgt (Height) - a number followed by either cm or in:
   * - If cm, the number must be at least 150 and at most 193.
   * - If in, the number must be at least 59 and at most 76.
   * hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
   * ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
   * pid (Passport ID) - a nine-digit number, including leading zeroes.
   * cid (Country ID) - ignored, missing or not.
   */
  let part1 = 0;
  let part2 = 0;
  const isValid = (key: string, value: string | undefined) => {
    if (typeof value !== 'undefined') {
      switch (key) {
        case 'byr': {
          const num = parseInt(value, 10);
          return num >= 1920 && num <= 2002;
        }
        case 'iyr': {
          const num = parseInt(value, 10);
          return num >= 2010 && num <= 2020;
        }
        case 'eyr': {
          const num = parseInt(value, 10);
          return num >= 2020 && num <= 2030;
        }
        case 'hgt': {
          const [ , ns = '0', unit = 'cm' ] = /(\d+)(cm|in)/.exec(value) ?? [];
          const num = parseInt(ns, 10);
          return (
            unit === 'cm' && num >= 150 && num <= 193
          ) || (
            unit === 'in' && num >= 59 && num <= 76
          );
        }
        case 'hcl': {
          return /^#[0-9a-f]{6}$/.test(value);
        }
        case 'ecl': {
          return [ 'amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth' ].includes(value);
        }
        case 'pid': {
          return /^\d{9}$/.test(value);
        }
      }
    }
    return false;
  };
  for (const person of people) {
    part1 += !expected.some((key) => typeof person[key] === 'undefined') ? 1 : 0;
    part2 += !expected.some((key) => !isValid(key, person[key])) ? 1 : 0;
  }
  return { part1, part2 };
}
