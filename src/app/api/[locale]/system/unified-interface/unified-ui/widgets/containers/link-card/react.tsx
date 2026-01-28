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
import type { z } from "zod";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import { isExternalUrl } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/widget-helpers";
import { WidgetRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/WidgetRenderer";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { simpleT } from "@/i18n/core/shared";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
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
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends Record<
    string,
    UnifiedField<string, z.ZodTypeAny, FieldUsageConfig, any> // oxlint-disable-line typescript/no-explicit-any
  >,
>({
  field,
  context,
}: ReactWidgetProps<
  TEndpoint,
  LinkCardWidgetConfig<TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const {
    linkKey,
    openInNewTab = true,
    className,
    border = true,
    hover = true,
    variant = "default",
  } = field;

  // Extract URL from the specified linkKey (supports dot notation)
  const url = linkKey.split(".").reduce((obj, key) => obj?.[key], field.value);

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
          {simpleT(context.locale).t("system.ui.widgets.linkCard.noLink")}
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
        !context.isInteractive && "opacity-75",
        className,
      )}
    >
      <Link
        href={url}
        target={openInNewTab ? "_blank" : undefined}
        rel={isExternal && openInNewTab ? "noopener noreferrer" : undefined}
        className={cn(
          "block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg",
          !context.isInteractive && "pointer-events-none",
        )}
      >
        <WidgetRenderer
          fields={field.children}
          values={value}
          context={context}
        />
      </Link>
    </Card>
  );
}

LinkCardWidget.displayName = "LinkCardWidget";

export default LinkCardWidget;
