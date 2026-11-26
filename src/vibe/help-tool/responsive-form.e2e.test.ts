import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { accountNodes, journalEntries } from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  LineType,
} from "@/chart-of-accounts/enum";
import { scopedTranslation } from "@/chart-of-accounts/i18n";
import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

describe("Admin shell responsive forms", () => {
  const e2e = useE2E("admin-responsive-form");

  e2e.it(
    "preserves an unsaved journal form when moving between desktop and phone",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      const { companyId } = await prepareAtlasCompany(
        fixtures,
        "E2E Responsive Journal Company",
      );
      await db.insert(accountNodes).values({
        companyId,
        code: "1010",
        name: "E2E Settlement Bank",
        type: AccountType.ASSET,
        subtype: AccountSubtype.BANK,
      });
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      const url = new URL(`/${E2E_LOCALE}/tools/coa-journal-create`, baseUrl);
      url.searchParams.set("arg.companyId", companyId);
      const writeRequests: string[] = [];
      page.on("request", (request) => {
        if (
          request.method() === "POST" &&
          new URL(request.url()).pathname.endsWith(
            "/chart-of-accounts/journal/create",
          )
        ) {
          writeRequests.push(request.method());
        }
      });

      await page.setViewportSize({ width: 1440, height: 900 });
      let response = await page.goto(url.toString(), {
        waitUntil: "domcontentloaded",
      });
      for (let retry = 0; response?.status() === 503 && retry < 3; retry++) {
        await Bun.sleep(5000);
        response = await page.reload({ waitUntil: "domcontentloaded" });
      }
      expect(response?.status()).toBe(200);
      const panel = page
        .locator("#admin-tool-coa-journal-create [data-hydrated]")
        .last();
      const description = panel.locator('input[name="description"]');
      await description.fill("Unsaved resize fixture");
      await panel
        .getByRole("button", {
          name: t("journalCreate.widget.addLine"),
          exact: true,
        })
        .click();
      const debit = panel.getByRole("textbox", {
        name: t(LineType.DEBIT),
        exact: true,
      });
      await debit.fill("32.125");
      await debit.press("Tab");
      expect(await debit.inputValue()).toBe("32.13");
      await description.evaluate((input) =>
        input.setAttribute("data-resize-original", "true"),
      );

      for (const viewport of [
        { width: 390, height: 844 },
        { width: 1440, height: 900 },
      ]) {
        await page.setViewportSize(viewport);
        await page.waitForFunction(
          (width) => innerWidth === width,
          viewport.width,
        );
        await page.evaluate(
          () =>
            new Promise((ready) =>
              requestAnimationFrame(() => requestAnimationFrame(ready)),
            ),
        );
        expect(await description.inputValue()).toBe("Unsaved resize fixture");
        expect(await description.getAttribute("data-resize-original")).toBe(
          "true",
        );
        expect(await debit.inputValue()).toBe("32.13");
      }

      await debit.focus();
      expect(await debit.inputValue()).toBe("32.125");
      expect(writeRequests).toEqual([]);
      expect(
        await db
          .select({ id: journalEntries.id })
          .from(journalEntries)
          .where(eq(journalEntries.companyId, companyId)),
      ).toEqual([]);
    },
  );
});
