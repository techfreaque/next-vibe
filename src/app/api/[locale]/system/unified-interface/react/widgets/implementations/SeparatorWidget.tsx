"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Separator } from "next-vibe-ui/ui/separator";
import type { JSX } from "react";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

/**
 * Get vertical margin class (mt-* or mb-*) for separator spacing
 * Uses full string literals for Tailwind JIT compilation
 */
function getVerticalMarginClass(
  size: string | undefined,
  position: "top" | "bottom",
): string {
  if (!size) {
    return "";
  }

  if (position === "top") {
    if (size === "0") {
      return "mt-0";
    }
    if (size === "1") {
      return "mt-1";
    }
    if (size === "2") {
      return "mt-2";
    }
    if (size === "3") {
      return "mt-3";
    }
    if (size === "4") {
      return "mt-4";
    }
    if (size === "6") {
      return "mt-6";
    }
    if (size === "8") {
      return "mt-8";
    }
  } else {
    if (size === "0") {
      return "mb-0";
    }
    if (size === "1") {
      return "mb-1";
    }
    if (size === "2") {
      return "mb-2";
    }
    if (size === "3") {
      return "mb-3";
    }
    if (size === "4") {
      return "mb-4";
    }
    if (size === "6") {
      return "mb-6";
    }
    if (size === "8") {
      return "mb-8";
    }
  }

  return "";
}

/**
 * Separator Widget - Renders a horizontal line divider
 * Useful for visually separating sections of content
 */
export function SeparatorWidget<const TKey extends string>({
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.SEPARATOR, TKey>): JSX.Element {
  const { spacingTop, spacingBottom, label } = field.ui;

  // Get vertical margin classes (no hardcoding!)
  const topSpacing = getVerticalMarginClass(spacingTop, "top");
  const bottomSpacing = getVerticalMarginClass(spacingBottom, "bottom");

  const translatedLabel = label ? context.t(label) : undefined;

  if (translatedLabel) {
    return (
      <Div
        className={cn(
          "relative flex items-center",
          topSpacing,
          bottomSpacing,
          className,
        )}
      >
        <Div className="flex-grow">
          <Separator />
        </Div>
        <Div className="px-4 text-xs text-muted-foreground">
          {translatedLabel}
        </Div>
        <Div className="flex-grow">
          <Separator />
        </Div>
      </Div>
    );
  }

  return <Separator className={cn(topSpacing, bottomSpacing, className)} />;
}

SeparatorWidget.displayName = "SeparatorWidget";
