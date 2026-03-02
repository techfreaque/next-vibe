"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Camera } from "next-vibe-ui/ui/icons/Camera";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ChatScreenshotButtonProps {
  locale: CountryLanguage;
  onScreenshot?: () => Promise<void>;
}

/**
 * Screenshot capture button for chat interface.
 * Handles loading state during screenshot capture.
 */
export function ChatScreenshotButton({
  locale,
  onScreenshot,
}: ChatScreenshotButtonProps): JSX.Element {
  const { t } = simpleT(locale);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleClick = useCallback(async (): Promise<void> => {
    if (!onScreenshot || isCapturing) {
      return;
    }

    setIsCapturing(true);
    try {
      await onScreenshot();
    } finally {
      setIsCapturing(false);
    }
  }, [onScreenshot, isCapturing]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isCapturing}
      className="bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9 disabled:opacity-50 disabled:cursor-not-allowed"
      title={
        isCapturing
          ? t("app.chat.screenshot.capturing")
          : t("app.chat.screenshot.capture")
      }
    >
      {isCapturing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Camera className="h-5 w-5" />
      )}
    </Button>
  );
}
