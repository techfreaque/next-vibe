import { expect, it, mock } from "bun:test";

const select = mock(() => undefined);
void mock.module("next-vibe/database", () => ({ db: { select } }));

const userId = "c8d910af-b361-4b3d-9374-e894d0a17929";
const threadId = "eb3a8c4c-de39-4d30-baad-fa32f10d555e";

it("lists no children for thread files or malformed folder IDs", async () => {
  const { listThreadPath } = await import("./threads");
  for (const path of [
    `/threads/private/sample-thread-${threadId}.md`,
    `/threads/private/${threadId}.md`,
    "/threads/private/malformed-folder-id",
  ]) {
    expect(await listThreadPath(userId, path)).toEqual([]);
  }
  expect(select).not.toHaveBeenCalled();
});
