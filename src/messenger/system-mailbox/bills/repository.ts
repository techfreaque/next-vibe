import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { Environment } from "next-vibe/env/env-util";
import type { EndpointLogger } from "next-vibe/logger/types";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import {
  type LedgerTransaction,
  lockLedgerCompany,
} from "@/chart-of-accounts/shared/ledger-write";
import { companies } from "@/companies/db";
import { getDocumentAccess } from "@/finance/document-company-scope";
import { scopedTranslation as financeTranslation } from "@/finance/i18n";
import type { SupplierEvidenceOutput } from "@/finance/supplier-evidence/definition";
import { SupplierEvidenceRepository } from "@/finance/supplier-evidence/repository";
import {
  evidenceCurrencies,
  parseEvidenceAmount,
} from "@/finance/supplier-evidence/rules";
import {
  mailboxTaxPending,
  parkMailboxTaxPending,
} from "@/finance/supplier-evidence/tax-pending";
import { paymentBills } from "@/payment/db";
import { purchasingVendors } from "@/purchasing/db";

import { resolveSystemMailboxConfig } from "../config";
import { systemMailboxEnv } from "../env";
import type attachmentDefinition from "./attachment/definition";
import {
  decryptEvidence,
  encryptEvidence,
  readSupplierMail,
} from "./attachments";
import { billMailboxReview } from "./db";
import type definitions from "./definition";
import {
  billMailboxEnv,
  type MailboxBinding,
  readMailboxBindings,
} from "./env";
import { scopedTranslation } from "./i18n";
import { type BillMailbox, openBillMailbox } from "./imap";
import {
  extractSupplierDocument,
  type SupplierDocument,
  type SupplierReceipt,
} from "./parser";
import type syncDefinition from "./sync/definition";

export class BillMailboxRepository {
  private static sourceKey(source: {
    namespace: string;
    uidValidity: string;
    uid: string;
    companyId: string;
  }): string {
    return JSON.stringify([
      source.namespace,
      source.uidValidity,
      source.uid,
      source.companyId,
    ]);
  }

  static async sync(
    dryRun: boolean,
    limit: number,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    scheduled = false,
  ): Promise<ResponseType<typeof syncDefinition.POST.types.ResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const actor = billMailboxEnv.THEA_MAIL_BILLS_ACTOR;
    if (
      coreEnv.NODE_ENV !== Environment.PRODUCTION ||
      billMailboxEnv.THEA_MAIL_BILLS_ENABLED !== "true" ||
      !actor ||
      actor !== userId
    ) {
      return fail({
        message: t("errors.disabled"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    const config = resolveSystemMailboxConfig(null, systemMailboxEnv);
    if (!config) {
      return fail({
        message: t("errors.configuration"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    return BillMailboxRepository.runConfigured(
      {
        requestedPreview: dryRun,
        scheduled,
        allowScheduledDrafts:
          billMailboxEnv.THEA_MAIL_BILLS_UNATTENDED_APPLY === "true",
        configuredActorId: actor,
        actorId: userId,
        bindings: readMailboxBindings(),
        open: (bindings, readOnly, excludeUids): Promise<BillMailbox | null> =>
          openBillMailbox(
            config.imap,
            billMailboxEnv.THEA_MAIL_BILLS_FOLDER,
            bindings.map(({ sender }) => sender),
            limit,
            readOnly,
            false,
            excludeUids,
          ),
      },
      locale,
      logger,
    );
  }

  static async runConfigured(
    input: {
      requestedPreview: boolean;
      scheduled: boolean;
      allowScheduledDrafts: boolean;
      configuredActorId: string;
      actorId: string;
      bindings: readonly MailboxBinding[];
      open: (
        bindings: readonly MailboxBinding[],
        dryRun: boolean,
        excludeUids: (
          namespace: string,
          uidValidity: string,
        ) => Promise<ReadonlySet<number>>,
      ) => Promise<BillMailbox | null>;
    },
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<typeof syncDefinition.POST.types.ResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const { actorId } = input;
    if (actorId !== input.configuredActorId) {
      return fail({
        message: t("errors.disabled"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    const dryRun =
      input.requestedPreview ||
      (input.scheduled && !input.allowScheduledDrafts);
    const ownerRequired = input.scheduled && !dryRun;
    const bindings = input.scheduled
      ? input.bindings.filter(({ autoDraft }) => autoDraft === true)
      : input.bindings;
    if (!bindings.length) {
      return fail({
        message: t("errors.configuration"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    try {
      const permitted = await Promise.all(
        bindings.map(async (binding) => {
          const access = await getDocumentAccess(actorId, {
            companyId: binding.companyId,
          });
          if (
            !access?.canManage ||
            (binding.autoDraft &&
              !(
                binding.recipient &&
                binding.providerSender &&
                binding.providerSubjectPrefix
              ))
          ) {
            return false;
          }
          if (
            ownerRequired &&
            !(await BillMailboxRepository.isOwner(binding.companyId, actorId))
          ) {
            return false;
          }
          const [vendor] = await db
            .select({ id: purchasingVendors.id })
            .from(purchasingVendors)
            .where(
              and(
                eq(purchasingVendors.id, binding.vendorId),
                eq(purchasingVendors.companyId, binding.companyId),
                eq(purchasingVendors.isActive, true),
              ),
            );
          const [account] = await db
            .select({ type: accountNodes.type, subtype: accountNodes.subtype })
            .from(accountNodes)
            .where(
              and(
                eq(accountNodes.id, binding.debitAccountId),
                eq(accountNodes.companyId, binding.companyId),
                eq(accountNodes.isActive, true),
                eq(accountNodes.isPostable, true),
              ),
            );
          if (!vendor || !account) {
            return false;
          }
          const prepaid =
            account.type === AccountType.ASSET &&
            account.subtype === AccountSubtype.PREPAID;
          const fundingReceipt =
            input.scheduled &&
            binding.providerSender === "receipts@openrouter.ai";
          return (
            prepaid || (!fundingReceipt && account.type === AccountType.EXPENSE)
          );
        }),
      );
      if (permitted.some((allowed) => !allowed)) {
        return fail({
          message: t("errors.configuration"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const mailbox = await input.open(
        bindings,
        dryRun,
        async (namespace, uidValidity): Promise<ReadonlySet<number>> => {
          const pending = await db
            .select({ uid: billMailboxReview.uid })
            .from(billMailboxReview)
            .where(
              and(
                eq(billMailboxReview.namespace, namespace),
                eq(billMailboxReview.uidValidity, uidValidity),
                isNull(billMailboxReview.billId),
              ),
            );
          return new Set(pending.map(({ uid }) => Number(uid)));
        },
      );
      if (!mailbox) {
        return fail({
          message: t("errors.read"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      try {
        return success(
          await BillMailboxRepository.scan(
            mailbox,
            bindings,
            dryRun,
            actorId,
            locale,
            logger,
            ownerRequired,
          ),
        );
      } finally {
        mailbox.close();
      }
    } catch {
      logger.error("Bill mailbox intake did not complete");
      return fail({
        message: t("errors.read"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async isOwner(
    companyId: string,
    actorId: string,
    conn: Pick<LedgerTransaction, "select"> = db,
  ): Promise<boolean> {
    const [company] = await conn
      .select({ id: companies.id })
      .from(companies)
      .where(
        and(
          eq(companies.id, companyId),
          eq(companies.isActive, true),
          eq(companies.ownerUserId, actorId),
        ),
      );
    return Boolean(company);
  }

  static async scan(
    mailbox: BillMailbox,
    bindings: readonly MailboxBinding[],
    dryRun: boolean,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    ownerRequired = false,
  ): Promise<typeof syncDefinition.POST.types.ResponseOutput> {
    const result = {
      dryRun,
      scanned: 0,
      persisted: 0,
      ready: 0,
      review: 0,
      skipped: 0,
      flagged: 0,
      existing: 0,
    };
    const previewedEvidence = new Map<string, string>();
    for (const uid of mailbox.uids) {
      result.scanned++;
      const message = await mailbox.read(uid);
      const mail = message?.raw
        ? await readSupplierMail(message.raw).catch(() => null)
        : null;
      if (!mail?.sender || !mail.evidence.length) {
        result.skipped++;
        continue;
      }
      const outerCandidates = bindings.filter(
        (binding) =>
          binding.sender === mail.sender &&
          (!binding.recipient || mail.recipients.includes(binding.recipient)),
      );
      const provider = mail.forwarded ?? {
        sender: mail.sender,
        subject: mail.subject,
      };
      const providerCandidates = outerCandidates.filter(
        ({ providerSender, providerSubjectPrefix }) =>
          providerSender === provider.sender &&
          Boolean(
            providerSubjectPrefix &&
            provider.subject
              ?.toLowerCase()
              .startsWith(providerSubjectPrefix.toLowerCase()),
          ),
      );
      const candidates = providerCandidates.length
        ? providerCandidates
        : outerCandidates.filter(
            ({ autoDraft, providerSender }) => !autoDraft && !providerSender,
          );
      const [binding] = candidates;
      if (candidates.length !== 1 || !binding) {
        result.skipped++;
        continue;
      }
      const trusted =
        binding.autoDraft === true &&
        Boolean(binding.recipient) &&
        providerCandidates.length === 1;
      const extraction = extractSupplierDocument(
        mail.texts,
        binding.nativeCurrency,
        provider.sender === "receipts@openrouter.ai" ? "openRouter" : undefined,
      );
      const extracted = extraction.document;
      const supported =
        extracted &&
        evidenceCurrencies.safeParse(extracted.currency).success &&
        parseEvidenceAmount(extracted.grossAmount) !== null &&
        parseEvidenceAmount(extracted.taxAmount) !== null;
      const issue = mail.incomplete
        ? "unsupportedContent"
        : (extraction.issue ?? (supported ? null : "missingFields"));
      const draftEvidence = issue ? null : extracted;
      const pendingReceipt =
        trusted &&
        !mail.incomplete &&
        provider.sender === "receipts@openrouter.ai" &&
        extraction.issue === "missingFields" &&
        extraction.taxUndisclosed
          ? extraction.receipt
          : undefined;
      const receipt = mail.incomplete
        ? undefined
        : (extraction.document ??
          (extraction.issue ? extraction.receipt : undefined));

      const source = {
        namespace: mailbox.namespace,
        uidValidity: mailbox.uidValidity,
        uid: String(uid),
        companyId: binding.companyId,
      };
      if (dryRun) {
        const preview = await BillMailboxRepository.previewDraft(
          source,
          binding,
          trusted ? draftEvidence : null,
          pendingReceipt,
          userId,
          locale,
          logger,
        );
        if (preview === "skipped") {
          result.skipped++;
        } else if (preview === "review") {
          result.review++;
        } else if (preview === "existing") {
          result.ready++;
          result.existing++;
        } else if (draftEvidence || pendingReceipt) {
          const candidate = draftEvidence ?? pendingReceipt;
          if (!candidate) {
            continue;
          }
          const key = JSON.stringify([
            binding.companyId,
            binding.vendorId,
            candidate.reference.trim().toUpperCase(),
          ]);
          const fingerprint = JSON.stringify([
            binding.debitAccountId,
            candidate.date,
            candidate.currency,
            parseEvidenceAmount(candidate.grossAmount),
            draftEvidence ? parseEvidenceAmount(draftEvidence.taxAmount) : null,
          ]);
          const prior = previewedEvidence.get(key);
          if (prior && prior !== fingerprint) {
            result.review++;
          } else {
            result.ready++;
            if (prior) {
              result.existing++;
            }
            previewedEvidence.set(key, fingerprint);
          }
        }
        continue;
      }
      const saved = await db.transaction(async (tx) => {
        const company = await lockLedgerCompany(tx, binding.companyId);
        const access = await getDocumentAccess(userId, source, tx);
        if (
          !company ||
          !access?.canManage ||
          (ownerRequired &&
            !(await BillMailboxRepository.isOwner(
              binding.companyId,
              userId,
              tx,
            )))
        ) {
          return null;
        }
        const [inserted] = await tx
          .insert(billMailboxReview)
          .values({
            ...source,
            vendorId: binding.vendorId,
            debitAccountId: binding.debitAccountId,
            status: draftEvidence ? "ready" : "review",
            issue,
            aiReviewRequested:
              !draftEvidence && (binding.allowAiReview ?? false),
            evidence: encryptEvidence(
              mail.evidence,
              BillMailboxRepository.sourceKey(source),
            ),
            fileCount: mail.evidence.length,
            reference: receipt?.reference,
            documentDate: receipt?.date,
            currency: receipt?.currency,
            grossAmount: receipt?.grossAmount,
            taxAmount: draftEvidence?.taxAmount,
          })
          .onConflictDoNothing()
          .returning();
        const [record] = inserted
          ? [inserted]
          : await tx
              .select()
              .from(billMailboxReview)
              .where(
                and(
                  eq(billMailboxReview.namespace, source.namespace),
                  eq(billMailboxReview.uidValidity, source.uidValidity),
                  eq(billMailboxReview.uid, source.uid),
                ),
              )
              .for("update");
        if (
          !record ||
          record.companyId !== binding.companyId ||
          record.vendorId !== binding.vendorId ||
          record.debitAccountId !== binding.debitAccountId
        ) {
          return null;
        }
        const persisted = Boolean(inserted);
        if (record.billId) {
          return { persisted, billId: record.billId, existing: true };
        }
        if (
          pendingReceipt &&
          record.status === "review" &&
          record.issue === "missingFields" &&
          record.reference === pendingReceipt.reference &&
          record.documentDate === pendingReceipt.date &&
          record.currency === pendingReceipt.currency &&
          record.grossAmount === pendingReceipt.grossAmount &&
          record.taxAmount === null
        ) {
          const pending = await parkMailboxTaxPending(tx, {
            ...pendingReceipt,
            companyId: record.companyId,
            vendorId: record.vendorId,
            debitAccountId: record.debitAccountId,
            reviewId: record.id,
          });
          if (pending.billId) {
            await tx
              .update(billMailboxReview)
              .set({ status: "posted", billId: pending.billId, issue: null })
              .where(eq(billMailboxReview.id, record.id));
          }
          return {
            persisted,
            billId: pending.billId ?? null,
            existing: pending.outcome === "existing",
          };
        }
        if (
          !trusted ||
          !draftEvidence ||
          record.status !== "ready" ||
          record.issue ||
          record.reference !== draftEvidence.reference ||
          record.documentDate !== draftEvidence.date ||
          record.currency !== draftEvidence.currency ||
          record.grossAmount !== draftEvidence.grossAmount ||
          record.taxAmount !== draftEvidence.taxAmount
        ) {
          return { persisted, billId: null, existing: false };
        }
        const response = await BillMailboxRepository.createDraft(
          tx,
          record,
          draftEvidence,
          userId,
          locale,
          logger,
          ownerRequired && provider.sender === "receipts@openrouter.ai",
        );
        if (!response.success) {
          await tx
            .update(billMailboxReview)
            .set({ status: "review", issue: "conflictingDocuments" })
            .where(eq(billMailboxReview.id, record.id));
          return { persisted, billId: null, existing: false };
        }
        return {
          persisted,
          billId: response.data.billId,
          existing: response.data.reused,
        };
      });
      if (!saved) {
        result.skipped++;
        continue;
      }
      if (saved.persisted) {
        result.persisted++;
      }
      if (saved.billId) {
        result.ready++;
        if (saved.existing) {
          result.existing++;
        }
        if (await mailbox.markProcessed(uid).catch(() => false)) {
          result.flagged++;
        }
      } else {
        result.review++;
      }
    }
    return result;
  }

  private static async previewDraft(
    source: Pick<
      typeof billMailboxReview.$inferSelect,
      "namespace" | "uidValidity" | "uid" | "companyId"
    >,
    binding: MailboxBinding,
    evidence: SupplierDocument | null,
    pendingReceipt: SupplierReceipt | undefined,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<"skipped" | "review" | "existing" | "draft"> {
    return db.transaction(async (tx) => {
      const company = await lockLedgerCompany(tx, binding.companyId);
      if (
        !company ||
        !(await getDocumentAccess(userId, source, tx))?.canManage
      ) {
        return "skipped";
      }
      const [prior] = await tx
        .select()
        .from(billMailboxReview)
        .where(
          and(
            eq(billMailboxReview.namespace, source.namespace),
            eq(billMailboxReview.uidValidity, source.uidValidity),
            eq(billMailboxReview.uid, source.uid),
          ),
        );
      if (
        prior &&
        (prior.companyId !== binding.companyId ||
          prior.vendorId !== binding.vendorId ||
          prior.debitAccountId !== binding.debitAccountId)
      ) {
        return "skipped";
      }
      if (prior?.billId) {
        return "existing";
      }
      if (
        pendingReceipt &&
        (!prior ||
          (prior.status === "review" &&
            prior.issue === "missingFields" &&
            prior.reference === pendingReceipt.reference &&
            prior.documentDate === pendingReceipt.date &&
            prior.currency === pendingReceipt.currency &&
            prior.grossAmount === pendingReceipt.grossAmount &&
            prior.taxAmount === null))
      ) {
        const pending = await parkMailboxTaxPending(tx, {
          ...pendingReceipt,
          companyId: binding.companyId,
          vendorId: binding.vendorId,
          debitAccountId: binding.debitAccountId,
        });
        return pending.outcome;
      }
      if (!evidence || prior) {
        return "review";
      }
      const result = await BillMailboxRepository.recordEvidence(
        tx,
        binding,
        evidence,
        userId,
        locale,
        logger,
        true,
      );
      if (!result.success) {
        return "review";
      }
      return result.data.result.outcome === "preview"
        ? "draft"
        : result.data.result.billId
          ? "existing"
          : "review";
    });
  }

  static async list(
    companyId: string | undefined,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<typeof definitions.GET.types.ResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      if (!companyId) {
        return success({ reviews: [] });
      }
      const access = await getDocumentAccess(userId, { companyId });
      if (!access?.canManage) {
        return fail({
          message: t("errors.forbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const reviews = await db
        .select({
          id: billMailboxReview.id,
          status: billMailboxReview.status,
          reference: billMailboxReview.reference,
          documentDate: billMailboxReview.documentDate,
          currency: billMailboxReview.currency,
          grossAmount: billMailboxReview.grossAmount,
          taxAmount: billMailboxReview.taxAmount,
          issue: billMailboxReview.issue,
          aiReviewRequested: billMailboxReview.aiReviewRequested,
          fileCount: billMailboxReview.fileCount,
          vendor: purchasingVendors.name,
          billId: billMailboxReview.billId,
          billMetadata: paymentBills.metadata,
        })
        .from(billMailboxReview)
        .leftJoin(
          paymentBills,
          and(
            eq(paymentBills.id, billMailboxReview.billId),
            eq(paymentBills.companyId, billMailboxReview.companyId),
          ),
        )
        .innerJoin(
          purchasingVendors,
          eq(billMailboxReview.vendorId, purchasingVendors.id),
        )
        .where(eq(billMailboxReview.companyId, companyId))
        .orderBy(desc(billMailboxReview.createdAt))
        .limit(100);
      return success({
        reviews: reviews.map(({ billMetadata, ...row }) => ({
          ...row,
          taxPending: Boolean(mailboxTaxPending(billMetadata)),
        })),
      });
    } catch {
      logger.error("Bill mailbox review list failed");
      return fail({
        message: t("errors.read"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async post(
    data: typeof definitions.POST.types.RequestOutput,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<typeof definitions.POST.types.ResponseOutput>> {
    const {
      reviewId,
      reference,
      date,
      currency: correctionCurrency,
      grossAmount,
      taxAmount,
      confirmTax,
    } = data;
    const correction =
      reference && date && correctionCurrency && grossAmount && taxAmount
        ? {
            reference,
            date,
            currency: correctionCurrency,
            grossAmount,
            taxAmount,
          }
        : undefined;
    const { t } = scopedTranslation.scopedT(locale);
    try {
      return await db.transaction(async (tx) => {
        const [scope] = await tx
          .select({ companyId: billMailboxReview.companyId })
          .from(billMailboxReview)
          .where(eq(billMailboxReview.id, reviewId));
        const company = scope && (await lockLedgerCompany(tx, scope.companyId));
        if (
          !scope ||
          !company ||
          !(await getDocumentAccess(userId, scope, tx))?.canManage
        ) {
          return fail({
            message: t("errors.forbidden"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        const [record] = await tx
          .select()
          .from(billMailboxReview)
          .where(
            and(
              eq(billMailboxReview.id, reviewId),
              eq(billMailboxReview.companyId, scope.companyId),
            ),
          )
          .for("update");
        if (!record) {
          return fail({
            message: t("errors.forbidden"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        if (record.billId) {
          const [bill] = await tx
            .select({
              metadata: paymentBills.metadata,
              taxAmount: paymentBills.taxAmount,
            })
            .from(paymentBills)
            .where(
              and(
                eq(paymentBills.id, record.billId),
                eq(paymentBills.companyId, record.companyId),
              ),
            );
          if (!bill) {
            return fail({
              message: t("errors.conflict"),
              errorType: ErrorResponseTypes.CONFLICT,
            });
          }
          const pending = mailboxTaxPending(bill.metadata);
          if (!pending) {
            if (
              confirmTax &&
              (taxAmount === undefined ||
                parseEvidenceAmount(taxAmount) !==
                  Math.round(bill.taxAmount * 10_000))
            ) {
              return fail({
                message: t("errors.conflict"),
                errorType: ErrorResponseTypes.CONFLICT,
              });
            }
            return success({ billId: record.billId });
          }
          if (
            !confirmTax ||
            pending.debitAccountId !== record.debitAccountId ||
            !record.reference ||
            !record.documentDate ||
            !record.currency ||
            !record.grossAmount ||
            taxAmount === undefined
          ) {
            return fail({
              message: t("errors.fields"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            });
          }
          return BillMailboxRepository.createDraft(
            tx,
            record,
            {
              reference: record.reference,
              date: record.documentDate,
              currency: record.currency,
              grossAmount: record.grossAmount,
              taxAmount,
            },
            userId,
            locale,
            logger,
            true,
          );
        }
        if (confirmTax) {
          return fail({
            message: t("errors.conflict"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        const evidence =
          record.status === "ready" &&
          record.reference &&
          record.documentDate &&
          record.currency &&
          record.grossAmount &&
          record.taxAmount
            ? {
                reference: record.reference,
                date: record.documentDate,
                currency: record.currency,
                grossAmount: record.grossAmount,
                taxAmount: record.taxAmount,
              }
            : correction;
        if (!evidence) {
          return fail({
            message: t("errors.fields"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        return BillMailboxRepository.createDraft(
          tx,
          record,
          evidence,
          userId,
          locale,
          logger,
        );
      });
    } catch {
      logger.error("Bill mailbox draft did not complete");
      return fail({
        message: t("errors.read"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async recordEvidence(
    tx: LedgerTransaction,
    record: Pick<
      typeof billMailboxReview.$inferSelect,
      "companyId" | "vendorId" | "debitAccountId"
    >,
    evidence: SupplierDocument,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    dryRun: boolean,
    prepaidRequired = false,
  ): Promise<ResponseType<SupplierEvidenceOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const { t: financeT } = financeTranslation.scopedT(locale);
    const currency = evidenceCurrencies.safeParse(evidence.currency);
    const gross = parseEvidenceAmount(evidence.grossAmount);
    const tax = parseEvidenceAmount(evidence.taxAmount);
    if (
      !currency.success ||
      gross === null ||
      gross <= 0 ||
      tax === null ||
      tax > gross
    ) {
      return fail({
        message: t("errors.fields"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const [account] = await tx
      .select({
        type: accountNodes.type,
        subtype: accountNodes.subtype,
      })
      .from(accountNodes)
      .where(
        and(
          eq(accountNodes.id, record.debitAccountId),
          eq(accountNodes.companyId, record.companyId),
          eq(accountNodes.isActive, true),
          eq(accountNodes.isPostable, true),
        ),
      )
      .for("share");
    if (!account) {
      return fail({
        message: t("errors.configuration"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const [vendor] = await tx
      .select({ id: purchasingVendors.id })
      .from(purchasingVendors)
      .where(
        and(
          eq(purchasingVendors.id, record.vendorId),
          eq(purchasingVendors.companyId, record.companyId),
          eq(purchasingVendors.isActive, true),
        ),
      )
      .for("share");
    if (!vendor) {
      return fail({
        message: t("errors.configuration"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const prepaid =
      account.type === AccountType.ASSET &&
      account.subtype === AccountSubtype.PREPAID;
    if (prepaidRequired && !prepaid) {
      return fail({
        message: t("errors.configuration"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    return SupplierEvidenceRepository.recordInTransaction(
      tx,
      {
        operation: prepaid ? "fundBill" : "bill",
        companyId: record.companyId,
        vendorId: record.vendorId,
        externalReference: evidence.reference,
        date: evidence.date,
        grossAmount: evidence.grossAmount,
        taxAmount: evidence.taxAmount,
        currency: currency.data,
        debitAccountId: record.debitAccountId,
        description: t("billDescription"),
        dryRun,
      },
      userId,
      financeT,
      logger,
    );
  }

  private static async createDraft(
    tx: LedgerTransaction,
    record: Pick<
      typeof billMailboxReview.$inferSelect,
      "id" | "companyId" | "vendorId" | "debitAccountId"
    >,
    evidence: SupplierDocument,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    prepaidRequired = false,
  ): Promise<ResponseType<{ billId: string; reused: boolean }>> {
    const { t } = scopedTranslation.scopedT(locale);
    const response = await BillMailboxRepository.recordEvidence(
      tx,
      record,
      evidence,
      userId,
      locale,
      logger,
      false,
      prepaidRequired,
    );
    if (!response.success) {
      return response;
    }
    const { billId } = response.data.result;
    if (!billId) {
      return fail({
        message: t("errors.conflict"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
    await tx
      .update(billMailboxReview)
      .set({
        status: "posted",
        billId,
        reference: evidence.reference,
        documentDate: evidence.date,
        grossAmount: evidence.grossAmount,
        taxAmount: evidence.taxAmount,
        currency: evidence.currency,
      })
      .where(
        and(
          eq(billMailboxReview.id, record.id),
          eq(billMailboxReview.companyId, record.companyId),
        ),
      );
    return success({
      billId,
      reused: response.data.result.outcome === "replayed",
    });
  }

  static async attachment(
    reviewId: string,
    index: number,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<typeof attachmentDefinition.GET.types.ResponseOutput>
  > {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [record] = await db
        .select()
        .from(billMailboxReview)
        .where(eq(billMailboxReview.id, reviewId));
      if (
        !record ||
        !(await getDocumentAccess(userId, { companyId: record.companyId }))
          ?.canManage
      ) {
        return fail({
          message: t("errors.forbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      const item = decryptEvidence(
        record.evidence,
        BillMailboxRepository.sourceKey(record),
      )?.[index];
      if (!item) {
        return fail({
          message: t("errors.read"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      return success({
        filename: `invoice-evidence-${index + 1}.${item.kind === "pdf" ? "pdf" : "txt"}`,
        contents: item.data,
      });
    } catch {
      logger.error("Bill mailbox attachment could not be retrieved");
      return fail({
        message: t("errors.read"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
