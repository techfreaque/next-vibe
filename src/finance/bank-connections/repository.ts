import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype } from "@/chart-of-accounts/enum";

import { BankReconciliationRepository } from "../bank/repository";
import { type BankFeedAdapter, collectBankWindow } from "./adapter";
import { bankFeedCheckpoints, bankFeedMappings } from "./db";
import type {
  BankConnectionsOutput,
  BankSyncInput,
  BankSyncOutput,
} from "./definition";
import { createEnableBankingAdapter } from "./enable-banking/adapter";
import {
  applicationAccess,
  listBankCountries,
} from "./enable-banking/application";
import { configuredConsentTransport } from "./enable-banking/connect/repository";
import { listDirectoryBanks } from "./enable-banking/consent/client";
import {
  listEnableBankingAccounts,
  resolveEnableBankingAccount,
} from "./enable-banking/consent/repository";
import { configuredEnableBanking } from "./env";
import { scopedTranslation } from "./i18n";
import { bankPrivacySettings } from "./privacy/db";
import { privacyImportLogger, screenBankRows } from "./privacy/repository";
import { supplierTotals } from "./supplier-totals";
import { nextBankWindow } from "./window";

export async function listBankFeeds(
  companyId: string,
  actorId: string,
  check: boolean,
  logger: EndpointLogger,
  locale: CountryLanguage,
  directoryCountry?: string,
  directoryPersonal = true,
  transport = configuredConsentTransport,
): Promise<ResponseType<BankConnectionsOutput>> {
  const accounts = await listEnableBankingAccounts(
    companyId,
    actorId,
    logger,
    locale,
  );
  if (!accounts.success) {
    return accounts;
  }
  if (directoryCountry) {
    const request = transport();
    const directory = {
      country: directoryCountry,
      personal: directoryPersonal,
    };
    if (!request) {
      return success({
        feeds: [],
        directory: { ...directory, status: "unconfigured", choices: [] },
      });
    }
    try {
      const choices =
        directoryCountry === "countries"
          ? await listBankCountries(request)
          : (
              await listDirectoryBanks(
                request,
                directoryCountry,
                directoryPersonal ? "personal" : "business",
              )
            )?.map(({ name }) => name);
      if (choices) {
        return success({
          feeds: [],
          directory: {
            ...directory,
            status: "ready",
            choices: [...new Set(choices)].toSorted(),
          },
        });
      }
    } catch {
      // Provider failures contain no customer-facing recovery information.
    }
    return success({
      feeds: [],
      directory: { ...directory, status: "unavailable", choices: [] },
    });
  }
  const mappings = await db
    .select({
      feed: bankFeedMappings.consentAccountId,
      accountId: bankFeedMappings.accountId,
      code: accountNodes.code,
      name: accountNodes.name,
      daily: bankFeedMappings.daily,
      startDay: bankFeedMappings.startDay,
      privacyConfigured: bankPrivacySettings.mappingId,
      through: bankFeedCheckpoints.through,
    })
    .from(bankFeedMappings)
    .innerJoin(accountNodes, eq(accountNodes.id, bankFeedMappings.accountId))
    .leftJoin(
      bankFeedCheckpoints,
      and(
        eq(bankFeedCheckpoints.companyId, bankFeedMappings.companyId),
        eq(bankFeedCheckpoints.accountId, bankFeedMappings.accountId),
        eq(
          bankFeedCheckpoints.feedIdentifier,
          sql<string>`${bankFeedMappings.consentAccountId}::text`,
        ),
      ),
    )
    .leftJoin(
      bankPrivacySettings,
      eq(bankPrivacySettings.mappingId, bankFeedMappings.id),
    )
    .where(
      and(
        eq(bankFeedMappings.companyId, companyId),
        eq(bankFeedMappings.actorId, actorId),
      ),
    );
  const byFeed = new Map(mappings.map((row) => [row.feed, row]));
  const request = check ? configuredConsentTransport() : undefined;
  return success({
    application: check
      ? request
        ? await applicationAccess(request)
        : "unavailable"
      : undefined,
    feeds: accounts.data.map((account) => {
      const row = byFeed.get(account.id);
      return {
        ...account,
        suggestedAccountId:
          !row &&
          !mappings.some(
            ({ accountId }) => accountId === account.suggestedAccountId,
          )
            ? account.suggestedAccountId
            : undefined,
        ledgerLabel: row ? `${row.code} · ${row.name}` : account.ledgerLabel,
        accountId: row?.accountId ?? null,
        daily: row?.daily ?? false,
        startDay: row?.startDay,
        privacyConfigured: Boolean(row?.privacyConfigured),
        through: row?.through ?? null,
      };
    }),
  });
}

function configuredAdapter(reference: string): BankFeedAdapter | undefined {
  const credentials = configuredEnableBanking();
  if (!credentials) {
    return undefined;
  }
  return createEnableBankingAdapter(
    credentials.appId,
    credentials.privateKey,
    reference,
    // oxlint-disable-next-line restricted/no-raw-fetch -- external bank API; private transactions must bypass replay caches
    (url, init) => fetch(url, init),
  );
}

export async function syncBankFeed(
  actorId: string,
  input: BankSyncInput,
  logger: EndpointLogger,
  locale: CountryLanguage,
  adapterFor: (
    reference: string,
  ) => BankFeedAdapter | undefined = configuredAdapter,
  now: Date = new Date(),
): Promise<ResponseType<BankSyncOutput>> {
  const { t } = scopedTranslation.scopedT(locale);
  const access = await resolveEnableBankingAccount(
    input.companyId,
    actorId,
    input.feedId,
    logger,
    locale,
  );
  if (!access.success) {
    return access;
  }
  const [bankAccount] = await db
    .select({ id: accountNodes.id, name: accountNodes.name })
    .from(accountNodes)
    .where(
      and(
        eq(accountNodes.id, input.accountId),
        eq(accountNodes.companyId, input.companyId),
        eq(accountNodes.subtype, AccountSubtype.BANK),
        eq(accountNodes.isActive, true),
        eq(accountNodes.isPostable, true),
      ),
    );
  if (!bankAccount) {
    return fail({
      message: t("errors.notFound.title"),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }
  const scope = and(
    eq(bankFeedMappings.companyId, input.companyId),
    eq(bankFeedMappings.consentAccountId, input.feedId),
  );
  const [mapping] = await db.select().from(bankFeedMappings).where(scope);
  if (
    mapping &&
    (mapping.actorId !== actorId ||
      mapping.accountId !== input.accountId ||
      (input.startDay && input.startDay !== mapping.startDay))
  ) {
    return fail({
      message: t("errors.conflict.description"),
      errorType: ErrorResponseTypes.CONFLICT,
    });
  }
  const [checkpoint] = await db
    .select({ through: bankFeedCheckpoints.through })
    .from(bankFeedCheckpoints)
    .where(
      and(
        eq(bankFeedCheckpoints.companyId, input.companyId),
        eq(bankFeedCheckpoints.accountId, input.accountId),
        eq(bankFeedCheckpoints.feedIdentifier, input.feedId),
      ),
    );
  const today = now.toISOString().slice(0, 10);
  const startDay = mapping?.startDay ?? input.startDay ?? today;
  const period = nextBankWindow(startDay, checkpoint?.through, today);
  if (!period) {
    return fail({
      message: t("errors.validation.description"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  }
  if (input.setupOnly && !mapping) {
    await db
      .insert(bankFeedMappings)
      .values({
        companyId: input.companyId,
        consentAccountId: input.feedId,
        actorId,
        accountId: input.accountId,
        startDay,
      })
      .onConflictDoNothing();
    const [bound] = await db.select().from(bankFeedMappings).where(scope);
    if (
      !bound ||
      bound.actorId !== actorId ||
      bound.accountId !== input.accountId ||
      bound.startDay !== startDay
    ) {
      return fail({
        message: t("errors.conflict.description"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
  }
  if (input.setupOnly) {
    if (input.daily !== undefined) {
      await db
        .update(bankFeedMappings)
        .set({ daily: input.daily })
        .where(scope);
    }
    return success({
      result: {
        ...period,
        setupFeedId: input.feedId,
        preview: false,
        imported: 0,
        skipped: 0,
        held: 0,
        privateCount: 0,
        discardedCount: 0,
        autoMatched: 0,
        suppliers: [],
      },
    });
  }
  if (!mapping) {
    return fail({
      message: t("setupHint"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  }
  const [policy] = await db
    .select({ id: bankPrivacySettings.mappingId })
    .from(bankPrivacySettings)
    .where(eq(bankPrivacySettings.mappingId, mapping.id));
  if (!policy) {
    return fail({
      message: t("privacyRequired"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  }
  const adapter = adapterFor(access.data.accountReference);
  if (!adapter) {
    logger.error("Bank feed sync could not load the provider adapter", {
      provider: "enable-banking",
      stage: "adapter",
    });
    return fail({
      message: t("unavailable"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
  const page = await collectBankWindow(adapter, period);
  if (!page.success) {
    logger.error("Bank feed sync could not read the statement window", {
      provider: "enable-banking",
      stage: "statement-window",
      reason: page.reason,
    });
    return fail({
      message: t(page.reason),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
  const screened = await screenBankRows(
    {
      actorId,
      accountId: input.accountId,
      companyId: input.companyId,
      connectionId: input.feedId,
      dryRun: input.dryRun,
      matchedOnly: input.matchedOnly,
      rows: page.data,
    },
    logger,
    locale,
  );
  if (!screened.success) {
    return screened;
  }
  const { business, held, privateCount, discardedCount, supplierAttribution } =
    screened.data;
  const suppliers = await supplierTotals(
    input.companyId,
    actorId,
    business,
    supplierAttribution,
  );
  let imported = 0;
  let skipped = 0;
  let autoMatched = 0;
  if (business.length) {
    const statement =
      await BankReconciliationRepository.importNormalizedStatement(
        actorId,
        {
          companyId: input.companyId,
          accountId: input.accountId,
          feedIdentifier: input.feedId,
          rows: business,
          dryRun: input.dryRun,
          autoMatch: true,
        },
        privacyImportLogger(logger),
        locale,
      );
    if (!statement.success) {
      return fail({
        message: t(
          statement.errorType.errorCode ===
            ErrorResponseTypes.CONFLICT.errorCode
            ? "possibleDuplicateBookings"
            : "errors.validation.description",
        ),
        errorType: statement.errorType,
      });
    }
    imported = statement.data.imported;
    skipped = statement.data.skipped;
    autoMatched = statement.data.autoMatched ?? 0;
  }
  if (!input.dryRun) {
    await db.transaction(async (tx) => {
      await tx
        .insert(bankFeedCheckpoints)
        .values({
          companyId: input.companyId,
          accountId: input.accountId,
          feedIdentifier: input.feedId,
          through: period.to,
        })
        .onConflictDoUpdate({
          target: [
            bankFeedCheckpoints.companyId,
            bankFeedCheckpoints.accountId,
            bankFeedCheckpoints.feedIdentifier,
          ],
          set: {
            through: sql`greatest(${bankFeedCheckpoints.through}, excluded.through)`,
            updatedAt: now,
          },
        });
      if (input.daily !== undefined) {
        await tx
          .update(bankFeedMappings)
          .set({ daily: input.daily })
          .where(scope);
      }
    });
  }
  return success({
    result: {
      preview: input.dryRun,
      ...period,
      providerBookings: page.data.length,
      eligibleBookings: business.length,
      bankAccountName: bankAccount.name,
      imported,
      skipped,
      held,
      privateCount,
      discardedCount,
      autoMatched,
      suppliers,
    },
  });
}
