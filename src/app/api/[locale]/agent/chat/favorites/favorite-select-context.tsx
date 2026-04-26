"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { FavoriteCard } from "./definition";

interface FavoriteSelectContextValue {
  onSelectFavorite: (item: FavoriteCard) => void;
  /** Current skillId in the local form — used to compute active state client-side */
  activeSkillId: string | null;
  /** Current modelId in the local form — used to compute active state client-side */
  activeModelId: string | null;
}

const FavoriteSelectContext = createContext<FavoriteSelectContextValue | null>(
  null,
);

export function FavoriteSelectProvider({
  onSelectFavorite,
  activeSkillId,
  activeModelId,
  children,
}: {
  onSelectFavorite: (item: FavoriteCard) => void;
  activeSkillId: string | null;
  activeModelId: string | null;
  children: ReactNode;
}): React.JSX.Element {
  return (
    <FavoriteSelectContext.Provider
      value={{ onSelectFavorite, activeSkillId, activeModelId }}
    >
      {children}
    </FavoriteSelectContext.Provider>
  );
}

/**
 * Returns the override value when inside a FavoriteSelectProvider,
 * or null when used in the normal chat context (no provider in tree).
 */
export function useFavoriteSelectOverride(): FavoriteSelectContextValue | null {
  return useContext(FavoriteSelectContext);
}
