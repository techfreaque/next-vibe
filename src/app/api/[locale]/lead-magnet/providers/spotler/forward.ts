import { createHmac } from "node:crypto";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl = "https://restapi.mailplus.nl/integrationservice/contact";

interface OAuthHeader {
  Authorization: string;
}

function makeOAuthHeader(
  url: string,
  consumerKey: string,
  consumerSecret: string,
): OAuthHeader {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = Math.random().toString(36).substring(2);
  const method = "POST";

  const params: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_version: "1.0",
  };

  const sorted = Object.keys(params)
    .toSorted()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join("&");

  const baseString = [
    method,
    encodeURIComponent(url),
    encodeURIComponent(sorted),
  ].join("&");

  const signingKey = `${encodeURIComponent(consumerSecret)}&`;
  const signature = createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  const authParams = {
    ...params,
    oauth_signature: signature,
  };

  const authHeader = `OAuth ${Object.keys(authParams)
    .toSorted()
    .map(
      (k) =>
        `${encodeURIComponent(k)}="${encodeURIComponent(authParams[k as keyof typeof authParams])}"`,
    )
    .join(", ")}`;

  return { Authorization: authHeader };
}

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { spotlerConsumerKey, spotlerConsumerSecret } = credentials;
  const { firstName, email } = lead;

  const body = {
    update: true,
    contact: {
      externalId: email,
      properties: {
        email,
        firstName,
      },
      channels: [{ name: "EMAIL", value: true }],
    },
  };

  const oauthHeader = makeOAuthHeader(
    apiContactsUrl,
    spotlerConsumerKey,
    spotlerConsumerSecret,
  );

  const response = await fetch(apiContactsUrl, {
    method: "POST",
    headers: {
      ...oauthHeader,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
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
