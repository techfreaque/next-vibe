// Platform-specific storage for React Native using AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage interface matching web localStorage API
export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      // eslint-disable-next-line no-console -- Error logging for storage operations
      console.error("Error reading from storage:", error); // eslint-disable-line i18next/no-literal-string -- Error message
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // eslint-disable-next-line no-console -- Error logging for storage operations
      console.error("Error writing to storage:", error); // eslint-disable-line i18next/no-literal-string -- Error message
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // eslint-disable-next-line no-console -- Error logging for storage operations
      console.error("Error removing from storage:", error); // eslint-disable-line i18next/no-literal-string -- Error message
    }
  },
};

// Synchronous fallback for compatibility (returns empty/does nothing)
export const syncStorage = {
  getItem: (): string | null => null,
  setItem: (): void => {},
  removeItem: (): void => {},
};
