"use client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { cn } from "next-vibe/core/utils/utils";
import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { Bug } from "next-vibe/ui/web/ui/icons/Bug";
import { Hash } from "next-vibe/ui/web/ui/icons/Hash";
import { List } from "next-vibe/ui/web/ui/icons/List";
import { Network } from "next-vibe/ui/web/ui/icons/Network";
import type React from "react";

import {
  ViewMode,
  type ViewModeValue,
} from "@/app/api/[locale]/agent/chat/enum";

import { scopedTranslation } from "../i18n";

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
  const { t } = scopedTranslation.scopedT(locale);

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
        title={t("widget.common.viewModeToggle.linearView")}
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
        title={t("widget.common.viewModeToggle.threadedView")}
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
        title={t("widget.common.viewModeToggle.flatView")}
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
        title={t("widget.common.viewModeToggle.debugView")}
      >
        <Bug className="h-5 w-5" />
      </Button>
    </Div>
  );
}
