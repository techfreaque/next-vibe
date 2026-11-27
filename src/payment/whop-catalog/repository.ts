/**
 * Whop Catalog Sync - Repository
 * Pre-creates (or, with dryRun, only lists) every Whop product and variant
 * the shop sells in the account of the active WHOP_ENVIRONMENT. Safe to run
 * any number of times.
 * Server-only.
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { getWhopAccountId } from "../providers/whop/api";
import { ensureAllWhopVariants } from "../providers/whop/catalog";
import { getWhopCredentials } from "../providers/whop/config";
import type {
  WhopCatalogSyncRequestOutput,
  WhopCatalogSyncResponseOutput,
} from "./definition";
import type { WhopCatalogT } from "./i18n";

export class WhopCatalogRepository {
  static async sync(
    data: WhopCatalogSyncRequestOutput,
    logger: EndpointLogger,
    t: WhopCatalogT,
  ): Promise<ResponseType<WhopCatalogSyncResponseOutput>> {
    const credentials = getWhopCredentials();
    if (!credentials.apiKey) {
      return fail({
        message: t("errors.notConfigured"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const accountId = await getWhopAccountId();
    if (!accountId.ok) {
      return fail({
        message: t("errors.syncFailed", { error: accountId.message }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const dryRun = data.dryRun ?? true;
    const result = await ensureAllWhopVariants(logger, { create: !dryRun });
    if (!result.ok) {
      logger.error("Whop catalog sync failed", {
        status: result.status,
        error: result.message,
      });
      return fail({
        message: t("errors.syncFailed", { error: result.message }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
    const variants = result.data.map((row) => ({
      key: row.key,
      variantId: row.variantId,
      productId: row.whopProductId,
      amount: `${row.amount.toFixed(2)} ${row.currency.toUpperCase()}`,
      status: row.status,
      purchaseUrl: row.purchaseUrl,
    }));
    return success({
      dryRunApplied: dryRun,
      environment: credentials.environment,
      accountId: accountId.data,
      existing: variants.filter((v) => v.status === "existing").length,
      created: variants.filter((v) => v.status === "created").length,
      missing: variants.filter((v) => v.status === "missing").length,
      variants,
    });
  }
}
