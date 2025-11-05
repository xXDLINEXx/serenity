export function tryRequire(path: string): number | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-return
    const r = require(path);
    return r;
  } catch (e) {
    return undefined;
  }
}
