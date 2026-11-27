import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { DB_HEALTH_ALIAS } from "../../../database/health/constants";
import { CronTaskPriority, TaskCategory } from "../../enum";
import execute from "../../execute/definition";
import { CRON_GET_ALIAS } from "../[id]/constants";
import detail from "../[id]/definition";
import { scopedTranslation as detailTranslation } from "../[id]/i18n";
import bulk from "../bulk/definition";
import { cronTaskExecutions, cronTasks } from "../db";
import { scopedTranslation as queueTranslation } from "../queue/i18n";
import endpoints from "./definition";
import { scopedTranslation } from "./i18n";

describe("Scheduled task operator workflow", () => {
  const e2e = useE2E("cron/operator-workflow");
  e2e.it("creates, edits, runs and deletes a disposable database check", async (fixture) => {
    const { capture, cleanup, page } = fixture;
    const locale = "en-US";
    const { t } = scopedTranslation.scopedT(locale);
    const { t: detailT } = detailTranslation.scopedT(locale);
    const id = `qa-db-check-${randomUUID().slice(0, 8)}`;
    const name = "Sample database check";
    const updatedName = "Sample database check (manual)";
    cleanup(async () => {
      await db.delete(cronTasks).where(eq(cronTasks.id, id));
    });
    await authAtlas(fixture, await resolveTestAdminUser());
    await fixture.goto("/tools/cron-create", locale);
    const createForm = page.locator("#admin-tool-cron-create");
    await createForm.getByRole("textbox", { name: t("post.fields.routeId.label") }).fill(DB_HEALTH_ALIAS);
    await createForm.getByRole("textbox", { name: t("post.fields.displayName.label") }).fill(name);
    await createForm.getByRole("textbox", { name: t("post.fields.id.label") }).fill(id);
    await createForm.getByRole("textbox", { name: t("post.fields.schedule.label") }).fill("0 0 1 1 *");
    const enabled = createForm.getByRole("checkbox", { name: t("post.fields.enabled.label") });
    await enabled.uncheck();
    await saveAdminReviewScreenshots(page, "cron-create", locale);
    const created = await capture(endpoints.POST, () => createForm.getByTestId("endpoint-submit").click());
    expect(created.response.success).toBe(true);
    if (!created.response.success) {
      return;
    }
    expect(created.response.data.task.displayName).toBe(name);
    expect(created.response.data.task.enabled).toBe(false);

    await fixture.goto(`/tools/${CRON_GET_ALIAS}?id=${id}`, locale);
    const task = page.locator("#admin-tool-cron-get");
    await task.getByRole("button", { name: detailT("widget.edit"), exact: true }).first().click();
    const displayName = page.getByRole("textbox", { name: detailT("put.fields.displayName.label") });
    await displayName.fill(updatedName);
    await saveAdminReviewScreenshots(page, "cron-update", locale);
    const updated = await capture(detail.PUT, () => page.getByRole("button", { name: detailT("put.submitButton.label") }).click());
    expect(updated.response.success).toBe(true);
    const [stored] = await db.select({ name: cronTasks.displayName, enabled: cronTasks.enabled }).from(cronTasks).where(eq(cronTasks.id, id));
    expect(stored).toEqual({ name: updatedName, enabled: false });

    await page.waitForURL((url) => url.pathname.endsWith(`/tools/${CRON_GET_ALIAS}`));
    await task.getByRole("button", { name: detailT("widget.runManually"), exact: true }).first().click();
    const runDialog = page.getByRole("dialog");
    await runDialog.getByText(updatedName, { exact: true }).waitFor();
    const run = runDialog.getByTestId("endpoint-submit");
    await run.waitFor();
    await saveAdminReviewScreenshots(page, "execute-task", locale);
    const executed = await capture(execute.POST, () => run.click());
    expect(executed.response.success).toBe(true);
    const executions = await db.select({ taskId: cronTaskExecutions.taskId }).from(cronTaskExecutions).where(eq(cronTaskExecutions.taskId, id));
    expect(executions).toEqual([{ taskId: id }]);

    await page.waitForURL((url) => url.pathname.endsWith(`/tools/${CRON_GET_ALIAS}`));
    await task.getByRole("button", { name: detailT("widget.delete"), exact: true }).first().click();
    const deleteDialog = page.getByRole("dialog");
    await deleteDialog.getByText(updatedName, { exact: true }).waitFor();
    const confirmation = deleteDialog.getByTestId("endpoint-submit");
    await confirmation.waitFor();
    await saveAdminReviewScreenshots(page, "cron-delete", locale);
    const deleted = await capture(detail.DELETE, async () => {
      await confirmation.click();
      const guard = page.getByRole("alertdialog");
      if (await guard.isVisible()) {
        await guard.getByRole("button", { name: detailT("delete.titleShort"), exact: true }).click();
      }
    });
    expect(deleted.response.success).toBe(true);
    expect(await db.select({ id: cronTasks.id }).from(cronTasks).where(eq(cronTasks.id, id))).toHaveLength(0);
  }, 120_000);

  e2e.it("disables just the selected disposable queue task", async (fixture) => {
    const { capture, cleanup, page } = fixture;
    const locale = "en-US";
    const admin = await resolveTestAdminUser();
    const id = `qa-queue-cap-${randomUUID().slice(0, 8)}`;
    const name = `Sample queued database check ${id.slice(-8)}`;
    const { t } = queueTranslation.scopedT(locale);
    cleanup(async () => {
      await db.delete(cronTasks).where(eq(cronTasks.id, id));
    });
    await db.insert(cronTasks).values({
      id,
      shortId: id,
      userId: admin.id,
      routeId: DB_HEALTH_ALIAS,
      displayName: name,
      schedule: "0 0 1 1 *",
      lastExecutedAt: new Date(),
      enabled: true,
      category: TaskCategory.TEST,
      priority: CronTaskPriority.LOW,
    });
    await authAtlas(fixture, admin);
    await fixture.goto(`/tools/cron-queue?arg.search=${encodeURIComponent(name)}`, locale);
    const tool = page.locator("#admin-tool-cron-queue");
    await tool.getByRole("checkbox", { name: t("widget.bulk.selectTask", { name }), exact: true }).check();
    await saveAdminReviewScreenshots(page, "vibe_tasks_cron_bulk_POST", locale);
    const result = await capture(bulk.POST, () =>
      tool.getByRole("button", { name: t("widget.bulk.disable"), exact: true }).click(),
    );
    expect(result.requestBody).toMatchObject({ ids: [id], action: "disable" });
    expect(result.response.success && result.response.data.succeeded).toBe(1);
    await tool.getByText(t("widget.bulk.success", { succeeded: 1, failed: 0 }), { exact: true }).waitFor();
    await tool.getByText(name, { exact: true }).waitFor({ state: "hidden" });
    const [stored] = await db.select({ enabled: cronTasks.enabled }).from(cronTasks).where(eq(cronTasks.id, id));
    expect(stored?.enabled).toBe(false);
  });
});
