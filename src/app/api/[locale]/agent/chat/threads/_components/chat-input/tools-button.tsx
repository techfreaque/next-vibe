"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Wrench } from "next-vibe-ui/ui/icons/Wrench";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React from "react";

import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ToolsButtonProps {
  disabled?: boolean;
  locale: CountryLanguage;
}

/**
 * Tools Button Component
 * Shows the number of active tools and opens the tool selector modal
 */
export function ToolsButton({ disabled = false, locale }: ToolsButtonProps): JSX.Element {
  const { enabledTools, openToolsModal: onOpenToolsModal } = useChatContext();
  const activeToolCount = enabledTools.length;
  const { t } = simpleT(locale);

  return (
    <Button
      type="button"
      onClick={onOpenToolsModal}
      disabled={disabled}
      variant="outline"
      size="sm"
      className={cn(
        "relative inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 h-8 sm:h-9 px-1.5 sm:px-2 md:px-3",
        activeToolCount > 0 && "border-primary/50 bg-primary/5",
      )}
      title={t("app.chat.toolsButton.title")}
    >
      <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
      <Span className="hidden @2xl:inline text-xs">{t("app.chat.toolsButton.tools")}</Span>
      {activeToolCount > 0 && (
        <Badge
          variant="default"
          className="h-4 min-w-4 sm:h-5 sm:min-w-5 px-1 sm:px-1.5 text-[10px] sm:text-xs font-medium bg-primary text-primary-foreground"
        >
          {activeToolCount}
        </Badge>
      )}
    </Button>
  );
}
