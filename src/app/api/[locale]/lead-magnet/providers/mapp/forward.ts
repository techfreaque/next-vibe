import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsPath = "/api/rest/v19/contact/create";
const apiContactsUpdatePath =
  "/api/rest/v19/contact/update?identifierType=EMAIL";
const apiSubscribePath = "/api/rest/v19/membership/subscribeByEmail";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { mappUsername, mappPassword, mappDomain } = credentials;
  const { firstName, email, listId } = lead;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`${mappUsername}:${mappPassword}`)}`,
  };

  const contactPayload = {
    emailAddress: email,
    attributes: [{ name: "FirstName", value: firstName }],
  };

  let createResponse = await fetch(`https://${mappDomain}${apiContactsPath}`, {
    method: "post",
    headers,
    body: JSON.stringify(contactPayload),
  });

  if (!createResponse.ok) {
    createResponse = await fetch(
      `https://${mappDomain}${apiContactsUpdatePath}`,
      { method: "post", headers, body: JSON.stringify(contactPayload) },
    );
  }

  if (!createResponse.ok) {
    await createResponse.text();
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  const subscribeResponse = await fetch(
    `https://${mappDomain}${apiSubscribePath}?email=${email}&groupId=${parseInt(listId ?? "0", 10)}&subscriptionMode=CONFIRMED_OPT_IN`,
    { method: "post", headers },
  );

  if (!subscribeResponse.ok) {
    await subscribeResponse.text();
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  return success(undefined);
};
