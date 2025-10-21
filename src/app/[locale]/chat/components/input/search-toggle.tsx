"use client";

import { Search } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { Switch } from "@/packages/next-vibe-ui/web/ui";

interface SearchToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  locale: CountryLanguage;
}

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
    <div
      className={cn(
        "inline-flex items-center justify-center gap-2 text-sm min-h-9 h-auto transition-colors rounded-md border border-input bg-background px-3 hover:bg-accent hover:text-accent-foreground",
        enabled && "border-primary/50 bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      title={titleText}
    >
      <Search className="h-4 w-4 flex-shrink-0" />
      <span className="hidden sm:inline">
        {t("app.chat.searchToggle.search")}
      </span>
      <Switch
        checked={enabled}
        onCheckedChange={handleChange}
        disabled={disabled}
        className="h-4 w-7 data-[state=checked]:bg-primary"
      />
      {enabled && (
        <span className="hidden lg:inline text-[10px] opacity-75">
          {t("app.chat.searchToggle.creditIndicator")}
        </span>
      )}
    </div>
  );
}
