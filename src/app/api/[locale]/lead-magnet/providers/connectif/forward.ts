import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl = "https://api.connectif.cloud/contacts/{email}";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { connectifApiKey } = credentials;
  const { firstName, email } = lead;

  const response = await fetch(apiContactsUrl.replace("{email}", email), {
    method: "PATCH",
    headers: {
      Authorization: `apiKey ${connectifApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _emailStatus: "active",
      _name: firstName,
      _newsletterSubscriptionStatus: "subscribed",
    }),
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
