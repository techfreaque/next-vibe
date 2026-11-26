import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { LeadSource } from "next-vibe/identity/lead/enum";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { resolveAnalyticsWindow } from "next-vibe/unified-ui/analytics/window";
import { describe, expect } from "vitest";
import { z } from "zod";

import { authAtlas, getAtlasFixture } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { creditTransactions, creditWallets } from "../../db";
import { CreditFundingType, CreditTransactionType } from "../../enum";
import definition from "./definition";
import { CreditUsageReportRepository } from "./repository";

describe("Usage headline on Atlas", () => {
  const e2e = useE2E("credits/usage-headline");

  e2e.it("matches the authenticated usage report with free, gifted and internal spend", async (fixture) => {
    const admin = await createTestUser(fixture.uniqueEmail("credit-usage-headline"));
    expect(admin.success).toBe(true);
    if (!admin.success) {
      return;
    }
    const identity = {
      ...admin.data.user,
      roles: [UserPermissionRole.ADMIN, ...admin.data.user.roles],
    };
    fixture.cleanup(async () => deleteTestUser(identity.id));
    await db.insert(userRoles).values({ userId: identity.id, role: UserPermissionRole.ADMIN });
    const headers = await authAtlas(fixture, identity);
    const guestLead = randomUUID();
    const linkedLead = randomUUID();
    const guestWallet = randomUUID();
    const [existingInternalWallet] = await db.select({ id: creditWallets.id })
      .from(creditWallets).where(eq(creditWallets.userId, identity.id));
    const internalWallet = existingInternalWallet?.id ?? randomUUID();
    fixture.cleanup(async () => {
      await db.delete(creditWallets).where(inArray(creditWallets.id, [guestWallet, internalWallet]));
      await db.delete(leads).where(inArray(leads.id, [guestLead, linkedLead]));
    });
    await db.insert(leads).values([
      { id: guestLead, businessName: "Fixture usage guest", country: "US", language: "en", source: LeadSource.WEBSITE },
      { id: linkedLead, businessName: "Fixture usage in shared wallet", country: "US", language: "en", source: LeadSource.WEBSITE },
    ]);
    await db.insert(creditWallets).values({ id: guestWallet, leadId: guestLead });
    if (!existingInternalWallet) {
      await db.insert(creditWallets).values({
        id: internalWallet, userId: identity.id, freeCreditsRemaining: 0,
      });
    }
    await db.insert(userLeadLinks).values({
      userId: identity.id, leadId: linkedLead, linkReason: "manual",
      linkedAt: new Date("2002-04-01T12:00:00Z"),
    });
    const current = {
      walletId: guestWallet,
      type: CreditTransactionType.USAGE,
      balanceAfter: 0,
      fundingType: CreditFundingType.FREE_ALLOWANCE,
      createdAt: new Date("2002-04-02T00:00:00Z"),
    };
    await db.insert(creditTransactions).values([
      { ...current, amount: -400, metadata: { cost: 400, upstreamCostUsd: 2, fallbackCostUsd: 1 } },
      {
        ...current, amount: -200, fundingType: CreditFundingType.ADMIN_GRANT,
        metadata: { cost: 200, upstreamCostUsd: 0 },
      },
      { ...current, amount: -300, metadata: { cost: 300 } },
      { ...current, amount: -900, metadata: { cost: 900, upstreamCostUsd: 9, signupCarryover: true } },
      { ...current, amount: -500, metadata: { cost: 500, upstreamCostUsd: 5, actorLeadId: linkedLead } },
      { ...current, walletId: internalWallet, amount: -700, metadata: { cost: 700, upstreamCostUsd: 7 } },
      {
        ...current, amount: -100, createdAt: new Date("2002-04-01T12:00:00Z"),
        metadata: { cost: 100, upstreamCostUsd: 0 },
      },
      {
        ...current, amount: -999, createdAt: new Date("2002-04-03T00:00:00Z"),
        metadata: { cost: 999, upstreamCostUsd: 9 },
      },
    ]);

    const input = { range: AnalyticsRange.CUSTOM, from: "2002-04-02", to: "2002-04-02" };
    const response = await getAtlasFixture(
      `${fixture.baseUrl}/api/en-US/credits/analytics/usage`,
      input,
      headers,
    );
    expect(response.ok).toBe(true);
    const { data: report } = z.object({ data: definition.GET.responseSchema })
      .parse(await response.json());
    const actual = await CreditUsageReportRepository.headline(resolveAnalyticsWindow(input));
    expect(actual).toEqual({
      estimatedCostUsd: report.kpis.upstreamCostUsd,
      costedUsageMarginUsd: report.kpis.marginUsd,
    });
    expect(actual).toEqual({
      estimatedCostUsd: { value: 3, previous: 0 },
      costedUsageMarginUsd: { value: 3, previous: 1 },
    });
    expect(report.kpis.creditsSpent.value).toBe(900);
  });
});
