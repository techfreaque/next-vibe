/**
 * Customer access to remote connections — the SERVING side's gate.
 *
 * A customer's self-hosted instance connects TO this instance (unbottled.ai)
 * with the customer's own account token. Admin connections keep their full
 * feature set; for every non-admin the serving side enforces:
 *   - eligibility: a paid account (same rule as the /v1 API, isPaidUser)
 *   - a cap on connected instances per account
 *   - per-account rate limits on register, the event bridge and sync
 *   - pinned transports: we only ever reach a customer instance over its own
 *     reverse-ws connector, never by HTTP/WS to a URL the customer supplied
 *     (no SSRF from our network)
 *   - an audit row for every lifecycle event and denial
 *
 * Data isolation itself is NOT decided here: every relayed request runs as the
 * customer's real user with their real roles, and each applier / sync provider
 * scopes its reads and writes to that user (see the remote-for-customers
 * threat model). This module decides whether a customer may use the remote
 * surface at all, and how much of it.
 */

import "server-only";

import { and, count, eq } from "drizzle-orm";

import { isPaidUser } from "@/api-keys/paid";

import type { CountryLanguage } from "../../core/i18n/core/config";
import type { TranslatedKeyType } from "../../core/i18n/core/scoped-translation";
import { db } from "../../database";
import type { JwtPayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import type { EndpointLogger } from "../../logger/types";
import {
  type RemoteConnectionAuditAction,
  remoteConnectionAudit,
  remoteConnections,
  type TransportMode,
} from "../db";
import { scopedTranslation } from "./i18n";

export const REMOTE_CUSTOMER_LIMITS = {
  /** Connected instances per customer account. */
  maxConnections: 3,
  /** Register / re-register calls per account per hour. */
  registerPerHour: 20,
  /** Bridge events per account per minute (content deltas included). */
  bridgePerMinute: 3000,
  /** Sync exchanges per account per minute. */
  syncPerMinute: 60,
} as const;

/**
 * Transports pinned on a customer's reverse entry. We reach the customer's
 * instance only through the connector socket IT opens to us (reverse-ws), and
 * it reaches us over plain HTTPS (direct-http). Nothing ever dials the URL the
 * customer handed us.
 */
export const CUSTOMER_TRANSPORT: {
  transportMode: TransportMode;
  remoteTransportMode: TransportMode;
} = {
  transportMode: "reverse-ws",
  remoteTransportMode: "direct-http",
};

export type RemoteAccessPurpose = "register" | "bridge" | "sync";

export type RemoteAccessDenial =
  | "notPaid"
  | "noConnection"
  | "connectionLimit"
  | "rateLimited";

export type RemoteAccessResult =
  | { allowed: true }
  | {
      allowed: false;
      reason: RemoteAccessDenial;
      /** Localized, ready to return to the caller. */
      message: TranslatedKeyType;
    };

export function isRemoteAdmin(user: JwtPayloadType): boolean {
  return !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
}

// ── Rate limiting (fixed window, per process) ───────────────────────────────

interface WindowState {
  windowStart: number;
  count: number;
  /** A denial was already audited in this window (one audit row per window). */
  denialAudited: boolean;
}

function getWindows(): Map<string, WindowState> {
  const g = globalThis as typeof globalThis & {
    __nvRemoteCustomerRate?: Map<string, WindowState>;
  };
  g.__nvRemoteCustomerRate ??= new Map<string, WindowState>();
  return g.__nvRemoteCustomerRate;
}

const PURPOSE_WINDOW: Record<
  RemoteAccessPurpose,
  { windowMs: number; limit: number }
> = {
  register: {
    windowMs: 60 * 60 * 1000,
    limit: REMOTE_CUSTOMER_LIMITS.registerPerHour,
  },
  bridge: {
    windowMs: 60 * 1000,
    limit: REMOTE_CUSTOMER_LIMITS.bridgePerMinute,
  },
  sync: { windowMs: 60 * 1000, limit: REMOTE_CUSTOMER_LIMITS.syncPerMinute },
};

function consumeWindow(
  userId: string,
  purpose: RemoteAccessPurpose,
  now: number,
): { allowed: boolean; retryAfterSeconds: number; auditDenial: boolean } {
  const { windowMs, limit } = PURPOSE_WINDOW[purpose];
  const key = `${purpose}:${userId}`;
  const windows = getWindows();
  const state = windows.get(key);
  if (!state || now - state.windowStart >= windowMs) {
    windows.set(key, { windowStart: now, count: 1, denialAudited: false });
    return { allowed: true, retryAfterSeconds: 0, auditDenial: false };
  }
  if (state.count >= limit) {
    const auditDenial = !state.denialAudited;
    state.denialAudited = true;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((windowMs - (now - state.windowStart)) / 1000),
      ),
      auditDenial,
    };
  }
  state.count += 1;
  return { allowed: true, retryAfterSeconds: 0, auditDenial: false };
}

/** Test hook: drop every rate window (or one account's). */
export function resetRemoteCustomerRateLimits(userId?: string): void {
  const windows = getWindows();
  if (!userId) {
    windows.clear();
    return;
  }
  for (const purpose of Object.keys(PURPOSE_WINDOW)) {
    windows.delete(`${purpose}:${userId}`);
  }
}

// ── Active-connection cache (bridge events are hot) ─────────────────────────

const ACTIVE_CACHE_TTL_MS = 30_000;

function getActiveCache(): Map<string, number> {
  const g = globalThis as typeof globalThis & {
    __nvRemoteCustomerActive?: Map<string, number>;
  };
  g.__nvRemoteCustomerActive ??= new Map<string, number>();
  return g.__nvRemoteCustomerActive;
}

/** Call after a customer's connection is deleted so revocation is immediate. */
export function invalidateRemoteCustomerAccess(userId: string): void {
  getActiveCache().delete(userId);
}

async function hasActiveConnection(userId: string): Promise<boolean> {
  const cache = getActiveCache();
  const cachedAt = cache.get(userId);
  if (cachedAt !== undefined && Date.now() - cachedAt < ACTIVE_CACHE_TTL_MS) {
    return true;
  }
  const [row] = await db
    .select({ id: remoteConnections.id })
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, userId),
        eq(remoteConnections.isActive, true),
      ),
    )
    .limit(1);
  if (row) {
    cache.set(userId, Date.now());
    return true;
  }
  return false;
}

async function countConnections(userId: string): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(remoteConnections)
    .where(eq(remoteConnections.userId, userId));
  return row?.value ?? 0;
}

async function connectionExists(
  userId: string,
  instanceId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ id: remoteConnections.id })
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, userId),
        eq(remoteConnections.instanceId, instanceId),
      ),
    )
    .limit(1);
  return row !== undefined;
}

// ── Audit ───────────────────────────────────────────────────────────────────

/**
 * Append an audit row (fire-and-forget: an audit failure never blocks the
 * request it describes, but is logged at error level).
 */
export function recordRemoteAudit(params: {
  userId: string;
  instanceId: string | null;
  action: RemoteConnectionAuditAction;
  reason?: string;
  logger: EndpointLogger;
}): void {
  const { userId, instanceId, action, reason, logger } = params;
  logger.info("[RemoteAudit]", { userId, instanceId, action, reason });
  void db
    .insert(remoteConnectionAudit)
    .values({ userId, instanceId, action, reason: reason ?? null })
    .catch((err: Error) => {
      logger.error("[RemoteAudit] insert failed", {
        userId,
        instanceId,
        action,
        error: err.message,
      });
    });
}

// ── The gate ────────────────────────────────────────────────────────────────

/**
 * May this account use the remote surface for `purpose` right now?
 * Admins: always. Everyone else: paid + per-purpose rules + rate limit.
 * Every denial is audited (rate denials once per window).
 */
export async function checkRemoteCustomerAccess(params: {
  user: JwtPayloadType;
  purpose: RemoteAccessPurpose;
  /** register only: the label being (re-)registered. */
  instanceId?: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<RemoteAccessResult> {
  const { user, purpose, instanceId, locale, logger } = params;
  if (isRemoteAdmin(user)) {
    return { allowed: true };
  }
  const { t } = scopedTranslation.scopedT(locale);
  if (user.isPublic) {
    return {
      allowed: false,
      reason: "notPaid",
      message: t("denied.notPaid"),
    };
  }
  const userId = user.id;

  const deny = (
    reason: RemoteAccessDenial,
    message: TranslatedKeyType,
    audit: boolean,
  ): RemoteAccessResult => {
    if (audit) {
      recordRemoteAudit({
        userId,
        instanceId: instanceId ?? null,
        action: reason === "rateLimited" ? "rate_limited" : "denied",
        reason: `${purpose}:${reason}`,
        logger,
      });
    } else {
      logger.debug("[RemoteAccess] denied", { userId, purpose, reason });
    }
    return { allowed: false, reason, message };
  };

  if (!(await isPaidUser(userId))) {
    // Bridge/sync denials for unpaid accounts are rare (no row can exist
    // without a paid register) — audit them, they indicate probing.
    return deny("notPaid", t("denied.notPaid"), true);
  }

  if (purpose === "register") {
    const isExisting =
      instanceId !== undefined && (await connectionExists(userId, instanceId));
    if (
      !isExisting &&
      (await countConnections(userId)) >= REMOTE_CUSTOMER_LIMITS.maxConnections
    ) {
      return deny(
        "connectionLimit",
        t("denied.connectionLimit", {
          max: REMOTE_CUSTOMER_LIMITS.maxConnections,
        }),
        true,
      );
    }
  } else if (!(await hasActiveConnection(userId))) {
    return deny("noConnection", t("denied.noConnection"), true);
  }

  const budget = consumeWindow(userId, purpose, Date.now());
  if (!budget.allowed) {
    return deny(
      "rateLimited",
      t("denied.rateLimited", { seconds: budget.retryAfterSeconds }),
      budget.auditDenial,
    );
  }
  return { allowed: true };
}

/**
 * Customer-supplied instance URL check. We never dial it (transports are
 * pinned), but it is stored and shown back, so it must be a plain http(s)
 * origin: no credentials, path, query or fragment tricks.
 */
export function validateCustomerInstanceUrl(
  rawUrl: string,
  locale: CountryLanguage,
): TranslatedKeyType | null {
  const { t } = scopedTranslation.scopedT(locale);
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return t("denied.invalidUrl");
  }
  const isPlainOrigin =
    (parsed.protocol === "https:" || parsed.protocol === "http:") &&
    parsed.username === "" &&
    parsed.password === "" &&
    (parsed.pathname === "/" || parsed.pathname === "") &&
    parsed.search === "" &&
    parsed.hash === "";
  return isPlainOrigin ? null : t("denied.invalidUrl");
}
