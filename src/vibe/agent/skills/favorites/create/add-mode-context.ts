"use client";

import { createContext, useContext } from "react";

/**
 * Set by hosts that embed the favorite-create form as "add a mode" (the
 * new-thread grid's dialog). The form then names its submit "Add mode" and
 * leaves scrolling to the host, so the host's container is the only
 * scrollbar; its action bar sticks to the top instead.
 */
const AddModeContext = createContext<boolean>(false);

export const AddModeProvider = AddModeContext.Provider;

export function useIsAddMode(): boolean {
  return useContext(AddModeContext);
}
