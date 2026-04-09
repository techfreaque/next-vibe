import crypto from "node:crypto";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiUrl = "https://api.freshmail.com";
const apiContactsPath = "/rest/subscriber/add";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { freshmailApiKey, freshmailApiSecret, listHash } = credentials;
  const { email } = lead;

  const requestPayload = JSON.stringify({
    email,
    list: listHash,
    state: 1,
  });

  const requestSha = crypto
    .createHash("sha1")
    .update(
      `${freshmailApiKey}${apiContactsPath}${requestPayload}${freshmailApiSecret}`,
    )
    .digest("hex");

  const response = await fetch(apiUrl + apiContactsPath, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "X-Rest-ApiKey": freshmailApiKey,
      "X-Rest-ApiSign": requestSha,
    },
    body: requestPayload,
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
