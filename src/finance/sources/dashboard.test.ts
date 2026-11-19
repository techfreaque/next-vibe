import { describe, expect, it } from "bun:test";

import { freedomDashboard, uncensoredDashboard } from "./dashboard";
import type { FinanceHttp, HttpResult } from "./http";

const credentials = { email: "finance@example.test", password: "fixture-password" };
const now = new Date("2026-11-19T00:30:00Z");

describe("finance dashboard reads", () => {
  it("reuses the Supabase login and reads only credits on the signed-in account's keys", async () => {
    let signIns = 0;
    const userId = "70dd4cc6-9269-4eb9-8c07-49d1ff541f3c";
    const http: FinanceHttp = async (request): Promise<HttpResult> => {
      const url = new URL(request.url);
      expect(request.rejectRedirects).toBe(true);
      if (url.pathname === "/auth/v1/token") {
        signIns += 1;
        expect(request.method).toBe("POST");
        expect(url.searchParams.get("grant_type")).toBe("password");
        expect(request.body).toEqual(credentials);
        return {
          status: 200,
          json: { access_token: "fixture-session", expires_in: 3600, user: { id: userId } },
        };
      }
      expect(request.headers.Authorization).toBe("Bearer fixture-session");
      if (url.pathname === "/rest/v1/rpc/get_user_credit_balance") {
        expect(request.method).toBe("POST");
        expect(request.body).toEqual({});
        return { status: 200, json: 24 };
      }
      expect(request.method).toBe("GET");
      expect(url.pathname).toBe("/rest/v1/api_keys");
      expect(url.searchParams.get("user_id")).toBe(`eq.${userId}`);
      expect(url.searchParams.get("select")).toBe("status,credits_remaining,total_credits");
      return {
        status: 200,
        json: [
          { status: "active", credits_remaining: "26", total_credits: 50 },
          { status: "active", credits_remaining: 10, total_credits: "14" },
          { status: "revoked", credits_remaining: 100, total_credits: 200 },
        ],
      };
    };

    const readings = await Promise.all([
      uncensoredDashboard.fetchBalance(http, credentials, now),
      uncensoredDashboard.fetchBalance(http, credentials, now),
    ]);
    expect(signIns).toBe(1);
    for (const reading of readings) {
      expect(reading).toMatchObject({
        status: "ok",
        balanceNative: 60,
        balanceUsd: 3,
        cumulativeUsageUsd: expect.closeTo(1.4),
      });
    }
  });

  it("combines FreedomGPT's wallet and plan credits and reads the closed UTC day", async () => {
    const http: FinanceHttp = async (request): Promise<HttpResult> => {
      const url = new URL(request.url);
      if (url.hostname === "identitytoolkit.googleapis.com") {
        expect(url.pathname).toBe("/v1/accounts:signInWithPassword");
        expect(request.body).toMatchObject({ ...credentials, returnSecureToken: true });
        return { status: 200, json: { idToken: "fixture-id-token", localId: "fixture-uid", expiresIn: "3600" } };
      }
      expect(request.headers.Authorization).toBe("Bearer fixture-id-token");
      expect(request.method).toBe("GET");
      if (url.hostname === "firestore.googleapis.com") {
        expect(url.pathname).toBe("/v1/projects/freedom-gpt/databases/(default)/documents/users/fixture-uid");
        expect(url.searchParams.getAll("mask.fieldPaths")).toEqual(["credits", "premiumCreditSpent"]);
        return {
          status: 200,
          json: { fields: { credits: { integerValue: "20" }, premiumCreditSpent: { doubleValue: 14.5 } } },
        };
      }
      if (url.pathname === "/api/checkSubscription") {
        return { status: 200, json: { totalCredits: 100, subscription: { status: "active" } } };
      }
      expect(url.pathname).toBe("/api/user/daily-usage");
      if (url.searchParams.get("summary") === "all") {
        return { status: 200, json: { data: { totalCreditsSpent: 365 } } };
      }
      expect(url.searchParams.get("startDate")).toBe("2026-11-18");
      expect(url.searchParams.get("endDate")).toBe("2026-11-18");
      return { status: 200, json: { data: { dailyUsage: [{ date: "2026-11-18", creditsSpent: 12.5 }], hasMore: false } } };
    };
    const reading = await freedomDashboard.fetchBalance(http, credentials, now);
    expect(reading).toMatchObject({
      status: "ok",
      balanceNative: 105.5,
      balanceUsd: null,
      cumulativeUsageUsd: null,
      previousDaySpendNative: 12.5,
      note: expect.stringContaining("365 lifetime credits spent"),
    });
  });

  it("honors account read rate limits and keeps upstream error payloads out of reports", async () => {
    let requests = 0;
    const http: FinanceHttp = async (request): Promise<HttpResult> => {
      requests += 1;
      if (new URL(request.url).hostname === "identitytoolkit.googleapis.com") {
        return { status: 200, json: { idToken: "fixture-id-token", localId: "fixture-uid", expiresIn: "3600" } };
      }
      return { status: 429, retryAfterMs: 180_000, json: { message: "private response content" } };
    };
    const first = await freedomDashboard.fetchBalance(http, credentials, now);
    expect(first).toMatchObject({ status: "failed", reason: expect.stringContaining("429") });
    expect(JSON.stringify(first)).not.toContain("private response content");
    const second = await freedomDashboard.fetchBalance(http, credentials, now);
    expect(second).toMatchObject({ status: "failed", reason: expect.stringContaining("paused") });
    expect(requests).toBe(2);
  });
});
