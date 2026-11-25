import type * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";

export type WidgetHeaderProps = {
  title: string;
  titleAccessory?: React.ReactNode;
  size?: "section" | "page";
  subtitle?: string;
  breadcrumb?: React.ReactNode;
  backButton?: React.ReactNode;
  actions?: React.ReactNode;
  border?: boolean;
} & StyleType;

export function WidgetHeader({
  title,
  titleAccessory,
  size = "section",
  subtitle,
  breadcrumb,
  backButton,
  actions,
  border = true,
  className,
  style,
}: WidgetHeaderProps): React.JSX.Element {
  if (size === "page") {
    return (
      <header
        className={cn(
          "flex min-w-0 flex-col gap-2",
          border && "border-b pb-4",
          className,
        )}
        style={style}
      >
        {breadcrumb}
        <div className="flex flex-wrap items-start gap-3 @lg:items-center">
          {backButton}
          <div className="mr-auto min-w-0 basis-full @lg:min-w-48 @lg:flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h1 className="min-w-0 break-words text-2xl font-semibold leading-tight tracking-tight">
                {title}
              </h1>
              {titleAccessory}
            </div>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </header>
    );
  }
  return (
    <div
      className={cn(
        "flex items-center gap-2 pb-3",
        border && "border-b",
        className,
      )}
      style={style}
    >
      {backButton}
      <span className="font-semibold text-base mr-auto truncate">{title}</span>
      {titleAccessory}
      {actions ? (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}
WidgetHeader.displayName = "WidgetHeader";
