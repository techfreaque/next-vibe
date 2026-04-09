import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

const apiContactsUrl = "https://{domain}/v2/Api/Subscribers/";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const { expertSenderApiDomain, expertSenderApiKey } = credentials;
  const { firstName, email, listId } = lead;

  const response = await fetch(
    apiContactsUrl.replace("{domain}", expertSenderApiDomain),
    {
      method: "post",
      headers: {
        "Accept-Encoding": "gzip,deflate",
        "Content-Type": "text/xml",
        "User-Agent": "Jakarta Commons-HttpClient/3.1",
      },
      body: `<?xml version="1.0" encoding="UTF-8"?>
<ApiRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <ApiKey>${expertSenderApiKey}</ApiKey>
    <Data xsi:type="Subscriber">
       <Mode>AddAndUpdate</Mode>
       <Force>true</Force>
       <ListId>${listId ?? ""}</ListId>
       <Email>${email}</Email>
       <Firstname>${firstName}</Firstname>
    </Data>
</ApiRequest>`,
    },
  );

  await response.text();

  if (response.ok) {
    return success(undefined);
  }

  return fail({
    message: t("errors.providerError"),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
};
