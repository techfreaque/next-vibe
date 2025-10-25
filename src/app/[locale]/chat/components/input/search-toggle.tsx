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
  onOpenToolsModal: () => void;
  disabled?: boolean;
  locale: CountryLanguage;
}

export function SearchToggle({
  enabled,
  onChange,
  onOpenToolsModal,
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

  const handleDivClick = (e: React.MouseEvent): void => {
    // Don't open modal if clicking on the switch itself
    const target = e.target as HTMLElement;
    // eslint-disable-next-line i18next/no-literal-string
    const isSwitch = target.closest('[role="switch"]');
    if (!isSwitch && !disabled) {
      onOpenToolsModal();
    }
  };

  return (
    <Div
      onClick={handleDivClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 text-sm min-h-9 h-auto transition-colors",
        "border border-input rounded-md px-3 py-2 cursor-pointer",
        enabled && "border-primary/50 bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      title={titleText}
    >
      <Search className="h-4 w-4 flex-shrink-0" />
      <Span className="hidden sm:inline">
        {t("app.chat.searchToggle.search")}
      </Span>
      <Div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Switch
          checked={enabled}
          onCheckedChange={handleChange}
          disabled={disabled}
          className="h-4 w-7 data-[state=checked]:bg-primary"
        />
      </Div>
      {enabled && (
        <Span className="hidden lg:inline text-[10px] opacity-75">
          {t("app.chat.searchToggle.creditIndicator")}
        </Span>
      )}
    </Div>
  );
}
