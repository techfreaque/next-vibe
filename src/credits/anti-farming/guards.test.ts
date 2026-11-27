/**
 * Anti-farming guards added after the 2026-11-27 signup farm
 * (scratchpad/abuse/signup-farm-2026-11-27.md), thresholds in ./config.ts:
 * - hosting/VPN ASN: daily account-pool budget per ASN on top of the /24 one
 * - exact IP + same user agent as an account granted in the last 7 days:
 *   one shared pool
 * - newsletter bonus: one new bonus per network per month
 * - admin-revoked pools stay empty until a purchase
 * - log-only signals (random plus-tag, name + UA cluster) and the burst alert
 * Normal users stay unaffected: home IP, families (different devices), a
 * paying VPN user. Requires the dev DB, like the other anti-farming tests.
 */

import { gzipSync } from "node:zlib";

import { and, eq, inArray, like } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  buildAsnTable,
  decodeAsnTable,
  encodeAsnTable,
  lookupHostingAsn,
} from "@/leads/geo/asn/compact";
import { isHostingAsn } from "@/leads/geo/asn/hosting-asns";
import { ASN_SOURCE_ID, hostingAsnForIp } from "@/leads/geo/asn/lookup";
import { geoIpDatabases } from "@/leads/geo/db";
import { storeAsnRelease } from "@/leads/geo/update/repository";
import { newsletterSubscriptions } from "@/newsletter/db";
import { NewsletterSubscriptionStatus } from "@/newsletter/enum";
import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";

import { creditPacks, creditWallets } from "../db";
import { CreditPackType } from "../enum";
import { scopedTranslation } from "../i18n";
import { CreditRepository } from "../repository";
import { shouldSendBurstAlert } from "./alerts";
import {
  ACCOUNT_POOLS_PER_HOSTING_ASN_PER_DAY,
  BURST_ALERT_COOLDOWN_HOURS,
  BURST_ALERT_THRESHOLD,
  FREE_POOL_CLAIMS_START,
  NEWSLETTER_BONUS_CLAIMS_START,
} from "./config";
import { antiFarmingEvents, freePoolClaims } from "./db";
import { ipSubnetKey } from "./ip";
import { resolveAccountFreeAccess } from "./quota";
import { hasRandomPlusTag } from "./signup-signals";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const accountBase =
  FREE_CREDIT_ALLOWANCE.guest + FREE_CREDIT_ALLOWANCE.signedIn;
const TIMEOUT_MS = 90_000;

/** Test hosting ASN (private-use range) and its fixture network */
const TEST_ASN = 4_200_000_123;
const ASN_KEY = `asn:${String(TEST_ASN)}`;
const ASN_FIXTURE_CSV = [
  '1.0.0.0,1.0.0.255,13335,"Cloudflare, Inc."',
  '100.200.0.0,100.201.255.255,64999,"Test Residential ISP"',
  `198.18.0.0,198.19.255.255,${String(TEST_ASN)},"Farm Test Hosting Ltd"`,
  '2001:db8::,2001:db8:ffff:ffff:ffff:ffff:ffff:ffff,64998,"Test Datacenter GmbH"',
].join("\n");

const createdUserIds: string[] = [];
const createdEmails: string[] = [];
const subnets: string[] = [];
let savedAsnRow: typeof geoIpDatabases.$inferSelect | undefined;

function rand(n: number): number {
  return Math.floor(Math.random() * n);
}

/** Fresh residential /24 (fixture: not hosting) */
function homeNet(): string {
  const net = `100.${String(200 + rand(2))}.${String(rand(250))}`;
  subnets.push(`${net}.0/24`);
  return net;
}

/** Fresh /24 inside the test hosting ASN */
function hostingNet(): string {
  const net = `198.${String(18 + rand(2))}.${String(rand(250))}`;
  subnets.push(`${net}.0/24`);
  return net;
}

function postCutoff(): Date {
  return new Date(
    Math.max(Date.now(), FREE_POOL_CLAIMS_START.getTime() + 3_600_000),
  );
}

/** A verified account created under the anti-farming rules, signed up from `ip` with `userAgent` */
async function account(
  tag: string,
  ip: string,
  userAgent: string,
): Promise<JwtPrivatePayloadType> {
  const email = `guards-${tag}-${String(Date.now())}-${String(rand(1e6))}@example-test.invalid`;
  createdEmails.push(email);
  const created = await createTestUser(email);
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success || created.data.user.isPublic) {
    throw new Error("test user creation failed");
  }
  const user = created.data.user;
  createdUserIds.push(user.id);
  await db
    .update(users)
    .set({ createdAt: postCutoff(), emailVerified: true })
    .where(eq(users.id, user.id));
  const linked = await db
    .select({ leadId: userLeadLinks.leadId })
    .from(userLeadLinks)
    .where(eq(userLeadLinks.userId, user.id));
  await db
    .update(leads)
    .set({ ipAddress: ip, userAgent })
    .where(
      inArray(
        leads.id,
        linked.map((l) => l.leadId),
      ),
    );
  return user;
}

async function freeBalance(user: JwtPrivatePayloadType): Promise<number> {
  const res = await CreditRepository.getBalance(user, logger, t, defaultLocale);
  expect(res.success, JSON.stringify(res)).toBe(true);
  return res.success ? res.data.free : -1;
}

async function buyPack(user: JwtPrivatePayloadType): Promise<void> {
  await freeBalance(user);
  const [wallet] = await db
    .select({ id: creditWallets.id })
    .from(creditWallets)
    .where(eq(creditWallets.userId, user.id))
    .limit(1);
  expect(wallet).toBeDefined();
  await db.insert(creditPacks).values({
    walletId: wallet?.id ?? "",
    originalAmount: 100,
    remaining: 100,
    type: CreditPackType.PERMANENT,
  });
}

async function confirmNewsletter(
  user: JwtPrivatePayloadType,
  confirmedAt: Date,
): Promise<void> {
  const email = `guards-nl-${String(Date.now())}-${String(rand(1e6))}@example-test.invalid`;
  createdEmails.push(email);
  await db.insert(newsletterSubscriptions).values({
    email,
    userId: user.id,
    leadId: user.leadId,
    status: NewsletterSubscriptionStatus.SUBSCRIBED,
    confirmedAt,
  });
}

async function eventCount(
  kind: "ip_link_limit" | "asn_account_limit" | "newsletter_network_limit",
  subnet: string,
): Promise<number> {
  const rows = await db
    .select({ id: antiFarmingEvents.id })
    .from(antiFarmingEvents)
    .where(
      and(
        eq(antiFarmingEvents.subnet, subnet),
        eq(antiFarmingEvents.kind, kind),
      ),
    );
  return rows.length;
}

async function clearAsnClaims(): Promise<void> {
  await db.delete(freePoolClaims).where(eq(freePoolClaims.subnet, ASN_KEY));
  await db
    .delete(antiFarmingEvents)
    .where(eq(antiFarmingEvents.subnet, ASN_KEY));
}

beforeAll(async () => {
  [savedAsnRow] = await db
    .select()
    .from(geoIpDatabases)
    .where(eq(geoIpDatabases.id, ASN_SOURCE_ID));
  await storeAsnRelease("test-fixture", gzipSync(ASN_FIXTURE_CSV));
  await clearAsnClaims();
}, TIMEOUT_MS);

afterAll(async () => {
  if (createdEmails.length > 0) {
    await db
      .delete(newsletterSubscriptions)
      .where(inArray(newsletterSubscriptions.email, createdEmails));
  }
  for (const id of createdUserIds) {
    await db
      .delete(freePoolClaims)
      .where(eq(freePoolClaims.poolKey, `user:${id}`));
    await deleteTestUser(id);
  }
  for (const subnet of subnets) {
    await db.delete(freePoolClaims).where(eq(freePoolClaims.subnet, subnet));
    await db
      .delete(antiFarmingEvents)
      .where(eq(antiFarmingEvents.subnet, subnet));
  }
  await clearAsnClaims();
  await db
    .delete(freePoolClaims)
    .where(like(freePoolClaims.subnet, "asn:4200000123%"));
  if (savedAsnRow) {
    await db
      .update(geoIpDatabases)
      .set({
        version: savedAsnRow.version,
        data: savedAsnRow.data,
        v4Ranges: savedAsnRow.v4Ranges,
        v6Ranges: savedAsnRow.v6Ranges,
        updatedAt: new Date(),
      })
      .where(eq(geoIpDatabases.id, ASN_SOURCE_ID));
  } else {
    await db.delete(geoIpDatabases).where(eq(geoIpDatabases.id, ASN_SOURCE_ID));
  }
  const { invalidateAsnCache } = await import("@/leads/geo/asn/lookup");
  invalidateAsnCache();
}, TIMEOUT_MS);

describe("hosting ASN table", () => {
  const table = buildAsnTable(ASN_FIXTURE_CSV);
  const decoded = decodeAsnTable(encodeAsnTable(table));

  it("keeps only hosting ranges and round-trips", () => {
    expect(decoded).not.toBeNull();
    if (!decoded) {
      return;
    }
    expect(lookupHostingAsn(decoded, "198.18.4.20")).toBe(TEST_ASN);
    expect(lookupHostingAsn(decoded, "198.19.255.255")).toBe(TEST_ASN);
    expect(lookupHostingAsn(decoded, "198.20.0.1")).toBeNull();
    expect(lookupHostingAsn(decoded, "100.200.3.4")).toBeNull();
    // Consumer relay (WARP / Private Relay) is never hosting
    expect(lookupHostingAsn(decoded, "1.0.0.1")).toBeNull();
    expect(lookupHostingAsn(decoded, "2001:db8:1::5")).toBe(64998);
    expect(lookupHostingAsn(decoded, "not-an-ip")).toBeNull();
    expect(decodeAsnTable(new Uint8Array([1, 2, 3]))).toBeNull();
  });

  it("classifies list, curated and keyword networks, never consumer relays", () => {
    // bad-asn-list: OVH, Mullvad (31173 Services AB)
    expect(isHostingAsn(16276, "OVH SAS")).toBe(true);
    expect(isHostingAsn(39351, "31173 Services AB")).toBe(true);
    // curated from the 2026-11-27 farm
    expect(isHostingAsn(203087, "PE Fedinyak Sergey Vyacheslavovich")).toBe(
      true,
    );
    expect(isHostingAsn(64000, "Example VPS House LLC")).toBe(true);
    expect(isHostingAsn(13335, "Cloudflare, Inc.")).toBe(false);
    expect(isHostingAsn(3320, "Deutsche Telekom AG")).toBe(false);
    expect(isHostingAsn(7922, "Comcast Cable Communications, LLC")).toBe(false);
  });

  it("resolves through the stored release", async () => {
    expect(await hostingAsnForIp("198.18.9.9", logger)).toBe(TEST_ASN);
    expect(await hostingAsnForIp("100.200.9.9", logger)).toBeNull();
    expect(await hostingAsnForIp(null, logger)).toBeNull();
  });
});

describe("log-only signals and alert decision", () => {
  it("random plus-tag only on big providers, random shape, 8+ chars", () => {
    expect(hasRandomPlusTag("y.a.va+8vn5azotz6@gmail.com")).toBe(true);
    expect(hasRandomPlusTag("clutter8980+labm8m8pw8@hotmail.com")).toBe(true);
    expect(hasRandomPlusTag("des+gu637k513i@outlook.fr")).toBe(true);
    expect(hasRandomPlusTag("max+shopping@gmail.com")).toBe(false);
    expect(hasRandomPlusTag("max+bxlnkbvmqd@hotmail.com")).toBe(true);
    expect(hasRandomPlusTag("max+oudzqhb3ca@hotmail.com")).toBe(true);
    expect(hasRandomPlusTag("max+newsletter2026@gmail.com")).toBe(false);
    expect(hasRandomPlusTag("max+giveupalready@gmail.com")).toBe(false);
    expect(hasRandomPlusTag("max+20261109@proton.me")).toBe(false);
    expect(hasRandomPlusTag("max+ab12@gmail.com")).toBe(false);
    expect(hasRandomPlusTag("max+8vn5azotz6@company.example")).toBe(false);
    expect(hasRandomPlusTag("max@gmail.com")).toBe(false);
  });

  it("alerts at the threshold, then waits for the cooldown", () => {
    const now = new Date("2026-11-27T21:12:00Z");
    expect(
      shouldSendBurstAlert({
        eventsInWindow: BURST_ALERT_THRESHOLD - 1,
        lastAlertAt: null,
        now,
      }),
    ).toBe(false);
    expect(
      shouldSendBurstAlert({
        eventsInWindow: BURST_ALERT_THRESHOLD,
        lastAlertAt: null,
        now,
      }),
    ).toBe(true);
    expect(
      shouldSendBurstAlert({
        eventsInWindow: 50,
        lastAlertAt: new Date(now.getTime() - 3_600_000),
        now,
      }),
    ).toBe(false);
    expect(
      shouldSendBurstAlert({
        eventsInWindow: 50,
        lastAlertAt: new Date(
          now.getTime() - BURST_ALERT_COOLDOWN_HOURS * 3_600_000,
        ),
        now,
      }),
    ).toBe(true);
  });
});

describe("normal users", () => {
  it(
    "a home-IP user gets the account tier",
    async () => {
      const user = await account("home", `${homeNet()}.7`, "home-browser");
      expect(await resolveAccountFreeAccess(user.id, logger)).toBe("active");
      expect(await freeBalance(user)).toBe(accountBase);
    },
    TIMEOUT_MS,
  );

  it(
    "a family on one IP with different devices keeps 3 pools per /24",
    async () => {
      const net = homeNet();
      const ip = `${net}.20`;
      const parent = await account("family-a", ip, "family-laptop");
      const teen = await account("family-b", ip, "family-phone");
      const other = await account("family-c", `${net}.21`, "family-laptop");
      for (const member of [parent, teen, other]) {
        expect(await resolveAccountFreeAccess(member.id, logger)).toBe(
          "active",
        );
      }
      // The per-/24 allowance is unchanged: a 4th account in the month waits
      const fourth = await account("family-d", `${net}.22`, "family-tablet");
      expect(await resolveAccountFreeAccess(fourth.id, logger)).toBe(
        "subnetLimit",
      );
    },
    TIMEOUT_MS,
  );
});

describe("exact IP + same browser link", () => {
  it(
    "a second account from the same IP and browser shares the first pool",
    async () => {
      const net = homeNet();
      const ip = `${net}.30`;
      const first = await account("link-a", ip, "same-browser-ua");
      expect(await resolveAccountFreeAccess(first.id, logger)).toBe("active");
      const second = await account("link-b", ip, "same-browser-ua");
      expect(await resolveAccountFreeAccess(second.id, logger)).toBe(
        "subnetLimit",
      );
      // Sticky for the month, one event
      expect(await resolveAccountFreeAccess(second.id, logger)).toBe(
        "subnetLimit",
      );
      expect(await freeBalance(second)).toBe(0);
      expect(await eventCount("ip_link_limit", `${net}.0/24`)).toBe(1);
      // The first account keeps its pool
      expect(await freeBalance(first)).toBe(accountBase);
    },
    TIMEOUT_MS,
  );
});

describe("hosting / VPN ASN budget", () => {
  it(
    "rotating /24s inside one provider stops at the daily ASN budget; a paying VPN user still gets free tiers",
    async () => {
      await clearAsnClaims();
      const granted: JwtPrivatePayloadType[] = [];
      for (let i = 0; i < ACCOUNT_POOLS_PER_HOSTING_ASN_PER_DAY; i++) {
        const user = await account(
          `asn-${String(i)}`,
          `${hostingNet()}.${String(10 + i)}`,
          `vpn-browser-${String(i)}`,
        );
        expect(await resolveAccountFreeAccess(user.id, logger)).toBe("active");
        granted.push(user);
      }
      const net = hostingNet();
      const farmed = await account("asn-over", `${net}.50`, "vpn-browser-x");
      expect(await resolveAccountFreeAccess(farmed.id, logger)).toBe(
        "subnetLimit",
      );
      expect(await eventCount("asn_account_limit", ASN_KEY)).toBe(1);
      // The refused account used no slot of its own /24
      const subnetClaims = await db
        .select({ id: freePoolClaims.id })
        .from(freePoolClaims)
        .where(eq(freePoolClaims.subnet, `${net}.0/24`));
      expect(subnetClaims).toHaveLength(0);

      // A privacy user on the same VPN who pays: free tiers on top
      const payer = await account("asn-payer", `${hostingNet()}.60`, "vpn-pay");
      await buyPack(payer);
      expect(await resolveAccountFreeAccess(payer.id, logger)).toBe("active");
      expect(ipSubnetKey(`${net}.50`)).toBe(`${net}.0/24`);
    },
    TIMEOUT_MS,
  );
});

describe("revoked pools", () => {
  it(
    "stay empty until the account buys credits",
    async () => {
      const user = await account("revoked", `${homeNet()}.40`, "revoked-ua");
      expect(await resolveAccountFreeAccess(user.id, logger)).toBe("active");
      await db.insert(freePoolClaims).values({
        kind: "account_revoked",
        subnet: "test",
        period: "2026-11",
        poolKey: `user:${user.id}`,
        granted: false,
      });
      expect(await resolveAccountFreeAccess(user.id, logger)).toBe(
        "subnetLimit",
      );
      await buyPack(user);
      expect(await resolveAccountFreeAccess(user.id, logger)).toBe("active");
    },
    TIMEOUT_MS,
  );
});

describe("newsletter bonus per network", () => {
  it(
    "one new bonus per network per month; earlier confirmations keep theirs",
    async () => {
      const net = homeNet();
      const afterStart = new Date(
        Math.max(Date.now(), NEWSLETTER_BONUS_CLAIMS_START.getTime() + 60_000),
      );
      const first = await account("nl-a", `${net}.70`, "nl-browser-a");
      await confirmNewsletter(first, afterStart);
      expect(await freeBalance(first)).toBe(
        accountBase + FREE_CREDIT_ALLOWANCE.newsletterBonus,
      );

      const second = await account("nl-b", `${net}.71`, "nl-browser-b");
      await confirmNewsletter(second, afterStart);
      expect(await freeBalance(second)).toBe(accountBase);
      expect(await eventCount("newsletter_network_limit", `${net}.0/24`)).toBe(
        1,
      );

      // Confirmed before the rule started: grandfathered
      const legacy = await account("nl-c", `${net}.72`, "nl-browser-c");
      await confirmNewsletter(
        legacy,
        new Date(NEWSLETTER_BONUS_CLAIMS_START.getTime() - 3_600_000),
      );
      expect(await freeBalance(legacy)).toBe(
        accountBase + FREE_CREDIT_ALLOWANCE.newsletterBonus,
      );
    },
    TIMEOUT_MS,
  );
});
