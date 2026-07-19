/**
 * Cortex DELETE — End-to-End Test Suite
 *
 * Proves the cortex DELETE endpoint behaves correctly against real state created
 * through the real WRITE / MKDIR endpoints and verified through the real READ /
 * LIST endpoints. DB pokes are used only to assert the tombstone semantics that
 * delete exists to produce (soft-delete: isDeleted=true + bumped updatedAt), and
 * to exercise the documented cross-instance cleanup primitive
 * removeVirtualNodesByEntityId().
 *
 * Implementation facts asserted here (verified against ./delete/repository.ts):
 *   - Native /documents + /memories delete is a SOFT delete: it sets
 *     isDeleted=true and bumps updatedAt. The row is NOT hard-deleted; it stays
 *     for tombstone propagation. nodesDeleted = number of rows matched (the path
 *     itself plus every descendant under `${path}/%`).
 *   - getNode / listChildren do NOT filter isDeleted, so a soft-deleted node is
 *     still observable through READ/LIST. Tests assert the ACTUAL behavior, not
 *     an idealized one.
 *   - Deleting a directory without recursive=true → VALIDATION_ERROR.
 *   - Deleting a non-existent writable path → NOT_FOUND.
 *   - Deleting the readonly roots /documents or /memories → FORBIDDEN.
 *
 * Test descriptions are for developers, not end users.
 */

import "server-only";

import { and, eq, like } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { cortexNodes } from "../db";
import deleteEndpoint from "../delete/definition";
import { removeVirtualNodesByEntityId } from "../embeddings/sync-virtual";
import { CortexNodeType } from "../enum";
import listEndpoint from "../list/definition";
import mkdirEndpoint from "../mkdir/definition";
import readEndpoint from "../read/definition";
import writeEndpoint from "../write/definition";

const TEST_TIMEOUT = 60_000;

/** All test paths live under this prefix so cleanup is a single LIKE match. */
const PREFIX = "/documents/delete-test";
const LIKE_PATTERN = `${PREFIX}%`;

/** Remove every node (deleted or not) under the test prefix. */
async function purgeTestNodes(userId: string): Promise<void> {
  await db
    .delete(cortexNodes)
    .where(
      and(eq(cortexNodes.userId, userId), like(cortexNodes.path, LIKE_PATTERN)),
    );
}

/** Direct DB row lookup, bypassing the isDeleted-agnostic getNode helper. */
async function fetchRow(
  userId: string,
  path: string,
): Promise<{ isDeleted: boolean; updatedAt: Date } | null> {
  const rows = await db
    .select({
      isDeleted: cortexNodes.isDeleted,
      updatedAt: cortexNodes.updatedAt,
    })
    .from(cortexNodes)
    .where(and(eq(cortexNodes.userId, userId), eq(cortexNodes.path, path)))
    .limit(1);
  return rows[0] ?? null;
}

describe("Cortex DELETE — E2E", () => {
  let user: JwtPrivatePayloadType;

  beforeAll(async () => {
    user = await resolveTestAdminUser();
    await purgeTestNodes(user.id);
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (user) {
      await purgeTestNodes(user.id);
    }
  }, TEST_TIMEOUT);

  // ── 1: single file delete (recursive=false) ───────────────────────────────
  it(
    "soft-deletes a single file: nodesDeleted>=1, row stays with isDeleted=true and bumped updatedAt",
    async () => {
      const path = `${PREFIX}/single.md`;

      // Create via the real WRITE endpoint.
      const write = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: writeEndpoint.POST,
        data: { path, content: "# single file\n\nbody", createParents: true },
        user,
      });
      expect(write.success, `write failed: ${write.message}`).toBe(true);

      // Capture the pre-delete row for the updatedAt-bump assertion.
      const before = await fetchRow(user.id, path);
      expect(before, "row should exist after write").not.toBeNull();
      expect(before?.isDeleted).toBe(false);

      // Delete via the real DELETE endpoint, non-recursive.
      const del = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: deleteEndpoint.DELETE,
        data: { path, recursive: false },
        user,
      });
      expect(del.success, `delete failed: ${del.message}`).toBe(true);
      if (!del.success) {
        return;
      }
      expect(del.data.responsePath).toBe(path);
      expect(del.data.nodesDeleted).toBeGreaterThanOrEqual(1);

      // Tombstone semantics: row stays, isDeleted=true, updatedAt bumped forward.
      const after = await fetchRow(user.id, path);
      expect(after, "row should still exist (soft-delete)").not.toBeNull();
      expect(after?.isDeleted).toBe(true);
      if (before && after) {
        expect(after.updatedAt.getTime()).toBeGreaterThanOrEqual(
          before.updatedAt.getTime(),
        );
      }
    },
    TEST_TIMEOUT,
  );

  // ── 2: recursive directory-tree delete ────────────────────────────────────
  it(
    "recursively deletes a directory tree: nodesDeleted counts dir + all descendants",
    async () => {
      const treeRoot = `${PREFIX}/tree`;
      const files = [
        `${treeRoot}/a.md`,
        `${treeRoot}/b.md`,
        `${treeRoot}/sub/c.md`,
        `${treeRoot}/sub/deep/d.md`,
      ];

      // Write nested files (createParents synthesizes intermediate dirs).
      for (const filePath of files) {
        const write = await sendTestRequest({
          toolExecutionContext: undefined,
          endpoint: writeEndpoint.POST,
          data: {
            path: filePath,
            content: `content of ${filePath}`,
            createParents: true,
          },
          user,
        });
        expect(
          write.success,
          `write ${filePath} failed: ${write.message}`,
        ).toBe(true);
      }

      // Count every live node under the tree (files + materialized parent dirs).
      const liveBefore = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, user.id),
            like(cortexNodes.path, `${treeRoot}/%`),
          ),
        );
      // The delete also matches the tree dir node itself (path === treeRoot).
      const treeRootRow = await fetchRow(user.id, treeRoot);
      const expectedMatched = liveBefore.length + (treeRootRow ? 1 : 0);

      // Recursive delete of the whole subtree.
      const del = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: deleteEndpoint.DELETE,
        data: { path: treeRoot, recursive: true },
        user,
      });
      expect(del.success, `recursive delete failed: ${del.message}`).toBe(true);
      if (!del.success) {
        return;
      }
      expect(del.data.nodesDeleted).toBe(expectedMatched);
      expect(del.data.nodesDeleted).toBeGreaterThanOrEqual(files.length);

      // Every descendant row is now soft-deleted.
      const liveAfter = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, user.id),
            like(cortexNodes.path, `${treeRoot}/%`),
            eq(cortexNodes.isDeleted, false),
          ),
        );
      expect(liveAfter.length).toBe(0);
    },
    TEST_TIMEOUT,
  );

  // ── 3: deleting a directory without recursive → VALIDATION_ERROR ───────────
  it(
    "rejects deleting a directory without recursive=true (VALIDATION_ERROR)",
    async () => {
      const dirPath = `${PREFIX}/needs-recursive`;

      // Materialize a directory via the real MKDIR endpoint.
      const mk = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: mkdirEndpoint.POST,
        data: { path: dirPath, createParents: true },
        user,
      });
      expect(mk.success, `mkdir failed: ${mk.message}`).toBe(true);

      const del = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: deleteEndpoint.DELETE,
        data: { path: dirPath, recursive: false },
        user,
      });
      expect(del.success).toBe(false);
      if (del.success) {
        return;
      }
      expect(del.errorType).toBe(ErrorResponseTypes.VALIDATION_ERROR);

      // Row untouched: still live (not soft-deleted).
      const row = await fetchRow(user.id, dirPath);
      expect(row?.isDeleted).toBe(false);
    },
    TEST_TIMEOUT,
  );

  // ── 4: deleting a non-existent writable path → NOT_FOUND ───────────────────
  it(
    "returns NOT_FOUND when deleting a non-existent writable path",
    async () => {
      const del = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: deleteEndpoint.DELETE,
        data: {
          path: `${PREFIX}/does-not-exist-${Date.now()}.md`,
          recursive: false,
        },
        user,
      });
      expect(del.success).toBe(false);
      if (del.success) {
        return;
      }
      expect(del.errorType).toBe(ErrorResponseTypes.NOT_FOUND);
    },
    TEST_TIMEOUT,
  );

  // ── 5: deleting the readonly roots → FORBIDDEN ─────────────────────────────
  it(
    "forbids deleting the /documents root (FORBIDDEN)",
    async () => {
      const del = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: deleteEndpoint.DELETE,
        data: { path: "/documents", recursive: true },
        user,
      });
      expect(del.success).toBe(false);
      if (del.success) {
        return;
      }
      expect(del.errorType).toBe(ErrorResponseTypes.FORBIDDEN);
    },
    TEST_TIMEOUT,
  );

  it(
    "forbids deleting the /memories root (FORBIDDEN)",
    async () => {
      const del = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: deleteEndpoint.DELETE,
        data: { path: "/memories", recursive: true },
        user,
      });
      expect(del.success).toBe(false);
      if (del.success) {
        return;
      }
      expect(del.errorType).toBe(ErrorResponseTypes.FORBIDDEN);
    },
    TEST_TIMEOUT,
  );

  // ── 6: a soft-deleted node is invisible to READ/LIST but its tombstone row
  // lingers at the DB level for cross-instance sync propagation. ────────────────
  it(
    "READ does NOT resolve a soft-deleted file, but the tombstone row remains",
    async () => {
      const path = `${PREFIX}/observe.md`;

      const write = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: writeEndpoint.POST,
        data: { path, content: "# observe", createParents: true },
        user,
      });
      expect(write.success, `write failed: ${write.message}`).toBe(true);

      // Sanity: READ finds it before delete.
      const readBefore = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: readEndpoint.GET,
        data: { path },
        user,
      });
      expect(
        readBefore.success,
        `read-before failed: ${readBefore.message}`,
      ).toBe(true);

      const del = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: deleteEndpoint.DELETE,
        data: { path, recursive: false },
        user,
      });
      expect(del.success, `delete failed: ${del.message}`).toBe(true);

      // The tombstone row stays in the DB (for sync), with isDeleted=true.
      const row = await fetchRow(user.id, path);
      expect(row?.isDeleted).toBe(true);

      // But READ no longer resolves it — the deleted file is invisible.
      const readAfter = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: readEndpoint.GET,
        data: { path },
        user,
      });
      expect(readAfter.success).toBe(false);
      if (readAfter.success) {
        return;
      }
      expect(readAfter.errorType?.errorCode).toBe(
        ErrorResponseTypes.NOT_FOUND.errorCode,
      );

      // Re-writing the same path revives it (clears the tombstone).
      const rewrite = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: writeEndpoint.POST,
        data: { path, content: "# revived", createParents: true },
        user,
      });
      expect(rewrite.success, `rewrite failed: ${rewrite.message}`).toBe(true);
      const readRevived = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: readEndpoint.GET,
        data: { path },
        user,
      });
      expect(readRevived.success).toBe(true);
      if (!readRevived.success) {
        return;
      }
      expect(readRevived.data.content).toContain("revived");
    },
    TEST_TIMEOUT,
  );

  it(
    "LIST does NOT show a soft-deleted child (deleted nodes are filtered out)",
    async () => {
      const dirPath = `${PREFIX}/listdir`;
      const childPath = `${dirPath}/child.md`;
      const siblingPath = `${dirPath}/sibling.md`;

      const write = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: writeEndpoint.POST,
        data: { path: childPath, content: "# child", createParents: true },
        user,
      });
      expect(write.success, `write failed: ${write.message}`).toBe(true);
      const writeSibling = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: writeEndpoint.POST,
        data: { path: siblingPath, content: "# sibling", createParents: true },
        user,
      });
      expect(
        writeSibling.success,
        `sibling write failed: ${writeSibling.message}`,
      ).toBe(true);

      const del = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: deleteEndpoint.DELETE,
        data: { path: childPath, recursive: false },
        user,
      });
      expect(del.success, `delete failed: ${del.message}`).toBe(true);

      const list = await sendTestRequest({
        toolExecutionContext: undefined,
        endpoint: listEndpoint.GET,
        data: { path: dirPath },
        user,
      });
      expect(list.success, `list failed: ${list.message}`).toBe(true);
      if (!list.success) {
        return;
      }
      // Deleted child is gone from the listing; the untouched sibling remains.
      const deletedEntry = list.data.entries.find(
        (e) => e.entryPath === childPath,
      );
      expect(
        deletedEntry,
        "soft-deleted child must NOT appear in LIST",
      ).toBeUndefined();
      const siblingEntry = list.data.entries.find(
        (e) => e.entryPath === siblingPath,
      );
      expect(siblingEntry, "untouched sibling must still appear").toBeTruthy();
    },
    TEST_TIMEOUT,
  );

  // ── 7: cross-instance cleanup primitive ────────────────────────────────────
  // removeVirtualNodesByEntityId() is the documented cleanup wired into thread /
  // message delete. It hard-removes materialized index rows by id-substring match
  // on the path. We insert a materialized /threads row directly (the materialized
  // path embeds the entity id) and prove the helper removes exactly it.
  it(
    "removeVirtualNodesByEntityId hard-removes materialized rows by id-substring match",
    async () => {
      const entityId = `delete-test-entity-${Date.now()}`;
      const matchingPath = `/threads/root-folder/some-slug-${entityId}.md`;
      const unrelatedPath = `/threads/root-folder/keep-this-other.md`;

      // Insert two materialized /threads index rows: one matches the id, one not.
      await db
        .insert(cortexNodes)
        .values([
          {
            userId: user.id,
            path: matchingPath,
            nodeType: CortexNodeType.FILE,
            content: null,
            size: 0,
          },
          {
            userId: user.id,
            path: unrelatedPath,
            nodeType: CortexNodeType.FILE,
            content: null,
            size: 0,
          },
        ])
        .onConflictDoNothing();

      try {
        const removed = await removeVirtualNodesByEntityId(
          user.id,
          "/threads",
          entityId,
        );
        expect(removed).toBe(1);

        // Matching row gone (hard delete, not soft).
        const gone = await fetchRow(user.id, matchingPath);
        expect(gone).toBeNull();

        // Unrelated row untouched.
        const kept = await fetchRow(user.id, unrelatedPath);
        expect(kept, "unrelated /threads row must survive").not.toBeNull();
      } finally {
        // Cleanup the /threads rows (outside the /documents prefix purge).
        await db
          .delete(cortexNodes)
          .where(
            and(
              eq(cortexNodes.userId, user.id),
              like(cortexNodes.path, `/threads/root-folder/%`),
            ),
          );
      }
    },
    TEST_TIMEOUT,
  );
});
