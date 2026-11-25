import "server-only";

import { toPlainText } from "@react-email/render";

/**
 * Plain-text alternative for an outgoing mail. HTML-only messages score as
 * spam (SpamAssassin/rspamd MIME_HTML_ONLY), so templates that pass no text
 * part get one derived from the rendered HTML (same conversion as
 * `render(jsx, { plainText: true })`: preview text and images are skipped).
 */
export function resolvePlainText(
  html: string,
  text: string | undefined,
): string {
  return text ?? toPlainText(html);
}
