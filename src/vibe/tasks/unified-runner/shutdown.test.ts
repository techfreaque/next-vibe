import { expect, test } from "bun:test";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import { TaskCategory } from "../enum";
import { UnifiedTaskRunnerRepository } from "./repository";
import type { TaskRunner } from "./types";

test("server abort stops task runners and drain waits for in-flight work", async () => {
  const shutdown = new AbortController();
  const pulse = Promise.withResolvers<void>();
  let taskAborted = false;
  const task: TaskRunner<string> = {
    type: "task-runner",
    name: "shutdown-test",
    description: "shutdown-test",
    category: TaskCategory.SYSTEM,
    enabled: true,
    async run({ signal }) {
      signal.addEventListener(
        "abort",
        () => {
          taskAborted = true;
        },
        { once: true },
      );
      await pulse.promise;
    },
  };

  const logger = createEndpointLogger(false, defaultLocale);
  expect(
    UnifiedTaskRunnerRepository.start(
      [task],
      shutdown.signal,
      defaultLocale,
      logger,
      false,
    ).success,
  ).toBe(true);

  let drained = false;
  const drain = UnifiedTaskRunnerRepository.waitForTaskRunners().then(() => {
    drained = true;
  });
  try {
    shutdown.abort();
    expect(taskAborted).toBe(true);
    await Promise.resolve();
    expect(drained).toBe(false);
  } finally {
    pulse.resolve();
    await drain;
  }
  expect(drained).toBe(true);
});

test("an already-aborted server skips a late task runner startup", () => {
  let started = false;
  const task: TaskRunner<string> = {
    type: "task-runner",
    name: "late-startup-test",
    description: "late-startup-test",
    category: TaskCategory.SYSTEM,
    enabled: true,
    run() {
      started = true;
    },
  };

  const logger = createEndpointLogger(false, defaultLocale);
  UnifiedTaskRunnerRepository.start(
    [task],
    AbortSignal.abort(),
    defaultLocale,
    logger,
    false,
  );
  expect(started).toBe(false);
});
