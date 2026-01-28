/**
 * Password Strength Widget Type Definitions
 */

import type { Path } from "react-hook-form";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { SpacingSize, WidgetType } from "../../../../shared/types/enums";
import type {
  BasePrimitiveDisplayOnlyWidgetConfig,
  FieldUsageConfig,
} from "../../_shared/types";

/**
 * Password Strength Widget Configuration
 */
export interface PasswordStrengthWidgetConfig<
  TUsage extends FieldUsageConfig,
  TSchemaType extends "widget",
  TEndpoint extends CreateApiEndpointAny,
> extends BasePrimitiveDisplayOnlyWidgetConfig<TUsage, TSchemaType> {
  type: WidgetType.PASSWORD_STRENGTH;
  watchField: Path<TEndpoint["types"]["RequestOutput"]>;
  /** Container gap */
  containerGap?: SpacingSize;
  /** Label text size */
  labelTextSize?: "xs" | "sm" | "base";
  /** Bar height */
  barHeight?: "xs" | "sm" | "base" | "lg";
  /** Suggestion text size */
  suggestionTextSize?: "xs" | "sm" | "base";
  /** Suggestion margin top */
  suggestionMarginTop?: SpacingSize;
  /** Background color for weak password */
  weakBgColor?: string;
  /** Background color for fair password */
  fairBgColor?: string;
  /** Background color for good password */
  goodBgColor?: string;
  /** Background color for strong password */
  strongBgColor?: string;
  /** Text color for weak password */
  weakTextColor?: string;
  /** Text color for fair password */
  fairTextColor?: string;
  /** Text color for good password */
  goodTextColor?: string;
  /** Text color for strong password */
  strongTextColor?: string;
}
