import crypto from "node:crypto";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl =
  "https://a-pd.youlead.pl/api/Command/Contact/UpsertsByEmail";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { youLeadAppId, youLeadClientId, youLeadAppSecretKey } = credentials;
  const { firstName, email } = lead;

  const requestTimestamp = Math.round(Date.now() / 1000);
  const requestSha = crypto
    .createHash("sha1")
    .update(
      `${youLeadClientId}${youLeadAppId}${youLeadAppSecretKey}${requestTimestamp}`,
    )
    .digest("hex");

  const response = await fetch(apiContactsUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "YL-TimeStamp": String(requestTimestamp),
      "YL-AppId": youLeadAppId,
      "YL-ClientId": youLeadClientId,
      "YL-Signature": requestSha,
    },
    body: JSON.stringify({
      contacts: [
        {
          requestId: 1,
          emailKey: email,
          data: {
            name: firstName,
            email,
          },
          statusEmail: 2,
        },
      ],
    }),
  });

  await response.json();

  if (response.ok) {
    return success(undefined);
  }

  return fail({
    message: t("errors.providerError"),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
};
