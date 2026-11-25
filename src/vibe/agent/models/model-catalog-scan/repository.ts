/**
 * Model Catalog Scan Repository
 * Fetches provider model lists + live prices, diffs them against our model
 * definitions, stores the report and mails it to the ops inboxes.
 * Report only: prod never edits model definitions.
 */

import "server-only";

import { and, desc, eq, gte, isNotNull, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CampaignType } from "@/messenger/accounts/enum";
import { EmailSendingRepository } from "@/messenger/providers/email/smtp-client/email-sending/repository";

import { chatMessages } from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import type {
  PriceFetcher,
  ProviderPriceResult,
} from "../model-prices/providers/base";
import { DeepgramPriceFetcher } from "../model-prices/providers/deepgram";
import { EdenAiPriceFetcher } from "../model-prices/providers/eden-ai";
import { ElevenLabsPriceFetcher } from "../model-prices/providers/elevenlabs";
import { FalAiPriceFetcher } from "../model-prices/providers/fal-ai";
import { FreedomGptPriceFetcher } from "../model-prices/providers/freedomgpt";
import { GabAiPriceFetcher } from "../model-prices/providers/gab-ai";
import { ModelslabPriceFetcher } from "../model-prices/providers/modelslab";
import { NanoGptPriceFetcher } from "../model-prices/providers/nano-gpt";
import { OpenAiImagePriceFetcher } from "../model-prices/providers/openai-images";
import { OpenRouterImagePriceFetcher } from "../model-prices/providers/openrouter-image";
import { OpenRouterTokenPriceFetcher } from "../model-prices/providers/openrouter-token";
import { OpenRouterVideoPriceFetcher } from "../model-prices/providers/openrouter-video";
import { ReplicatePriceFetcher } from "../model-prices/providers/replicate";
import { UncensoredAiPriceFetcher } from "../model-prices/providers/uncensored-ai";
import { VenicePriceFetcher } from "../model-prices/providers/venice-ai";
import {
  FIRST_SCAN_LOOKBACK_DAYS,
  HISTORY_LIMIT,
  LOOKBACK_MARGIN_HOURS,
  MODEL_CATALOG_REPORT_RECIPIENTS,
  OBSERVED_COST_MAX_ROWS,
  OBSERVED_COST_WINDOW_DAYS,
  SCAN_INTERVAL_DAYS,
  SCAN_INTERVAL_GRACE_HOURS,
  SOURCE_TIMEOUT_MS,
} from "./constants";
import { type ModelCatalogScan, modelCatalogScans } from "./db";
import type {
  ModelCatalogScanGetResponseOutput,
  ModelCatalogScanPostRequestOutput,
  ModelCatalogScanPostResponseOutput,
} from "./definition";
import {
  collectCatalogRefs,
  composeReportText,
  findDeprecations,
  findMissingUpstream,
  findNewModels,
  findObservedCostGaps,
  findPriceChanges,
  type ObservedCostSample,
} from "./diff";
import type { ModelCatalogScanT } from "./i18n";
import { ModelCatalogScanEmail } from "./report-email";
import type {
  CatalogReport,
  CatalogScanSummary,
  CatalogSourceStatus,
} from "./schema";
import { fetchUpstreamListings } from "./sources";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * Price fetchers that are plain HTTP and safe on prod. The Playwright-based
 * OpenAI TTS/STT scrapers and the Unbottled self-fetcher stay dev-only.
 */
function createPriceFetchers(): PriceFetcher[] {
  return [
    new OpenRouterTokenPriceFetcher(),
    new OpenRouterImagePriceFetcher(),
    new OpenRouterVideoPriceFetcher(),
    new ReplicatePriceFetcher(),
    new OpenAiImagePriceFetcher(),
    new FalAiPriceFetcher(),
    new ElevenLabsPriceFetcher(),
    new DeepgramPriceFetcher(),
    new EdenAiPriceFetcher(),
    new ModelslabPriceFetcher(),
    new UncensoredAiPriceFetcher(),
    new FreedomGptPriceFetcher(),
    new GabAiPriceFetcher(),
    new VenicePriceFetcher(),
    new NanoGptPriceFetcher(),
  ];
}

async function runFetcher(
  fetcher: PriceFetcher,
  logger: EndpointLogger,
): Promise<ProviderPriceResult> {
  const failed = (error: string): ProviderPriceResult => ({
    provider: fetcher.providerName,
    modelsFound: 0,
    modelsUpdated: 0,
    updates: [],
    failures: [],
    error,
  });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<ProviderPriceResult>((resolve) => {
    timer = setTimeout(
      () => resolve(failed(`timed out after ${SOURCE_TIMEOUT_MS / 1000}s`)),
      SOURCE_TIMEOUT_MS,
    );
  });
  try {
    return await Promise.race([fetcher.fetch(logger), timeout]);
  } catch (error) {
    return failed(parseError(error).message);
  } finally {
    clearTimeout(timer);
  }
}

function finiteOrZero(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * Recent assistant turns with their tokens and charge, for the observed-cost
 * check. Incognito turns are never stored server-side, so this covers stored
 * threads only. A failed read only drops that section, never the scan.
 */
async function loadObservedCostSamples(
  now: Date,
  logger: EndpointLogger,
): Promise<ObservedCostSample[]> {
  try {
    const rows = await db
      .select({ model: chatMessages.model, metadata: chatMessages.metadata })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.role, ChatMessageRole.ASSISTANT),
          isNotNull(chatMessages.model),
          gte(
            chatMessages.createdAt,
            new Date(now.getTime() - OBSERVED_COST_WINDOW_DAYS * DAY_MS),
          ),
          sql`${chatMessages.metadata} ? 'creditCost'`,
          sql`${chatMessages.metadata} ? 'promptTokens'`,
        ),
      )
      .orderBy(desc(chatMessages.createdAt))
      .limit(OBSERVED_COST_MAX_ROWS);
    return rows.flatMap((row): ObservedCostSample[] =>
      row.model && row.metadata
        ? [
            {
              modelId: row.model,
              promptTokens: finiteOrZero(row.metadata.promptTokens),
              completionTokens: finiteOrZero(row.metadata.completionTokens),
              cachedInputTokens: finiteOrZero(row.metadata.cachedInputTokens),
              cacheWriteTokens: finiteOrZero(row.metadata.cacheWriteTokens),
              creditCost: finiteOrZero(row.metadata.creditCost),
            },
          ]
        : [],
    );
  } catch (error) {
    logger.error(
      "Model catalog scan: observed-cost samples failed",
      parseError(error),
    );
    return [];
  }
}

function toSummary(row: ModelCatalogScan): CatalogScanSummary {
  return {
    id: row.id,
    scannedAt: row.createdAt.toISOString(),
    newModels: row.newModelCount,
    priceChanges: row.priceChangeCount,
    missingUpstream: row.missingCount,
    deprecations: row.deprecationCount,
    sourceErrors: row.sourceErrorCount,
    emailedTo: row.emailedTo,
    emailError: row.emailError,
  };
}

export class ModelCatalogScanRepository {
  static async getLatest(
    logger: EndpointLogger,
    t: ModelCatalogScanT,
  ): Promise<ResponseType<ModelCatalogScanGetResponseOutput>> {
    try {
      const rows = await db
        .select()
        .from(modelCatalogScans)
        .orderBy(desc(modelCatalogScans.createdAt))
        .limit(HISTORY_LIMIT);
      const latest = rows[0];
      return success({
        scan: latest ? toSummary(latest) : null,
        report: latest?.report ?? null,
        history: rows.map(toSummary),
        reportText: latest
          ? composeReportText(latest.report, latest.createdAt).body
          : t("widget.empty.message"),
      });
    } catch (error) {
      logger.error("Model catalog scan load failed", parseError(error));
      return fail({
        message: t("errors.loadFailed", { error: parseError(error).message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async runScan(
    data: ModelCatalogScanPostRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModelCatalogScanT,
  ): Promise<ResponseType<ModelCatalogScanPostResponseOutput>> {
    try {
      const now = new Date();
      const [previous] = await db
        .select()
        .from(modelCatalogScans)
        .orderBy(desc(modelCatalogScans.createdAt))
        .limit(1);

      const minAgeMs =
        SCAN_INTERVAL_DAYS * DAY_MS - SCAN_INTERVAL_GRACE_HOURS * HOUR_MS;
      if (
        previous &&
        !data.force &&
        now.getTime() - previous.createdAt.getTime() < minAgeMs
      ) {
        logger.debug("Model catalog scan skipped, recent scan exists", {
          scanId: previous.id,
        });
        return success({
          skipped: true,
          scan: toSummary(previous),
          report: previous.report,
          reportText: composeReportText(previous.report, previous.createdAt)
            .body,
        });
      }

      const since = previous
        ? new Date(
            previous.createdAt.getTime() - LOOKBACK_MARGIN_HOURS * HOUR_MS,
          )
        : new Date(now.getTime() - FIRST_SCAN_LOOKBACK_DAYS * DAY_MS);

      const [listings, priceResults, costSamples] = await Promise.all([
        fetchUpstreamListings(logger),
        Promise.all(
          createPriceFetchers().map((fetcher) => runFetcher(fetcher, logger)),
        ),
        loadObservedCostSamples(now, logger),
      ]);

      const refs = collectCatalogRefs();
      const sources: CatalogSourceStatus[] = [
        ...listings.map((l) => ({
          source: l.source,
          ok: l.ok,
          modelCount: l.models.length,
          error: l.error,
        })),
        ...priceResults.map((r) => ({
          source: `${r.provider} (prices)`,
          ok: r.error === undefined,
          modelCount: r.modelsFound,
          error: r.error ?? null,
        })),
      ];
      const report: CatalogReport = {
        newSince: since.toISOString(),
        newModels: findNewModels(listings, refs, since),
        priceChanges: findPriceChanges(
          priceResults.flatMap((r) => r.updates),
          refs,
        ),
        missingUpstream: findMissingUpstream(listings, refs),
        deprecations: findDeprecations(listings, refs),
        observedCostGaps: findObservedCostGaps(costSamples, refs),
        sources,
      };

      const [inserted] = await db
        .insert(modelCatalogScans)
        .values({
          newModelCount: report.newModels.length,
          priceChangeCount: report.priceChanges.length,
          missingCount: report.missingUpstream.length,
          deprecationCount: report.deprecations.length,
          sourceErrorCount: sources.filter((s) => !s.ok).length,
          report,
        })
        .returning();
      if (!inserted) {
        return fail({
          message: t("errors.scanFailed", { error: "insert returned no row" }),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
        });
      }

      const text = composeReportText(report, inserted.createdAt);
      let row = inserted;
      if (data.sendEmail) {
        const emailedTo: string[] = [];
        const errors: string[] = [];
        for (const to of MODEL_CATALOG_REPORT_RECIPIENTS) {
          // Platform system SMTP: the path signup and admin mails use on prod.
          const sent = await EmailSendingRepository.sendEmail(
            {
              jsx: ModelCatalogScanEmail({
                subject: text.subject,
                body: text.body,
              }),
              subject: text.subject,
              toEmail: to,
              toName: to,
              locale,
              campaignType: CampaignType.SYSTEM,
              skipRateLimitCheck: true,
            },
            logger,
            locale,
          );
          if (sent.success) {
            emailedTo.push(to);
          } else {
            errors.push(`${to}: ${sent.message}`);
          }
        }
        const [updated] = await db
          .update(modelCatalogScans)
          .set({
            emailedTo,
            emailError: errors.length > 0 ? errors.join("; ") : null,
            updatedAt: new Date(),
          })
          .where(eq(modelCatalogScans.id, inserted.id))
          .returning();
        row = updated ?? inserted;
        if (errors.length > 0) {
          logger.error("Model catalog scan email failed", {
            errors: errors.join("; "),
          });
        }
      }

      logger.info("Model catalog scan stored", {
        scanId: row.id,
        newModels: report.newModels.length,
        priceChanges: report.priceChanges.length,
        missingUpstream: report.missingUpstream.length,
        deprecations: report.deprecations.length,
        observedCostGaps: report.observedCostGaps?.length ?? 0,
      });

      return success({
        skipped: false,
        scan: toSummary(row),
        report,
        reportText: text.body,
      });
    } catch (error) {
      logger.error("Model catalog scan failed", parseError(error));
      return fail({
        message: t("errors.scanFailed", { error: parseError(error).message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
