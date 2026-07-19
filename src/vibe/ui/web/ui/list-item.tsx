import { cn } from "next-vibe/unified-ui/_shared/cn";
import type * as React from "react";

import type { StyleType } from "../../web/utils/style-type";

export type ListItemProps = {
  avatar?: React.ReactNode;
  title: string;
  subtitle?: string;
  badges?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
} & StyleType;

export function ListItem({
  avatar,
  title,
  subtitle,
  badges,
  meta,
  actions,
  onClick,
  selected = false,
  className,
  style,
}: ListItemProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border p-3 transition-colors",
        onClick && "cursor-pointer hover:bg-accent/50",
        selected && "bg-accent border-accent-foreground/20",
        className,
      )}
      style={style}
      {...(onClick
        ? {
            onClick,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            },
            role: "button" as const,
            tabIndex: 0,
          }
        : {})}
    >
      {avatar ? <div className="flex-shrink-0">{avatar}</div> : null}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm truncate">{title}</span>
          {badges}
        </div>
        {subtitle ? (
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            {subtitle}
          </div>
        ) : null}
        {meta ? (
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
            {meta}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
ListItem.displayName = "ListItem";
