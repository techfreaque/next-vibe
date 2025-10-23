// Platform-specific storage for React Native using AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage interface matching web localStorage API
export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error reading from storage:", error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error writing to storage:", error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from storage:", error);
    }
  },
};

// Synchronous fallback for compatibility (returns empty/does nothing)
export const syncStorage = {
  getItem: (key: string): string | null => null,
  setItem: (key: string, value: string): void => {},
  removeItem: (key: string): void => {},
};
