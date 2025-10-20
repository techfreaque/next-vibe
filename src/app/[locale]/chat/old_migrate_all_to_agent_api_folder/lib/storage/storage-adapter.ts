/**
 * Storage Abstraction Layer
 *
 * This abstraction layer provides a unified interface for storage operations,
 * making it easy to migrate from localStorage to a database in the future.
 *
 * Benefits:
 * 1. Single point of change for storage implementation
 * 2. Easy to swap localStorage for DB without changing business logic
 * 3. Consistent error handling and logging
 * 4. Type-safe storage operations
 * 5. Testable with mock implementations
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  ChatFolder,
  ChatState,
  ChatThread,
  ChatUIPreferences,
} from "./types";

/**
 * Storage Adapter Interface
 *
 * All storage implementations must implement this interface.
 * This ensures consistency and makes it easy to swap implementations.
 */
export interface StorageAdapter {
  // State operations
  getState(locale: CountryLanguage, logger: EndpointLogger): ChatState | null;
  setState(
    locale: CountryLanguage,
    state: ChatState,
    logger: EndpointLogger,
  ): void;

  // Thread operations
  getThread(
    locale: CountryLanguage,
    threadId: string,
    logger: EndpointLogger,
  ): ChatThread | null;
  saveThread(
    locale: CountryLanguage,
    thread: ChatThread,
    logger: EndpointLogger,
  ): void;
  deleteThread(
    locale: CountryLanguage,
    threadId: string,
    logger: EndpointLogger,
  ): void;

  // Folder operations
  getFolder(
    locale: CountryLanguage,
    folderId: string,
    logger: EndpointLogger,
  ): ChatFolder | null;
  saveFolder(
    locale: CountryLanguage,
    folder: ChatFolder,
    logger: EndpointLogger,
  ): void;
  deleteFolder(
    locale: CountryLanguage,
    folderId: string,
    logger: EndpointLogger,
  ): void;

  // UI Preferences operations
  getUIPreferences(logger: EndpointLogger): ChatUIPreferences | null;
  saveUIPreferences(
    preferences: ChatUIPreferences,
    logger: EndpointLogger,
  ): void;

  // Utility operations
  clear(locale: CountryLanguage, logger: EndpointLogger): void;
  clearAll(logger: EndpointLogger): void;
}

/**
 * LocalStorage Implementation
 *
 * Current implementation using browser localStorage.
 * This will be replaced with a DB adapter in the future.
 */
export class LocalStorageAdapter implements StorageAdapter {
  /* eslint-disable i18next/no-literal-string */
  private readonly STORAGE_KEY_PREFIX = "chat_state_";
  private readonly UI_PREFERENCES_KEY = "chat_ui_preferences";
  /* eslint-enable i18next/no-literal-string */

  /**
   * Get storage key for a specific locale
   */
  private getStorageKey(locale: CountryLanguage): string {
    return `${this.STORAGE_KEY_PREFIX}${locale}`;
  }

  /**
   * Get the entire chat state for a locale
   */
  getState(locale: CountryLanguage, logger: EndpointLogger): ChatState | null {
    try {
      const key = this.getStorageKey(locale);
      const data = localStorage.getItem(key);
      if (!data) {
        return null;
      }
      return JSON.parse(data) as ChatState;
    } catch (error) {
      logger.error(
        "app.chat.storage.getState.error" as const,
        error instanceof Error ? error : new Error(String(error)),
      );
      return null;
    }
  }

  /**
   * Save the entire chat state for a locale
   */
  setState(
    locale: CountryLanguage,
    state: ChatState,
    logger: EndpointLogger,
  ): void {
    try {
      const key = this.getStorageKey(locale);
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      logger.error(
        "app.chat.storage.setState.error" as const,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Get a specific thread
   */
  getThread(
    locale: CountryLanguage,
    threadId: string,
    logger: EndpointLogger,
  ): ChatThread | null {
    const state = this.getState(locale, logger);
    if (!state) {
      return null;
    }
    return state.threads[threadId] || null;
  }

  /**
   * Save a specific thread
   */
  saveThread(
    locale: CountryLanguage,
    thread: ChatThread,
    logger: EndpointLogger,
  ): void {
    const state = this.getState(locale, logger);
    if (!state) {
      return;
    }

    state.threads[thread.id] = thread;
    state.lastUpdated = Date.now();
    this.setState(locale, state, logger);
  }

  /**
   * Delete a specific thread
   */
  deleteThread(
    locale: CountryLanguage,
    threadId: string,
    logger: EndpointLogger,
  ): void {
    const state = this.getState(locale, logger);
    if (!state) {
      return;
    }

    delete state.threads[threadId];
    state.lastUpdated = Date.now();
    this.setState(locale, state, logger);
  }

  /**
   * Get a specific folder
   */
  getFolder(
    locale: CountryLanguage,
    folderId: string,
    logger: EndpointLogger,
  ): ChatFolder | null {
    const state = this.getState(locale, logger);
    if (!state) {
      return null;
    }
    return state.folders[folderId] || null;
  }

  /**
   * Save a specific folder
   */
  saveFolder(
    locale: CountryLanguage,
    folder: ChatFolder,
    logger: EndpointLogger,
  ): void {
    const state = this.getState(locale, logger);
    if (!state) {
      return;
    }

    state.folders[folder.id] = folder;
    state.lastUpdated = Date.now();
    this.setState(locale, state, logger);
  }

  /**
   * Delete a specific folder
   */
  deleteFolder(
    locale: CountryLanguage,
    folderId: string,
    logger: EndpointLogger,
  ): void {
    const state = this.getState(locale, logger);
    if (!state) {
      return;
    }

    delete state.folders[folderId];
    state.lastUpdated = Date.now();
    this.setState(locale, state, logger);
  }

  /**
   * Get UI preferences
   */
  getUIPreferences(logger: EndpointLogger): ChatUIPreferences | null {
    try {
      const data = localStorage.getItem(this.UI_PREFERENCES_KEY);
      if (!data) {
        return null;
      }
      return JSON.parse(data) as ChatUIPreferences;
    } catch (error) {
      logger.error(
        "app.chat.storage.getUIPreferences.error" as const,
        error instanceof Error ? error : new Error(String(error)),
      );
      return null;
    }
  }

  /**
   * Save UI preferences
   */
  saveUIPreferences(
    preferences: ChatUIPreferences,
    logger: EndpointLogger,
  ): void {
    try {
      localStorage.setItem(
        this.UI_PREFERENCES_KEY,
        JSON.stringify(preferences),
      );
    } catch (error) {
      logger.error(
        "app.chat.storage.saveUIPreferences.error" as const,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Clear all data for a specific locale
   */
  clear(locale: CountryLanguage, logger: EndpointLogger): void {
    try {
      const key = this.getStorageKey(locale);
      localStorage.removeItem(key);
    } catch (error) {
      logger.error(
        "app.chat.storage.clear.error" as const,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Clear all chat data (all locales and preferences)
   */
  clearAll(logger: EndpointLogger): void {
    try {
      // Remove all chat state keys
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });

      // Remove UI preferences
      localStorage.removeItem(this.UI_PREFERENCES_KEY);
    } catch (error) {
      logger.error(
        "app.chat.storage.clearAll.error" as const,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}

/**
 * Default storage adapter instance
 *
 * This is the current implementation using localStorage.
 * In the future, this can be swapped with a DatabaseAdapter.
 */
export const storageAdapter: StorageAdapter = new LocalStorageAdapter();

/**
 * Example of how a future DatabaseAdapter might look:
 *
 * export class DatabaseAdapter implements StorageAdapter {
 *   async getState(locale: CountryLanguage): Promise<ChatState | null> {
 *     const response = await fetch(`/api/chat/state?locale=${locale}`);
 *     return response.json();
 *   }
 *
 *   async setState(locale: CountryLanguage, state: ChatState): Promise<void> {
 *     await fetch(`/api/chat/state?locale=${locale}`, {
 *       method: 'POST',
 *       body: JSON.stringify(state),
 *     });
 *   }
 *
 *   // ... other methods
 * }
 *
 * // To migrate, just change this line:
 * export const storageAdapter: StorageAdapter = new DatabaseAdapter();
 */
