/**
 * Lifecycle eligibility - pure rules (no DB).
 */

import { LeadStatus } from "next-vibe/identity/lead/enum";
import { describe, expect, it } from "vitest";

import { NewsletterSubscriptionStatus } from "@/newsletter/enum";

import type { ContactSnapshot } from "./eligibility";
import {
  capAllows,
  classifyContact,
  HeldReason,
  isGoalMet,
  isSuppressed,
  staggerDueAt,
} from "./eligibility";
import { LifecycleJourney } from "./enum";

const NOW = new Date("2026-11-07T12:00:00Z");
const strict = { requireUserMarketingConsent: true };
const relaxed = { requireUserMarketingConsent: false };

function snapshot(patch: Partial<ContactSnapshot>): ContactSnapshot {
  return {
    email: "a@example-test.invalid",
    userId: null,
    leadId: null,
    locale: null,
    user: null,
    hasChatted: false,
    lastChatAt: null,
    isPaid: false,
    newsletter: null,
    leadStatus: null,
    lastEmailAt: null,
    ...patch,
  };
}

const goodUser: NonNullable<ContactSnapshot["user"]> = {
  emailVerified: true,
  isActive: true,
  isBanned: false,
  marketingConsent: true,
  createdAt: new Date("2026-11-01T00:00:00Z"),
};

const confirmed = {
  status: NewsletterSubscriptionStatus.SUBSCRIBED,
  confirmedAt: new Date("2026-11-02T00:00:00Z"),
  marketingConsent: true,
};

describe("classifyContact", () => {
  it("registered user who never chatted -> INACTIVE_USER", () => {
    const c = classifyContact(snapshot({ userId: "u", user: goodUser }), strict);
    expect(c.journey).toBe(LifecycleJourney.INACTIVE_USER);
  });

  it("registered user who chatted but never paid -> ENGAGED_FREE", () => {
    const c = classifyContact(
      snapshot({ userId: "u", user: goodUser, hasChatted: true }),
      strict,
    );
    expect(c.journey).toBe(LifecycleJourney.ENGAGED_FREE);
  });

  it("confirmed newsletter subscriber without account -> NEWSLETTER_INVITE", () => {
    const c = classifyContact(snapshot({ newsletter: confirmed }), strict);
    expect(c.journey).toBe(LifecycleJourney.NEWSLETTER_INVITE);
  });

  it("PENDING (unconfirmed) newsletter address is never mailed", () => {
    const pending = {
      status: NewsletterSubscriptionStatus.PENDING,
      confirmedAt: null,
      marketingConsent: true,
    };
    expect(classifyContact(snapshot({ newsletter: pending }), strict)).toEqual({
      journey: null,
      held: HeldReason.PENDING_NEWSLETTER,
    });
    // SUBSCRIBED without confirmation is not enough either
    const unconfirmed = { ...confirmed, confirmedAt: null };
    expect(
      classifyContact(snapshot({ newsletter: unconfirmed }), strict).journey,
    ).toBeNull();
  });

  it("newsletter row without marketing consent is never mailed", () => {
    const c = classifyContact(
      snapshot({ newsletter: { ...confirmed, marketingConsent: false } }),
      strict,
    );
    expect(c.journey).toBeNull();
  });

  it("unsubscribed / bounced / complained newsletter rows are suppressed", () => {
    for (const status of [
      NewsletterSubscriptionStatus.UNSUBSCRIBED,
      NewsletterSubscriptionStatus.BOUNCED,
      NewsletterSubscriptionStatus.COMPLAINED,
    ]) {
      const c = classifyContact(
        snapshot({ userId: "u", user: goodUser, newsletter: { ...confirmed, status } }),
        relaxed,
      );
      expect(c).toEqual({ journey: null, held: HeldReason.SUPPRESSED });
    }
  });

  it("unsubscribed / bounced / invalid leads are suppressed", () => {
    for (const leadStatus of [
      LeadStatus.UNSUBSCRIBED,
      LeadStatus.BOUNCED,
      LeadStatus.INVALID,
    ]) {
      expect(
        isSuppressed(snapshot({ userId: "u", user: goodUser, leadStatus })),
      ).toBe(true);
    }
  });

  it("already paid users are excluded", () => {
    const c = classifyContact(
      snapshot({ userId: "u", user: goodUser, hasChatted: true, isPaid: true }),
      strict,
    );
    expect(c).toEqual({ journey: null, held: HeldReason.PAID });
  });

  it("users without marketing consent are held unless consent mode is relaxed", () => {
    const noConsent = { ...goodUser, marketingConsent: false };
    expect(
      classifyContact(snapshot({ userId: "u", user: noConsent }), strict),
    ).toEqual({ journey: null, held: HeldReason.NO_CONSENT });
    expect(
      classifyContact(snapshot({ userId: "u", user: noConsent }), relaxed)
        .journey,
    ).toBe(LifecycleJourney.INACTIVE_USER);
  });

  it("a confirmed newsletter opt-in counts as consent for a registered user", () => {
    const noConsent = { ...goodUser, marketingConsent: false };
    expect(
      classifyContact(
        snapshot({ userId: "u", user: noConsent, newsletter: confirmed }),
        strict,
      ).journey,
    ).toBe(LifecycleJourney.INACTIVE_USER);
  });

  it("unverified, banned and inactive users are held", () => {
    expect(
      classifyContact(
        snapshot({ userId: "u", user: { ...goodUser, emailVerified: false } }),
        strict,
      ),
    ).toEqual({ journey: null, held: HeldReason.UNVERIFIED });
    expect(
      classifyContact(
        snapshot({ userId: "u", user: { ...goodUser, isBanned: true } }),
        strict,
      ).held,
    ).toBe(HeldReason.INACTIVE_ACCOUNT);
    expect(
      classifyContact(
        snapshot({ userId: "u", user: { ...goodUser, isActive: false } }),
        strict,
      ).held,
    ).toBe(HeldReason.INACTIVE_ACCOUNT);
  });
});

describe("isGoalMet", () => {
  it("INACTIVE_USER exits on first chat or purchase", () => {
    const base = snapshot({ userId: "u", user: goodUser });
    expect(isGoalMet(LifecycleJourney.INACTIVE_USER, base)).toBe(false);
    expect(
      isGoalMet(LifecycleJourney.INACTIVE_USER, { ...base, hasChatted: true }),
    ).toBe(true);
    expect(
      isGoalMet(LifecycleJourney.INACTIVE_USER, { ...base, isPaid: true }),
    ).toBe(true);
  });

  it("ENGAGED_FREE exits only on purchase", () => {
    const base = snapshot({ userId: "u", user: goodUser, hasChatted: true });
    expect(isGoalMet(LifecycleJourney.ENGAGED_FREE, base)).toBe(false);
    expect(
      isGoalMet(LifecycleJourney.ENGAGED_FREE, { ...base, isPaid: true }),
    ).toBe(true);
  });

  it("NEWSLETTER_INVITE exits on signup", () => {
    expect(
      isGoalMet(LifecycleJourney.NEWSLETTER_INVITE, snapshot({ newsletter: confirmed })),
    ).toBe(false);
    expect(
      isGoalMet(
        LifecycleJourney.NEWSLETTER_INVITE,
        snapshot({ newsletter: confirmed, userId: "u", user: goodUser }),
      ),
    ).toBe(true);
  });
});

describe("frequency cap", () => {
  it("blocks within the window, allows after it", () => {
    const sentAt = new Date(NOW.getTime() - 47 * 3_600_000);
    expect(capAllows(sentAt, NOW, 48)).toBe(false);
    expect(capAllows(new Date(NOW.getTime() - 48 * 3_600_000), NOW, 48)).toBe(true);
    expect(capAllows(null, NOW, 48)).toBe(true);
  });
});

describe("staggerDueAt", () => {
  it("spreads evenly across the window and never beyond it", () => {
    const total = 10;
    const dues = Array.from({ length: total }, (_, i) =>
      staggerDueAt(i, total, NOW, 72).getTime(),
    );
    expect(dues[0]).toBe(NOW.getTime());
    expect(Math.max(...dues)).toBeLessThan(NOW.getTime() + 72 * 3_600_000);
    expect(dues).toEqual(dues.toSorted((a, b) => a - b));
    expect(new Set(dues).size).toBe(total);
  });

  it("single contact starts immediately", () => {
    expect(staggerDueAt(0, 1, NOW, 72)).toEqual(NOW);
  });
});
