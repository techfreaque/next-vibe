import { randomUUID } from "node:crypto";

import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "../../db";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "../../enum";
import { type AutoPostLine, postJournalEntry } from "../../shared/auto-post";
import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
} from "../../tests/atlas-workflow-fixture";
import trial from "../trial-balance/definition";
import profit from "./definition";

describe("Ledger profit and loss posting basis", () => {
  const e2e = useE2E("ledger-profit-loss-posted-fx");

  e2e.it(
    "preserves operating activity after closing and separates booked currencies",
    async (fixtures) => {
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixtures,
        "Disposable P&L posting basis",
      );
      const october = randomUUID();
      const november = randomUUID();
      await db.insert(accountingPeriods).values([
        {
          id: october,
          companyId,
          name: "October 2026",
          startDate: new Date("2026-10-01"),
          endDate: new Date("2026-10-31"),
        },
        {
          id: november,
          companyId,
          name: "November 2026",
          startDate: new Date("2026-11-01"),
          endDate: new Date("2026-11-30"),
        },
      ]);
      const cash = randomUUID();
      const sales = randomUUID();
      const service = randomUUID();
      const expense = randomUUID();
      const retained = randomUUID();
      await db.insert(accountNodes).values([
        {
          id: cash,
          companyId,
          code: "1100",
          name: "Fixture bank",
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
        },
        {
          id: sales,
          companyId,
          code: "4100",
          name: "Fixture sales",
          type: AccountType.REVENUE,
          subtype: AccountSubtype.REVENUE_SALES,
        },
        {
          id: service,
          companyId,
          code: "4200",
          name: "Fixture service",
          type: AccountType.REVENUE,
          subtype: AccountSubtype.REVENUE_SERVICE,
        },
        {
          id: expense,
          companyId,
          code: "6100",
          name: "Fixture expense",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
        },
        {
          id: retained,
          companyId,
          code: "3200",
          name: "Fixture retained earnings",
          type: AccountType.EQUITY,
          subtype: AccountSubtype.RETAINED_EARNINGS,
        },
      ]);
      const logger = createEndpointLogger(false, E2E_LOCALE);
      const posted = (
        date: string,
        description: string,
        sourceType:
          | typeof JournalSourceType.MANUAL
          | typeof JournalSourceType.PERIOD_CLOSE,
        lines: AutoPostLine[],
      ): Promise<string | null> =>
        db.transaction((tx) =>
          postJournalEntry(
            {
              companyId,
              date: new Date(date),
              description,
              sourceType,
              sourceId: randomUUID(),
              postedByUserId: userId,
              lines,
              logger,
            },
            tx,
          ),
        );
      const line = (
        subtype: AutoPostLine["subtype"],
        type: AutoPostLine["type"],
        amount: number,
      ): AutoPostLine => ({ subtype, type, amount, currency: "EUR" });

      const original = await posted(
        "2026-10-07",
        "Fixture October sale",
        JournalSourceType.MANUAL,
        [
          line(AccountSubtype.BANK, LineType.DEBIT, 100.0001),
          line(AccountSubtype.REVENUE_SALES, LineType.CREDIT, 100.0001),
        ],
      );
      expect(
        await posted(
          "2026-10-13",
          "Fixture October service",
          JournalSourceType.MANUAL,
          [
            line(AccountSubtype.BANK, LineType.DEBIT, 0.2),
            line(AccountSubtype.REVENUE_SERVICE, LineType.CREDIT, 0.2),
          ],
        ),
      ).toBeTruthy();
      expect(
        await posted(
          "2026-10-20",
          "Fixture October expense",
          JournalSourceType.MANUAL,
          [
            line(AccountSubtype.OPEX, LineType.DEBIT, 25.0001),
            line(AccountSubtype.BANK, LineType.CREDIT, 25.0001),
          ],
        ),
      ).toBeTruthy();

      const report = async (
        from: string,
        to: string,
        currency?: string,
      ): Promise<Response> =>
        getAtlasFixture(
          `${fixtures.baseUrl}/api/${E2E_LOCALE}/chart-of-accounts/reports/profit-loss`,
          { companyId, from, to, ...(currency ? { currency } : {}) },
          headers,
        );
      const response = z.object({
        success: z.literal(true),
        data: profit.GET.responseSchema,
      });
      const readProfit = async (
        from: string,
        to: string,
        currency?: string,
      ): Promise<(typeof profit.GET.types)["ResponseOutput"]> =>
        response.parse(await (await report(from, to, currency)).json()).data;

      const octoberBefore = await readProfit("2026-10-01", "2026-10-31");
      expect(octoberBefore).toMatchObject({
        reportCurrency: "EUR",
        totalRevenue: 100.2001,
        totalExpenses: 25.0001,
        grossProfit: 100.2001,
        operatingProfit: 75.2,
        netProfit: 75.2,
      });
      const existingCloseTransfer = await posted(
        "2026-10-31",
        "Fixture historical closing transfer",
        JournalSourceType.PERIOD_CLOSE,
        [
          line(AccountSubtype.REVENUE_SALES, LineType.DEBIT, 100.0001),
          line(AccountSubtype.REVENUE_SERVICE, LineType.DEBIT, 0.2),
          line(AccountSubtype.OPEX, LineType.CREDIT, 25.0001),
          line(AccountSubtype.RETAINED_EARNINGS, LineType.CREDIT, 75.2),
        ],
      );
      expect(original && existingCloseTransfer).toBeTruthy();
      if (!original || !existingCloseTransfer) {
        return;
      }
      const close = await postAtlas(
        fixtures,
        `chart-of-accounts/period/${october}/close`,
        {},
      );
      expect(close.ok).toBe(true);
      const trialReport = await getAtlasFixture(
        `${fixtures.baseUrl}/api/${E2E_LOCALE}/chart-of-accounts/reports/trial-balance`,
        { companyId, asOfDate: "2026-10-31", currency: "EUR" },
        headers,
      );
      const trialResult = z
        .object({
          success: z.literal(true),
          data: trial.GET.responseSchema,
        })
        .parse(await trialReport.json()).data;
      expect(trialResult.isBalanced).toBe(true);
      expect(trialResult.totalDebits).toBe(225.4003);
      expect(trialResult.totalCredits).toBe(225.4003);
      expect(trialResult.accounts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ accountId: sales, balance: 0 }),
          expect.objectContaining({ accountId: service, balance: 0 }),
          expect.objectContaining({ accountId: expense, balance: 0 }),
          expect.objectContaining({ accountId: retained, balance: 75.2 }),
        ]),
      );

      const reverse = (entryId: string): Promise<Response> =>
        postAtlas(fixtures, `chart-of-accounts/journal/${entryId}/reverse`, {
          reversalDate: "2026-11-06",
        });
      expect((await reverse(original)).ok).toBe(true);
      const closeReversal = z
        .object({
          success: z.literal(true),
          data: z.object({ reversalEntryId: z.uuid() }),
        })
        .parse(await (await reverse(existingCloseTransfer)).json())
        .data.reversalEntryId;
      expect(await readProfit("2026-10-01", "2026-10-31")).toEqual(
        octoberBefore,
      );

      // Legacy USD journals predate the current company-currency posting guard.
      // Seed them at the ledger boundary with their original booked denomination.
      const historical = async (
        description: string,
        rows: readonly {
          accountId: string;
          type: AutoPostLine["type"];
          amount: number;
        }[],
        reversalOfId?: string,
      ): Promise<void> => {
        const id = randomUUID();
        await db.transaction(async (tx) => {
          await tx.insert(journalEntries).values({
            id,
            companyId,
            periodId: november,
            entryNumber: description,
            date: new Date("2026-11-07"),
            description,
            reversalOfId,
            sourceType: JournalSourceType.MANUAL,
            status: JournalEntryStatus.POSTED,
            postedAt: new Date("2026-11-07"),
            postedByUserId: userId,
          });
          await tx.insert(journalEntryLines).values(
            rows.map((row, sortOrder) => ({
              ...row,
              journalEntryId: id,
              currency: "USD",
              sortOrder,
            })),
          );
        });
      };
      await historical(
        "Legacy nested closing counterpart",
        [
          { accountId: sales, type: LineType.DEBIT, amount: 100.0001 },
          { accountId: service, type: LineType.DEBIT, amount: 0.2 },
          { accountId: expense, type: LineType.CREDIT, amount: 25.0001 },
          { accountId: retained, type: LineType.CREDIT, amount: 75.2 },
        ],
        closeReversal,
      );
      expect(await readProfit("2026-11-01", "2026-11-30")).toMatchObject({
        reportCurrency: "EUR",
        totalRevenue: -100.0001,
        totalExpenses: 0,
        netProfit: -100.0001,
      });
      await historical("Legacy USD operating sale", [
        { accountId: cash, type: LineType.DEBIT, amount: 11.0001 },
        { accountId: sales, type: LineType.CREDIT, amount: 11.0001 },
      ]);
      expect((await report("2026-11-01", "2026-11-30")).status).toBe(409);
      expect(await readProfit("2026-11-01", "2026-11-30", "EUR")).toMatchObject(
        {
          reportCurrency: "EUR",
          netProfit: -100.0001,
        },
      );
      expect(await readProfit("2026-11-01", "2026-11-30", "USD")).toMatchObject(
        {
          reportCurrency: "USD",
          netProfit: 11.0001,
        },
      );
    },
  );
});
