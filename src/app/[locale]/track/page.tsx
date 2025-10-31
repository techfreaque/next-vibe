"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { parseError } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type React from "react";
import { useEffect, useMemo } from "react";

import { generateEngagementTrackingApiUrl } from "@/app/api/[locale]/v1/core/leads/tracking/utils";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Tracking Page Component
 * Records click engagement and redirects to destination
 * Server handles leadid via JWT - no client-side tracking needed
 */
export default function TrackPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as CountryLanguage;
  const { t } = simpleT(locale);

  // Create logger at top-level component
  const logger = useMemo(
    () => createEndpointLogger(false, Date.now(), locale),
    [locale],
  );

  useEffect(() => {
    let isMounted = true; // Prevent race conditions

    const handleTracking = async (): Promise<void> => {
      try {
        // Get tracking parameters from URL
        const id = searchParams.get("id");
        const campaignId = searchParams.get("campaignId");
        const stage = searchParams.get("stage");
        const source = searchParams.get("source") || "email";
        const url = searchParams.get("url");

        // Validate required id parameter
        if (!id) {
          logger.error("Missing tracking ID", {
            url: window.location.href,
          });
          router.push(`/${locale}`);
          return;
        }

        // Validate URL if provided
        if (url) {
          try {
            const parsedUrl = new URL(url);
            if (!parsedUrl.protocol || !parsedUrl.hostname) {
              logger.error("Invalid tracking URL format", {
                url,
                error: "Missing protocol or hostname",
              });
              router.push(`/${locale}`);
              return;
            }
          } catch (error) {
            logger.error("Invalid tracking URL", parseError(error), { url });
            router.push(`/${locale}`);
            return;
          }
        }

        logger.debug("Processing tracking click", {
          id,
          campaignId,
          stage,
          source,
          url,
        });

        if (isMounted) {
          // Make tracking API call - server handles leadid via JWT
          const trackingUrl = generateEngagementTrackingApiUrl(
            window.location.origin,
            locale,
            {
              id,
              campaignId: campaignId || undefined,
              stage: stage || undefined,
              source,
              url: url || `/${locale}`,
            },
          );

          logger.debug("Making tracking API call", {
            trackingUrl,
          });

          // Make the tracking API call
          const response = await fetch(trackingUrl);
          const result = (await response.json()) as {
            success: boolean;
            data?: { redirectUrl: string };
          };

          logger.debug("Tracking API response", {
            success: result.success,
            leadId: id,
          });

          // Redirect to destination URL regardless of tracking success
          const redirectUrl =
            result.success && result.data?.redirectUrl
              ? result.data.redirectUrl
              : url || `/${locale}`;

          window.location.assign(redirectUrl);
        }
      } catch (error) {
        logger.error("Error in tracking page", parseError(error));
        // Fallback redirect to home page
        router.push(`/${locale}`);
      }
    };

    void handleTracking();

    // Cleanup function to prevent race conditions
    return (): void => {
      isMounted = false;
    };
  }, [searchParams, router, locale, logger]);

  // Show loading state while processing
  return (
    <Div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Div className="text-center">
        <Div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <P className="text-gray-600 dark:text-gray-400">
          {t("app.track.tracking.redirecting")}
        </P>
      </Div>
    </Div>
  );
}
