import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl = "https://dpn-api-core.datanext.nl/api/subscription";
const oAuthUrl = "https://dpn-api-core.datanext.nl/api/authorization/";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const {
    datanextApiKey,
    datanextApiSecret,
    datanextFormId,
    datanextCampaignId,
  } = credentials;
  const { firstName, email } = lead;

  const authResponse = await fetch(oAuthUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${datanextApiKey}:${datanextApiSecret}`).toString("base64")}`,
    },
  });

  const authData = await authResponse.json();

  if (!authResponse.ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  const token = authData.access_token as string;

  const response = await fetch(apiContactsUrl, {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      formId: datanextFormId,
      campaignId: datanextCampaignId,
      formStep: 0,
      lead: {
        firstName,
        contact: { email },
      },
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
