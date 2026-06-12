import { cn } from "next-vibe/shared/utils/utils";
import type * as React from "react";

import type { StyleType } from "../utils/style-type";

export type LoadingBlockSize = "sm" | "md" | "lg";

export type LoadingBlockProps = {
  message?: string;
  size?: LoadingBlockSize;
} & StyleType;

const sizeConfig: Record<
  LoadingBlockSize,
  { spinner: string; text: string; container: string }
> = {
  sm: { spinner: "h-4 w-4", text: "text-xs", container: "py-4" },
  md: { spinner: "h-6 w-6", text: "text-sm", container: "py-8" },
  lg: { spinner: "h-8 w-8", text: "text-base", container: "py-12" },
};

export function LoadingBlock({
  message,
  size = "md",
  className,
  style,
}: LoadingBlockProps): React.JSX.Element {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-muted-foreground",
        config.container,
        className,
      )}
      style={style}
    >
      <svg
        className={cn("animate-spin", config.spinner)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {message ? (
        <span className={cn("text-muted-foreground", config.text)}>
          {message}
        </span>
      ) : null}
    </div>
  );
}
LoadingBlock.displayName = "LoadingBlock";
