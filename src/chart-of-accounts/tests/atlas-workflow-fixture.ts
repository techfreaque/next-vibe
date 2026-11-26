import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { sessions } from "next-vibe/identity/session/db";
import {
  createTestSessionToken,
  E2E_AUTH_COOKIE_NAME,
} from "next-vibe/tooling/testing/e2e/auth";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import type { Page } from "playwright";
import { expect } from "vitest";
import type { z } from "zod";

import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { LEAD_ID_COOKIE_NAME } from "@/env/constants";
import { postAtlasFixture } from "@/payment/accounting/atlas-test-http";

import { accountingPeriods, accountNodes, journalEntries } from "../db";

const testAuthorization = new WeakMap<
  E2EFixtures["context"],
  Record<string, string>
>();

export async function authAtlas(
  fixtures: Pick<E2EFixtures, "cleanup" | "context" | "baseUrl">,
  admin: JwtPrivatePayloadType,
): Promise<Record<string, string>> {
  let token: string | undefined;
  fixtures.cleanup(async () => {
    if (token) {
      await db.delete(sessions).where(eq(sessions.token, token));
    }
  });
  const session = await createTestSessionToken(admin);
  expect(session.success).toBe(true);
  if (!session.success) {
    return {};
  }
  token = session.data;
  const port = new URL(fixtures.baseUrl).port;
  const names = new Set([
    E2E_AUTH_COOKIE_NAME,
    ...(port ? [`token_${port}`] : []),
  ]);
  const leadNames = new Set([
    LEAD_ID_COOKIE_NAME,
    ...(port ? [`lead_id_${port}`] : []),
  ]);
  await fixtures.context.addCookies(
    [...leadNames].map((name) => ({
      name,
      value: admin.leadId,
      url: fixtures.baseUrl,
      httpOnly: true,
    })),
  );
  await fixtures.context.addCookies(
    [...names].map((name) => ({
      name,
      value: session.data,
      url: fixtures.baseUrl,
      httpOnly: true,
    })),
  );
  const authorization = {
    authorization: `Bearer ${session.data}`,
    cookie: [...leadNames].map((name) => `${name}=${admin.leadId}`).join("; "),
  };
  testAuthorization.set(fixtures.context, authorization);
  return authorization;
}

export async function prepareAtlasCompany(
  fixtures: E2EFixtures,
  name: string,
  owner?: JwtPrivatePayloadType,
): Promise<{
  companyId: string;
  userId: string;
  headers: Record<string, string>;
}> {
  const admin = owner ?? (await resolveTestAdminUser());
  const companyId = randomUUID();
  fixtures.cleanup(async () => {
    await db
      .delete(journalEntries)
      .where(eq(journalEntries.companyId, companyId));
    await db.delete(accountNodes).where(eq(accountNodes.companyId, companyId));
    await db
      .delete(accountingPeriods)
      .where(eq(accountingPeriods.companyId, companyId));
    await db.delete(companies).where(eq(companies.id, companyId));
    expect(
      await db
        .select({ id: companies.id })
        .from(companies)
        .where(eq(companies.id, companyId)),
    ).toEqual([]);
  });
  await db.insert(companies).values({
    id: companyId,
    type: CompanyType.B2B,
    currency: "EUR",
    name,
    ownerUserId: admin.id,
  });
  await db.insert(companyMembers).values({
    companyId,
    userId: admin.id,
    role: CompanyMemberRole.OWNER,
  });
  const headers = await authAtlas(fixtures, admin);
  return { companyId, userId: admin.id, headers };
}

export async function postAtlas(
  fixtures: E2EFixtures,
  path: string,
  data: z.infer<ReturnType<typeof z.json>>,
): Promise<Response> {
  const url = `${fixtures.baseUrl}/api/${E2E_LOCALE}/${path}`;
  return await postAtlasFixture(url, {
    data,
    headers: testAuthorization.get(fixtures.context),
  });
}

export async function getAtlasFixture(
  url: string,
  params: Record<string, string>,
  headers: Record<string, string>,
): Promise<Response> {
  const target = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    target.searchParams.set(key, value);
  }
  // oxlint-disable-next-line restricted/no-raw-fetch -- real Atlas HTTP fixture
  return fetch(target, {
    headers,
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
}

export async function saveWorkflowScreenshots(
  fixtures: Pick<E2EFixtures, "page">,
  name: string,
): Promise<void> {
  const artifactDir = ".tmp/erp-night/admin-v2-proof";
  await mkdir(artifactDir, { recursive: true });
  await fixtures.page.screenshot({
    path: `${artifactDir}/${name}-desktop.png`,
    fullPage: true,
  });
  await fixtures.page.setViewportSize({ width: 390, height: 844 });
  await fixtures.page.screenshot({
    path: `${artifactDir}/${name}-phone.png`,
    fullPage: true,
  });
}

/** Capture the same authorized, settled view at the two supported review widths. */
export async function saveAdminViewMatrix(
  page: Page,
  category: string,
  name: string,
  assertReady?: () => Promise<void>,
): Promise<void> {
  const directory = `scratchpad/erp/shots/v2/${category}`;
  await mkdir(directory, { recursive: true });
  for (const [label, width, height] of [
    ["desktop", 1440, 900],
    ["phone", 390, 844],
  ] as const) {
    await page.setViewportSize({ width, height });
    for (const theme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await assertReady?.();
      // This callback executes inside Chromium. The app's cross-platform
      // storage module cannot cross the Playwright process boundary.
      /* oxlint-disable restricted/no-browser-globals */
      await page.evaluate((mode) => {
        const key = "theme_v2";
        const oldValue = localStorage.getItem(key);
        localStorage.setItem(key, mode);
        window.dispatchEvent(
          new StorageEvent("storage", { key, oldValue, newValue: mode }),
        );
      }, theme);
      await page.waitForFunction(
        (mode) => {
          const root = document.documentElement;
          const background = getComputedStyle(document.body).backgroundColor;
          const rgb = background.match(
            /^rgb\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)\s*\)$/u,
          );
          if (
            !rgb ||
            !root.classList.contains(mode) ||
            getComputedStyle(root).colorScheme !== mode
          ) {
            return false;
          }
          const brightness =
            (Number(rgb[1]) + Number(rgb[2]) + Number(rgb[3])) / 3;
          return mode === "light" ? brightness > 180 : brightness < 70;
        },
        theme,
        { timeout: 15000 },
      );
      expect(
        await page
          .locator("html")
          .evaluate((el) => getComputedStyle(el).colorScheme),
      ).toBe(theme);
      /* oxlint-enable restricted/no-browser-globals */
      expect(await page.locator("vite-error-overlay").count()).toBe(0);
      await page.screenshot({
        animations: "disabled",
        path: `${directory}/${name}-${label}-${theme}.png`,
      });
    }
  }
}
