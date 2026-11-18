import { confirmedTestSignup } from "next-vibe/tooling/testing/testing-suite/confirmed-signup";
/**
 * Default Companion Tests
 *
 * Bug: a user could add a skill (e.g. 4chan from its public skill page) and end
 * up with favorites but NO companion. Adding a non-companion skill to a set
 * without any companion now also adds every variant of Thea, for accounts
 * (server create path + signup migration) and guests (localStorage).
 */

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { storage } from "next-vibe/ui/lib/storage";
import {
  createTestUser,
  deleteTestUser,
  TEST_USER_PASSWORD,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { formatSkillId, parseSkillId } from "../../chat/slugify";
import { STORAGE_KEYS } from "../../chat/constants";
import { COMPANION_SKILLS } from "../config";
import { FavoritesCreateRepository } from "./create/repository";
import { scopedTranslation } from "./create/i18n";
import { chatFavorites } from "./db";
import { DEFAULT_COMPANION_SKILL_ID, getDefaultCompanionVariants } from "./default-companion";
import { VariantsMode } from "./enum";
import { backfillDefaultCompanions } from "./ensure-default-companion";
import { ChatFavoritesRepositoryClient } from "./repository-client";

// In-memory async store standing in for the browser's localStorage (the real
// web adapter returns null under node). Hoisted above the imports.
const memory = new Map<string, string>();
vi.mock("next-vibe/ui/lib/storage", () => ({
  storage: {
    getItem: (key: string): Promise<string | null> => Promise.resolve(memory.get(key) ?? null),
    setItem: (key: string, value: string): Promise<void> => {
      memory.set(key, value);
      return Promise.resolve();
    },
    removeItem: (key: string): Promise<void> => {
      memory.delete(key);
      return Promise.resolve();
    },
  },
  getLocalItem: (key: string): string | null => memory.get(key) ?? null,
}));

const TEST_TIMEOUT = 60_000;
const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const THEA_VARIANT_IDS = getDefaultCompanionVariants().map((v) => v.id);
const HERMES_VARIANT_ID = COMPANION_SKILLS.find((s) => s.id === "hermes")?.variants[0]?.id ?? null;

interface Row {
  slug: string;
  skillId: string;
  variantId: string | null;
  position: number;
  variantsMode: string;
}

async function rowsFor(userId: string): Promise<Row[]> {
  return db
    .select({
      slug: chatFavorites.slug,
      skillId: chatFavorites.skillId,
      variantId: chatFavorites.variantId,
      position: chatFavorites.position,
      variantsMode: chatFavorites.variantsMode,
    })
    .from(chatFavorites)
    .where(eq(chatFavorites.userId, userId));
}

describe("default companion (accounts)", () => {
  let user: JwtPrivatePayloadType;

  beforeAll(async () => {
    const created = await createTestUser(
      `default-companion-${Date.now()}@example.com`,
      "Companion Tester",
    );
    if (!created.success) {
      expect.fail(`createTestUser failed: ${created.message}`);
    }
    user = created.data.user;
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (user) {
      await deleteTestUser(user.id);
    }
  }, TEST_TIMEOUT);

  beforeEach(async () => {
    await db.delete(chatFavorites).where(eq(chatFavorites.userId, user.id));
  });

  function create(
    skillId: string,
    relayed = false,
  ): ReturnType<typeof FavoritesCreateRepository.createFavorite> {
    return FavoritesCreateRepository.createFavorite(
      { skillId },
      user,
      logger,
      t,
      defaultLocale,
      relayed,
    );
  }

  it(
    "adding 4chan with no companion also adds every Thea variant",
    async () => {
      expect(THEA_VARIANT_IDS.length).toBeGreaterThan(1);
      const result = await create("4chan");
      expect(result.success).toBe(true);

      const rows = await rowsFor(user.id);
      const chan = rows.filter((r) => r.skillId === "4chan");
      const thea = rows.filter((r) => r.skillId === DEFAULT_COMPANION_SKILL_ID);
      expect(chan).toHaveLength(1);
      expect(thea.map((r) => r.variantId).toSorted()).toEqual([...THEA_VARIANT_IDS].toSorted());
      // The added skill keeps its slug; companions sit after it.
      expect(result.success && result.data.id).toBe(chan[0]?.slug);
      for (const row of thea) {
        expect(row.position).toBeGreaterThan(chan[0]?.position ?? 0);
        expect(row.slug).toBe(`thea-${row.variantId}`);
        expect(row.variantsMode).toBe(VariantsMode.ALL);
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "concurrent double-add of 4chan creates no duplicate Thea rows",
    async () => {
      const results = await Promise.all([create("4chan"), create("4chan")]);
      expect(results.every((r) => r.success)).toBe(true);
      const thea = (await rowsFor(user.id)).filter((r) => r.skillId === DEFAULT_COMPANION_SKILL_ID);
      expect(thea).toHaveLength(THEA_VARIANT_IDS.length);
    },
    TEST_TIMEOUT,
  );

  it(
    "adding 4chan with Hermes present adds no Thea",
    async () => {
      const hermes = await create(formatSkillId("hermes", HERMES_VARIANT_ID));
      expect(hermes.success).toBe(true);
      expect((await create("4chan")).success).toBe(true);
      const rows = await rowsFor(user.id);
      expect(rows.some((r) => r.skillId === DEFAULT_COMPANION_SKILL_ID)).toBe(false);
      expect(rows.filter((r) => r.skillId === "4chan")).toHaveLength(1);
    },
    TEST_TIMEOUT,
  );

  it(
    "adding Thea itself adds nothing extra",
    async () => {
      const variantId = THEA_VARIANT_IDS[0] ?? null;
      const result = await create(formatSkillId(DEFAULT_COMPANION_SKILL_ID, variantId));
      expect(result.success).toBe(true);
      const rows = await rowsFor(user.id);
      expect(rows).toHaveLength(1);
      expect(rows[0]?.variantId).toBe(variantId);
    },
    TEST_TIMEOUT,
  );

  it(
    "backfill gives a companion-less set Thea after existing rows, once",
    async () => {
      expect((await create("4chan", true)).success).toBe(true);
      const first = await backfillDefaultCompanions({
        logger,
        userIds: [user.id],
      });
      expect(first).toEqual({
        usersTouched: 1,
        rowsInserted: THEA_VARIANT_IDS.length,
      });
      const rows = await rowsFor(user.id);
      const chanPosition = rows.find((r) => r.skillId === "4chan")?.position ?? 0;
      const thea = rows.filter((r) => r.skillId === DEFAULT_COMPANION_SKILL_ID);
      expect(thea).toHaveLength(THEA_VARIANT_IDS.length);
      expect(thea.every((r) => r.position > chanPosition)).toBe(true);
      expect(thea.every((r) => r.variantsMode === VariantsMode.ALL)).toBe(true);

      const second = await backfillDefaultCompanions({
        logger,
        userIds: [user.id],
      });
      expect(second).toEqual({ usersTouched: 0, rowsInserted: 0 });
    },
    TEST_TIMEOUT,
  );

  it(
    "a relayed create of 4chan adds no companion",
    async () => {
      expect((await create("4chan", true)).success).toBe(true);
      const rows = await rowsFor(user.id);
      expect(rows.map((r) => r.skillId)).toEqual(["4chan"]);
    },
    TEST_TIMEOUT,
  );
});

describe("default companion (signup migration)", () => {
  let userId: string | null = null;

  afterAll(async () => {
    if (userId) {
      await deleteTestUser(userId);
    }
  }, TEST_TIMEOUT);

  it(
    "migrated guest favorites without a companion get Thea",
    async () => {
      const email = `default-companion-signup-${Date.now()}@example.com`;
      const { language, country } = getLanguageAndCountryFromLocale(defaultLocale);
      const [lead] = await db
        .insert(leads)
        .values({
          email: null,
          businessName: "",
          status: LeadStatus.NEW,
          source: LeadSource.WEBSITE,
          country,
          language,
        })
        .returning({ id: leads.id });
      const signup = await confirmedTestSignup(
        {
          privateName: "Companion Signup",
          publicName: "Companion Signup",
          email,
          password: TEST_USER_PASSWORD,
          confirmPassword: TEST_USER_PASSWORD,
          acceptTerms: true,
          subscribeToNewsletter: false,
          localFavorites: [{ skillId: "4chan" }],
        },
        {
          isPublic: true,
          leadId: lead?.id ?? "",
          roles: [UserPermissionRole.PUBLIC],
        },
      );
      expect(signup.success).toBe(true);

      const [created] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
      userId = created?.id ?? null;
      expect(userId).not.toBeNull();

      const rows = await rowsFor(userId ?? "");
      expect(rows.filter((r) => r.skillId === "4chan")).toHaveLength(1);
      expect(rows.filter((r) => r.skillId === DEFAULT_COMPANION_SKILL_ID)).toHaveLength(
        THEA_VARIANT_IDS.length,
      );
    },
    TEST_TIMEOUT,
  );
});

describe("default companion (guests, localStorage)", () => {
  const storedSchema = z.array(
    z.object({ id: z.string(), skillId: z.string(), position: z.number() }),
  );

  beforeEach(() => {
    memory.clear();
  });

  async function stored(): Promise<z.output<typeof storedSchema>> {
    const raw = await storage.getItem(STORAGE_KEYS.FAVORITE_CHARACTERS, logger);
    return raw ? storedSchema.parse(JSON.parse(raw)) : [];
  }

  it("adding 4chan with nothing stored also stores every Thea variant", async () => {
    const result = await ChatFavoritesRepositoryClient.createFavorite(
      { skillId: "4chan" },
      logger,
      defaultLocale,
    );
    expect(result.success).toBe(true);
    const rows = await stored();
    expect(rows[0]).toMatchObject({ id: "4chan", skillId: "4chan", position: 0 });
    const thea = rows.filter((r) => parseSkillId(r.skillId).skillId === DEFAULT_COMPANION_SKILL_ID);
    expect(thea.map((r) => parseSkillId(r.skillId).variantId)).toEqual(THEA_VARIANT_IDS);
    expect(thea.map((r) => r.position)).toEqual(THEA_VARIANT_IDS.map((_, i) => i + 1));
  });

  it("adding 4chan with Hermes stored adds no Thea", async () => {
    await ChatFavoritesRepositoryClient.createFavorite(
      { skillId: formatSkillId("hermes", HERMES_VARIANT_ID) },
      logger,
      defaultLocale,
    );
    await ChatFavoritesRepositoryClient.createFavorite({ skillId: "4chan" }, logger, defaultLocale);
    const rows = await stored();
    expect(rows).toHaveLength(2);
    expect(rows.some((r) => parseSkillId(r.skillId).skillId === DEFAULT_COMPANION_SKILL_ID)).toBe(
      false,
    );
  });

  it("adding Thea itself stores only that favorite", async () => {
    await ChatFavoritesRepositoryClient.createFavorite(
      {
        skillId: formatSkillId(DEFAULT_COMPANION_SKILL_ID, THEA_VARIANT_IDS[0] ?? null),
      },
      logger,
      defaultLocale,
    );
    expect(await stored()).toHaveLength(1);
  });
});
