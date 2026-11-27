import "server-only";

import { randomUUID } from "node:crypto";

import { and, asc, eq, gt, isNull, lte, type SQL, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype } from "@/chart-of-accounts/enum";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";
import { notifications } from "@/notifications/db";
import { NotificationType } from "@/notifications/enum";

import {
  accountIdentifiers,
  authorizeConsent,
  type ConsentBank,
  consentLimit,
  type ConsentTransport,
  exchangeConsent,
  type PsuType,
} from "./client";
import {
  createConsentState,
  decryptConsentValue,
  encryptConsentValue,
  verifyConsentState,
} from "./crypto";
import {
  enableBankingAttempts,
  enableBankingConsentAccounts,
  enableBankingConsents,
} from "./db";
import { scopedTranslation } from "./i18n";
import { matchReconsentedAccounts } from "./reconsent";

export const enableBankingCallbackPath =
  "/api/en-GLOBAL/finance/bank-connections/enable-banking/callback";
const secondsPerDay = 86_400;
const maxConsentDays = 180;
const attemptLifetimeMs = 20 * 60_000;

export type ConsentOrigin = "https://unbottled.ai" | "http://localhost:3000";
export function consentOrigin(input: string): ConsentOrigin | undefined {
  try {
    const url = new URL(input);
    if (
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      return undefined;
    }
    const { origin } = url;
    return origin === "https://unbottled.ai" ||
      origin === "http://localhost:3000"
      ? origin
      : undefined;
  } catch {
    return undefined;
  }
}

interface StartConsent {
  actorId: string;
  companyId: string;
  ledgerAccountId: string;
  bank: ConsentBank;
  psu: PsuType;
  origin: ConsentOrigin;
}

interface ConsentDependencies {
  request: ConsentTransport;
  logger: EndpointLogger;
  locale: CountryLanguage;
  now?: () => Date;
  secret?: Buffer;
}

async function canManageConsent(
  actorId: string,
  companyId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<boolean> {
  const [admin] = await db
    .select({ id: userRoles.id })
    .from(userRoles)
    .where(
      and(eq(userRoles.userId, actorId), eq(userRoles.role, UserRole.ADMIN)),
    )
    .limit(1);
  if (!admin) {
    return false;
  }
  const [company] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(and(eq(companies.id, companyId), eq(companies.isActive, true)));
  if (!company) {
    return false;
  }
  const member = await CompanyAuthRepository.requireMember(
    actorId,
    companyId,
    CompanyMemberRole.ADMIN,
    logger,
    locale,
  );
  return member.success;
}

function activeBankAccount(
  companyId: string,
  accountId: string,
): SQL | undefined {
  return and(
    eq(accountNodes.companyId, companyId),
    eq(accountNodes.id, accountId),
    eq(accountNodes.subtype, AccountSubtype.BANK),
    eq(accountNodes.isActive, true),
    eq(accountNodes.isPostable, true),
  );
}

export async function startEnableBankingConsent(
  input: StartConsent,
  {
    request,
    logger,
    locale,
    now = () => new Date(),
    secret,
  }: ConsentDependencies,
): Promise<
  | { status: "started"; url: string; ledgerAccountName: string }
  | { status: "forbidden" | "unavailable" }
> {
  const { actorId, companyId, ledgerAccountId, bank, origin, psu } = input;
  if (!(await canManageConsent(actorId, companyId, logger, locale))) {
    return { status: "forbidden" };
  }
  const [account] = await db
    .select({ name: accountNodes.name, code: accountNodes.code })
    .from(accountNodes)
    .where(activeBankAccount(companyId, ledgerAccountId));
  if (!account) {
    return { status: "forbidden" };
  }

  try {
    const cap = await consentLimit(request, bank, psu);
    if (!cap) {
      return { status: "unavailable" };
    }
    const current = now();
    const requestedUntil = new Date(
      Math.floor(current.getTime() / 1000) * 1000 +
        Math.min(maxConsentDays * secondsPerDay, cap) * 1000,
    );
    const { state, digest } = createConsentState(secret);
    const url = await authorizeConsent(request, {
      bank,
      psu,
      state,
      callbackUrl: origin + enableBankingCallbackPath,
      requestedUntil,
    });
    if (!url) {
      return { status: "unavailable" };
    }

    await db.insert(enableBankingAttempts).values({
      id: randomUUID(),
      nonceDigest: digest,
      actorId,
      companyId,
      ledgerAccountId,
      bankName: bank.name,
      bankCountry: bank.country,
      personal: psu === "personal",
      callbackOrigin: origin,
      requestedUntil,
      expiresAt: new Date(current.getTime() + attemptLifetimeMs),
    });
    return {
      status: "started",
      url,
      ledgerAccountName: `${account.code} · ${account.name}`,
    };
  } catch {
    return { status: "unavailable" };
  }
}

interface CallbackInput {
  state?: string;
  code?: string;
  denied: boolean;
  origin: ConsentOrigin;
}

const codeSchema = z.string().min(1).max(1_500);

export async function completeEnableBankingConsent(
  input: CallbackInput,
  {
    request,
    logger,
    locale,
    now = () => new Date(),
    secret,
  }: ConsentDependencies,
): Promise<false | { companyId: string }> {
  if (!input.state) {
    return false;
  }
  const nonceDigest = verifyConsentState(input.state, secret);
  if (!nonceDigest) {
    return false;
  }

  const attempts = enableBankingAttempts;
  const current = now();
  try {
    const [attempt] = await db
      .update(attempts)
      .set({ consumedAt: current })
      .where(
        and(
          eq(attempts.nonceDigest, nonceDigest),
          eq(attempts.callbackOrigin, input.origin),
          gt(attempts.expiresAt, current),
          isNull(attempts.consumedAt),
        ),
      )
      .returning();
    // Claim before provider exchange. A replay or an indeterminate network
    // failure never exchanges the bank's one-use authorization code twice.
    if (
      !attempt ||
      input.denied ||
      !codeSchema.safeParse(input.code).success ||
      !input.code
    ) {
      return false;
    }
    if (
      !(await canManageConsent(
        attempt.actorId,
        attempt.companyId,
        logger,
        locale,
      ))
    ) {
      return false;
    }
    const [account] = await db
      .select({ id: accountNodes.id })
      .from(accountNodes)
      .where(activeBankAccount(attempt.companyId, attempt.ledgerAccountId));
    if (!account) {
      return false;
    }

    const session = await exchangeConsent(request, input.code);
    if (
      !session ||
      session.aspsp.name !== attempt.bankName ||
      session.aspsp.country !== attempt.bankCountry ||
      session.psu_type !== (attempt.personal ? "personal" : "business")
    ) {
      return false;
    }
    const expiry = new Date(session.access.valid_until);
    if (expiry <= now() || expiry > attempt.requestedUntil) {
      return false;
    }
    if (
      new Set(session.accounts.map(({ uid }) => uid)).size !==
      session.accounts.length
    ) {
      return false;
    }

    const consentId = randomUUID();
    const companyId = attempt.companyId;
    return await db.transaction(async (tx) => {
      if (!(await lockLedgerCompany(tx, companyId))) {
        return false;
      }
      const [ledgerAccount] = await tx
        .select({ id: accountNodes.id })
        .from(accountNodes)
        .where(activeBankAccount(companyId, attempt.ledgerAccountId));
      if (!ledgerAccount) {
        return false;
      }

      const matches = await matchReconsentedAccounts(
        tx,
        attempt,
        session.accounts,
        secret,
      );
      if (!matches) {
        return false;
      }

      await tx.insert(enableBankingConsents).values({
        id: consentId,
        attemptId: attempt.id,
        actorId: attempt.actorId,
        companyId,
        bankName: attempt.bankName,
        bankCountry: attempt.bankCountry,
        consentUntil: expiry,
        sessionEncrypted: encryptConsentValue(
          session.session_id,
          ["session", companyId, consentId],
          secret,
        ),
      });
      for (const [
        index,
        { currency, ...identifiers },
      ] of session.accounts.entries()) {
        const previousId = matches.get(identifiers.uid);
        const id = previousId ?? randomUUID();
        const values = {
          consentId,
          ordinal: index + 1,
          currency,
          identifiersEncrypted: encryptConsentValue(
            JSON.stringify(identifiers),
            ["account", companyId, consentId, id],
            secret,
          ),
        };
        const accounts = enableBankingConsentAccounts;
        if (previousId) {
          // Preserve the local account PK, which anchors mappings and privacy settings.
          await tx
            .update(accounts)
            .set(values)
            .where(eq(accounts.id, previousId));
        } else {
          await tx.insert(accounts).values({ id, ...values });
        }
      }
      return { companyId };
    });
  } catch {
    return false;
  }
}

function activeConsent(companyId: string, actorId: string): SQL | undefined {
  return and(
    eq(enableBankingConsents.companyId, companyId),
    eq(enableBankingConsents.actorId, actorId),
    isNull(enableBankingConsents.revokedAt),
    gt(enableBankingConsents.consentUntil, new Date()),
  );
}

function inaccessible(locale: CountryLanguage): ResponseType<never> {
  const { t } = scopedTranslation.scopedT(locale);
  return fail({
    message: t("forbidden"),
    errorType: ErrorResponseTypes.FORBIDDEN,
  });
}
function invalidAccount(locale: CountryLanguage): ResponseType<never> {
  const { t } = scopedTranslation.scopedT(locale);
  return fail({
    message: t("invalidAccount"),
    errorType: ErrorResponseTypes.NOT_FOUND,
  });
}

export async function listEnableBankingAccounts(
  companyId: string,
  actorId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<
  ResponseType<
    Array<{
      id: string;
      name: string;
      currency: string | null;
      suggestedAccountId?: string;
      ledgerLabel?: string;
      consentUntil: string;
    }>
  >
> {
  if (!(await canManageConsent(actorId, companyId, logger, locale))) {
    return inaccessible(locale);
  }
  const consents = enableBankingConsents;
  const accounts = enableBankingConsentAccounts;
  const rows = await db
    .select({
      id: accounts.id,
      bank: consents.bankName,
      consentId: consents.id,
      ledgerId: accountNodes.id,
      ledgerCode: accountNodes.code,
      ledgerName: accountNodes.name,
      ledgerEligible: sql<boolean>`${accountNodes.isActive} and ${accountNodes.isPostable} and ${accountNodes.subtype} = ${AccountSubtype.BANK}`,
      ordinal: accounts.ordinal,
      currency: accounts.currency,
      expiry: consents.consentUntil,
    })
    .from(accounts)
    .innerJoin(consents, eq(consents.id, accounts.consentId))
    .innerJoin(
      enableBankingAttempts,
      eq(enableBankingAttempts.id, consents.attemptId),
    )
    .innerJoin(
      accountNodes,
      eq(accountNodes.id, enableBankingAttempts.ledgerAccountId),
    )
    .where(activeConsent(companyId, actorId))
    .orderBy(asc(consents.bankName), asc(consents.id), asc(accounts.ordinal));
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.consentId, (counts.get(row.consentId) ?? 0) + 1);
  }
  return success(
    rows.map(
      ({
        id,
        bank,
        ordinal,
        currency,
        expiry,
        consentId,
        ledgerId,
        ledgerCode,
        ledgerName,
        ledgerEligible,
      }) => ({
        suggestedAccountId:
          ledgerEligible && counts.get(consentId) === 1 ? ledgerId : undefined,
        ledgerLabel:
          ledgerEligible && counts.get(consentId) === 1
            ? `${ledgerCode} · ${ledgerName}`
            : undefined,
        id,
        name: `${bank} · ${ordinal}`,
        currency,
        consentUntil: expiry.toISOString().slice(0, 10),
      }),
    ),
  );
}

export async function resolveEnableBankingAccount(
  companyId: string,
  actorId: string,
  localAccountId: string,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<
  ResponseType<{
    accountReference: string;
    consentUntil: string;
    actorId: string;
  }>
> {
  if (!(await canManageConsent(actorId, companyId, logger, locale))) {
    return inaccessible(locale);
  }
  const consents = enableBankingConsents;
  const accounts = enableBankingConsentAccounts;
  const [row] = await db
    .select({
      consentId: consents.id,
      expiry: consents.consentUntil,
      identifiers: accounts.identifiersEncrypted,
    })
    .from(accounts)
    .innerJoin(consents, eq(consents.id, accounts.consentId))
    .where(
      and(activeConsent(companyId, actorId), eq(accounts.id, localAccountId)),
    );
  if (!row) {
    return invalidAccount(locale);
  }
  try {
    const identifiers = decryptConsentValue(row.identifiers, [
      "account",
      companyId,
      row.consentId,
      localAccountId,
    ]);
    const parsed = accountIdentifiers.safeParse(
      identifiers ? JSON.parse(identifiers) : undefined,
    );
    return parsed.success
      ? success({
          accountReference: parsed.data.uid,
          consentUntil: row.expiry.toISOString(),
          actorId,
        })
      : invalidAccount(locale);
  } catch {
    return invalidAccount(locale);
  }
}

async function listExpiringEnableBankingConsents(
  now: Date,
  companyId?: string,
): Promise<
  {
    id: string;
    actorId: string;
    companyId: string;
    consentUntil: Date;
  }[]
> {
  const consents = enableBankingConsents;
  return db
    .select({
      id: consents.id,
      actorId: consents.actorId,
      companyId: consents.companyId,
      consentUntil: consents.consentUntil,
    })
    .from(consents)
    .where(
      and(
        companyId ? eq(consents.companyId, companyId) : undefined,
        isNull(consents.revokedAt),
        isNull(consents.remindedAt),
        gt(consents.consentUntil, now),
        lte(
          consents.consentUntil,
          new Date(now.getTime() + 7 * secondsPerDay * 1000),
        ),
      ),
    )
    .limit(100);
}

/** Called by the bank scheduler. Notification and claim commit together. */
export async function sendEnableBankingConsentReminders(
  now: Date,
  logger: EndpointLogger,
  locale: CountryLanguage,
  companyId?: string,
): Promise<number> {
  const candidates = await listExpiringEnableBankingConsents(now, companyId);
  let reminded = 0;
  const consents = enableBankingConsents;
  for (const candidate of candidates) {
    if (
      !(await canManageConsent(
        candidate.actorId,
        candidate.companyId,
        logger,
        locale,
      ))
    ) {
      continue;
    }
    const sent = await db.transaction(async (tx) => {
      const [claim] = await tx
        .update(consents)
        .set({ remindedAt: now })
        .where(
          and(
            eq(consents.id, candidate.id),
            isNull(consents.remindedAt),
            isNull(consents.revokedAt),
            gt(consents.consentUntil, now),
          ),
        )
        .returning({ actorId: consents.actorId });
      if (!claim) {
        return false;
      }
      const [user] = await tx
        .select({ locale: users.locale })
        .from(users)
        .where(eq(users.id, claim.actorId));
      if (!user) {
        return tx.rollback();
      }
      const { t } = scopedTranslation.scopedT(user.locale);
      await tx
        .insert(notifications)
        .values({
          userId: claim.actorId,
          type: NotificationType.SYSTEM,
          title: t("expiryTitle"),
          link: "/tools/bank-connections",
          dedupeKey: `enable-banking-expiry:${candidate.id}`,
        })
        .onConflictDoNothing();
      return true;
    });
    if (sent) {
      reminded++;
    }
  }
  return reminded;
}
