"use client";

import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

export type SectionGroupProps = {
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
} & StyleType;

export function SectionGroup({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultOpen = true,
  className,
  style,
}: SectionGroupProps): React.JSX.Element {
  const [open, setOpen] = React.useState(defaultOpen);

  const handleToggle = (): void => {
    if (collapsible) {
      setOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={cn("rounded-lg border bg-card flex flex-col", className)}
      style={style}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3",
          collapsible &&
            "cursor-pointer select-none hover:bg-accent/50 transition-colors",
          open && children && "border-b",
        )}
        {...(collapsible
          ? {
              onClick: handleToggle,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleToggle();
                }
              },
              role: "button" as const,
              tabIndex: 0,
            }
          : {})}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-semibold flex-1">{title}</span>
          {subtitle ? (
            typeof subtitle === "string" ? (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            ) : (
              subtitle
            )
          ) : null}
        </div>
        {collapsible ? (
          <span
            className={cn(
              "text-muted-foreground transition-transform text-xs",
              open && "rotate-180",
            )}
          >
            {"\u25BC"}
          </span>
        ) : null}
      </div>
      {(!collapsible || open) && children ? (
        <div className="p-4">{children}</div>
      ) : null}
    </div>
  );
}
SectionGroup.displayName = "SectionGroup";
