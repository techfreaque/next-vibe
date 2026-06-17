/**
 * Cortex Mkdir Endpoint — End-to-End Tests
 *
 * Drives the real MKDIR endpoint via sendTestRequest. Created directories are
 * cross-verified through the sibling LIST endpoint (document-workspace dirs are
 * not readable as files, so LIST is the canonical way to inspect dir contents),
 * and a full round-trip is proven by writing a file into the new dir through the
 * real WRITE endpoint and reading it back through READ. DB pokes on cortexNodes
 * are limited to asserting state not observable through endpoints (the persisted
 * viewType) and to isolation cleanup.
 */

import "server-only";

import { and, eq, like } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { cortexNodes } from "./db";
import { CortexNodeType, CortexViewType } from "./enum";
import listEndpoint from "./list/definition";
import mkdirEndpoint from "./mkdir/definition";
import readEndpoint from "./read/definition";
import writeEndpoint from "./write/definition";

const TEST_PREFIX = "/documents/mkdir-test";
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

/** List a directory via the real LIST endpoint and return the entries, or null. */
async function listEntries(
  path: string,
): Promise<Array<{ entryPath: string; nodeType: string }> | null> {
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
  return res.data.entries.map((entry) => ({
    entryPath: entry.entryPath,
    nodeType: entry.nodeType,
  }));
}

describe("Cortex Mkdir E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    await cleanup(user.id);
  });

  afterAll(async () => {
    if (user) {
      await cleanup(user.id);
    }
  });

  it("creates a directory: created=true, responsePath correct, dir appears in LIST", async () => {
    const path = `${TEST_PREFIX}/basic`;

    const res = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path, createParents: true },
      user,
    });
    expect(res.success, `mkdir failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }
    expect(res.data.responsePath).toBe(path);
    expect(res.data.created).toBe(true);

    // LIST the parent — the new dir must appear with nodeType "dir".
    const entries = await listEntries(TEST_PREFIX);
    expect(entries).not.toBeNull();
    if (!entries) {
      return;
    }
    const found = entries.find((entry) => entry.entryPath === path);
    expect(
      found,
      `dir ${path} must appear in LIST of ${TEST_PREFIX}`,
    ).toBeDefined();
    if (!found) {
      return;
    }
    expect(found.nodeType).toBe("dir");
  });

  it("createParents=true creates nested intermediate dirs", async () => {
    const root = `${TEST_PREFIX}/nested`;
    const a = `${root}/a`;
    const b = `${a}/b`;
    const c = `${b}/c`;

    const res = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path: c, createParents: true },
      user,
    });
    expect(
      res.success,
      `nested mkdir failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.created).toBe(true);
    expect(res.data.responsePath).toBe(c);

    // Walk down the tree via LIST: each level must contain the next.
    const rootEntries = await listEntries(root);
    expect(
      rootEntries?.some((e) => e.entryPath === a && e.nodeType === "dir"),
    ).toBe(true);

    const aEntries = await listEntries(a);
    expect(
      aEntries?.some((e) => e.entryPath === b && e.nodeType === "dir"),
    ).toBe(true);

    const bEntries = await listEntries(b);
    expect(
      bEntries?.some((e) => e.entryPath === c && e.nodeType === "dir"),
    ).toBe(true);
  });

  it("persists viewType with createParents=true (the common mkdir --view case)", async () => {
    // createParents=true materializes parent dirs (including the target) before
    // the viewType-carrying insert. The insert upserts viewType on conflict, so
    // the requested view is applied to the target dir even though it was already
    // materialized. viewType is not surfaced in the response — DB poke is the
    // legit check.
    const path = `${TEST_PREFIX}/views/kanban-board`;

    const res = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path, viewType: CortexViewType.KANBAN, createParents: true },
      user,
    });
    expect(
      res.success,
      `mkdir w/ viewType failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.created).toBe(true);

    const [row] = await db
      .select({
        viewType: cortexNodes.viewType,
        nodeType: cortexNodes.nodeType,
      })
      .from(cortexNodes)
      .where(and(eq(cortexNodes.userId, user.id), eq(cortexNodes.path, path)))
      .limit(1);
    expect(row, `row for ${path} must exist`).toBeDefined();
    if (!row) {
      return;
    }
    expect(row.nodeType).toBe(CortexNodeType.DIR);
    expect(row.viewType).toBe(CortexViewType.KANBAN);
  });

  it("setting viewType on an existing dir updates it; omitting it preserves", async () => {
    const path = `${TEST_PREFIX}/views-update`;
    // Create without a view.
    const created = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path, createParents: true },
      user,
    });
    expect(created.success).toBe(true);

    // mkdir again WITH a viewType → upserts the view onto the existing dir.
    const withView = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path, viewType: CortexViewType.WIKI, createParents: true },
      user,
    });
    expect(withView.success).toBe(true);
    const [afterSet] = await db
      .select({ viewType: cortexNodes.viewType })
      .from(cortexNodes)
      .where(and(eq(cortexNodes.userId, user.id), eq(cortexNodes.path, path)))
      .limit(1);
    expect(afterSet?.viewType).toBe(CortexViewType.WIKI);

    // mkdir again WITHOUT a viewType → existing view is preserved, not nulled.
    const noView = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path, createParents: true },
      user,
    });
    expect(noView.success).toBe(true);
    const [afterOmit] = await db
      .select({ viewType: cortexNodes.viewType })
      .from(cortexNodes)
      .where(and(eq(cortexNodes.userId, user.id), eq(cortexNodes.path, path)))
      .limit(1);
    expect(afterOmit?.viewType).toBe(CortexViewType.WIKI);
  });

  it("is idempotent: mkdir of an existing dir returns created=false", async () => {
    const path = `${TEST_PREFIX}/idempotent`;

    const first = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path, createParents: true },
      user,
    });
    expect(
      first.success,
      `first mkdir failed: ${first.success ? "" : first.message}`,
    ).toBe(true);
    if (!first.success) {
      return;
    }
    expect(first.data.created).toBe(true);

    // Repeat — repository returns success with created=false when path exists.
    const second = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path, createParents: true },
      user,
    });
    expect(
      second.success,
      `second mkdir failed: ${second.success ? "" : second.message}`,
    ).toBe(true);
    if (!second.success) {
      return;
    }
    expect(second.data.created).toBe(false);
    expect(second.data.responsePath).toBe(path);
  });

  it("createParents=false still creates the dir (ensureParentDirs skipped, insert succeeds)", async () => {
    // The repository only gates ensureParentDirs on createParents; the final
    // insert of the requested dir always runs. With a missing parent and
    // createParents=false, the leaf dir node is still inserted (created=true).
    const path = `${TEST_PREFIX}/no-parents/leaf`;

    const res = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path, createParents: false },
      user,
    });
    expect(
      res.success,
      `mkdir createParents=false failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.created).toBe(true);
    expect(res.data.responsePath).toBe(path);

    // The leaf node exists in the DB even though its parent was not materialized.
    const [row] = await db
      .select({ nodeType: cortexNodes.nodeType })
      .from(cortexNodes)
      .where(and(eq(cortexNodes.userId, user.id), eq(cortexNodes.path, path)))
      .limit(1);
    expect(row, `leaf dir ${path} must exist`).toBeDefined();
  });

  it("mkdir under a read-only virtual mount (/threads) is rejected with FORBIDDEN", async () => {
    // /threads is a virtual mount that is NOT writable → mkdir is forbidden.
    const res = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path: "/threads/new-folder", createParents: true },
      user,
    });
    expect(res.success, "mkdir under /threads must be rejected").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.FORBIDDEN.errorCode,
    );
  });

  it("round-trip: write a file into a freshly created dir and read it back", async () => {
    const dir = `${TEST_PREFIX}/round-trip`;

    const mk = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: { path: dir, createParents: true },
      user,
    });
    expect(mk.success, `mkdir failed: ${mk.success ? "" : mk.message}`).toBe(
      true,
    );
    if (!mk.success) {
      return;
    }

    const filePath = `${dir}/note.md`;
    const content = "# Inside the new dir\n\nStay sharp.";
    const write = await sendTestRequest({
      endpoint: writeEndpoint.POST,
      data: { path: filePath, content, createParents: false },
      user,
    });
    expect(
      write.success,
      `write into new dir failed: ${write.success ? "" : write.message}`,
    ).toBe(true);
    if (!write.success) {
      return;
    }

    const read = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: filePath },
      user,
    });
    expect(
      read.success,
      `read back failed: ${read.success ? "" : read.message}`,
    ).toBe(true);
    if (!read.success) {
      return;
    }
    expect(read.data.content).toBe(content);
    expect(read.data.nodeType).toBe("file");

    // The file shows up when listing the created dir.
    const entries = await listEntries(dir);
    expect(
      entries?.some((e) => e.entryPath === filePath && e.nodeType === "file"),
    ).toBe(true);
  });
});
