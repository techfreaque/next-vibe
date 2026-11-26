import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import {
  type E2EFixtures,
  useE2E,
} from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import {
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { taxRates } from "../db";
import { TaxType } from "../enum";
import list from "./list/definition";

async function prepareRateCompany(
  fixtures: E2EFixtures,
): Promise<string | undefined> {
  let ownerId: string | undefined;
  fixtures.cleanup(async () => {
    if (ownerId) await deleteTestUser(ownerId);
  });
  const owner = await createTestUser(fixtures.uniqueEmail("tax-rate-owner"));
  expect(owner.success).toBe(true);
  if (!owner.success) return;
  ownerId = owner.data.user.id;
  await db
    .insert(userRoles)
    .values({ userId: ownerId, role: UserRole.ADMIN })
    .onConflictDoNothing();
  const { companyId } = await prepareAtlasCompany(
    fixtures,
    "E2E Tax Editor Company",
    {
      ...owner.data.user,
      roles: [UserRole.ADMIN],
    },
  );
  fixtures.cleanup(async () => {
    await db.delete(taxRates).where(eq(taxRates.companyId, companyId));
  });
  return companyId;
}

describe("Tax rate editor", () => {
  const e2e = useE2E("tax/rate-edit");
  e2e.it(
    "rejects unsupported precision and stores a valid fraction through HTTP",
    async (fixtures) => {
      const companyId = await prepareRateCompany(fixtures);
      if (!companyId) return;
      const request = {
        companyId,
        taxName: "E2E Regional VAT",
        taxCode: "FIXTURE",
        type: TaxType.VAT,
        rate: 0.2,
        country: "DE",
      };
      const invalid = await postAtlas(fixtures, "tax/rate/create", {
        ...request,
        rate: 0.12345,
      });
      expect(invalid.status).toBe(400);
      expect(
        await db
          .select({ id: taxRates.id })
          .from(taxRates)
          .where(eq(taxRates.companyId, companyId)),
      ).toEqual([]);
      expect((await postAtlas(fixtures, "tax/rate/create", request)).ok).toBe(
        true,
      );
      const [created] = await db
        .select()
        .from(taxRates)
        .where(eq(taxRates.companyId, companyId));
      expect(created?.rate).toBe(0.2);
    },
  );
  e2e.it(
    "opens a saved rate, edits its percentage and reloads it across locales",
    async (fixtures) => {
      const companyId = await prepareRateCompany(fixtures);
      if (!companyId) return;
      const taxName = "E2E Regional VAT";
      const [stored] = await db
        .insert(taxRates)
        .values({
          companyId,
          name: taxName,
          code: "FIXTURE",
          type: TaxType.VAT,
          country: "DE",
          rate: 0.2,
        })
        .returning();
      const page = fixtures.page;
      await page.setViewportSize({ width: 390, height: 844 });
      const name = page.getByRole("button", {
        name: taxName,
        exact: true,
      });
      let listStatus: number | undefined;
      page.on("response", (response) => {
        if (new URL(response.url()).pathname.endsWith("/tax/rate/list"))
          listStatus = response.status();
      });
      await fixtures.open(list.GET, {
        query: { "arg.companyId": companyId },
        ready: async () => {
          const retry = page.getByRole("button", {
            name: "Try again",
            exact: true,
          });
          for (let attempt = 0; attempt < 3; attempt++) {
            await name.or(retry).first().waitFor({ timeout: 12000 });
            if (await name.isVisible()) return;
            expect([500, 503]).toContain(listStatus);
            await retry.click();
            await retry
              .waitFor({ state: "hidden", timeout: 5000 })
              .catch(() => undefined);
          }
          await name.waitFor();
        },
      });
      await name.click();
      const rate = page.getByRole("textbox", { name: "Rate", exact: true });
      await rate.waitFor();
      await page.waitForFunction(
        () =>
          document.querySelector<HTMLInputElement>('input[name="rate"]')
            ?.value === "20",
      );
      expect(await rate.inputValue()).toBe("20");
      await rate.click();
      await rate.press("ControlOrMeta+a");
      await rate.pressSequentially("5.5");
      expect(await rate.inputValue()).toBe("5.5");
      await rate.blur();
      expect(await rate.inputValue()).toBe("5.5");
      const response = page.waitForResponse(
        (r) =>
          r.request().method() === "PATCH" &&
          new URL(r.url()).pathname.endsWith(`/tax/rate/${stored.id}/update`),
      );
      await page
        .getByRole("button", { name: "Save tax rate", exact: true })
        .click();
      expect((await response).ok()).toBe(true);
      const [updated] = await db
        .select()
        .from(taxRates)
        .where(eq(taxRates.id, stored.id));
      expect(updated).toMatchObject({ name: taxName, rate: 0.055 });
      await page
        .getByText("5.5%", { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
      await name.click();
      await page.waitForFunction(
        () =>
          document.querySelector<HTMLInputElement>('input[name="rate"]')
            ?.value === "5.5",
      );
      expect(await rate.inputValue()).toBe("5.5");
      if (process.env["ERP_TAX_VISUALS"] === "1") {
        const editUrl = new URL(page.url());
        for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
          editUrl.pathname = editUrl.pathname.replace(
            /^\/[^/]+\//,
            `/${locale}/`,
          );
          await page.goto(editUrl.href, { waitUntil: "domcontentloaded" });
          await page.waitForFunction(() => {
            const input =
              document.querySelector<HTMLInputElement>('input[name="rate"]');
            return input?.value.replace(",", ".") === "5.5";
          });
          await saveAdminViewMatrix(
            page,
            "tax",
            `tax-rate-edit-verified-${locale.slice(0, 2)}`,
          );
        }
      }
    },
    120_000,
  );
});
