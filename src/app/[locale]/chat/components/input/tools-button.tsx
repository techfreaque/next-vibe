"use client";

import { Badge } from "@/packages/next-vibe-ui/web/ui/badge";
import { Button } from "@/packages/next-vibe-ui/web/ui/button";
import { Span } from "@/packages/next-vibe-ui/web/ui/span";
import { Wrench } from "@/packages/next-vibe-ui/web/ui/icons/Wrench";
import type { JSX } from "react";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface ToolsButtonProps {
  activeToolCount: number;
  onOpenToolsModal: () => void;
  disabled?: boolean;
  locale: CountryLanguage;
}

/**
 * Tools Button Component
 * Shows the number of active tools and opens the tool selector modal
 */
export function ToolsButton({
  activeToolCount,
  onOpenToolsModal,
  disabled = false,
  locale,
}: ToolsButtonProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Button
      type="button"
      onClick={onOpenToolsModal}
      disabled={disabled}
      variant="outline"
      size="sm"
      className={
        activeToolCount > 0
          ? "relative inline-flex items-center justify-center gap-2 h-9 px-3 border-primary/50 bg-primary/5"
          : "relative inline-flex items-center justify-center gap-2 h-9 px-3"
      }
      title={t("app.chat.toolsButton.title")}
    >
      <Wrench className="h-4 w-4 shrink-0" />
      <Span className="hidden sm:inline">
        {t("app.chat.toolsButton.tools")}
      </Span>
      {activeToolCount > 0 && (
        <Badge
          variant="default"
          className="h-5 min-w-5 px-1.5 text-xs font-medium bg-primary text-primary-foreground"
        >
          {activeToolCount}
        </Badge>
      )}
    </Button>
  );
}
