/**
 * Chat Input Store (Zustand)
 * Manages input text, file attachments, and textarea ref.
 * Draft autosave is handled via subscription to navigation changes.
 */

"use client";

import type { TextareaRefObject } from "next-vibe-ui/ui/textarea";
import { createRef, type RefObject } from "react";
import { create } from "zustand";

export interface ChatInputStore {
  input: string;
  attachments: File[];
  inputRef: RefObject<TextareaRefObject | null>;
  setInput: (input: string) => void;
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;
  reset: () => void;
}

export const useChatInputStore = create<ChatInputStore>((set, get) => ({
  input: "",
  attachments: [],
  inputRef: createRef<TextareaRefObject | null>(),
  setInput: (input: string): void => {
    set({ input });
  },
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])): void => {
    if (typeof attachments === "function") {
      set({ attachments: attachments(get().attachments) });
    } else {
      set({ attachments });
    }
  },
  reset: (): void => {
    set({ input: "", attachments: [] });
  },
}));
