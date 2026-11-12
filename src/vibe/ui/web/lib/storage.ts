import { reportStorageFailure } from "../../../logger/storage-failure";
import type { EndpointLogger } from "../../../logger/types";

// Cross-platform storage interface
export interface Storage {
  getItem: (key: string, logger: EndpointLogger) => Promise<string | null>;
  setItem: (
    key: string,
    value: string,
    logger: EndpointLogger,
  ) => Promise<void>;
  removeItem: (key: string, logger: EndpointLogger) => Promise<void>;
}

// Platform-specific storage for Web using localStorage
export const storage: Storage = {
  getItem: (key: string, logger: EndpointLogger): Promise<string | null> => {
    return Promise.resolve(getLocalItem(key, logger));
  },

  setItem: (
    key: string,
    value: string,
    logger: EndpointLogger,
  ): Promise<void> => {
    setLocalItem(key, value, logger);
    return Promise.resolve();
  },

  removeItem: (key: string, logger: EndpointLogger): Promise<void> => {
    removeLocalItem(key, logger);
    return Promise.resolve();
  },
};

/**
 * SSR / workers have no Web Storage at all: that is "nothing stored", not a
 * failure, so it is debug-logged instead of reported.
 */
function storageUnavailable(
  area: "localStorage" | "sessionStorage",
  key: string,
  logger: EndpointLogger,
): boolean {
  const missing =
    area === "localStorage"
      ? typeof localStorage === "undefined"
      : typeof sessionStorage === "undefined";
  if (missing) {
    logger.debug(`[storage] ${area} unavailable (SSR/worker)`, { key });
  }
  return missing;
}

// ─── Sync localStorage helpers ────────────────────────────────────────────────
// Use these when synchronous access is required (e.g. event handlers, bridge protocols).

export function getLocalItem(
  key: string,
  logger: EndpointLogger,
): string | null {
  if (storageUnavailable("localStorage", key, logger)) {
    return null;
  }
  try {
    return localStorage.getItem(key);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "localStorage",
      operation: "get",
      key,
      error: error instanceof Error ? error : String(error),
    });
    return null;
  }
}

export function setLocalItem(
  key: string,
  value: string,
  logger: EndpointLogger,
): void {
  if (storageUnavailable("localStorage", key, logger)) {
    return;
  }
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "localStorage",
      operation: "set",
      key,
      error: error instanceof Error ? error : String(error),
      valueLength: value.length,
    });
  }
}

export function removeLocalItem(key: string, logger: EndpointLogger): void {
  if (storageUnavailable("localStorage", key, logger)) {
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "localStorage",
      operation: "remove",
      key,
      error: error instanceof Error ? error : String(error),
    });
  }
}

// ─── Sync sessionStorage helpers ──────────────────────────────────────────────

export function getSessionItem(
  key: string,
  logger: EndpointLogger,
): string | null {
  if (storageUnavailable("sessionStorage", key, logger)) {
    return null;
  }
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "sessionStorage",
      operation: "get",
      key,
      error: error instanceof Error ? error : String(error),
    });
    return null;
  }
}

export function setSessionItem(
  key: string,
  value: string,
  logger: EndpointLogger,
): void {
  if (storageUnavailable("sessionStorage", key, logger)) {
    return;
  }
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "sessionStorage",
      operation: "set",
      key,
      error: error instanceof Error ? error : String(error),
      valueLength: value.length,
    });
  }
}

export function removeSessionItem(key: string, logger: EndpointLogger): void {
  if (storageUnavailable("sessionStorage", key, logger)) {
    return;
  }
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "web",
      area: "sessionStorage",
      operation: "remove",
      key,
      error: error instanceof Error ? error : String(error),
    });
  }
}
