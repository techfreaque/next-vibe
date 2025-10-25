"use client";

import { cn } from "next-vibe/shared/utils";
import { Div, Span, Switch } from "next-vibe-ui/ui";
import { Search } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SearchToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  locale: CountryLanguage;
}

/**
 * Search Toggle Component
 * Simple toggle for enabling/disabling search tool
 * Note: Search is treated as one of the ~130 tools, but has a quick-access toggle for convenience
 */
export function SearchToggle({
  enabled,
  onChange,
  disabled = false,
  locale,
}: SearchToggleProps): JSX.Element {
  const { t } = simpleT(locale);
  const titleText = enabled
    ? t("app.chat.searchToggle.enabledTitle")
    : t("app.chat.searchToggle.disabledTitle");

  const handleChange = (checked: boolean): void => {
    if (!disabled) {
      onChange(checked);
    }
  };

  return (
    <Div
      className={cn(
        "inline-flex items-center justify-center gap-2 text-sm min-h-9 h-auto transition-colors",
        "border border-input rounded-md px-3 py-2",
        enabled && "border-primary/50 bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      title={titleText}
    >
      <Search className="h-4 w-4 flex-shrink-0" />
      <Span className="hidden sm:inline">
        {t("app.chat.searchToggle.search")}
      </Span>
      <Switch
        checked={enabled}
        onCheckedChange={handleChange}
        disabled={disabled}
        className="h-4 w-7 data-[state=checked]:bg-primary"
      />
      {enabled && (
        <Span className="hidden lg:inline text-[10px] opacity-75">
          {t("app.chat.searchToggle.creditIndicator")}
        </Span>
      )}
    </Div>
  );
}
