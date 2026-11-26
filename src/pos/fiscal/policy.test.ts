import { describe, expect, it } from "bun:test";

import type { FiscalProviderAdapter } from "./adapter";
import { FiscalAdapter } from "./enum";
import { fiscalDecision } from "./policy";
import { getFiscalAdapter } from "./registry";

const NOW = new Date("2026-11-26T12:00:00.000Z");

const certifiedFake: FiscalProviderAdapter = {
  id: "certified-fake",
  certified: true,
  deviceKinds: ["ORP"],
  register: () => Promise.resolve({ status: "REGISTERED", uid: "O-1" }),
};

const resolve = (id: string): FiscalProviderAdapter | null =>
  id === certifiedFake.id ? certifiedFake : getFiscalAdapter(id);

function provider(
  adapter: string,
  overrides: { isEnabled?: boolean; certifiedUntil?: string | null } = {},
): { adapter: string; isEnabled: boolean; certifiedUntil: string | null } {
  return {
    adapter,
    isEnabled: overrides.isEnabled ?? true,
    certifiedUntil: overrides.certifiedUntil ?? null,
  };
}

describe("fiscalDecision", () => {
  it("does not block or queue non-SK companies without a provider", () => {
    expect(fiscalDecision({ country: "DE", provider: null, now: NOW })).toEqual(
      { required: false, blocked: false, enqueue: false, certified: false },
    );
  });

  it("blocks SK companies without a provider", () => {
    const decision = fiscalDecision({ country: "sk", provider: null, now: NOW });
    expect(decision.required).toBe(true);
    expect(decision.blocked).toBe(true);
  });

  it("never unblocks SK with the sandbox adapter", () => {
    const decision = fiscalDecision({
      country: "SK",
      provider: provider(FiscalAdapter.SANDBOX),
      now: NOW,
    });
    expect(decision.blocked).toBe(true);
    expect(decision.enqueue).toBe(false);
  });

  it("queues sandbox receipts for non-SK companies", () => {
    const decision = fiscalDecision({
      country: "AT",
      provider: provider(FiscalAdapter.SANDBOX),
      now: NOW,
    });
    expect(decision).toMatchObject({ blocked: false, enqueue: true });
  });

  it("unblocks SK with an enabled certified adapter", () => {
    const decision = fiscalDecision({
      country: "SK",
      provider: provider(certifiedFake.id, { certifiedUntil: "2027-01-01" }),
      resolveAdapter: resolve,
      now: NOW,
    });
    expect(decision).toMatchObject({
      required: true,
      blocked: false,
      enqueue: true,
      certified: true,
    });
  });

  it("blocks SK when the certified provider is disabled or expired", () => {
    for (const overrides of [
      { isEnabled: false },
      { certifiedUntil: "2026-11-25" },
    ]) {
      expect(
        fiscalDecision({
          country: "SK",
          provider: provider(certifiedFake.id, overrides),
          resolveAdapter: resolve,
          now: NOW,
        }).blocked,
      ).toBe(true);
    }
  });
});
