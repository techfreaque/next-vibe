import { expect, test } from "bun:test";

import { createUrlNavigationRestore } from "./url-navigation-restore";

test("slower history navigation cannot replace the newer tool", async () => {
  const previous = Promise.withResolvers<string>();
  const restore = createUrlNavigationRestore<string>();
  const published: (string | null)[] = [];
  const publish = (entry: string | null): void => {
    published.push(entry);
  };

  const restoringPrevious = restore.restore(() => previous.promise, publish);
  await restore.restore(() => Promise.resolve("payment-processor"), publish);
  previous.resolve("users-list");
  await restoringPrevious;

  expect(published).toEqual(["payment-processor"]);
});

test("an explicit navigation cancels pending history restoration", async () => {
  const previous = Promise.withResolvers<string>();
  const restore = createUrlNavigationRestore<string>();
  const published: (string | null)[] = [];

  const restoringPrevious = restore.restore(
    () => previous.promise,
    (entry) => {
      published.push(entry);
    },
  );
  restore.cancel();
  previous.resolve("users-list");
  await restoringPrevious;

  expect(published).toEqual([]);
});
