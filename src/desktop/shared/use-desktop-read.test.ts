import { expect, mock, test } from "bun:test";

import { submitInitialDesktopRead } from "./use-desktop-read";

test("a rejected desktop read can be retried manually after submit changes", () => {
  const form = {};
  const attempts = new WeakSet<typeof form>();
  const firstSubmit = mock(() => undefined);
  const retry = mock(() => undefined);

  submitInitialDesktopRead(attempts, form, firstSubmit, false, false);
  submitInitialDesktopRead(attempts, form, firstSubmit, false, true);
  // A server rejection still leaves useWidgetValue empty. The new callback
  // reflects the renderer's changed submit state.
  submitInitialDesktopRead(attempts, form, retry, true, false);
  submitInitialDesktopRead(attempts, form, retry, false, false);

  expect(firstSubmit).toHaveBeenCalledTimes(1);
  expect(retry).not.toHaveBeenCalled();

  retry();
  expect(retry).toHaveBeenCalledTimes(1);
});

test("validation without a response and a widget remount reuse one initial attempt", () => {
  const form = {};
  const attempts = new WeakSet<typeof form>();
  const invalidSubmit = mock(() => undefined);
  const nextSubmit = mock(() => undefined);

  submitInitialDesktopRead(attempts, form, invalidSubmit, false, false);
  submitInitialDesktopRead(attempts, form, invalidSubmit, false, false);
  submitInitialDesktopRead(attempts, form, nextSubmit, false, false);

  expect(invalidSubmit).toHaveBeenCalledTimes(1);
  expect(nextSubmit).not.toHaveBeenCalled();
});

test("cached responses, in-flight reads and response-only widgets skip initial submit", () => {
  const submit = mock(() => undefined);
  const readyForm = {};
  const attempts = new WeakSet<typeof readyForm>();
  submitInitialDesktopRead(attempts, {}, submit, true, false);
  submitInitialDesktopRead(attempts, readyForm, submit, false, true);
  submitInitialDesktopRead(attempts, readyForm, undefined, false, false);
  expect(submit).not.toHaveBeenCalled();

  submitInitialDesktopRead(attempts, readyForm, submit, false, false);
  expect(submit).toHaveBeenCalledTimes(1);

  // Another form starts its own initial read.
  submitInitialDesktopRead(attempts, {}, submit, false, false);
  expect(submit).toHaveBeenCalledTimes(2);
});
