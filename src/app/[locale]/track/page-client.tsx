"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { LeadSource } from "next-vibe/identity/lead/enum";
import trackingEndpoints from "next-vibe/identity/tracking/engagement/definition";
import { useApiQuery } from "next-vibe/platforms/react/hooks/use-api-query";
import { useSearchParams } from "next-vibe/ui/web/hooks/use-navigation";
import { assignUrl } from "next-vibe/ui/web/lib/location";
import { Div } from "next-vibe/ui/web/ui/div";
import { P } from "next-vibe/ui/web/ui/typography";
import type React from "react";

import { scopedTranslation } from "@/app/[locale]/track/i18n";
import { useLogger } from "@/hooks/use-logger";

/**
 * Tracking Page - Records click engagement and handles referral codes
 */
export default function TrackPage({
  locale,
  user,
}: {
  locale: CountryLanguage;
  user: JwtPayloadType;
}): React.ReactElement {
  const searchParams = useSearchParams();
  const { t } = scopedTranslation.scopedT(locale);

  const leadId = searchParams.get("leadId") ?? undefined;
  const url = searchParams.get("url") ?? undefined;
  const ref = searchParams.get("ref") ?? undefined;
  const campaignId = searchParams.get("campaignId") ?? undefined;

  const logger = useLogger();

  // Single API call - handles both tracking (with id) and ref-only cases server-side
  useApiQuery({
    endpoint: trackingEndpoints.GET,
    requestData: {
      leadId,
      url: url ?? `/${locale}`,
      source: LeadSource.EMAIL_CAMPAIGN,
      campaignId,
      ref,
    },
    logger,
    user,
    options: {
      enabled: true,
      retry: 0,
      onSuccess: ({ responseData }) => {
        assignUrl(responseData.redirectUrl ?? `/${locale}`);
      },
      onError: () => {
        assignUrl(`/${locale}`);
      },
    },
  });

  return (
    <Div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Div className="text-center">
        <Div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <P className="text-gray-600 dark:text-gray-400">
          {t("tracking.redirecting")}
        </P>
      </Div>
    </Div>
  );
}
