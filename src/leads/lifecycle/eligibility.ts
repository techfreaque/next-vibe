/**
 * Lifecycle eligibility - pure functions, no DB, no IO.
 *
 * Consent model (hard rules):
 *  - Registered users: service relationship. Verified address, active, not banned.
 *    Marketing consent (or a confirmed newsletter opt-in) is required unless the
 *    admin explicitly relaxes `requireUserMarketingConsent`.
 *  - Newsletter-only contacts: ONLY status SUBSCRIBED + confirmedAt set + marketing consent.
 *    Pending, unsubscribed, bounced and complained addresses are never mailed.
 *  - Any unsubscribe / bounce / complaint / invalid marker anywhere suppresses the contact.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { LeadStatus } from "next-vibe/identity/lead/enum";

import { NewsletterSubscriptionStatus } from "@/newsletter/enum";

import type { LifecycleJourneyValue } from "./enum";
import { LifecycleJourney } from "./enum";

export interface ContactSnapshot {
  /** Lower-cased email. */
  email: string;
  userId: string | null;
  leadId: string | null;
  locale: CountryLanguage | null;
  user: {
    emailVerified: boolean;
    isActive: boolean;
    isBanned: boolean;
    marketingConsent: boolean;
    createdAt: Date;
  } | null;
  hasChatted: boolean;
  lastChatAt: Date | null;
  isPaid: boolean;
  newsletter: {
    status: string;
    confirmedAt: Date | null;
    marketingConsent: boolean;
  } | null;
  leadStatus: string | null;
  /** Latest lifecycle send OR campaign send to this contact. */
  lastEmailAt: Date | null;
}

export interface EligibilitySettings {
  requireUserMarketingConsent: boolean;
}

export const HeldReason = {
  SUPPRESSED: "suppressed",
  PAID: "paid",
  NO_CONSENT: "noConsent",
  UNVERIFIED: "unverified",
  PENDING_NEWSLETTER: "pendingNewsletter",
  INACTIVE_ACCOUNT: "inactiveAccount",
} as const;
export type HeldReasonValue = (typeof HeldReason)[keyof typeof HeldReason];

export type Classification =
  | {
      journey: typeof LifecycleJourneyValue;
      /** Timestamp the journey is anchored on (signup / last chat / confirmation). */
      triggerAt: Date;
      held: null;
    }
  | { journey: null; held: HeldReasonValue };

/** True when an unsubscribe, bounce, complaint or invalid marker exists. */
export function isSuppressed(snapshot: ContactSnapshot): boolean {
  const newsletterBlocked =
    snapshot.newsletter !== null &&
    (snapshot.newsletter.status === NewsletterSubscriptionStatus.UNSUBSCRIBED ||
      snapshot.newsletter.status === NewsletterSubscriptionStatus.BOUNCED ||
      snapshot.newsletter.status === NewsletterSubscriptionStatus.COMPLAINED);
  const leadBlocked =
    snapshot.leadStatus === LeadStatus.UNSUBSCRIBED ||
    snapshot.leadStatus === LeadStatus.BOUNCED ||
    snapshot.leadStatus === LeadStatus.INVALID;
  return newsletterBlocked || leadBlocked;
}

/** Explicit opt-out (vs. a bounce) - drives the exit reason. */
export function hasUnsubscribed(snapshot: ContactSnapshot): boolean {
  return (
    snapshot.newsletter?.status === NewsletterSubscriptionStatus.UNSUBSCRIBED ||
    snapshot.leadStatus === LeadStatus.UNSUBSCRIBED
  );
}

export function hasConfirmedNewsletterOptIn(
  snapshot: ContactSnapshot,
): snapshot is ContactSnapshot & {
  newsletter: { status: string; confirmedAt: Date; marketingConsent: boolean };
} {
  return (
    snapshot.newsletter !== null &&
    snapshot.newsletter.status === NewsletterSubscriptionStatus.SUBSCRIBED &&
    snapshot.newsletter.confirmedAt !== null &&
    snapshot.newsletter.marketingConsent
  );
}

/** Decide which journey (if any) a contact belongs to, or why they are held back. */
export function classifyContact(
  snapshot: ContactSnapshot,
  settings: EligibilitySettings,
): Classification {
  if (isSuppressed(snapshot)) {
    return { journey: null, held: HeldReason.SUPPRESSED };
  }

  if (snapshot.user) {
    if (!snapshot.user.isActive || snapshot.user.isBanned) {
      return { journey: null, held: HeldReason.INACTIVE_ACCOUNT };
    }
    if (snapshot.isPaid) {
      return { journey: null, held: HeldReason.PAID };
    }
    const optIn = hasConfirmedNewsletterOptIn(snapshot);
    if (!snapshot.user.emailVerified && !optIn) {
      return { journey: null, held: HeldReason.UNVERIFIED };
    }
    if (
      settings.requireUserMarketingConsent &&
      !snapshot.user.marketingConsent &&
      !optIn
    ) {
      return { journey: null, held: HeldReason.NO_CONSENT };
    }
    if (snapshot.hasChatted) {
      return {
        journey: LifecycleJourney.ENGAGED_FREE,
        triggerAt: snapshot.lastChatAt ?? snapshot.user.createdAt,
        held: null,
      };
    }
    return {
      journey: LifecycleJourney.INACTIVE_USER,
      triggerAt: snapshot.user.createdAt,
      held: null,
    };
  }

  if (hasConfirmedNewsletterOptIn(snapshot)) {
    return {
      journey: LifecycleJourney.NEWSLETTER_INVITE,
      triggerAt: snapshot.newsletter.confirmedAt,
      held: null,
    };
  }
  return { journey: null, held: HeldReason.PENDING_NEWSLETTER };
}

/** Has the journey goal been reached? (exit quietly) */
export function isGoalMet(
  journey: typeof LifecycleJourneyValue,
  snapshot: ContactSnapshot,
): boolean {
  switch (journey) {
    case LifecycleJourney.INACTIVE_USER:
      return snapshot.hasChatted || snapshot.isPaid;
    case LifecycleJourney.ENGAGED_FREE:
      return snapshot.isPaid;
    case LifecycleJourney.NEWSLETTER_INVITE:
      return snapshot.user !== null;
  }
}

const HOUR_MS = 3_600_000;

/** Earliest moment the frequency cap lets another email go out. */
export function capReleaseAt(
  lastEmailAt: Date | null,
  minHoursBetweenEmails: number,
): Date | null {
  if (!lastEmailAt) {
    return null;
  }
  return new Date(lastEmailAt.getTime() + minHoursBetweenEmails * HOUR_MS);
}

export function capAllows(
  lastEmailAt: Date | null,
  now: Date,
  minHoursBetweenEmails: number,
): boolean {
  const release = capReleaseAt(lastEmailAt, minHoursBetweenEmails);
  return release === null || release.getTime() <= now.getTime();
}

/**
 * Backfill send window: spread `total` contacts evenly over `spreadHours`
 * starting at `start`. Position `index` (0-based).
 */
export function staggerDueAt(
  index: number,
  total: number,
  start: Date,
  spreadHours: number,
): Date {
  if (total <= 1 || spreadHours <= 0) {
    return start;
  }
  const offset = Math.floor((index / total) * spreadHours * HOUR_MS);
  return new Date(start.getTime() + offset);
}
