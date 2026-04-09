import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl = "https://a.klaviyo.com/api/profiles/";
const apiListUrl =
  "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { klaviyoApiKey } = credentials;
  const { firstName, email, listId } = lead;

  const profileResponse = await fetch(apiContactsUrl, {
    method: "post",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      revision: "2024-06-15",
      Authorization: `Klaviyo-API-Key ${klaviyoApiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "profile",
        attributes: {
          email,
          first_name: firstName,
        },
      },
    }),
  });

  await profileResponse.json();

  if (!profileResponse.ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  const subscribeResponse = await fetch(apiListUrl, {
    method: "post",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      revision: "2023-08-15",
      Authorization: `Klaviyo-API-Key ${klaviyoApiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          profiles: {
            data: [
              {
                type: "profile",
                attributes: { email },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: { id: listId },
          },
        },
      },
    }),
  });

  await subscribeResponse.json();

  if (!subscribeResponse.ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  return success(undefined);
};
