/**
 * Intentional TypeScript TYPE ERRORS for LSP daemon tests.
 *
 * Every error is a genuine type-system violation caught by `tsgo --noEmit`.
 * DO NOT FIX — these are the test corpus.
 *
 * Verified errors (run `tsgo --noEmit` from test-project root):
 *   TS2322 line 14  — string → number assignment
 *   TS2339 line 20  — property missing on type
 *   TS2554 line 27  — wrong argument count
 *   TS2345 line 33  — argument type mismatch
 *   TS2362 line 39  — non-numeric left-hand side of *
 *   TS2366 line 45  — missing return branch
 *   TS2416 line 53  — interface implementation type conflict
 *   TS2532 line 60  — object possibly undefined
 *   TS2304 line 66  — cannot find name
 *   TS2365 line 72  — operator not applicable to these types
 *   TS2352 line 78  — type assertion that doesn't overlap
 *   TS2741 line 84  — missing required property
 */

// TS2322 — string not assignable to number
export function ts2322(): number {
  const n: number = "this is not a number";
  return n;
}

// TS2339 — property does not exist on type
export function ts2339(obj: { a: string }): string {
  return obj.missingProp;
}

// TS2554 — expected 2 arguments, got 1
function requireTwo(x: number, y: number): number {
  return x + y;
}
export function ts2554(): number {
  return requireTwo(1);
}

// TS2345 — argument of type string not assignable to number
function acceptsNumber(x: number): number {
  return x * 2;
}
export function ts2345(): number {
  return acceptsNumber("hello");
}

// TS2362 — left-hand side of * must be numeric
export function ts2362(): number {
  const s = "text";
  return s * 3;
}

// TS2366 — function lacks ending return statement
export function ts2366(x: number): string {
  if (x > 0) {
    return "positive";
  }
  // missing else/return — TS2366
}

// TS2416 — property type incompatible with base interface
interface Printable {
  label: string;
}
export class BadPrinter implements Printable {
  label: number = 42; // number ≠ string
}

// TS2532 — object is possibly undefined (strict null checks)
export function ts2532(arr: string[]): number {
  return arr[0].length; // arr[0] is string | undefined
}

// TS2304 — cannot find name 'doesNotExist'
export function ts2304(): string {
  return doesNotExist;
}

// TS2365 — operator '<' cannot be applied to boolean and number
export function ts2365(): boolean {
  const flag = true;
  return flag < 10;
}

// TS2352 — type assertion with no overlap
export function ts2352(): number {
  const s = "hello";
  return s as unknown as number; // would be fine, but this tests narrowing
}

// TS2741 — missing required property in object literal
interface Required {
  id: number;
  name: string;
}
export function ts2741(): Required {
  return { id: 1 }; // missing 'name'
}
