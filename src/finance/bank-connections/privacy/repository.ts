import "server-only";

import { createHmac, hkdfSync } from "node:crypto";

import { and, desc, eq, gt, inArray, isNull, lte } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { loadOrCreateKey } from "next-vibe/env/env-crypto";
import type { EndpointLogger } from "next-vibe/logger/types";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { purchasingVendors } from "@/purchasing/db";

import {
  normalizedStatementRowsSchema,
  type StatementSourceRow,
} from "../../bank/statement-format";
import type { BankFeedRow } from "../adapter";
import { bankFeedMappings } from "../db";
import {
  decryptConsentValue,
  encryptConsentValue,
} from "../enable-banking/consent/crypto";
import {
  enableBankingConsentAccounts,
  enableBankingConsents,
} from "../enable-banking/consent/db";
import { bankPrivacyReview, bankPrivacySettings } from "./db";
import type definitions from "./definition";
import { scopedTranslation } from "./i18n";
import {
  classifyBankRow,
  matchingSupplier,
  normalizeMatch,
  type PrivacyMode,
  type PrivacyRule,
  privacyRulesSchema,
} from "./rules";

const reviewStates = [
  "review",
  "approving",
] satisfies (typeof bankPrivacyReview.$inferSelect.state)[];

export interface BankPrivacyScope {
  companyId: string;
  accountId: string;
  connectionId: string;
  actorId: string;
}

export interface ScreenBankRows extends BankPrivacyScope {
  rows: readonly BankFeedRow[];
  dryRun: boolean;
  matchedOnly?: boolean;
}

export interface ScreenedBankRows {
  business: StatementSourceRow[];
  supplierAttribution: Map<string, string | null>;
  held: number;
  privateCount: number;
  discardedCount: number;
}

type ScopeMapping = typeof bankFeedMappings.$inferSelect;

function privacyKey(purpose: string): Buffer {
  return Buffer.from(
    hkdfSync(
      "sha256",
      loadOrCreateKey(),
      "next-vibe:bank-privacy:v1",
      purpose,
      32,
    ),
  );
}

function rowIdentity(
  scope: BankPrivacyScope,
  row: BankFeedRow,
  copies: Map<string, number>,
): string {
  const source = row.transactionId?.trim() || undefined;
  const fingerprint = JSON.stringify([
    row.bookedDate,
    row.valueDate,
    row.amount,
    row.currency,
    row.nativeAmount,
    row.nativeCurrency,
    row.feeAmount,
    row.feeCurrency,
    row.description,
    row.counterparty,
  ]);
  const occurrence = source ? 0 : (copies.get(fingerprint) ?? 0) + 1;
  if (!source) {
    copies.set(fingerprint, occurrence);
  }
  return createHmac("sha256", privacyKey("identity"))
    .update(
      JSON.stringify([
        scope.companyId,
        scope.accountId,
        scope.connectionId,
        source ?? fingerprint,
        occurrence,
      ]),
    )
    .digest("hex");
}

function stripIban(row: BankFeedRow, identity: string): StatementSourceRow {
  return {
    transactionId: identity,
    bookedDate: row.bookedDate,
    valueDate: row.valueDate,
    amount: row.amount,
    currency: row.currency,
    nativeAmount: row.nativeAmount,
    nativeCurrency: row.nativeCurrency,
    feeAmount: row.feeAmount,
    feeCurrency: row.feeCurrency,
    description: row.description,
    counterparty: row.counterparty,
  };
}

async function findMapping(
  connectionId: string,
  actorId: string,
  scope?: Pick<BankPrivacyScope, "companyId" | "accountId">,
  activeRequired = !!scope,
): Promise<ScopeMapping | undefined> {
  const [mapping] = await db
    .select({ mapping: bankFeedMappings })
    .from(bankFeedMappings)
    .innerJoin(
      enableBankingConsentAccounts,
      eq(enableBankingConsentAccounts.id, bankFeedMappings.consentAccountId),
    )
    .innerJoin(
      enableBankingConsents,
      eq(enableBankingConsents.id, enableBankingConsentAccounts.consentId),
    )
    .where(
      and(
        eq(bankFeedMappings.consentAccountId, connectionId),
        eq(bankFeedMappings.actorId, actorId),
        eq(enableBankingConsents.actorId, actorId),
        eq(enableBankingConsents.companyId, bankFeedMappings.companyId),
        scope ? eq(bankFeedMappings.companyId, scope.companyId) : undefined,
        scope ? eq(bankFeedMappings.accountId, scope.accountId) : undefined,
        activeRequired ? isNull(enableBankingConsents.revokedAt) : undefined,
        activeRequired
          ? gt(enableBankingConsents.consentUntil, new Date())
          : undefined,
      ),
    );
  return mapping?.mapping;
}

function evidenceBinding(
  mappingId: string,
  identity: string,
): readonly string[] {
  return ["bank-review", mappingId, identity];
}

function readReview(
  mappingId: string,
  identity: string,
  value: string | null,
): StatementSourceRow | undefined {
  if (!value) {
    return undefined;
  }
  const clear = decryptConsentValue(
    value,
    evidenceBinding(mappingId, identity),
    privacyKey("evidence"),
  );
  if (!clear) {
    return undefined;
  }
  try {
    const parsed = normalizedStatementRowsSchema.safeParse(JSON.parse(clear));
    const [row] = parsed.success ? parsed.data : [];
    return row?.transactionId === identity ? row : undefined;
  } catch {
    return undefined;
  }
}

function readRules(
  mappingId: string,
  encrypted: string | null | undefined,
): PrivacyRule[] | undefined {
  if (!encrypted) {
    return [];
  }
  const clear = decryptConsentValue(
    encrypted,
    ["bank-rules", mappingId],
    privacyKey("rules"),
  );
  if (!clear) {
    return undefined;
  }
  try {
    const rules = privacyRulesSchema.safeParse(JSON.parse(clear));
    return rules.success ? rules.data : undefined;
  } catch {
    return undefined;
  }
}

async function getPolicy(
  mappingId: string,
): Promise<
  { mode: PrivacyMode; retentionDays: number; rules: PrivacyRule[] } | undefined
> {
  const [configured] = await db
    .select()
    .from(bankPrivacySettings)
    .where(eq(bankPrivacySettings.mappingId, mappingId));
  const rules = readRules(mappingId, configured?.rulesEncrypted);
  return rules === undefined
    ? undefined
    : {
        mode: configured?.mode ?? "mixed",
        retentionDays: configured?.retentionDays ?? 30,
        rules,
      };
}

const stripReviewEvidence = {
  bookedDate: null,
  signedAmount: null,
  currency: null,
  evidenceEncrypted: null,
  expiresAt: null,
};

export async function purgeBankPrivacyEvidence(
  mappingId?: string,
): Promise<void> {
  await db
    .update(bankPrivacyReview)
    .set({ ...stripReviewEvidence, state: "expired", decidedAt: new Date() })
    .where(
      and(
        inArray(bankPrivacyReview.state, reviewStates),
        lte(bankPrivacyReview.expiresAt, new Date()),
        mappingId ? eq(bankPrivacyReview.mappingId, mappingId) : undefined,
      ),
    );
}

export function screenBankRows(
  input: ScreenBankRows,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<ScreenedBankRows>> {
  return screenRows(input, logger, locale, true);
}

async function canPreviewUnbound(scope: BankPrivacyScope): Promise<boolean> {
  const [consent] = await db
    .select({ id: enableBankingConsents.id })
    .from(enableBankingConsents)
    .innerJoin(
      enableBankingConsentAccounts,
      eq(enableBankingConsents.id, enableBankingConsentAccounts.consentId),
    )
    .where(
      and(
        eq(enableBankingConsents.companyId, scope.companyId),
        eq(enableBankingConsents.actorId, scope.actorId),
        eq(enableBankingConsentAccounts.id, scope.connectionId),
        isNull(enableBankingConsents.revokedAt),
        gt(enableBankingConsents.consentUntil, new Date()),
      ),
    );
  if (!consent) {
    return false;
  }
  const [account] = await db
    .select({ id: accountNodes.id })
    .from(accountNodes)
    .where(
      and(
        eq(accountNodes.companyId, scope.companyId),
        eq(accountNodes.id, scope.accountId),
        eq(accountNodes.type, AccountType.ASSET),
        eq(accountNodes.subtype, AccountSubtype.BANK),
        eq(accountNodes.isActive, true),
        eq(accountNodes.isPostable, true),
      ),
    );
  return !!account;
}

async function screenRows(
  input: ScreenBankRows,
  logger: EndpointLogger,
  locale: CountryLanguage,
  activeRequired: boolean,
  discardUnmatchedForMixedFiles = false,
): Promise<ResponseType<ScreenedBankRows>> {
  const { t } = scopedTranslation.scopedT(locale);
  try {
    const access = await getDocumentAccess(input.actorId, {
      companyId: input.companyId,
    });
    if (!access?.canManage) {
      return fail({
        message: t("errors.forbidden"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    const mapping = await findMapping(
      input.connectionId,
      input.actorId,
      input,
      activeRequired,
    );
    if (!mapping) {
      if (activeRequired && input.dryRun && (await canPreviewUnbound(input))) {
        return success({
          business: [],
          supplierAttribution: new Map(),
          held: input.matchedOnly ? 0 : input.rows.length,
          privateCount: 0,
          discardedCount: input.matchedOnly ? input.rows.length : 0,
        });
      }
      return fail({
        message: t("errors.forbidden"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    const policy = await getPolicy(mapping.id);
    if (!policy) {
      return fail({
        message: t("errors.unavailable"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const matchedOnly =
      input.matchedOnly ||
      (discardUnmatchedForMixedFiles && policy.mode === "mixed");
    const outcome: ScreenedBankRows = {
      business: [],
      supplierAttribution: new Map(),
      held: 0,
      privateCount: 0,
      discardedCount: 0,
    };
    if (!input.rows.length) {
      return success(outcome);
    }
    const copies = new Map<string, number>();
    const entries = input.rows.map((row) => ({
      row,
      identity: rowIdentity(input, row, copies),
    }));
    if (
      !normalizedStatementRowsSchema.safeParse(
        entries.map(({ row, identity }) => stripIban(row, identity)),
      ).success
    ) {
      return fail({
        message: t("errors.invalid"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const previous = await db
      .select({
        identity: bankPrivacyReview.sourceIdentity,
        status: bankPrivacyReview.state,
      })
      .from(bankPrivacyReview)
      .where(
        and(
          eq(bankPrivacyReview.mappingId, mapping.id),
          inArray(
            bankPrivacyReview.sourceIdentity,
            entries.map(({ identity }) => identity),
          ),
        ),
      );
    const states = new Map(
      previous.map(({ identity, status }) => [identity, status]),
    );
    const evidenceRows: (typeof bankPrivacyReview.$inferInsert)[] = [];
    const seen = new Map<string, StatementSourceRow>();
    const now = new Date();
    for (const { row, identity } of entries) {
      const record = stripIban(row, identity);
      const duplicate = seen.get(identity);
      if (duplicate) {
        if (JSON.stringify(duplicate) !== JSON.stringify(record)) {
          return fail({
            message: t("errors.unavailable"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        continue;
      }
      seen.set(identity, record);
      const prior = states.get(identity);
      const decision = classifyBankRow(
        matchedOnly ? "mixed" : policy.mode,
        policy.rules,
        row,
      );
      if (
        matchedOnly &&
        (decision !== "business" ||
          prior === "private" ||
          prior === "expired" ||
          prior === "review" ||
          prior === "approving")
      ) {
        outcome.discardedCount++;
        continue;
      }
      const include =
        decision !== "private" &&
        (prior === "business" || (!prior && decision === "business"));
      if (include) {
        outcome.business.push(record);
        const supplierId = matchingSupplier(policy.rules, row);
        if (supplierId !== undefined) {
          outcome.supplierAttribution.set(identity, supplierId);
        }
        if (!prior && !input.dryRun) {
          evidenceRows.push({
            mappingId: mapping.id,
            sourceIdentity: identity,
            state: "business",
            decidedAt: now,
          });
        }
        continue;
      }
      if (prior) {
        if (
          prior === "private" ||
          prior === "expired" ||
          (prior === "business" && decision === "private")
        ) {
          outcome.privateCount++;
        }
        if (prior === "review" || prior === "approving") {
          outcome.held++;
        }
        continue;
      }
      if (decision === "private") {
        outcome.privateCount++;
        evidenceRows.push({
          mappingId: mapping.id,
          sourceIdentity: identity,
          state: "private",
          decidedAt: now,
        });
        continue;
      }
      outcome.held++;
      if (!input.dryRun) {
        evidenceRows.push({
          mappingId: mapping.id,
          sourceIdentity: identity,
          state: "review",
          bookedDate: row.bookedDate,
          signedAmount: row.amount,
          currency: row.currency,
          evidenceEncrypted: encryptConsentValue(
            JSON.stringify([record]),
            evidenceBinding(mapping.id, identity),
            privacyKey("evidence"),
          ),
          expiresAt: new Date(
            now.valueOf() + policy.retentionDays * 86_400_000,
          ),
        });
      }
    }
    if (!input.dryRun && evidenceRows.length) {
      await db
        .insert(bankPrivacyReview)
        .values(evidenceRows)
        .onConflictDoNothing();
      if (outcome.business.length) {
        const approved = await db
          .select({ identity: bankPrivacyReview.sourceIdentity })
          .from(bankPrivacyReview)
          .where(
            and(
              eq(bankPrivacyReview.mappingId, mapping.id),
              eq(bankPrivacyReview.state, "business"),
              inArray(
                bankPrivacyReview.sourceIdentity,
                outcome.business.flatMap(({ transactionId }) =>
                  transactionId ? [transactionId] : [],
                ),
              ),
            ),
          );
        const approvedIds = new Set(approved.map(({ identity }) => identity));
        const screened = outcome.business.filter(
          ({ transactionId }) =>
            !!transactionId && approvedIds.has(transactionId),
        );
        const removed = outcome.business.length - screened.length;
        if (matchedOnly) {
          outcome.discardedCount += removed;
        } else {
          outcome.held += removed;
        }
        outcome.business = screened;
      }
    }
    return success(outcome);
  } catch {
    logger.error("Bank privacy screening did not complete");
    return fail({
      message: t("errors.unavailable"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

export async function screenBankFileRows(
  input: Omit<ScreenBankRows, "connectionId">,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<
  ResponseType<{
    feedIdentifier: string | null;
    rows: readonly StatementSourceRow[];
    rejectedOrUnknownCount?: number;
  }>
> {
  const { t } = scopedTranslation.scopedT(locale);
  try {
    const mappings = await db
      .select({
        connectionId: bankFeedMappings.consentAccountId,
        owner: bankFeedMappings.actorId,
      })
      .from(bankFeedMappings)
      .where(
        and(
          eq(bankFeedMappings.companyId, input.companyId),
          eq(bankFeedMappings.accountId, input.accountId),
        ),
      )
      .limit(2);
    const [mapping] = mappings;
    if (!mapping) {
      return success({
        feedIdentifier: null,
        rows: input.rows.map((row) => {
          const { counterpartyIban, ...statement } = row;
          return counterpartyIban === undefined ? row : statement;
        }),
      });
    }
    if (mappings.length > 1 || mapping.owner !== input.actorId) {
      return fail({
        message: t("errors.forbidden"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    const result = await screenRows(
      { ...input, connectionId: mapping.connectionId },
      logger,
      locale,
      false,
      true,
    );
    if (!result.success) {
      return result;
    }
    return success({
      feedIdentifier: mapping.connectionId,
      rows: result.data.business,
      rejectedOrUnknownCount:
        result.data.held +
        result.data.privateCount +
        result.data.discardedCount,
    });
  } catch {
    logger.error("Bank file privacy screening did not complete");
    return fail({
      message: t("errors.unavailable"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

export function privacyImportLogger(logger: EndpointLogger): EndpointLogger {
  return {
    isDebugEnabled: false,
    info: () => undefined,
    warn: () => logger.warn("Bank business import warning"),
    error: () => logger.error("Bank business import error"),
    vibe: () => undefined,
    debug: () => undefined,
  };
}

async function ownerConnections(
  actorId: string,
): Promise<{ id: string; bank: string }[]> {
  return db
    .select({
      id: enableBankingConsentAccounts.id,
      bank: enableBankingConsents.bankName,
    })
    .from(enableBankingConsentAccounts)
    .innerJoin(
      enableBankingConsents,
      eq(enableBankingConsents.id, enableBankingConsentAccounts.consentId),
    )
    .innerJoin(
      bankFeedMappings,
      eq(bankFeedMappings.consentAccountId, enableBankingConsentAccounts.id),
    )
    .where(
      and(
        eq(enableBankingConsents.actorId, actorId),
        eq(bankFeedMappings.actorId, actorId),
        eq(enableBankingConsents.companyId, bankFeedMappings.companyId),
      ),
    );
}

async function changePolicy(
  mapping: ScopeMapping,
  change: (current: {
    mode: PrivacyMode;
    retentionDays: number;
    rules: PrivacyRule[];
  }) =>
    | { mode: PrivacyMode; retentionDays: number; rules: PrivacyRule[] }
    | undefined,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [guard] = await tx
      .select({ id: bankFeedMappings.id })
      .from(bankFeedMappings)
      .where(eq(bankFeedMappings.id, mapping.id))
      .for("update");
    if (!guard) {
      return false;
    }
    const [config] = await tx
      .select()
      .from(bankPrivacySettings)
      .where(eq(bankPrivacySettings.mappingId, mapping.id));
    const rules = readRules(mapping.id, config?.rulesEncrypted);
    if (!rules) {
      return false;
    }
    const next = change({
      mode: config?.mode ?? "mixed",
      retentionDays: config?.retentionDays ?? 30,
      rules,
    });
    if (!next || !privacyRulesSchema.safeParse(next.rules).success) {
      return false;
    }
    const values = {
      mode: next.mode,
      retentionDays: next.retentionDays,
      rulesEncrypted: encryptConsentValue(
        JSON.stringify(next.rules),
        ["bank-rules", mapping.id],
        privacyKey("rules"),
      ),
      updatedAt: new Date(),
    };
    await tx
      .insert(bankPrivacySettings)
      .values({ mappingId: mapping.id, ...values })
      .onConflictDoUpdate({
        target: bankPrivacySettings.mappingId,
        set: values,
      });
    return true;
  });
}

function changeRules(
  rules: readonly PrivacyRule[],
  requested: PrivacyRule,
  remove: boolean,
): PrivacyRule[] {
  const kept = rules.filter(
    (entry) =>
      entry.field !== requested.field ||
      entry.match !== requested.match ||
      normalizeMatch(entry.literal, entry.field === "iban") !==
        normalizeMatch(requested.literal, requested.field === "iban"),
  );
  return remove ? kept : [...kept, requested];
}

export class BankPrivacyRepository {
  static async get(
    data: typeof definitions.GET.types.RequestOutput,
    actorId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<typeof definitions.GET.types.ResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const connections = await ownerConnections(actorId);
      const connectionId =
        data.connectionId ??
        (connections.length === 1 ? connections[0]?.id : undefined);
      if (!connectionId) {
        return success({
          connections,
          reviews: [],
          rules: [],
          suggestions: [],
        });
      }
      const mapping = await findMapping(connectionId, actorId);
      if (!mapping || !(await getDocumentAccess(actorId, mapping))?.canManage) {
        return fail({
          message: t("errors.forbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      await purgeBankPrivacyEvidence(mapping.id);
      const policy = await getPolicy(mapping.id);
      if (!policy) {
        return fail({
          message: t("errors.unavailable"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const rows = await db
        .select()
        .from(bankPrivacyReview)
        .where(
          and(
            eq(bankPrivacyReview.mappingId, mapping.id),
            inArray(bankPrivacyReview.state, reviewStates),
            gt(bankPrivacyReview.expiresAt, new Date()),
          ),
        )
        .orderBy(desc(bankPrivacyReview.bookedDate))
        .limit(50);
      const reviews = rows.flatMap((row) => {
        if (
          !row.bookedDate ||
          !row.signedAmount ||
          !row.currency ||
          !row.expiresAt
        ) {
          return [];
        }
        const evidence = readReview(
          mapping.id,
          row.sourceIdentity,
          row.evidenceEncrypted,
        );
        return [
          {
            identity: row.sourceIdentity,
            state:
              row.state === "approving"
                ? ("approving" as const)
                : ("review" as const),
            date: row.bookedDate,
            amount: row.signedAmount,
            currency: row.currency,
            description: evidence?.description,
            counterparty: evidence?.counterparty,
            expires: row.expiresAt.toISOString(),
          },
        ];
      });
      const names = await db
        .selectDistinct({ vendor: purchasingVendors.name })
        .from(purchasingVendors)
        .where(
          and(
            eq(purchasingVendors.companyId, mapping.companyId),
            eq(purchasingVendors.isActive, true),
          ),
        )
        .orderBy(purchasingVendors.name)
        .limit(12);
      const suggestions = names
        .map(({ vendor }) => vendor)
        .filter(
          (name) =>
            name.length >= 3 &&
            name.length <= 200 &&
            !policy.rules.some(
              (rule) =>
                rule.field === "counterparty" &&
                normalizeMatch(rule.literal) === normalizeMatch(name),
            ),
        );
      const configuredIds = policy.rules.flatMap(({ supplierId }) =>
        supplierId ? [supplierId] : [],
      );
      const ruleSuppliers = configuredIds.length
        ? await db
            .select({ id: purchasingVendors.id, name: purchasingVendors.name })
            .from(purchasingVendors)
            .where(
              and(
                eq(purchasingVendors.companyId, mapping.companyId),
                eq(purchasingVendors.isActive, true),
                inArray(purchasingVendors.id, configuredIds),
              ),
            )
        : [];
      return success({
        connections,
        connectionIdSelected: connectionId,
        companyId: mapping.companyId,
        ruleSuppliers,
        ...policy,
        reviews,
        suggestions,
      });
    } catch {
      logger.error("Bank privacy review could not load");
      return fail({
        message: t("errors.unavailable"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async patch(
    data: typeof definitions.PATCH.types.RequestOutput,
    actorId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<typeof definitions.PATCH.types.ResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const mapping = await findMapping(data.connectionId, actorId);
      if (!mapping || !(await getDocumentAccess(actorId, mapping))?.canManage) {
        return fail({
          message: t("errors.forbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const { field, match, literal, result, supplierId } = data;
      const rule =
        field && match && literal && result
          ? { field, match, literal, result, supplierId }
          : undefined;
      if (data.operation !== "policy" && !rule) {
        return fail({
          message: t("errors.invalid"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      if (data.operation === "set" && supplierId) {
        const [supplier] =
          result === "business"
            ? await db
                .select({ id: purchasingVendors.id })
                .from(purchasingVendors)
                .where(
                  and(
                    eq(purchasingVendors.id, supplierId),
                    eq(purchasingVendors.companyId, mapping.companyId),
                    eq(purchasingVendors.isActive, true),
                  ),
                )
            : [];
        if (!supplier) {
          return fail({
            message: t("errors.invalid"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }
      const updated = await changePolicy(mapping, (current) =>
        data.operation === "policy"
          ? {
              ...current,
              mode: data.mode ?? current.mode,
              retentionDays: data.retentionDays ?? current.retentionDays,
            }
          : {
              ...current,
              rules: rule
                ? changeRules(current.rules, rule, data.operation === "remove")
                : current.rules,
            },
      );
      if (!updated) {
        return fail({
          message: t("errors.invalid"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      return success({ saved: true });
    } catch {
      logger.error("Bank privacy policy could not be saved");
      return fail({
        message: t("errors.unavailable"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async post(
    data: typeof definitions.POST.types.RequestOutput,
    actorId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<typeof definitions.POST.types.ResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const mapping = await findMapping(data.connectionId, actorId);
      if (!mapping) {
        return fail({
          message: t("errors.forbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const [record] = await db
        .select()
        .from(bankPrivacyReview)
        .where(
          and(
            eq(bankPrivacyReview.mappingId, mapping.id),
            eq(bankPrivacyReview.sourceIdentity, data.identity),
          ),
        );
      if (record?.state === data.disposition) {
        return success({ result: data.disposition });
      }
      const now = new Date();
      if (
        !record?.expiresAt ||
        record.expiresAt <= now ||
        (record.state !== "review" && record.state !== "approving") ||
        (record.state === "approving" && data.disposition === "private")
      ) {
        return fail({
          message: t("errors.conflict"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      const proof = readReview(
        mapping.id,
        data.identity,
        record.evidenceEncrypted,
      );
      if (
        (data.disposition === "business" && !proof) ||
        (data.always && (!proof?.counterparty || proof.counterparty.length < 3))
      ) {
        return fail({
          message: t("errors.invalid"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }
      if (data.disposition === "private") {
        const [removed] = await db
          .update(bankPrivacyReview)
          .set({ ...stripReviewEvidence, state: "private", decidedAt: now })
          .where(
            and(
              eq(bankPrivacyReview.mappingId, mapping.id),
              eq(bankPrivacyReview.sourceIdentity, data.identity),
              eq(bankPrivacyReview.state, "review"),
              gt(bankPrivacyReview.expiresAt, now),
            ),
          )
          .returning({ key: bankPrivacyReview.sourceIdentity });
        if (!removed) {
          return fail({
            message: t("errors.conflict"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
      } else if (proof) {
        if (record.state === "review") {
          const [claimed] = await db
            .update(bankPrivacyReview)
            .set({ state: "approving" })
            .where(
              and(
                eq(bankPrivacyReview.mappingId, mapping.id),
                eq(bankPrivacyReview.sourceIdentity, data.identity),
                eq(bankPrivacyReview.state, "review"),
                gt(bankPrivacyReview.expiresAt, now),
              ),
            )
            .returning({ key: bankPrivacyReview.sourceIdentity });
          if (!claimed) {
            return fail({
              message: t("errors.conflict"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }
        }
        const { BankReconciliationRepository } =
          await import("../../bank/repository");
        const imported =
          await BankReconciliationRepository.importNormalizedStatement(
            actorId,
            {
              companyId: mapping.companyId,
              accountId: mapping.accountId,
              feedIdentifier: data.connectionId,
              rows: [proof],
              dryRun: false,
            },
            privacyImportLogger(logger),
            locale,
          );
        if (!imported.success) {
          return fail({
            message: t("errors.import"),
            errorType: imported.errorType,
          });
        }
        await db
          .update(bankPrivacyReview)
          .set({ ...stripReviewEvidence, state: "business", decidedAt: now })
          .where(
            and(
              eq(bankPrivacyReview.mappingId, mapping.id),
              eq(bankPrivacyReview.sourceIdentity, data.identity),
              eq(bankPrivacyReview.state, "approving"),
            ),
          );
      }
      let ruleSaved = false;
      const counterparty = proof?.counterparty;
      if (data.always && counterparty) {
        ruleSaved = await changePolicy(mapping, (current) => ({
          ...current,
          rules: changeRules(
            current.rules,
            {
              field: "counterparty",
              match: "equals",
              literal: counterparty,
              result: data.disposition,
            },
            false,
          ),
        }));
      }
      return success({ result: data.disposition, ruleSaved });
    } catch {
      logger.error("Bank privacy review action did not complete");
      return fail({
        message: t("errors.unavailable"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
