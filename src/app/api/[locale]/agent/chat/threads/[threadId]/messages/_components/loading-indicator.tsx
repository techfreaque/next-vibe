"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

export function LoadingIndicator(): JSX.Element {
  return (
    <Div className={cn("flex items-start gap-3", "animate-fade-in")}>
      <Div className="flex-1">
        <Div className="flex items-center gap-2">
          <Div style={{ animationDelay: "0ms" }}>
            <Div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          </Div>
          <Div style={{ animationDelay: "150ms" }}>
            <Div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          </Div>
          <Div style={{ animationDelay: "300ms" }}>
            <Div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          </Div>
        </Div>

        {/* Fixed height container to maintain consistent spacing */}
        <Div className="h-8" />
      </Div>
    </Div>
  );
}
