"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import {
  type WidgetEmptyStateProps,
  type WidgetLoadingProps,
} from "../../../shared/widgets/types";

/**
 * Widget Loading Component
 * Displays a loading state for widgets
 */
export function WidgetLoading({
  message,
  size = "md",
}: WidgetLoadingProps): JSX.Element {
  const sizeClasses = {
    // eslint-disable-next-line i18next/no-literal-string
    sm: "h-4 w-4",
    // eslint-disable-next-line i18next/no-literal-string
    md: "h-6 w-6",
    // eslint-disable-next-line i18next/no-literal-string
    lg: "h-8 w-8",
  };

  return (
    <Div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2
        className={cn("animate-spin text-muted-foreground", sizeClasses[size])}
      />
      {message && <P className="text-sm text-muted-foreground">{message}</P>}
    </Div>
  );
}

WidgetLoading.displayName = "WidgetLoading";

/**
 * Widget Empty State Component
 * Displays an empty state for widgets with no data
 */
export function WidgetEmptyState({
  message,
  icon,
  action,
}: WidgetEmptyStateProps): JSX.Element {
  return (
    <Div className="flex flex-col items-center justify-center gap-4 py-12">
      {icon && (
        <Div
          className="text-4xl opacity-50"
          role="img"
          // eslint-disable-next-line i18next/no-literal-string
          aria-label="Empty state"
        >
          {icon}
        </Div>
      )}
      <P className="max-w-md text-center text-sm text-muted-foreground">
        {message}
      </P>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Div>
  );
}

WidgetEmptyState.displayName = "WidgetEmptyState";

/**
 * Widget Skeleton Component
 * Displays a skeleton loading state for widgets
 */
export function WidgetSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}): JSX.Element {
  return (
    <Div className={cn("flex flex-col gap-2", className)}>
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- Array.from callback requires first parameter */}
      {Array.from({ length: lines }).map((unused, i) => (
        <Div key={i} style={{ width: `${100 - i * 10}%` }}>
          <Skeleton className="h-4 w-full" />
        </Div>
      ))}
    </Div>
  );
}

WidgetSkeleton.displayName = "WidgetSkeleton";
