import { describe, expect, it } from "bun:test";
import { render } from "@react-email/render";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { SubscriptionPlan, SubscriptionStatus } from "../../enum";
import { buildNoticeProps, PlanMoveNoticeRepository } from "./repository";

const LOCALES: CountryLanguage[] = [
  "en-US",
  "de-DE",
  "pl-PL",
  "es-ES",
  "fr-FR",
  "it-IT",
  "sk-SK",
  "hi-IN",
];

describe("plan move notice email", () => {
  for (const locale of LOCALES) {
    it(`renders in ${locale} with the move link, deadline and no dashes`, async () => {
      const props = buildNoticeProps(
        {
          privateName: "Ada",
          locale,
          status: SubscriptionStatus.ACTIVE,
          planId: SubscriptionPlan.PLUS,
          deadline: new Date("2026-12-15T00:00:00.000Z"),
        },
        "https://unbottled.ai",
      );
      const { subject, jsx } = await PlanMoveNoticeRepository.renderNotice(
        props,
        locale,
        "ada@example.com",
      );
      const html = await render(jsx);
      expect(subject.length).toBeGreaterThan(10);
      expect(subject).not.toMatch(/[–—]/);
      expect(html).not.toMatch(/[–—]/);
      expect(html).toContain(
        `https://unbottled.ai/${locale}/subscription/overview#move-plan`,
      );
      expect(html).toContain(`https://unbottled.ai/${locale}/subscription/buy`);
      expect(html).toContain(props.deadline);
      expect(html).toContain("Ada");
    });
  }

  it("switches the action line for a past-due plan", () => {
    const props = buildNoticeProps(
      {
        privateName: "Ada",
        locale: "en-US",
        status: SubscriptionStatus.PAST_DUE,
        planId: SubscriptionPlan.SUBSCRIPTION,
        deadline: null,
      },
      "https://unbottled.ai",
    );
    expect(props.pastDue).toBe(true);
    expect(props.deadline).toBe("");
  });
});
