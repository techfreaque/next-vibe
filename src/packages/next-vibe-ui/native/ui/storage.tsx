// Platform-specific storage for React Native using AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Simple logger for storage errors
const logStorageError = (operation: string, error: unknown): void => {
  // @ts-expect-error - __DEV__ exists in React Native
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console, i18next/no-literal-string
    console.error(`[Storage] Error ${operation}:`, errorMsg);
  }
};

// Cross-platform storage interface
export interface Storage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

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
