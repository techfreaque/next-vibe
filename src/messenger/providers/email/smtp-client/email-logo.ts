export const EMAIL_LOGO_FILENAME = "unbottled-email-logo.png";
export const EMAIL_LOGO_CID = "logo@unbottled.ai";
export const EMAIL_LOGO_SRC = `cid:${EMAIL_LOGO_CID}`;
export const EMAIL_LOGO_CONTENT_TYPE = "image/png";

/**
 * Browser-only preview: swaps the cid logo for a data: URI so the admin preview
 * iframe can show it. Never use on mail that is sent or stored as a sent copy.
 */
export function withPreviewEmailLogo(html: string, logoBase64: string): string {
  return html.replaceAll(
    EMAIL_LOGO_SRC,
    `data:${EMAIL_LOGO_CONTENT_TYPE};base64,${logoBase64}`,
  );
}
