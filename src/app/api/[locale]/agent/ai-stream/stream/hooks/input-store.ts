/**
 * Chat Input Store (Zustand)
 * Manages input text, file attachments, and textarea ref.
 * Draft autosave is handled via subscription to navigation changes.
 */

"use client";

import type { TextareaRefObject } from "next-vibe-ui/ui/textarea";
import { createRef, type RefObject } from "react";
import { create } from "zustand";

import {
  ImageQuality,
  ImageSize,
} from "@/app/api/[locale]/agent/image-generation/enum";
import { MusicDuration } from "@/app/api/[locale]/agent/music-generation/enum";

export { ImageQuality, ImageSize, MusicDuration };

export interface ChatInputStore {
  input: string;
  attachments: File[];
  inputRef: RefObject<TextareaRefObject | null>;
  /** Image generation settings */
  imageSize: string;
  imageQuality: string;
  /** Music generation settings */
  musicDuration: string;
  setInput: (input: string) => void;
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;
  setImageSize: (size: string) => void;
  setImageQuality: (quality: string) => void;
  setMusicDuration: (duration: string) => void;
  reset: () => void;
}

export const useChatInputStore = create<ChatInputStore>((set, get) => ({
  input: "",
  attachments: [],
  inputRef: createRef<TextareaRefObject | null>(),
  imageSize: ImageSize.SQUARE_1024,
  imageQuality: ImageQuality.STANDARD,
  musicDuration: MusicDuration.MEDIUM,
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
  setImageSize: (imageSize: string): void => {
    set({ imageSize });
  },
  setImageQuality: (imageQuality: string): void => {
    set({ imageQuality });
  },
  setMusicDuration: (musicDuration: string): void => {
    set({ musicDuration });
  },
  reset: (): void => {
    set({ input: "", attachments: [] });
  },
}));
