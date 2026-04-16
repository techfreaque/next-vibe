import React from "react";
import { success } from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";
import type { LeadNotificationEmailProps } from "./lead-notification.email";

export const forwardLead: ForwardLeadFn = async (credentials, lead) => {
  const { notifyEmail, notifyEmailName } = credentials;
  const { firstName, email } = lead;

  if (!notifyEmail) {
    return success(undefined);
  }

  const capturedAt = new Date().toISOString();
  const skillId = lead.listId ?? "unknown";

  const { EmailSendingRepository } =
    await import("@/app/api/[locale]/messenger/providers/email/smtp-client/email-sending/repository");
  const { LeadNotificationEmail } = await import("./lead-notification.email");
  const { CampaignType } =
    await import("@/app/api/[locale]/messenger/accounts/enum");

  const props: LeadNotificationEmailProps = {
    firstName,
    email,
    skillId,
    toName: notifyEmailName ?? "Creator",
    capturedAt,
  };

  const jsx = React.createElement(LeadNotificationEmail, props);

  const { createEndpointLogger } =
    await import("@/app/api/[locale]/system/unified-interface/shared/logger/server-logger");
  const logger = createEndpointLogger(false, Date.now(), "en-GLOBAL");

  await EmailSendingRepository.sendEmail(
    {
      jsx,
      subject: `New lead: ${firstName} signed up via your skill`,
      toEmail: notifyEmail,
      toName: notifyEmailName ?? "Creator",
      locale: "en-GLOBAL",
      campaignType: CampaignType.TRANSACTIONAL,
      skipRateLimitCheck: true,
    },
    logger,
    "en-GLOBAL",
  );

  return success(undefined);
};
