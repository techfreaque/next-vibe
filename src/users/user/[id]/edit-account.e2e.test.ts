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

import { scopedTranslation as profileTranslation } from "../../view/i18n";
import { scopedTranslation } from "./i18n";

type AccountSnapshot = Pick<
  typeof users.$inferSelect,
  "id" | "privateName" | "publicName" | "email" | "isActive" | "emailVerified"
>;

describe("Edit a customer account", () => {
  const e2e = useE2E("users/edit-account");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`loads the selected account and saves a name change in ${locale}`, async (fixture) => {
      const { page, baseUrl } = fixture;
      const name = "Avery Martin";
      const amended = "Avery Santos";
      const email = fixture.uniqueEmail("edit-account");
      const findAccount = async (): Promise<AccountSnapshot[]> => db.select({
        id: users.id,
        privateName: users.privateName,
        publicName: users.publicName,
        email: users.email,
        isActive: users.isActive,
        emailVerified: users.emailVerified,
      }).from(users).where(eq(users.email, email));
      fixture.cleanup(async () => {
        for (const account of await findAccount()) {
          await deleteTestUser(account.id);
        }
      });
      const created = await createTestUser(email, name);
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }
      const [original] = await findAccount();
      expect(original).toBeDefined();
      if (!original) {
        return;
      }
      const admin = await resolveTestAdminUser();
      expect(original.id).not.toBe(admin.id);
      const auth = await authAtlas(fixture, admin);
      const path = `/api/${locale}/users/user/${original.id}`;
      await page.route(url => url.origin === new URL(baseUrl).origin &&
        url.pathname === `/api/${locale}/users/view` && url.searchParams.get("userId") === original.id,
        async route => {
          if (route.request().method() !== "GET") {
            await route.abort();
            return;
          }
          await route.continue({headers:{...route.request().headers(),authorization:auth.authorization}});
        });
      let writes = 0;
      await page.route(url => url.origin === new URL(baseUrl).origin && url.pathname === path, async route => {
        if (route.request().method() === "PUT") {
          writes++;
        }
        await route.continue({headers:{...route.request().headers(),authorization:auth.authorization}});
      });
      const { t } = scopedTranslation.scopedT(locale);
      const profile = profileTranslation.scopedT(locale).t;
      const field = page.getByRole("textbox", {name:t("id.put.privateName.label"),exact:true});
      const submit = page.getByTestId("endpoint-submit").filter({visible:true});
      await fixture.goto(`/tools/user-update?arg.id=${original.id}`, locale);
      await page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor();
      await field.waitFor({timeout:15_000});
      expect(await field.inputValue()).toBe(name);
      const emailField = page.getByRole("textbox",{name:t("id.put.email.label"),exact:true});
      expect(await emailField.inputValue()).toBe(email);
      const wrappedEmail = emailField.locator("..").locator('span[aria-hidden="true"]');
      await emailField.fill("draft-edit@example.com");
      expect(await emailField.inputValue()).toBe("draft-edit@example.com");
      await wrappedEmail.waitFor({state:"hidden"});
      await emailField.fill(email);
      await field.fill(amended);
      if (process.env["EDIT_ACCOUNT_SHOTS"] === "1") {
        await saveAdminViewMatrix(page,"usersDirectory",`edit-account-${locale}`,async () => {
          expect(await field.inputValue()).toBe(amended);
          const originalEmail = wrappedEmail;
          await originalEmail.waitFor();
          expect(await originalEmail.textContent()).toBe(email);
          expect(await originalEmail.evaluate(element =>
            element.scrollWidth <= element.clientWidth + 1 &&
            element.getBoundingClientRect().right <=
              element.ownerDocument.documentElement.clientWidth)).toBe(true);
          await page.getByText(t("id.put.sections.basicInfo.title"),{exact:true}).filter({visible:true}).waitFor();
        });
      }
      const [reply] = await Promise.all([
        page.waitForResponse(r => r.request().method() === "PUT" && new URL(r.url()).pathname === path),
        submit.click(),
      ]);
      expect(reply.request().postDataJSON()).toEqual({privateName:amended});
      expect(reply.ok()).toBe(true);
      expect(await reply.json()).toMatchObject({success:true,data:{privateName:amended,email}});
      expect(writes).toBe(1);
      expect(await findAccount()).toEqual([{...original,privateName:amended}]);
      // The save refreshes the record before its success action is rendered.
      await page.getByRole("button", { name: t("id.get.titleShort"), exact: true }).click();
      await page.waitForURL((url) =>
        url.pathname === `/${locale}/tools/user-view` &&
        url.searchParams.get("arg.id") === original.id,
      );
      await page.getByRole("heading",{name:amended,exact:true}).first().waitFor();
      await page.getByRole("button",{name:t("id.put.titleShort"),exact:true}).click();
      await field.waitFor();
      expect(await field.inputValue()).toBe(amended);
      expect(writes).toBe(1);

      await page.setViewportSize({width:390,height:844});
      const statusOfTarget = async (): Promise<{ banned: boolean; reason: string | null }[]> =>
        db.select({banned:users.isBanned,reason:users.bannedReason})
          .from(users).where(eq(users.id,original.id));
      for (const suspend of [true,false]) {
        await fixture.goto(`/tools/users-view?arg.userId=${original.id}`, locale);
        await page.getByRole("heading",{name:amended,exact:true}).first().waitFor();
        const more = page.getByRole("button", {name:profile("widget.actions.more"),exact:true});
        await more.click();
        const action = profile(suspend ? "ban.banUser" : "ban.unbanUser");
        const options = page.getByRole("region",{name:profile("widget.actions.more"),exact:true});
        await options.getByRole("button",{name:action,exact:true}).click();
        await page.getByText(t(suspend ? "id.widget.confirmBan" : "id.widget.confirmUnban", {name:amended}), {exact:true}).filter({visible:true}).waitFor();
        if (suspend) {
          await page.getByRole("textbox",{name:t("id.put.bannedReason.label"),exact:true}).fill("Disposable fixture");
        }
        expect(await statusOfTarget()).toEqual([{banned:!suspend,reason:suspend ? null : "Disposable fixture"}]);
        const [statusReply] = await Promise.all([
          page.waitForResponse(r => r.request().method() === "PUT" && new URL(r.url()).pathname === path),
          page.getByRole("button",{name:action,exact:true}).and(page.getByTestId("endpoint-submit")).click(),
        ]);
        expect(statusReply.ok()).toBe(true);
        expect(statusReply.request().postDataJSON()).toEqual({isBanned:suspend,bannedReason:suspend ? "Disposable fixture" : null});
        expect(await statusOfTarget()).toEqual([{banned:suspend,reason:suspend ? "Disposable fixture" : null}]);
        await page.waitForURL(url => url.pathname.endsWith("/tools/users-view"));
        await page.getByRole("heading",{name:amended,exact:true}).first().waitFor();
      }
      expect(writes).toBe(3);
    },150_000);
  }
});
