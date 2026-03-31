/**
 * Chat Input Store (Zustand)
 * Manages input text, file attachments, and textarea ref.
 * Draft autosave is handled via subscription to navigation changes.
 */

"use client";

import type { TextareaRefObject } from "next-vibe-ui/ui/textarea";
import { createRef, type RefObject } from "react";
import { create } from "zustand";

// eslint-disable-next-line no-restricted-imports -- Enum objects needed for keyof typeof derivation
import {
  ImageQuality,
  ImageSize,
} from "@/app/api/[locale]/agent/image-generation/enum";
// eslint-disable-next-line no-restricted-imports -- Enum objects needed for keyof typeof derivation
import { MusicDuration } from "@/app/api/[locale]/agent/music-generation/enum";

export { ImageQuality, ImageSize, MusicDuration };

type ImageSizeValue = (typeof ImageSize)[keyof typeof ImageSize];
type ImageQualityValue = (typeof ImageQuality)[keyof typeof ImageQuality];
type MusicDurationValue = (typeof MusicDuration)[keyof typeof MusicDuration];

export interface ChatInputStore {
  input: string;
  attachments: File[];
  inputRef: RefObject<TextareaRefObject | null>;
  /** Image generation settings */
  imageSize: ImageSizeValue;
  imageQuality: ImageQualityValue;
  /** Music generation settings */
  musicDuration: MusicDurationValue;
  setInput: (input: string) => void;
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;
  setImageSize: (size: ImageSizeValue) => void;
  setImageQuality: (quality: ImageQualityValue) => void;
  setMusicDuration: (duration: MusicDurationValue) => void;
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
  setImageSize: (imageSize: ImageSizeValue): void => {
    set({ imageSize });
  },
  setImageQuality: (imageQuality: ImageQualityValue): void => {
    set({ imageQuality });
  },
  setMusicDuration: (musicDuration: MusicDurationValue): void => {
    set({ musicDuration });
  },
  reset: (): void => {
    set({ input: "", attachments: [] });
  },
}));
