/**
 * E2E: contact form as embedded on the framework story page.
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import contactEndpoints from "./definition";
import { ContactPriority, ContactSubject } from "./enum";

const endpoint = contactEndpoints.POST;
const CONTACT_PAGE = "/story/framework";

describe("E2E: contact form", () => {
  const e2e = useE2E("contact");

  e2e.it("sends a message with subject and priority picked from the dropdowns", async ({ open, uniqueEmail }) => {
    const form = await open(endpoint, { path: CONTACT_PAGE });
    await form.fill({
      name: "E2E Contact",
      email: uniqueEmail("contact"),
      subject: ContactSubject.FEATURE_REQUEST,
      message: "End-to-end test message. Please ignore — sent by the E2E suite.",
      priority: ContactPriority.HIGH,
    });

    // submit() also asserts the request body carries both enum values
    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) return;
    expect(result.response.success, JSON.stringify(result.response)).toBe(true);
  });

  e2e.it("flags a message that is too short before sending", async ({ open, uniqueEmail }) => {
    const form = await open(endpoint, { path: CONTACT_PAGE });
    await form.fill({
      name: "E2E Contact",
      email: uniqueEmail("contact-short"),
      message: "short",
    });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(result.blockedBy).toBe("app");
    expect(Object.keys(result.fieldErrors)).toEqual(["message"]);
  });
});
