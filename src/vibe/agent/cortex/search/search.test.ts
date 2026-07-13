/**
 * Cortex Search Endpoint — End-to-End Tests
 *
 * Drives the real SEARCH endpoint via sendTestRequest. Searchable state is built
 * exclusively through the real WRITE endpoint. DB access on cortexNodes is limited
 * to (a) isolation cleanup and (b) the deliberate storage-contract "DB-poke"
 * assertions that verify the embeddings-only index design:
 *
 *   - NATIVE paths (/documents, /memories) keep their content in cortex_nodes.content.
 *   - VIRTUAL-mount index rows (/threads, /skills, /tasks, /uploads, /searches, /gens)
 *     store content = NULL — content resolves LIVE from source at search time.
 *   - /ssh and /favorites are NEVER materialized/embedded into cortex_nodes.
 */

import "server-only";

import { and, eq, isNull, like, or } from "drizzle-orm";
import { DEFAULT_CHAT_MODEL_SELECTION } from "next-vibe/agent/ai-stream/constants";
import { DefaultFolderId } from "next-vibe/agent/chat/config";
import { chatThreads } from "next-vibe/agent/chat/db";
import { ThreadStatus } from "next-vibe/agent/chat/enum";
import { customSkills } from "next-vibe/agent/skills/db";
import {
  SkillCategory,
  SkillOwnershipType,
} from "next-vibe/agent/skills/enum";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { cortexNodes } from "../db";
import { embedNodeNow } from "../embeddings/auto-embed";
import { upsertVirtualNode } from "../embeddings/sync-virtual";
import { CortexNodeType } from "../enum";
import searchEndpoint from "../search/definition";
import writeEndpoint from "../write/definition";

const TEST_PREFIX = "/documents/search-test";
const CLEANUP_PATTERN = `${TEST_PREFIX}%`;

/** Unique sentinel that cannot collide with anything else in the DB. */
const SENTINEL = "zxq-unique-sentinel-9981";

/** Unique slug for the materialized virtual skill row (content NULL contract). */
const SKILL_SLUG = "cortex-search-test-skill-zxq";
/**
 * Unique thread title token. It slugifies into the materialized /threads path,
 * so a keyword search for the token hits the index row by path even though its
 * stored content is NULL — the excerpt is then resolved live from the thread.
 */
const THREAD_TOKEN = "zxqthreadtoken";
const THREAD_TITLE = `Cortex Search ${THREAD_TOKEN} Thread`;

/**
 * Search may run a vector branch (query-embedding generation hits the embedding
 * model) when the test DB already holds embeddings, so per-test timeouts must be
 * generous. Keyword/FTS assertions stay reliable regardless of which branch runs.
 */
const SEARCH_TIMEOUT = 60000;

let user: JwtPrivatePayloadType;
let threadId: string | null = null;
let threadPath: string | null = null;
let skillPath: string | null = null;

/** Slugify a title exactly like the threads mount does for path building. */
function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "untitled"
  );
}

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

/**
 * Materialize a virtual /skills index row (content NULL by contract). Insert the
 * source skill, then upsert its cortex_nodes index row via the real sync helper.
 */
async function materializeVirtualSkill(userId: string): Promise<void> {
  await db
    .delete(customSkills)
    .where(
      and(eq(customSkills.userId, userId), eq(customSkills.slug, SKILL_SLUG)),
    );
  await db.insert(customSkills).values({
    slug: SKILL_SLUG,
    userId,
    name: "Cortex Search Test Skill",
    description: "Fixture skill materialized as a content-NULL virtual row.",
    tagline: "Search-test fixture",
    icon: "brain",
    systemPrompt:
      "# Search Test Skill\n\nVirtual-mount storage contract probe.",
    category: SkillCategory.ASSISTANT,
    ownershipType: SkillOwnershipType.USER,
    variants: [
      {
        id: "default",
        modelSelection: DEFAULT_CHAT_MODEL_SELECTION,
        isDefault: true,
      },
    ],
  });

  skillPath = `/skills/${SKILL_SLUG}.md`;
  // upsertVirtualNode persists content=NULL for virtual mounts by contract.
  await upsertVirtualNode(
    userId,
    skillPath,
    "# Search Test Skill\n\nVirtual-mount storage contract probe.",
  );
}

/**
 * Insert a thread and materialize its /threads index row (content NULL), then
 * embed it so the /threads search returns a result with a live-resolved excerpt.
 */
async function materializeVirtualThread(userId: string): Promise<void> {
  const [row] = await db
    .insert(chatThreads)
    .values({
      userId,
      title: THREAD_TITLE,
      rootFolderId: DefaultFolderId.PRIVATE,
      status: ThreadStatus.ACTIVE,
    })
    .returning({ id: chatThreads.id });
  threadId = row?.id ?? null;
  if (!threadId) {
    return;
  }

  const slug = slugify(THREAD_TITLE);
  threadPath = `/threads/${DefaultFolderId.PRIVATE}/${slug}-${threadId}.md`;
  // Index row keeps content NULL (virtual contract); embedding text is the path
  // (carries the token) + a placeholder body so the row becomes searchable.
  await upsertVirtualNode(userId, threadPath, THREAD_TITLE);
  const [created] = await db
    .select({ id: cortexNodes.id })
    .from(cortexNodes)
    .where(
      and(eq(cortexNodes.userId, userId), eq(cortexNodes.path, threadPath)),
    )
    .limit(1);
  if (created) {
    await embedNodeNow(created.id, threadPath, THREAD_TITLE);
  }
}

/** Remove materialized skill + thread + their index rows. */
async function deleteVirtualFixtures(userId: string): Promise<void> {
  await db
    .delete(customSkills)
    .where(
      and(eq(customSkills.userId, userId), eq(customSkills.slug, SKILL_SLUG)),
    );
  if (threadId) {
    await db.delete(chatThreads).where(eq(chatThreads.id, threadId));
  }
  await db
    .delete(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        or(
          like(cortexNodes.path, `/skills/${SKILL_SLUG}%`),
          like(cortexNodes.path, "/threads/%"),
        ),
      ),
    );
}

/** Write a file via the real WRITE endpoint; fail the test if it does not stick. */
async function writeFile(path: string, content: string): Promise<void> {
  const res = await sendTestRequest({
    streamContext: undefined,
    endpoint: writeEndpoint.POST,
    data: { path, content, createParents: true },
    user,
  });
  expect(
    res.success,
    `setup write failed for ${path}: ${res.success ? "" : res.message}`,
  ).toBe(true);
}

describe("Cortex Search E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    await cleanup(user.id);
    await materializeVirtualSkill(user.id);
    await materializeVirtualThread(user.id);
  });

  afterAll(async () => {
    if (user) {
      await cleanup(user.id);
      await deleteVirtualFixtures(user.id);
    }
  });

  it(
    "keyword search finds a freshly written file by a unique sentinel token",
    async () => {
      const path = `${TEST_PREFIX}/keyword/note.md`;
      const content = `# Notes\n\nThe quick brown fox ${SENTINEL} jumps over the lazy dog.`;
      await writeFile(path, content);

      const res = await sendTestRequest({
        streamContext: undefined,
        endpoint: searchEndpoint.GET,
        data: { query: SENTINEL, path: `${TEST_PREFIX}`, maxResults: 20 },
        user,
      });
      expect(
        res.success,
        `search failed: ${res.success ? "" : res.message}`,
      ).toBe(true);
      if (!res.success) {
        return;
      }

      expect(res.data.responseQuery).toBe(SENTINEL);
      expect(res.data.total).toBeGreaterThanOrEqual(1);
      const hit = res.data.results.find((r) => r.resultPath === path);
      expect(hit, `expected a hit for ${path}`).toBeDefined();
      // Excerpt should carry context around the matched token.
      expect(hit ? hit.excerpt.length : 0).toBeGreaterThan(0);
    },
    SEARCH_TIMEOUT,
  );

  it(
    "scopes results by path: only the scoped subdir's file returns",
    async () => {
      const token = "alpha-beta-scope-token";
      const pathA = `${TEST_PREFIX}/scope-a/file.md`;
      const pathB = `${TEST_PREFIX}/scope-b/file.md`;
      await writeFile(pathA, `Subdir A holds the ${token} here.`);
      await writeFile(pathB, `Subdir B also holds the ${token} here.`);

      const res = await sendTestRequest({
        streamContext: undefined,
        endpoint: searchEndpoint.GET,
        data: { query: token, path: `${TEST_PREFIX}/scope-a`, maxResults: 20 },
        user,
      });
      expect(
        res.success,
        `scoped search failed: ${res.success ? "" : res.message}`,
      ).toBe(true);
      if (!res.success) {
        return;
      }

      const paths = res.data.results.map((r) => r.resultPath);
      expect(paths).toContain(pathA);
      expect(paths).not.toContain(pathB);
    },
    SEARCH_TIMEOUT,
  );

  it(
    "returns an empty result set (not an error) when nothing matches",
    async () => {
      // Scope to a subdir that has no files at all. Both the FTS and vector
      // branches are path-scoped, so an empty subtree yields zero hits. (A
      // nonsense keyword alone is NOT enough: when embeddings exist, the vector
      // branch returns nearest-neighbor rows regardless of keyword relevance.)
      const res = await sendTestRequest({
        streamContext: undefined,
        endpoint: searchEndpoint.GET,
        data: {
          query: "anything-goes-here",
          path: `${TEST_PREFIX}/empty-never-written-subdir`,
          maxResults: 20,
        },
        user,
      });
      expect(
        res.success,
        `empty search must still succeed: ${res.success ? "" : res.message}`,
      ).toBe(true);
      if (!res.success) {
        return;
      }
      expect(res.data.results).toHaveLength(0);
      expect(res.data.total).toBe(0);
    },
    SEARCH_TIMEOUT,
  );

  it(
    "rejects an unsafe path with VALIDATION_ERROR",
    async () => {
      // A SQL LIKE wildcard in a path segment makes isValidPath() reject after
      // normalization, before any search runs.
      const res = await sendTestRequest({
        streamContext: undefined,
        endpoint: searchEndpoint.GET,
        data: { query: SENTINEL, path: "/documents/wild%card", maxResults: 20 },
        user,
      });
      expect(res.success, "unsafe path search must fail").toBe(false);
      if (res.success) {
        return;
      }
      expect(res.errorType?.errorCode).toBe(
        ErrorResponseTypes.VALIDATION_ERROR.errorCode,
      );
    },
    SEARCH_TIMEOUT,
  );

  it(
    "reports a valid searchMode and orders results by score descending",
    async () => {
      const token = "ranking-sentinel-token";
      await writeFile(`${TEST_PREFIX}/rank/a.md`, `${token} mentioned once.`);
      await writeFile(
        `${TEST_PREFIX}/rank/b.md`,
        `${token} ${token} ${token} mentioned many times for higher rank.`,
      );

      const res = await sendTestRequest({
        streamContext: undefined,
        endpoint: searchEndpoint.GET,
        data: { query: token, path: `${TEST_PREFIX}/rank`, maxResults: 20 },
        user,
      });
      expect(
        res.success,
        `ranking search failed: ${res.success ? "" : res.message}`,
      ).toBe(true);
      if (!res.success) {
        return;
      }

      expect(["hybrid", "keyword"]).toContain(res.data.searchMode);
      for (let i = 0; i + 1 < res.data.results.length; i++) {
        expect(res.data.results[i].score).toBeGreaterThanOrEqual(
          res.data.results[i + 1].score,
        );
      }
    },
    SEARCH_TIMEOUT,
  );

  it(
    "caps the result count at maxResults",
    async () => {
      const token = "capme-sentinel-token";
      for (let i = 0; i < 5; i++) {
        await writeFile(
          `${TEST_PREFIX}/cap/file-${i}.md`,
          `${token} entry ${i}.`,
        );
      }

      const res = await sendTestRequest({
        streamContext: undefined,
        endpoint: searchEndpoint.GET,
        data: { query: token, path: `${TEST_PREFIX}/cap`, maxResults: 2 },
        user,
      });
      expect(
        res.success,
        `capped search failed: ${res.success ? "" : res.message}`,
      ).toBe(true);
      if (!res.success) {
        return;
      }
      expect(res.data.results.length).toBeLessThanOrEqual(2);
    },
    SEARCH_TIMEOUT,
  );

  it(
    "resolves a non-empty excerpt for a native /documents hit from the column",
    async () => {
      const token = "excerpt-native-sentinel";
      const path = `${TEST_PREFIX}/excerpt/native.md`;
      const content = `Context before the ${token} marker and context after the marker.`;
      await writeFile(path, content);

      const res = await sendTestRequest({
        streamContext: undefined,
        endpoint: searchEndpoint.GET,
        data: { query: token, path: `${TEST_PREFIX}/excerpt`, maxResults: 20 },
        user,
      });
      expect(
        res.success,
        `native excerpt search failed: ${res.success ? "" : res.message}`,
      ).toBe(true);
      if (!res.success) {
        return;
      }

      const hit = res.data.results.find((r) => r.resultPath === path);
      expect(hit, `expected native hit for ${path}`).toBeDefined();
      // Native content lives in the column, so the excerpt is non-empty real text.
      expect(hit ? hit.excerpt.trim().length : 0).toBeGreaterThan(0);
    },
    SEARCH_TIMEOUT,
  );

  // === STORAGE CONTRACT DB-POKES ===

  it(
    "DB-poke: native /documents content IS stored in cortex_nodes.content",
    async () => {
      const path = `${TEST_PREFIX}/storage/native.md`;
      const content = `Native storage contract body ${SENTINEL}.`;
      await writeFile(path, content);

      const rows = await db
        .select({ content: cortexNodes.content })
        .from(cortexNodes)
        .where(and(eq(cortexNodes.userId, user.id), eq(cortexNodes.path, path)))
        .limit(1);

      expect(rows).toHaveLength(1);
      // Contract: native paths persist content in the column (not NULL).
      expect(rows[0].content).not.toBeNull();
      expect(rows[0].content).toBe(content);
    },
    SEARCH_TIMEOUT,
  );

  it(
    "DB-poke: materialized virtual-mount file rows store content = NULL (embeddings-only)",
    async () => {
      // Virtual-mount index rows are an embeddings-only index: their content column
      // is NULL and resolves live from source. Assert on any that exist; otherwise
      // document that none were materialized in this environment.
      const virtualFileRows = await db
        .select({ path: cortexNodes.path, content: cortexNodes.content })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, user.id),
            eq(cortexNodes.nodeType, CortexNodeType.FILE),
            or(
              like(cortexNodes.path, "/threads/%"),
              like(cortexNodes.path, "/skills/%"),
              like(cortexNodes.path, "/tasks/%"),
              like(cortexNodes.path, "/uploads/%"),
              like(cortexNodes.path, "/searches/%"),
              like(cortexNodes.path, "/gens/%"),
            ),
          ),
        );

      // beforeAll materialized a /skills index row, so there MUST be virtual
      // rows here — a missing precondition fails loudly instead of skipping.
      expect(
        virtualFileRows.length,
        "expected ≥1 materialized virtual-mount file row (skill fixture)",
      ).toBeGreaterThanOrEqual(1);
      // Every materialized virtual-mount file row must keep content NULL.
      for (const row of virtualFileRows) {
        expect(
          row.content,
          `virtual row ${row.path} must store NULL content`,
        ).toBeNull();
      }

      // Cross-check via a NULL-filtered count: it must equal the total set.
      const nullRows = await db
        .select({ path: cortexNodes.path })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, user.id),
            eq(cortexNodes.nodeType, CortexNodeType.FILE),
            isNull(cortexNodes.content),
            or(
              like(cortexNodes.path, "/threads/%"),
              like(cortexNodes.path, "/skills/%"),
              like(cortexNodes.path, "/tasks/%"),
              like(cortexNodes.path, "/uploads/%"),
              like(cortexNodes.path, "/searches/%"),
              like(cortexNodes.path, "/gens/%"),
            ),
          ),
        );
      expect(nullRows.length).toBe(virtualFileRows.length);
    },
    SEARCH_TIMEOUT,
  );

  it(
    "DB-poke: /ssh is never materialized or embedded into cortex_nodes",
    async () => {
      // SSH browses live filesystems; it is excluded from EMBEDDABLE_MOUNTS by
      // construction, so it must never produce a cortex_nodes index row.
      const sshRows = await db
        .select({ id: cortexNodes.id })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, user.id),
            like(cortexNodes.path, "/ssh/%"),
          ),
        );
      expect(sshRows).toHaveLength(0);

      // /favorites is likewise never materialized (thin pointers, resolved live).
      const favRows = await db
        .select({ id: cortexNodes.id })
        .from(cortexNodes)
        .where(
          and(
            eq(cortexNodes.userId, user.id),
            like(cortexNodes.path, "/favorites/%"),
          ),
        );
      expect(favRows).toHaveLength(0);
    },
    SEARCH_TIMEOUT,
  );

  it(
    "virtual-mount search (/threads) returns non-empty excerpts resolved live",
    async () => {
      // beforeAll materialized + embedded a /threads index row whose path and
      // embedding text carry the unique token, so a token search must return it.
      const res = await sendTestRequest({
        streamContext: undefined,
        endpoint: searchEndpoint.GET,
        data: { query: THREAD_TOKEN, path: "/threads", maxResults: 10 },
        user,
      });
      expect(
        res.success,
        `/threads search failed: ${res.success ? "" : res.message}`,
      ).toBe(true);
      if (!res.success) {
        return;
      }

      // The fixture thread MUST surface — a missing result fails loudly rather
      // than skipping, surfacing a broken virtual-mount index or embed path.
      expect(
        res.data.results.length,
        "expected ≥1 /threads hit for the materialized fixture thread",
      ).toBeGreaterThanOrEqual(1);
      expect(
        threadPath,
        "fixture thread path must have been materialized in beforeAll",
      ).not.toBeNull();
      const fixtureHit = res.data.results.find(
        (r) => r.resultPath === threadPath,
      );
      expect(
        fixtureHit,
        `expected the fixture thread (${threadPath}) among /threads results`,
      ).toBeDefined();

      // Even though stored content is NULL for virtual rows, excerpts are resolved
      // live from source via resolveExcerpts, so they must be non-empty.
      for (const r of res.data.results) {
        expect(
          r.excerpt.trim().length,
          `virtual hit ${r.resultPath} should have a live-resolved excerpt`,
        ).toBeGreaterThan(0);
      }
    },
    SEARCH_TIMEOUT,
  );
});
