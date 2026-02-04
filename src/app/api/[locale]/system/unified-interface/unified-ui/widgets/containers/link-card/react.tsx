"use client";

/**
 * Link Card Widget - React Implementation
 * Displays a clickable card with children fields rendered inside
 */

import { cn } from "next-vibe/shared/utils";
import { Card } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import type { JSX } from "react";

import { isExternalUrl } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/widget-helpers";
import { MultiWidgetRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/MultiWidgetRenderer";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { simpleT } from "@/i18n/core/shared";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import type { LinkCardWidgetConfig } from "./types";

/**
 * Link Card Widget - React Component
 *
 * Displays a clickable card with children fields rendered inside.
 * The linkKey prop specifies which child field contains the URL.
 *
 * Features:
 * - Typesafe linkKey with dot notation support for nested fields
 * - Entire card is clickable and wraps children in a Link component
 * - External link detection with security attributes
 * - Configurable styling via props
 * - Opens in new tab by default (configurable)
 *
 * @param value - Object data containing child field values
 * @param field - Field definition with linkKey and styling configuration
 * @param context - Rendering context with locale and translator
 */
export function LinkCardWidget<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  LinkCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const locale = useWidgetLocale();
  const isInteractive = useWidgetIsInteractive();
  const {
    linkKey,
    openInNewTab = true,
    className,
    border = true,
    hover = true,
    variant = "default",
  } = field;

  // Extract URL from the specified linkKey (supports dot notation)
  // Extract URL from field.value using linkKey path
  let url: WidgetData = undefined;
  if (field.value && typeof field.value === "object") {
    const keys = linkKey.split(".");
    let current: WidgetData = field.value;
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = (current as Record<string, WidgetData>)[key];
      } else {
        current = undefined;
        break;
      }
    }
    url = current;
  }

  if (!url || typeof url !== "string") {
    return (
      <Card
        className={cn(
          "overflow-hidden",
          variant === "outline" && "border",
          variant === "ghost" && "border-0 shadow-none",
          className,
        )}
      >
        <Div className="p-4 text-muted-foreground italic">
          {simpleT(locale).t("system.ui.widgets.linkCard.noLink")}
        </Div>
      </Card>
    );
  }

  const isExternal = isExternalUrl(url);

  return (
    <Card
      className={cn(
        "overflow-hidden",
        hover && "transition-all hover:shadow-md",
        variant === "outline" && "border",
        variant === "ghost" && "border-0 shadow-none",
        !border && "border-0",
        !isInteractive && "opacity-75",
        className,
      )}
    >
      <Link
        href={url}
        target={openInNewTab ? "_blank" : undefined}
        rel={isExternal && openInNewTab ? "noopener noreferrer" : undefined}
        className={cn(
          "block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg",
          !isInteractive && "pointer-events-none",
        )}
      >
        <MultiWidgetRenderer
          childrenSchema={field.children}
          value={field.value}
          fieldName={undefined}
        />
      </Link>
    </Card>
  );
}

LinkCardWidget.displayName = "LinkCardWidget";

export default LinkCardWidget;
