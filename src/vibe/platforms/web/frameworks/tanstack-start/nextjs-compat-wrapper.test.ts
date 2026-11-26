import { expect, mock, test } from "bun:test";

import { runPageLoader, wrapNextApiRoute } from "./nextjs-compat-wrapper";

const partialModule = (): ReferenceError =>
  new ReferenceError(
    "Cannot access '__vite_ssr_import_3__' before initialization.",
  );

test("retries the tools loader when Vite hands it an incomplete auth namespace", async () => {
  const load = mock(() => Promise.resolve("loaded"));
  load.mockRejectedValueOnce(
    new TypeError(
      "undefined is not an object (evaluating 'AuthRepository.getAuthMinimalUser')",
    ),
  );

  expect(await runPageLoader(load)).toBe("loaded");
  expect(load).toHaveBeenCalledTimes(2);
});

test("propagates other loader TypeErrors immediately", async () => {
  const failure = new TypeError("undefined is not an object");
  const load = mock(() => Promise.reject(failure));

  await expect(runPageLoader(load)).rejects.toBe(failure);
  expect(load).toHaveBeenCalledTimes(1);
});

test("retries a Vite API module import before dispatching a mutation", async () => {
  const post = mock(() => new Response(null, { status: 204 }));
  let attempts = 0;
  const wrapped = wrapNextApiRoute(() => {
    attempts += 1;
    return attempts === 1
      ? Promise.reject(partialModule())
      : Promise.resolve({ POST: post });
  });

  const request = new Request("http://localhost/api/en-US/example", {
    method: "POST",
  });
  expect((await wrapped.POST?.({ request }))?.status).toBe(204);
  expect(attempts).toBe(2);
  expect(post).toHaveBeenCalledTimes(1);
});

test("propagates a Vite error after the API mutation starts", async () => {
  const failure = partialModule();
  const post = mock(() => Promise.reject(failure));
  const load = mock(() => Promise.resolve({ POST: post }));
  const wrapped = wrapNextApiRoute(load);

  const request = new Request("http://localhost/api/en-US/example", {
    method: "POST",
  });
  await expect(wrapped.POST?.({ request })).rejects.toBe(failure);
  expect(load).toHaveBeenCalledTimes(1);
  expect(post).toHaveBeenCalledTimes(1);
});
