/**
 * Test file for Node.js and Unicorn plugin issues.
 * Mix of fixable and non-fixable violations — stable now that config has fix: false.
 */

// unicorn/prefer-node-protocol — should use node: prefix (fixable)
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { EventEmitter } from "node:events";

// unicorn/no-new-array — use Array.from instead (fixable by ESLint, not by oxlint)
export function badArray(n: number): string[] {
  return new Array(n).fill("");
}

// unicorn/prefer-includes — use .includes() (fixable by ESLint, not by oxlint)
export function checkIndex(arr: string[], val: string): boolean {
  return arr.indexOf(val) !== -1;
}

// unicorn/prefer-string-starts-ends-with — use startsWith (fixable)
export function checkStr(s: string): boolean {
  return s.indexOf("prefix") === 0;
}

// unicorn/no-useless-spread — unnecessary spread before map (fixable)
export function uselessSpread(arr: string[]): string[] {
  return [...arr].map((x) => x.toLowerCase());
}

// unicorn/prefer-array-flat — use .flat() instead of reduce (fixable)
export function flatBad(arrs: string[][]): string[] {
  return arrs.flat();
}

// unicorn/prefer-array-flat-map — use flatMap (fixable)
export function flatMapBad(arr: string[]): string[] {
  return arr
    .map((x) => [x, x.toUpperCase()])
    .flat();
}

// unicorn/prefer-set-size — use .size (fixable)
export function setSize(s: Set<string>): number {
  return [...s].length;
}

// no-console — not auto-fixable (removal breaks behavior)
export function readConfig(p: string): string {
  const content = readFileSync(join(p, "config.json"), "utf8");
  console.log("loaded", content.length);
  return content;
}

// eqeqeq — loose equality, not auto-fixable (semantics change)
export function isNullish(val: unknown): boolean {
  return val == null;
}

// no-self-compare — NaN check pattern, not auto-fixable
export function isNotANumber(val: number): boolean {
  return val !== val;
}

export const emitter = new EventEmitter();
