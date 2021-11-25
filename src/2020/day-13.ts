type BusItem = number | typeof NaN;

interface ITimeConfig { timeMap: Map<bigint, bigint>; sorted: bigint[]; }
function getTimeConfig(buses: BusItem[]): ITimeConfig {
  const timeMap = new Map<bigint, bigint>();
  for (let t = 0; t < buses.length; t += 1) {
    const bus = buses[t];
    if (!Number.isNaN(bus)) {
      const bigBus = BigInt(bus);
      timeMap.set(bigBus, BigInt(t) % bigBus);
    }
  }
  const sorted = Array.from(timeMap.keys()).sort((a, b) => Number(b - a));
  return { timeMap, sorted };
}

function earliestTime(buses: BusItem[]) {
  const { timeMap, sorted: [ bigBus, ...otherBuses ] } = getTimeConfig(buses);
  let add = BigInt(bigBus);
  let highest = BigInt(timeMap.get(bigBus)!);
  for (const nextBus of otherBuses) {
    const diff = timeMap.get(nextBus)!;
    while (highest % nextBus !== diff) {
      highest += add;
    }
    add *= nextBus;
  }
  return add - highest;
}

/**
 * Day 13 (2020)
 * yarn start --year 2020 13
 * @see {@link https://adventofcode.com/2020/day/13}
 */
export function solution(contents: string) {
  const [ rawDepart, rawBuses ] = contents.split(/\n/);
  const depart = parseInt(rawDepart, 10);
  const buses: BusItem[] = rawBuses.split(',').map((b) => parseInt(b, 10));

  const activeBuses = buses.filter((b) => !Number.isNaN(b));
  const waitTimes = activeBuses.map((bus) =>  bus - (depart % bus));
  const minWaitTime = Math.min(...waitTimes);
  const part1 = minWaitTime * activeBuses[waitTimes.indexOf(minWaitTime)];

  const part2 = earliestTime(buses);

  return { part1, part2 };
}
