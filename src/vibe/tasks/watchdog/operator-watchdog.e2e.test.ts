import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { cronTasks } from "../cron/db";
import { CronTaskPriority, CronTaskStatus, TaskCategory } from "../enum";
import budgetCaps from "./budget-caps/definition";
import cancel from "./cancel/definition";
import { taskBudgetCaps, taskIncidents } from "./db";
import { BudgetScope, TaskIncidentType } from "./enum";
import health from "./health/definition";
import { scopedTranslation } from "./i18n";

describe("Task watchdog operator workflows", () => {
  const e2e = useE2E("watchdog/operator-workflow");
  const locale = "en-US";
  const { t } = scopedTranslation.scopedT(locale);

  e2e.it("sets and refreshes a cap tied to a disposable task key", async (fixture) => {
    const { capture, cleanup, page } = fixture;
    const key = `qa-sample-${randomUUID().slice(0, 8)}`;
    cleanup(async () => {
      await db.delete(taskBudgetCaps).where(eq(taskBudgetCaps.key, key));
    });
    await authAtlas(fixture, await resolveTestAdminUser());
    await fixture.goto("/tools/task-budget-caps", locale);
    const tool = page.locator("#admin-tool-task-budget-caps");
    await tool.getByRole("button", { name: t("budgetCaps.get.widget.add"), exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox", { name: t("budgetCaps.post.fields.scope.label") }).click();
    await page.getByRole("option", { name: t(BudgetScope.TASK), exact: true }).click();
    await dialog.getByRole("textbox", { name: t("budgetCaps.post.fields.key.label") }).fill(key);
    await dialog.getByLabel(t("budgetCaps.post.fields.maxCredits.label"), { exact: true }).fill("12");
    await dialog.getByRole("textbox", { name: t("budgetCaps.post.fields.note.label") }).fill("Sample task-specific cap");
    await saveAdminReviewScreenshots(page, "task-budget-cap-set", locale);
    const submitted = await capture(budgetCaps.POST, () =>
      dialog.getByRole("button", { name: t("budgetCaps.get.widget.add"), exact: true }).click(),
    );
    expect(submitted.response.success).toBe(true);
    await tool.getByText(key, { exact: true }).waitFor();
    const [stored] = await db.select().from(taskBudgetCaps).where(eq(taskBudgetCaps.key, key));
    expect(stored?.scope).toBe(BudgetScope.TASK);
    expect(stored?.maxCredits).toBe(12);
    const refreshed = await capture(budgetCaps.GET, () =>
      tool.getByRole("button", { name: t("budgetCaps.get.widget.refresh"), exact: true }).click(),
    );
    expect(refreshed.response.success).toBe(true);
    await saveAdminReviewScreenshots(page, "task-budget-caps", locale);
  });

  e2e.it("confirms a cancellation and resolves its resulting incident", async (fixture) => {
    const { capture, cleanup, page } = fixture;
    const admin = await resolveTestAdminUser();
    const id = `qa-watchdog-${randomUUID().slice(0, 8)}`;
    const name = "Sample task pending cancellation";
    cleanup(async () => {
      await db.delete(taskIncidents).where(eq(taskIncidents.taskId, id));
      await db.delete(cronTasks).where(eq(cronTasks.id, id));
    });
    await db.insert(cronTasks).values({
      id,
      shortId: id,
      userId: admin.id,
      routeId: "fixture-watchdog-no-endpoint",
      displayName: name,
      schedule: "0 0 1 1 *",
      category: TaskCategory.TEST,
      enabled: false,
      priority: CronTaskPriority.LOW,
      runStartedAt: new Date(),
      lastExecutionStatus: CronTaskStatus.RUNNING,
    });

    await authAtlas(fixture, admin);
    await fixture.goto("/tools/task-health", locale);
    const tool = page.locator("#admin-tool-task-health");
    const cancelLabel = t("health.get.widget.cancel");
    const runningTask = tool.getByText(name, { exact: true });
    await runningTask.waitFor();
    const refreshed = await capture(health.GET, () =>
      tool.getByRole("button", { name: t("health.get.widget.refresh"), exact: true }).click(),
    );
    expect(refreshed.response.success).toBe(true);
    await saveAdminReviewScreenshots(page, "task-health", locale);
    await runningTask.locator("xpath=../..").getByRole("button", { name: cancelLabel, exact: true }).click();
    const dialog = page.getByRole("alertdialog");
    await dialog.getByText(name, { exact: true }).waitFor();
    await saveAdminReviewScreenshots(page, "task-cancel", locale);
    const cancelled = await capture(cancel.POST, () =>
      dialog.getByRole("button", { name: cancelLabel, exact: true }).click(),
    );
    expect(cancelled.response.success).toBe(true);
    const [incident] = await db.select().from(taskIncidents).where(eq(taskIncidents.taskId, id));
    expect(incident?.type).toBe(TaskIncidentType.WATCHDOG_CANCEL);
    const resolveButton = tool.getByText(name, { exact: true }).first().locator("xpath=../../..")
      .getByRole("button", { name: t("health.get.widget.resolve"), exact: true });
    await resolveButton.waitFor();
    const resolved = await capture(cancel.POST, () => resolveButton.click());
    expect(resolved.response.success).toBe(true);
    const [stored] = await db.select().from(taskIncidents).where(eq(taskIncidents.taskId, id));
    expect(stored?.resolvedAt).toBeInstanceOf(Date);
  });
});
