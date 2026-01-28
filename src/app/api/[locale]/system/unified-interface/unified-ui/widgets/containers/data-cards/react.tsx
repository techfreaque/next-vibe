"use client";

import { cn } from "next-vibe/shared/utils";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { WidgetRenderer } from "../../../renderers/react/WidgetRenderer";
import type { ReactWidgetProps } from "../../_shared/react-types";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import type { DataCardsWidgetConfig } from "./types";

/**
 * Map gap size to Tailwind classes
 */
function getGapClass(gap: string | undefined): string {
  switch (gap) {
    case "xs":
      return "gap-1";
    case "sm":
      return "gap-2";
    case "base":
      return "gap-4";
    case "lg":
      return "gap-6";
    case "xl":
      return "gap-8";
    case "2xl":
      return "gap-10";
    case "3xl":
      return "gap-12";
    default:
      return "gap-4";
  }
}

/**
 * Data Cards Widget - Displays data in card grid layout
 * Supports both array and object data structures
 */
export const DataCardsWidget = <
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional" | "object" | "object-optional",
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
  TItemData,
>({
  field,
  context,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  DataCardsWidgetConfig<TKey, TUsage, TSchemaType, TChildOrChildren, TItemData>
>): JSX.Element => {
  const { t } = simpleT(context.locale);
  const className = field.className || "";

  // Default layout: 3 columns grid
  const columns = field.columns ?? 3;

  const gridClass = cn(
    "grid",
    {
      "grid-cols-1": columns === 1,
      "grid-cols-2": columns === 2,
      "grid-cols-3": columns === 3,
      "grid-cols-4": columns === 4,
    },
    getGapClass(field.gap),
    className,
  );

  // Handle array data
  if ("child" in field) {
    if (field.value.length === 0) {
      return (
        <Div className={className}>
          <Div className="text-muted-foreground">{t("app.common.noData")}</Div>
        </Div>
      );
    }

    return (
      <Div className={gridClass}>
        {field.value.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <WidgetRenderer
                fieldName={fieldName ? `${fieldName}[${index}]` : `[${index}]`}
                field={{ ...field.child, value: item }}
                context={context}
              />
            </CardContent>
          </Card>
        ))}
      </Div>
    );
  }

  // Handle object data
  if ("children" in field) {
    const childEntries = Object.entries(field.children);

    if (childEntries.length === 0) {
      return (
        <Div className={className}>
          <Div className="text-muted-foreground">{t("app.common.noData")}</Div>
        </Div>
      );
    }

    return (
      <Div className={gridClass}>
        {childEntries.map(([childName, childField]) => (
          <Card key={childName}>
            <CardContent className="p-4">
              <WidgetRenderer
                fieldName={fieldName ? `${fieldName}.${childName}` : childName}
                field={{
                  ...childField,
                  value: field.value[childName.value],
                }}
                context={context}
              />
            </CardContent>
          </Card>
        ))}
      </Div>
    );
  }

  // No data
  return (
    <Div className={className}>
      <Div className="text-muted-foreground">{t("app.common.noData")}</Div>
    </Div>
  );
};

DataCardsWidget.displayName = "DataCardsWidget";

export default DataCardsWidget;
