import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl = "https://{salesManagoDomain}/api/contact/upsert";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const {
    salesManagoClientId,
    salesManagoApiKey,
    salesManagoSha,
    salesManagoDomain,
    salesManagoOwner,
  } = credentials;
  const { firstName, email } = lead;

  const response = await fetch(
    apiContactsUrl.replace("{salesManagoDomain}", salesManagoDomain),
    {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: salesManagoClientId,
        apiKey: salesManagoApiKey,
        requestTime: Date.now(),
        sha: salesManagoSha,
        owner: salesManagoOwner,
        contact: {
          email,
          name: firstName,
        },
        forceOptIn: false,
      }),
    },
  );

  await response.json();

  if (response.ok) {
    return success(undefined);
  }

  return fail({
    message: t("errors.providerError"),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
};
