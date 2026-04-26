/**
 * Cortex Test Suite — Endpoint Validation + CRUD Integration
 *
 * Part A: Auto-generated tests for all 10 cortex endpoints (schema, auth, examples).
 * Part B: Sequential CRUD integration tests using the admin user.
 *         All writes go to /documents/test-suite/ for isolation.
 *         afterAll cleans up via direct DB delete.
 */

// Testing infrastructure - test descriptions are for developers, not end users

import { and, eq, like } from "drizzle-orm";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  type TestContext,
} from "vitest";

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import { testEndpoint } from "@/app/api/[locale]/system/check/testing/testing-suite";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";

import { cortexNodes } from "./db";
import { CortexNodeType } from "./enum";

import readEndpoint from "./read/definition";
import listEndpoint from "./list/definition";
import treeEndpoint from "./tree/definition";
import searchEndpoint from "./search/definition";
import writeEndpoint from "./write/definition";
import editEndpoint from "./edit/definition";
import mkdirEndpoint from "./mkdir/definition";
import moveEndpoint from "./move/definition";
import deleteEndpoint from "./delete/definition";
import backfillEndpoint from "./embeddings/backfill/definition";

// ── Part A: Auto-generated endpoint tests ────────────────────────────────────

testEndpoint(readEndpoint.GET);
testEndpoint(listEndpoint.GET);
testEndpoint(treeEndpoint.GET);
testEndpoint(searchEndpoint.GET);
testEndpoint(writeEndpoint.POST);
testEndpoint(editEndpoint.PATCH);
testEndpoint(mkdirEndpoint.POST);
testEndpoint(moveEndpoint.POST);
testEndpoint(deleteEndpoint.DELETE);
testEndpoint(backfillEndpoint.POST);

// ── Part B: CRUD Integration Tests ───────────────────────────────────────────

const TEST_PREFIX = "/documents/test-suite";
const UPSERT_PREFIX = "/documents/test-suite-upsert";
const TEST_TIMEOUT = 60_000;

async function resolveUser(
  email: string,
): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!result.success || !result.data) {
    return null;
  }
  const user = result.data;

  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) {
    return null;
  }

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  return {
    isPublic: false,
    id: user.id,
    leadId: link.leadId,
    roles,
  };
}

describe("Cortex CRUD Integration", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      resolved,
      `${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe dev`,
    ).toBeTruthy();
    if (!resolved) {
      return;
    }
    adminUser = resolved;

    // Clean up any leftover test data from previous runs
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, adminUser.id),
          like(cortexNodes.path, `${TEST_PREFIX}%`),
        ),
      );
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, adminUser.id),
          like(cortexNodes.path, `${UPSERT_PREFIX}%`),
        ),
      );
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (!adminUser) {
      return;
    }
    // Final cleanup
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, adminUser.id),
          like(cortexNodes.path, `${TEST_PREFIX}%`),
        ),
      );
    await db
      .delete(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, adminUser.id),
          like(cortexNodes.path, `${UPSERT_PREFIX}%`),
        ),
      );
  });

  // Sequential suite: each test builds on the previous
  let suiteFailed = false;
  function fit(
    name: string,
    fn: () => Promise<void>,
    timeout?: number,
  ): void {
    it(
      name,
      async () => {
        if (suiteFailed) {
          return;
        }
        try {
          await fn();
        } catch (err) {
          suiteFailed = true;
          // oxlint-disable-next-line restricted-syntax
          throw err;
        }
      },
      timeout ?? TEST_TIMEOUT,
    );
  }

  const HELLO_CONTENT =
    "---\ndate: 2026-04-19\ntags: [test, cortex]\n---\n\n# Hello World\n\nThis is a cortex integration test document with unique-sentinel-xK9mP.\nMultiple lines for testing truncation and search.";
  const MOVE_CONTENT = "# To Move\n\nThis file will be moved to a new path.";

  // ── B1: Write a file ──────────────────────────────────────────────────────
  fit("B1: write creates a new file", async () => {
    const response = await sendTestRequest({
      endpoint: writeEndpoint.POST,
      data: {
        path: `${TEST_PREFIX}/hello.md`,
        content: HELLO_CONTENT,
        createParents: true,
      },
      user: adminUser,
    });

    expect(response.success, `Write failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.responsePath).toBe(`${TEST_PREFIX}/hello.md`);
    expect(response.data.created).toBe(true);
    expect(response.data.size).toBeGreaterThan(0);
    expect(response.data.updatedAt).toBeTruthy();
  });

  // ── B2: Read the written file ─────────────────────────────────────────────
  fit("B2: read returns written content", async () => {
    const response = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: `${TEST_PREFIX}/hello.md` },
      user: adminUser,
    });

    expect(response.success, `Read failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.content).toBe(HELLO_CONTENT);
    expect(response.data.responsePath).toBe(`${TEST_PREFIX}/hello.md`);
    expect(response.data.readonly).toBe(false);
    // read returns raw DB value "file", not enum key
    expect(response.data.nodeType).toBeTruthy();
    expect(response.data.size).toBeGreaterThan(0);
    expect(response.data.truncated).toBe(false);
  });

  // ── B3: List parent directory ──────────────────────────────────────────────
  fit("B3: list shows the written file", async () => {
    const response = await sendTestRequest({
      endpoint: listEndpoint.GET,
      data: { path: `${TEST_PREFIX}` },
      user: adminUser,
    });

    expect(response.success, `List failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.responsePath).toBe(TEST_PREFIX);
    expect(response.data.entries.length).toBeGreaterThanOrEqual(1);

    const helloEntry = response.data.entries.find(
      (e: Record<string, unknown>) => e.name === "hello.md",
    );
    expect(helloEntry, "hello.md not found in listing").toBeTruthy();
    expect(helloEntry!.nodeType).toBe(CortexNodeType.FILE);
    expect(helloEntry!.entryPath).toBe(`${TEST_PREFIX}/hello.md`);
  });

  // ── B4: Tree view ─────────────────────────────────────────────────────────
  fit("B4: tree includes the written file", async () => {
    const response = await sendTestRequest({
      endpoint: treeEndpoint.GET,
      data: { path: TEST_PREFIX, depth: 2 },
      user: adminUser,
    });

    expect(response.success, `Tree failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.tree).toContain("hello.md");
    expect(response.data.totalFiles).toBeGreaterThanOrEqual(1);
  });

  // ── B5: Edit the file ─────────────────────────────────────────────────────
  fit("B5: edit replaces text in file", async () => {
    const response = await sendTestRequest({
      endpoint: editEndpoint.PATCH,
      data: {
        path: `${TEST_PREFIX}/hello.md`,
        find: "Hello World",
        replace: "Hello Cortex",
      },
      user: adminUser,
    });

    expect(response.success, `Edit failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.responsePath).toBe(`${TEST_PREFIX}/hello.md`);
    expect(response.data.replacements).toBeGreaterThanOrEqual(1);
    expect(response.data.size).toBeGreaterThan(0);
  });

  // ── B6: Read after edit ───────────────────────────────────────────────────
  fit("B6: read confirms edit took effect", async () => {
    const response = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: `${TEST_PREFIX}/hello.md` },
      user: adminUser,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.content).toContain("Hello Cortex");
    expect(response.data.content).not.toContain("Hello World");
  });

  // ── B7: Write second file for move ────────────────────────────────────────
  fit("B7: write creates file for move test", async () => {
    const response = await sendTestRequest({
      endpoint: writeEndpoint.POST,
      data: {
        path: `${TEST_PREFIX}/to-move.md`,
        content: MOVE_CONTENT,
        createParents: true,
      },
      user: adminUser,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.created).toBe(true);
  });

  // ── B8: Move file ─────────────────────────────────────────────────────────
  fit("B8: move renames file to new path", async () => {
    const response = await sendTestRequest({
      endpoint: moveEndpoint.POST,
      data: {
        from: `${TEST_PREFIX}/to-move.md`,
        to: `${TEST_PREFIX}/moved.md`,
      },
      user: adminUser,
    });

    expect(response.success, `Move failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.responseFrom).toBe(`${TEST_PREFIX}/to-move.md`);
    expect(response.data.responseTo).toBe(`${TEST_PREFIX}/moved.md`);
    expect(response.data.nodesAffected).toBeGreaterThanOrEqual(1);
  });

  // ── B9: Read moved file ───────────────────────────────────────────────────
  fit("B9: read confirms file at new path", async () => {
    const response = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: `${TEST_PREFIX}/moved.md` },
      user: adminUser,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.content).toBe(MOVE_CONTENT);
  });

  // ── B10: Read old path (should be gone) ───────────────────────────────────
  fit("B10: read old path returns not found", async () => {
    const response = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: `${TEST_PREFIX}/to-move.md` },
      user: adminUser,
    });

    expect(response.success).toBe(false);
    expect(response.errorType?.errorCode).toBe(
      ErrorResponseTypes.NOT_FOUND.errorCode,
    );
  });

  // ── B11: Mkdir ─────────────────────────────────────────────────────────────
  fit("B11: mkdir creates directory", async () => {
    const response = await sendTestRequest({
      endpoint: mkdirEndpoint.POST,
      data: {
        path: `${TEST_PREFIX}/subdir`,
        createParents: true,
      },
      user: adminUser,
    });

    expect(response.success, `Mkdir failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.responsePath).toBe(`${TEST_PREFIX}/subdir`);
    expect(response.data.created).toBe(true);
  });

  // ── B12: Write into subdir ─────────────────────────────────────────────────
  fit("B12: write creates file in subdirectory", async () => {
    const response = await sendTestRequest({
      endpoint: writeEndpoint.POST,
      data: {
        path: `${TEST_PREFIX}/subdir/nested.md`,
        content: "# Nested\n\nFile inside subdirectory.",
        createParents: true,
      },
      user: adminUser,
    });

    expect(response.success).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.created).toBe(true);
  });

  // ── B13: Search ────────────────────────────────────────────────────────────
  fit("B13: search finds content by keyword", async () => {
    const response = await sendTestRequest({
      endpoint: searchEndpoint.GET,
      data: {
        query: "unique-sentinel-xK9mP",
        path: TEST_PREFIX,
        maxResults: 10,
      },
      user: adminUser,
    });

    expect(response.success, `Search failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.results.length).toBeGreaterThanOrEqual(1);
    expect(response.data.total).toBeGreaterThanOrEqual(1);

    const firstResult = response.data.results[0] as Record<string, unknown>;
    expect(firstResult.resultPath).toContain("test-suite");
    expect(firstResult.score).toBeGreaterThan(0);
  });

  // ── B14: Delete file ──────────────────────────────────────────────────────
  fit("B14: delete removes a single file", async () => {
    const response = await sendTestRequest({
      endpoint: deleteEndpoint.DELETE,
      data: {
        path: `${TEST_PREFIX}/hello.md`,
        recursive: false,
      },
      user: adminUser,
    });

    expect(response.success, `Delete failed: ${response.message}`).toBe(true);
    if (!response.success) {
      return;
    }
    expect(response.data.nodesDeleted).toBeGreaterThanOrEqual(1);
  });

  // ── B15: Delete directory recursive ───────────────────────────────────────
  fit("B15: delete removes directory recursively", async () => {
    const response = await sendTestRequest({
      endpoint: deleteEndpoint.DELETE,
      data: {
        path: TEST_PREFIX,
        recursive: true,
      },
      user: adminUser,
    });

    expect(response.success, `Delete recursive failed: ${response.message}`).toBe(
      true,
    );
    if (!response.success) {
      return;
    }
    expect(response.data.nodesDeleted).toBeGreaterThanOrEqual(1);
  });

  // ── B16: Confirm cleanup ──────────────────────────────────────────────────
  fit("B16: read deleted path returns not found", async () => {
    const response = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: `${TEST_PREFIX}/hello.md` },
      user: adminUser,
    });

    expect(response.success).toBe(false);
    expect(response.errorType?.errorCode).toBe(
      ErrorResponseTypes.NOT_FOUND.errorCode,
    );
  });

  // ── B17: Overwrite (upsert) ───────────────────────────────────────────────
  fit("B17: write same path twice — first creates, second overwrites", async () => {
    // First write
    const first = await sendTestRequest({
      endpoint: writeEndpoint.POST,
      data: {
        path: `${UPSERT_PREFIX}/file.md`,
        content: "Version 1",
        createParents: true,
      },
      user: adminUser,
    });
    expect(first.success).toBe(true);
    if (!first.success) {
      return;
    }
    expect(first.data.created).toBe(true);

    // Second write (overwrite)
    const second = await sendTestRequest({
      endpoint: writeEndpoint.POST,
      data: {
        path: `${UPSERT_PREFIX}/file.md`,
        content: "Version 2",
        createParents: true,
      },
      user: adminUser,
    });
    expect(second.success).toBe(true);
    if (!second.success) {
      return;
    }
    expect(second.data.created).toBe(false);

    // Read confirms latest content
    const read = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: `${UPSERT_PREFIX}/file.md` },
      user: adminUser,
    });
    expect(read.success).toBe(true);
    if (!read.success) {
      return;
    }
    expect(read.data.content).toBe("Version 2");

    // Cleanup
    await sendTestRequest({
      endpoint: deleteEndpoint.DELETE,
      data: { path: UPSERT_PREFIX, recursive: true },
      user: adminUser,
    });
  });

  // ── B18: Path validation ──────────────────────────────────────────────────
  fit("B18: write rejects invalid paths", async () => {
    // Path traversal
    const traversal = await sendTestRequest({
      endpoint: writeEndpoint.POST,
      data: {
        path: "../../../etc/passwd",
        content: "malicious",
      },
      user: adminUser,
    });
    expect(traversal.success).toBe(false);
    expect(
      traversal.errorType?.errorCode === ErrorResponseTypes.VALIDATION_ERROR.errorCode ||
        traversal.errorType?.errorCode === ErrorResponseTypes.FORBIDDEN.errorCode,
    ).toBe(true);

    // Empty path
    const empty = await sendTestRequest({
      endpoint: writeEndpoint.POST,
      data: {
        path: "",
        content: "test",
      },
      user: adminUser,
    });
    expect(empty.success).toBe(false);
  });

  // ── B19: Readonly mount rejection ─────────────────────────────────────────
  fit("B19: write to virtual mount is forbidden", async () => {
    const response = await sendTestRequest({
      endpoint: writeEndpoint.POST,
      data: {
        path: "/threads/fake-thread.md",
        content: "should not work",
      },
      user: adminUser,
    });

    expect(response.success).toBe(false);
    // Virtual writable mounts go through resolveVirtualWrite
    // but /threads is handled differently than /documents
  });
});
