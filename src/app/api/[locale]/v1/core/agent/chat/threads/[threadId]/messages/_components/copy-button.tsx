"use client";

import { parseError } from "next-vibe/shared/utils/parse-error";
import { Button } from "next-vibe-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "next-vibe-ui/ui/dropdown-menu";
import { Check, Copy } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

const TIMING = {
  COPY_FEEDBACK_DURATION: 2000,
};

interface CopyButtonProps {
  // Support both single content (legacy) and dual format
  content?: string;
  contentMarkdown?: string;
  contentText?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "sm" | "default" | "lg";
  className?: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function CopyButton({
  content,
  contentMarkdown,
  contentText,
  variant = "ghost",
  size = "icon",
  className,
  locale,
  logger,
}: CopyButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const { t } = simpleT(locale);

  // Check if we have dual format support
  const hasDualFormat = contentMarkdown !== undefined && contentText !== undefined;

  const handleCopy = async (format: "markdown" | "text"): Promise<void> => {
    try {
      let textToCopy: string;

      if (hasDualFormat) {
        textToCopy = format === "markdown" ? contentMarkdown : contentText;
      } else {
        // Legacy mode - use single content
        textToCopy = content || "";
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), TIMING.COPY_FEEDBACK_DURATION);
    } catch (error) {
      logger.error("app.chat.actions.copyContent", parseError(error));
    }
  };

  // If dual format is available, show dropdown
  if (hasDualFormat) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className || "h-8 w-8 md:h-7 md:w-7"}
            title={
              copied
                ? t("app.chat.common.copyButton.copied")
                : t("app.chat.common.copyButton.copyToClipboard")
            }
          >
            {copied ? (
              <Check className="h-4 w-4 md:h-3.5 md:w-3.5 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 md:h-3.5 md:w-3.5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleCopy("markdown")}>
            <Copy className="mr-2 h-4 w-4" />
            {t("app.chat.common.copyButton.copyAsMarkdown")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCopy("text")}>
            <Copy className="mr-2 h-4 w-4" />
            {t("app.chat.common.copyButton.copyAsText")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Legacy single content mode - simple button
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => handleCopy("text")}
      className={className || "h-8 w-8 md:h-7 md:w-7"}
      title={
        copied
          ? t("app.chat.common.copyButton.copied")
          : t("app.chat.common.copyButton.copyToClipboard")
      }
    >
      {copied ? (
        <Check className="h-4 w-4 md:h-3.5 md:w-3.5 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 md:h-3.5 md:w-3.5" />
      )}
    </Button>
  );
}
