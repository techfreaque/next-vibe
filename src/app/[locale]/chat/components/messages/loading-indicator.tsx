"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import { chatAnimations } from "../../lib/design-tokens";

export function LoadingIndicator(): JSX.Element {
  return (
    <div className={cn("flex items-start gap-3", chatAnimations.fadeIn)}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Fixed height container to maintain consistent spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
