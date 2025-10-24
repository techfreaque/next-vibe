"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { debugLogger, errorLogger } from "next-vibe/shared/utils";
import { Div, P } from "next-vibe-ui/ui";
import type React from "react";
import { useEffect } from "react";

import { generateEngagementTrackingApiUrl } from "@/app/api/[locale]/v1/core/leads/tracking/utils";
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
          // eslint-disable-next-line i18next/no-literal-string
          errorLogger("Missing tracking ID", {
            url: window.location.href,
          });
          router.push(`/${locale}`);
          return;
        }

        // Validate URL if provided
        if (url) {
          try {
            new URL(url);
          } catch {
            // eslint-disable-next-line i18next/no-literal-string
            errorLogger("Invalid tracking URL", { url });
            router.push(`/${locale}`);
            return;
          }
        }

        // eslint-disable-next-line i18next/no-literal-string
        debugLogger("Processing tracking click", {
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
