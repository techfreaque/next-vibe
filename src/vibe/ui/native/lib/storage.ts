// Platform-specific storage for React Native using AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import cross-platform storage interface from web (source of truth)
import { reportStorageFailure } from "../../../logger/storage-failure";
import type { EndpointLogger } from "../../../logger/types";
import type { Storage } from "../../web/lib/storage";

// Storage implementation matching web localStorage API
export const storage: Storage = {
  getItem: async (
    key: string,
    logger: EndpointLogger,
  ): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      reportStorageFailure(logger, {
        platform: "native",
        area: "asyncStorage",
        operation: "get",
        key,
        error: error instanceof Error ? error : String(error),
      });
      return null;
    }
  },

  setItem: async (
    key: string,
    value: string,
    logger: EndpointLogger,
  ): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      reportStorageFailure(logger, {
        platform: "native",
        area: "asyncStorage",
        operation: "set",
        key,
        error: error instanceof Error ? error : String(error),
        valueLength: value.length,
      });
    }
  },

  removeItem: async (key: string, logger: EndpointLogger): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      reportStorageFailure(logger, {
        platform: "native",
        area: "asyncStorage",
        operation: "remove",
        key,
        error: error instanceof Error ? error : String(error),
      });
    }
  },
};

// Synchronous fallback for compatibility (returns empty/does nothing)
export const syncStorage = {
  getItem: (): string | null => null,
  setItem: (): void => {
    // No-op sync storage
  },
  removeItem: (): void => {
    // No-op sync storage
  },
};

// ─── Sync localStorage helpers (Native: no-op, use AsyncStorage instead) ─────

export function getLocalItem(
  key: string,
  logger: EndpointLogger,
): string | null {
  void key;
  void logger;
  return null;
}

export function setLocalItem(
  key: string,
  value: string,
  logger: EndpointLogger,
): void {
  void key;
  void value;
  void logger;
}

export function removeLocalItem(key: string, logger: EndpointLogger): void {
  void key;
  void logger;
}

// ─── Sync sessionStorage helpers (Native: no-op) ──────────────────────────────

export function getSessionItem(
  key: string,
  logger: EndpointLogger,
): string | null {
  void key;
  void logger;
  return null;
}

export function setSessionItem(
  key: string,
  value: string,
  logger: EndpointLogger,
): void {
  void key;
  void value;
  void logger;
}

export function removeSessionItem(key: string, logger: EndpointLogger): void {
  void key;
  void logger;
}
