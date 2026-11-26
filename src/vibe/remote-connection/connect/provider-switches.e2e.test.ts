import { mkdir } from "node:fs/promises";
import { SYNC_DOMAINS } from "@/vibe/realtime/core/sync-domain";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { scopedTranslation as providerTranslation } from "../sync/providers/i18n";
import { scopedTranslation as connectTranslation } from "./i18n";

describe("remote connection provider switches", () => {
  const e2e = useE2E("remote-connect-switches");
  for (const [language, locale] of [
    ["en", "en-GLOBAL"],
    ["de", "de-DE"],
    ["sk", "sk-SK"],
  ] as const) {
    e2e.it(
      `names each provider and retains independent keyboard choices in ${language}`,
      async (fixtures) => {
        const { page } = fixtures;
        await fixtures.loginAs(await resolveTestAdminUser());
        const { t } = providerTranslation.scopedT(locale);
        const providers = SYNC_DOMAINS.map((key) => ({
          key,
          label: String(t(`providers.${key}`)),
          description: String(t(`providerDescriptions.${key}`)),
        }));
        let submitted = false;
        await page.route(
          /\/api\/[^/]+\/vibe\/remote-connection\/connect$/,
          async (route) => {
            submitted = true;
            await route.abort();
          },
        );
        await page.route(
          /\/api\/[^/]+\/vibe\/remote-connection\/sync\/providers$/,
          async (route) => {
            await route.fulfill({
              json: { success: true, data: { providers } },
            });
          },
        );
        await fixtures.goto("/tools/remote-connect", locale);

        const controls = providers.map(({ label }) =>
          page.getByRole("switch", { name: label, exact: true }),
        );
        const [first, second] = controls;
        expect(first && second).toBeDefined();
        if (!first || !second) {
          return;
        }
        await first.waitFor();
        const form = first.locator("xpath=ancestor::form[1]");
        expect(await form.count()).toBe(1);
        expect(
          await form.getByRole("switch", { name: "", exact: true }).count(),
        ).toBe(0);
        expect(
          await form.getByRole("button", { name: "", exact: true }).count(),
        ).toBe(0);
        for (const control of controls) {
          expect(await control.count()).toBe(1);
        }
        const readChoices = (): Promise<(string | null)[]> =>
          Promise.all(
            controls.map((control) => control.getAttribute("aria-checked")),
          );
        const original = await readChoices();
        await first.focus();
        await page.keyboard.press("Space");
        const firstChanged = [
          original[0] === "true" ? "false" : "true",
          ...original.slice(1),
        ];
        expect(await readChoices()).toEqual(firstChanged);
        await page.keyboard.press("Tab");
        expect(
          await second.evaluate(
            (node) => node === node.ownerDocument.activeElement,
          ),
        ).toBe(true);
        await page.keyboard.press("Space");
        expect(await readChoices()).toEqual([
          firstChanged[0],
          original[1] === "true" ? "false" : "true",
          ...original.slice(2),
        ]);
        await first.locator("xpath=..").locator("label").click();
        expect(await readChoices()).toEqual([
          original[0],
          original[1] === "true" ? "false" : "true",
          ...original.slice(2),
        ]);
        expect(submitted).toBe(false);

        const { t: connectT } = connectTranslation.scopedT(locale);
        const section = page
          .getByText(connectT("post.syncScope.label"), {
            exact: true,
          })
          .locator("xpath=../../..");
        const directory = "scratchpad/erp/shots/v2/instances";
        await mkdir(directory, { recursive: true });
        for (const [device, width, height] of [
          ["desktop", 1440, 900],
          ["phone", 390, 844],
        ] as const) {
          await page.setViewportSize({ width, height });
          for (const theme of ["light", "dark"] as const) {
            await page.emulateMedia({ colorScheme: theme });
            await page.locator("html").evaluate((root, mode) => {
              root.classList.remove("light", "dark");
              root.classList.add(mode);
              root.style.colorScheme = mode;
            }, theme);
            expect(
              await page
                .locator("html")
                .evaluate((root) => getComputedStyle(root).colorScheme),
            ).toBe(theme);
            await section.screenshot({
              animations: "disabled",
              path: `${directory}/remote-connect-provider-switches-${language}-${device}-${theme}.png`,
            });
          }
        }
      },
    );
  }
});
