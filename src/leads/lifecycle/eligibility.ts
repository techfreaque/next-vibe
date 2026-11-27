/**
 * Lifecycle eligibility - pure functions, no DB, no IO.
 *
 * Consent model (hard rules):
 *  - Registered users: verified address, active, not banned. SERVICE journeys
 *    (first chat, out of credits) need nothing more. MARKETING journeys (what's
 *    new, win-back) also need marketing consent or a confirmed newsletter opt-in
 *    unless the admin explicitly relaxes `requireUserMarketingConsent`.
 *  - Newsletter-only contacts: ONLY status SUBSCRIBED + confirmedAt set + marketing consent.
 *    Pending, unsubscribed, bounced and complained addresses are never mailed.
 *  - Any unsubscribe / bounce / complaint / invalid marker anywhere suppresses the contact.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { LeadStatus } from "next-vibe/identity/lead/enum";

import { NewsletterSubscriptionStatus } from "@/newsletter/enum";

import type { LifecycleJourneyValue } from "./enum";
import { LifecycleJourney } from "./enum";
import {
  journeyNeedsMarketingConsent,
  LAPSED_WINBACK_AFTER_DAYS,
  WHATS_NEW_AFTER_DAYS,
  WIN_BACK_AFTER_DAYS,
} from "./journeys";

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
  /** Real money ever (payment, subscription, first paid). Admin grants don't count. */
  isPaid: boolean;
  segment: PaymentSegmentValue;
  /** Start of the live subscription (ACTIVE / TRIALING / PAST_DUE), else null. */
  activeSubSince: Date | null;
  newsletter: {
    status: string;
    confirmedAt: Date | null;
    marketingConsent: boolean;
  } | null;
  leadStatus: string | null;
  /** Latest lifecycle send OR campaign send to this contact. */
  lastEmailAt: Date | null;
}

/**
 * Who the user is to us right now. Decides which journeys they can get:
 *  - neverPaid: activation + value; plans only as a plain link with consent.
 *  - activeSub: paying customer; no sales, no credit nags; feedback check-ins.
 *  - lapsed: paid before (subscription ended, or packs only), no live plan.
 *  - granted: credits only from admin grants (testers, creators); no sales.
 */
export const PaymentSegment = {
  NEVER_PAID: "neverPaid",
  ACTIVE_SUB: "activeSub",
  LAPSED: "lapsed",
  GRANTED: "granted",
} as const;
export type PaymentSegmentValue =
  (typeof PaymentSegment)[keyof typeof PaymentSegment];

export function paymentSegment(flags: {
  paid: boolean;
  activeSub: boolean;
  granted: boolean;
}): PaymentSegmentValue {
  if (flags.activeSub) {
    return PaymentSegment.ACTIVE_SUB;
  }
  if (flags.paid) {
    return PaymentSegment.LAPSED;
  }
  return flags.granted ? PaymentSegment.GRANTED : PaymentSegment.NEVER_PAID;
}

/** May this user see a plain "see the plans" link? */
export function mayMentionPlans(snapshot: ContactSnapshot): boolean {
  const consent =
    hasConfirmedNewsletterOptIn(snapshot) ||
    snapshot.user?.marketingConsent === true;
  return (
    consent &&
    (snapshot.segment === PaymentSegment.NEVER_PAID ||
      snapshot.segment === PaymentSegment.LAPSED)
  );
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

/**
 * Transactional billing notices (payment failed) ignore marketing opt-outs but
 * never go to an unverified, inactive, banned, bounced or complaining address.
 */
export function canSendBillingNotice(snapshot: ContactSnapshot): boolean {
  if (!snapshot.user) {
    return false;
  }
  const { emailVerified, isActive, isBanned } = snapshot.user;
  const hardBlocked =
    snapshot.leadStatus === LeadStatus.BOUNCED ||
    snapshot.leadStatus === LeadStatus.INVALID ||
    snapshot.newsletter?.status === NewsletterSubscriptionStatus.BOUNCED ||
    snapshot.newsletter?.status === NewsletterSubscriptionStatus.COMPLAINED;
  return emailVerified && isActive && !isBanned && !hardBlocked;
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

/** Which journey a lawful, verified account is due for (consent not checked here). */
function classifyAccount(
  snapshot: ContactSnapshot,
  user: NonNullable<ContactSnapshot["user"]>,
  now: Date,
): Classification {
  // Paying customers: feedback check-ins only. No sales, no credit nags.
  if (snapshot.segment === PaymentSegment.ACTIVE_SUB) {
    return journey(
      LifecycleJourney.CUSTOMER_CHECKIN,
      snapshot.activeSubSince ?? user.createdAt,
    );
  }
  const lastActive =
    snapshot.lastActivityAt ?? snapshot.lastChatAt ?? user.createdAt;
  const quietMs = now.getTime() - lastActive.getTime();
  // Paid before, no live plan: one respectful "why did you stop?".
  if (snapshot.segment === PaymentSegment.LAPSED) {
    if (quietMs >= LAPSED_WINBACK_AFTER_DAYS * DAY_MS) {
      return journey(LifecycleJourney.LAPSED_WINBACK, lastActive);
    }
    if (snapshot.outOfCreditsAt) {
      return journey(LifecycleJourney.OUT_OF_CREDITS, snapshot.outOfCreditsAt);
    }
    return { journey: null, held: HeldReason.NOTHING_DUE };
  }
  // Never paid (or credits only from admin grants): activation and value.
  if (!snapshot.hasChatted) {
    return journey(LifecycleJourney.FIRST_CHAT, user.createdAt);
  }
  if (quietMs >= WIN_BACK_AFTER_DAYS * DAY_MS) {
    return journey(LifecycleJourney.WIN_BACK, lastActive);
  }
  // Drained: stay in OUT_OF_CREDITS until the monthly refill, so nobody gets
  // "new models" pitched while they cannot use them.
  if (snapshot.outOfCreditsAt) {
    return journey(LifecycleJourney.OUT_OF_CREDITS, snapshot.outOfCreditsAt);
  }
  if (quietMs >= WHATS_NEW_AFTER_DAYS * DAY_MS) {
    return journey(LifecycleJourney.WHATS_NEW, lastActive);
  }
  return { journey: null, held: HeldReason.NOTHING_DUE };
}

/**
 * Decide which journey (if any) a contact belongs to right now, or why they are
 * held back. States are mutually exclusive, checked in this order:
 *   no account + confirmed newsletter -> NEWSLETTER_INVITE
 *   active subscriber                 -> CUSTOMER_CHECKIN (service: pure feedback ask)
 *   lapsed payer, quiet >= 14 days    -> LAPSED_WINBACK   (marketing)
 *   lapsed payer, pool drained        -> OUT_OF_CREDITS   (service)
 *   never paid / granted:
 *     never chatted                   -> FIRST_CHAT       (service)
 *     quiet >= 30 days                -> WIN_BACK         (marketing)
 *     pool drained                    -> OUT_OF_CREDITS   (service, until refill)
 *     quiet >= 7 days                 -> WHATS_NEW        (marketing)
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
    const due = classifyAccount(snapshot, snapshot.user, now);
    if (due.journey === null) {
      return due;
    }
    // Service journeys (first chat, out of credits) help the user use the
    // account they made. Marketing journeys need an opt-in.
    if (
      settings.requireUserMarketingConsent &&
      journeyNeedsMarketingConsent(due.journey) &&
      !snapshot.user.marketingConsent &&
      !optIn
    ) {
      return { journey: null, held: HeldReason.NO_CONSENT };
    }
    return due;
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
  const cameBack =
    snapshot.lastActivityAt !== null &&
    snapshot.lastActivityAt.getTime() > enrolledAt.getTime();
  switch (key) {
    case LifecycleJourney.FIRST_CHAT:
      return snapshot.hasChatted || snapshot.isPaid;
    case LifecycleJourney.OUT_OF_CREDITS:
      return snapshot.segment === PaymentSegment.ACTIVE_SUB;
    case LifecycleJourney.WHATS_NEW:
    case LifecycleJourney.WIN_BACK:
      return cameBack;
    case LifecycleJourney.LAPSED_WINBACK:
      return cameBack || snapshot.segment === PaymentSegment.ACTIVE_SUB;
    case LifecycleJourney.CUSTOMER_CHECKIN:
      // Runs its course while they pay; a lapse makes it ineligible instead.
      return false;
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
