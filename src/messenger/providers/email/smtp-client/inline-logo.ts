import "server-only";

import { Buffer } from "node:buffer";

import type { SendMailOptions } from "nodemailer";

import {
  EMAIL_LOGO_CID,
  EMAIL_LOGO_CONTENT_TYPE,
  EMAIL_LOGO_FILENAME,
  EMAIL_LOGO_SRC,
} from "./email-logo";
import { EMAIL_LOGO_BASE64 } from "./email-logo-data";

/** The logo bytes are bundled in the code, so reading can never fail. */
export function getEmailLogoBytes(): Buffer {
  return Buffer.from(EMAIL_LOGO_BASE64, "base64");
}

export function prepareEmailLogo(html: string | undefined): {
  html: string | undefined;
  logo?: Buffer;
} {
  if (!html?.includes(`src="${EMAIL_LOGO_SRC}"`)) {
    return { html };
  }
  return { html, logo: getEmailLogoBytes() };
}

export function prepareSmtpEmailLogo(html: string | undefined): {
  html: string | undefined;
  attachments?: SendMailOptions["attachments"];
} {
  const prepared = prepareEmailLogo(html);
  if (!prepared.logo) {
    return { html: prepared.html };
  }

  return {
    html: prepared.html,
    attachments: [
      {
        filename: EMAIL_LOGO_FILENAME,
        content: prepared.logo,
        cid: EMAIL_LOGO_CID,
        contentType: EMAIL_LOGO_CONTENT_TYPE,
        contentDisposition: "inline",
      },
    ],
  };
}
