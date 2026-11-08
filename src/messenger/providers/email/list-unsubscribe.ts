/**
 * List-Unsubscribe headers (RFC 2369 + RFC 8058 one-click).
 *
 * Only marketing/newsletter/lifecycle mail carries an `unsubscribeUrl`;
 * transactional/system mail never does and so never gets these headers.
 * The header URL is the POST-able one-click endpoint; the human page URL
 * stays in the email body footer.
 */

import "server-only";

import { buildOneClickUnsubscribeUrl } from "@/newsletter/unsubscribe/oneclick/token";

export function buildListUnsubscribeHeaders(
  recipient: string,
  unsubscribeUrl: string | undefined,
): Record<string, string> {
  if (!unsubscribeUrl) {
    return {};
  }
  return {
    "List-Unsubscribe": `<${buildOneClickUnsubscribeUrl(recipient)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
