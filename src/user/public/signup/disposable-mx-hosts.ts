/**
 * MX hosts of temp-mail services that rotate through fresh domains faster
 * than any domain list can follow. A signup domain whose MX host equals one
 * of these, or is a subdomain of one, is treated as disposable.
 * Matching: isDisposableMxHost (email-identity.ts). Lookup: disposable-mx.ts.
 * Add hosts only when every domain behind them is a throwaway inbox.
 */

export const DISPOSABLE_MX_HOSTS: ReadonlySet<string> = new Set([
  "mx.smtp.is",
  "email.chatgpt.org.uk",
  "generator.email",
  "emailfake.com",
  "smtp.yopmail.com",
  "tinyhost.shop",
  "email.gravityengine.cc",
  "vietxf.com",
  "mailinator.com",
]);
