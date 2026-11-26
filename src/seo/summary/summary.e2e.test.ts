import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { chatFolders, chatThreads } from "next-vibe/agent/chat/db";
import { ThreadModerationStatus, ThreadStatus } from "next-vibe/agent/chat/enum";
import { scopedTranslation as publicFeed } from "next-vibe/agent/chat/public-feed/i18n";
import { platformKv } from "next-vibe/agent/cortex/db";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import { scopedTranslation as help } from "next-vibe/help-tool/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { z } from "zod";

import { authAtlas, getAtlasFixture, saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { INDEXNOW_KV_KEY } from "../indexnow/constants";
import { parseFingerprints } from "../indexnow/diff";
import definition from "./definition";
import { scopedTranslation } from "./i18n";
import { PublishingSummaryRepository } from "./repository";

const reply = z.object({
  success: z.literal(true),
  data: definition.GET.responseSchema,
});

describe("Publishing workspace", () => {
  const e2e = useE2E("seo/publishing-summary");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`loads a public-only publishing snapshot and opens the forum in ${locale}`, async (fixture) => {
      const { baseUrl, cleanup, page } = fixture;
      const admin = await resolveTestAdminUser();
      const auth = await authAtlas(fixture, admin);
      const pathname = `/api/${locale}/seo/summary`;
      const summaryUrl = baseUrl + pathname;
      const { t } = scopedTranslation.scopedT(locale);
      let expectedPublicCount: number | undefined;
      let fixtureTitles: string[] = [];
      let expectedNewestOn: string | undefined;
      if (locale === "en-US") {
        const baseline = await PublishingSummaryRepository.get(createEndpointLogger(false, locale), t);
        expect(baseline.success).toBe(true);
        if (!baseline.success) return;
        const baseCount = baseline.data.summary.kpis.find(({ label }) => label === "threads")?.value;
        expectedPublicCount = (baseCount ?? 0) + 1;
        const publicFolder = randomUUID();
        const nestedFolder = randomUUID();
        const now = new Date();
        const rows = [
          { rootFolderId: DefaultFolderId.PUBLIC },
          { rootFolderId: DefaultFolderId.PRIVATE },
          { rootFolderId: DefaultFolderId.PUBLIC, folderId: nestedFolder },
          { rootFolderId: DefaultFolderId.PUBLIC, rolesView: [UserRole.CUSTOMER] },
          { rootFolderId: DefaultFolderId.PUBLIC, moderationStatus: ThreadModerationStatus.UNDER_REVIEW },
          { rootFolderId: DefaultFolderId.PUBLIC, status: ThreadStatus.DELETED },
        ].map((row, index) => ({
          ...row,
          id: randomUUID(),
          title: `Fixture publishing ${randomUUID()}`,
          userId: admin.id,
          createdAt: index === 0 ? now : new Date(now.getTime() + 24 * 60 * 60 * 1000),
        }));
        const threadIds = rows.map(({ id }) => id);
        cleanup(async () => {
          await db.delete(chatThreads).where(inArray(chatThreads.id, threadIds));
          await db.delete(chatFolders).where(inArray(chatFolders.id, [publicFolder, nestedFolder]));
        });
        await db.insert(chatFolders).values({
          id: publicFolder,
          name: "Fixture restricted public folder",
          userId: admin.id,
          rootFolderId: DefaultFolderId.PUBLIC,
          rolesView: [UserRole.ADMIN],
        });
        await db.insert(chatFolders).values({
          id: nestedFolder,
          parentId: publicFolder,
          name: "Fixture inherited restriction",
          userId: admin.id,
          rootFolderId: DefaultFolderId.PUBLIC,
        });
        await db.insert(chatThreads).values(rows);
        fixtureTitles = rows.map(({ title }) => title);
        expectedNewestOn = now.toISOString().slice(0, 10);
      }

      const origin = new URL(baseUrl).origin;
      await page.route((url) => url.origin === origin && url.pathname === pathname, async (route) => {
        if (route.request().method() !== "GET") {
          await route.fallback();
          return;
        }
        await route.continue({
          headers: { ...route.request().headers(), authorization: auth.authorization },
        });
      });
      const waitSummary = () => page.waitForResponse(
        (result) => new URL(result.url()).pathname === pathname, { timeout: 75_000 },
      );
      const [first] = await Promise.all([
        waitSummary(),
        page.goto(`${baseUrl}/${locale}/tools?cat=publishing`, { waitUntil: "commit", timeout: 60_000 }),
      ]);
      let response = first;
      if ([500, 503, 504].includes(response.status())) {
        const retry = page.getByRole("button", { name: help.scopedT(locale).t("catalog.retry"), exact: true }).filter({ visible: true }).last();
        await retry.waitFor();
        [response] = await Promise.all([waitSummary(), retry.click()]);
      }
      expect(response.status()).toBe(200);
      const { data } = reply.parse(await response.json());
      const [indexing] = await db.select().from(platformKv).where(eq(platformKv.key, INDEXNOW_KV_KEY));
      expect(data.summary.kpis.find(({ label }) => label === "savedUrls")?.value).toBe(indexing ? parseFingerprints(indexing.value).size : null);
      expect(data.indexingSnapshotOn).toBe(indexing?.updatedAt.toISOString().slice(0, 10) ?? null);

      if (locale === "en-US") {
        expect(data.summary.kpis.find(({ label }) => label === "threads")?.value).toBe(expectedPublicCount);
        expect(data.newestThreadOn).toBe(expectedNewestOn);
        for (const title of fixtureTitles) {
          expect(JSON.stringify(data)).not.toContain(title);
        }
        const anon = await getAtlasFixture(summaryUrl, {}, {});
        expect([401, 403]).toContain(anon.status);
      }
      const forumCount = page.getByRole("button").filter({ has: page.getByText(t("threads"), { exact: true }) });
      await forumCount.waitFor();
      await page.getByText(t("savedUrls"), { exact: true }).waitFor();
      const emptyIndexing = page.getByText(t("noIndexingRecordsYet"), { exact: true });
      if (indexing) {
        expect(await emptyIndexing.count()).toBe(0);
      } else {
        await emptyIndexing.waitFor();
      }
      expect(await page.getByRole("link", { name: t("title"), exact: true }).filter({ visible: true }).count()).toBe(0);
      if (process.env["PUBLISHING_SUMMARY_SHOTS"] === "1") {
        await page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor();
        await saveAdminViewMatrix(page, "publishing", `publishing-indexnow-empty-${locale.slice(0, 2)}`, async (): Promise<void> => {
          await forumCount.waitFor();
          if (!indexing) {
            await emptyIndexing.waitFor();
          }
        });
      }

      await forumCount.click();
      await page.waitForURL("**/tools/forum-threads**");
      await page.getByText(publicFeed.scopedT(locale).t("get.title"), { exact: true }).filter({ visible: true }).last().waitFor();
    }, 120_000);
  }
});
