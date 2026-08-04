import type * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";

export type ActionCardProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  variant?: "default" | "primary";
} & StyleType;

export function ActionCard({
  icon,
  title,
  description,
  onClick,
  variant = "default",
  className,
  style,
}: ActionCardProps): React.JSX.Element {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors min-w-0",
        onClick && "cursor-pointer hover:bg-accent/50 active:bg-accent",
        variant === "primary" &&
          "border-primary/20 bg-primary/5 hover:bg-primary/10",
        className,
      )}
      style={style}
    >
      {icon ? (
        <div
          className={cn(
            "mt-0.5 flex-shrink-0",
            variant === "primary" ? "text-primary" : "text-muted-foreground",
          )}
        >
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium truncate">{title}</span>
        {description ? (
          <span className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </span>
        ) : null}
      </div>
    </Tag>
  );
}
ActionCard.displayName = "ActionCard";
