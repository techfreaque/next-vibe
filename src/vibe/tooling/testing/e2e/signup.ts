import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { Locator, Page } from "playwright";
import { expect } from "vitest";

import { LEAD_ID_COOKIE_NAME } from "@/env/constants";
import definition from "@/user/public/signup/definition";
import { scopedTranslation } from "@/user/public/signup/i18n";
import { SignupRepository } from "@/user/public/signup/repository";

/** Route the browser's initial submission through the repository with a local
 * mailbox. The subsequent code submission and session cookie use the live API. */
export async function submitAndConfirmSignup(
  page: Page,
  submit: Locator,
): Promise<void> {
  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);
  const leadCookie = (await page.context().cookies()).find(
    (cookie) => cookie.name === LEAD_ID_COOKIE_NAME,
  );
  if (!leadCookie) {
    return expect.fail("Expected the visitor's lead cookie before signup");
  }
  let code = "";
  await page.route(
    (url) => url.pathname.endsWith("/user/public/signup"),
    async (route) => {
      const data = definition.POST.requestSchema.safeParse(
        route.request().postDataJSON(),
      );
      if (!data.success || route.request().method() !== "POST") {
        return route.fallback();
      }
      const result = await SignupRepository.registerUser(
        data.data,
        {
          isPublic: true,
          leadId: leadCookie.value,
          roles: [UserPermissionRole.PUBLIC],
        },
        defaultLocale,
        logger,
        Platform.NEXT_API,
        t,
        undefined,
        async (recipient, challenge) => {
          code = challenge.code;
          return `test-mailbox-${recipient.leadId}`;
        },
        async () => "ok",
      );
      await route.fulfill({ json: result, status: result.success ? 200 : 400 });
    },
    { times: 1 },
  );
  await submit.click();
  const input = page.locator("#signup-confirm-input");
  await input.waitFor();
  await input.fill(code);
  await page
    .getByRole("button", { name: t("confirmation.confirm"), exact: true })
    .click();
  await page.waitForURL((url) => !url.pathname.endsWith("/user/signup"), {
    waitUntil: "commit",
  });
}
