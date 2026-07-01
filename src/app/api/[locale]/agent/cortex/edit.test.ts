/**
 * Cortex Edit Endpoint — End-to-End Tests
 *
 * Drives the real EDIT endpoint via sendTestRequest. Files are set up through
 * the real WRITE endpoint and every edit is cross-verified through the sibling
 * READ endpoint. DB pokes on cortexNodes are used only to assert state not
 * observable through endpoints (parsed frontmatter) and for isolation cleanup.
 */

import "server-only";

import { and, eq, like } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { cortexNodes } from "./db";
import editEndpoint from "./edit/definition";
import readEndpoint from "./read/definition";
import writeEndpoint from "./write/definition";

const TEST_PREFIX = "/documents/edit-test";
const CLEANUP_PATTERN = `${TEST_PREFIX}%`;

let user: JwtPrivatePayloadType;

async function cleanup(userId: string): Promise<void> {
  await db
    .delete(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        like(cortexNodes.path, CLEANUP_PATTERN),
      ),
    );
}

/** Write a file via the real WRITE endpoint; fails the test if it does not stick. */
async function writeFile(path: string, content: string): Promise<void> {
  const res = await sendTestRequest({
    endpoint: writeEndpoint.POST,
    data: { path, content, createParents: true },
    user,
  });
  expect(
    res.success,
    `setup write failed for ${path}: ${res.success ? "" : res.message}`,
  ).toBe(true);
}

/** Read a file via the real READ endpoint and return its content, or null on failure. */
async function readContent(path: string): Promise<string | null> {
  const res = await sendTestRequest({
    endpoint: readEndpoint.GET,
    data: { path },
    user,
  });
  expect(
    res.success,
    `read failed for ${path}: ${res.success ? "" : res.message}`,
  ).toBe(true);
  if (!res.success) {
    return null;
  }
  return res.data.content;
}

describe("Cortex Edit E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    await cleanup(user.id);
  });

  afterAll(async () => {
    if (user) {
      await cleanup(user.id);
    }
  });

  it("find/replace single occurrence: replacements>=1 and read reflects it", async () => {
    const path = `${TEST_PREFIX}/single-replace.md`;
    await writeFile(path, "# Greeting\n\nHello world. Stay sharp.");

    const res = await sendTestRequest({
      endpoint: editEndpoint.PATCH,
      data: { path, find: "Hello", replace: "Goodbye" },
      user,
    });
    expect(res.success, `edit failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe(path);
    expect(res.data.replacements).toBeGreaterThanOrEqual(1);
    expect(res.data.replacements).toBe(1);

    const content = await readContent(path);
    expect(content).toBe("# Greeting\n\nGoodbye world. Stay sharp.");
  });

  it("find/replace multiple occurrences: replacements===3 and all replaced", async () => {
    const path = `${TEST_PREFIX}/multi-replace.md`;
    await writeFile(path, "TOKEN one\nTOKEN two\nTOKEN three\n");

    const res = await sendTestRequest({
      endpoint: editEndpoint.PATCH,
      data: { path, find: "TOKEN", replace: "MARK" },
      user,
    });
    expect(res.success, `edit failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    expect(res.data.replacements).toBe(3);

    const content = await readContent(path);
    expect(content).toBe("MARK one\nMARK two\nMARK three\n");
    expect(content).not.toContain("TOKEN");
  });

  it("find/replace with no match → NOT_FOUND and content unchanged", async () => {
    const path = `${TEST_PREFIX}/no-match.md`;
    const original = "# Stable\n\nNothing here changes.";
    await writeFile(path, original);

    const res = await sendTestRequest({
      endpoint: editEndpoint.PATCH,
      data: { path, find: "DOES_NOT_EXIST", replace: "x" },
      user,
    });
    expect(res.success, "no-match edit must fail").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.NOT_FOUND.errorCode,
    );

    // Content must be untouched.
    const content = await readContent(path);
    expect(content).toBe(original);
  });

  it("line-range replace: lines 2-3 replaced, surrounding lines intact", async () => {
    const path = `${TEST_PREFIX}/line-replace.md`;
    // 5 lines: 1=L1 ... 5=L5
    await writeFile(path, "L1\nL2\nL3\nL4\nL5");

    const res = await sendTestRequest({
      endpoint: editEndpoint.PATCH,
      data: { path, startLine: 2, endLine: 3, newContent: "REPLACED" },
      user,
    });
    expect(res.success, `edit failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }
    expect(res.data.replacements).toBe(1);

    const content = await readContent(path);
    // Lines 2 and 3 collapse into the single replacement line; 1, 4, 5 intact.
    expect(content).toBe("L1\nREPLACED\nL4\nL5");
  });

  it("edit recomputes size: response.size and read size equal new byte length", async () => {
    const path = `${TEST_PREFIX}/size-recompute.md`;
    await writeFile(path, "alpha beta gamma");

    // Grow the content: "beta" (4 bytes) -> "delta-epsilon" (13 bytes).
    const res = await sendTestRequest({
      endpoint: editEndpoint.PATCH,
      data: { path, find: "beta", replace: "delta-epsilon" },
      user,
    });
    expect(res.success, `edit failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    const expected = "alpha delta-epsilon gamma";
    const expectedBytes = Buffer.byteLength(expected, "utf8");
    expect(res.data.size).toBe(expectedBytes);

    // Read reports the same recomputed size and content.
    const readRes = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path },
      user,
    });
    expect(
      readRes.success,
      `read failed: ${readRes.success ? "" : readRes.message}`,
    ).toBe(true);
    if (!readRes.success) {
      return;
    }
    expect(readRes.data.content).toBe(expected);
    expect(readRes.data.size).toBe(expectedBytes);
  });

  it("edit a non-existent path → NOT_FOUND", async () => {
    const res = await sendTestRequest({
      endpoint: editEndpoint.PATCH,
      data: {
        path: `${TEST_PREFIX}/ghost-never-written.md`,
        find: "a",
        replace: "b",
      },
      user,
    });
    expect(res.success, "edit of missing file must fail").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.NOT_FOUND.errorCode,
    );
  });

  it("edit a read-only virtual mount path (/threads) is rejected with FORBIDDEN", async () => {
    const res = await sendTestRequest({
      endpoint: editEndpoint.PATCH,
      data: { path: "/threads/auth-redesign.md", find: "a", replace: "b" },
      user,
    });
    expect(res.success, "edit of /threads must be rejected").toBe(false);
    if (res.success) {
      return;
    }
    // /threads is a virtual mount but not in WRITABLE_MOUNTS → not writable.
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.FORBIDDEN.errorCode,
    );
  });

  it("edit preserves frontmatter: body changes, frontmatter (DB) still parsed", async () => {
    const path = `${TEST_PREFIX}/frontmatter.md`;
    const original =
      "---\nstatus: open\npriority: 3\n---\n# Body text needs work.";
    await writeFile(path, original);

    const res = await sendTestRequest({
      endpoint: editEndpoint.PATCH,
      data: { path, find: "Body text needs work.", replace: "Body rewritten." },
      user,
    });
    expect(res.success, `edit failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }
    expect(res.data.replacements).toBe(1);

    // Read: frontmatter block intact, body changed.
    const content = await readContent(path);
    expect(content).toBe(
      "---\nstatus: open\npriority: 3\n---\n# Body rewritten.",
    );

    // DB poke: parsed frontmatter must survive the body edit.
    const [row] = await db
      .select({ frontmatter: cortexNodes.frontmatter })
      .from(cortexNodes)
      .where(and(eq(cortexNodes.userId, user.id), eq(cortexNodes.path, path)))
      .limit(1);
    expect(row, `row for ${path} must exist`).toBeDefined();
    if (!row) {
      return;
    }
    expect(row.frontmatter.status).toBe("open");
    expect(row.frontmatter.priority).toBe(3);
  });
});
