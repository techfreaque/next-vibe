/**
 * E2E: growth attribution survives guest → signup.
 * A visitor lands with UTMs (first touch), comes back through another tagged
 * link (last touch), then signs up: the new user owns the journey with both
 * touches intact and the signup step stamped.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { eq } from "drizzle-orm";
import { describe, expect } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";

import signupEndpoints from "@/user/public/signup/definition";
import userDeleteDefinitions from "@/users/user/[id]/definition";

import { growthJourneys } from "./db";
import { ChannelType } from "./enum";

const PASSWORD = "E2eSecurePass123";

async function findUserId(email: string): Promise<string | null> {
  const logger = createEndpointLogger(false, defaultLocale);
  const found = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  return found.success && found.data ? found.data.id : null;
}

async function deleteUserAndJourney(email: string): Promise<void> {
  const userId = await findUserId(email);
  if (!userId) {
    return;
  }
  await db.delete(growthJourneys).where(eq(growthJourneys.userId, userId));
  await sendTestRequest({
    endpoint: userDeleteDefinitions.DELETE,
    urlPathParams: { id: userId },
    user: await resolveTestAdminUser(),
    toolExecutionContext: undefined,
  });
}

describe("E2E: growth attribution", () => {
  const e2e = useE2E("leads/growth/attribution");

  e2e.it(
    "a visitor's first and last touch carry through signup to the user",
    async ({ goto, open, page, uniqueEmail, cleanup }) => {
      const email = uniqueEmail("growth");
      cleanup(() => deleteUserAndJourney(email));
      const run = email.split("@")[0] ?? "run";

      // First touch: lands from a Reddit campaign
      await goto(
        `/story?utm_source=E2E-Reddit&utm_medium=social&utm_campaign=growth-${run}&utm_content=top&secret=drop-me`,
      );
      // Later visit through a second tagged link: moves only the last touch
      await goto(`/story?utm_source=e2e-youtube&utm_campaign=second-${run}`);

      const form = await open(signupEndpoints.POST, { path: "/user/signup" });
      await form.fill({
        privateName: "E2E Growth",
        publicName: "E2EGrowth",
        email,
        password: PASSWORD,
        confirmPassword: PASSWORD,
        subscribeToNewsletter: false,
        acceptTerms: true,
      });
      const result = await form.submit();
      expect(result.sent).toBe(true);
      if (!result.sent) return;
      expect(result.response.success, JSON.stringify(result.response)).toBe(
        true,
      );
      await page.waitForURL((url) => !url.pathname.endsWith("/user/signup"));

      const userId = await findUserId(email);
      expect(userId).not.toBe(null);
      if (!userId) return;

      const [journey] = await db
        .select()
        .from(growthJourneys)
        .where(eq(growthJourneys.userId, userId))
        .limit(1);
      expect(journey, "user inherits a growth journey").toBeDefined();
      if (!journey) return;

      // First touch: set on the first visit, never overwritten
      expect(journey.firstSource).toBe("e2e-reddit");
      expect(journey.firstMedium).toBe("social");
      expect(journey.firstCampaign).toBe(`growth-${run}`);
      expect(journey.firstContent).toBe("top");
      expect(journey.firstChannel).toBe("e2e-reddit");
      expect(journey.firstChannelType).toBe(ChannelType.CAMPAIGN);
      // Landing path stored without the query string
      expect(journey.firstLandingPath).toBe(`/${E2E_LOCALE}/story`);

      // Last touch: the later tagged visit
      expect(journey.lastSource).toBe("e2e-youtube");
      expect(journey.lastCampaign).toBe(`second-${run}`);
      expect(journey.lastMedium).toBe(null);

      // Funnel: signup stamped on the journey
      expect(journey.signedUpAt).not.toBe(null);
      expect(journey.firstPaidAt).toBe(null);
    },
  );
});
