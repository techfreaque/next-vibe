import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companies } from "@/companies/db";

import { posFiscalProviders } from "../db";
import { FiscalAdapter, FiscalDeviceKind } from "../enum";
import definition from "./definition";

const locale = "en-US";

describe("POS fiscal settings on Atlas", () => {
  const e2e = useE2E("pos/fiscal/settings");
  const { t } = definition.POST.scopedTranslation.scopedT(locale);

  e2e.it(
    "saves the sandbox device and keeps fiscal sales blocked",
    async (fixtures) => {
      const { page, goto, capture } = fixtures;
      const { companyId } = await prepareAtlasCompany(
        fixtures,
        "Carpathian Retail Workshop",
      );
      await db
        .update(companies)
        .set({ country: "SK" })
        .where(eq(companies.id, companyId));
      const view = page.locator("#admin-tool-pos-fiscal-settings-save");
      const provider = view.getByRole("combobox", { name: t("adapter") });
      const code = "88812345678900001";
      await goto(
        `/tools/pos-fiscal-settings-save?arg.companyId=${companyId}`,
        locale,
      );
      await provider.waitFor();
      await provider.click();
      await page
        .getByRole("option", { name: t(FiscalAdapter.SANDBOX), exact: true })
        .click();
      await view
        .getByRole("textbox", { name: t("cashRegisterCode") })
        .fill(code);
      await saveAdminReviewScreenshots(
        page,
        "pos-fiscal-settings-save",
        locale,
      );
      const saved = await capture(definition.POST, () =>
        view
          .getByRole("button", { name: t("widget.save"), exact: true })
          .click(),
      );
      expect(saved.response).toMatchObject({
        success: true,
        data: { saved: true, blocked: true, required: true },
      });
      await view
        .getByText(t("widget.savedTitle"), { exact: true })
        .first()
        .waitFor();
      const [providerRecord] = await db
        .select()
        .from(posFiscalProviders)
        .where(eq(posFiscalProviders.companyId, companyId));
      expect(providerRecord).toMatchObject({
        cashRegisterCode: code,
        adapter: FiscalAdapter.SANDBOX,
        deviceKind: FiscalDeviceKind.ORP,
        isEnabled: false,
      });
    },
    75_000,
  );
});
