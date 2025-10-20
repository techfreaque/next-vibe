"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { debugLogger, errorLogger } from "next-vibe/shared/utils";
import type React from "react";
import { useEffect } from "react";

import { LeadTrackingClientRepository } from "@/app/api/[locale]/v1/core/leads/tracking/client-repository";
import { generateEngagementTrackingApiUrl } from "@/app/api/[locale]/v1/core/leads/tracking/utils";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * Tracking Page Component
 * Captures tracking data, records engagement, and redirects to destination
 */
export default function TrackPage(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as CountryLanguage;
  const { t } = simpleT(locale);

  useEffect(() => {
    let isMounted = true; // Prevent race conditions

    const handleTracking = async (): Promise<void> => {
      try {
        // Create logger for tracking operations
        const logger = LeadTrackingClientRepository.createLogger(locale);

        // Process tracking parameters using client repository
        const validationResult =
          LeadTrackingClientRepository.validateTrackingParams(
            searchParams,
            logger,
          );

        if (!validationResult.success) {
          // eslint-disable-next-line i18next/no-literal-string
          errorLogger("Invalid tracking parameters", {
            url: window.location.href,
            searchParams: Object.fromEntries(searchParams),
          });
          router.push(`/${locale}`);
          return;
        }

        const { validatedParams } = validationResult.data;
        if (!validatedParams) {
          // eslint-disable-next-line i18next/no-literal-string
          errorLogger("No validated parameters found", {
            url: window.location.href,
          });
          router.push(`/${locale}`);
          return;
        }

        // eslint-disable-next-line i18next/no-literal-string
        debugLogger("Processing tracking click", {
          id: validatedParams.id,
          campaignId: validatedParams.campaignId,
          stage: validatedParams.stage,
          source: validatedParams.source,
          url: validatedParams.url,
        });

        if (isMounted) {
          // Store tracking data for signup form
          await LeadTrackingClientRepository.captureTrackingData(
            searchParams,
            logger,
          );

          // Make a direct request to the consolidated engagement endpoint for click tracking
          const trackingUrl = generateEngagementTrackingApiUrl(
            window.location.origin,
            locale,
            {
              id: validatedParams.id,
              campaignId: validatedParams.campaignId,
              stage: validatedParams.stage,
              source: validatedParams.source,
              url: validatedParams.url || `/${locale}`,
            },
          );

          // eslint-disable-next-line i18next/no-literal-string
          debugLogger("Making tracking API call", {
            trackingUrl,
          });

          // Make the tracking API call
          const response = await fetch(trackingUrl);
          const result = (await response.json()) as {
            success: boolean;
            data?: { redirectUrl: string };
          };

          // eslint-disable-next-line i18next/no-literal-string
          debugLogger("Tracking API response", {
            success: result.success,
            leadId: validatedParams.id,
          });

          // Redirect to destination URL regardless of tracking success
          const redirectUrl =
            result.success && result.data?.redirectUrl
              ? result.data.redirectUrl
              : validatedParams.url || `/${locale}`;

          window.location.assign(redirectUrl);
        }
      } catch (error) {
        // eslint-disable-next-line i18next/no-literal-string
        errorLogger("Error in tracking page", error);
        // Fallback redirect to home page
        router.push(`/${locale}`);
      }
    };

    void handleTracking();

    // Cleanup function to prevent race conditions
    return (): void => {
      isMounted = false;
    };
  }, [searchParams, router, locale]);

  // Show loading state while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          {t("app.track.tracking.redirecting")}
        </p>
      </div>
    </div>
  );
}
