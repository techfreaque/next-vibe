import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import { createAnonymousLead } from "next-vibe/identity/lead/middleware-ops";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { confirmedTestSignup } from "next-vibe/tooling/testing/testing-suite/confirmed-signup";
import {
  createTestUser,
  deleteTestUser,
  TEST_USER_PASSWORD,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import * as queryExecutor from "next-vibe/unified-ui/hooks/query-executor";
import { expect, it, vi } from "vitest";

import { ChatModelId } from "../../ai-stream/models";
import { formatSkillId } from "../../chat/slugify";
import * as envAvailability from "../../env-availability";
import skillDefinition from "../[id]/definition";
import { customSkills } from "../db";
import {
  ModelSelectionType,
  SkillCategory,
  SkillOwnershipType,
  SkillStatus,
} from "../enum";
import { SkillsRepository } from "../repository";
import { scopedTranslation as createTranslation } from "./create/i18n";
import { FavoritesCreateRepository } from "./create/repository";
import { scopedTranslation as listTranslation } from "./i18n";
import { ChatFavoritesRepository } from "./repository";
import { ChatFavoritesRepositoryClient } from "./repository-client";

const memory = new Map<string, string>();
vi.mock("next-vibe/ui/lib/storage", () => ({
  storage: {
    getItem: async (key: string): Promise<string | null> =>
      memory.get(key) ?? null,
    setItem: async (key: string, value: string): Promise<void> => {
      memory.set(key, value);
    },
  },
}));

it("resolves published community favorites by slug and UUID before and after signup", async () => {
  const logger = createEndpointLogger(false, defaultLocale);
  const slug = `community-favorite-${randomUUID()}`;
  const email = `${slug}-guest@example.com`;
  const owner = await createTestUser(
    `${slug}-owner@example.com`,
    "Community Skill Creator",
  );
  if (!owner.success) {
    expect.fail(owner.message);
  }

  let leadId: string | undefined;
  try {
    const name = "Community Exam Trainer";
    const icon = "graduation-cap";
    const [skill] = await db
      .insert(customSkills)
      .values({
        slug,
        userId: owner.data.user.id,
        name,
        icon,
        tagline: "Practice for your exam",
        description: "Review topics with practice questions.",
        category: SkillCategory.EDUCATION,
        ownershipType: SkillOwnershipType.PUBLIC,
        status: SkillStatus.PUBLISHED,
        variants: [
          {
            id: "standard",
            displayName: "Standard",
            isDefault: true,
            modelSelection: {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId: ChatModelId.CLAUDE_HAIKU_5_5,
            },
          },
          {
            id: "practice",
            displayName: "Practice",
            modelSelection: {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId: ChatModelId.KIMI_K3,
            },
          },
        ],
      })
      .returning({ id: customSkills.id });
    leadId = await createAnonymousLead(
      { userAgent: slug },
      defaultLocale,
      logger,
    );
    const guest: JWTPublicPayloadType = {
      isPublic: true,
      leadId,
      roles: [UserPermissionRole.PUBLIC],
    };
    const publicSkill = await SkillsRepository.getSkillById(
      { id: slug },
      guest,
      logger,
      defaultLocale,
    );
    expect(publicSkill.success).toBe(true);
    const query = vi
      .spyOn(queryExecutor, "executeQuery")
      .mockResolvedValue(publicSkill);
    const availability = {
      ...(await envAvailability.getEnvAvailability()),
      openRouter: true,
      unbottledForce: false,
    };
    vi.spyOn(envAvailability, "getEnvAvailability").mockResolvedValue(
      availability,
    );

    const skillId = formatSkillId(slug, "practice");
    const expectedCard = {
      skillId,
      name,
      icon,
      variantName: "Practice",
      modelId: ChatModelId.KIMI_K3,
      modelInfo: "Kimi K3",
    };
    expect(
      (
        await ChatFavoritesRepositoryClient.createFavorite(
          { skillId },
          logger,
          defaultLocale,
        )
      ).success,
    ).toBe(true);

    const legacySkillId = formatSkillId(skill.id, "practice");
    expect(
      (
        await ChatFavoritesRepositoryClient.createFavorite(
          { skillId: legacySkillId },
          logger,
          defaultLocale,
        )
      ).success,
    ).toBe(true);

    const listGuestFavorites = (): ReturnType<
      typeof ChatFavoritesRepositoryClient.getFavorites
    > =>
      ChatFavoritesRepositoryClient.getFavorites(
        logger,
        defaultLocale,
        guest,
        availability,
      );
    for (const list of [
      await listGuestFavorites(),
      await listGuestFavorites(),
    ]) {
      if (!list.success) {
        expect.fail(list.message);
      }
      expect(list.data.favorites).toEqual(
        expect.arrayContaining([
          expect.objectContaining(expectedCard),
          expect.objectContaining({ ...expectedCard, skillId: legacySkillId }),
        ]),
      );
    }
    for (const id of [slug, skill.id]) {
      expect(query).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: skillDefinition.GET,
          pathParams: { id },
          user: guest,
        }),
      );
    }

    const localFavorites =
      await ChatFavoritesRepositoryClient.getLocalFavoritesForMigration(logger);
    const signup = await confirmedTestSignup(
      {
        email,
        password: TEST_USER_PASSWORD,
        confirmPassword: TEST_USER_PASSWORD,
        privateName: "Community Skill Tester",
        publicName: "Community Skill Tester",
        acceptTerms: true,
        subscribeToNewsletter: false,
        localFavorites,
      },
      guest,
    );
    expect(signup.success).toBe(true);
    const [account] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));
    expect(account).toBeDefined();
    const user = {
      id: account.id,
      isPublic: false,
      leadId,
      roles: [UserPermissionRole.CUSTOMER],
    } satisfies Parameters<typeof ChatFavoritesRepository.getFavorites>[0];
    const listAccountFavorites = (): ReturnType<
      typeof ChatFavoritesRepository.getFavorites
    > =>
      ChatFavoritesRepository.getFavorites(
        user,
        logger,
        listTranslation.scopedT(defaultLocale).t,
        defaultLocale,
        Platform.NEXT_API,
      );
    const migrated = await listAccountFavorites();
    expect(migrated.success && migrated.data.favorites).toEqual(
      expect.arrayContaining([expect.objectContaining(expectedCard)]),
    );

    const standardSkillId = formatSkillId(slug, "standard");
    const added = await FavoritesCreateRepository.createFavorite(
      { skillId: standardSkillId },
      user,
      logger,
      createTranslation.scopedT(defaultLocale).t,
      defaultLocale,
    );
    expect(added.success).toBe(true);
    const signedIn = await listAccountFavorites();
    expect(signedIn.success && signedIn.data.favorites).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          skillId: standardSkillId,
          name,
          icon,
          variantName: "Standard",
          modelId: ChatModelId.CLAUDE_HAIKU_5_5,
        }),
      ]),
    );
  } finally {
    vi.restoreAllMocks();
    const [account] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));
    if (account) {
      await deleteTestUser(account.id);
    }
    await deleteTestUser(owner.data.user.id);
    if (leadId) {
      await db.delete(leads).where(eq(leads.id, leadId));
    }
    memory.clear();
  }
}, 30_000);
