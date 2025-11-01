"use client";

import { parseError } from "next-vibe/shared/utils/parse-error";
import { Button } from "next-vibe-ui//ui/button";
import { Check, Copy } from "lucide-react";
import type { JSX } from "react";
import React, { useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

const TIMING = {
  COPY_FEEDBACK_DURATION: 2000,
};

interface CopyButtonProps {
  content: string;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "sm" | "default" | "lg";
  className?: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
}

export function CopyButton({
  content,
  variant = "ghost",
  size = "icon",
  className,
  locale,
  logger,
}: CopyButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const { t } = simpleT(locale);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), TIMING.COPY_FEEDBACK_DURATION);
    } catch (error) {
      logger.error("app.chat.actions.copyContent", parseError(error));
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
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
