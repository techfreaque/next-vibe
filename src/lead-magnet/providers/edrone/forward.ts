import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl = "https://api.edrone.me/trace";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { edroneAppId } = credentials;
  const { firstName, email } = lead;

  const edroneData = new URLSearchParams();
  edroneData.append("version", "1.0.0");
  edroneData.append("app_id", edroneAppId);
  edroneData.append("email", email);
  edroneData.append("first_name", firstName);
  edroneData.append("subscriber_status", "1");
  edroneData.append("action_type", "subscribe");
  edroneData.append("sender_type", "server");

  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
  const response = await fetch(apiContactsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: edroneData.toString(),
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
