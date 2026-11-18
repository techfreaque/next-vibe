/**
 * Client-side upload size guard for the stream POST.
 *
 * Bodies above MAX_REQUEST_BODY_BYTES are truncated by the Next.js proxy, so
 * the server parses nothing and reports every field as missing (prod
 * 2026-11-18: 47 MB and 138 MB attachments surfaced as "rootFolderId: Invalid
 * option"). Checked before the request goes out.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { scopedTranslation as sharedScopedTranslation } from "next-vibe/core/i18n/shared";
import {
  bytesToMegabytes,
  getOversizedUploadBytes,
  MAX_UPLOAD_MEGABYTES,
} from "next-vibe/core/route/body-limit";

interface UploadSizeInput {
  attachments?: ReadonlyArray<{ size: number }> | null;
  audioInput?: { file?: { size: number } | null } | null;
}

/** Translated error when the files exceed the body limit, else null. */
export function getUploadTooLargeMessage(
  data: UploadSizeInput,
  locale: CountryLanguage,
): string | null {
  const totalBytes = getOversizedUploadBytes([
    ...(data.attachments ?? []),
    data.audioInput?.file,
  ]);
  if (totalBytes === null) {
    return null;
  }
  const { t } = sharedScopedTranslation.scopedT(locale);
  return t("errors.uploadTooLargeDetail", {
    size: bytesToMegabytes(totalBytes),
    limit: MAX_UPLOAD_MEGABYTES,
  });
}
