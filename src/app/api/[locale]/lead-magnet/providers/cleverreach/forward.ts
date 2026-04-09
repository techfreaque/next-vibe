import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl =
  "https://rest.cleverreach.com/v3/groups.json/{group_id}/receivers";
const apiDOIMailUrl =
  "https://rest.cleverreach.com/v3/forms.json/{form_id}/send/activate";
const oAuthUrl = "https://rest.cleverreach.com/oauth/token.php";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const {
    cleverreachClientId,
    cleverreachClientSecret,
    cleverreachListId,
    cleverreachFormId,
    cleverreachSource,
  } = credentials;
  const { firstName, email } = lead;

  const authResponse = await fetch(oAuthUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${cleverreachClientId}:${cleverreachClientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  const authData = await authResponse.json();

  if (!authResponse.ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  const token = authData.access_token as string;

  const contactResponse = await fetch(
    apiContactsUrl.replace("{group_id}", cleverreachListId),
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        deactivated: "1",
        registered: String(Date.now() / 1000),
        email,
        ...(cleverreachSource ? { source: cleverreachSource } : {}),
        global_attributes: { firstname: firstName },
      }),
    },
  );

  await contactResponse.json();

  if (!contactResponse.ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  if (!cleverreachFormId) {
    return success(undefined);
  }

  const doiResponse = await fetch(
    apiDOIMailUrl.replace("{form_id}", cleverreachFormId),
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        doidata: {
          user_ip: "130.0.76.152",
          referer: "unbottled.ai",
          user_agent: "Linux",
        },
      }),
    },
  );

  await doiResponse.json();

  if (!doiResponse.ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  return success(undefined);
};
