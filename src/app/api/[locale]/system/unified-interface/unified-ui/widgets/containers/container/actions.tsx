"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { useTouchDevice } from "@/hooks/use-touch-device";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { getSpacingClassName } from "../../../../shared/widgets/utils/widget-helpers";
import { MultiWidgetRenderer } from "../../../renderers/react/MultiWidgetRenderer";
import type { ReactWidgetProps } from "../../_shared/react-types";
import { hasChildren } from "../../_shared/type-guards";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import type { ContainerWidgetConfig } from "./types";

/**
 * Container Actions Widget - Positioned action buttons with touch/hover visibility
 *
 * Automatically positions children absolutely (top-right by default) and handles visibility:
 * - Touch devices: always visible
 * - Desktop: visible on parent hover (requires parent to have "group" class)
 *
 * Usage:
 * ```typescript
 * actions: objectField({
 *   type: WidgetType.CONTAINER,
 *   layoutType: LayoutType.ACTIONS,
 * }, { response: true }, {
 *   editButton: ...,
 *   deleteButton: ...,
 * })
 * ```
 */
export function ContainerActionsWidget<
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
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  ContainerWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const isTouch = useTouchDevice();

  const { gap = "1", className } = field;

  // Get gap class
  const gapClass = getSpacingClassName("gap", gap);

  // Visibility classes based on device type
  const visibilityClasses = isTouch
    ? "opacity-100"
    : "opacity-0 group-hover:opacity-100 transition-opacity";

  // Actions positioned in top-right corner of the card (relative parent)
  const positionClasses = "absolute top-1 right-1";

  // Extract children using type guard
  if (!hasChildren(field)) {
    return <></>;
  }

  const childrenForRenderer = field.children as ObjectChildrenConstraint<
    string,
    ConstrainedChildUsage<TUsage>
  >;

  // For widget-only containers, use parentValue as the data source for children
  // This allows action buttons to access the parent item data
  const valueForChildren = field.parentValue ?? field.value;

  return (
    <Div
      className={cn(
        positionClasses,
        "flex",
        gapClass,
        visibilityClasses,
        className,
      )}
    >
      <MultiWidgetRenderer
        childrenSchema={childrenForRenderer}
        value={valueForChildren}
        fieldName={fieldName}
      />
    </Div>
  );
}

ContainerActionsWidget.displayName = "ContainerActionsWidget";

export default ContainerActionsWidget;
