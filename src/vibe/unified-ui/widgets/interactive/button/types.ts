/**
 * Button Widget Type Definitions
 */

import type { CreateApiEndpointAny } from "../../../../core/definition/endpoint-base";
import type {
  SpacingSize,
  WidgetType,
} from "../../../../core/definition/enums";
import type { ReactWidgetContext } from "../../../_shared/react-types";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "../../../_shared/types";
import type { IconKey } from "../../form-fields/icon-field/icons";

/**
 * Button Widget Configuration
 */
export interface ButtonWidgetConfig<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.BUTTON;
  text?: NoInfer<TKey>;
  icon?: IconKey;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: (
    // oxlint-disable-next-line typescript/no-explicit-any
    item: any,
    context: ReactWidgetContext<CreateApiEndpointAny>,
  ) => void | Promise<void>;
  /** Function to determine if button should be hidden */
  hidden?:
    | boolean
    | ((
        // oxlint-disable-next-line typescript/no-explicit-any
        item: any,
      ) => boolean);
  /** Icon size */
  iconSize?: "xs" | "sm" | "base" | "lg";
  /** Spacing to the right of icon */
  iconSpacing?: SpacingSize;
}
