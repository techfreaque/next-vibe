import crypto from "node:crypto";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl = "https://{subDomain}.emarsys.net/api/v2/contact";

function getWsseHeader(user: string, secret: string): string {
  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = new Date().toISOString();
  const hexDigest = crypto
    .createHash("sha1")
    .update(nonce + timestamp + secret)
    .digest("hex");
  const digest = Buffer.from(hexDigest).toString("base64");
  return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
}

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { emarsysUserName, emarsysApiKey, emarsysSubDomain } = credentials;
  const { firstName, email, listId } = lead;

  const response = await fetch(
    apiContactsUrl.replace("{subDomain}", emarsysSubDomain),
    {
      method: "post",
      headers: {
        "X-WSSE": getWsseHeader(emarsysUserName, emarsysApiKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key_id: "3",
        contacts: [
          {
            1: firstName,
            3: email,
          },
        ],
        contact_list_id: listId,
      }),
    },
  );

  const data = await response.json();

  if (response.ok && !data?.data?.errors) {
    return success(undefined);
  }

  return fail({
    message: t("errors.providerError"),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
};
