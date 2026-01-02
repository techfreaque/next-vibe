"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Search } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { Switch } from "next-vibe-ui/ui/switch";
import type { JSX } from "react";
import React from "react";

import { SEARCH_ALIAS } from "@/app/api/[locale]/agent/brave-search/definition";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { aliasToPathMap } from "@/app/api/[locale]/system/generated/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

const SEARCH_TOOL_NAME = aliasToPathMap[SEARCH_ALIAS];

interface SearchToggleProps {
  disabled?: boolean;
  locale: CountryLanguage;
}

/**
 * Search Toggle Component
 * Convenience UI for toggling the search tool on/off
 * Note: Search is treated as one of the ~130 tools, but has a quick-access toggle for convenience
 * The toggle reads/writes to the same enabledTools state as the tools modal
 */
export function SearchToggle({ disabled = false, locale }: SearchToggleProps): JSX.Element {
  const { enabledTools, setEnabledTools } = useChatContext();
  const { t } = simpleT(locale);

  // Check if search tool is enabled
  const enabled = enabledTools.some((tool) => tool.id === SEARCH_TOOL_NAME);

  const titleText = enabled
    ? t("app.chat.searchToggle.enabledTitle")
    : t("app.chat.searchToggle.disabledTitle");

  const handleChange = (checked: boolean): void => {
    if (disabled) {
      return;
    }

    // Toggle search tool in the enabledTools array
    if (checked) {
      // Add search tool if not already present
      if (!enabledTools.some((tool) => tool.id === SEARCH_TOOL_NAME)) {
        setEnabledTools([...enabledTools, { id: SEARCH_TOOL_NAME, requiresConfirmation: false }]);
      }
    } else {
      // Remove search tool
      setEnabledTools(enabledTools.filter((tool) => tool.id !== SEARCH_TOOL_NAME));
    }
  };

  return (
    <Div
      className={cn(
        "inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 text-sm h-8 sm:h-9 transition-colors",
        "border border-input rounded-md px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2",
        enabled && "border-primary/50 bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      title={titleText}
    >
      <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
      <Span className="sr-only">{t("app.chat.searchToggle.search")}</Span>
      <Switch
        checked={enabled}
        onCheckedChange={handleChange}
        disabled={disabled}
        className="h-3.5 w-6 sm:h-4 sm:w-7 data-[state=checked]:bg-primary"
      />
    </Div>
  );
}
