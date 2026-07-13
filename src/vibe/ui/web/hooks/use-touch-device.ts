"use client";

import { useEffect } from "react";
import { create } from "zustand";

import { platform } from "@/config/env-client";

interface TouchDeviceStore {
  isTouch: boolean;
  isInitialized: boolean;
  initialize: () => void;
}

const useTouchDeviceStore = create<TouchDeviceStore>((set, get) => ({
  isTouch: false,
  isInitialized: false,

  initialize: (): void => {
    if (get().isInitialized) {
      return;
    }

    if (platform.isReactNative) {
      set({ isTouch: true, isInitialized: true });
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const checkTouch = (): void => {
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        ("msMaxTouchPoints" in navigator &&
          (navigator as Navigator & { msMaxTouchPoints: number })
            .msMaxTouchPoints > 0);

      set({ isTouch: hasTouch, isInitialized: true });
    };

    checkTouch();

    window.addEventListener("resize", checkTouch);
  },
}));

export function useTouchDevice(): boolean {
  const isTouch = useTouchDeviceStore((state) => state.isTouch);
  const initialize = useTouchDeviceStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return isTouch;
}
