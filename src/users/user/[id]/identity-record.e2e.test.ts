import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import { z } from "zod";
import { creditPacks, creditWallets } from "@/credits/db";
import { scopedTranslation as helpLocale } from "next-vibe/help-tool/i18n";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { authAtlas, saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as grantLocale } from "@/credits/i18n";

import { scopedTranslation as listLocale } from "../../list/i18n";
import { scopedTranslation as fullTranslation } from "../../view/i18n";
import { scopedTranslation } from "./i18n";

describe("User record from the catalog", () => {
  const e2e = useE2E("users/identity-record");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`verifies the selected recipient and related records in ${locale}`, async (fixture) => {
      const { page, baseUrl } = fixture;
      const name = "E2E Rowan Martin";
      const email = fixture.uniqueEmail("identity-record");
      fixture.cleanup(async () => {
        const createdAccounts = await db.select({id:users.id}).from(users).where(eq(users.email,email));
        for (const account of createdAccounts) {
          await deleteTestUser(account.id);
        }
      });
      const created = await createTestUser(email, name);
      expect(created.success).toBe(true);
      if (!created.success) return;
      const id = created.data.user.id;
      const missingId = randomUUID();
      const auth = await authAtlas(fixture, await resolveTestAdminUser());
      const origin = new URL(baseUrl).origin;
      const grantPath = `/api/${locale}/credits/admin-add`;
      const paths = new Set([
        `/api/${locale}/users/user/${id}`,
        `/api/${locale}/users/user/${missingId}`,
        `/api/${locale}/users/view`,
        grantPath,
      ]);
      await page.route((url) => url.origin === origin &&
        paths.has(url.pathname), async (route) => {
        if (route.request().method() === "POST" && new URL(route.request().url()).pathname === grantPath) {
          const request = z.object({targetUserId:z.literal(id),amount:z.literal(37)}).safeParse(route.request().postDataJSON());
          if (!request.success) { await route.abort(); return; }
          await route.continue({headers:{...route.request().headers(), authorization:auth.authorization}});
          return;
        }
        if (route.request().method() !== "GET") {
          await route.fallback();
          return;
        }
        await route.continue({
          headers: { ...route.request().headers(), authorization: auth.authorization },
        });
      });

      const { t } = scopedTranslation.scopedT(locale);
      const { t: fullT } = fullTranslation.scopedT(locale);
      const { t: creditT } = grantLocale.scopedT(locale);
      const button = (label: string) => page.getByRole("button", { name: label, exact: true });
      const heading = page.getByRole("heading", { name, exact: true }).first();
      await fixture.goto(`/tools/user-view?arg.id=${id}`, locale);
      await page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor();
      await heading.waitFor();

      const disclosure = button(t("id.widget.identifiers"));
      expect(await disclosure.getAttribute("aria-expanded")).toBe("false");
      const identifier = page.getByText(id, { exact: true });
      expect(await identifier.isVisible()).toBe(false);
      await page.getByText(t("id.widget.balance"), { exact: true }).waitFor();
      await disclosure.click();
      await identifier.waitFor();
      await disclosure.click();
      await button(t("id.widget.fullProfile")).waitFor();
      const grant = button(fullT("widget.actions.addCredits"));
      await grant.waitFor();
      if (process.env["IDENTITY_RECORD_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "usersDirectory", `identity-r43-ready-${locale.slice(0, 2)}`, async (): Promise<void> => {
          await heading.waitFor();
          await grant.waitFor();
          const shortcutLabel = page.getByText(t("id.widget.relatedThreadActivity"), { exact: true });
          const fits = await shortcutLabel.evaluate((label) => {
            const button = label.closest("button")?.getBoundingClientRect();
            const text = label.getBoundingClientRect();
            return Boolean(button && text.right <= button.right && label.scrollWidth <= label.clientWidth + 1);
          });
          expect(fits).toBe(true);
        });
      }

      const [verified] = await Promise.all([
        page.waitForResponse((reply) => {
          const url = new URL(reply.url());
          return reply.request().method() === "GET" &&
            url.pathname === grantPath && url.searchParams.get("targetUserId") === id;
        }, { timeout: 45_000 }),
        grant.click(),
      ]);
      expect(verified.status()).toBe(200);
      const dialog = page.getByRole("dialog");
      await dialog.getByText(email, { exact: true }).waitFor();
      await dialog.getByText(creditT("adminAdd.recipient.verified"), { exact: true }).waitFor();
      const amount = dialog.getByRole("textbox",{name:creditT("adminAdd.post.amount.label"),exact:true});
      expect(await amount.inputValue()).toBe("");
      await dialog.getByText(creditT("adminAdd.recipient.packBalance"),{exact:true}).waitFor();
      const submitGrant = dialog.getByRole("button",{name:creditT("adminAdd.post.submitButton.label"),exact:true});
      expect(await submitGrant.isDisabled()).toBe(true);
      if (process.env["IDENTITY_RECORD_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "usersDirectory", `identity-r43-grant-${locale.slice(0, 2)}`, async (): Promise<void> => {
          await dialog.getByText(email, { exact: true }).waitFor();
          const title = dialog.getByRole("heading", { name: creditT("adminAdd.post.container.title"), exact: true });
          await title.waitFor();
          expect(await title.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
          const submitBounds = await submitGrant.boundingBox();
          const dialogBounds = await dialog.boundingBox();
          expect(Boolean(submitBounds && dialogBounds &&
            submitBounds.y >= dialogBounds.y &&
            submitBounds.y + submitBounds.height <= dialogBounds.y + dialogBounds.height + 1)).toBe(true);
        });
      }
      await dialog.getByRole("button",{name:creditT("adminAdd.post.testerPreset",{amount:new Intl.NumberFormat(locale).format(3000)}),exact:true}).click();
      expect(await amount.inputValue()).toBe("3000");
      await amount.fill("37");
      const [granted] = await Promise.all([
        page.waitForResponse(reply => reply.request().method() === "POST" && new URL(reply.url()).pathname === grantPath),
        submitGrant.click(),
      ]);
      expect(granted.ok()).toBe(true);
      const confirmation = z.object({success:z.literal(true), data:z.object({recipientId:z.literal(id),packId:z.uuid()})}).parse(await granted.json());
      await dialog.getByText(creditT("adminAdd.recipient.openLedger"),{exact:true}).waitFor();
      const packs = await db.select({owner:creditWallets.userId,amount:creditPacks.originalAmount,remaining:creditPacks.remaining})
        .from(creditPacks).innerJoin(creditWallets,eq(creditWallets.id,creditPacks.walletId))
        .where(eq(creditPacks.id,confirmation.data.packId));
      expect(packs).toEqual([{owner:id,amount:37,remaining:37}]);
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });

      for (const [label, tab, tabLabel] of [
        [t("id.widget.relatedPayments"), "billing", fullT("tabs.billing")],
        [fullT("tabs.credits"), "credits", fullT("tabs.credits")],
        [t("id.widget.relatedThreadActivity"), "activity", fullT("tabs.activity")],
        [fullT("tabs.referrals"), "referrals", fullT("tabs.referrals")],
      ] as const) {
        await button(label).click();
        await page.waitForURL((url) => url.pathname.endsWith("/tools/users-view") &&
          url.searchParams.get("arg.userId") === id && url.searchParams.get("arg.tab") === tab);
        const sections = page.getByRole("combobox", {name:fullT("tabs.section")});
        const selected = page.getByRole("tab").filter({hasText:tabLabel});
        await sections.or(selected).first().waitFor();
        if (await sections.isVisible()) {
          expect(await sections.textContent()).toContain(tabLabel);
        } else {
          expect(await selected.getAttribute("aria-selected")).toBe("true");
        }
        if (tab === "billing") {
          await page.getByText(fullT("billing.noPayments"), { exact: true }).waitFor();
          if (process.env["IDENTITY_RECORD_SHOTS"] === "1") {
            await saveAdminViewMatrix(page, "usersDirectory", `identity-r43-payment-empty-${locale.slice(0, 2)}`, async (): Promise<void> => {
              const empty = page.getByText(fullT("billing.noPayments"), { exact: true });
              await empty.waitFor();
              if (await sections.isVisible()) {
                await sections.evaluate(element => {
                  element.style.scrollMarginTop = "120px";
                  element.scrollIntoView({block:"start",inline:"nearest"});
                });
              } else {
                await empty.evaluate(element => element.scrollIntoView({block:"center",inline:"nearest"}));
              }
              const bounds = await empty.boundingBox();
              const size = page.viewportSize();
              expect(Boolean(bounds && size && bounds.y >= 0 && bounds.y + bounds.height <= size.height)).toBe(true);
            });
          }
        }
        if (tab === "activity") {
          await page.getByText(fullT("chat.threads"), { exact: true }).waitFor();
        }
        await page.goBack({ waitUntil: "commit" });
        await heading.waitFor();
      }

      await fixture.goto(`/tools/user-view?arg.id=${missingId}`, locale);
      const notFound = page.getByText(t("id.get.errors.notFound.description"), { exact: true });
      const retryRead = button(fullT("widget.actions.retry"));
      await notFound.or(retryRead).first().waitFor();
      if (await retryRead.isVisible()) {
        await retryRead.click();
      }
      await notFound.waitFor();
      expect(await grant.count()).toBe(0);
      expect(await page.getByText(missingId, { exact: false }).count()).toBe(0);
      if (process.env["IDENTITY_RECORD_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "usersDirectory", `identity-r43-error-${locale.slice(0, 2)}`, async (): Promise<void> => {
          await page.getByText(t("id.get.errors.notFound.description"), { exact: true }).waitFor();
        });
      }
      const backLabel = helpLocale.scopedT(locale).t("admin.recordBackTo", {
        section: listLocale.scopedT(locale).t("get.titleShort"),
      });
      await button(backLabel).click();
      await page.waitForURL((url) => url.pathname.endsWith("/tools/users-list"));
    }, 150_000);
  }
});
