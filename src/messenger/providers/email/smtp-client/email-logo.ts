import { coreClientEnv } from "next-vibe/core/env-client";

export const EMAIL_LOGO_FILENAME = "unbottled-email-logo.png";
export const EMAIL_LOGO_FALLBACK_PATH = "/images/unbottled-icon.png";
export const EMAIL_LOGO_CID = "logo@unbottled.ai";
export const EMAIL_LOGO_SRC = `cid:${EMAIL_LOGO_CID}`;
export const EMAIL_LOGO_CONTENT_TYPE = "image/png";

export function withHostedEmailLogo(html: string): string {
  if (!html.includes(EMAIL_LOGO_SRC)) {
    return html;
  }

  return html.replaceAll(
    EMAIL_LOGO_SRC,
    new URL(EMAIL_LOGO_FALLBACK_PATH, coreClientEnv.NEXT_PUBLIC_APP_URL).href,
  );
}
