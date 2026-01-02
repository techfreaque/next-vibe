"use client";

import { useParams, useSearchParams } from "next-vibe-ui/hooks/use-navigation";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";
import { useMemo } from "react";

import { LeadSource } from "@/app/api/[locale]/leads/enum";
import trackingEndpoints from "@/app/api/[locale]/leads/tracking/engagement/definition";
import { useApiQuery } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-query";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Tracking Page - Records click engagement and handles referral codes
 */
export default function TrackPage(): React.ReactElement {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as CountryLanguage;
  const { t } = simpleT(locale);

  const id = searchParams.get("id") ?? undefined;
  const url = searchParams.get("url") ?? undefined;
  const ref = searchParams.get("ref") ?? undefined;
  const campaignId = searchParams.get("campaignId") ?? undefined;

  const logger = useMemo(() => createEndpointLogger(false, Date.now(), locale), [locale]);

  // Single API call - handles both tracking (with id) and ref-only cases server-side
  useApiQuery({
    endpoint: trackingEndpoints.GET,
    requestData: {
      id,
      url: url ?? `/${locale}`,
      source: LeadSource.EMAIL_CAMPAIGN,
      campaignId,
      ref,
    },
    logger,
    options: {
      enabled: true,
      retry: 0,
      onSuccess: ({ responseData }) => {
        window.location.assign(responseData.redirectUrl ?? `/${locale}`);
      },
      onError: () => {
        window.location.assign(`/${locale}`);
      },
    },
  });

  return (
    <Div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Div className="text-center">
        <Div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <P className="text-gray-600 dark:text-gray-400">{t("app.track.tracking.redirecting")}</P>
      </Div>
    </Div>
  );
}
