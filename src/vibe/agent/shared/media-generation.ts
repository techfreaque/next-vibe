/**
 * Shared helpers for media generation endpoints (image, music, video).
 * Centralises the credit check + deduct pattern used by all generation repos.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";

import { creditPolicyReason } from "@/credits/anti-farming/reason";
import { protectedBalance } from "@/credits/anti-farming/spending";
import type { UsageAttribution, UsageUpstreamCost } from "@/credits/db";
import type { CreditsT } from "@/credits/i18n";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";

import { parseStorageFileRef } from "../chat/storage/storage-url";
import { mimeFromUrl } from "../chat/storage/url-utils";
import { ChatFileRepository } from "../chat/threads/files/[threadId]/[filename]/repository";
import { resolveMediaCharge } from "../models/models";

/** `data:<type>/<subtype>[;params];base64,<payload>` */
const BASE64_DATA_URI =
  /^data:[a-z0-9.+-]+\/[a-z0-9.+-]+(?:;[^;,]+)*;base64,./i;

/**
 * Turn a reference media URL from a generation request (inputMediaUrl, video
 * frame references) into something a THIRD-PARTY provider can consume.
 *
 * Our own storage files sit behind the auth-gated thread-files route: a
 * provider (or our own server-side fetch) requesting that URL has no session,
 * so private-thread files 404 ("User does not have permission to access file").
 * So own files are read server-side with the REQUESTING user's permissions
 * (the same check the files route runs) and handed over as a base64 data URI.
 *
 * - `data:` URI (browser upload): returned unchanged when it is base64.
 * - Own storage file (any host / legacy route): data URI, or null when it is
 *   missing or the user may not view it.
 * - Public http(s) URL: returned unchanged (the provider fetches it).
 * - Anything else: null.
 *
 * The data URI is for the provider request only. Never put it into a tool
 * result, prompt text or persisted message.
 */
export async function resolveMediaReference(
  url: string,
  user: JwtPayloadType,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<string | null> {
  if (url.startsWith("data:")) {
    return BASE64_DATA_URI.test(url) ? url : null;
  }
  // A Cortex upload path ("/uploads/images/<thread>/<file>.md", sometimes
  // prefixed with our origin by the model) names a stored attachment, not a
  // fetchable URL: swap in the attachment's real file URL. Only the caller's
  // own uploads resolve; anything else falls through unchanged.
  const uploadPath = cortexUploadPath(url);
  if (uploadPath && !user.isPublic) {
    const { resolveUploadAttachmentUrl } =
      await import("../cortex/mounts/uploads");
    const attachmentUrl = await resolveUploadAttachmentUrl(user.id, uploadPath);
    if (attachmentUrl && attachmentUrl !== url) {
      logger.info("[Media] Resolved Cortex upload path to its stored file", {
        uploadPath,
      });
      return resolveMediaReference(attachmentUrl, user, logger, locale);
    }
  }
  const ref = parseStorageFileRef(url);
  if (ref) {
    const file = await ChatFileRepository.getFile(ref, user, logger, locale);
    if (file.buffer.length === 0) {
      return null;
    }
    const mimeType =
      file.contentType === "application/octet-stream" ||
      file.contentType === "text/plain"
        ? mimeFromUrl(ref.filename)
        : file.contentType;
    return `data:${mimeType};base64,${file.buffer.toString("base64")}`;
  }
  return url.startsWith("https://") || url.startsWith("http://") ? url : null;
}

/** "/uploads/..." path of a Cortex upload reference (bare or with an origin). */
function cortexUploadPath(url: string): string | null {
  if (url.startsWith("/uploads/")) {
    return url;
  }
  if (!/^https?:\/\//.test(url)) {
    return null;
  }
  try {
    const { pathname } = new URL(url);
    return pathname.startsWith("/uploads/")
      ? decodeURIComponent(pathname)
      : null;
  } catch {
    return null;
  }
}

/** Split a base64 data URI into mime type + payload (null for anything else). */
export function parseBase64DataUri(
  uri: string,
): { mimeType: string; base64: string } | null {
  if (!BASE64_DATA_URI.test(uri)) {
    return null;
  }
  const comma = uri.indexOf(",");
  const mimeType = uri.slice(5, comma).split(";")[0] ?? "";
  return { mimeType, base64: uri.slice(comma + 1) };
}

/**
 * Check that the user has sufficient credits for a generation request.
 * Uses the credits scoped translation internally.
 * Returns a fail() if balance check fails or balance is insufficient.
 */
export async function checkMediaBalance(
  user: JwtPayloadType,
  creditCost: number,
  locale: CountryLanguage,
  logger: EndpointLogger,
  model?: UsageAttribution["modelId"],
): Promise<ResponseType<{ tCredits: CreditsT }>> {
  const { t: tCredits } = creditsScopedTranslation.scopedT(locale);

  const balanceResult = await CreditRepository.getBalance(
    user,
    logger,
    tCredits,
    locale,
  );

  if (!balanceResult.success) {
    return fail({
      message: tCredits("errors.getBalanceFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  const eligible = await protectedBalance(
    user.id,
    user.leadId,
    model,
    balanceResult.data.total,
    creditCost,
    tCredits,
    locale,
  );
  if (!eligible.success) {
    return eligible;
  }
  if (balanceResult.data.total < creditCost) {
    return fail({
      message: tCredits("errors.insufficientCredits", { cost: creditCost }),
      errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
    });
  }

  return success({ tCredits });
}

/**
 * Credits a finished media generation is billed: the provider's real
 * reported cost x markup, else the listed price. A provider that reports its
 * cost on every call (`reportsUpstreamCost`) but did not this time is logged,
 * so a missing cost is visible instead of silently billing the list price.
 */
export function chargeMediaGeneration(params: {
  upstreamCostUsd: number | undefined;
  listedCredits: number;
  reportsUpstreamCost: boolean;
  model: string;
  logTag: string;
  logger: EndpointLogger;
}): number {
  const charge = resolveMediaCharge(
    params.upstreamCostUsd,
    params.listedCredits,
  );
  if (!charge.fromUpstreamCost && params.reportsUpstreamCost) {
    params.logger.warn(
      `[${params.logTag}] Upstream cost missing - billing listed price`,
      {
        model: params.model,
        reportedCostUsd: params.upstreamCostUsd ?? null,
        listedCredits: params.listedCredits,
      },
    );
  }
  return charge.credits;
}

/**
 * Deduct credits for a generation feature after successful generation.
 * Uses the credits scoped translation internally.
 * Returns a fail() if deduction fails.
 */
export async function deductMediaCredits(
  user: JwtPayloadType,
  creditCost: number,
  feature: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
  tCredits: CreditsT,
  attribution: UsageAttribution,
  upstreamCostUsd?: number,
): Promise<ResponseType<void>> {
  const upstreamCost: UsageUpstreamCost | undefined =
    upstreamCostUsd !== undefined &&
    Number.isFinite(upstreamCostUsd) &&
    upstreamCostUsd >= 0
      ? {
          upstreamCostUsd,
          fallbackCostUsd: 0,
          upstreamProvider: null,
          billingBasis: "upstream_cost",
        }
      : undefined;
  const deductResult = await CreditRepository.deductCreditsForFeature(
    user,
    creditCost,
    feature,
    logger,
    tCredits,
    locale,
    attribution,
    upstreamCost,
  );

  if (!deductResult.success) {
    logger.error("[MediaGen] Failed to deduct credits", {
      creditCost,
      feature,
      errorKey: deductResult.errorType.errorKey,
      causeKey: deductResult.cause?.errorType.errorKey,
    });
    if (creditPolicyReason(deductResult.errorType.errorKey)) {
      return deductResult;
    }
    // An empty wallet stays a 402 so every client shows its top-up path.
    const outOfCredits =
      deductResult.errorType.errorCode ===
      ErrorResponseTypes.PAYMENT_REQUIRED.errorCode;
    return fail({
      message: outOfCredits
        ? tCredits("errors.insufficientCredits", { cost: creditCost })
        : tCredits("errors.deductCreditsFailed"),
      errorType: outOfCredits
        ? ErrorResponseTypes.PAYMENT_REQUIRED
        : ErrorResponseTypes.PAYMENT_ERROR,
    });
  }

  return success(undefined);
}

/**
 * True when the caller's own model pick must survive requestDefaults.
 *
 * requestDefaults patches normally win over the request. For a human picking a
 * model in the web/CLI form the pick is always deliberate, so it is kept - else
 * overriding it silently charged them for a different (often far pricier) model.
 *
 * AI/MCP callers are trickier: they sometimes echo the stale example model id
 * baked into the tool schema, in which case defaults should win. But when the
 * AI passes a REAL, known model id it made a deliberate choice and we must
 * honour it - silently swapping it for the favorite/skill model ignored the
 * caller's explicit pick. So for AI/MCP we keep the pick only when it is a
 * known model id for that media type; an undefined, blank, or unknown
 * placeholder falls through to the favorite/skill default.
 *
 * @param isKnownModel - validates that requestedModel is a real model id for
 *   the calling media type (e.g. backed by getImageGenModelById). Only consulted
 *   for AI/MCP callers.
 */
export function keepsExplicitMediaModel(
  platform: Platform,
  requestedModel: string | undefined,
  isKnownModel: (model: string) => boolean,
): boolean {
  if (requestedModel === undefined || requestedModel === "") {
    return false;
  }
  if (platform !== Platform.AI && platform !== Platform.MCP) {
    return true;
  }
  return isKnownModel(requestedModel);
}
