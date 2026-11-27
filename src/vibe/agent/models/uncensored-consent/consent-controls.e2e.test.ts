import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { UNCENSORED_CONSENT_VERSION } from "./constants";
import definition from "./definition";

describe("E2E: uncensored model consent controls", () => {
  const e2e = useE2E("models/uncensored-consent");

  for (const locale of ["en-US", "de-DE"] as const) {
    e2e.it(`persists and withdraws consent in ${locale}`, async (fixture) => {
      const { page } = fixture;
      const created = await createTestUser(fixture.uniqueEmail("consent"));
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }
      const { user } = created.data;
      fixture.cleanup(() => deleteTestUser(user.id));
      await authAtlas(fixture, user);

      const agree = page.getByTestId("uncensored-consent-unlock");
      const withdraw = page.getByTestId("uncensored-consent-withdraw");
      await fixture.goto(`/tools/uncensored-consent`, locale);
      await agree.waitFor();
      await saveAdminReviewScreenshots(page, "uncensored-consent", locale);

      await fixture.goto(`/tools/uncensored-consent-agree`, locale);
      await agree.waitFor();
      await saveAdminReviewScreenshots(
        page,
        "uncensored-consent-agree",
        locale,
      );
      const agreed = await fixture.capture(definition.POST, () =>
        agree.click(),
      );
      expect(agreed.requestBody).toMatchObject({ confirm: true });
      expect(agreed.response).toMatchObject({
        success: true,
        data: { consented: true },
      });
      await withdraw.waitFor();
      const [afterAgree] = await db
        .select({ version: users.uncensoredConsentVersion })
        .from(users)
        .where(eq(users.id, user.id));
      expect(afterAgree?.version).toBe(UNCENSORED_CONSENT_VERSION);

      await fixture.goto(`/tools/uncensored-consent-withdraw`, locale);
      await withdraw.waitFor();
      await saveAdminReviewScreenshots(
        page,
        "uncensored-consent-withdraw",
        locale,
      );
      const withdrawn = await fixture.capture(definition.DELETE, () =>
        withdraw.click(),
      );
      expect(withdrawn.response).toMatchObject({
        success: true,
        data: { consented: false },
      });
      await agree.waitFor();
      const [afterWithdraw] = await db
        .select({ at: users.uncensoredConsentAt })
        .from(users)
        .where(eq(users.id, user.id));
      expect(afterWithdraw?.at).toBeNull();
    });
  }
});
