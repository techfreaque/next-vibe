/**
 * Email Components with Built-in Tracking
 * Clean snake_case organization - one component per type
 */

// Tracking context and utilities
export {
  createTrackingContext,
  type TrackingContext,
} from "./tracking_context";

// Import tracking functions directly from utils
export {
  generateTrackingLinkUrl,
  generateTrackingPixelUrl,
} from "../../../leads/tracking/utils";

// Individual tracking components
export { TrackedCTAButton, TrackedHumanCTAButton } from "./tracked_cta_button";
export { TrackedLink } from "./tracked_link";
export { TrackedPixel } from "./tracked_pixel";

// Email layouts
export { EmailTemplate } from "./email_template";
export { HumanEmailLayout } from "./human_email_layout";

// Human email components
export { HumanCTAButton } from "./human_cta_button";
export { HumanText } from "./human_text";
