import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import type { LedgerTransaction } from "@/chart-of-accounts/shared/ledger-write";

import { accountIdentifiers, type BankSession } from "./client";
import { decryptConsentValue } from "./crypto";
import {
  enableBankingAttempts,
  enableBankingConsentAccounts,
  enableBankingConsents,
} from "./db";

type Attempt = typeof enableBankingAttempts.$inferSelect;
type IncomingAccount = BankSession["accounts"][number];
type Matches = Map<string, string>;

function primaryHash(
  account: Pick<IncomingAccount, "identification_hash">,
): string | undefined {
  const hash = account.identification_hash;
  return hash && hash.trim() === hash ? hash : undefined;
}

/** Caller holds the company ledger lock for the lookup and any subsequent account moves. */
export async function matchReconsentedAccounts(
  tx: LedgerTransaction,
  attempt: Attempt,
  incoming: readonly IncomingAccount[],
  secret?: Buffer,
): Promise<Matches | undefined> {
  const incomingByHash = new Map<string, IncomingAccount>();
  for (const account of incoming) {
    const hash = primaryHash(account);
    if (!hash) {
      continue;
    }
    if (incomingByHash.has(hash)) {
      return undefined;
    }
    incomingByHash.set(hash, account);
  }
  const matches: Matches = new Map();
  if (!incomingByHash.size) {
    return matches;
  }

  const accounts = enableBankingConsentAccounts;
  const consents = enableBankingConsents;
  const attempts = enableBankingAttempts;
  const prior = await tx
    .select({
      id: accounts.id,
      consentId: consents.id,
      currency: accounts.currency,
      identifiers: accounts.identifiersEncrypted,
      attemptExpiry: attempts.expiresAt,
    })
    .from(accounts)
    .innerJoin(consents, eq(accounts.consentId, consents.id))
    .innerJoin(attempts, eq(consents.attemptId, attempts.id))
    .where(
      and(
        eq(consents.companyId, attempt.companyId),
        eq(consents.actorId, attempt.actorId),
        eq(consents.bankName, attempt.bankName),
        eq(consents.bankCountry, attempt.bankCountry),
        eq(attempts.personal, attempt.personal),
        isNull(consents.revokedAt),
      ),
    )
    .for("update", { of: accounts });

  for (const account of prior) {
    const decrypted = decryptConsentValue(
      account.identifiers,
      ["account", attempt.companyId, account.consentId, account.id],
      secret,
    );
    const stored = accountIdentifiers.safeParse(
      decrypted ? JSON.parse(decrypted) : undefined,
    );
    if (!stored.success) {
      return undefined;
    }
    // Alternate hashes can represent fuzzy, non-unique identifier schemes.
    const hash = primaryHash(stored.data);
    const next = hash ? incomingByHash.get(hash) : undefined;
    if (!next) {
      continue;
    }
    if (
      matches.has(next.uid) ||
      account.attemptExpiry > attempt.expiresAt ||
      (account.currency && next.currency && account.currency !== next.currency)
    ) {
      return undefined;
    }
    matches.set(next.uid, account.id);
  }
  return matches;
}
