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
const DAY = 24 * 3_600_000;
const daysAgo = (d: number): Date => new Date(NOW.getTime() - d * DAY);
const strict = { requireUserMarketingConsent: true };
const relaxed = { requireUserMarketingConsent: false };

function snapshot(patch: Partial<ContactSnapshot>): ContactSnapshot {
  return {
    email: "a@example-test.invalid",
    userId: null,
    leadId: null,
    locale: null,
    user: null,
    name: null,
    hasChatted: false,
    lastChatAt: null,
    lastActivityAt: null,
    outOfCreditsAt: null,
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
  it("registered user who never chatted -> FIRST_CHAT anchored on signup", () => {
    const c = classifyContact(
      snapshot({ userId: "u", user: goodUser }),
      strict,
      NOW,
    );
    expect(c).toEqual({
      journey: LifecycleJourney.FIRST_CHAT,
      triggerAt: goodUser.createdAt,
      held: null,
    });
  });

  it("active chatter with credits -> nothing due", () => {
    const c = classifyContact(
      snapshot({
        userId: "u",
        user: goodUser,
        hasChatted: true,
        lastActivityAt: daysAgo(1),
      }),
      strict,
      NOW,
    );
    expect(c).toEqual({ journey: null, held: HeldReason.NOTHING_DUE });
  });

  it("drained free pool, never paid -> OUT_OF_CREDITS anchored on the draining usage", () => {
    const drainedAt = daysAgo(0.5);
    const c = classifyContact(
      snapshot({
        userId: "u",
        user: goodUser,
        hasChatted: true,
        lastActivityAt: drainedAt,
        outOfCreditsAt: drainedAt,
      }),
      strict,
      NOW,
    );
    expect(c).toEqual({
      journey: LifecycleJourney.OUT_OF_CREDITS,
      triggerAt: drainedAt,
      held: null,
    });
    // Paid users never get the out-of-credits email
    expect(
      classifyContact(
        snapshot({
          userId: "u",
          user: goodUser,
          hasChatted: true,
          isPaid: true,
          lastActivityAt: drainedAt,
          outOfCreditsAt: drainedAt,
        }),
        strict,
        NOW,
      ),
    ).toEqual({ journey: null, held: HeldReason.PAID });
  });

  it("quiet 7-29 days -> WHATS_NEW, 30+ days -> WIN_BACK, paid users included", () => {
    const quiet = (
      days: number,
      isPaid: boolean,
    ): ReturnType<typeof classifyContact> =>
      classifyContact(
        snapshot({
          userId: "u",
          user: goodUser,
          hasChatted: true,
          isPaid,
          lastActivityAt: daysAgo(days),
        }),
        strict,
        NOW,
      );
    expect(quiet(6.9, false).journey).toBeNull();
    expect(quiet(7, false)).toEqual({
      journey: LifecycleJourney.WHATS_NEW,
      triggerAt: daysAgo(7),
      held: null,
    });
    expect(quiet(29, true).journey).toBe(LifecycleJourney.WHATS_NEW);
    expect(quiet(30, false).journey).toBe(LifecycleJourney.WIN_BACK);
    expect(quiet(200, true).journey).toBe(LifecycleJourney.WIN_BACK);
  });

  it("inactivity wins over a drained pool (they left, don't sell to them)", () => {
    const c = classifyContact(
      snapshot({
        userId: "u",
        user: goodUser,
        hasChatted: true,
        lastActivityAt: daysAgo(8),
        outOfCreditsAt: daysAgo(8),
      }),
      strict,
      NOW,
    );
    expect(c.journey).toBe(LifecycleJourney.WHATS_NEW);
  });

  it("confirmed newsletter subscriber without account -> NEWSLETTER_INVITE", () => {
    const c = classifyContact(snapshot({ newsletter: confirmed }), strict, NOW);
    expect(c.journey).toBe(LifecycleJourney.NEWSLETTER_INVITE);
  });

  it("PENDING (unconfirmed) newsletter address is never mailed", () => {
    const pending = {
      status: NewsletterSubscriptionStatus.PENDING,
      confirmedAt: null,
      marketingConsent: true,
    };
    expect(
      classifyContact(snapshot({ newsletter: pending }), strict, NOW),
    ).toEqual({
      journey: null,
      held: HeldReason.PENDING_NEWSLETTER,
    });
    // SUBSCRIBED without confirmation is not enough either
    const unconfirmed = { ...confirmed, confirmedAt: null };
    expect(
      classifyContact(snapshot({ newsletter: unconfirmed }), strict, NOW)
        .journey,
    ).toBeNull();
  });

  it("newsletter row without marketing consent is never mailed", () => {
    const c = classifyContact(
      snapshot({ newsletter: { ...confirmed, marketingConsent: false } }),
      strict,
      NOW,
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
        snapshot({
          userId: "u",
          user: goodUser,
          newsletter: { ...confirmed, status },
        }),
        relaxed,
        NOW,
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
      NOW,
    );
    expect(c).toEqual({ journey: null, held: HeldReason.PAID });
  });

  it("users without marketing consent are held unless consent mode is relaxed", () => {
    const noConsent = { ...goodUser, marketingConsent: false };
    expect(
      classifyContact(snapshot({ userId: "u", user: noConsent }), strict, NOW),
    ).toEqual({ journey: null, held: HeldReason.NO_CONSENT });
    expect(
      classifyContact(snapshot({ userId: "u", user: noConsent }), relaxed, NOW)
        .journey,
    ).toBe(LifecycleJourney.FIRST_CHAT);
  });

  it("a confirmed newsletter opt-in counts as consent for a registered user", () => {
    const noConsent = { ...goodUser, marketingConsent: false };
    expect(
      classifyContact(
        snapshot({ userId: "u", user: noConsent, newsletter: confirmed }),
        strict,
        NOW,
      ).journey,
    ).toBe(LifecycleJourney.FIRST_CHAT);
  });

  it("unverified, banned and inactive users are held", () => {
    expect(
      classifyContact(
        snapshot({ userId: "u", user: { ...goodUser, emailVerified: false } }),
        strict,
        NOW,
      ),
    ).toEqual({ journey: null, held: HeldReason.UNVERIFIED });
    expect(
      classifyContact(
        snapshot({ userId: "u", user: { ...goodUser, isBanned: true } }),
        strict,
        NOW,
      ).held,
    ).toBe(HeldReason.INACTIVE_ACCOUNT);
    expect(
      classifyContact(
        snapshot({ userId: "u", user: { ...goodUser, isActive: false } }),
        strict,
        NOW,
      ).held,
    ).toBe(HeldReason.INACTIVE_ACCOUNT);
  });
});

describe("isGoalMet", () => {
  const enrolledAt = daysAgo(1);

  it("FIRST_CHAT exits on first chat or purchase", () => {
    const base = snapshot({ userId: "u", user: goodUser });
    expect(isGoalMet(LifecycleJourney.FIRST_CHAT, base, enrolledAt)).toBe(
      false,
    );
    expect(
      isGoalMet(
        LifecycleJourney.FIRST_CHAT,
        { ...base, hasChatted: true },
        enrolledAt,
      ),
    ).toBe(true);
    expect(
      isGoalMet(
        LifecycleJourney.FIRST_CHAT,
        { ...base, isPaid: true },
        enrolledAt,
      ),
    ).toBe(true);
  });

  it("OUT_OF_CREDITS exits only on purchase", () => {
    const base = snapshot({ userId: "u", user: goodUser, hasChatted: true });
    expect(isGoalMet(LifecycleJourney.OUT_OF_CREDITS, base, enrolledAt)).toBe(
      false,
    );
    expect(
      isGoalMet(
        LifecycleJourney.OUT_OF_CREDITS,
        { ...base, isPaid: true },
        enrolledAt,
      ),
    ).toBe(true);
  });

  it("WHATS_NEW / WIN_BACK exit when the contact comes back after enrollment", () => {
    for (const journey of [
      LifecycleJourney.WHATS_NEW,
      LifecycleJourney.WIN_BACK,
    ]) {
      const before = snapshot({
        userId: "u",
        user: goodUser,
        hasChatted: true,
        lastActivityAt: daysAgo(10),
      });
      expect(isGoalMet(journey, before, enrolledAt)).toBe(false);
      expect(
        isGoalMet(
          journey,
          { ...before, lastActivityAt: daysAgo(0.1) },
          enrolledAt,
        ),
      ).toBe(true);
    }
  });

  it("NEWSLETTER_INVITE exits on signup", () => {
    expect(
      isGoalMet(
        LifecycleJourney.NEWSLETTER_INVITE,
        snapshot({ newsletter: confirmed }),
        enrolledAt,
      ),
    ).toBe(false);
    expect(
      isGoalMet(
        LifecycleJourney.NEWSLETTER_INVITE,
        snapshot({ newsletter: confirmed, userId: "u", user: goodUser }),
        enrolledAt,
      ),
    ).toBe(true);
  });
});

describe("frequency cap", () => {
  it("blocks within the window, allows after it", () => {
    const sentAt = new Date(NOW.getTime() - 47 * 3_600_000);
    expect(capAllows(sentAt, NOW, 48)).toBe(false);
    expect(capAllows(new Date(NOW.getTime() - 48 * 3_600_000), NOW, 48)).toBe(
      true,
    );
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
