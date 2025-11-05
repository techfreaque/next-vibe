"use client";

import { Loader2 } from 'next-vibe-ui/ui/icons';
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Skeleton } from "next-vibe-ui/ui/skeleton";
import type { JSX } from "react";

import type { WidgetEmptyStateProps, WidgetLoadingProps } from "../types";

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
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2
        className={cn("animate-spin text-muted-foreground", sizeClasses[size])}
      />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
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
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      {icon && (
        <div
          className="text-4xl opacity-50"
          role="img"
          // eslint-disable-next-line i18next/no-literal-string
          aria-label="Empty state"
        >
          {icon}
        </div>
      )}
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {message}
      </p>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
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
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 w-full"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

WidgetSkeleton.displayName = "WidgetSkeleton";
