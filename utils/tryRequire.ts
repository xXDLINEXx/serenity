export function tryRequire(path: string): any {
  try {
    return require(path);
  } catch (e) {
    console.warn(`Failed to require: ${path}`, e);
    return undefined;
  }
}
