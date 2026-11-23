"use client";

import { getDomEnvironmentHints } from "next-vibe/ui/lib/dom-mutation-guard";
import { useEffect } from "react";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import { sanitizeTelemetryUrl } from "../../../core/utils/telemetry-url";
import {
  handleChunkLoadFailure,
  isChunkLoadError,
} from "../../../logger/chunk-reload";
import { useLogger } from "./use-logger";

type ErrorWithDigest = Error & { digest?: string };

interface ErrorHandlerOptions {
  onError?: (error: ErrorWithDigest) => void;
}

/**
 * A hook for handling errors in a consistent way across the application
 *
 * @param error The error object to handle
 * @param locale The locale from the current route context
 * @param options Configuration options for error handling
 * @returns The error digest if available
 */
export default function useErrorHandler(
  error: ErrorWithDigest,
  locale: CountryLanguage,
  options: ErrorHandlerOptions = {},
): string | undefined {
  const { onError } = options;
  const logger = useLogger();

  useEffect(() => {
    if (onError) {
      onError(error);
    }
    const domHints = getDomEnvironmentHints();
    const context = {
      message: error.message,
      name: error.name,
      digest: error.digest,
      stack: error.stack?.slice(0, 1500),
      locale,
      // Browser + page context: "x is not a function" is usually an old
      // engine, and removeChild/insertBefore NotFoundErrors are almost always
      // a page translator or extension rewriting React's DOM.
      userAgent: navigator.userAgent,
      path: sanitizeTelemetryUrl(window.location.pathname),
      pageTranslated: domHints.translatedClass,
      // Translators rewrite <html lang> to the target language even when the
      // translated-* class is already gone (translation toggled off / SPA nav).
      htmlLang: domHints.htmlLang,
      htmlLangMismatch: domHints.htmlLang !== locale,
      fontWrapperCount: domHints.fontWrapperCount,
      extensionMarkers: domHints.extensionMarkers,
      referrer: domHints.referrer,
    };
    if (isChunkLoadError(error)) {
      handleChunkLoadFailure(logger, { source: "route-error", error, context });
      return;
    }
    logger.error(`Application error: ${error.message || "unknown"}`, context);
  }, [error, onError, locale, logger]);

  return error.digest;
}
