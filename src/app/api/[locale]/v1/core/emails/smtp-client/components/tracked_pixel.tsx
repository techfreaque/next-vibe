/**
 * TrackedPixel Component
 * Invisible tracking pixel for email open tracking
 */

import { Img } from "@react-email/components";
import type { JSX } from "react";

import { envClient } from "../../../../../../../../config/env-client";
import { generateTrackingPixelUrl } from "../../../leads/tracking/utils";
import { type TrackingContext } from "./tracking_context";

/**
 * TrackedPixel Component Props
 */
interface TrackedPixelProps {
  tracking: TrackingContext;
}

/**
 * TrackedPixel Component
 * Invisible tracking pixel for email open tracking
 */
export function TrackedPixel({
  tracking,
}: TrackedPixelProps): JSX.Element | null {
  // Only render if tracking context is provided
  if (!tracking?.leadId && !tracking?.userId) {
    return null;
  }

  const pixelUrl = generateTrackingPixelUrl(
    tracking.leadId,
    tracking.userId,
    tracking.campaignId,
    tracking.baseUrl || envClient.NEXT_PUBLIC_APP_URL,
    tracking.locale,
  );

  return (
    <Img
      src={pixelUrl}
      width="1"
      height="1"
      style={{ display: "none" }}
      alt=""
    />
  );
}
