import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { scopedTranslation as adminTranslation } from "next-vibe/help-tool/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { ChatModelId } from "../../../ai-stream/models";
import { chatSettings } from "../../../chat/settings/db";
import settings from "../../../chat/settings/definition";
import { scopedTranslation as settingsTranslation } from "../../../chat/settings/i18n";
import { customSkills, skillVotes } from "../../db";
import { scopedTranslation as skillsTranslation } from "../../i18n";
import {
  ModelSelectionType,
  SkillCategory,
  SkillOwnershipType,
  SkillStatus,
  SkillVoteDirection,
} from "../../enum";
import vote from "./definition";
import { scopedTranslation as voteTranslation } from "./i18n";

describe("Admin AI tools direct launch", () => {
  const e2e = useE2E("admin-ai-direct-launch");

  e2e.it(
    "finds a community skill before voting from a direct launch",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      const admin = await resolveTestAdminUser();
      await authAtlas(fixtures, admin);
      const id = randomUUID();
      const slug = `admin-launch-${id.slice(0, 8)}`;
      const name = `Browser vote fixture ${id.slice(0, 8)}`;
      const creator = await createTestUser(
        fixtures.uniqueEmail("skill-creator"),
        "Disposable skill creator",
      );
      if (!creator.success) {
        expect.fail(creator.message);
      }
      fixtures.cleanup(async () => {
        await db.delete(skillVotes).where(eq(skillVotes.skillId, id));
        await db.delete(customSkills).where(eq(customSkills.id, id));
        await deleteTestUser(creator.data.user.id);
      });
      await db.insert(customSkills).values({
        id,
        slug,
        name,
        userId: creator.data.user.id,
        description: "Disposable browser vote fixture",
        tagline: "Community browser test",
        icon: "thumbs-up",
        category: SkillCategory.ASSISTANT,
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
        ],
      });

      const locale = "en-US";
      const { t } = voteTranslation.scopedT(locale);
      const response = await page.goto(
        `${baseUrl}/${locale}/tools/${endpointToUrlSegment(vote.POST)}`,
      );
      expect(response?.ok()).toBe(true);
      const browse = page.getByRole("button", {
        name: t("post.browseSkills"),
        exact: true,
      });
      await browse.waitFor();
      if (process.env["ADMIN_AI_SHOTS"] === "1") {
        await saveAdminViewMatrix(
          page,
          "admin-ai-direct-launch",
          "skill-vote-en-US",
        );
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      await browse.click();
      const { t: skillT } = skillsTranslation.scopedT(locale);
      await page.getByPlaceholder(skillT("get.search.placeholder")).fill(name);
      await page.getByText(name, { exact: true }).first().click();
      await page
        .getByRole("button", { name: "Vote", exact: true })
        .last()
        .click();
      const up = page.getByRole("button", {
        name: t("post.direction.up"),
        exact: true,
      });
      await up.waitFor();
      const mutation = page.waitForResponse(
        (reply) =>
          reply.request().method() === "POST" &&
          new URL(reply.url()).pathname.endsWith("/vote"),
      );
      await up.click();
      expect((await mutation).ok()).toBe(true);
      expect(
        await db
          .select({ direction: skillVotes.direction })
          .from(skillVotes)
          .where(eq(skillVotes.skillId, id)),
      ).toEqual([{ direction: SkillVoteDirection.UP }]);
      if (process.env["ADMIN_AI_SHOTS"] === "1") {
        for (const language of ["de-DE", "sk-SK"] as const) {
          const { t: localizedVote } = voteTranslation.scopedT(language);
          const localized = await page.goto(
            `${baseUrl}/${language}/tools/${endpointToUrlSegment(vote.POST)}`,
          );
          expect(localized?.ok()).toBe(true);
          await page
            .getByRole("button", {
              name: localizedVote("post.browseSkills"),
              exact: true,
            })
            .waitFor();
          await saveAdminViewMatrix(
            page,
            "admin-ai-direct-launch",
            `skill-vote-${language}`,
          );
        }
      }
    },
  );

  e2e.it(
    "retries a failed settings read on a direct update-tool launch",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      const account = await createTestUser(
        fixtures.uniqueEmail("chat-settings-admin"),
        "Disposable settings editor",
      );
      if (!account.success) {
        expect.fail(account.message);
      }
      const identity = account.data.user;
      fixtures.cleanup(async () => {
        await deleteTestUser(identity.id);
      });
      await db
        .insert(userRoles)
        .values({ userId: identity.id, role: UserRole.ADMIN });
      await authAtlas(fixtures, {
        ...identity,
        roles: [...identity.roles, UserRole.ADMIN],
      });
      const turnStepLimit = 17;
      await db
        .insert(chatSettings)
        .values({ userId: identity.id, turnStepLimit })
        .onConflictDoUpdate({
          target: chatSettings.userId,
          set: { turnStepLimit },
        });

      const capture = process.env["ADMIN_CHAT_SETTINGS_SHOTS"] === "1";
      const locales = capture
        ? (["en-US", "de-DE", "sk-SK"] as const)
        : (["en-US"] as const);
      let failRead = true;
      let deniedReads = 0;
      await page.route(
        "**/api/**/vibe/agent/chat/settings**",
        async (route) => {
          if (route.request().method() === "GET" && failRead) {
            deniedReads += 1;
            await route.fulfill({
              status: 503,
              json: { success: false, message: "Disposable settings outage" },
            });
            return;
          }
          await route.continue();
        },
      );

      await page.setViewportSize({ width: 390, height: 844 });
      for (const locale of locales) {
        failRead = true;
        const previousDeniedReads = deniedReads;
        const { t } = settingsTranslation.scopedT(locale);
        const { t: adminT } = adminTranslation.scopedT(locale);
        const response = await page.goto(
          `${baseUrl}/${locale}/tools/${endpointToUrlSegment(settings.POST)}`,
          { waitUntil: "domcontentloaded" },
        );
        expect(response?.ok()).toBe(true);
        await page
          .getByText(t("get.errors.server.description"), { exact: true })
          .waitFor();
        expect(deniedReads).toBeGreaterThan(previousDeniedReads);
        if (capture) {
          await saveAdminViewMatrix(
            page,
            "admin-ai-direct-launch",
            `chat-settings-retry-${locale}`,
          );
        }
        failRead = false;
        const recovered = page.waitForResponse(
          (reply) =>
            reply.ok() &&
            reply.request().method() === "GET" &&
            new URL(reply.url()).pathname.endsWith("/vibe/agent/chat/settings"),
        );
        await page
          .getByRole("button", { name: adminT("catalog.retry"), exact: true })
          .click();
        await recovered;
        const stepLimit = page.getByRole("textbox", {
          name: t("post.turnStepLimit.label"),
        });
        await stepLimit.waitFor();
        expect(await stepLimit.inputValue()).toBe(String(turnStepLimit));
        if (capture) {
          await saveAdminViewMatrix(
            page,
            "admin-ai-direct-launch",
            `chat-settings-restored-${locale}`,
          );
        }
      }
    },
  );
});
