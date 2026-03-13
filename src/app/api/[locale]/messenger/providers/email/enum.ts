/**
 * Email Provider Enums
 * SMTP/IMAP-specific configuration enums used only by the email provider.
 * Lives here (inside providers/email/) to keep protocol-specific types out of
 * the unified messenger accounts layer.
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "../../accounts/i18n";

/**
 * SMTP Security Type
 * TLS/SSL/STARTTLS negotiation mode for outbound SMTP connections.
 */
export const {
  enum: EmailSecurityType,
  options: EmailSecurityTypeOptions,
  Value: EmailSecurityTypeValue,
} = createEnumOptions(scopedTranslation, {
  NONE: "enums.securityType.none",
  TLS: "enums.securityType.tls",
  SSL: "enums.securityType.ssl",
  STARTTLS: "enums.securityType.starttls",
});

export const EmailSecurityTypeDB = [
  EmailSecurityType.NONE,
  EmailSecurityType.TLS,
  EmailSecurityType.SSL,
  EmailSecurityType.STARTTLS,
] as const;

/**
 * IMAP Auth Method
 * Authentication mechanism for inbound IMAP connections.
 */
export const {
  enum: EmailImapAuthMethod,
  options: EmailImapAuthMethodOptions,
  Value: EmailImapAuthMethodValue,
} = createEnumOptions(scopedTranslation, {
  PLAIN: "enums.imapAuthMethod.plain",
  OAUTH2: "enums.imapAuthMethod.oauth2",
  XOAUTH2: "enums.imapAuthMethod.xoauth2",
});

export const EmailImapAuthMethodDB = [
  EmailImapAuthMethod.PLAIN,
  EmailImapAuthMethod.OAUTH2,
  EmailImapAuthMethod.XOAUTH2,
] as const;
