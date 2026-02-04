/**
 * Drag Handle Widget - React implementation
 * Renders a drag handle that uses DragHandleContext
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { ReactWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/react-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useDragHandle } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/containers/data-cards/react";
import {
  Icon,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { DragHandleWidgetConfig } from "./types";

/**
 * Drag Handle Widget - React component
 */
export function DragHandleWidget<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
>({
  field,
}: ReactWidgetProps<
  TEndpoint,
  TUsage,
  DragHandleWidgetConfig<TUsage, TSchemaType>
>): JSX.Element {
  const dragHandle = useDragHandle();
  const { icon = "grip-vertical", className: fieldClassName } = field;

  // If no drag context, don't render anything
  if (!dragHandle) {
    return <></>;
  }

  return (
    <Div
      {...dragHandle.attributes}
      {...dragHandle.listeners}
      className={cn(
        "cursor-grab active:cursor-grabbing inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
        fieldClassName,
      )}
    >
      <Icon icon={icon as IconKey} className="h-4 w-4" />
    </Div>
  );
}

export default DragHandleWidget;
