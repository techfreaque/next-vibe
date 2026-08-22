/**
 * Chat Input Store (Zustand)
 * Manages input text, file attachments, and textarea ref.
 * Draft autosave is handled via subscription to navigation changes.
 */

"use client";

import type { TextareaRefObject } from "next-vibe/ui/components/textarea";
import { createRef, type RefObject } from "react";
import { create } from "zustand";

import { ImageQuality, ImageSize } from "../../../image-generation/enum";
import { MusicDuration } from "../../../music-generation/enum";

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
  /** True from the moment send is clicked until the stream confirms it started (streaming-state-changed). Drives stop button visibility immediately. */
  isSubmitting: boolean;
  setInput: (input: string) => void;
  setAttachments: (attachments: File[] | ((prev: File[]) => File[])) => void;
  setImageSize: (size: ImageSizeValue) => void;
  setImageQuality: (quality: ImageQualityValue) => void;
  setMusicDuration: (duration: MusicDurationValue) => void;
  setIsSubmitting: (value: boolean) => void;
  reset: () => void;
}

export const useChatInputStore = create<ChatInputStore>((set, get) => ({
  input: "",
  attachments: [],
  inputRef: createRef<TextareaRefObject | null>(),
  imageSize: ImageSize.SQUARE_1024,
  imageQuality: ImageQuality.STANDARD,
  musicDuration: MusicDuration.MEDIUM,
  isSubmitting: false,
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
  setIsSubmitting: (value: boolean): void => {
    set({ isSubmitting: value });
  },
  reset: (): void => {
    set({ input: "", attachments: [] });
  },
}));
