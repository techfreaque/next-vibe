import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe } from "vitest";

import { SYSTEM_SETTINGS_ALIAS } from "./constants";
import type { SystemSettingsGetResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

const SETTINGS_PAGE = `/tools/${SYSTEM_SETTINGS_ALIAS}`;
const { t } = scopedTranslation.scopedT(E2E_LOCALE);
const settings: SystemSettingsGetResponseOutput = {
  modules: [],
  wizardSteps: [
    { step: 1, group: "admin", fields: [] },
    { step: 2, group: "security", fields: [] },
  ],
  isWritable: false,
  isDevMode: true,
  needsOnboarding: false,
  onboardingIssues: [],
};

describe("E2E: system settings wizard", () => {
  const e2e = useE2E("vibe/env/settings/wizard");

  e2e.it(
    "resumes a saved step after reload and stays closed after going to chat",
    async ({ gotoReady, loginAs, page }) => {
      await loginAs(await resolveTestAdminUser());
      await page.route("**/api/*/vibe/env/settings*", (route) =>
        route.fulfill({ json: { success: true, data: settings } }),
      );

      const openWizard = page.getByRole("button", {
        name: t("widget.restartWizard"),
        exact: true,
      });
      const readOnlyBanner = page.getByText(t("widget.readOnlyBanner"));
      const next = page.getByRole("button", {
        name: t("wizard.next"),
        exact: true,
      });
      const finish = page.getByRole("button", { name: t("wizard.finish") });

      await gotoReady(SETTINGS_PAGE, () => readOnlyBanner.waitFor());
      await openWizard.click();
      await next.click();
      await finish.waitFor();

      await gotoReady(SETTINGS_PAGE, () => finish.waitFor());
      await finish.click();
      await page.getByRole("link", { name: t("wizard.startChatting") }).click();
      await page.waitForURL("**/threads/private/new");

      await gotoReady(SETTINGS_PAGE, () => readOnlyBanner.waitFor());
      await openWizard.click();
      await next.waitFor();
    },
  );
});
