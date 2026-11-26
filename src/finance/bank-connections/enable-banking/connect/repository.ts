import "server-only";

import { coreClientEnv } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { configuredEnableBanking } from "../../env";
import type { ConsentTransport } from "../consent/client";
import type { scopedTranslation } from "../consent/i18n";
import {
  type ConsentOrigin,
  consentOrigin,
  startEnableBankingConsent,
} from "../consent/repository";
import { createEnableBankingTransport } from "../http";
import type definition from "./definition";
import type { ConnectInput } from "./definition";

export function configuredConsentTransport(): ConsentTransport | undefined {
  const credentials = configuredEnableBanking();
  if (!credentials) {
    return undefined;
  }
  return createEnableBankingTransport(
    credentials.appId,
    credentials.privateKey,
    // oxlint-disable-next-line restricted/no-raw-fetch -- external bank authorization API
    (url, init) => fetch(url, init),
  );
}

export function configuredConsentOrigin(): ConsentOrigin | undefined {
  return consentOrigin(coreClientEnv.NEXT_PUBLIC_APP_URL);
}

export async function connectEnableBanking(
  data: ConnectInput,
  actorId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
  t: ReturnType<typeof scopedTranslation.scopedT>["t"],
): Promise<ResponseType<(typeof definition.POST)["types"]["ResponseOutput"]>> {
  const origin = configuredConsentOrigin();
  const request = configuredConsentTransport();
  if (!origin || !request) {
    return fail({
      message: t("unavailable"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  const result = await startEnableBankingConsent(
    {
      actorId,
      companyId: data.companyId,
      ledgerAccountId: data.ledgerAccountId,
      bank: { name: data.bankName, country: data.bankCountry },
      psu: data.personal ? "personal" : "business",
      origin,
    },
    { request, logger, locale },
  );
  return result.status === "started"
    ? success({
        url: result.url,
        authorizedBank: data.bankName,
        authorizedLedgerAccount: result.ledgerAccountName,
      })
    : fail({
        message: t(result.status),
        errorType:
          result.status === "forbidden"
            ? ErrorResponseTypes.FORBIDDEN
            : ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
}
