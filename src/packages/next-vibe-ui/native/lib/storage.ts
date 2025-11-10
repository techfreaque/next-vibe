// Platform-specific storage for React Native using AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import cross-platform storage interface from web (source of truth)
import type { Storage } from "@/packages/next-vibe-ui/web/lib/storage";

// Simple logger for storage errors
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
const logStorageError = (operation: string, error: unknown): void => {
  // __DEV__ is a React Native global variable that exists at runtime
  if (
    typeof (globalThis as { __DEV__?: boolean }).__DEV__ !== "undefined" &&
    (globalThis as { __DEV__?: boolean }).__DEV__
  ) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console, i18next/no-literal-string
    console.error(`[Storage] Error ${operation}:`, errorMsg);
  }
};

// Storage implementation matching web localStorage API
export const storage: Storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      logStorageError("reading from storage", error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      logStorageError("writing to storage", error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      logStorageError("removing from storage", error);
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
