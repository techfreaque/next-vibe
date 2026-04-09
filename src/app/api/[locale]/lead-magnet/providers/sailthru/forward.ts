import crypto from "node:crypto";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsPath = "https://api.sailthru.com/user";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { sailthruApiKey, sailthruSecret, listName } = credentials;
  const { firstName, email } = lead;

  const requestPayload = JSON.stringify({
    id: email,
    lists: { [listName]: 1 },
    vars: { FirstName: firstName },
  });

  const requestMd5 = crypto
    .createHash("md5")
    .update(`${sailthruSecret + sailthruApiKey}json${requestPayload}`)
    .digest("hex");

  const requestBody = new URLSearchParams();
  requestBody.append("api_key", sailthruApiKey);
  requestBody.append("sig", requestMd5);
  requestBody.append("format", "json");
  requestBody.append("json", requestPayload);

  const response = await fetch(apiContactsPath, {
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: requestBody.toString(),
  });

  await response.text();

  if (response.ok) {
    return success(undefined);
  }

  return fail({
    message: t("errors.providerError"),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
};
