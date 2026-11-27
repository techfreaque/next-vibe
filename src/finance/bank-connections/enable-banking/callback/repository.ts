import "server-only";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import type { ConsentTransport } from "../consent/client";
import {
  completeEnableBankingConsent,
  type ConsentOrigin,
  enableBankingCallbackPath,
} from "../consent/repository";

const headers = {
  "cache-control": "no-store",
  "referrer-policy": "no-referrer",
};

export async function redirectBankConsent(
  request: Request,
  origin: ConsentOrigin | undefined,
  upstream: ConsentTransport | undefined,
): Promise<Response> {
  const url = new URL(request.url);
  if (!origin || url.pathname !== enableBankingCallbackPath) {
    return new Response(null, { status: 400, headers });
  }
  const target = new URL("/tools/bank-connections", origin);
  const states = url.searchParams.getAll("state");
  const codes = url.searchParams.getAll("code");
  const authorized =
    upstream && states.length === 1 && codes.length <= 1
      ? await completeEnableBankingConsent(
          {
            state: states[0],
            code: codes[0],
            denied: url.searchParams.has("error"),
            origin,
          },
          {
            request: upstream,
            logger: createEndpointLogger(false, defaultLocale),
            locale: defaultLocale,
          },
        )
      : false;
  target.searchParams.set("bankConsent", authorized ? "connected" : "failed");
  if (authorized) {
    target.searchParams.set("arg.companyId", authorized.companyId);
  }
  return new Response(null, {
    status: 303,
    headers: { ...headers, location: target.href },
  });
}
