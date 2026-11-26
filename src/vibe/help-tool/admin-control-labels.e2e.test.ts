import "server-only";

import { eq, inArray } from "drizzle-orm";
import { Countries, Languages } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { SYSTEM_SETTINGS_ALIAS } from "next-vibe/env/settings/constants";
import type { SystemSettingsGetResponseOutput } from "next-vibe/env/settings/definition";
import { scopedTranslation as envCopy } from "next-vibe/env/settings/i18n";
import { leads } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { CRON_GET_ALIAS } from "next-vibe/tasks/cron/[id]/constants";
import { scopedTranslation as cronCopy } from "next-vibe/tasks/cron/[id]/i18n";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { CronTaskPriority, TaskCategory } from "next-vibe/tasks/enum";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";

import {
  authAtlas,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as leadsCopy } from "@/leads/list/i18n";

import { scopedTranslation as helpCopy } from "./i18n";

const fixtureSettings: SystemSettingsGetResponseOutput = {
  modules: [
    {
      name: "env",
      configuredCount: 3,
      totalCount: 3,
      settings: [
        {
          key: "FIXTURE_TEXT",
          value: "fixture initial text",
          fieldType: "text",
          isSensitive: false,
          isConfigured: true,
          comment: "",
          example: "",
          onboardingRequired: false,
        },
        {
          key: "FIXTURE_SWITCH",
          value: "false",
          fieldType: "boolean",
          isSensitive: false,
          isConfigured: true,
          comment: "",
          example: "",
          onboardingRequired: false,
        },
        {
          key: "FIXTURE_CHOICE",
          value: "fixture one",
          fieldType: "select",
          options: ["fixture one", "fixture two"],
          isSensitive: false,
          isConfigured: true,
          comment: "",
          example: "",
          onboardingRequired: false,
        },
      ],
    },
  ],
  wizardSteps: [],
  isWritable: true,
  isDevMode: true,
  needsOnboarding: false,
  onboardingIssues: [],
};

describe("E2E: accessible admin controls", () => {
  const e2e = useE2E("admin/control-labels");

  e2e.it(
    "paginates disposable leads, refreshes a disabled task and edits synthetic settings by accessible name",
    async (fixtures) => {
      const { page, baseUrl, cleanup } = fixtures;
      const admin = await resolveTestAdminUser();
      const headers = await authAtlas(fixtures, admin);
      const prefix = `LabelTest-${crypto.randomUUID().slice(0, 12)}`;
      const leadIds = [crypto.randomUUID(), crypto.randomUUID()];
      const taskId = crypto.randomUUID();
      const taskName = `${prefix} disabled task`;
      const leadNames = [
        `${prefix} long synthetic business name newer lead`,
        `${prefix} long synthetic business name older lead`,
      ];
      const leadEmails = leadIds.map((_, index) =>
        fixtures.uniqueEmail(`${prefix}-synthetic-lead-contact-${index}`),
      );
      cleanup(async () => {
        await db.delete(cronTasks).where(eq(cronTasks.id, taskId));
        await db.delete(leads).where(inArray(leads.id, leadIds));
      });
      await db.insert(leads).values(
        leadIds.map((id, index) => ({
          id,
          businessName: leadNames[index],
          email: leadEmails[index],
          country: Countries.GLOBAL,
          language: Languages.EN,
          status: LeadStatus.NEW,
          source: LeadSource.WEBSITE,
          createdAt: new Date(Date.now() - index * 3_600_000),
        })),
      );
      await db.insert(cronTasks).values({
        id: taskId,
        shortId: taskId,
        displayName: taskName,
        routeId: "fixture-unregistered-control-label-task",
        userId: admin.id,
        enabled: false,
        nextExecutionAt: null,
        schedule: "0 0 1 1 *",
        category: TaskCategory.TEST,
        priority: CronTaskPriority.LOW,
      });

      const origin = new URL(baseUrl).origin;
      let fixtureReads = 0;
      let blockedEnvWrites = 0;
      let blockedTaskWrites = 0;
      await page.route("**/api/**", async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        if (url.origin !== origin) {
          await route.abort();
          return;
        }
        if (/^\/api\/[^/]+\/vibe\/env(?:\/|$)/.test(url.pathname)) {
          if (
            request.method() === "GET" &&
            url.pathname.endsWith("/vibe/env/settings")
          ) {
            fixtureReads += 1;
            await route.fulfill({
              json: { success: true, data: fixtureSettings },
            });
          } else {
            if (request.method() !== "GET") blockedEnvWrites += 1;
            await route.abort();
          }
          return;
        }
        if (
          url.pathname.endsWith("/leads/list") &&
          (url.searchParams.get("statusFilters.search") !== prefix ||
            url.searchParams.getAll("paginationInfo.limit").length !== 1 ||
            url.searchParams.get("paginationInfo.limit") !== "1")
        ) {
          await route.abort();
          return;
        }
        if (
          /^\/api\/[^/]+\/vibe\/tasks\/cron(?:\/|$)/.test(url.pathname) &&
          request.method() !== "GET"
        ) {
          blockedTaskWrites += 1;
          await route.abort();
          return;
        }
        await route.continue({ headers: { ...request.headers(), ...headers } });
      });

      const category = "admin-control-labels";
      const visible = (name: string) =>
        page.getByText(name, { exact: true }).filter({ visible: true }).first();
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t: tLeads } = leadsCopy.scopedT(locale);
        const { t: tCron } = cronCopy.scopedT(locale);
        const { t: tEnv } = envCopy.scopedT(locale);
        const next = page.getByRole("button", {
          name: tLeads("acquisition.next"),
          exact: true,
        });
        const previous = page.getByRole("button", {
          name: tLeads("acquisition.previous"),
          exact: true,
        });
        const leadQuery = new URLSearchParams({
          "arg.statusFilters.search": prefix,
          "arg.paginationInfo.limit": "1",
        });
        await fixtures.goto(`/tools/leads-list?${leadQuery}`, locale);
        const first = visible(leadNames[0] ?? "");
        const second = visible(leadNames[1] ?? "");
        await first.waitFor();
        await next.waitFor();
        await page.setViewportSize({ width: 390, height: 844 });
        const disclosure = page.getByRole("button", { name: tLeads("widget.listFilters"), exact: true });
        await disclosure.waitFor();
        expect(await disclosure.getAttribute("aria-expanded")).toBe("false");
        await disclosure.press("Enter");
        expect(await disclosure.getAttribute("aria-expanded")).toBe("true");
        await disclosure.press("Enter");
        expect(await disclosure.getAttribute("aria-expanded")).toBe("false");
        expect(await previous.isDisabled()).toBe(true);
        expect(await second.isVisible()).toBe(false);
        const leadPageResponse = (pageNumber: string) =>
          page.waitForResponse((response) => {
            const url = new URL(response.url());
            return (
              response.ok() &&
              url.pathname.endsWith("/leads/list") &&
              url.searchParams.get("statusFilters.search") === prefix &&
              url.searchParams.getAll("paginationInfo.page").at(-1) ===
                pageNumber
            );
          });
        await Promise.all([leadPageResponse("2"), next.press("Enter")]);
        await second.waitFor();
        expect(await first.isVisible()).toBe(false);
        expect(await next.isDisabled()).toBe(true);
        await Promise.all([leadPageResponse("1"), previous.press("Enter")]);
        await first.waitFor();
        expect(await second.isVisible()).toBe(false);
        // Capture only after both transitions, so resizing and theme changes
        // cannot interrupt a browser request in the keyboard proof.
        await Promise.all([leadPageResponse("2"), next.press("Enter")]);
        await second.waitFor();
        await saveAdminViewMatrix(
          page,
          category,
          `${locale}-leads-page-2`,
          async () => {
            await second.waitFor();
            await previous.waitFor();
            await next.waitFor();
            expect(await next.isDisabled()).toBe(true);
            expect(await previous.isEnabled()).toBe(true);
            const result = page.getByRole("button", { name: leadNames[1], exact: true });
            expect(await result.evaluate((row) => !row.closest(".opacity-50, .pointer-events-none"))).toBe(true);
            if (page.viewportSize()?.width === 1440) {
              const sortFields = await Promise.all(
                (["filters.sortBy.label", "filters.sortOrder.label"] as const).map((key) =>
                  page.getByText(tLeads(key), { exact: true }).filter({ visible: true }).first().boundingBox(),
                ),
              );
              const [field, order] = sortFields;
              expect(field && order && Math.abs(field.y - order.y) < 2).toBe(true);
            }
            if (page.viewportSize()?.width === 390) {
              const title = page.getByRole("heading", { name: `${tLeads("get.title")} (2)`, exact: true });
              await title.waitFor();
              const titleBounds = await title.boundingBox();
              expect(titleBounds && titleBounds.y >= 0 && titleBounds.y + titleBounds.height <= 844).toBe(true);
              await disclosure.waitFor();
              expect(await disclosure.getAttribute("aria-expanded")).toBe("false");
              for (const recordText of [second, visible(leadEmails[1] ?? "")]) {
                await recordText.waitFor();
                const bounds = await recordText.boundingBox();
                expect(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 390).toBe(true);
                expect(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 844).toBe(true);
              }
            }
          },
        );

        const taskPath = `/tools/${CRON_GET_ALIAS}?id=${taskId}`;
        const taskHeading = visible(taskName);
        let taskReady = false;
        for (let attempt = 0; attempt < 3 && !taskReady; attempt += 1) {
          await fixtures.goto(taskPath, locale);
          taskReady = await taskHeading.waitFor({ timeout: 25_000 }).then(
            () => true,
            () => false,
          );
        }
        expect(taskReady).toBe(true);
        const refresh = page
          .getByRole("button", { name: tCron("widget.refresh"), exact: true })
          .filter({ visible: true })
          .first();
        await refresh.waitFor();
        const completed = visible(tCron("widget.refreshSucceeded"));
        expect(await completed.isVisible()).toBe(false);
        if (locale === "en-US") {
          await page.route(
            `**/api/${locale}/vibe/tasks/cron/${taskId}*`,
            (route) =>
              route.fulfill({
                status: 503,
                json: {
                  success: false,
                  message: "Synthetic task refresh failure",
                  errorType: { ...ErrorResponseTypes.UNKNOWN_ERROR, errorCode: 503 },
                },
              }),
            { times: 1 },
          );
          await refresh.press("Enter");
          await visible("Synthetic task refresh failure").waitFor();
          expect(await completed.isVisible()).toBe(false);
          const { t: tHelp } = helpCopy.scopedT(locale);
          await page.getByRole("button", { name: tHelp("catalog.retry"), exact: true }).press("Enter");
          await refresh.waitFor();
          expect(await completed.isVisible()).toBe(false);
        }
        let refreshSucceeded = false;
        for (let attempt = 0; attempt < 3 && !refreshSucceeded; attempt += 1) {
          const refreshed = page
            .waitForResponse(
              (response) =>
                response.ok() &&
                response.request().method() === "GET" &&
                new URL(response.url()).pathname.endsWith(
                  `/vibe/tasks/cron/${taskId}`,
                ),
              { timeout: 12_000 },
            )
            .catch(() => undefined);
          await refresh.press("Enter");
          refreshSucceeded = Boolean(await refreshed);
        }
        expect(refreshSucceeded).toBe(true);
        await completed.waitFor();
        await saveAdminViewMatrix(
          page,
          category,
          `${locale}-task-refresh`,
          async () => {
            await visible(taskName).waitFor();
            const date = new Date("2000-01-01T00:00:00Z");
            const schedule = tCron("widget.annualSchedule", {
              date: new Intl.DateTimeFormat(locale, { month: "long", day: "numeric", timeZone: "UTC" }).format(date),
              time: new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(date),
            });
            await visible(schedule).waitFor();
            if (page.viewportSize()?.width === 390) {
              const totalRuns = await visible(tCron("widget.stats.totalExecutions")).boundingBox();
              expect(totalRuns && totalRuns.x >= 0 && totalRuns.x + totalRuns.width <= 390).toBe(true);
              expect(totalRuns && totalRuns.y >= 0 && totalRuns.y + totalRuns.height <= 844).toBe(true);
            }
            expect(await page.getByText(taskName, { exact: true }).filter({ visible: true }).count()).toBe(1);
            expect(await visible(tCron("widget.stats.successRate")).isVisible()).toBe(false);
            await visible(tCron("widget.schedulePaused")).waitFor();
            await completed.waitFor();
            await refresh.waitFor();
            const viewport = page.viewportSize();
            expect(viewport).toBeTruthy();
            if (!viewport) return;
            for (const key of [
              "widget.refresh",
              "widget.runManually",
              "widget.history",
              "widget.edit",
              "widget.delete",
            ] as const) {
              const action = page
                .getByRole("button", { name: tCron(key), exact: true })
                .filter({ visible: true })
                .first();
              const bounds = await action.boundingBox();
              expect(
                bounds &&
                  bounds.x >= 0 &&
                  bounds.x + bounds.width <= viewport.width,
              ).toBe(true);
            }
          },
        );

        const readsBefore = fixtureReads;
        await fixtures.goto(`/tools/${SYSTEM_SETTINGS_ALIAS}`, locale);
        const text = page.getByRole("textbox", {
          name: "FIXTURE_TEXT",
          exact: true,
        });
        const toggle = page.getByRole("switch", {
          name: "FIXTURE_SWITCH",
          exact: true,
        });
        const select = page.getByRole("combobox", {
          name: "FIXTURE_CHOICE",
          exact: true,
        });
        const save = page.getByRole("button", {
          name: tEnv("widget.save"),
          exact: true,
        });
        await text.waitFor();
        expect(fixtureReads).toBeGreaterThan(readsBefore);
        expect(await text.inputValue()).toBe("fixture initial text");
        expect(await save.isDisabled()).toBe(true);
        await text.fill("fixture edited text");
        await toggle.press("Space");
        await select.press("Enter");
        await page
          .getByRole("option", { name: "fixture two", exact: true })
          .click();
        expect(await toggle.getAttribute("aria-checked")).toBe("true");
        expect(await select.textContent()).toContain("fixture two");
        expect(await save.isEnabled()).toBe(true);
        await saveAdminViewMatrix(
          page,
          category,
          `${locale}-synthetic-settings-edited`,
          async () => {
            expect(await text.inputValue()).toBe("fixture edited text");
            await toggle.waitFor();
            await select.waitFor();
            const viewport = page.viewportSize();
            expect(viewport).toBeTruthy();
            if (!viewport) return;
            for (const key of [
              "widget.exportProd",
              "widget.restartWizard",
            ] as const) {
              const action = page.getByRole("button", {
                name: tEnv(key),
                exact: true,
              });
              await action.waitFor();
              const bounds = await action.boundingBox();
              expect(
                bounds &&
                  bounds.x >= 0 &&
                  bounds.x + bounds.width <= viewport.width,
              ).toBe(true);
            }
          },
        );
        await page
          .getByRole("button", { name: tEnv("widget.cancel"), exact: true })
          .click();
        expect(await text.inputValue()).toBe("fixture initial text");
        expect(await toggle.getAttribute("aria-checked")).toBe("false");
        expect(await save.isDisabled()).toBe(true);
      }
      const [task] = await db
        .select({
          enabled: cronTasks.enabled,
          executionCount: cronTasks.executionCount,
        })
        .from(cronTasks)
        .where(eq(cronTasks.id, taskId));
      expect(task).toEqual({ enabled: false, executionCount: 0 });
      expect(blockedTaskWrites).toBe(0);
      expect(blockedEnvWrites).toBe(0);
    },
    240_000,
  );
});
