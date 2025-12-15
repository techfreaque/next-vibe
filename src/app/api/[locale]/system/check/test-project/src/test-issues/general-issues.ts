/**
 * Test file for general JavaScript/TypeScript lint issues
 * This file intentionally contains code that violates general rules
 */

// no-debugger - Debugger statement
export function withDebugger(): void {
  debugger;
  console.log("debugging");
}

// no-console - Console statements
export function withConsole(): void {
  console.log("info");
  console.warn("warning");
  console.error("error");
  console.debug("debug");
}

// curly - Missing curly braces
export function noCurly(x: number): number {
  if (x > 0) return x;
  else return -x;
}

// eqeqeq - Using == instead of ===
export function looseEquality(a: unknown, b: unknown): boolean {
  if (a == b) {
    return true;
  }
  if (a != b) {
    return false;
  }
  return a == null;
}

// no-template-curly-in-string - Template literal syntax in regular string
export function templateInString(): string {
  const name = "World";
  return "Hello ${name}!";
}

// no-unsafe-optional-chaining - Unsafe optional chaining
export function unsafeOptionalChaining(obj: { a?: { b: number } } | null): number {
  return 1 + obj?.a?.b;
}

// array-callback-return - Missing return in array callback
export function noArrayReturn(arr: number[]): number[] {
  return arr.map((x) => {
    const result = x * 2;
  });
}

// no-constructor-return - Returning from constructor
export class ConstructorReturn {
  value: number;

  constructor() {
    this.value = 1;
    return { value: 2 };
  }
}

// no-self-compare - Comparing variable to itself
export function selfCompare(x: number): boolean {
  return x === x;
}

// no-unreachable-loop - Loop that only runs once
export function unreachableLoop(arr: number[]): number | undefined {
  for (const item of arr) {
    return item;
  }
  return undefined;
}

// no-unused-private-class-members - Unused private member
export class UnusedPrivate {
  #unusedField = 42;
  usedField = 1;

  getUsed(): number {
    return this.usedField;
  }
}

// prefer-template - String concatenation instead of template
export function stringConcat(a: string, b: string): string {
  return a + " " + b;
}

// camelcase - Non-camelCase variable names
export function bad_naming(): void {
  const my_variable = 1;
  const another_one = 2;
  console.log(my_variable, another_one);
}

// oxc/missing-throw - Forgotten throw
export function missingThrow(): void {
  new Error("This error is never thrown");
}

// oxc/bad-comparison-sequence - Bad comparison
export function badComparison(a: number, b: number, c: number): boolean {
  return a < b < c;
}

// oxc/double-comparisons - Redundant comparison
export function doubleComparison(x: number): boolean {
  return x >= 0 && x >= 0;
}

// unicorn/no-new-array - new Array usage
export function newArrayUsage(): number[] {
  return new Array(5);
}

// unicorn/prefer-array-flat - Manual array flattening
export function manualFlatten(arr: number[][]): number[] {
  return [].concat(...arr);
}

// unicorn/prefer-includes - indexOf instead of includes
export function useIndexOf(arr: string[], item: string): boolean {
  return arr.indexOf(item) !== -1;
}

// unicorn/prefer-string-starts-ends-with - Manual string check
export function manualStartsWith(str: string, prefix: string): boolean {
  return str.slice(0, prefix.length) === prefix;
}
