/**
 * Cortex Tree Endpoint — End-to-End Tests
 *
 * Drives the real TREE endpoint via sendTestRequest. All document/dir state is
 * built exclusively through the real WRITE and MKDIR endpoints, and counts are
 * cross-checked against the real LIST endpoint. Direct DB access on cortexNodes
 * is limited to isolation cleanup.
 */

import "server-only";

import { and, eq, like } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { db } from "@/app/api/[locale]/system/db";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";

import { cortexNodes } from "./db";
import listEndpoint from "./list/definition";
import mkdirEndpoint from "./mkdir/definition";
import treeEndpoint, { type CortexTreeResponseOutput } from "./tree/definition";
import writeEndpoint from "./write/definition";

const TEST_PREFIX = "/documents/tree-test";
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

/** Create a directory via the real MKDIR endpoint; fails the test if it does not stick. */
async function mkdir(path: string): Promise<void> {
  const res = await sendTestRequest({
    endpoint: mkdirEndpoint.POST,
    data: { path, createParents: true },
    user,
  });
  expect(
    res.success,
    `setup mkdir failed for ${path}: ${res.success ? "" : res.message}`,
  ).toBe(true);
}

function getTree(
  path: string,
  depth: number,
): Promise<ResponseType<CortexTreeResponseOutput>> {
  return sendTestRequest({
    endpoint: treeEndpoint.GET,
    data: { path, depth },
    user,
  });
}

describe("Cortex Tree E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    await cleanup(user.id);
  });

  afterAll(async () => {
    if (user) {
      await cleanup(user.id);
    }
  });

  it("renders a native subtree with every filename and accurate counts", async () => {
    // Known structure: 2 dirs (notes, tasks) + 3 files.
    const base = `${TEST_PREFIX}/struct`;
    await writeFile(`${base}/readme.md`, "root file");
    await writeFile(`${base}/notes/idea.md`, "an idea");
    await writeFile(`${base}/tasks/todo.md`, "a todo");
    // notes and tasks dirs are auto-created by the writes above.

    const res = await getTree(base, 5);
    expect(res.success, `tree failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    expect(res.data.tree).toContain("readme.md");
    expect(res.data.tree).toContain("idea.md");
    expect(res.data.tree).toContain("todo.md");
    expect(res.data.tree).toContain("notes/");
    expect(res.data.tree).toContain("tasks/");

    // 3 files, 2 dirs under the base.
    expect(res.data.totalFiles).toBe(3);
    expect(res.data.totalDirs).toBe(2);
  });

  it("limits tree rendering by depth", async () => {
    // /a/b/c/deep.md under the prefix — 3 nested dirs deep.
    const base = `${TEST_PREFIX}/deeptest`;
    await writeFile(`${base}/shallow.md`, "shallow file");
    await writeFile(`${base}/a/b/c/deep.md`, "deep file");

    const shallowRes = await getTree(base, 2);
    expect(
      shallowRes.success,
      `shallow tree failed: ${shallowRes.success ? "" : shallowRes.message}`,
    ).toBe(true);
    if (!shallowRes.success) {
      return;
    }
    // depth=2: shallow.md (depth 1 under base) and dir a/ (depth 1), maybe b/.
    expect(shallowRes.data.tree).toContain("shallow.md");
    expect(shallowRes.data.tree).toContain("a/");
    // The deep file is beyond depth 2 and must not appear.
    expect(shallowRes.data.tree).not.toContain("deep.md");

    const deepRes = await getTree(base, 5);
    expect(
      deepRes.success,
      `deep tree failed: ${deepRes.success ? "" : deepRes.message}`,
    ).toBe(true);
    if (!deepRes.success) {
      return;
    }
    // With ample depth everything appears.
    expect(deepRes.data.tree).toContain("shallow.md");
    expect(deepRes.data.tree).toContain("deep.md");
    expect(deepRes.data.tree).toContain("a/");
    expect(deepRes.data.tree).toContain("b/");
    expect(deepRes.data.tree).toContain("c/");
  });

  it("renders the root tree with the standard mounts", async () => {
    // Seed a document so the documents branch is non-empty.
    await writeFile(`${TEST_PREFIX}/root-probe.md`, "probe");

    const res = await getTree("/", 2);
    expect(
      res.success,
      `root tree failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    // Root line and the standard virtual mounts rendered by the repository.
    expect(res.data.tree.startsWith("/")).toBe(true);
    expect(res.data.tree).toContain("documents/");
    expect(res.data.tree).toContain("threads/");
    expect(res.data.tree).toContain("memories/");
    expect(res.data.tree).toContain("skills/");
    expect(res.data.tree).toContain("favorites/");
    expect(res.data.tree).toContain("tasks/");
    expect(res.data.totalDirs).toBeGreaterThan(0);
  });

  it("renders the /documents subtree containing the test prefix", async () => {
    await writeFile(`${TEST_PREFIX}/docs-probe.md`, "probe");

    const res = await getTree("/documents", 3);
    expect(
      res.success,
      `documents tree failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    // The documents subtree renders our prefix directory and its file.
    expect(res.data.tree).toContain("tree-test/");
    expect(res.data.tree).toContain("docs-probe.md");
    expect(res.data.totalFiles).toBeGreaterThan(0);
  });

  it("renders a virtual mount tree (/skills) from the live source", async () => {
    const res = await getTree("/skills", 3);
    expect(
      res.success,
      `skills tree failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    // Tree string always carries the mount basename as the first line.
    expect(res.data.tree).toContain("skills/");
    expect(typeof res.data.tree).toBe("string");
    expect(res.data.tree.length).toBeGreaterThan(0);

    // Cross-check entry counts against the live LIST result.
    const listRes = await sendTestRequest({
      endpoint: listEndpoint.GET,
      data: { path: "/skills" },
      user,
    });
    expect(
      listRes.success,
      `skills list failed: ${listRes.success ? "" : listRes.message}`,
    ).toBe(true);
    if (!listRes.success) {
      return;
    }
    const fileEntries = listRes.data.entries.filter(
      (e) => e.nodeType === "file",
    );
    for (const entry of fileEntries) {
      expect(res.data.tree).toContain(entry.name);
    }
  });

  it("renders an empty tree for a non-existent native path", async () => {
    // Native subtree of a path with no nodes renders just the basename line.
    const res = await getTree(`${TEST_PREFIX}/never-created-xyz`, 5);
    expect(
      res.success,
      `missing-path tree failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.tree).toContain("never-created-xyz/");
    expect(res.data.totalFiles).toBe(0);
    expect(res.data.totalDirs).toBe(0);
  });

  it("reports totalFiles/totalDirs that match the LIST view of a known structure", async () => {
    // Flat structure: 4 files + 2 dirs directly under the base.
    const base = `${TEST_PREFIX}/crosscheck`;
    await writeFile(`${base}/one.md`, "1");
    await writeFile(`${base}/two.md`, "2");
    await writeFile(`${base}/three.md`, "3");
    await writeFile(`${base}/four.md`, "4");
    await mkdir(`${base}/dir-a`);
    await mkdir(`${base}/dir-b`);

    // depth=1: only direct children counted.
    const treeRes = await getTree(base, 1);
    expect(
      treeRes.success,
      `tree failed: ${treeRes.success ? "" : treeRes.message}`,
    ).toBe(true);
    if (!treeRes.success) {
      return;
    }

    const listRes = await sendTestRequest({
      endpoint: listEndpoint.GET,
      data: { path: base },
      user,
    });
    expect(
      listRes.success,
      `list failed: ${listRes.success ? "" : listRes.message}`,
    ).toBe(true);
    if (!listRes.success) {
      return;
    }

    const listFiles = listRes.data.entries.filter(
      (e) => e.nodeType === "file",
    ).length;
    const listDirs = listRes.data.entries.filter(
      (e) => e.nodeType === "dir",
    ).length;

    expect(listFiles).toBe(4);
    expect(listDirs).toBe(2);
    // Tree direct-children counts match the LIST view exactly at depth 1.
    expect(treeRes.data.totalFiles).toBe(listFiles);
    expect(treeRes.data.totalDirs).toBe(listDirs);
  });
});
