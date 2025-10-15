"use client";

import { Search } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React from "react";

import { Button } from "@/packages/next-vibe-ui/web/ui";

interface SearchToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export function SearchToggle({
  enabled,
  onChange,
  disabled = false,
}: SearchToggleProps): JSX.Element {
  return (
    <Button
      type="button"
      size="sm"
      variant={enabled ? "default" : "outline"}
      onClick={() => onChange(!enabled)}
      disabled={disabled}
      className={cn(
        "gap-1.5 text-xs sm:text-sm h-8 sm:h-9 transition-colors",
        enabled && "bg-primary text-primary-foreground hover:bg-primary/90",
      )}
      // eslint-disable-next-line i18next/no-literal-string
      title={enabled ? "Search enabled" : "Search disabled"}
    >
      <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">
        {/* eslint-disable-next-line i18next/no-literal-string */}
        {enabled ? "Search On" : "Search Off"}
      </span>
    </Button>
  );
}
