import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl = "https://acumbamail.com/api/1/addSubscriber/";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { acumbamailApiKey } = credentials;
  const { firstName, email, listId } = lead;

  const payload = new URLSearchParams();
  payload.append("auth_token", acumbamailApiKey);
  payload.append("response_type", "json");
  payload.append("list_id", listId ?? "");
  payload.append("double_optin", "0");
  payload.append("welcome_email", "1");
  payload.append("merge_fields[email]", email);
  payload.append("merge_fields[nombre]", firstName);

  const response = await fetch(apiContactsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
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
