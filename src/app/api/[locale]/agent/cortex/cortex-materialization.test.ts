/**
 * Cortex Materialization Tests
 *
 * Verifies that CRUD operations on each domain properly create/update/delete
 * cortex_nodes entries for vector search. Tests the on-demand materialization
 * that replaced the old startup seed.
 *
 * Tests cover:
 *   1. ensureUserCortexReady: scaffold dirs + built-in skills
 *   2. Skills: create → cortex node, update → re-embed, delete → cleanup
 *   3. Tasks: create → cortex node, update → re-embed, delete → cleanup
 *   4. Threads: stream-end → thin reference (title + preview, no messages)
 *   5. Memories sync provider: correct provider key isolation
 *
 * All tests run in-process against the local dev DB. No external servers needed.
 */

import "server-only";

import { randomUUID } from "node:crypto";
import { and, eq, like } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { db } from "@/app/api/[locale]/system/db";
import { env } from "@/config/env";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";

import { cortexNodes } from "./db";
import { CortexNodeType } from "./enum";

// ── Constants ─────────────────────────────────────────────────────────────────

const TEST_TIMEOUT = 30_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  return { isPublic: false, id: user.id, leadId: link.leadId, roles };
}

// ── 1. ensureUserCortexReady ──────────────────────────────────────────────────

describe("Cortex on-demand init: ensureUserCortexReady", () => {
  let adminUser: JwtPrivatePayloadType;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, TEST_TIMEOUT);

  it(
    "M1: creates scaffold directories for a user",
    async () => {
      if (!adminUser) {
        return;
      }

      // Delete scaffold dirs to test recreation
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, "/memories"),
          ),
        );

      const { ensureUserCortexReady } = await import("./ensure-ready");

      // Reset the in-memory cache to force re-run
      // We call ensureUserCortexReady which is idempotent via DB onConflictDoNothing
      // but memoized in-process. For testing, import the module fresh.
      await ensureUserCortexReady(adminUser.id);

      // Verify scaffold dirs exist
      const [memoriesDir] = await db
        .select({ path: cortexNodes.path, nodeType: cortexNodes.nodeType })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, "/memories"),
          ),
        );

      expect(memoriesDir, "M1: /memories dir must exist").toBeTruthy();
      expect(memoriesDir?.nodeType, "M1: must be a DIR node").toBe(
        CortexNodeType.DIR,
      );
    },
    TEST_TIMEOUT,
  );

  it(
    "M2: materializes built-in skills with embeddings",
    async () => {
      if (!adminUser) {
        return;
      }

      // Check that at least some built-in skills exist after ensure-ready
      const builtInSkills = await db
        .select({
          path: cortexNodes.path,
          embedding: cortexNodes.embedding,
          contentHash: cortexNodes.contentHash,
        })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            like(cortexNodes.path, "/skills/default/%"),
          ),
        );

      expect(
        builtInSkills.length,
        "M2: must have built-in skills in cortex_nodes",
      ).toBeGreaterThan(0);

      // At least some should have embeddings (from cached skill.embedding.ts files)
      const withEmbeddings = builtInSkills.filter(
        (s) => s.embedding !== null && s.contentHash !== null,
      );
      expect(
        withEmbeddings.length,
        "M2: some built-in skills should have cached embeddings",
      ).toBeGreaterThan(0);
    },
    TEST_TIMEOUT,
  );

  it(
    "M3: idempotent - second call is a no-op (no duplicates)",
    async () => {
      if (!adminUser) {
        return;
      }

      const countBefore = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            like(cortexNodes.path, "/skills/default/%"),
          ),
        );

      // Call again - should be memoized and do nothing
      const { ensureUserCortexReady } = await import("./ensure-ready");
      await ensureUserCortexReady(adminUser.id);

      const countAfter = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            like(cortexNodes.path, "/skills/default/%"),
          ),
        );

      expect(
        countAfter.length,
        "M3: skill count must not increase on second call",
      ).toBe(countBefore.length);
    },
    TEST_TIMEOUT,
  );
});

// ── 2. Skills: CRUD → cortex materialization ─────────────────────────────────

describe("Cortex materialization: skills", () => {
  let adminUser: JwtPrivatePayloadType;
  const TEST_SKILL_ID = randomUUID();
  const TEST_SKILL_PATH = `/skills/${TEST_SKILL_ID}.md`;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, TEST_TIMEOUT);

  afterAll(async () => {
    // Cleanup test cortex nodes
    if (adminUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_SKILL_PATH),
          ),
        );
    }
  });

  it(
    "SK-M1: syncVirtualNodeToEmbedding creates a cortex node for a skill",
    async () => {
      if (!adminUser) {
        return;
      }

      const { syncVirtualNodeToEmbedding } = await import(
        "./embeddings/sync-virtual"
      );

      const content = [
        `# Test Skill`,
        `> A test skill for materialization tests`,
        "Skill description here.",
        "",
        "You are a helpful test skill.",
      ].join("\n");

      await syncVirtualNodeToEmbedding(
        adminUser.id,
        TEST_SKILL_PATH,
        content,
      );

      const [node] = await db
        .select({
          path: cortexNodes.path,
          content: cortexNodes.content,
          nodeType: cortexNodes.nodeType,
        })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_SKILL_PATH),
          ),
        );

      expect(node, "SK-M1: cortex node must exist after sync").toBeTruthy();
      expect(node?.nodeType, "SK-M1: must be a FILE node").toBe(
        CortexNodeType.FILE,
      );
      expect(node?.content, "SK-M1: content must match").toContain(
        "Test Skill",
      );
    },
    TEST_TIMEOUT,
  );

  it(
    "SK-M2: updating content changes the cortex node",
    async () => {
      if (!adminUser) {
        return;
      }

      const { syncVirtualNodeToEmbedding } = await import(
        "./embeddings/sync-virtual"
      );

      const updatedContent = [
        `# Updated Test Skill`,
        `> Updated tagline`,
        "Updated description.",
        "",
        "You are an updated test skill.",
      ].join("\n");

      await syncVirtualNodeToEmbedding(
        adminUser.id,
        TEST_SKILL_PATH,
        updatedContent,
      );

      const [node] = await db
        .select({ content: cortexNodes.content })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_SKILL_PATH),
          ),
        );

      expect(node?.content, "SK-M2: content must be updated").toContain(
        "Updated Test Skill",
      );
    },
    TEST_TIMEOUT,
  );

  it(
    "SK-M3: removeVirtualNode deletes the cortex node",
    async () => {
      if (!adminUser) {
        return;
      }

      const { removeVirtualNode } = await import("./embeddings/sync-virtual");

      await removeVirtualNode(adminUser.id, TEST_SKILL_PATH);

      const [node] = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_SKILL_PATH),
          ),
        );

      expect(
        node,
        "SK-M3: cortex node must be gone after removeVirtualNode",
      ).toBeUndefined();
    },
    TEST_TIMEOUT,
  );
});

// ── 3. Tasks: CRUD → cortex materialization ──────────────────────────────────

describe("Cortex materialization: tasks", () => {
  let adminUser: JwtPrivatePayloadType;
  const TEST_TASK_ID = randomUUID();
  const TEST_TASK_PATH = `/tasks/${TEST_TASK_ID}.md`;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (adminUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_TASK_PATH),
          ),
        );
    }
  });

  it(
    "TK-M1: syncVirtualNodeToEmbedding creates a cortex node for a task",
    async () => {
      if (!adminUser) {
        return;
      }

      const { syncVirtualNodeToEmbedding } = await import(
        "./embeddings/sync-virtual"
      );

      const content = [
        `# Test Task`,
        `Schedule: */5 * * * *`,
        "",
        "A test task for materialization tests.",
      ].join("\n");

      await syncVirtualNodeToEmbedding(
        adminUser.id,
        TEST_TASK_PATH,
        content,
      );

      const [node] = await db
        .select({ path: cortexNodes.path, content: cortexNodes.content })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_TASK_PATH),
          ),
        );

      expect(node, "TK-M1: cortex node must exist").toBeTruthy();
      expect(node?.content, "TK-M1: content must match").toContain(
        "Test Task",
      );
    },
    TEST_TIMEOUT,
  );

  it(
    "TK-M2: removeVirtualNode cleans up task cortex node",
    async () => {
      if (!adminUser) {
        return;
      }

      const { removeVirtualNode } = await import("./embeddings/sync-virtual");
      await removeVirtualNode(adminUser.id, TEST_TASK_PATH);

      const [node] = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_TASK_PATH),
          ),
        );

      expect(
        node,
        "TK-M2: task cortex node must be deleted",
      ).toBeUndefined();
    },
    TEST_TIMEOUT,
  );
});

// ── 4. Threads: thin reference materialization ───────────────────────────────

describe("Cortex materialization: threads (thin references)", () => {
  let adminUser: JwtPrivatePayloadType;
  const TEST_THREAD_ID = randomUUID();
  const SLUG = "test-thread";
  const ROOT_FOLDER = "private";
  const TEST_THREAD_PATH = `/threads/${ROOT_FOLDER}/${SLUG}-${TEST_THREAD_ID}.md`;

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (adminUser) {
      await db
        .delete(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_THREAD_PATH),
          ),
        );
    }
  });

  it(
    "TH-M1: buildThinThreadContent produces title + preview, no messages",
    async () => {
      const { buildThinThreadContent } = await import(
        "@/app/api/[locale]/agent/ai-stream/repository/core/message-db-writer"
      );

      const content = buildThinThreadContent({
        title: "Test Thread Title",
        rootFolderId: ROOT_FOLDER,
        tags: ["test", "cortex"],
        preview: "This is a preview of the first user message in the thread.",
      });

      expect(content, "TH-M1: must contain title").toContain(
        "# Test Thread Title",
      );
      expect(content, "TH-M1: must contain folder").toContain(
        `Folder: ${ROOT_FOLDER}`,
      );
      expect(content, "TH-M1: must contain tags").toContain(
        "Tags: test, cortex",
      );
      expect(content, "TH-M1: must contain preview").toContain(
        "Preview: This is a preview",
      );
      // Must NOT contain message role prefixes (the old format)
      expect(content, "TH-M1: must NOT contain message dumps").not.toMatch(
        /^(user|assistant|system):/m,
      );
    },
    TEST_TIMEOUT,
  );

  it(
    "TH-M2: thin reference materializes as cortex node via syncVirtualNodeToEmbedding",
    async () => {
      if (!adminUser) {
        return;
      }

      const { buildThinThreadContent } = await import(
        "@/app/api/[locale]/agent/ai-stream/repository/core/message-db-writer"
      );
      const { syncVirtualNodeToEmbedding } = await import(
        "./embeddings/sync-virtual"
      );

      const content = buildThinThreadContent({
        title: "Materialized Thread",
        rootFolderId: ROOT_FOLDER,
        tags: ["materialization-test"],
        preview: "Preview of the first user message.",
      });

      await syncVirtualNodeToEmbedding(
        adminUser.id,
        TEST_THREAD_PATH,
        content,
      );

      const [node] = await db
        .select({ content: cortexNodes.content, nodeType: cortexNodes.nodeType })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, adminUser.id),
            eq(cortexNodes.path, TEST_THREAD_PATH),
          ),
        );

      expect(node, "TH-M2: cortex node must exist").toBeTruthy();
      expect(node?.content, "TH-M2: must be thin reference").toContain(
        "Materialized Thread",
      );
      expect(
        node?.content,
        "TH-M2: must not contain message dumps",
      ).not.toMatch(/^(user|assistant):/m);
    },
    TEST_TIMEOUT,
  );

  it(
    "TH-M3: buildThinThreadContent handles null tags and preview gracefully",
    async () => {
      const { buildThinThreadContent } = await import(
        "@/app/api/[locale]/agent/ai-stream/repository/core/message-db-writer"
      );

      const content = buildThinThreadContent({
        title: null,
        rootFolderId: "shared",
        tags: null,
        preview: null,
      });

      expect(content, "TH-M3: must use 'Untitled' for null title").toContain(
        "# Untitled",
      );
      expect(content, "TH-M3: must contain folder").toContain(
        "Folder: shared",
      );
      // No Tags or Preview lines when null
      expect(content, "TH-M3: must not contain Tags line").not.toContain(
        "Tags:",
      );
      expect(content, "TH-M3: must not contain Preview line").not.toContain(
        "Preview:",
      );
    },
    TEST_TIMEOUT,
  );
});

// ── 5. Memories sync provider isolation ──────────────────────────────────────

describe("Cortex materialization: memories provider isolation", () => {
  let adminUser: JwtPrivatePayloadType;
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);

  beforeAll(async () => {
    const resolved = await resolveUser(env.VIBE_ADMIN_USER_EMAIL);
    if (resolved) {
      adminUser = resolved;
    }
  }, TEST_TIMEOUT);

  it(
    "MP-1: memories sync provider exists and has key 'memories'",
    async () => {
      const { memoriesSyncProvider } = await import(
        "@/app/api/[locale]/agent/memory/sync-provider"
      );
      expect(memoriesSyncProvider.key).toBe("memories");
    },
    TEST_TIMEOUT,
  );

  it(
    "MP-2: memories provider serializes only /memories/ paths",
    async () => {
      if (!adminUser) {
        return;
      }

      const { memoriesSyncProvider } = await import(
        "@/app/api/[locale]/agent/memory/sync-provider"
      );

      const json = await memoriesSyncProvider.serializeToJson(
        adminUser.id,
        logger,
      );
      const parsed = JSON.parse(json) as Array<{ path: string }>;

      for (const item of parsed) {
        expect(
          item.path.startsWith("/memories"),
          `MP-2: all memory paths must start with /memories, got: ${item.path}`,
        ).toBe(true);
      }
    },
    TEST_TIMEOUT,
  );
});
