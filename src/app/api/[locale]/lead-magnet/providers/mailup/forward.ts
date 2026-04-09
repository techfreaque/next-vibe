import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl =
  "https://services.mailup.com/API/v1.1/Rest/ConsoleService.svc/Console/List/{list_id}/Recipient";
const oAuthUrl = "https://services.mailup.com/Authorization/OAuth/Token";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const {
    mailupClientId,
    mailupClientSecret,
    mailupUsername,
    mailupPassword,
    mailupListId,
  } = credentials;
  const { firstName, email } = lead;

  const authResponse = await fetch(oAuthUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${mailupClientId}:${mailupClientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=password&username=${mailupUsername}&password=${mailupPassword}`,
  });

  const authDataRaw = await authResponse.text();

  if (!authResponse.ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  const authData = JSON.parse(authDataRaw) as { access_token: string };

  const response = await fetch(
    `${apiContactsUrl.replace("{list_id}", mailupListId)}?ConfirmEmail=false`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify({
        Name: firstName,
        Email: email,
        Fields: [{ Description: "FirstName", Id: 1, Value: firstName }],
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
