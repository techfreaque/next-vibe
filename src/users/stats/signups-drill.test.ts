/**
 * Signups report numbers equal the users-list counts they drill into.
 */

import "server-only";

import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  AnalyticsGranularity,
  AnalyticsRange,
} from "next-vibe/unified-ui/analytics/enum";
import { describe, expect, it } from "vitest";

import listDefinitions from "../list/definition";
import {
  AccountStateFilter,
  ListSortOrder,
  PayerFilter,
  UserListSortField,
  UsersAudience,
} from "../list/enum";
import statsDefinitions from "./definition";

type ListData = Partial<(typeof listDefinitions.GET)["types"]["RequestOutput"]>;

function day(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

async function listTotal(data: ListData): Promise<number> {
  const res = await sendTestRequest({
    toolExecutionContext: undefined,
    endpoint: listDefinitions.GET,
    data: {
      sortBy: UserListSortField.CREATED_AT,
      sortOrder: ListSortOrder.DESC,
      page: 1,
      limit: 1,
      ...data,
    },
    user: await resolveTestAdminUser(),
  });
  expect(res.success, res.success ? "" : res.message).toBe(true);
  return res.success ? res.data.summary.totalCount : -1;
}

describe("signups report drill-downs", () => {
  it("tiles match the users-list counts behind them", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: statsDefinitions.GET,
      data: {
        range: AnalyticsRange.LAST_90_DAYS,
        granularity: AnalyticsGranularity.WEEK,
        audience: UsersAudience.HUMANS,
      },
      user: await resolveTestAdminUser(),
    });
    expect(res.success, res.success ? "" : res.message).toBe(true);
    if (!res.success) {
      return;
    }
    const period = res.data.window;
    const { kpis, totals, signupTrend, funnel } = res.data;
    const signupWindow = {
      audience: UsersAudience.HUMANS,
      signupFrom: day(period.from),
      signupTo: day(period.to),
    };

    expect(await listTotal(signupWindow)).toBe(kpis.signups.value);
    expect(
      await listTotal({
        ...signupWindow,
        requiredState: AccountStateFilter.VERIFIED,
      }),
    ).toBe(totals.verified);
    expect(
      await listTotal({
        ...signupWindow,
        requiredState: AccountStateFilter.UNVERIFIED,
      }),
    ).toBe(kpis.signups.value - totals.verified);
    expect(
      await listTotal({
        ...signupWindow,
        accountState: [AccountStateFilter.VERIFIED],
        requiredState: AccountStateFilter.UNVERIFIED,
      }),
    ).toBe(0);
    expect(await listTotal({ ...signupWindow, hasSpentCredits: true })).toBe(
      totals.activated,
    );
    const ref = res.data.byRefCode[0];
    if (ref?.key) {
      expect(
        await listTotal({ ...signupWindow, attributedRefCode: ref.key }),
      ).toBe(ref.metrics.signups);
    }
    const locale = res.data.byLocale[0];
    if (locale?.key) {
      expect(
        await listTotal({ ...signupWindow, accountLocale: locale.key }),
      ).toBe(locale.metrics.signups);
    }
    expect(await listTotal({ ...signupWindow, payer: PayerFilter.PAID })).toBe(
      totals.converted,
    );
    expect(
      await listTotal({
        audience: UsersAudience.HUMANS,
        paidFrom: day(period.from),
        paidTo: day(period.to),
      }),
    ).toBe(kpis.payingUsers.value);
    expect(
      await listTotal({
        audience: UsersAudience.HUMANS,
        activeFrom: day(period.from),
        activeTo: day(period.to),
      }),
    ).toBe(kpis.activeUsers.value);

    // Stacked signup bars add up to the signups tile; milestones match tiles.
    const stacked = signupTrend.series.reduce(
      (sum, s) => sum + s.values.reduce((a, b) => a + b, 0),
      0,
    );
    expect(stacked).toBe(kpis.signups.value);
    const step = (key: string): number =>
      funnel.find((f) => f.key === key)?.value ?? -1;
    expect(step("signups")).toBe(kpis.signups.value);
    expect(step("verified")).toBe(totals.verified);
    expect(step("active")).toBe(totals.activated);
    expect(step("paid")).toBe(totals.converted);
  }, 60_000);
});
