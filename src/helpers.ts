export function clone<T>(layout: T): T {
  return JSON.parse(JSON.stringify(layout)) as T;
}

export function printLayout2D(layout: (string | number)[][], generation: number, clear = true) {
  if (clear) {
    // eslint-disable-next-line no-console
    console.clear();
  }
  const columns = layout[0].length;
  const div = '='.repeat(columns);
  // eslint-disable-next-line no-console
  console.log(
    `${generation.toString().padStart(columns)}\n${div}\n${layout.map((row) => row.join('')).join('\n')}\n${div}\n`,
  );
}
