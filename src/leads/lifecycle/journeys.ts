/**
 * Lifecycle journey definitions - data, not code.
 *
 * A journey is a sequence of steps. Each step = delay (hours, measured from the
 * previous step was sent; for step 0 from the trigger event or backfill start)
 * + email template. Entry and exit conditions live in eligibility.ts so they are
 * pure and unit tested.
 *
 * Design rules (2026-11-17 redesign):
 *  - One clear job per email. Most journeys are ONE email.
 *  - Day 0 is the transactional signup welcome (user/public/signup/email.tsx);
 *    unverified accounts get the hourly verify reminder. Journeys never repeat
 *    either of them.
 *  - Each journey runs at most once per contact (unique email+journey), one
 *    journey at a time, and the global cap keeps >= 48 h between any two
 *    journey/campaign emails.
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

/** Days without chat activity before the "what's new" email. */
export const WHATS_NEW_AFTER_DAYS = 7;
/** Days without chat activity before the win-back email. */
export const WIN_BACK_AFTER_DAYS = 30;
/**
 * A pool is "out of credits" when paid balance + this month's free credits left
 * drop below this. Cheap models still run below it, but most do not.
 */
export const OUT_OF_CREDITS_THRESHOLD = 5;

const DAY_HOURS = 24;

export const LIFECYCLE_JOURNEYS: Record<
  typeof LifecycleJourneyValue,
  JourneyConfig
> = {
  // Account (verified), never chatted. Trigger: signup. Exit: first chat or purchase.
  [LifecycleJourney.FIRST_CHAT]: {
    key: LifecycleJourney.FIRST_CHAT,
    steps: [{ delayHours: 48, template: LifecycleTemplate.FIRST_CHAT_PROMPTS }],
  },
  // Chatted, never paid, free credits for this month used up.
  // Trigger: last usage. Exit: purchase, or credits back (monthly reset).
  [LifecycleJourney.OUT_OF_CREDITS]: {
    key: LifecycleJourney.OUT_OF_CREDITS,
    steps: [{ delayHours: 2, template: LifecycleTemplate.OUT_OF_CREDITS }],
  },
  // Chatted before, quiet for 7 days. Trigger: last activity. Exit: comes back.
  [LifecycleJourney.WHATS_NEW]: {
    key: LifecycleJourney.WHATS_NEW,
    steps: [
      {
        delayHours: WHATS_NEW_AFTER_DAYS * DAY_HOURS,
        template: LifecycleTemplate.WHATS_NEW,
      },
    ],
  },
  // Chatted before, quiet for 30 days. Last journey email. Exit: comes back.
  [LifecycleJourney.WIN_BACK]: {
    key: LifecycleJourney.WIN_BACK,
    steps: [
      {
        delayHours: WIN_BACK_AFTER_DAYS * DAY_HOURS,
        template: LifecycleTemplate.WIN_BACK,
      },
    ],
  },
  // Confirmed newsletter subscriber without an account. The newsletter welcome
  // already went out on subscribe, so the invite waits 2 days. Exit: signup.
  [LifecycleJourney.NEWSLETTER_INVITE]: {
    key: LifecycleJourney.NEWSLETTER_INVITE,
    steps: [
      { delayHours: 48, template: LifecycleTemplate.INVITE_SIGNUP },
      { delayHours: 168, template: LifecycleTemplate.INVITE_REMINDER },
    ],
  },
};

export const LIFECYCLE_JOURNEY_LIST: readonly JourneyConfig[] = [
  LIFECYCLE_JOURNEYS[LifecycleJourney.FIRST_CHAT],
  LIFECYCLE_JOURNEYS[LifecycleJourney.OUT_OF_CREDITS],
  LIFECYCLE_JOURNEYS[LifecycleJourney.WHATS_NEW],
  LIFECYCLE_JOURNEYS[LifecycleJourney.WIN_BACK],
  LIFECYCLE_JOURNEYS[LifecycleJourney.NEWSLETTER_INVITE],
];

/** First-step delay of a journey (hours from its trigger). */
export function firstStepDelayHours(
  journey: typeof LifecycleJourneyValue,
): number {
  return LIFECYCLE_JOURNEYS[journey].steps[0].delayHours;
}
