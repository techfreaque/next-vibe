import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { LeadMagnetT } from "../../i18n";
import type { ForwardLeadFn } from "../types";

const authUrl = "https://ims-na1.adobelogin.com/ims/token/v3";
const apiContactsUrl =
  "https://mc.adobe.io/{ORGANIZATION}/campaign/profileAndServices/profile";
const subscribeUrl =
  "https://mc.adobe.io/{ORGANIZATION}/campaign//profileAndServices/service/{PKey}/subscriptions/";

async function getAccessToken(
  clientId: string,
  clientSecret: string,
  t: LeadMagnetT,
): Promise<ResponseType<string>> {
  const formData = new URLSearchParams();
  formData.append("client_id", clientId);
  formData.append("client_secret", clientSecret);
  formData.append("grant_type", "client_credentials");
  formData.append(
    "scope",
    "AdobeID, openid, read_organizations, additional_info.projectedProductContext, additional_info.roles, adobeio_api, read_client_secret, manage_client_secrets",
  );

  const response = await fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!response.ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  const data = await response.json();
  if (!data.access_token) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
  return success(data.access_token as string);
}

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const {
    adobeCampaignOrganizationId,
    adobeCampaignClientId,
    adobeCampaignClientSecret,
    adobeCampaignApiKey,
    adobeCampaignListId,
  } = credentials;
  const { firstName, email } = lead;

  const tokenResult = await getAccessToken(
    adobeCampaignClientId,
    adobeCampaignClientSecret,
    t,
  );

  if (!tokenResult.success) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  const token = tokenResult.data;

  const commonHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "Cache-Control": "no-cache",
    "X-Api-Key": adobeCampaignApiKey,
  };

  const contactResponse = await fetch(
    apiContactsUrl.replace("{ORGANIZATION}", adobeCampaignOrganizationId),
    {
      method: "post",
      headers: commonHeaders,
      body: JSON.stringify({ firstName, email }),
    },
  );

  const contactData = await contactResponse.json();

  if (!contactResponse.ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  const pKey = (contactData as { PKey: string }).PKey;

  const subscribeResponse = await fetch(
    subscribeUrl
      .replace("{ORGANIZATION}", adobeCampaignOrganizationId)
      .replace("{PKey}", adobeCampaignListId),
    {
      method: "post",
      headers: commonHeaders,
      body: JSON.stringify({ subscriber: { PKey: pKey } }),
    },
  );

  await subscribeResponse.json();

  if (!subscribeResponse.ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  return success(undefined);
};
