"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Separator } from "next-vibe-ui/ui/separator";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactStaticWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { SeparatorWidgetConfig } from "./types";

/**
 * Separator Widget - Renders a horizontal line divider
 * Useful for visually separating sections of content
 */
export function SeparatorWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchemaType extends "widget",
>({
  field,
}: ReactStaticWidgetProps<
  TEndpoint,
  FieldUsageConfig,
  SeparatorWidgetConfig<TKey, FieldUsageConfig, TSchemaType>
>): JSX.Element {
  const t = useWidgetTranslation();
  const { spacingTop = "normal", spacingBottom = "normal", label } = field;

  const topSpacing =
    spacingTop === "compact"
      ? "mt-2"
      : spacingTop === "normal"
        ? "mt-4"
        : "mt-6";
  const bottomSpacing =
    spacingBottom === "compact"
      ? "mb-2"
      : spacingBottom === "normal"
        ? "mb-4"
        : "mb-6";

  const translatedLabel = label ? t(label) : undefined;

  if (translatedLabel) {
    return (
      <Div
        className={cn(
          "flex items-center gap-3",
          topSpacing,
          bottomSpacing,
          field.className,
        )}
      >
        <Separator className="flex-1" />
        <Span className="text-xs text-muted-foreground/70 uppercase tracking-wider font-medium">
          {translatedLabel}
        </Span>
        <Separator className="flex-1" />
      </Div>
    );
  }

  return (
    <Separator className={cn(topSpacing, bottomSpacing, field.className)} />
  );
}

SeparatorWidget.displayName = "SeparatorWidget";

export default SeparatorWidget;
