/**
 * Cortex Move Endpoint — End-to-End Tests
 *
 * Drives the real MOVE endpoint via sendTestRequest. State is set up through the
 * real WRITE/MKDIR endpoints, and every move is cross-verified through the
 * sibling READ and LIST endpoints. Move is an in-place path rename: the old path
 * stops resolving (READ → NOT_FOUND) and the new path resolves with content
 * preserved. Directory moves re-path all descendants atomically. DB access on
 * cortexNodes is limited to isolation cleanup.
 */

import "server-only";

import { and, eq, like, or } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { cortexNodes } from "./db";
import listEndpoint from "./list/definition";
import mkdirEndpoint from "./mkdir/definition";
import moveEndpoint from "./move/definition";
import readEndpoint from "./read/definition";
import writeEndpoint from "./write/definition";

const TEST_PREFIX = "/documents/move-test";
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

/** Read a file via the real READ endpoint and return content, or null on failure. */
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

/** Assert a READ of `path` fails with NOT_FOUND (old path no longer resolves). */
async function expectNotFound(path: string): Promise<void> {
  const res = await sendTestRequest({
    endpoint: readEndpoint.GET,
    data: { path },
    user,
  });
  expect(res.success, `read of moved-away path ${path} must fail`).toBe(false);
  if (res.success) {
    return;
  }
  expect(res.errorType?.errorCode).toBe(ErrorResponseTypes.NOT_FOUND.errorCode);
}

/** List a directory and return entry paths, or null on failure. */
async function listPaths(path: string): Promise<string[] | null> {
  const res = await sendTestRequest({
    endpoint: listEndpoint.GET,
    data: { path },
    user,
  });
  expect(
    res.success,
    `list failed for ${path}: ${res.success ? "" : res.message}`,
  ).toBe(true);
  if (!res.success) {
    return null;
  }
  return res.data.entries.map((entry) => entry.entryPath);
}

describe("Cortex Move E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    await cleanup(user.id);
  });

  afterAll(async () => {
    if (user) {
      await cleanup(user.id);
    }
  });

  it("renames a file in place: old path NOT_FOUND, new path readable with content preserved", async () => {
    const from = `${TEST_PREFIX}/rename/a.md`;
    const to = `${TEST_PREFIX}/rename/b.md`;
    const content = "# Original\n\nContent must survive the rename.";
    await writeFile(from, content);

    const res = await sendTestRequest({
      endpoint: moveEndpoint.POST,
      data: { from, to },
      user,
    });
    expect(res.success, `move failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }
    expect(res.data.responseFrom).toBe(from);
    expect(res.data.responseTo).toBe(to);
    expect(res.data.nodesAffected).toBeGreaterThanOrEqual(1);

    // Old path is gone; new path carries the exact content.
    await expectNotFound(from);
    const moved = await readContent(to);
    expect(moved).toBe(content);
  });

  it("moves a file into a different existing dir: appears in new parent, gone from old", async () => {
    const oldDir = `${TEST_PREFIX}/srcdir`;
    const newDir = `${TEST_PREFIX}/dstdir`;
    const from = `${oldDir}/doc.md`;
    const to = `${newDir}/doc.md`;
    await writeFile(from, "moving between dirs");

    // Materialize the destination dir up front.
    const mk = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path: newDir, createParents: true },
      user,
    });
    expect(
      mk.success,
      `mkdir dst failed: ${mk.success ? "" : mk.message}`,
    ).toBe(true);

    const res = await sendTestRequest({
      endpoint: moveEndpoint.POST,
      data: { from, to },
      user,
    });
    expect(res.success, `move failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    const newParent = await listPaths(newDir);
    expect(newParent?.includes(to)).toBe(true);

    const oldParent = await listPaths(oldDir);
    expect(oldParent?.includes(from)).toBe(false);
  });

  it("moves a directory with children: all descendants re-pathed atomically", async () => {
    const fromDir = `${TEST_PREFIX}/tree-src`;
    const toDir = `${TEST_PREFIX}/tree-dst`;
    const childFrom = `${fromDir}/sub/leaf.md`;
    const childTo = `${toDir}/sub/leaf.md`;
    const rootFileFrom = `${fromDir}/top.md`;
    const rootFileTo = `${toDir}/top.md`;

    const childContent = "# Leaf\n\nDeeply nested content.";
    const rootContent = "# Top\n\nTop-level content.";
    await writeFile(childFrom, childContent);
    await writeFile(rootFileFrom, rootContent);

    const res = await sendTestRequest({
      endpoint: moveEndpoint.POST,
      data: { from: fromDir, to: toDir },
      user,
    });
    expect(
      res.success,
      `dir move failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }
    // Dir node + at least the two files + intermediate sub dir were re-pathed.
    expect(res.data.nodesAffected).toBeGreaterThanOrEqual(3);

    // Descendants resolve at their NEW paths with content intact.
    expect(await readContent(childTo)).toBe(childContent);
    expect(await readContent(rootFileTo)).toBe(rootContent);

    // Old descendant paths no longer resolve.
    await expectNotFound(childFrom);
    await expectNotFound(rootFileFrom);
  });

  it("move to an existing destination is rejected with CONFLICT", async () => {
    const from = `${TEST_PREFIX}/conflict-src.md`;
    const to = `${TEST_PREFIX}/conflict-dst.md`;
    await writeFile(from, "source");
    await writeFile(to, "destination already here");

    const res = await sendTestRequest({
      endpoint: moveEndpoint.POST,
      data: { from, to },
      user,
    });
    expect(res.success, "move onto existing dest must fail").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.CONFLICT.errorCode,
    );

    // Both files untouched.
    expect(await readContent(from)).toBe("source");
    expect(await readContent(to)).toBe("destination already here");
  });

  it("move of a non-existent source is rejected with NOT_FOUND", async () => {
    const res = await sendTestRequest({
      endpoint: moveEndpoint.POST,
      data: {
        from: `${TEST_PREFIX}/ghost-never-written.md`,
        to: `${TEST_PREFIX}/ghost-target.md`,
      },
      user,
    });
    expect(res.success, "move of missing source must fail").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.NOT_FOUND.errorCode,
    );
  });

  it("move from a read-only virtual mount (/threads) is rejected with FORBIDDEN", async () => {
    // /threads is a virtual mount that is not writable → move source forbidden.
    const res = await sendTestRequest({
      endpoint: moveEndpoint.POST,
      data: {
        from: "/threads/auth-redesign.md",
        to: `${TEST_PREFIX}/stolen-thread.md`,
      },
      user,
    });
    expect(res.success, "move out of /threads must be rejected").toBe(false);
    if (res.success) {
      return;
    }
    // Cross-mount / non-writable source resolves to FORBIDDEN.
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.FORBIDDEN.errorCode,
    );
  });

  it("preserves content (embedding follows the path) across a move", async () => {
    const from = `${TEST_PREFIX}/embed/before.md`;
    const to = `${TEST_PREFIX}/embed/after.md`;
    const content =
      "# Searchable Doc\n\nThe embedding index follows the moved path.";
    await writeFile(from, content);

    const res = await sendTestRequest({
      endpoint: moveEndpoint.POST,
      data: { from, to },
      user,
    });
    expect(res.success, `move failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    // Content is preserved verbatim on the new path (re-embed is best-effort,
    // but the document itself must read back intact).
    expect(await readContent(to)).toBe(content);
    await expectNotFound(from);

    // Sanity DB check: exactly one node lives at the new path, none at the old.
    const rows = await db
      .select({ path: cortexNodes.path })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, user.id),
          or(eq(cortexNodes.path, from), eq(cortexNodes.path, to)),
        ),
      );
    const paths = rows.map((r) => r.path);
    expect(paths).toContain(to);
    expect(paths).not.toContain(from);
  });
});
