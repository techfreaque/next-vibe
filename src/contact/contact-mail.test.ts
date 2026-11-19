import { render } from "@react-email/render";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { describe, expect, it, vi } from "vitest";

import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";

import definition, { type ContactRequest } from "./definition";
import { contactFormEmailTemplate } from "./email";
import { ContactSubject } from "./enum";
import { scopedTranslation } from "./i18n";
import { ContactRepository } from "./repository";

const user: JWTPublicPayloadType = {
  isPublic: true,
  leadId: "25d33ae5-5be3-4ad2-9147-beff62f30305",
  roles: [UserPermissionRole.PUBLIC],
};
const requestData: ContactRequest = {
  name: "Test User",
  email: "sender@example.org",
  subject: ContactSubject.BUG_REPORT,
  message: "The signup screen is stuck.",
};
const localizedSubjects: [CountryLanguage, string][] = [
  ["en-US", "Bug Report"],
  ["de-DE", "Fehlerbericht"],
  ["pl-PL", "Zgłoszenie błędu"],
  ["fr-FR", "Signaler un bug"],
];

describe("contact mail", () => {
  it.each(localizedSubjects)(
    "renders a localized subject and message in %s",
    async (locale, subject) => {
      const { t } = scopedTranslation.scopedT(locale);
      const result = await contactFormEmailTemplate.render({
        requestData,
        responseData: {
          success: t("response.success"),
        },
        urlPathParams: undefined,
        user,
        t,
        locale,
        logger: createEndpointLogger(false, locale),
        tracking: createTrackingContext(locale),
      });
      expect(result.success).toBe(true);
      if (!result.success || "skip" in result.data) {
        return expect.fail("Expected a rendered contact notification");
      }
      expect(result.data.subject).toContain(subject);
      const html = await render(result.data.jsx);
      expect(html).toContain(subject);
      expect(html).toContain(requestData.message);
      expect(html).not.toContain(ContactSubject.BUG_REPORT);
    },
  );

  it.each(["", "   \t\n", "\u200B\u200C\u200D\uFEFF\u2060".repeat(3)])(
    "rejects invisible-only submissions and logs the rejection",
    async (message) => {
      expect(
        definition.POST.requestSchema.safeParse({ ...requestData, message })
          .success,
      ).toBe(true);
      const locale = "en-US";
      const { t } = scopedTranslation.scopedT(locale);
      const logger = createEndpointLogger(false, locale);
      const warn = vi.spyOn(logger, "warn");
      const result = await ContactRepository.submitContactForm(
        { ...requestData, message },
        user,
        locale,
        logger,
        t,
      );
      expect(result.success).toBe(false);
      expect(!result.success && result.errorType).toBe(
        ErrorResponseTypes.VALIDATION_ERROR,
      );
      expect(!result.success && result.message).toBe(
        t("errors.validation.messageEmpty"),
      );
      expect(warn).toHaveBeenCalledWith(
        "Rejected contact form submission with an empty message",
        {
          leadId: user.leadId,
          subject: requestData.subject,
        },
      );
    },
  );

  it("keeps field validation for visible messages shorter than 10 characters", () => {
    const result = definition.POST.requestSchema.safeParse({
      ...requestData,
      message: "short",
    });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues[0]?.code).toBe("too_small");
  });
});
