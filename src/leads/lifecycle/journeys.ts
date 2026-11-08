/**
 * Lifecycle journey definitions - data, not code.
 *
 * A journey is a sequence of steps. Each step = delay (hours, measured from the
 * previous step was sent; for step 0 from the trigger event or backfill start)
 * + email template. Entry and exit conditions live in eligibility.ts so they are
 * pure and unit tested.
 */

import type { LifecycleJourneyValue, LifecycleTemplateValue } from "./enum";
import { LifecycleJourney, LifecycleTemplate } from "./enum";

export interface JourneyStep {
  delayHours: number;
  template: typeof LifecycleTemplateValue;
}

export interface JourneyConfig {
  key: typeof LifecycleJourneyValue;
  steps: readonly JourneyStep[];
}

export const LIFECYCLE_JOURNEYS: Record<
  typeof LifecycleJourneyValue,
  JourneyConfig
> = {
  // Signed up, never sent a chat. Exit: first chat or purchase.
  [LifecycleJourney.INACTIVE_USER]: {
    key: LifecycleJourney.INACTIVE_USER,
    steps: [
      { delayHours: 24, template: LifecycleTemplate.INACTIVE_NUDGE },
      { delayHours: 72, template: LifecycleTemplate.INACTIVE_MODELS },
      { delayHours: 120, template: LifecycleTemplate.INACTIVE_UPGRADE },
    ],
  },
  // Chatted, never paid. Exit: purchase.
  [LifecycleJourney.ENGAGED_FREE]: {
    key: LifecycleJourney.ENGAGED_FREE,
    steps: [
      { delayHours: 24, template: LifecycleTemplate.ENGAGED_VALUE },
      { delayHours: 96, template: LifecycleTemplate.ENGAGED_UPGRADE },
      { delayHours: 168, template: LifecycleTemplate.ENGAGED_LAST },
    ],
  },
  // Confirmed newsletter subscriber without an account. Exit: signup.
  [LifecycleJourney.NEWSLETTER_INVITE]: {
    key: LifecycleJourney.NEWSLETTER_INVITE,
    steps: [
      { delayHours: 0, template: LifecycleTemplate.INVITE_SIGNUP },
      { delayHours: 120, template: LifecycleTemplate.INVITE_REMINDER },
    ],
  },
};

export const LIFECYCLE_JOURNEY_LIST: readonly JourneyConfig[] = [
  LIFECYCLE_JOURNEYS[LifecycleJourney.INACTIVE_USER],
  LIFECYCLE_JOURNEYS[LifecycleJourney.ENGAGED_FREE],
  LIFECYCLE_JOURNEYS[LifecycleJourney.NEWSLETTER_INVITE],
];

/** Where each template's single CTA points (path after /{locale}). */
export const TEMPLATE_CTA_PATH: Record<typeof LifecycleTemplateValue, string> =
  {
    [LifecycleTemplate.INACTIVE_NUDGE]: "/threads",
    [LifecycleTemplate.INACTIVE_MODELS]: "/threads",
    [LifecycleTemplate.INACTIVE_UPGRADE]: "/subscription/buy",
    [LifecycleTemplate.ENGAGED_VALUE]: "/threads",
    [LifecycleTemplate.ENGAGED_UPGRADE]: "/subscription/buy",
    [LifecycleTemplate.ENGAGED_LAST]: "/subscription/buy",
    [LifecycleTemplate.INVITE_SIGNUP]: "/user/signup",
    [LifecycleTemplate.INVITE_REMINDER]: "/user/signup",
  };
