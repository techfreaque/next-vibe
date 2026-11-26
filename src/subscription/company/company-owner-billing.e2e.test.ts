import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import {
  authAtlas,
  getAtlasFixture,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { subscriptions } from "@/subscription/db";
import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/subscription/enum";

import { scopedTranslation } from "./[companyId]/get/i18n";

describe("Company owner subscription", () => {
  const e2e = useE2E("company-owner-subscription");
  e2e.it(
    "shows only the authorized active owner's plan and preserves unknown periods",
    async (fixtures) => {
      const { cleanup, uniqueEmail, page, gotoReady, baseUrl } = fixtures;
      const companyId = randomUUID();
      const anotherCompanyId = randomUUID();
      const emptyCompanyId = randomUUID();
      const inactiveCompanyId = randomUUID();
      const companyIds = [
        companyId,
        anotherCompanyId,
        emptyCompanyId,
        inactiveCompanyId,
      ];
      const userIds: string[] = [];
      cleanup(async () => {
        await db.delete(companies).where(inArray(companies.id, companyIds));
        for (const id of userIds) await deleteTestUser(id);
        expect(
          await db
            .select({ id: companies.id })
            .from(companies)
            .where(inArray(companies.id, companyIds)),
        ).toEqual([]);
      });

      const owner = await createTestUser(uniqueEmail("owner"));
      if (owner.success) userIds.push(owner.data.user.id);
      const staff = await createTestUser(uniqueEmail("staff"));
      if (staff.success) userIds.push(staff.data.user.id);
      const emptyOwner = await createTestUser(uniqueEmail("empty-owner"));
      if (emptyOwner.success) userIds.push(emptyOwner.data.user.id);
      expect([owner.success, staff.success, emptyOwner.success]).toEqual([
        true,
        true,
        true,
      ]);
      if (!owner.success || !staff.success || !emptyOwner.success) return;

      const ownerId = owner.data.user.id;
      const staffId = staff.data.user.id;
      const emptyOwnerId = emptyOwner.data.user.id;
      await db.insert(userRoles).values([
        { userId: ownerId, role: UserRole.ADMIN },
        { userId: staffId, role: UserRole.ADMIN },
        { userId: emptyOwnerId, role: UserRole.PARTNER_ADMIN },
      ]);
      const ownerPlan = randomUUID();
      const staffPlan = randomUUID();
      await db.insert(subscriptions).values([
        {
          id: ownerPlan,
          userId: ownerId,
          planId: SubscriptionPlan.PLUS,
          status: SubscriptionStatus.ACTIVE,
          billingInterval: BillingInterval.YEARLY,
          currentPeriodStart: null,
          currentPeriodEnd: null,
        },
        { id: staffPlan, userId: staffId, planId: SubscriptionPlan.ULTRA },
      ]);
      const companyName = "Fixture owner workspace";
      await db.insert(companies).values([
        {
          id: companyId,
          ownerUserId: ownerId,
          name: companyName,
          type: CompanyType.B2B,
        },
        {
          id: inactiveCompanyId,
          ownerUserId: ownerId,
          name: "Inactive fixture",
          type: CompanyType.B2B,
          isActive: false,
        },
        {
          id: anotherCompanyId,
          ownerUserId: staffId,
          name: "Foreign fixture",
          type: CompanyType.B2B,
        },
        {
          id: emptyCompanyId,
          ownerUserId: emptyOwnerId,
          name: "Fixture empty workspace",
          type: CompanyType.B2B,
        },
      ]);
      await db.insert(companyMembers).values([
        { companyId, userId: staffId, role: CompanyMemberRole.ADMIN },
        { companyId, userId: ownerId, role: CompanyMemberRole.OWNER },
        {
          companyId: inactiveCompanyId,
          userId: ownerId,
          role: CompanyMemberRole.OWNER,
        },
        {
          companyId: anotherCompanyId,
          userId: staffId,
          role: CompanyMemberRole.OWNER,
        },
        {
          companyId: emptyCompanyId,
          userId: emptyOwnerId,
          role: CompanyMemberRole.OWNER,
        },
      ]);

      const ownerIdentity = {
        ...owner.data.user,
        roles: [...owner.data.user.roles, UserRole.ADMIN],
      };
      const staffHeaders = await authAtlas(fixtures, {
        ...staff.data.user,
        roles: [...staff.data.user.roles, UserRole.ADMIN],
      });
      const emptyHeaders = await authAtlas(fixtures, {
        ...emptyOwner.data.user,
        roles: [...emptyOwner.data.user.roles, UserRole.PARTNER_ADMIN],
      });
      const ownerHeaders = await authAtlas(fixtures, ownerIdentity);
      const request = (
        id: string,
        operation: "get" | "list",
        headers: Record<string, string>,
      ): Promise<Response> =>
        getAtlasFixture(
          `${baseUrl}/api/${E2E_LOCALE}/subscription/company/${id}/${operation}`,
          {},
          headers,
        );
      for (const operation of ["get", "list"] as const) {
        expect((await request(companyId, operation, staffHeaders)).status).toBe(
          403,
        );
        expect(
          (await request(anotherCompanyId, operation, ownerHeaders)).status,
        ).toBe(403);
      }
      expect(
        (await request(inactiveCompanyId, "get", ownerHeaders)).status,
      ).toBe(403);
      const summary = await request(companyId, "list", ownerHeaders);
      expect(summary.status).toBe(200);
      expect(await summary.json()).toMatchObject({
        success: true,
        data: {
          companyName,
          subscriptions: [
            {
              id: ownerPlan,
              plan: SubscriptionPlan.PLUS,
              currentPeriodStart: null,
              currentPeriodEnd: null,
            },
          ],
        },
      });
      const details = await request(companyId, "get", ownerHeaders);
      expect(details.status).toBe(200);
      expect(await details.json()).toMatchObject({
        success: true,
        data: {
          companyName,
          id: ownerPlan,
          currentPeriodStart: null,
          currentPeriodEnd: null,
        },
      });
      const emptyList = await request(emptyCompanyId, "list", emptyHeaders);
      expect(await emptyList.json()).toMatchObject({
        success: true,
        data: { subscriptions: [] },
      });
      const emptyDetails = await request(emptyCompanyId, "get", emptyHeaders);
      expect(await emptyDetails.json()).toMatchObject({
        success: true,
        data: {
          selectedCompanyId: emptyCompanyId,
          currentPeriodStart: null,
          currentPeriodEnd: null,
        },
      });
      await db
        .update(companyMembers)
        .set({ isActive: false })
        .where(eq(companyMembers.userId, ownerId));
      expect((await request(companyId, "list", ownerHeaders)).status).toBe(403);
      await db
        .update(companyMembers)
        .set({ isActive: true })
        .where(eq(companyMembers.userId, ownerId));

      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      const open = page
        .getByRole("button", { name: String(t("view.open")), exact: true })
        .last();
      await gotoReady(
        `/tools/subscription_company_companyId_list_GET?arg.companyId=${companyId}`,
        () => open.waitFor(),
      );
      await open.click();
      await page
        .getByText(String(t("view.provider")), { exact: true })
        .last()
        .waitFor();
      expect(
        await page
          .getByText(String(t("view.unavailable")), { exact: true })
          .last()
          .isVisible(),
      ).toBe(true);
      expect(
        await page
          .getByText(SubscriptionPlan.PLUS, { exact: true })
          .filter({ visible: true })
          .count(),
      ).toBe(0);
      await saveWorkflowScreenshots(fixtures, "company-owner-subscription");
    },
  );
});
