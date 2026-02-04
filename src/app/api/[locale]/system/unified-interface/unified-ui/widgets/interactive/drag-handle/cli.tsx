import { Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import type { DragHandleWidgetConfig } from "./types";

/**
 * Drag Handle Widget (CLI/Ink) - Terminal representation
 *
 * Drag handles are not interactive in terminal context.
 * Shows a visual indicator (::) to represent the drag handle position.
 *
 * In CLI, drag-and-drop is not available, so this is purely visual
 * to maintain layout consistency with React version.
 */
export function DragHandleWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Props unused but required for type inference
  _props: InkWidgetProps<
    TEndpoint,
    TUsage,
    DragHandleWidgetConfig<TUsage, TSchemaType>
  >,
): JSX.Element {
  return <Text dimColor>::</Text>;
}

export default DragHandleWidgetInk;
