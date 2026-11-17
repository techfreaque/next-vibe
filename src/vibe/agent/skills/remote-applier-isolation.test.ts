/**
 * Remote applier isolation — integration tests against the real DB.
 *
 * A connected peer instance holds a customer's token and controls every id and
 * field it relays (remote events, sync payloads). These tests act AS customer A
 * with customer B's identifiers and assert B's data is untouched, and that
 * privileged fields (SYSTEM ownership, VERIFIED trust) never come off the wire.
 *
 *   RA1 — skill-created with B's slug does not overwrite B's skill
 *   RA2 — skill-deleted with B's slug does not delete B's skill
 *   RA3 — skill-updated with B's slug does not change B's skill
 *   RA4 — A's own skill still applies (create upsert, update, delete)
 *   RA5 — skills sync clamps SYSTEM → USER and VERIFIED → COMMUNITY
 *   RA6 — favorites sync drops a favorite pointing at B's private skill
 *   RA7 — cortex sync drops paths outside the prefix and recomputes size
 *   RA8 — isSkillVisibleToUser: own / public / built-in vs other's private
 */

import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { applySyncPayloads } from "next-vibe/remote-connection/sync/provider";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { cortexNodes } from "../cortex/db";
import { CortexNodeType } from "../cortex/enum";
import type { SkillCreateRequestOutput } from "./create/definition";
import { customSkills } from "./db";
import {
  SkillCategory,
  SkillOwnershipType,
  SkillStatus,
  SkillTrustLevel,
} from "./enum";
import { chatFavorites } from "./favorites/db";
import { VariantsMode } from "./favorites/enum";
import { type SyncedFavorite } from "./favorites/sync-provider";
import { SkillsRepository } from "./repository";
import { isSkillVisibleToUser } from "./resolver";

const logger = createEndpointLogger(false, defaultLocale);
const stamp = Date.now();
const B_SLUG = `ra-b-private-${stamp}`;
const B_PUBLIC_SLUG = `ra-b-public-${stamp}`;
const A_SLUG = `ra-a-own-${stamp}`;
const B_PROMPT = "B's original prompt";

let userA: TestUser;
let userB: TestUser;

function createRequest(name: string, prompt: string): SkillCreateRequestOutput {
  return {
    name,
    description: "remote applier isolation test",
    tagline: "isolation",
    icon: "bot",
    systemPrompt: prompt,
    category: SkillCategory.ASSISTANT,
    isPublic: false,
    variants: [],
  };
}

async function skillBySlug(
  slug: string,
): Promise<typeof customSkills.$inferSelect | undefined> {
  const [row] = await db
    .select()
    .from(customSkills)
    .where(eq(customSkills.slug, slug))
    .limit(1);
  return row;
}

const remoteBase = {
  instanceId: "atlas",
  originInstanceId: "peer-test",
  locale: defaultLocale,
  logger,
  isServer: true,
} as const;

describe("remote applier isolation", () => {
  beforeAll(async () => {
    const a = await createTestUser(`ra-a-${stamp}@example.com`, "RA A");
    const b = await createTestUser(`ra-b-${stamp}@example.com`, "RA B");
    expect(a.success && b.success).toBe(true);
    if (!a.success || !b.success) {
      return;
    }
    userA = a.data;
    userB = b.data;

    const base = {
      userId: userB.user.id,
      name: "B private",
      description: "B",
      tagline: "B",
      icon: "bot",
      systemPrompt: B_PROMPT,
      category: SkillCategory.ASSISTANT,
      variants: [],
      ownershipType: SkillOwnershipType.USER,
    } satisfies Omit<typeof customSkills.$inferInsert, "slug">;
    await db.insert(customSkills).values([
      { ...base, slug: B_SLUG },
      {
        ...base,
        slug: B_PUBLIC_SLUG,
        name: "B public",
        ownershipType: SkillOwnershipType.PUBLIC,
        status: SkillStatus.PUBLISHED,
      },
    ]);
  }, 60_000);

  afterAll(async () => {
    for (const u of [userA, userB]) {
      if (!u) {
        continue;
      }
      await db.delete(chatFavorites).where(eq(chatFavorites.userId, u.user.id));
      await db.delete(cortexNodes).where(eq(cortexNodes.userId, u.user.id));
      await db.delete(customSkills).where(eq(customSkills.userId, u.user.id));
      await deleteTestUser(u.user.id);
    }
  }, 60_000);

  it("RA1: skill-created with B's slug does not overwrite B's skill", async () => {
    for (const slug of [B_SLUG, B_PUBLIC_SLUG]) {
      await SkillsRepository.applyRemoteSkillCreate({
        ...remoteBase,
        user: userA.user,
        requestData: createRequest("hijacked", "attacker prompt"),
        responseData: { id: slug },
        urlPathParams: undefined,
        payload: undefined,
      });
      const row = await skillBySlug(slug);
      expect(row?.userId).toBe(userB.user.id);
      expect(row?.systemPrompt).toBe(B_PROMPT);
    }
  });

  it("RA2: skill-deleted with B's slug does not delete B's skill", async () => {
    await SkillsRepository.applyRemoteSkillDeleteById({
      ...remoteBase,
      user: userA.user,
      urlPathParams: { id: B_SLUG },
      requestData: {},
      responseData: {},
      payload: undefined,
    });
    expect((await skillBySlug(B_SLUG))?.userId).toBe(userB.user.id);
  });

  it("RA3: skill-updated with B's slug does not change B's skill", async () => {
    await SkillsRepository.applyRemoteSkillPartialUpdate({
      ...remoteBase,
      user: userA.user,
      urlPathParams: { id: B_SLUG },
      requestData: {
        name: "hijacked",
        tagline: "hijacked",
        icon: "bot",
        description: "hijacked",
        category: SkillCategory.ASSISTANT,
      },
      responseData: {},
      payload: undefined,
    });
    expect((await skillBySlug(B_SLUG))?.name).toBe("B private");
  });

  it("RA4: A's own skill still applies (create, upsert, update, delete)", async () => {
    const create = (prompt: string): Promise<void> =>
      SkillsRepository.applyRemoteSkillCreate({
        ...remoteBase,
        user: userA.user,
        requestData: createRequest("A own", prompt),
        responseData: { id: A_SLUG },
        urlPathParams: undefined,
        payload: undefined,
      });
    await create("first");
    expect((await skillBySlug(A_SLUG))?.systemPrompt).toBe("first");
    // Same-slug relay refreshes A's own row.
    await create("second");
    expect((await skillBySlug(A_SLUG))?.systemPrompt).toBe("second");

    await SkillsRepository.applyRemoteSkillPartialUpdate({
      ...remoteBase,
      user: userA.user,
      urlPathParams: { id: A_SLUG },
      requestData: {
        name: "A renamed",
        tagline: "t",
        icon: "bot",
        description: "d",
        category: SkillCategory.ASSISTANT,
      },
      responseData: {},
      payload: undefined,
    });
    expect((await skillBySlug(A_SLUG))?.name).toBe("A renamed");

    await SkillsRepository.applyRemoteSkillDeleteById({
      ...remoteBase,
      user: userA.user,
      urlPathParams: { id: A_SLUG },
      requestData: {},
      responseData: {},
      payload: undefined,
    });
    expect(await skillBySlug(A_SLUG)).toBeUndefined();
  });

  it("RA5: skills sync clamps SYSTEM ownership and VERIFIED trust", async () => {
    const id = randomUUID();
    const slug = `ra-a-synced-${stamp}`;
    const wire = (updatedAt: string): string =>
      JSON.stringify([
        {
          id,
          slug,
          name: "synced",
          description: "d",
          tagline: "t",
          icon: "bot",
          systemPrompt: "p",
          category: SkillCategory.ASSISTANT,
          ownershipType: SkillOwnershipType.SYSTEM,
          trustLevel: SkillTrustLevel.VERIFIED,
          updatedAt,
        },
      ]);

    await applySyncPayloads(
      { skills: wire(new Date().toISOString()) },
      userA.user.id,
      logger,
    );
    let row = await skillBySlug(slug);
    expect(row?.userId).toBe(userA.user.id);
    expect(row?.ownershipType).toBe(SkillOwnershipType.USER);
    expect(row?.trustLevel).toBe(SkillTrustLevel.COMMUNITY);

    // Update path: still clamped.
    await applySyncPayloads(
      { skills: wire(new Date(Date.now() + 60_000).toISOString()) },
      userA.user.id,
      logger,
    );
    row = await skillBySlug(slug);
    expect(row?.ownershipType).toBe(SkillOwnershipType.USER);
    expect(row?.trustLevel).toBe(SkillTrustLevel.COMMUNITY);

    // A synced skill row with B's id is never touched.
    const [bRow] = await db
      .select({ id: customSkills.id })
      .from(customSkills)
      .where(eq(customSkills.slug, B_SLUG));
    await applySyncPayloads(
      {
        skills: JSON.stringify([
          {
            id: bRow?.id,
            slug: B_SLUG,
            name: "hijacked",
            description: "d",
            tagline: "t",
            icon: "bot",
            systemPrompt: "attacker",
            category: SkillCategory.ASSISTANT,
            ownershipType: SkillOwnershipType.USER,
            updatedAt: new Date(Date.now() + 120_000).toISOString(),
          },
        ]),
      },
      userA.user.id,
      logger,
    );
    const b = await skillBySlug(B_SLUG);
    expect(b?.userId).toBe(userB.user.id);
    expect(b?.systemPrompt).toBe(B_PROMPT);
  });

  it("RA6: favorites sync drops a favorite of B's private skill", async () => {
    const fav = (skillId: string, slug: string): SyncedFavorite => ({
      id: randomUUID(),
      slug,
      skillId,
      variantId: null,
      variantsMode: VariantsMode.SOME,
      customVariantName: null,
      customIcon: null,
      position: 0,
      color: null,
      compactTrigger: null,
      memoryLimit: null,
      promptAppend: null,
      subAgentFavoriteId: null,
      updatedAt: new Date().toISOString(),
    });
    await applySyncPayloads(
      {
        favorites: JSON.stringify([
          fav(B_SLUG, `ra-fav-private-${stamp}`),
          fav(B_PUBLIC_SLUG, `ra-fav-public-${stamp}`),
        ]),
      },
      userA.user.id,
      logger,
    );
    const rows = await db
      .select({ skillId: chatFavorites.skillId })
      .from(chatFavorites)
      .where(eq(chatFavorites.userId, userA.user.id));
    const skillIds = rows.map((r) => r.skillId);
    expect(skillIds).not.toContain(B_SLUG);
    expect(skillIds).toContain(B_PUBLIC_SLUG);
  });

  it("RA7: cortex sync drops out-of-prefix paths and recomputes size", async () => {
    const node = (path: string, content: string): Record<string, unknown> => ({
      syncId: randomUUID(),
      path,
      content,
      size: 999_999,
      frontmatter: {},
      tags: [],
      nodeType: CortexNodeType.FILE,
      updatedAt: new Date().toISOString(),
    });
    const okPath = `/memories/ra-${stamp}.md`;
    const content = "héllo";
    await applySyncPayloads(
      {
        memories: JSON.stringify([
          node(okPath, content),
          node(`/documents/ra-${stamp}.md`, "escape"),
          node(`/memories/../documents/ra2-${stamp}.md`, "escape"),
        ]),
      },
      userA.user.id,
      logger,
    );
    // Skill embeddings land under /skills/; only look at the synced subtrees.
    const rows = (
      await db
        .select({ path: cortexNodes.path, size: cortexNodes.size })
        .from(cortexNodes)
        .where(eq(cortexNodes.userId, userA.user.id))
    ).filter(
      (r) =>
        r.path.startsWith("/memories/") || r.path.startsWith("/documents/"),
    );
    expect(rows.map((r) => r.path)).toEqual([okPath]);
    expect(rows[0]?.size).toBe(Buffer.byteLength(content, "utf8"));
  });

  it("RA8: isSkillVisibleToUser", async () => {
    expect(await isSkillVisibleToUser(B_SLUG, userA.user.id)).toBe(false);
    expect(await isSkillVisibleToUser(B_SLUG, userB.user.id)).toBe(true);
    expect(await isSkillVisibleToUser(B_PUBLIC_SLUG, userA.user.id)).toBe(true);
    expect(await isSkillVisibleToUser("thea", userA.user.id)).toBe(true);
    const [bRow] = await db
      .select({ id: customSkills.id })
      .from(customSkills)
      .where(
        and(
          eq(customSkills.slug, B_SLUG),
          eq(customSkills.userId, userB.user.id),
        ),
      );
    expect(await isSkillVisibleToUser(bRow?.id ?? "", userA.user.id)).toBe(
      false,
    );
  });
});
