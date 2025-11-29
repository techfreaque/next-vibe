"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Bug, Hash, List, Network } from "next-vibe-ui/ui/icons";
import type React from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import {
  type ViewModeValue,
  ViewMode,
} from "@/app/api/[locale]/v1/core/agent/chat/enum";

interface ViewModeToggleProps {
  mode: typeof ViewModeValue;
  onChange: (mode: typeof ViewModeValue) => void;
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
        onClick={() => onChange(ViewMode.LINEAR)}
        className={cn(
          "bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9",
          mode === ViewMode.LINEAR &&
            "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        title={t("app.chat.common.viewModeToggle.linearView")}
      >
        <List className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(ViewMode.THREADED)}
        className={cn(
          "bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9",
          mode === ViewMode.THREADED &&
            "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        title={t("app.chat.common.viewModeToggle.threadedView")}
      >
        <Network className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(ViewMode.FLAT)}
        className={cn(
          "bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9",
          mode === ViewMode.FLAT &&
            "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        title={t("app.chat.common.viewModeToggle.flatView")}
      >
        <Hash className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(ViewMode.DEBUG)}
        className={cn(
          "bg-card backdrop-blur-sm shadow-sm hover:bg-accent h-9 w-9",
          mode === ViewMode.DEBUG &&
            "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        title={t("app.chat.common.viewModeToggle.debugView")}
      >
        <Bug className="h-5 w-5" />
      </Button>
    </Div>
  );
}
