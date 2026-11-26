import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { scopedTranslation as commonText } from "next-vibe/unified-ui/hooks/i18n";
import { describe, expect } from "vitest";
import { z } from "zod";

import { authAtlas, saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { roleLabel } from "../../../format";
import { scopedTranslation as profileTranslation } from "../../../view/i18n";
import { scopedTranslation } from "./i18n";

describe("Role management from a user profile", () => {
  const e2e = useE2E("users/role-assignment");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`grants and removes a role on the selected account in ${locale}`, async fixture => {
      const {page,baseUrl} = fixture;
      const email = fixture.uniqueEmail("role-operator");
      const name = "Avery Ridge";
      fixture.cleanup(async () => {
        const created = await db.select({id:users.id}).from(users).where(eq(users.email,email));
        for (const account of created) await deleteTestUser(account.id);
      });
      const target = await createTestUser(email,name);
      expect(target.success).toBe(true);
      if (!target.success) return;
      const id = target.data.user.id;
      const admin = await resolveTestAdminUser();
      expect(id).not.toBe(admin.id);
      const auth = await authAtlas(fixture,admin);
      const role = UserPermissionRole.PARTNER_EMPLOYEE;
      const check = () => db.select({role:userRoles.role}).from(userRoles)
        .where(and(eq(userRoles.userId,id),eq(userRoles.role,role)));
      const base = `/api/${locale}/users/user/${id}`;
      const rolesPath = base + "/roles";
      let mutations = 0;
      await page.route(url => url.origin === new URL(baseUrl).origin && (
        url.pathname === rolesPath || url.pathname === base ||
        (url.pathname === `/api/${locale}/users/view` && url.searchParams.get("userId") === id)
      ), async route => {
        if (route.request().method() !== "GET") {
          const request = route.request();
          const url = new URL(request.url());
          const payload = request.postData() ? request.postDataJSON() : {role:url.searchParams.get("role")};
          if (url.pathname !== rolesPath || !z.object({role:z.literal(role)}).safeParse(payload).success) {
            await route.abort();
            return;
          }
          mutations++;
        }
        await route.continue({headers:{...route.request().headers(),authorization:auth.authorization}});
      });
      const profile = profileTranslation.scopedT(locale).t;
      const t = scopedTranslation.scopedT(locale).t;
      const shownRole = roleLabel(role,locale);
      await fixture.goto(`/tools/user-role-remove?arg.id=${id}`,locale);
      await page.getByText(email,{exact:true}).first().waitFor();
      expect(await page.getByRole("button",{name:t("roles.delete.submit.label"),exact:true}).count()).toBe(0);
      expect(await page.getByText(t("roles.widget.removeWarning"),{exact:true}).count()).toBe(0);
      expect(mutations).toBe(0);
      await fixture.goto(`/tools/users-view?arg.userId=${id}`,locale);
      await page.getByRole("heading",{name,exact:true}).first().waitFor();
      const add = page.getByRole("button",{name:profile("roles.add"),exact:true});
      const dialog = page.getByRole("dialog");
      const recipient = dialog.getByText(email,{exact:true});
      await add.click();
      await recipient.waitFor({timeout:10_000});
      await dialog.getByRole("combobox").click();
      await page.getByRole("option",{name:shownRole,exact:true}).click();
      if (process.env["ROLE_OPERATOR_SHOTS"] === "1") {
        await saveAdminViewMatrix(page,"usersDirectory",`role-grant-${locale}`,async () => {
          await recipient.waitFor();
          expect(await dialog.getByRole("combobox").textContent()).toContain(shownRole);
        });
      }
      await page.keyboard.press("Escape");
      await dialog.waitFor({state:"hidden"});
      expect(mutations).toBe(0);
      expect(await check()).toEqual([]);
      await add.click();
      await recipient.waitFor();
      await dialog.getByRole("combobox").click();
      await page.getByRole("option",{name:shownRole,exact:true}).click();
      const mutate = async (method: "POST"|"DELETE") => {
        const [response] = await Promise.all([
          page.waitForResponse(r => r.request().method() === method && new URL(r.url()).pathname === rolesPath),
          dialog.getByRole("button",{name:t(method === "POST" ? "roles.post.submit.label" : "roles.delete.submit.label"),exact:true}).click(),
        ]);
        expect(response.ok()).toBe(true);
        await dialog.waitFor({state:"hidden"});
      };
      await mutate("POST");
      expect(await check()).toEqual([{role}]);
      const remove = page.getByRole("button",{name:profile("roles.removeNamed",{role:shownRole}),exact:true});
      await remove.click();
      await recipient.waitFor();
      expect(await dialog.getByRole("combobox").textContent()).toContain(shownRole);
      if (process.env["ROLE_OPERATOR_SHOTS"] === "1") {
        await saveAdminViewMatrix(page,"usersDirectory",`role-remove-${locale}`,async () => {
          await recipient.waitFor();
          await dialog.getByText(t("roles.widget.removeWarning"),{exact:true}).waitFor();
        });
      }
      const cancel = commonText.scopedT(locale).t("widgets.endpointRenderer.cancel");
      await dialog.getByRole("button",{name:cancel,exact:true}).click();
      await dialog.waitFor({state:"hidden"});
      expect(mutations).toBe(1);
      expect(await check()).toEqual([{role}]);
      await remove.click();
      await recipient.waitFor();
      await mutate("DELETE");
      expect(mutations).toBe(2);
      expect(await check()).toEqual([]);
      await remove.waitFor({state:"hidden"});
    },120_000);
  }
});
