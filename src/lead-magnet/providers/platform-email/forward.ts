import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import React from "react";

import type { ForwardLeadFn } from "../types";
import { scopedTranslation } from "./i18n";
import type { LeadNotificationEmailProps } from "./lead-notification.email";

export const forwardLead: ForwardLeadFn = async (
  credentials,
  lead,
  t,
  locale,
) => {
  const { notifyEmail, notifyEmailName } = credentials;
  const { firstName, email } = lead;

  if (!notifyEmail) {
    return success(undefined);
  }

  const capturedAt = new Date().toISOString();
  const skillId = lead.listId ?? "unknown";

  const { EmailSendingRepository } =
    await import("@/messenger/providers/email/smtp-client/email-sending/repository");
  const { LeadNotificationEmail } = await import("./lead-notification.email");
  const { CampaignType } = await import("@/messenger/accounts/enum");

  const { t: emailT } = scopedTranslation.scopedT(locale);

  const props: LeadNotificationEmailProps = {
    firstName,
    email,
    skillId,
    toName: notifyEmailName ?? "Creator",
    capturedAt,
    locale,
  };

  const jsx = React.createElement(LeadNotificationEmail, props);

  const { createEndpointLogger } = await import("next-vibe/logger/server");
  const logger = createEndpointLogger(false, locale);

  const result = await EmailSendingRepository.sendEmail(
    {
      jsx,
      subject: `${emailT("previewPrefix")} ${firstName} ${emailT("previewSuffix")}`,
      toEmail: notifyEmail,
      toName: notifyEmailName ?? "Creator",
      locale,
      campaignType: CampaignType.TRANSACTIONAL,
      skipRateLimitCheck: true,
    },
    logger,
    locale,
  );

  if (!result.success) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  return success(undefined);
};
