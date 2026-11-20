import { describe, expect, test } from "bun:test";
import { permissionsRegistry } from "next-vibe/core/permissions/registry";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";

import queue from "@/leads/campaigns/queue/definition";
import search from "@/leads/search/definition";

import detail from "./definition";
import { LeadJourneyEvent } from "./enum";

describe("lead journey and campaign queue", () => {
  test("saved examples keep the lead ID and schedule across search, detail and queue", () => {
    const selected = search.GET.responseSchema.parse(search.GET.examples.responses?.audit).response
      .leads[0];
    const { lead, review } = detail.GET.responseSchema.parse(
      detail.GET.examples.responses?.default,
    );
    const queued = queue.GET.responseSchema.parse(queue.GET.examples.responses?.default).items[0];

    expect(selected.id).toBe(lead.basicInfo.id);
    expect(queued.leadId).toBe(selected.id);
    expect(queued.leadEmail).toBe(selected.email);
    expect(queued.nextScheduledAt).toBe(review?.nextEmailAt?.toISOString() ?? null);
    expect(queue.GET.requestSchema.parse({ leadId: selected.id }).leadId).toBe(selected.id);
    const timestamps = review?.events.map((event) => event.date.getTime()) ?? [];
    expect(timestamps).toEqual(timestamps.toSorted((a, b) => a - b));
    expect(review?.events.some((event) => event.kind === LeadJourneyEvent.ACCOUNT_LINK)).toBe(true);
  });

  test("keeps a linked lead's consent, source and opt-out with that record", () => {
    const { lead, review } = detail.GET.responseSchema.parse(
      detail.GET.examples.responses?.default,
    );
    const related = review?.relatedLeadEvidence?.[0];
    const user = review?.accountAssociations?.find((account) => account.leadId === related?.leadId);
    const optOut = review?.newsletter.find(
      (subscription) => subscription.leadId === null && subscription.userId === user?.userId,
    );
    expect(related?.leadId).toBe(lead.linkedLeads[0].linkedLeadId);
    expect(related?.guestConsentVersion).toBe(1);
    expect(related?.attribution?.firstSource).toBe("studio-forum");
    expect(related?.attribution?.lastSource).toBe("studio-email");
    expect(user?.publicName).toBe("Jules Example");
    expect(
      review?.wallets.some((wallet) => wallet.leadId === null && wallet.userId === user?.userId),
    ).toBe(true);
    expect(optOut?.unsubscribedDate?.toISOString()).toBe("2024-01-20T11:15:00.000Z");
    expect(
      review?.events.some((event) => event.kind === LeadJourneyEvent.NEWSLETTER_UNSUBSCRIBED),
    ).toBe(false);
  });

  test("accepts empty results and older detail responses without review data", () => {
    expect(queue.GET.responseSchema.parse(queue.GET.examples.responses?.empty).items).toEqual([]);
    const { lead, review } = detail.GET.responseSchema.parse(
      detail.GET.examples.responses?.default,
    );
    expect(detail.GET.responseSchema.parse({ lead }).lead.basicInfo.id).toBe(lead.basicInfo.id);
    expect(
      detail.GET.responseSchema.safeParse({
        lead,
        review: {
          ...review,
          accountAssociations: undefined,
          relatedLeadEvidence: undefined,
          newsletter: review?.newsletter.map((subscription) => ({
            ...subscription,
            unsubscribedDate: undefined,
          })),
        },
      }).success,
    ).toBe(true);
  });

  test("keeps record search, journey and queue restricted to administrators", () => {
    const user: JwtPayloadType = {
      isPublic: false,
      id: "123e4567-e89b-12d3-a456-426614174000",
      leadId: "550e8400-e29b-41d4-a716-446655440000",
      roles: [UserPermissionRole.CUSTOMER],
    };
    for (const endpoint of [search.GET, detail.GET, queue.GET]) {
      expect(
        permissionsRegistry.validateEndpointAccess(endpoint, user, Platform.NEXT_PAGE).allowed,
      ).toBe(false);
      expect(
        permissionsRegistry.validateEndpointAccess(
          endpoint,
          { ...user, roles: [UserPermissionRole.ADMIN] },
          Platform.NEXT_PAGE,
        ).allowed,
      ).toBe(true);
    }
  });
});
