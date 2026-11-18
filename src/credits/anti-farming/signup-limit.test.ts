/**
 * Per-subnet signup rate limit (requires the dev DB; mails go to .invalid):
 * - SIGNUPS_PER_SUBNET_PER_DAY accounts per /24 (IPv4) or /64 (IPv6) in 24 h
 * - accounts older than the window do not count
 * - no IP / loopback / private IPs are exempt
 * - the signup endpoint refuses the next account and records the event
 */

import { and, eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { NextRequest } from "next-vibe/ui/lib/request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { scopedTranslation as signupScopedTranslation } from "@/user/public/signup/i18n";
import { setMxResolverForTests } from "@/user/public/signup/disposable-mx";
import { SignupRepository } from "@/user/public/signup/repository";

import { SIGNUPS_PER_SUBNET_PER_DAY } from "./config";
import { antiFarmingEvents } from "./db";
import { ipSubnetKey } from "./ip";
import { signupSubnetLimitHit } from "./signup-limit";

const logger = createEndpointLogger(false, defaultLocale);
const { t: signupT } = signupScopedTranslation.scopedT(defaultLocale);
// Signups send real emails over SMTP; well past bun's 5s default
const TIMEOUT_MS = 120_000;

const createdUserIds: string[] = [];
const subnets: string[] = [];

/** A fresh public /24 (198.18.0.0/15 benchmark range) so reruns never collide */
function freshNet(): string {
  const net = `198.${String(18 + Math.floor(Math.random() * 2))}.${String(Math.floor(Math.random() * 256))}`;
  subnets.push(`${net}.0/24`);
  return net;
}

function uniqueEmail(tag: string): string {
  return `signup-limit-${tag}-${String(Date.now())}-${String(Math.floor(Math.random() * 1e6))}@example-test.invalid`;
}

/** An account whose signup lead came from `ip` */
async function account(tag: string, ip: string): Promise<string | null> {
  const created = await createTestUser(uniqueEmail(tag));
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success || created.data.user.isPublic) {
    return null;
  }
  const userId = created.data.user.id;
  createdUserIds.push(userId);
  const linked = await db
    .select({ leadId: userLeadLinks.leadId })
    .from(userLeadLinks)
    .where(eq(userLeadLinks.userId, userId));
  await db
    .update(leads)
    .set({ ipAddress: ip })
    .where(
      inArray(
        leads.id,
        linked.map((l) => l.leadId),
      ),
    );
  return userId;
}

beforeAll(() => {
  // No real DNS: every domain has an ordinary (non temp-mail) MX
  setMxResolverForTests(async () => ["mx.example.org"]);
});

afterAll(async () => {
  setMxResolverForTests(null);
  for (const userId of createdUserIds) {
    await deleteTestUser(userId);
  }
  if (subnets.length > 0) {
    await db.delete(antiFarmingEvents).where(inArray(antiFarmingEvents.subnet, subnets));
  }
});

describe("signup subnet limit", () => {
  it("exempts missing, loopback and private IPs", async () => {
    expect(await signupSubnetLimitHit(null)).toBeNull();
    expect(await signupSubnetLimitHit(undefined)).toBeNull();
    expect(await signupSubnetLimitHit("127.0.0.1")).toBeNull();
    expect(await signupSubnetLimitHit("::1")).toBeNull();
    expect(await signupSubnetLimitHit("10.1.2.3")).toBeNull();
    expect(await signupSubnetLimitHit("192.168.1.10")).toBeNull();
    expect(await signupSubnetLimitHit("::ffff:172.16.0.4")).toBeNull();
    expect(await signupSubnetLimitHit("fd00::1")).toBeNull();
    expect(await signupSubnetLimitHit("not-an-ip")).toBeNull();
  });

  it(
    `allows ${String(SIGNUPS_PER_SUBNET_PER_DAY)} accounts per /24 in 24 h, then refuses at signup`,
    async () => {
      const net = freshNet();
      const subnet = `${net}.0/24`;
      for (let i = 0; i < SIGNUPS_PER_SUBNET_PER_DAY; i++) {
        expect(await signupSubnetLimitHit(`${net}.200`)).toBeNull();
        const id = await account(`v4-${String(i)}`, `${net}.${String(10 + i)}`);
        if (!id) {
          return;
        }
      }
      expect(await signupSubnetLimitHit(`${net}.200`)).toBe(subnet);
      // IPv4-mapped IPv6 is the same network
      expect(await signupSubnetLimitHit(`::ffff:${net}.201`)).toBe(subnet);
      // A neighbouring network is unaffected
      expect(await signupSubnetLimitHit(`${freshNet()}.200`)).toBeNull();

      // The endpoint refuses the next account from that network
      const emailAddr = uniqueEmail("v4-over");
      const res = await SignupRepository.registerUser(
        {
          privateName: "Signup Limit",
          publicName: "SignupLimit",
          email: emailAddr,
          password: "SecurePass123",
          confirmPassword: "SecurePass123",
          acceptTerms: true,
          subscribeToNewsletter: false,
        },
        {
          isPublic: true,
          leadId: crypto.randomUUID(),
          roles: [UserPermissionRole.PUBLIC],
        },
        defaultLocale,
        logger,
        Platform.NEXT_API,
        signupT,
        new NextRequest("http://localhost/api/signup", {
          headers: { "x-forwarded-for": `${net}.77, 10.0.0.1` },
        }),
        undefined,
        async () => "ok",
      );
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.message).toBe(signupT("errors.subnetSignupLimit.detail"));
      }
      const [created] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, emailAddr));
      expect(created).toBeUndefined();
      const events = await db
        .select({ kind: antiFarmingEvents.kind })
        .from(antiFarmingEvents)
        .where(
          and(
            eq(antiFarmingEvents.subnet, subnet),
            eq(antiFarmingEvents.kind, "subnet_signup_limit"),
          ),
        );
      expect(events).toHaveLength(1);

      // Accounts older than the window stop counting
      const [oldest] = createdUserIds.slice(-SIGNUPS_PER_SUBNET_PER_DAY);
      if (oldest) {
        await db
          .update(users)
          .set({ createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000) })
          .where(eq(users.id, oldest));
      }
      expect(await signupSubnetLimitHit(`${net}.200`)).toBeNull();
    },
    TIMEOUT_MS,
  );

  it(
    "counts IPv6 signups per /64",
    async () => {
      const hex = (): string => Math.floor(Math.random() * 0xffff).toString(16);
      const prefix = `2001:db8:${hex()}:${hex()}`;
      const subnet = ipSubnetKey(`${prefix}::1`);
      expect(subnet).not.toBeNull();
      for (let i = 0; i < SIGNUPS_PER_SUBNET_PER_DAY; i++) {
        const id = await account(`v6-${String(i)}`, `${prefix}::${String(i + 1)}`);
        if (!id) {
          return;
        }
      }
      expect(await signupSubnetLimitHit(`${prefix}:aaaa::9`)).toBe(subnet);
      expect(await signupSubnetLimitHit(`2001:db8:1:${hex()}::9`)).toBeNull();
    },
    TIMEOUT_MS,
  );
});
