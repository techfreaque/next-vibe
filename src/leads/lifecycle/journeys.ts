/**
 * Lifecycle journey definitions - data, not code.
 *
 * A journey is a sequence of steps. Each step = delay (hours, measured from the
 * previous step was sent; for step 0 from the trigger event or backfill start)
 * + email template. Entry and exit conditions live in eligibility.ts so they are
 * pure and unit tested.
 *
 * Design rules (2026-11-25 redesign, signed-up users):
 *  - One job per email, one call to action. Fewer, better emails.
 *  - Day 0 is the transactional signup welcome (user/public/signup/email.tsx).
 *    Unverified addresses get nothing from here, ever.
 *  - SERVICE journeys help a user use what they signed up for (first chat,
 *    credits ran out). They go to every verified account, no newsletter opt-in
 *    needed, and still honor unsubscribe/bounce suppression.
 *  - MARKETING journeys (what's new, win-back) need marketing consent or a
 *    confirmed newsletter opt-in while `requireUserMarketingConsent` is on.
 *  - Each journey runs at most once per contact (unique email+journey), one
 *    journey at a time, and the global cap keeps `minHoursBetweenEmails`
 *    between any two journey/campaign emails.
 */

import type { LifecycleJourneyValue, LifecycleTemplateValue } from "./enum";
import { LifecycleJourney, LifecycleTemplate } from "./enum";

export interface JourneyStep {
  delayHours: number;
  template: typeof LifecycleTemplateValue;
}

/** service = account help, no newsletter consent needed; marketing = needs consent. */
export type JourneyKind = "service" | "marketing";

export interface JourneyConfig {
  key: typeof LifecycleJourneyValue;
  kind: JourneyKind;
  steps: readonly JourneyStep[];
}

/** Days without chat activity before the "what's new" email. */
export const WHATS_NEW_AFTER_DAYS = 7;
/** Days without chat activity before the win-back email. */
export const WIN_BACK_AFTER_DAYS = 30;
/** Lapsed payers: days without activity before "why did you stop?". */
export const LAPSED_WINBACK_AFTER_DAYS = 14;
/**
 * A pool is "out of credits" when paid balance + this month's free credits left
 * drop below this. Cheap models still run below it, but most do not.
 */
export const OUT_OF_CREDITS_THRESHOLD = 5;
/** At most this many new model names are listed in one email. */
export const NEW_MODELS_LISTED = 3;

const DAY_HOURS = 24;

export const LIFECYCLE_JOURNEYS: Record<
  typeof LifecycleJourneyValue,
  JourneyConfig
> = {
  // Verified account, never chatted. Trigger: signup. Exit: first chat or purchase.
  // Day 1: three paste-ready first messages. Day 5: let a skill start the chat.
  [LifecycleJourney.FIRST_CHAT]: {
    key: LifecycleJourney.FIRST_CHAT,
    kind: "service",
    steps: [
      { delayHours: 24, template: LifecycleTemplate.FIRST_CHAT_PROMPTS },
      {
        delayHours: 4 * DAY_HOURS,
        template: LifecycleTemplate.FIRST_CHAT_SKILLS,
      },
    ],
  },
  // Chatted, never paid, this month's free credits used up.
  // Trigger: the usage that drained the pool. Exit: purchase, or credits back.
  [LifecycleJourney.OUT_OF_CREDITS]: {
    key: LifecycleJourney.OUT_OF_CREDITS,
    kind: "service",
    steps: [{ delayHours: 2, template: LifecycleTemplate.OUT_OF_CREDITS }],
  },
  // Chatted before, quiet for 7 days. Reason to return: models added since.
  // Trigger: last activity. Exit: comes back.
  [LifecycleJourney.WHATS_NEW]: {
    key: LifecycleJourney.WHATS_NEW,
    kind: "marketing",
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
    kind: "marketing",
    steps: [
      {
        delayHours: WIN_BACK_AFTER_DAYS * DAY_HOURS,
        template: LifecycleTemplate.WIN_BACK,
      },
    ],
  },
  // ACTIVE SUBSCRIBERS: relationship, not sales. Day 7 of the plan: what do
  // you like, what's missing. ~5 weeks later: what should we build next.
  // Pure feedback asks, no promotion, so they count as service mail to a
  // paying customer. Exit: the plan ends (ineligible).
  [LifecycleJourney.CUSTOMER_CHECKIN]: {
    key: LifecycleJourney.CUSTOMER_CHECKIN,
    kind: "service",
    steps: [
      { delayHours: 7 * DAY_HOURS, template: LifecycleTemplate.CUSTOMER_LIKES },
      {
        delayHours: 30 * DAY_HOURS,
        template: LifecycleTemplate.CUSTOMER_BUILD_NEXT,
      },
    ],
  },
  // LAPSED PAYERS (paid before, no live plan), quiet 14 days: why did you
  // stop, plus models added since. Marketing (has news). Exit: back or resubscribed.
  [LifecycleJourney.LAPSED_WINBACK]: {
    key: LifecycleJourney.LAPSED_WINBACK,
    kind: "marketing",
    steps: [
      {
        delayHours: LAPSED_WINBACK_AFTER_DAYS * DAY_HOURS,
        template: LifecycleTemplate.LAPSED_WINBACK,
      },
    ],
  },
  // LEAD journey (not a signed-up user): confirmed newsletter subscriber
  // without an account. The newsletter welcome already went out on subscribe,
  // so the invite waits 2 days. Exit: signup.
  [LifecycleJourney.NEWSLETTER_INVITE]: {
    key: LifecycleJourney.NEWSLETTER_INVITE,
    kind: "marketing",
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
  LIFECYCLE_JOURNEYS[LifecycleJourney.CUSTOMER_CHECKIN],
  LIFECYCLE_JOURNEYS[LifecycleJourney.LAPSED_WINBACK],
];

/** First-step delay of a journey (hours from its trigger). */
export function firstStepDelayHours(
  journey: typeof LifecycleJourneyValue,
): number {
  return LIFECYCLE_JOURNEYS[journey].steps[0].delayHours;
}

/** Does this journey need marketing consent (when the setting requires it)? */
export function journeyNeedsMarketingConsent(
  journey: typeof LifecycleJourneyValue,
): boolean {
  return LIFECYCLE_JOURNEYS[journey].kind === "marketing";
}
