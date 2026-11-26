/**
 * Same-IP guest linking must skip server traffic: the HA health probe's
 * admin-flagged lead (ipLinkExempt) and, in production, loopback/private
 * client IPs (deploy warmup, probes over docker/WireGuard).
 * Requires the dev DB, like the other lead/credits repository tests.
 */

import { afterAll, describe, expect, it } from "bun:test";
import { eq, inArray, or } from "drizzle-orm";

import { defaultLocale } from "../../core/i18n/core/config";
import { db } from "../../database";
import { createEndpointLogger } from "../../logger/server";
import { GUEST_LEAD_DB_BUDGET_MS } from "./database-deadline";
import { leadLeadLinks, leads } from "./db";
import { LeadSource, LeadStatus } from "./enum";
import { IP_LINK_EXEMPT_METADATA_KEY, ipPoolKey } from "./ip-key";
import {
  createAnonymousLead,
  isServerSideIp,
  validateLeadIdExists,
} from "./middleware-ops";

const logger = createEndpointLogger(false, defaultLocale);
const createdLeadIds: string[] = [];

/** A fresh public TEST-NET-3 address per call so reruns never collide */
function freshPublicIp(): string {
  return `203.0.113.${String(1 + Math.floor(Math.random() * 254))}`;
}

async function insertGuestLead(
  ip: string,
  extra: Record<string, boolean | null>,
): Promise<string> {
  const [row] = await db
    .insert(leads)
    .values({
      email: null,
      businessName: "",
      country: "GLOBAL",
      language: "en",
      source: LeadSource.WEBSITE,
      status: LeadStatus.WEBSITE_USER,
      metadata: {
        anonymous: true,
        ipAddress: ip,
        ipKey: ipPoolKey(ip),
        userAgent: `ip-link-test-${String(Math.random())}`,
        ...extra,
      },
    })
    .returning({ id: leads.id });
  expect(row).toBeDefined();
  const id = row?.id ?? "";
  createdLeadIds.push(id);
  return id;
}

async function linkedIds(leadId: string): Promise<string[]> {
  const rows = await db
    .select()
    .from(leadLeadLinks)
    .where(
      or(eq(leadLeadLinks.leadId1, leadId), eq(leadLeadLinks.leadId2, leadId)),
    );
  return rows.map((r) => (r.leadId1 === leadId ? r.leadId2 : r.leadId1));
}

async function visit(ip: string): Promise<string> {
  const leadId = await createAnonymousLead(
    { ipAddress: ip, userAgent: `ip-link-visit-${String(Math.random())}` },
    defaultLocale,
    logger,
    performance.now() + GUEST_LEAD_DB_BUDGET_MS,
  );
  createdLeadIds.push(leadId);
  return leadId;
}

afterAll(async () => {
  if (createdLeadIds.length > 0) {
    await db
      .delete(leadLeadLinks)
      .where(
        or(
          inArray(leadLeadLinks.leadId1, createdLeadIds),
          inArray(leadLeadLinks.leadId2, createdLeadIds),
        ),
      );
    await db.delete(leads).where(inArray(leads.id, createdLeadIds));
  }
});

describe("isServerSideIp", () => {
  it("treats loopback/private client IPs as the server only in production", () => {
    for (const ip of ["127.0.0.1", "::1", "10.88.0.2", "172.18.0.1"]) {
      expect(isServerSideIp(ip, true)).toBe(true);
      expect(isServerSideIp(ip, false)).toBe(false);
    }
    for (const ip of ["203.0.113.7", "2a02:4780::1"]) {
      expect(isServerSideIp(ip, true)).toBe(false);
    }
  });
});

describe("linkLeadsByIp", () => {
  it("links a new guest to same-IP guests but never to an ipLinkExempt lead", async () => {
    const ip = freshPublicIp();
    const probe = await insertGuestLead(ip, {
      [IP_LINK_EXEMPT_METADATA_KEY]: true,
    });
    const guest = await insertGuestLead(ip, {});
    const legacyGuest = await insertGuestLead(ip, { ipKey: null });

    const newcomer = await visit(ip);
    expect(
      await validateLeadIdExists(
        newcomer,
        performance.now() + GUEST_LEAD_DB_BUDGET_MS,
      ),
    ).toBe(true);
    await expect(
      validateLeadIdExists(newcomer, performance.now() - 1),
    ).rejects.toThrow("Guest lead database deadline exceeded");
    const links = await linkedIds(newcomer);

    expect(links).toContain(guest);
    expect(links).toContain(legacyGuest);
    expect(links).not.toContain(probe);
    expect(await linkedIds(probe)).toEqual([]);
  });
});
