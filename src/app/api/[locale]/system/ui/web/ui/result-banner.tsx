import { cn } from "next-vibe/core/utils/utils";
import type * as React from "react";

import type { StyleType } from "../../web/utils/style-type";

export type ResultBannerVariant = "success" | "danger" | "warning" | "info";

export type ResultBannerProps = {
  variant: ResultBannerVariant;
  icon?: React.ReactNode;
  title: string;
  message?: string;
  children?: React.ReactNode;
} & StyleType;

const variantClasses: Record<ResultBannerVariant, string> = {
  success: "border-success/30 bg-success/10",
  danger: "border-destructive/30 bg-destructive/10",
  warning: "border-warning/30 bg-warning/10",
  info: "border-info/30 bg-info/10",
};

const titleClasses: Record<ResultBannerVariant, string> = {
  success: "text-success",
  danger: "text-destructive",
  warning: "text-warning",
  info: "text-info",
};

export function ResultBanner({
  variant,
  icon,
  title,
  message,
  children,
  className,
  style,
}: ResultBannerProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 flex items-start gap-3",
        variantClasses[variant],
        className,
      )}
      style={style}
    >
      {icon ? (
        <div className={cn("flex-shrink-0 mt-0.5", titleClasses[variant])}>
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col gap-1 min-w-0">
        <span className={cn("font-medium text-sm", titleClasses[variant])}>
          {title}
        </span>
        {message ? (
          <span className={cn("text-xs", titleClasses[variant])}>
            {message}
          </span>
        ) : null}
        {children ? <div className="flex gap-2 mt-1.5">{children}</div> : null}
      </div>
    </div>
  );
}
ResultBanner.displayName = "ResultBanner";
