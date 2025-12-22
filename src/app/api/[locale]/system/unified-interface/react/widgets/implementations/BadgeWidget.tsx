"use client";

import { cn } from "next-vibe/shared/utils";
import { Badge, type BadgeVariant } from "next-vibe-ui/ui/badge";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { getTranslator } from "../../../shared/widgets/utils/field-helpers";

type SemanticVariant = "default" | "success" | "warning" | "error" | "info";

/**
 * Maps semantic widget variants to Badge component variants
 */
function mapVariant(variant: SemanticVariant): BadgeVariant {
  switch (variant) {
    case "error":
      return "destructive";
    case "info":
    case "success":
      return "secondary";
    case "warning":
      return "outline";
    case "default":
    default:
      return "default";
  }
}

/**
 * Displays a badge for enum values with translation support.
 */
export function BadgeWidget<TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.BADGE, TKey>): JSX.Element {
  const { t } = getTranslator(context);

  if (!value) {
    return (
      <Badge
        variant="outline"
        className={cn("text-muted-foreground", className)}
      >
        —
      </Badge>
    );
  }

  const { enumOptions, variant = "default" } = field.ui;
  const badgeVariant = mapVariant(variant);

  if (enumOptions) {
    for (const opt of enumOptions) {
      if (opt.value === value) {
        return (
          <Badge variant={badgeVariant} className={className}>
            {t(opt.label)}
          </Badge>
        );
      }
    }
  }

  return (
    <Badge variant={badgeVariant} className={className}>
      {String(value)}
    </Badge>
  );
}

BadgeWidget.displayName = "BadgeWidget";
