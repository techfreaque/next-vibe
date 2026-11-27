import { eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { companyMembers } from "../../db";
import { CompanyMemberRole } from "../../enum";
import { scopedTranslation } from "../../i18n";
import remove from "./[memberId]/remove/definition";
import updateRole from "./[memberId]/update-role/definition";
import invite from "./invite/definition";

const locale = "en-US";

describe("Company membership on Atlas", () => {
  const e2e = useE2E("companies/member-actions");

  e2e.it(
    "invites an existing user, changes their role and removes their access",
    async (fixtures) => {
      const { page, cleanup, capture, goto, uniqueEmail } = fixtures;
      const { companyId } = await prepareAtlasCompany(
        fixtures,
        "Northbridge Operations",
      );
      const email = uniqueEmail("member");
      const memberName = "Casey Morgan";
      const { t } = scopedTranslation.scopedT(locale);
      const { t: inviteT } = invite.POST.scopedTranslation.scopedT(locale);
      let userId: string | undefined;
      cleanup(async () => {
        if (userId) {
          await db
            .delete(companyMembers)
            .where(eq(companyMembers.userId, userId));
          await deleteTestUser(userId);
        }
      });
      const target = await createTestUser(email, memberName);
      expect(target.success).toBe(true);
      if (!target.success) return;
      userId = target.data.user.id;

      const company = `arg.companyId=${companyId}`;
      const invitePath = endpointToUrlSegment(invite.POST);
      const inviteView = page.locator(`[id="admin-tool-${invitePath}"]`);
      const input = inviteView.getByRole("textbox", {
        name: inviteT("post.email.label"),
      });
      await goto(`/tools/${invitePath}?${company}`, locale);
      await input.waitFor();
      await input.fill(email);
      await inviteView.getByRole("combobox").click();
      await page
        .getByRole("option", { name: t(CompanyMemberRole.VIEWER), exact: true })
        .click();
      await saveAdminReviewScreenshots(page, "company-members-invite", locale);
      const added = await capture(invite.POST, () =>
        inviteView.locator('button[type="submit"]').click(),
      );
      expect(added.response).toMatchObject({
        success: true,
        data: { result: { userId, role: CompanyMemberRole.VIEWER } },
      });
      await inviteView
        .getByText(inviteT("post.widget.invited"), { exact: true })
        .first()
        .waitFor();
      if (!added.response.success) return;
      const memberId = added.response.data.result.memberId;
      const member = `${company}&arg.memberId=${memberId}`;
      const readMember = () =>
        db.select().from(companyMembers).where(eq(companyMembers.id, memberId));
      expect(await readMember()).toMatchObject([
        { userId, companyId, role: CompanyMemberRole.VIEWER },
      ]);

      const editPath = endpointToUrlSegment(updateRole.PATCH);
      const editView = page.locator(`[id="admin-tool-${editPath}"]`);
      const newRole = editView.getByRole("combobox");
      await goto(`/tools/${editPath}?${member}`, locale);
      await newRole.waitFor();
      await editView.getByText(memberName, { exact: true }).waitFor();
      await newRole.click();
      await page
        .getByRole("option", {
          name: t(CompanyMemberRole.ACCOUNTANT),
          exact: true,
        })
        .click();
      await saveAdminReviewScreenshots(page, "company-member-role", locale);
      const changed = await capture(updateRole.PATCH, () =>
        editView.locator('button[type="submit"]').click(),
      );
      expect(changed.response).toMatchObject({
        success: true,
        data: { result: { memberId, role: CompanyMemberRole.ACCOUNTANT } },
      });
      await editView
        .getByText(t("updateRole.patch.widget.successLabel"), { exact: true })
        .first()
        .waitFor();
      expect(await readMember()).toMatchObject([
        { userId, companyId, role: CompanyMemberRole.ACCOUNTANT },
      ]);

      const removePath = endpointToUrlSegment(remove.POST);
      const removeView = page.locator(`[id="admin-tool-${removePath}"]`);
      const confirm = removeView.getByRole("button", {
        name: t("removeMember.post.widget.confirmButton"),
        exact: true,
      });
      await goto(`/tools/${removePath}?${member}`, locale);
      await confirm.waitFor();
      await removeView.getByText(memberName, { exact: true }).waitFor();
      await saveAdminReviewScreenshots(page, "company-member-remove", locale);
      const removed = await capture(remove.POST, () => confirm.click());
      expect(removed.response).toMatchObject({
        success: true,
        data: { removedMemberId: memberId },
      });
      await removeView
        .getByText(t("removeMember.post.widget.successLabel"), { exact: true })
        .first()
        .waitFor();
      expect(await readMember()).toMatchObject([{ userId, companyId, isActive: false }]);
    },
    120_000,
  );
});
