"use client";

import { cn } from "next-vibe/shared/utils";
import { Button, Div } from "next-vibe-ui/ui";
import { Hash, List, Network } from "next-vibe-ui/ui/icons";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

export type ViewMode = "linear" | "threaded" | "flat";

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  locale: CountryLanguage;
  className?: string;
}

export function ViewModeToggle({
  mode,
  onChange,
  locale,
  className,
}: ViewModeToggleProps): React.JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Div className={cn("flex gap-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("linear")}
        className={cn(
          "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-9 w-9",
          mode === "linear" && "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        title={t("app.chat.common.viewModeToggle.linearView")}
      >
        <List className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("threaded")}
        className={cn(
          "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-9 w-9",
          mode === "threaded" &&
            "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        title={t("app.chat.common.viewModeToggle.threadedView")}
      >
        <Network className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("flat")}
        className={cn(
          "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-9 w-9",
          mode === "flat" && "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        title={t("app.chat.common.viewModeToggle.flatView")}
      >
        <Hash className="h-5 w-5" />
      </Button>
    </Div>
  );
}
