import "server-only";

/**
 * IndexNow submitter: diffs the live sitemap URL set against the fingerprints
 * stored after the last successful ping and POSTs only what is new or changed
 * (batches of at most 10k URLs). Idempotent; submits on production only.
 */
import { eq } from "drizzle-orm";
import { platformKv } from "next-vibe/agent/cortex/db";
import { coreEnv } from "next-vibe/core/env";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { Environment } from "next-vibe/env/env-util";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  listSitemapUrls,
  type SitemapUrl,
} from "@/_pages/_root/sitemap.xml/build-sitemap";
import { loadSitemapInputs } from "@/_pages/_root/sitemap.xml/sitemap-source";
import { configScopedTranslation } from "@/env/i18n";

import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_KV_KEY,
  INDEXNOW_MAX_URLS_PER_REQUEST,
  INDEXNOW_REQUEST_TIMEOUT_MS,
} from "./constants";
import type {
  IndexNowPostRequestOutput,
  IndexNowPostResponseOutput,
} from "./definition";
import {
  chunk,
  fingerprintUrl,
  parseFingerprints,
  pendingUrls,
  serializeFingerprints,
} from "./diff";
import { IndexNowStatus } from "./enum";
import type { IndexNowT } from "./i18n";

interface BatchResult {
  ok: boolean;
  status: number | null;
  body: string;
}

function isProductionInstance(): boolean {
  return (
    coreEnv.NODE_ENV === Environment.PRODUCTION && !coreEnv.IS_PREVIEW_MODE
  );
}

async function readSubmitted(): Promise<Set<string>> {
  const [row] = await db
    .select({ value: platformKv.value })
    .from(platformKv)
    .where(eq(platformKv.key, INDEXNOW_KV_KEY))
    .limit(1);
  return parseFingerprints(row?.value ?? null);
}

async function writeSubmitted(fingerprints: Set<string>): Promise<void> {
  const value = serializeFingerprints(fingerprints);
  await db
    .insert(platformKv)
    .values({ key: INDEXNOW_KV_KEY, value })
    .onConflictDoUpdate({
      target: platformKv.key,
      set: { value, updatedAt: new Date() },
    });
}

async function submitBatch(
  host: string,
  baseUrl: string,
  batch: readonly SitemapUrl[],
): Promise<BatchResult> {
  try {
    // oxlint-disable-next-line restricted/no-raw-fetch -- external API
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
        urlList: batch.map(({ url }) => url),
      }),
      signal: AbortSignal.timeout(INDEXNOW_REQUEST_TIMEOUT_MS),
    });
    // 200 = accepted, 202 = accepted while the key file is being verified.
    const body = (await response.text()).slice(0, 500);
    return { ok: response.ok, status: response.status, body };
  } catch (error) {
    return { ok: false, status: null, body: parseError(error).message };
  }
}

export class IndexNowRepository {
  static async run(
    data: IndexNowPostRequestOutput,
    logger: EndpointLogger,
    t: IndexNowT,
  ): Promise<ResponseType<IndexNowPostResponseOutput>> {
    try {
      const { t: configT } = configScopedTranslation.scopedT("en-GLOBAL");
      const baseUrl = configT("websiteUrl").replace(/\/+$/, "");
      const host = new URL(baseUrl).host;

      const { availability, skillPages } = await loadSitemapInputs(logger);
      const urls = listSitemapUrls(availability, skillPages, baseUrl);
      const current = new Set(urls.map(fingerprintUrl));
      const previous = await readSubmitted();
      const pending = pendingUrls(urls, previous, data.force);

      const base = {
        host,
        totalUrls: urls.length,
        pendingUrls: pending.length,
      };

      if (pending.length === 0) {
        logger.debug("IndexNow: sitemap unchanged, nothing to submit", base);
        return success({
          ...base,
          status: IndexNowStatus.UNCHANGED,
          submittedUrls: 0,
          requests: 0,
        });
      }

      if (data.dryRun || !isProductionInstance()) {
        const status = data.dryRun
          ? IndexNowStatus.DRY_RUN
          : IndexNowStatus.NOT_PRODUCTION;
        logger.info("IndexNow: pending URLs not submitted", {
          ...base,
          status,
        });
        return success({ ...base, status, submittedUrls: 0, requests: 0 });
      }

      // Keep only fingerprints still in the sitemap, so the row stays small.
      const submitted = new Set(
        [...previous].filter((fingerprint) => current.has(fingerprint)),
      );
      let submittedUrls = 0;
      let requests = 0;
      let failure: BatchResult | null = null;

      for (const batch of chunk(pending, INDEXNOW_MAX_URLS_PER_REQUEST)) {
        requests++;
        const result = await submitBatch(host, baseUrl, batch);
        if (!result.ok) {
          failure = result;
          break;
        }
        submittedUrls += batch.length;
        for (const entry of batch) {
          submitted.add(fingerprintUrl(entry));
        }
        logger.info("IndexNow: batch accepted", {
          host,
          urls: batch.length,
          status: result.status,
        });
      }

      await writeSubmitted(submitted);

      if (failure) {
        logger.error("IndexNow: submission rejected", {
          ...base,
          submittedUrls,
          httpStatus: failure.status,
          response: failure.body,
        });
        return fail({
          message:
            failure.status === null
              ? t("post.errors.network.description")
              : t("post.errors.server.description"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }

      logger.info("IndexNow: submitted sitemap URLs", {
        ...base,
        submittedUrls,
        requests,
      });
      return success({
        ...base,
        status: IndexNowStatus.SUBMITTED,
        submittedUrls,
        requests,
      });
    } catch (error) {
      logger.error("IndexNow: run failed", parseError(error));
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
