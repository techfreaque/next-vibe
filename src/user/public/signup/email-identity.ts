/**
 * Email identity helpers for signup anti-farming (pure, no I/O).
 *
 * normalizeEmailForUniqueness maps aliases of one inbox to one key:
 * - lowercase + trim
 * - "+tag" stripped from the local part (all providers)
 * - gmail.com / googlemail.com: dots removed from the local part,
 *   googlemail.com mapped to gmail.com
 *
 * The SQL twin lives in email-guard.ts (normalizedEmailSql). Keep both in sync.
 */

import { DISPOSABLE_EMAIL_DOMAINS } from "./disposable-domains";

export const GMAIL_DOMAINS: readonly string[] = ["gmail.com", "googlemail.com"];
export const GMAIL_CANONICAL_DOMAIN = "gmail.com";

export function normalizeEmailForUniqueness(email: string): string {
  const e = email.trim().toLowerCase();
  const at = e.indexOf("@");
  if (at < 0) {
    return e;
  }
  const domain = e.slice(at + 1);
  const local = e.slice(0, at).split("+")[0] ?? "";
  if (GMAIL_DOMAINS.includes(domain)) {
    return `${local.replaceAll(".", "")}@${GMAIL_CANONICAL_DOMAIN}`;
  }
  return `${local}@${domain}`;
}

/** Lowercased domain part of an email, or null when there is none */
export function emailDomain(email: string): string | null {
  const e = email.trim().toLowerCase();
  const at = e.indexOf("@");
  if (at < 0) {
    return null;
  }
  const domain = e.slice(at + 1).replace(/\.$/, "");
  return domain.length > 0 ? domain : null;
}

/** True when the domain, or any parent domain, is a known disposable provider */
export function isDisposableEmailDomain(domain: string): boolean {
  const labels = domain.toLowerCase().replace(/\.$/, "").split(".");
  for (let i = 0; i < labels.length - 1; i++) {
    if (DISPOSABLE_EMAIL_DOMAINS.has(labels.slice(i).join("."))) {
      return true;
    }
  }
  return false;
}

export function isDisposableEmail(email: string): boolean {
  const domain = emailDomain(email);
  return domain ? isDisposableEmailDomain(domain) : false;
}
