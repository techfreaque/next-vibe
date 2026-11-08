/**
 * ES2023 array polyfills for older browsers.
 *
 * The codebase uses the change-array-by-copy methods (`toSorted`,
 * `toReversed`) and `findLast`/`findLastIndex` everywhere - several of them at
 * MODULE LOAD (models registries). Browsers without them (Safari < 16,
 * Chrome < 110, older in-app webviews) crashed the whole app on boot with
 * "[...x.providers].toSorted is not a function". Installed once, before any
 * app code runs (see src/instrumentation-client.ts). No-op where native.
 */

type Compare<T> = (a: T, b: T) => number;
type Predicate<T> = (value: T, index: number, array: T[]) => boolean;

function define(name: string, value: object): void {
  if (name in Array.prototype) {
    return;
  }
  // Installing a missing standard method IS the purpose of a polyfill.
  // oxlint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, name, {
    value,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

export function installArrayPolyfills(): void {
  define("toSorted", function toSorted<T>(this: T[], compare?: Compare<T>) {
    // The polyfill for toSorted cannot call toSorted - sort on a copy.
    // oxlint-disable-next-line unicorn/no-array-sort
    return [...this].sort(compare);
  });
  define("toReversed", function toReversed<T>(this: T[]) {
    // oxlint-disable-next-line unicorn/no-array-reverse
    return [...this].reverse();
  });
  define("findLast", function findLast<T>(this: T[], predicate: Predicate<T>) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate(this[i], i, this)) {
        return this[i];
      }
    }
    return undefined;
  });
  define("findLastIndex", function findLastIndex<
    T,
  >(this: T[], predicate: Predicate<T>) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate(this[i], i, this)) {
        return i;
      }
    }
    return -1;
  });
}
