import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import candidates from "../candidates/definition";
import { BANK_STATEMENT_HEADER } from "../csv";
import { bankStatementLines } from "../db";
import { scopedTranslation } from "../i18n";
import match from "../match/definition";

describe("Bank CSV reconciliation", () => {
  const e2e = useE2E("finance/bank-reconciliation");

  e2e.it(
    "imports an exact line once and records the reviewed account match",
    async (fixtures) => {
      const { companyId, headers } = await prepareAtlasCompany(
        fixtures,
        "E2E Bank Company",
      );
      fixtures.cleanup(async () => {
        await db
          .delete(bankStatementLines)
          .where(eq(bankStatementLines.companyId, companyId));
        expect(
          await db
            .select()
            .from(bankStatementLines)
            .where(eq(bankStatementLines.companyId, companyId)),
        ).toEqual([]);
      });

      const accountId = randomUUID();
      const revenueId = randomUUID();
      const periodId = randomUUID();
      const date = "2026-11-14";
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      await db.insert(accountingPeriods).values({
        id: periodId,
        companyId,
        name: "November 2026",
        startDate: new Date("2026-11-01"),
        endDate: new Date("2026-11-30"),
      });
      await db.insert(accountNodes).values([
        {
          id: accountId,
          companyId,
          code: "1100",
          name: "Current account",
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
        },
        {
          id: revenueId,
          companyId,
          code: "4100",
          name: "Service revenue",
          type: AccountType.REVENUE,
          subtype: AccountSubtype.REVENUE_SERVICE,
        },
      ]);

      const journal = await postAtlas(
        fixtures,
        "chart-of-accounts/journal/create",
        {
          companyId,
          periodId,
          date,
          description: "E2E bank source payment",
          lines: [
            {
              accountId,
              type: LineType.DEBIT,
              amount: 125.3401,
              currency: "EUR",
            },
            {
              accountId: revenueId,
              type: LineType.CREDIT,
              amount: 125.3401,
              currency: "EUR",
            },
          ],
        },
      );
      expect(journal.ok).toBe(true);
      const journalSource = z
        .object({ success: z.literal(true), data: z.object({ id: z.uuid() }) })
        .parse(await journal.json());
      expect(
        (
          await postAtlas(
            fixtures,
            `chart-of-accounts/journal/${journalSource.data.id}/post`,
            {},
          )
        ).ok,
      ).toBe(true);
      const [bankLeg] = await db
        .select()
        .from(journalEntryLines)
        .where(
          and(
            eq(journalEntryLines.journalEntryId, journalSource.data.id),
            eq(journalEntryLines.accountId, accountId),
          ),
        );
      expect(bankLeg?.id).toBeDefined();
      if (!bankLeg) {
        return;
      }
      const csv = `${BANK_STATEMENT_HEADER}\nstatement-e2e,${date},125.3401,EUR`;
      const importCsv = (value: string) =>
        postAtlas(fixtures, "finance/bank/import", {
          companyId,
          accountId,
          csv: value,
        });
      expect((await importCsv("invalid")).ok).toBe(false);
      const imported = await importCsv(csv);
      const repeated = await importCsv(csv);
      expect(imported.ok).toBe(true);
      expect(repeated.ok).toBe(true);
      expect(await repeated.json()).toMatchObject({
        success: true,
        data: { imported: 0, skipped: 1 },
      });

      const [line] = await db
        .select()
        .from(bankStatementLines)
        .where(eq(bankStatementLines.companyId, companyId));
      expect(line?.amount).toBe("125.3401");
      if (!line) {
        return;
      }
      const parameters = { companyId, lineId: line.id };
      const url = `${fixtures.baseUrl}/api/${E2E_LOCALE}/finance/bank/candidates`;
      expect((await getAtlasFixture(url, { companyId }, headers)).ok).toBe(
        false,
      );
      const found = await getAtlasFixture(url, parameters, headers);
      expect(found.ok).toBe(true);
      expect(await found.json()).toMatchObject({
        success: true,
        data: {
          statementLine: { id: line.id },
          matches: [{ id: bankLeg.id }],
        },
      });

      const matchInput = {
        ...parameters,
        journalLineId: bankLeg.id,
        confirm: false,
      };
      expect(
        (await postAtlas(fixtures, "finance/bank/match", matchInput)).ok,
      ).toBe(false);
      await fixtures.open(candidates.GET, {
        query: parameters,
        ready: async () => {
          await fixtures.page.locator("[data-hydrated]").first().waitFor();
        },
      });
      const review = fixtures.page.getByRole("button", {
        name: t("ui.review"),
        exact: true,
      });
      if (await review.isVisible()) {
        await review.click();
      }
      await fixtures.page
        .getByRole("button", { name: t("ui.matchRow"), exact: true })
        .first()
        .click();
      await fixtures.page
        .getByRole("button", { name: t("ui.matchAction"), exact: true })
        .waitFor();
      await saveWorkflowScreenshots(
        fixtures,
        "bank-review-before-confirmation",
      );
      const submitted = await fixtures.capture(match.POST, () =>
        fixtures.page
          .getByRole("button", { name: t("ui.matchAction"), exact: true })
          .click(),
      );
      expect(submitted.response).toMatchObject({
        success: true,
        data: { matchedJournalLineId: bankLeg.id },
      });
      const [saved] = await db
        .select()
        .from(bankStatementLines)
        .where(eq(bankStatementLines.id, line.id));
      expect(saved?.matchedJournalLineId).toBe(bankLeg.id);
      expect(saved?.matchedAt).toBeInstanceOf(Date);
      expect(
        await db
          .select()
          .from(journalEntries)
          .where(eq(journalEntries.companyId, companyId)),
      ).toHaveLength(1);
    },
  );
});
