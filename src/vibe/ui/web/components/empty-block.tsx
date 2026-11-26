import type * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";
import type { ButtonVariant } from "./button";

export interface EmptyBlockAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
}

export type EmptyBlockProps = {
  size?: "compact" | "page";
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: EmptyBlockAction;
  /** Outline action shown left of the primary action. */
  secondaryAction?: EmptyBlockAction;
} & StyleType;

export function EmptyBlock({
  size = "compact",
  icon,
  title,
  message,
  action,
  secondaryAction,
  className,
  style,
}: EmptyBlockProps): React.JSX.Element {
  const page = size === "page";
  const Heading = page ? "h2" : "div";
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        page && "gap-4 px-5",
        className,
      )}
      style={style}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className={
            page
              ? "rounded-full bg-muted p-2.5 text-muted-foreground"
              : "text-muted-foreground/30"
          }
        >
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col gap-1">
        <Heading
          className={
            page
              ? "text-base font-semibold text-foreground"
              : "text-sm font-medium text-muted-foreground"
          }
        >
          {title}
        </Heading>
        {message ? (
          <div
            className={
              page
                ? "max-w-sm text-balance text-sm leading-relaxed text-muted-foreground"
                : "text-xs text-muted-foreground/70 max-w-xs"
            }
          >
            {message}
          </div>
        ) : null}
      </div>
      {action || secondaryAction ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {secondaryAction ? (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                page &&
                  "min-h-11 px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              {secondaryAction.label}
            </button>
          ) : null}
          {action ? (
            <button
              type="button"
              onClick={action.onClick}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                page &&
                  "min-h-11 px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                action.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {action.label}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
EmptyBlock.displayName = "EmptyBlock";
