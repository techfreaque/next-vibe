import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
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

import { scopedTranslation } from "./i18n";

describe("User record deletion confirmation", () => {
  const e2e = useE2E("users/delete-confirmation");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`requires explicit confirmation in ${locale}`, async (fixture) => {
      const { baseUrl, page } = fixture;
      const name = "Fixture Avery Morgan";
      const email = fixture.uniqueEmail("delete-confirmation");
      const findTarget = () =>
        db.select({ id: users.id }).from(users).where(eq(users.email, email));
      fixture.cleanup(async () => {
        for (const { id } of await findTarget()) {
          await deleteTestUser(id);
        }
      });
      const target = await createTestUser(email, name);
      expect(target.success).toBe(true);
      if (!target.success) {
        return;
      }
      const id = target.data.user.id;
      const admin = await resolveTestAdminUser();
      expect(id).not.toBe(admin.id);
      const auth = await authAtlas(fixture, admin);
      const origin = new URL(baseUrl).origin;
      const path = `/api/${locale}/users/user/${id}`;
      const isTarget = (url: URL): boolean =>
        url.origin === origin && url.pathname === path;
      let deleteRequests = 0;
      await page.route(isTarget, async (route) => {
        if (route.request().method() === "DELETE") {
          deleteRequests++;
        }
        await route.continue({
          headers: { ...route.request().headers(), authorization: auth.authorization },
        });
      });

      const { t } = scopedTranslation.scopedT(locale);
      const heading = page.getByRole("heading", { name, exact: true }).first();
      await fixture.goto(`/tools/user-view?arg.id=${id}`, locale);
      await page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor();
      await heading.waitFor();
      const dangerZone = page
        .getByText(t("id.widget.dangerZone"), { exact: true })
        .locator("xpath=../../..");
      const open = dangerZone.getByRole("button", { name: t("id.delete.titleShort"), exact: true });
      const assertion = async (): Promise<void> => {
        await dangerZone.getByText(t("id.widget.deleteAccountHint", { name }), { exact: true }).waitFor();
        await open.scrollIntoViewIfNeeded();
      };
      await assertion();
      expect(await heading.locator("xpath=../../..").getByRole("button", {
        name: t("id.delete.titleShort"), exact: true,
      }).count()).toBe(0);
      if (process.env["USER_DELETE_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "usersDirectory", `user-delete-danger-${locale.slice(0, 2)}`, assertion);
      }

      const confirm = page.getByRole("button", {
        name: t("id.delete.submitButton.label"),
        exact: true,
      }).and(page.locator('button[type="submit"]'));
      const cancel = page.getByRole("button", { name: t("id.widget.cancelDeletion"), exact: true });
      const confirmReady = async (): Promise<void> => {
        await page.getByText(t("id.widget.confirmDeletionMessage"), { exact: true }).waitFor();
        await cancel.waitFor();
        await confirm.waitFor();
      };
      await open.click();
      await confirmReady();
      if (process.env["USER_DELETE_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "usersDirectory", `user-delete-confirm-${locale.slice(0, 2)}`, confirmReady);
      }
      await cancel.click();
      await heading.waitFor();
      await open.waitFor();
      expect(deleteRequests).toBe(0);
      expect(await findTarget()).toEqual([{ id }]);

      await open.click();
      await confirmReady();
      const [deleted] = await Promise.all([
        page.waitForResponse((response) =>
          isTarget(new URL(response.url())) && response.request().method() === "DELETE"),
        confirm.click(),
      ]);
      expect(deleted.status()).toBe(200);
      expect(await deleted.json()).toMatchObject({ success: true, data: { success: true } });
      expect(deleteRequests).toBe(1);
      expect(await findTarget()).toEqual([]);
    }, 120_000);
  }
});
