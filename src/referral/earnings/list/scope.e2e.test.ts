import { atlasRequest } from "next-vibe/tooling/testing/e2e/atlas-request";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";
import { z } from "zod";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import companyList from "@/companies/list/definition";

import earningsList from "./definition";

const earningsResponse = z.object({
  success: z.literal(true),
  data: earningsList.GET.responseSchema,
});
const companiesResponse = z.object({
  success: z.literal(true),
  data: companyList.GET.responseSchema,
});

describe("Admin directory permissions", () => {
  const e2e = useE2E("admin-s1-directory-scope");

  e2e.it(
    "uses platform data only with platform administrator permission",
    async (fixture) => {
      const email = fixture.uniqueEmail("admin-s1-scope");
      let customerId: string | undefined;
      fixture.cleanup(async () => {
        if (customerId) {
          await deleteTestUser(customerId);
        }
      });
      const created = await createTestUser(email);
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }
      const customer = created.data.user;
      customerId = customer.id;
      const admin = await resolveTestAdminUser();
      const adminAuth = await authAtlas(fixture, admin);
      const customerAuth = await authAtlas(fixture, customer);
      const adminHttp = atlasRequest(
        adminAuth.authorization.slice("Bearer ".length),
        adminAuth.cookie,
      );
      const customerHttp = atlasRequest(
        customerAuth.authorization.slice("Bearer ".length),
        customerAuth.cookie,
      );
      const api = `${fixture.baseUrl}/api/en-US`;

      const [
        allEarnings,
        personalEarnings,
        otherPartnerEarnings,
        membership,
        directory,
        forbiddenDirectory,
      ] = await Promise.all([
        adminHttp.get(`${api}/referral/earnings/list`),
        adminHttp.get(`${api}/referral/earnings/list`, {
          params: { personal: "true" },
        }),
        customerHttp.get(`${api}/referral/earnings/list`, {
          params: { targetUserId: admin.id },
        }),
        customerHttp.get(`${api}/companies/list`),
        adminHttp.get(`${api}/companies/list`, {
          params: { includeAll: "true", pageSize: "1" },
        }),
        customerHttp.get(`${api}/companies/list`, {
          params: { includeAll: "true" },
        }),
      ]);

      expect(
        earningsResponse.parse(await allEarnings.json()).data.platformWide,
      ).toBe(true);
      const personal = earningsResponse.parse(
        await personalEarnings.json(),
      ).data;
      expect(personal.platformWide).toBe(false);
      expect(
        personal.earnings.every((row) => row.earnerUserId === admin.id),
      ).toBe(true);
      expect(
        earningsResponse.parse(await otherPartnerEarnings.json()).data,
      ).toEqual({
        earnings: [],
        totalCount: 0,
        platformWide: false,
      });

      expect(companiesResponse.parse(await membership.json()).data).toEqual({
        companies: [],
        total: 0,
      });
      const fullDirectory = companiesResponse.parse(
        await directory.json(),
      ).data;
      expect(fullDirectory.companies.length).toBe(
        Math.min(fullDirectory.total, 1),
      );
      expect(forbiddenDirectory.status).toBe(403);
    },
  );
});
