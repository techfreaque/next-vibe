/**
 * Public-user (localStorage) group-delete regression.
 *
 * Bug: removing a multi-variant skill from the favorites widget fired every
 * variant's DELETE with Promise.all. For public (not-signed-in) users each
 * DELETE was a localStorage read-modify-write (deleteFavorite). Run concurrently
 * against the browser's async localStorage, all deletes read the same snapshot
 * and each dropped only its own id, so the last write won and the other variants
 * came back after a refresh - "skill is back minus one variant".
 *
 * Fix: a batch-delete op removes every id in ONE atomic read-modify-write
 * (ChatFavoritesRepositoryClient.deleteFavorites). This test proves the batch
 * delete removes ALL variants of a multi-variant skill and leaves unrelated
 * favorites untouched.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { storage } from "next-vibe/ui/lib/storage";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEYS } from "../../chat/constants";
import { ChatFavoritesRepositoryClient } from "./repository-client";

// In-memory async store standing in for the browser's async localStorage. The
// real web storage adapter returns null under node, so the public (localStorage)
// delete path can't be exercised without this mock. vi.mock is hoisted above the
// imports, so `storage` resolves to this fake at module load.
const memory = new Map<string, string>();
vi.mock("next-vibe/ui/lib/storage", () => ({
  storage: {
    getItem: (key: string): Promise<string | null> =>
      Promise.resolve(memory.get(key) ?? null),
    setItem: (key: string, value: string): Promise<void> => {
      memory.set(key, value);
      return Promise.resolve();
    },
    removeItem: (key: string): Promise<void> => {
      memory.delete(key);
      return Promise.resolve();
    },
  },
  getLocalItem: (key: string): string | null => memory.get(key) ?? null,
}));

const logger = createEndpointLogger(false, defaultLocale);
const THEA_VARIANTS = [
  "brilliant",
  "cheap",
  "hacker",
  "oracle",
  "elon-tusk",
  "vision",
  "uncensored",
];

interface StoredFavorite {
  id: string;
  skillId: string;
  customIcon: null;
  voiceModelSelection: null;
  modelSelection: null;
  position: number;
}

function theaRows(): StoredFavorite[] {
  return THEA_VARIANTS.map((variant, index) => ({
    id: `thea-${variant}`,
    skillId: `thea__${variant}`,
    customIcon: null,
    voiceModelSelection: null,
    modelSelection: null,
    position: index,
  }));
}

async function seed(configs: StoredFavorite[]): Promise<void> {
  await storage.setItem(
    STORAGE_KEYS.FAVORITE_CHARACTERS,
    JSON.stringify(configs),
  );
}

async function remainingIds(): Promise<string[]> {
  const raw = await storage.getItem(STORAGE_KEYS.FAVORITE_CHARACTERS);
  if (!raw) {
    return [];
  }
  return (JSON.parse(raw) as { id: string }[]).map((config) => config.id);
}

describe("public-user multi-variant group delete", () => {
  beforeEach(async () => {
    await storage.removeItem(STORAGE_KEYS.FAVORITE_CHARACTERS);
  });
  afterEach(async () => {
    await storage.removeItem(STORAGE_KEYS.FAVORITE_CHARACTERS);
  });

  it("batch delete removes EVERY variant of the skill", async () => {
    const rows = theaRows();
    await seed(rows);

    const result = await ChatFavoritesRepositoryClient.deleteFavorites(
      rows.map((r) => r.id),
      logger,
      defaultLocale,
    );

    expect(result.success).toBe(true);
    expect(await remainingIds()).toHaveLength(0);
  });

  it("batch delete leaves unrelated favorites untouched", async () => {
    const other: StoredFavorite = {
      id: "hermes-technical",
      skillId: "hermes__technical",
      customIcon: null,
      voiceModelSelection: null,
      modelSelection: null,
      position: 99,
    };
    const rows = [...theaRows(), other];
    await seed(rows);

    await ChatFavoritesRepositoryClient.deleteFavorites(
      theaRows().map((r) => r.id),
      logger,
      defaultLocale,
    );

    expect(await remainingIds()).toEqual(["hermes-technical"]);
  });
});
