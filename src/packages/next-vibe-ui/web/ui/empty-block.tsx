import { cn } from "next-vibe/shared/utils/utils";
import type * as React from "react";

import type { StyleType } from "../utils/style-type";
import type { ButtonVariant } from "./button";

export interface EmptyBlockAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
}

export type EmptyBlockProps = {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: EmptyBlockAction;
} & StyleType;

export function EmptyBlock({
  icon,
  title,
  message,
  action,
  className,
  style,
}: EmptyBlockProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className,
      )}
      style={style}
    >
      {icon ? <div className="text-muted-foreground/30">{icon}</div> : null}
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        {message ? (
          <div className="text-xs text-muted-foreground/70 max-w-xs">
            {message}
          </div>
        ) : null}
      </div>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            "mt-1 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            action.variant === "destructive"
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
EmptyBlock.displayName = "EmptyBlock";
