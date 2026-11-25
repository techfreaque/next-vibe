/**
 * Shared plumbing of the /v1 media endpoints (images, audio, videos, music).
 * The endpoints only translate: generation, provider routing, consent, credit
 * checks and billing all run in the same tool repositories the chat tools use.
 * This module turns their results into OpenAI wire shapes: the tool context
 * they run under, the error mapping, and signed download URLs for the files
 * they store.
 */

import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import type { StoredFileSource } from "next-vibe/agent/chat/storage/file-response";
import { getStorageAdapter } from "next-vibe/agent/chat/storage/index";
import { parseStorageFileRef } from "next-vibe/agent/chat/storage/storage-url";
import { mimeFromUrl } from "next-vibe/agent/chat/storage/url-utils";
import {
  classifyImageProviderError,
  ImageProviderFailureKind,
} from "next-vibe/agent/image-generation/provider-error";
import type { ModelOptionBase } from "next-vibe/agent/models/models";
import { UncensoredConsentRepository } from "next-vibe/agent/models/uncensored-consent/repository";
import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
} from "next-vibe/core/route/response.schema";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { identityEnv } from "next-vibe/identity/env";
import type { EndpointLogger } from "next-vibe/logger/types";

import { buildPublicOrigin } from "@/api-keys/repository";

import { type V1Error, v1Error } from "./errors";

/** How long a signed /v1/media URL stays valid (the owner's key always works). */
export const V1_MEDIA_URL_TTL_SECONDS = 7 * 24 * 60 * 60;

/** Locale segment of signed media URLs (file serving is locale-agnostic). */
const MEDIA_URL_LOCALE = "en-GLOBAL";

/**
 * The context a tool repository runs under for one /v1 call: headless, no
 * chat thread, files owned by the key's account. `threadId` is the storage
 * namespace for the call's files (a fresh one per call; no thread row).
 * `signal` aborts the provider call (the request's signal for sync calls;
 * none for background jobs, which must outlive the request). The fixture
 * scope survives so tests record/replay the provider calls.
 */
export function mediaToolContext(
  outer: ToolExecutionContext,
  signal: AbortSignal | undefined,
  threadId: string | undefined,
): ToolExecutionContext {
  return {
    ...makeHeadlessContext(signal, threadId, "UTC"),
    fixtureScopeId: outer.fixtureScopeId,
  };
}

/**
 * A tool repository's failure as a /v1 error: refusals by the provider's
 * content filter are 400 content_policy_violation (OpenAI's code), missing
 * credits 402, missing 18+ consent 403, provider outages 502.
 */
export function v1ErrorFromToolFailure(failure: ErrorResponseType): V1Error {
  const { message } = failure;
  const key = failure.errorType.errorKey;
  const status = failure.errorType.errorCode;
  if (
    classifyImageProviderError(message) ===
    ImageProviderFailureKind.CONTENT_POLICY
  ) {
    return v1Error(
      400,
      message,
      "invalid_request_error",
      "content_policy_violation",
    );
  }
  if (key === ErrorResponseTypes.PAYMENT_REQUIRED.errorKey || status === 402) {
    return v1Error(402, message, "insufficient_quota", "insufficient_credits");
  }
  if (key === ErrorResponseTypes.CONSENT_REQUIRED.errorKey) {
    return v1Error(
      403,
      message,
      "permission_error",
      "uncensored_consent_required",
      "model",
    );
  }
  if (status === 403) {
    return v1Error(403, message, "permission_error", null);
  }
  if (status === 404) {
    return v1Error(404, message, "not_found_error", "not_found");
  }
  if (status === 400) {
    return v1Error(400, message, "invalid_request_error", "invalid_request");
  }
  if (key === ErrorResponseTypes.EXTERNAL_SERVICE_ERROR.errorKey) {
    return v1Error(502, message, "server_error", "upstream_error");
  }
  return v1Error(500, message, "server_error", null);
}

function signMediaPath(
  threadId: string,
  filename: string,
  expires: number,
): string {
  return createHmac("sha256", identityEnv.JWT_SECRET_KEY)
    .update(`v1-media:${threadId}/${filename}:${String(expires)}`)
    .digest("hex");
}

/** True when `sig` signs this file until `expires` (unix seconds) and it has not passed. */
export function verifyMediaSignature(
  threadId: string,
  filename: string,
  expires: number,
  sig: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): boolean {
  if (!Number.isFinite(expires) || expires < nowSeconds) {
    return false;
  }
  const expected = signMediaPath(threadId, filename, expires);
  return (
    expected.length === sig.length &&
    timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(sig, "utf8"))
  );
}

/**
 * Absolute download URL of a file a tool stored: /v1/media/{thread}/{file},
 * signed so plain HTTP clients (an <img> tag, curl without headers) can fetch
 * it for V1_MEDIA_URL_TTL_SECONDS; the owner's API key works without expiry.
 * A URL that is not one of our storage files (a remote instance's absolute
 * URL) is returned unchanged.
 */
export function signedMediaUrl(
  storageUrl: string,
  request: Request | undefined,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): string {
  const ref = parseStorageFileRef(storageUrl);
  if (!ref) {
    return storageUrl;
  }
  const expires = nowSeconds + V1_MEDIA_URL_TTL_SECONDS;
  const sig = signMediaPath(ref.threadId, ref.filename, expires);
  return `${buildPublicOrigin(request)}/api/${MEDIA_URL_LOCALE}/v1/media/${ref.threadId}/${ref.filename}?expires=${String(expires)}&sig=${sig}`;
}

/** Resolve a stored file after the caller has verified access to it. */
export async function getStoredMediaSource(
  threadId: string,
  filename: string,
): Promise<StoredFileSource | null> {
  const fileId = filename.split(".")[0];
  if (!fileId) {
    return null;
  }
  const metadata = await getStorageAdapter().getFileMetadata(fileId, threadId);
  if (!metadata) {
    return null;
  }
  return {
    threadId,
    filename: metadata.filename,
    contentType:
      !metadata.mimeType || metadata.mimeType === "application/octet-stream"
        ? mimeFromUrl(filename)
        : metadata.mimeType,
  };
}

/**
 * Bytes of a file a tool just stored for this call. No permission check: only
 * call it for files the current call created (or after verifying ownership).
 */
export async function readStoredMedia(
  threadId: string,
  filename: string,
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const fileId = filename.split(".")[0];
  if (!fileId) {
    return null;
  }
  const storage = getStorageAdapter();
  const base64 = await storage.readFileAsBase64(fileId, threadId);
  if (!base64) {
    return null;
  }
  const metadata = await storage.getFileMetadata(fileId, threadId);
  const mimeType =
    !metadata?.mimeType || metadata.mimeType === "application/octet-stream"
      ? mimeFromUrl(filename)
      : metadata.mimeType;
  return { buffer: Buffer.from(base64, "base64"), mimeType };
}

/** Bytes behind a storage URL a tool returned for this call (null for foreign URLs). */
export async function readStoredMediaUrl(
  storageUrl: string,
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const ref = parseStorageFileRef(storageUrl);
  return ref ? readStoredMedia(ref.threadId, ref.filename) : null;
}

/** Split a base64 data URI into bytes + mime type (null for anything else). */
export function decodeDataUri(
  uri: string,
): { buffer: Buffer; mimeType: string } | null {
  const match = /^data:([^;,]+)(?:;[^;,]+)*;base64,([\s\S]*)$/.exec(uri);
  if (!match?.[1] || match[2] === undefined) {
    return null;
  }
  return { mimeType: match[1], buffer: Buffer.from(match[2], "base64") };
}

/** A `data:` URI of an uploaded file, the shape the tool repositories take as a reference. */
export async function fileToDataUri(file: File): Promise<string> {
  const mimeType =
    file.type && file.type !== "application/octet-stream"
      ? (file.type.split(";")[0]?.trim() ?? mimeFromUrl(file.name))
      : mimeFromUrl(file.name);
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Uncensored models need the key's account to have confirmed 18+ once (API
 * keys page). Checked before the tool runs so the message points at the API
 * keys page, not the chat. Null = may run.
 */
export async function mediaConsentError(params: {
  model: Pick<ModelOptionBase, "content" | "name">;
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<V1Error | null> {
  const gate = await UncensoredConsentRepository.gate({
    content: params.model.content,
    modelName: params.model.name,
    user: params.user,
    locale: params.locale,
    logger: params.logger,
    surface: "api",
  });
  return gate.success ? null : v1ErrorFromToolFailure(gate);
}

/** Unix seconds of a Date (OpenAI `created` / `created_at`). */
export function unixSeconds(date: Date = new Date()): number {
  return Math.floor(date.getTime() / 1000);
}
