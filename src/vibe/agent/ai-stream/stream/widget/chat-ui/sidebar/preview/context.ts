"use client";

import { createContext, useContext } from "react";

import type { SidebarVariant } from "./selection";

export type SidebarPanel = "chats" | "search" | "account";

export const SidebarPreviewContext = createContext<{
  variant: SidebarVariant;
  panel: SidebarPanel;
  onOpenChat: () => void;
} | null>(null);

export function useSidebarPreview(): React.ContextType<
  typeof SidebarPreviewContext
> {
  return useContext(SidebarPreviewContext);
}
