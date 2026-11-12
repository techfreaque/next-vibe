"use client";

import { getDomEnvironmentHints } from "next-vibe/ui/lib/dom-mutation-guard";
import { getSessionItem, setSessionItem } from "next-vibe/ui/lib/storage";
import { useEffect } from "react";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { EndpointLogger } from "../../../logger/types";
import { useLogger } from "./use-logger";

type ErrorWithDigest = Error & { digest?: string };

interface ErrorHandlerOptions {
  onError?: (error: ErrorWithDigest) => void;
}

/** sessionStorage key holding the timestamp of the last chunk-error reload */
const CHUNK_RELOAD_KEY = "vibe-chunk-reload-at";
/** A second chunk error within this window means reloading did not help - stop. */
const CHUNK_RELOAD_WINDOW_MS = 60_000;
/** Give the error log POST a head start before the page goes away. */
const CHUNK_RELOAD_DELAY_MS = 800;

/**
 * Stale client after a deploy: the old build references chunk hashes the new
 * server no longer has. webpack: ChunkLoadError "Loading chunk N failed" /
 * "Loading CSS chunk N failed"; Vite/native ESM: "Failed to fetch dynamically
 * imported module" (Chrome) / "error loading dynamically imported module"
 * (Firefox) / "Importing a module script failed" (Safari).
 */
export function isChunkLoadError(error: Error): boolean {
  if (error.name === "ChunkLoadError") {
    return true;
  }
  const message = error.message || "";
  return (
    /Loading (CSS )?chunk .+ failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
}

/**
 * Claim the one automatic reload for this tab. Returns false when a reload
 * already happened inside the window (or storage is unavailable - without the
 * guard we can't prove we won't loop, so we don't reload).
 */
function claimChunkReload(logger: EndpointLogger): boolean {
  const now = Date.now();
  const last = Number(getSessionItem(CHUNK_RELOAD_KEY, logger) ?? "0");
  if (Number.isFinite(last) && now - last < CHUNK_RELOAD_WINDOW_MS) {
    return false;
  }
  setSessionItem(CHUNK_RELOAD_KEY, String(now), logger);
  // Read back: if storage silently failed, the guard is not in place.
  return getSessionItem(CHUNK_RELOAD_KEY, logger) === String(now);
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
    const chunkError = isChunkLoadError(error);
    const autoReload = chunkError && claimChunkReload(logger);
    const domHints = getDomEnvironmentHints();
    logger.error(`Application error: ${error.message || "unknown"}`, {
      message: error.message,
      name: error.name,
      digest: error.digest,
      stack: error.stack?.slice(0, 1500),
      locale,
      // Browser + page context: "x is not a function" is usually an old
      // engine, and removeChild/insertBefore NotFoundErrors are almost always
      // a page translator or extension rewriting React's DOM.
      userAgent: navigator.userAgent,
      path: window.location.pathname,
      pageTranslated: domHints.translatedClass,
      // Translators rewrite <html lang> to the target language even when the
      // translated-* class is already gone (translation toggled off / SPA nav).
      htmlLang: domHints.htmlLang,
      htmlLangMismatch: domHints.htmlLang !== locale,
      fontWrapperCount: domHints.fontWrapperCount,
      extensionMarkers: domHints.extensionMarkers,
      referrer: domHints.referrer,
      chunkLoadError: chunkError,
      autoReload,
    });
    if (onError) {
      onError(error);
    }
    if (autoReload) {
      // Stale client after deploy - one full reload fetches the new build.
      // Not cleared on cleanup: the reload is claimed in sessionStorage, so a
      // StrictMode/dep re-run must not cancel the only reload we get.
      setTimeout(() => {
        window.location.reload();
      }, CHUNK_RELOAD_DELAY_MS);
    }
  }, [error, onError, locale, logger]);

  return error.digest;
}
