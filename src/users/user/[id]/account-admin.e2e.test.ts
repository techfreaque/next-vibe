import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation as rolesTranslation } from "next-vibe/identity/roles/i18n";
import { users, userRoles } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import {
  createTestUser,
  deleteTestUser,
  TEST_USER_PASSWORD,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import {
  authAtlas,
  getAtlasFixture,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";
import { referralEarnings } from "@/referral/db";
import { ReferralEarningStatus } from "@/referral/enum";
import { formatReferralEarning } from "@/users/format";
import create from "@/users/create/definition";
import { scopedTranslation as createTranslation } from "@/users/create/i18n";
import { UserCreateRepository } from "@/users/create/repository";

import account from "./definition";
import { scopedTranslation } from "./i18n";

describe("Platform account administration", () => {
  const e2e = useE2E("users/platform-account-access");
  e2e.it(
    "requires a platform administrator and opens the localized account editor",
    async (fixtures) => {
      const { page, cleanup, baseUrl, uniqueEmail } = fixtures;
      const email = uniqueEmail("created");
      const ids: string[] = [];
      cleanup(async () => {
        const created = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email));
        for (const { id } of created) await deleteTestUser(id);
        for (const id of ids) await deleteTestUser(id);
      });
      for (const def of [
        create.POST,
        account.GET,
        account.PUT,
        account.DELETE,
      ]) {
        expect(def.allowedRoles).toEqual([UserPermissionRole.ADMIN]);
      }
      const partner = await createTestUser(uniqueEmail("partner"));
      expect(partner.success).toBe(true);
      if (!partner.success) return;
      ids.push(partner.data.user.id);
      await db.insert(userRoles).values({
        userId: partner.data.user.id,
        role: UserPermissionRole.PARTNER_ADMIN,
      });
      const partnerAuth = await authAtlas(fixtures, {
        ...partner.data.user,
        roles: [UserPermissionRole.PARTNER_ADMIN],
      });
      const admin = await resolveTestAdminUser();
      const headers = await authAtlas(fixtures, admin);
      const locale = "en-US";
      const t = createTranslation.scopedT(locale).t;
      const logger = createEndpointLogger(false, locale);
      const input = {
        basicInfo: {
          email,
          password: TEST_USER_PASSWORD,
          publicName: "Fixture account",
          privateName: "Fixture account",
          language: "sk",
          country: "SK",
        },
        adminSettings: {
          roles: [UserPermissionRole.CUSTOMER, UserPermissionRole.CUSTOMER],
        },
      } satisfies Parameters<typeof UserCreateRepository.createUser>[0];
      const saved = await UserCreateRepository.createUser(
        input,
        admin,
        locale,
        logger,
        t,
      );
      expect(saved.success).toBe(true);
      if (!saved.success) return;
      const id = saved.data.responseId;
      expect(saved.data.responseUserRoles).toHaveLength(1);
      expect(
        await db
          .select({ locale: users.locale })
          .from(users)
          .where(eq(users.id, id)),
      ).toEqual([{ locale: "sk-SK" }]);
      const duplicate = await UserCreateRepository.createUser(
        input,
        admin,
        locale,
        logger,
        t,
      );
      expect(duplicate.success ? 200 : duplicate.errorType.errorCode).toBe(409);
      const units = [
        {
          currency: "CREDITS",
          amountCents: 350,
          status: ReferralEarningStatus.CONFIRMED,
        },
        {
          currency: "EUR",
          amountCents: 1234,
          status: ReferralEarningStatus.PENDING,
        },
        {
          currency: "EUR",
          amountCents: 1999,
          status: ReferralEarningStatus.CANCELED,
        },
      ];
      for (const [index, unit] of units.entries()) {
        const [purchase] = await db
          .insert(paymentTransactions)
          .values({
            userId: id,
            providerSessionId: `fixture-role-${id}-${index}`,
            amount: "50.00",
            currency: "USD",
            status: PaymentStatus.SUCCEEDED,
          })
          .returning({ id: paymentTransactions.id });
        await db.insert(referralEarnings).values({
          earnerUserId: id,
          sourceUserId: id,
          transactionId: purchase.id,
          level: 1,
          ...unit,
        });
      }
      const pathname = "/api/en-US/users/user/" + id;
      expect(
        (await getAtlasFixture(baseUrl + pathname, {}, partnerAuth)).status,
      ).toBe(403);
      expect(
        (await getAtlasFixture(baseUrl + pathname, {}, headers)).status,
      ).toBe(200);
      const overview = await getAtlasFixture(
        baseUrl + "/api/en-US/users/view",
        { userId: id },
        headers,
      );
      const payload: {
        data: {
          referralStats: {
            earnings: Array<{ currency: string; amountCents: number }>;
          };
        };
      } = await overview.json();
      expect(overview.status).toBe(200);
      expect(payload.data.referralStats.earnings).toHaveLength(2);
      expect(
        payload.data.referralStats.earnings.find(
          (row) => row.currency === "CREDITS",
        )?.amountCents,
      ).toBe(350);
      expect(
        payload.data.referralStats.earnings.find(
          (row) => row.currency === "EUR",
        )?.amountCents,
      ).toBe(1234);
      for (const language of ["en-US", "de-DE", "sk-SK"] as const) {
        await page.goto(
          baseUrl + "/" + language + "/tools/user-view?arg.id=" + id,
          { waitUntil: "domcontentloaded" },
        );
        const label = rolesTranslation
          .scopedT(language)
          .t(UserPermissionRole.CUSTOMER);
        await page
          .getByText(label, { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();
        const edit = page
          .getByRole("button", {
            name: scopedTranslation.scopedT(language).t("id.put.titleShort"),
            exact: true,
          })
          .filter({ visible: true })
          .last();
        await edit.waitFor();
        await page
          .getByText(formatReferralEarning(350, "CREDITS", language), {
            exact: true,
          })
          .filter({ visible: true })
          .first()
          .waitFor();
        await page
          .getByText(formatReferralEarning(1234, "EUR", language), {
            exact: false,
          })
          .filter({ visible: true })
          .last()
          .waitFor();
        await saveAdminViewMatrix(
          page,
          "usersDirectory",
          "account-role-verified-" + language.split("-")[0],
        );
        await edit.click();
        await page.waitForURL(
          (url) =>
            url.pathname.includes("user-update") ||
            url.pathname.endsWith("/PUT"),
        );
      }
    },
  );
});
