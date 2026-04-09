import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsPath = "https://api.getresponse.com/v3/contacts";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { getresponseApiKey } = credentials;
  const { firstName, email, listId } = lead;

  const headers = {
    "X-Auth-Token": `api-key ${getresponseApiKey}`,
    "content-type": "application/json",
  };

  const response = await fetch(apiContactsPath, {
    method: "post",
    headers,
    body: JSON.stringify({
      name: firstName,
      campaign: { campaignId: listId },
      email,
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
