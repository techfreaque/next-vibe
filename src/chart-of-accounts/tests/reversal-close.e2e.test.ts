import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "../db";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  LineType,
  PeriodStatus,
} from "../enum";
import periodDetails from "../period/[periodId]/get/definition";
import {
  postAtlas,
  prepareAtlasCompany,
  saveWorkflowScreenshots,
} from "./atlas-workflow-fixture";

describe("Journal reversal and month close", () => {
  const e2e = useE2E("accounting/reversal-close");
  e2e.it(
    "posts one reversal during concurrent retries and closes the month idempotently",
    async (fixtures) => {
      const { companyId } = await prepareAtlasCompany(
        fixtures,
        "E2E Reversal Company",
      );
      const period = randomUUID();
      const nextPeriod = randomUUID();
      const cash = randomUUID();
      const revenue = randomUUID();
      await db.insert(accountingPeriods).values([
        {
          id: period,
          companyId,
          name: "October 2026",
          startDate: new Date("2026-10-01"),
          endDate: new Date("2026-10-31"),
        },
        {
          id: nextPeriod,
          companyId,
          name: "November 2026",
          startDate: new Date("2026-11-01"),
          endDate: new Date("2026-11-30"),
        },
      ]);
      await db.insert(accountNodes).values([
        {
          id: cash,
          companyId,
          code: "1100",
          name: "Bank",
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
        },
        {
          id: revenue,
          companyId,
          code: "4100",
          name: "Sales",
          type: AccountType.REVENUE,
          subtype: AccountSubtype.REVENUE_SALES,
        },
      ]);
      const date = "2026-10-20";
      const journal = {
        companyId,
        periodId: period,
        date,
        description: "E2E monthly correction",
        lines: [
          {
            accountId: cash,
            type: LineType.DEBIT,
            amount: 125.0134,
            currency: "EUR",
          },
          {
            accountId: revenue,
            type: LineType.CREDIT,
            amount: 125.0134,
            currency: "EUR",
          },
        ],
      };
      const created = await postAtlas(
        fixtures,
        "chart-of-accounts/journal/create",
        journal,
      );
      expect(created.ok).toBe(true);
      const {
        data: { id: entryId },
      } = z
        .object({
          success: z.literal(true),
          data: z.object({ id: z.uuid() }),
        })
        .parse(await created.json());
      expect(
        (
          await postAtlas(
            fixtures,
            `chart-of-accounts/journal/${entryId}/post`,
            {},
          )
        ).ok,
      ).toBe(true);
      const close = () =>
        postAtlas(fixtures, `chart-of-accounts/period/${period}/close`, {});
      expect((await close()).ok).toBe(true);
      expect((await close()).ok).toBe(true);
      expect(
        (await postAtlas(fixtures, "chart-of-accounts/journal/create", journal))
          .ok,
      ).toBe(false);

      const reverse = (reversalDate: string) =>
        postAtlas(fixtures, `chart-of-accounts/journal/${entryId}/reverse`, {
          reversalDate,
        });
      expect((await reverse(date)).ok).toBe(false);
      const responses = await Promise.all([
        reverse("2026-11-06"),
        reverse("2026-11-06"),
      ]);
      expect(responses.some((response) => response.ok)).toBe(true);
      const reversals = await db
        .select()
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.companyId, companyId),
            eq(journalEntries.reversalOfId, entryId),
          ),
        );
      expect(reversals).toHaveLength(1);
      const [reversal] = reversals;
      expect(reversal?.periodId).toBe(nextPeriod);
      expect(reversal?.date.toISOString().slice(0, 10)).toBe("2026-11-06");
      const [original] = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.id, entryId));
      expect(original?.status).toBe(JournalEntryStatus.REVERSED);
      expect(original?.reversedById).toBe(reversal?.id);
      if (reversal) {
        const rows = await db
          .select()
          .from(journalEntryLines)
          .where(eq(journalEntryLines.journalEntryId, reversal.id));
        expect(rows).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              accountId: revenue,
              type: LineType.DEBIT,
              amount: 125.0134,
            }),
            expect.objectContaining({
              accountId: cash,
              type: LineType.CREDIT,
              amount: 125.0134,
            }),
          ]),
        );
      }
      const [closed] = await db
        .select()
        .from(accountingPeriods)
        .where(eq(accountingPeriods.id, period));
      expect(closed?.status).toBe(PeriodStatus.CLOSED);
      await fixtures.open(periodDetails.GET, {
        query: { periodId: period },
        ready: async () => {
          await fixtures.page
            .getByText("October 2026", { exact: true })
            .first()
            .waitFor();
        },
      });
      await saveWorkflowScreenshots(fixtures, "ledger-month-closed");
    },
  );
});
