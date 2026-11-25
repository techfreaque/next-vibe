import { expect, it } from "bun:test";

import definition, { FeedSortMode } from "./definition";

it("normalizes plain public feed sort modes to the canonical values", () => {
  const { requestSchema } = definition.GET;
  expect(requestSchema.parse({ sortMode: "hot" }).sortMode).toBe(
    FeedSortMode.HOT,
  );
  expect(requestSchema.parse({ sortMode: "new" }).sortMode).toBe(
    FeedSortMode.NEW,
  );
  expect(requestSchema.parse({ sortMode: "rising" }).sortMode).toBe(
    FeedSortMode.RISING,
  );
  expect(requestSchema.parse({ sortMode: FeedSortMode.RISING }).sortMode).toBe(
    FeedSortMode.RISING,
  );
  expect(requestSchema.parse({}).sortMode).toBe(FeedSortMode.HOT);
  expect(requestSchema.safeParse({ sortMode: "old" }).success).toBe(false);
});
