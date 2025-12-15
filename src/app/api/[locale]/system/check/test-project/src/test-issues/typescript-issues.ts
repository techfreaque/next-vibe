/**
 * Test file for TypeScript-related lint issues
 * This file intentionally contains code that violates TypeScript rules
 */

// typescript/no-explicit-any - Using 'any' type
export function processData(data: any): any {
  return data;
}

// typescript/no-unused-vars - Unused variable
const unusedVariable = "I am not used";

// typescript/no-inferrable-types - Inferrable type annotation
const inferrableNumber: number = 42;
const inferrableString: string = "hello";
const inferrableBoolean: boolean = true;

// typescript/no-empty-function - Empty function
export function emptyFunction(): void {}

// typescript/consistent-type-imports - Should use type import
import { GreetOptions } from "../greet";

// Function using the imported type to avoid unused import error
export function greetWrapper(options: GreetOptions): string {
  return options.name;
}

// typescript/no-duplicate-enum-values - Duplicate enum values
export enum Status {
  Active = 1,
  Inactive = 2,
  Pending = 1, // Duplicate value
}

// typescript/no-extra-non-null-assertion - Extra non-null assertion
export function getNested(obj: { a?: { b?: string } } | null): string | undefined {
  return obj!!?.a?.b;
}

// typescript/explicit-function-return-type - Missing return type
export function noReturnType(x: number) {
  return x * 2;
}

// typescript/no-floating-promises - Unhandled promise
export async function floatingPromise(): Promise<void> {
  fetchData();
}

async function fetchData(): Promise<string> {
  return "data";
}

// typescript/no-misused-promises - Promise in conditional
export async function misusedPromise(): Promise<void> {
  const promise = Promise.resolve(true);
  if (promise) {
    console.log("This is wrong");
  }
}

// typescript/no-unsafe-assignment - Unsafe assignment
export function unsafeAssignment(): string {
  const data: any = getData();
  const result: string = data;
  return result;
}

function getData(): unknown {
  return "data";
}

// typescript/restrict-template-expressions - Non-string in template
export function templateIssue(obj: object): string {
  return `Object is: ${obj}`;
}
