/**
 * System Mailbox Config Resolution
 * Pure function: merges env (source of truth for credentials) with the
 * admin-designated `messenger_accounts` row (isSystem = true).
 * Env wins for every value it sets; the row fills the gaps. The password is
 * only ever read from env or from the row - it is never returned by endpoints.
 */

import type { MessengerAccount } from "../accounts/db";

export const SYSTEM_MAILBOX_SMTP_PORT = 465;
export const SYSTEM_MAILBOX_IMAP_PORT = 993;
export const SYSTEM_MAILBOX_DEFAULT_RATE_LIMIT = 20;
export const SYSTEM_MAILBOX_DEFAULT_NAME = "Unbottled Platform";

export interface SystemMailboxEnvValues {
  THEA_MAIL_ADDRESS?: string | undefined;
  THEA_MAIL_HOST?: string | undefined;
  THEA_MAIL_PASSWORD?: string | undefined;
  THEA_MAIL_REPORT_TO?: string | undefined;
  THEA_MAIL_RATE_LIMIT_PER_HOUR?: number | undefined;
}

export interface SystemMailboxConfig {
  accountId: string | null;
  address: string;
  fromName: string;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  };
  imap: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  };
  rateLimitPerHour: number;
  reportTo: string | null;
}

function pick(...values: (string | null | undefined)[]): string | null {
  for (const v of values) {
    if (typeof v === "string" && v.trim() !== "") {
      return v.trim();
    }
  }
  return null;
}

/**
 * Resolve the system mailbox config. Returns null when host, user or password
 * cannot be determined from env + row.
 */
export function resolveSystemMailboxConfig(
  row: MessengerAccount | null,
  env: SystemMailboxEnvValues,
): SystemMailboxConfig | null {
  const address = pick(
    env.THEA_MAIL_ADDRESS,
    row?.smtpFromEmail,
    row?.smtpUsername,
  );
  const smtpHost = pick(env.THEA_MAIL_HOST, row?.smtpHost);
  const imapHost = pick(env.THEA_MAIL_HOST, row?.imapHost, smtpHost);
  const password = pick(
    env.THEA_MAIL_PASSWORD,
    row?.smtpPassword,
    row?.imapPassword,
  );
  const smtpUser = pick(env.THEA_MAIL_ADDRESS, row?.smtpUsername, address);
  const imapUser = pick(env.THEA_MAIL_ADDRESS, row?.imapUsername, address);

  if (
    !address ||
    !smtpHost ||
    !imapHost ||
    !password ||
    !smtpUser ||
    !imapUser
  ) {
    return null;
  }

  return {
    accountId: row?.id ?? null,
    address,
    fromName: pick(row?.smtpFromName) ?? SYSTEM_MAILBOX_DEFAULT_NAME,
    smtp: {
      host: smtpHost,
      port: SYSTEM_MAILBOX_SMTP_PORT,
      secure: true,
      username: smtpUser,
      password,
    },
    imap: {
      host: imapHost,
      port: SYSTEM_MAILBOX_IMAP_PORT,
      secure: true,
      username: imapUser,
      password,
    },
    rateLimitPerHour:
      env.THEA_MAIL_RATE_LIMIT_PER_HOUR ??
      row?.smtpRateLimitPerHour ??
      SYSTEM_MAILBOX_DEFAULT_RATE_LIMIT,
    reportTo: pick(env.THEA_MAIL_REPORT_TO),
  };
}
