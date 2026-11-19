import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { SendMailOptions } from "nodemailer";

import {
  EMAIL_LOGO_CID,
  EMAIL_LOGO_CONTENT_TYPE,
  EMAIL_LOGO_FILENAME,
  EMAIL_LOGO_SRC,
  withHostedEmailLogo,
} from "./email-logo";

export async function prepareEmailLogo(html: string | undefined): Promise<{
  html: string | undefined;
  logo?: Buffer;
}> {
  if (!html?.includes(`src="${EMAIL_LOGO_SRC}"`)) {
    return { html };
  }

  try {
    const logo = await readFile(
      join(process.cwd(), "public", "images", EMAIL_LOGO_FILENAME),
    );
    return { html, logo };
  } catch {
    return { html: withHostedEmailLogo(html) };
  }
}

export async function prepareSmtpEmailLogo(html: string | undefined): Promise<{
  html: string | undefined;
  attachments?: SendMailOptions["attachments"];
}> {
  const prepared = await prepareEmailLogo(html);
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
