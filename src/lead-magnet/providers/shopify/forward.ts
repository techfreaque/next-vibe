import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl = "https://{domain}/admin/api/2024-04/graphql.json";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { shopifyDomain, shopifyAccessToken } = credentials;
  const { firstName, email } = lead;

  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax
  const response = await fetch(
    apiContactsUrl.replace("{domain}", shopifyDomain),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopifyAccessToken,
      },
      body: JSON.stringify({
        query: `mutation customerCreate($input: CustomerInput!) {
          customerCreate(input: $input) {
            userErrors { field message }
            customer { email firstName }
          }
        }`,
        variables: {
          input: {
            email,
            firstName,
            emailMarketingConsent: {
              marketingOptInLevel: "SINGLE_OPT_IN",
              marketingState: "SUBSCRIBED",
            },
          },
        },
      }),
    },
  );

  const data = await response.json();

  if (
    response.ok &&
    !data?.errors?.length &&
    !data?.data?.customerCreate?.userErrors?.length
  ) {
    return success(undefined);
  }

  return fail({
    message: t("errors.providerError"),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
};
