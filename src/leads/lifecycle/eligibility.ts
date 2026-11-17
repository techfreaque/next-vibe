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
import { WHATS_NEW_AFTER_DAYS, WIN_BACK_AFTER_DAYS } from "./journeys";

export interface ContactSnapshot {
  /** Lower-cased email. */
  email: string;
  userId: string | null;
  leadId: string | null;
  locale: CountryLanguage | null;
  /** Account first name for the greeting (privateName), null for newsletter-only. */
  name: string | null;
  user: {
    emailVerified: boolean;
    isActive: boolean;
    isBanned: boolean;
    marketingConsent: boolean;
    createdAt: Date;
  } | null;
  hasChatted: boolean;
  lastChatAt: Date | null;
  /** Latest chat activity: newest thread or credit usage, whichever is later. */
  lastActivityAt: Date | null;
  /**
   * Set when the account's pool (paid balance + this month's free credits) is
   * below OUT_OF_CREDITS_THRESHOLD: time of the usage that drained it.
   */
  outOfCreditsAt: Date | null;
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
  /** Lawful to mail, but nothing is due: active, has credits, or never chatted while paid. */
  NOTHING_DUE: "nothingDue",
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

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

function journey(
  key: typeof LifecycleJourneyValue,
  triggerAt: Date,
): Classification {
  return { journey: key, triggerAt, held: null };
}

/**
 * Decide which journey (if any) a contact belongs to right now, or why they are
 * held back. States are mutually exclusive, checked in this order:
 *   no account + confirmed newsletter -> NEWSLETTER_INVITE
 *   account, never chatted, not paid  -> FIRST_CHAT
 *   chatted, quiet >= 30 days         -> WIN_BACK   (paid users too)
 *   chatted, quiet >= 7 days          -> WHATS_NEW  (paid users too)
 *   chatted, not paid, pool drained   -> OUT_OF_CREDITS
 * `triggerAt` is when the state began; the journey's first-step delay counts from it.
 */
export function classifyContact(
  snapshot: ContactSnapshot,
  settings: EligibilitySettings,
  now: Date,
): Classification {
  if (isSuppressed(snapshot)) {
    return { journey: null, held: HeldReason.SUPPRESSED };
  }

  if (snapshot.user) {
    if (!snapshot.user.isActive || snapshot.user.isBanned) {
      return { journey: null, held: HeldReason.INACTIVE_ACCOUNT };
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
    if (!snapshot.hasChatted) {
      return snapshot.isPaid
        ? { journey: null, held: HeldReason.PAID }
        : journey(LifecycleJourney.FIRST_CHAT, snapshot.user.createdAt);
    }
    const lastActive =
      snapshot.lastActivityAt ?? snapshot.lastChatAt ?? snapshot.user.createdAt;
    const quietMs = now.getTime() - lastActive.getTime();
    if (quietMs >= WIN_BACK_AFTER_DAYS * DAY_MS) {
      return journey(LifecycleJourney.WIN_BACK, lastActive);
    }
    if (quietMs >= WHATS_NEW_AFTER_DAYS * DAY_MS) {
      return journey(LifecycleJourney.WHATS_NEW, lastActive);
    }
    if (!snapshot.isPaid && snapshot.outOfCreditsAt) {
      return journey(LifecycleJourney.OUT_OF_CREDITS, snapshot.outOfCreditsAt);
    }
    return {
      journey: null,
      held: snapshot.isPaid ? HeldReason.PAID : HeldReason.NOTHING_DUE,
    };
  }

  if (hasConfirmedNewsletterOptIn(snapshot)) {
    return journey(
      LifecycleJourney.NEWSLETTER_INVITE,
      snapshot.newsletter.confirmedAt,
    );
  }
  return { journey: null, held: HeldReason.PENDING_NEWSLETTER };
}

/** Has the journey goal been reached? (exit quietly) */
export function isGoalMet(
  key: typeof LifecycleJourneyValue,
  snapshot: ContactSnapshot,
  enrolledAt: Date,
): boolean {
  switch (key) {
    case LifecycleJourney.FIRST_CHAT:
      return snapshot.hasChatted || snapshot.isPaid;
    case LifecycleJourney.OUT_OF_CREDITS:
      return snapshot.isPaid;
    case LifecycleJourney.WHATS_NEW:
    case LifecycleJourney.WIN_BACK:
      // Came back after we enrolled them.
      return (
        snapshot.lastActivityAt !== null &&
        snapshot.lastActivityAt.getTime() > enrolledAt.getTime()
      );
    case LifecycleJourney.NEWSLETTER_INVITE:
      return snapshot.user !== null;
  }
}

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
