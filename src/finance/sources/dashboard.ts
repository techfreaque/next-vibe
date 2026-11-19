/* eslint-disable i18next/no-literal-string */

import "server-only";

import { z } from "zod";

import { FINANCE_CONFIG } from "../config";
import { dayKey, startOfUtcDay } from "../logic";
import type { FinanceHttp, HttpResult } from "./http";
import type { ProviderResult } from "./types";

export interface DashboardCredentials {
  email: string;
  password: string;
}

export interface ProviderDashboard {
  balanceUrl: string;
  fetchBalance(
    http: FinanceHttp,
    credentials: DashboardCredentials,
    now: Date,
  ): Promise<ProviderResult>;
}

interface DashboardSession {
  token: string;
  userId: string;
  expiresIn: number;
}

type SessionResult =
  | { session: DashboardSession; reason: null }
  | { session: null; reason: string };

interface SessionCache {
  session: DashboardSession | null;
  expiresAt: number;
  retryAt: number;
  pending: Promise<SessionResult> | null;
}

function dashboardSession(
  signIn: (
    http: FinanceHttp,
    credentials: DashboardCredentials,
  ) => Promise<SessionResult>,
): (
  http: FinanceHttp,
  credentials: DashboardCredentials,
  read: (
    http: FinanceHttp,
    session: DashboardSession,
  ) => Promise<ProviderResult>,
) => Promise<ProviderResult> {
  const accounts = new WeakMap<FinanceHttp, Map<string, SessionCache>>();
  return async (http, credentials, read) => {
    const accountSessions =
      accounts.get(http) ?? new Map<string, SessionCache>();
    accounts.set(http, accountSessions);
    const cache = accountSessions.get(credentials.email) ?? {
      session: null,
      expiresAt: 0,
      retryAt: 0,
      pending: null,
    };
    accountSessions.set(credentials.email, cache);
    const now = Date.now();
    if (cache.retryAt > now) {
      return {
        status: "failed",
        reason:
          "dashboard requests are temporarily paused after a failed request",
      };
    }

    const request: FinanceHttp = async (input) => {
      const response = await http({ ...input, rejectRedirects: true });
      if (response.status === 429) {
        cache.retryAt = Math.max(
          cache.retryAt,
          Date.now() + Math.max(response.retryAfterMs ?? 0, 60_000),
        );
      }
      return response;
    };

    if (!cache.session || cache.expiresAt <= now) {
      cache.pending ??= signIn(request, credentials)
        .catch((): SessionResult => ({
          session: null,
          reason: "dashboard sign-in request failed",
        }))
        .then((result) => {
          cache.session = result.session;
          cache.expiresAt =
            Date.now() + (result.session?.expiresIn ?? 0) * 1_000 - 30_000;
          if (!result.session) {
            cache.retryAt = Math.max(cache.retryAt, Date.now() + 15 * 60_000);
          }
          return result;
        })
        .finally(() => {
          cache.pending = null;
        });
      const result = await cache.pending;
      if (!result.session) {
        return { status: "failed", reason: result.reason };
      }
    }

    const session = cache.session;
    if (!session) {
      return { status: "failed", reason: "dashboard session unavailable" };
    }
    let blockedStatus = 429;
    const readRequest: FinanceHttp = async (input) => {
      if (cache.retryAt > Date.now()) {
        return { status: blockedStatus, json: null };
      }
      const response = await request(input);
      if (response.status === 401 && cache.session === session) {
        cache.session = null;
        blockedStatus = 401;
        cache.retryAt = Math.max(cache.retryAt, Date.now() + 60_000);
      }
      return response;
    };
    return await read(readRequest, session).catch((): ProviderResult => ({
      status: "failed",
      reason: "dashboard request failed",
    }));
  };
}

const credits = z
  .union([z.number(), z.string().trim().min(1)])
  .transform(Number)
  .pipe(z.number().nonnegative());
const token = z.string().min(1);
const bearer = (value: string): Record<string, string> => ({
  Authorization: `Bearer ${value}`,
});

function loginFailure(status: number): SessionResult {
  return {
    session: null,
    reason: `dashboard sign-in rejected (HTTP ${status})`,
  };
}

// Public project configuration shipped by the provider's browser client.
const UNCENSORED_BASE = "https://mkstqjtsujvcaobdksxs.supabase.co";
const UNCENSORED_PROJECT_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc3RxanRzdWp2Y2FvYmRrc3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NzQyNjksImV4cCI6MjA2ODM1MDI2OX0.suu2A2fAcdJfAG0dOjOjWLfU6BXxNSn5GrbiSSmUiw0";
export const UNCENSORED_CREDIT_USD = 0.05;
export const UNCENSORED_CREDIT_UNIT = "uncensored.ai credits";
const uncensoredBalanceUrl = `${UNCENSORED_BASE}/rest/v1/rpc/get_user_credit_balance`;
const supabaseSession = z.object({
  access_token: token,
  expires_in: z.number().positive(),
  user: z.object({ id: z.string().uuid() }),
});
const uncensoredKeys = z.array(
  z.object({
    status: z.string(),
    credits_remaining: credits,
    total_credits: credits,
  }),
);

const uncensoredSession = dashboardSession(
  async (http, { email, password }) => {
    const response = await http({
      url: `${UNCENSORED_BASE}/auth/v1/token?grant_type=password`,
      method: "POST",
      headers: {
        apikey: UNCENSORED_PROJECT_KEY,
        ...bearer(UNCENSORED_PROJECT_KEY),
      },
      body: { email: email.toLowerCase(), password },
    });
    if (response.status !== 200) {
      return loginFailure(response.status);
    }
    const parsed = supabaseSession.safeParse(response.json);
    return parsed.success
      ? {
          session: {
            token: parsed.data.access_token,
            userId: parsed.data.user.id,
            expiresIn: parsed.data.expires_in,
          },
          reason: null,
        }
      : { session: null, reason: "unexpected uncensored.ai sign-in response" };
  },
);

export const uncensoredDashboard: ProviderDashboard = {
  balanceUrl: uncensoredBalanceUrl,
  async fetchBalance(http, credentials) {
    return await uncensoredSession(
      http,
      credentials,
      async (request, session) => {
        const headers = {
          apikey: UNCENSORED_PROJECT_KEY,
          ...bearer(session.token),
        };
        const wallet = await request({
          url: uncensoredBalanceUrl,
          method: "POST",
          headers,
          body: {},
        });
        const unassigned = credits.safeParse(wallet.json);
        if (wallet.status !== 200 || !unassigned.success) {
          return {
            status: "failed",
            reason: `uncensored.ai wallet response unavailable (HTTP ${wallet.status})`,
          };
        }

        const url = new URL(`${UNCENSORED_BASE}/rest/v1/api_keys`);
        url.searchParams.set("user_id", `eq.${session.userId}`);
        url.searchParams.set(
          "select",
          "status,credits_remaining,total_credits",
        );
        url.searchParams.set("order", "id.asc");
        const limit = 100;
        url.searchParams.set("limit", String(limit));
        let assigned = 0;
        let spent = 0;
        for (let page = 0; page < FINANCE_CONFIG.maxPages; page += 1) {
          url.searchParams.set("offset", String(page * limit));
          const keys = await request({
            url: url.toString(),
            method: "GET",
            headers,
          });
          const parsed = uncensoredKeys.safeParse(keys.json);
          if (keys.status !== 200 || !parsed.success) {
            return {
              status: "failed",
              reason: `uncensored.ai API-key credit totals unavailable (HTTP ${keys.status})`,
            };
          }
          for (const key of parsed.data) {
            if (key.status === "active") {
              assigned += key.credits_remaining;
              spent += Math.max(0, key.total_credits - key.credits_remaining);
            }
          }
          if (parsed.data.length < limit) {
            const balance = assigned + unassigned.data;
            return {
              status: "ok",
              balanceUsd: balance * UNCENSORED_CREDIT_USD,
              balanceNative: balance,
              unit: UNCENSORED_CREDIT_UNIT,
              cumulativeUsageUsd: spent * UNCENSORED_CREDIT_USD,
              note: `${assigned} credits assigned to active keys, ${unassigned.data} unassigned, ${spent} spent on active keys`,
            };
          }
        }
        return {
          status: "failed",
          reason: "uncensored.ai API-key credit totals exceeded the page limit",
        };
      },
    );
  },
};

// Public Firebase web app configuration. The inference API key is separate.
const FREEDOM_PROJECT_KEY = "AIzaSyAsbjdjDimXPNRtTbS0Ob1FB1_QXaDGd2o";
const freedomBalanceUrl = "https://chat.freedomgpt.com/api/checkSubscription";
const freedomUsageUrl = "https://chat.freedomgpt.com/api/user/daily-usage";
const freedomSignIn = z.object({
  idToken: token,
  localId: z.string().min(1),
  expiresIn: credits.pipe(z.number().positive()),
});
const firestoreCredit = z.union([
  z.object({ integerValue: credits }).transform((value) => value.integerValue),
  z.object({ doubleValue: credits }).transform((value) => value.doubleValue),
]);
const freedomUser = z.object({
  fields: z
    .object({
      credits: firestoreCredit.optional(),
      premiumCreditSpent: firestoreCredit.optional(),
    })
    .default({}),
});
const freedomSubscription = z.object({
  totalCredits: credits.nullish(),
  subscription: z
    .object({
      status: z.string().optional(),
      unlimited: z.boolean().optional(),
    })
    .nullish(),
});
const freedomLifetime = z.object({
  data: z.object({ totalCreditsSpent: credits }),
});
const freedomDaily = z.object({
  data: z.object({
    dailyUsage: z.array(z.object({ date: z.string(), creditsSpent: credits })),
    hasMore: z.boolean().optional(),
    nextCursor: z.string().nullish(),
  }),
});

const freedomSession = dashboardSession(async (http, { email, password }) => {
  const response = await http({
    url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FREEDOM_PROJECT_KEY}`,
    method: "POST",
    headers: {},
    body: {
      email,
      password,
      returnSecureToken: true,
      clientType: "CLIENT_TYPE_WEB",
    },
  });
  if (response.status !== 200) {
    return loginFailure(response.status);
  }
  const parsed = freedomSignIn.safeParse(response.json);
  return parsed.success
    ? {
        session: {
          token: parsed.data.idToken,
          userId: parsed.data.localId,
          expiresIn: parsed.data.expiresIn,
        },
        reason: null,
      }
    : {
        session: null,
        reason:
          "unexpected FreedomGPT sign-in response. Check whether the account needs an interactive sign-in",
      };
});

async function freedomDailySpend(
  get: (url: string) => ReturnType<FinanceHttp>,
  day: string,
): Promise<number | null> {
  const url = new URL(freedomUsageUrl);
  url.searchParams.set("limit", "50");
  url.searchParams.set("startDate", day);
  url.searchParams.set("endDate", day);
  const cursors = new Set<string>();
  for (let page = 0; page < 10; page += 1) {
    const response = await get(url.toString());
    const parsed = freedomDaily.safeParse(response.json);
    if (response.status !== 200 || !parsed.success) {
      return null;
    }
    const { dailyUsage, hasMore, nextCursor } = parsed.data.data;
    const reading = dailyUsage.find((entry) => entry.date === day);
    if (reading) {
      return reading.creditsSpent;
    }
    if (!hasMore) {
      return 0;
    }
    if (!nextCursor || cursors.has(nextCursor)) {
      return null;
    }
    cursors.add(nextCursor);
    url.searchParams.set("cursor", nextCursor);
  }
  return null;
}

export const freedomDashboard: ProviderDashboard = {
  balanceUrl: freedomBalanceUrl,
  async fetchBalance(http, credentials, now) {
    return await freedomSession(http, credentials, async (request, session) => {
      const headers = bearer(session.token);
      const get = async (url: string): Promise<HttpResult> =>
        await request({ url, method: "GET", headers }).catch(() => ({
          status: 0,
          json: null,
        }));
      const userDoc = new URL(
        `https://firestore.googleapis.com/v1/projects/freedom-gpt/databases/(default)/documents/users/${encodeURIComponent(session.userId)}`,
      );
      userDoc.searchParams.append("mask.fieldPaths", "credits");
      userDoc.searchParams.append("mask.fieldPaths", "premiumCreditSpent");

      const subscription = await get(freedomBalanceUrl);
      const user = await get(userDoc.toString());
      const sub = freedomSubscription.safeParse(subscription.json);
      const doc = freedomUser.safeParse(user.json);
      const day = dayKey(
        new Date(startOfUtcDay(now).getTime() - FINANCE_CONFIG.dayMs),
      );
      const daily = await freedomDailySpend(get, day);
      const lifetimeResponse = await get(`${freedomUsageUrl}?summary=all`);
      const lifetime = freedomLifetime.safeParse(lifetimeResponse.json);
      const total =
        lifetimeResponse.status === 200 && lifetime.success
          ? lifetime.data.data.totalCreditsSpent
          : null;

      let balance: number | null = null;
      const notes: string[] = [];
      if (
        subscription.status === 200 &&
        sub.success &&
        user.status === 200 &&
        doc.success
      ) {
        const plan = sub.data.subscription;
        if (plan?.unlimited) {
          notes.push("unlimited plan");
        } else {
          const planLeft =
            plan?.status === "active"
              ? Math.max(
                  0,
                  (sub.data.totalCredits ?? 0) -
                    (doc.data.fields.premiumCreditSpent ?? 0),
                )
              : 0;
          balance = (doc.data.fields.credits ?? 0) + planLeft;
          notes.push(`${balance} account credits remaining`);
        }
      } else {
        notes.push(
          `FreedomGPT balance unavailable (subscription HTTP ${subscription.status}, account HTTP ${user.status})`,
        );
      }
      notes.push(
        daily === null
          ? `daily usage unavailable for ${day}`
          : `${daily} credits spent on ${day} UTC`,
      );
      if (total !== null) {
        notes.push(`${total} lifetime credits spent`);
      }
      if (
        balance === null &&
        !sub.data?.subscription?.unlimited &&
        daily === null &&
        total === null
      ) {
        return { status: "failed", reason: notes.join(". ") };
      }
      return {
        status: "ok",
        balanceUsd: null,
        balanceNative: balance,
        unit: "FreedomGPT credits",
        cumulativeUsageUsd: null,
        ...(daily === null ? {} : { previousDaySpendNative: daily }),
        note: notes.join(". "),
      };
    });
  },
};
