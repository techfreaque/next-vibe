"use client";

import { Hash, List, Network } from "lucide-react";
import { cn } from "next-vibe/shared/utils";

import { useTranslation } from "@/i18n/core/client";
import { Button } from "@/packages/next-vibe-ui/web/ui";

export type ViewMode = "linear" | "threaded" | "flat";

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewModeToggle({
  mode,
  onChange,
  className,
}: ViewModeToggleProps) {
  const { t } = useTranslation("chat");

  return (
    <div className={cn("flex gap-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("linear")}
        className={cn(
          "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-10 w-10 sm:h-9 sm:w-9",
          mode === "linear" && "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        title={t("views.linearView")}
      >
        <List className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("threaded")}
        className={cn(
          "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-10 w-10 sm:h-9 sm:w-9",
          mode === "threaded" &&
            "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        title={t("views.threadedView")}
      >
        <Network className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("flat")}
        className={cn(
          "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 h-10 w-10 sm:h-9 sm:w-9",
          mode === "flat" && "bg-primary/10 text-primary hover:bg-primary/20",
        )}
        title={t("views.flatView")}
      >
        <Hash className="h-5 w-5" />
      </Button>
    </div>
  );
}
