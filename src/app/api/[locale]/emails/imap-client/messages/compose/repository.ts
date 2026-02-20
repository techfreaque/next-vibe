/**
 * Compose Email Repository
 * Sends email via the first available active SMTP account
 */

import "server-only";

import { desc, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { smtpAccounts } from "../../../smtp-client/db";
import { SmtpAccountStatus, SmtpSecurityType } from "../../../smtp-client/enum";
import type { ComposeEmailResponseOutput } from "./definition";

interface ComposeEmailData {
  to: string;
  toName?: string;
  subject: string;
  body: string;
}

export async function sendComposedEmail(
  data: ComposeEmailData,
  logger: EndpointLogger,
): Promise<ResponseType<ComposeEmailResponseOutput>> {
  try {
    logger.debug("Composing email", { to: data.to, subject: data.subject });

    // Get any active SMTP account (prefer default)
    const accounts = await db
      .select()
      .from(smtpAccounts)
      .where(eq(smtpAccounts.status, SmtpAccountStatus.ACTIVE))
      .orderBy(desc(smtpAccounts.isDefault), desc(smtpAccounts.priority))
      .limit(1);

    if (accounts.length === 0) {
      return fail({
        message:
          "app.api.emails.imapClient.messages.compose.post.errors.notFound.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: {},
      });
    }

    const account = accounts[0];

    const transportConfig: SMTPTransport.Options = {
      host: account.host,
      port: account.port,
      secure: account.securityType === SmtpSecurityType.SSL,
      auth: {
        user: account.username,
        pass: account.password,
      },
    };

    if (account.securityType === SmtpSecurityType.STARTTLS) {
      transportConfig.requireTLS = true;
    }

    const transport = createTransport(transportConfig);

    const toAddress = data.toName ? `${data.toName} <${data.to}>` : data.to;

    const fromAddress = account.name
      ? `${account.name} <${account.fromEmail}>`
      : account.fromEmail;

    const info = await transport.sendMail({
      from: fromAddress,
      to: toAddress,
      subject: data.subject,
      text: data.body,
    });

    logger.info("Email sent successfully", {
      messageId: info.messageId,
      to: data.to,
      accountId: account.id,
    });

    return success({
      sent: true,
      messageId: info.messageId,
    });
  } catch (err) {
    logger.error("Failed to send composed email", parseError(err));
    return fail({
      message:
        "app.api.emails.imapClient.messages.compose.post.errors.server.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: { error: parseError(err).message },
    });
  }
}
