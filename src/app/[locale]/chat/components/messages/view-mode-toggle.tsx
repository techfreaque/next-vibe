"use client";

import { List, Network, Hash } from "lucide-react";
import { Button } from "@/packages/next-vibe-ui/web/ui";
import { cn } from "next-vibe/shared/utils";

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
  return (
    <div className={cn("flex gap-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("linear")}
        className={cn(
          "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90",
          mode === "linear" && "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        title="Linear view (ChatGPT style)"
      >
        <List className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("threaded")}
        className={cn(
          "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90",
          mode === "threaded" && "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        title="Threaded view (Reddit/Discord style)"
      >
        <Network className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange("flat")}
        className={cn(
          "bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90",
          mode === "flat" && "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        title="Flat view (4chan style)"
      >
        <Hash className="h-5 w-5" />
      </Button>
    </div>
  );
}

