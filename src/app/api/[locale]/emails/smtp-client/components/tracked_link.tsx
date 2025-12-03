/**
 * TrackedLink Component
 * Automatically wraps links with tracking URLs when tracking context is provided
 */

import { Link } from "@react-email/components";
import type { CSSProperties, JSX, ReactNode } from "react";

import { envClient } from "@/config/env-client";
import {
  ensureFullUrl,
  generateTrackingLinkUrl,
  isTrackingUrl,
} from "../../../leads/tracking/utils";
import { type TrackingContext } from "./tracking_context";

/**
 * TrackedLink Component Props
 */
interface TrackedLinkProps {
  href: string;
  children: ReactNode;
  tracking: TrackingContext;
  style?: CSSProperties;
  className?: string;
}

/**
 * TrackedLink Component
 * Automatically wraps links with tracking URLs when tracking context is provided
 */
export function TrackedLink({
  href,
  children,
  tracking,
  style,
  className,
}: TrackedLinkProps): JSX.Element {
  const baseUrl = tracking?.baseUrl || envClient.NEXT_PUBLIC_APP_URL;
  const fullUrl = ensureFullUrl(href, baseUrl);

  // If no tracking context or already a tracking/anchor link, use the full URL
  if (
    (!tracking?.leadId && !tracking?.userId) ||
    isTrackingUrl(fullUrl, tracking.locale) ||
    fullUrl.startsWith("#") ||
    // eslint-disable-next-line i18next/no-literal-string
    fullUrl.startsWith("mailto:") ||
    // eslint-disable-next-line i18next/no-literal-string
    fullUrl.startsWith("tel:")
  ) {
    return (
      <Link href={fullUrl} style={style} className={className}>
        {children}
      </Link>
    );
  }

  // Generate tracking URL using the full URL
  const trackingUrl = generateTrackingLinkUrl(
    fullUrl,
    tracking.leadId,
    tracking.userId,
    tracking.campaignId,
    baseUrl,
    tracking.locale,
  );

  return (
    <Link href={trackingUrl} style={style} className={className}>
      {children}
    </Link>
  );
}
