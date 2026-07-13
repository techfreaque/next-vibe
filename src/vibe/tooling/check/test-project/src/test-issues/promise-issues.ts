/**
 * Test file for Promise-related lint issues
 * This file intentionally contains code that violates Promise rules
 */

// promise/param-names - Non-standard parameter names
export function badParamNames(): Promise<string> {
  return new Promise((yes, no) => {
    if (Math.random() > 0.5) {
      yes("success");
    } else {
      no(new Error("failure"));
    }
  });
}

// promise/always-return - Missing return in then
export async function missingReturn(): Promise<void> {
  await Promise.resolve("data").then((data) => {
    console.log(data);
    // Missing return
  });
}

// promise/catch-or-return - Unhandled promise rejection
export function uncaughtPromise(): void {
  Promise.resolve("data").then((data) => {
    return data.toUpperCase();
  });
  // Missing .catch() or return
}

// no-promise-executor-return - Returning in executor
export function executorReturn(): Promise<number> {
  return new Promise((resolve) => {
    return resolve(42);
  });
}

// unicorn/no-await-in-promise-methods - Await in Promise.all
export async function awaitInPromiseAll(): Promise<string[]> {
  const results = await Promise.all([
    await Promise.resolve("a"),
    await Promise.resolve("b"),
  ]);
  return results;
}

// unicorn/no-single-promise-in-promise-methods - Single promise in Promise.all
export async function singlePromiseInAll(): Promise<string[]> {
  return await Promise.all([Promise.resolve("only one")]);
}

// typescript/await-thenable - Awaiting non-thenable
export async function awaitNonThenable(): Promise<number> {
  const value = 42;
  return await value;
}

// typescript/no-for-in-array - For-in on array
export async function forInArray(): Promise<void> {
  const promises = [Promise.resolve(1), Promise.resolve(2)];
  for (const i in promises) {
    await promises[i];
  }
}

// Multiple chained promises without proper handling
export function chainedWithoutCatch(): void {
  Promise.resolve(1)
    .then((x) => x + 1)
    .then((x) => x * 2)
    .then((x) => {
      console.log(x);
    });
}
