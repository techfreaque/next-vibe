import { randomUUID } from "node:crypto";

import { inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas, saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { CronTaskPriority, CronTaskStatus, TaskCategory } from "../../enum";
import { scopedTranslation as taskTranslations } from "../../i18n";
import { cronTasks } from "../db";
import { scopedTranslation } from "./i18n";

describe("Automation task directory", () => {
  const e2e = useE2E("cron/task-directory");

  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`combines the named status and priority filters in ${locale}`, async (fixture) => {
      const { page, baseUrl, cleanup } = fixture;
      const admin = await resolveTestAdminUser();
      await authAtlas(fixture, admin);
      const prefix = `Fixture ${randomUUID().slice(0, 8)}`;
      const fixtures = [
        { name: `${prefix} A`, state: CronTaskStatus.COMPLETED, priority: CronTaskPriority.HIGH },
        { name: `${prefix} B`, state: CronTaskStatus.COMPLETED, priority: CronTaskPriority.LOW },
        { name: `${prefix} C`, state: CronTaskStatus.FAILED, priority: CronTaskPriority.HIGH },
      ].map((entry) => ({ ...entry, id: randomUUID() }));
      const ids = fixtures.map(({ id }) => id);
      cleanup(async () => {
        await db.delete(cronTasks).where(inArray(cronTasks.id, ids));
      });
      await db.insert(cronTasks).values(fixtures.map(({ id, name, state, priority }) => ({
        id,
        shortId: id,
        userId: admin.id,
        displayName: name,
        routeId: "fixture-unregistered-task-directory",
        schedule: "0 0 1 1 *",
        category: TaskCategory.TEST,
        enabled: false,
        nextExecutionAt: null,
        lastExecutionStatus: state,
        priority,
      })));

      const { t } = scopedTranslation.scopedT(locale);
      const { t: taskT } = taskTranslations.scopedT(locale);
      await fixture.goto("/tools/task-list", locale);
      const search = page.getByRole("textbox", { name: t("get.fields.search.label"), exact: true });
      await search.waitFor({ timeout: 45_000 });
      const readSearch = page.waitForResponse((response) => {
        const url = new URL(response.url());
        return url.origin === new URL(baseUrl).origin &&
          url.pathname === `/api/${locale}/vibe/tasks/cron/tasks` &&
          url.searchParams.get("search") === prefix;
      }, { timeout: 45_000 });
      const [searchResponse] = await Promise.all([readSearch, search.fill(prefix)]);
      expect(searchResponse.ok()).toBe(true);
      const matchingRows = page.getByText(prefix, { exact: false });
      await matchingRows.nth(2).waitFor();
      expect(await matchingRows.count()).toBe(3);

      const priority = page.getByRole("combobox", { name: t("get.fields.priority.label"), exact: true });
      await priority.waitFor();
      await page.getByRole("combobox", { name: t("get.fields.category.label"), exact: true }).waitFor();
      await page.getByRole("combobox", { name: t("get.fields.sort.label"), exact: true }).waitFor();

      const completed = page.getByRole("button", { name: `${t("widget.filter.completed")} 2`, exact: true });
      await completed.click();
      const completedHigh = page.getByText(`${prefix} A`, { exact: true });
      const completedLow = page.getByText(`${prefix} B`, { exact: true });
      const failedHigh = page.getByText(`${prefix} C`, { exact: true });
      await failedHigh.waitFor({ state: "hidden" });
      expect(await completed.getAttribute("aria-pressed")).toBe("true");
      await completedLow.waitFor();

      await priority.press("Enter");
      await page.getByRole("option", { name: taskT(CronTaskPriority.HIGH), exact: true }).click();
      await completedLow.waitFor({ state: "hidden" });
      await completedHigh.waitFor();
      expect(await failedHigh.isVisible()).toBe(false);
      await saveAdminReviewScreenshots(page, "task-list", locale);
      if (process.env["TASK_DIRECTORY_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "automation", `task-list-filtered-${locale.slice(0, 2)}`);
      }

      await priority.click();
      await page.getByRole("option", { name: t("widget.filter.allPriorities"), exact: true }).click();
      await completedLow.waitFor();
      expect(await failedHigh.isVisible()).toBe(false);
      const failed = page.getByRole("button", { name: `${t("widget.filter.failed")} 1`, exact: true });
      await failed.click();
      await failedHigh.waitFor();
      expect(await completedHigh.isVisible()).toBe(false);
      expect(await failed.getAttribute("aria-pressed")).toBe("true");

      const taskState = await db.select({
        executionCount: cronTasks.executionCount,
        enabled: cronTasks.enabled,
      }).from(cronTasks).where(inArray(cronTasks.id, ids));
      expect(taskState).toEqual(fixtures.map(() => ({ executionCount: 0, enabled: false })));
    }, 120_000);
  }
});
