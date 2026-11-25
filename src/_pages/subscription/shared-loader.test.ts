import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { SubscriptionRepository } from "@/subscription/repository";

import { subscriptionLoader } from "./shared-loader";

const user: JwtPrivatePayloadType = {
  id: "00000000-0000-4000-8000-000000000001",
  leadId: "00000000-0000-4000-8000-000000000002",
  roles: [UserPermissionRole.CUSTOMER],
  isPublic: false,
};
const callbackToken = "00000000-0000-4000-8000-000000000003";

describe("subscription success redirects", () => {
  const auth = spyOn(AuthRepository, "getAuthMinimalUser").mockResolvedValue(
    user,
  );
  const nowPayments = spyOn(
    SubscriptionRepository,
    "handleNowPaymentsSuccessRedirect",
  ).mockResolvedValue(undefined);

  afterEach(() => {
    auth.mockClear();
    nowPayments.mockClear();
  });

  it.each(["cs_live_fixture", "cs_test_fixture"])(
    "leaves Stripe Checkout Session %s to the Stripe webhook",
    async (sessionId) => {
      const page = await subscriptionLoader({
        locale: "en-US",
        searchParams: {
          cbtoken: callbackToken,
          payment: "success",
          type: "subscription",
          session_id: sessionId,
        },
      });

      expect(page.user).toEqual(user);
      expect(nowPayments).not.toHaveBeenCalled();
    },
  );

  it("processes a NOWPayments subscription callback without a Stripe session", async () => {
    await subscriptionLoader({
      locale: "en-US",
      searchParams: {
        cbtoken: callbackToken,
        payment: "success",
        type: "subscription",
      },
    });

    expect(nowPayments).toHaveBeenCalledWith(
      callbackToken,
      user.id,
      "en-US",
      expect.anything(),
    );
  });
});
