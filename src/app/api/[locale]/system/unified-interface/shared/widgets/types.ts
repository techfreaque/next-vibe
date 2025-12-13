import type React from "react";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import type { CountryLanguage } from "@/i18n/core/config";

import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { Platform } from "../types/platform";
import type { UnifiedField } from "../types/endpoint";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { ExtractWidgetConfig } from "./configs";

export type WidgetData =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | WidgetData[]
  | { [key: string]: WidgetData };

export interface WidgetInput {
  field: UnifiedField;
  value: WidgetData;
  context: WidgetRenderContext;
}

export type WidgetActionType =
  | "click"
  | "edit"
  | "delete"
  | "create"
  | "navigate"
  | "refresh"
  | "retry"
  | "cancel"
  | "submit";

export type WidgetActionPayload =
  | { type: "click"; fieldName: string; value?: string | number | boolean }
  | { type: "edit"; fieldName: string; oldValue: string; newValue: string }
  | { type: "delete"; id: string }
  | { type: "create"; data: Record<string, string | number | boolean> }
  | { type: "navigate"; url: string }
  | { type: "refresh" }
  | { type: "retry" }
  | { type: "cancel" }
  | { type: "submit"; data: Record<string, string | number | boolean> };

export interface WidgetAction {
  type: WidgetActionType;
  payload: WidgetActionPayload;
  metadata?: {
    fieldName?: string;
    fieldPath?: string;
    timestamp?: number;
  };
}

export interface WidgetRenderContext {
  locale: CountryLanguage;
  isInteractive: boolean;
  permissions: readonly UserRoleValue[];
  onNavigate?: (url: string) => void;
  onAction?: (action: WidgetAction) => void | Promise<void>;
  platform?:
    | typeof Platform.TRPC
    | typeof Platform.NEXT_PAGE
    | typeof Platform.NEXT_API
    | typeof Platform.CLI;
  theme?: "light" | "dark" | "system";
  endpointFields?: Record<string, WidgetData>; // Original endpoint fields for nested path lookup
  disabled?: boolean; // Disable all form inputs
  response?: ResponseType<WidgetData>; // Full ResponseType from endpoint (includes success/error state)
}

/**
 * Base widget component props.
 */
export interface WidgetComponentProps<TFieldValues extends FieldValues = FieldValues> {
  field: UnifiedField;
  fieldName?: string;
  value: WidgetData;
  context: WidgetRenderContext;
  onAction?: (action: WidgetAction) => void | Promise<void>;
  className?: string;
  form?: UseFormReturn<TFieldValues>;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

/**
 * Field type with narrowed widget config based on WidgetType discriminator.
 */
export type NarrowedField<T extends WidgetType> = UnifiedField & {
  ui: ExtractWidgetConfig<T>;
};

// ============================================================================
// DISCRIMINATED UNION TYPES FOR TYPE-SAFE WIDGET PROPS
// ============================================================================

/**
 * Base widget props shared across all platforms.
 * The `widgetType` field acts as the discriminator for the union.
 */
export interface BaseWidgetProps<T extends WidgetType> {
  widgetType: T;
  field: NarrowedField<T>;
  value: WidgetData;
}

/**
 * Maps each WidgetType to its base props.
 * Used to create discriminated unions that TypeScript can narrow automatically.
 */
export type WidgetPropsMap = {
  [T in WidgetType]: BaseWidgetProps<T>;
};

/**
 * Union of all widget props - TypeScript narrows this in switch statements.
 */
export type WidgetPropsUnion = WidgetPropsMap[WidgetType];

/**
 * React-specific widget props. Extends base props with React context and form handling.
 */
export interface ReactWidgetProps<
  T extends WidgetType,
  TFieldValues extends FieldValues = FieldValues,
> extends BaseWidgetProps<T> {
  context: WidgetRenderContext;
  fieldName?: string;
  onAction?: (action: WidgetAction) => void | Promise<void>;
  className?: string;
  form?: UseFormReturn<TFieldValues>;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

/**
 * Maps each WidgetType to React-specific props.
 */
export type ReactWidgetPropsMap<TFieldValues extends FieldValues = FieldValues> = {
  [T in WidgetType]: ReactWidgetProps<T, TFieldValues>;
};

/**
 * Union of all React widget props.
 */
export type ReactWidgetPropsUnion<TFieldValues extends FieldValues = FieldValues> =
  ReactWidgetPropsMap<TFieldValues>[WidgetType];

export type WidgetRenderer<TFieldValues extends FieldValues = FieldValues> = (
  props: WidgetComponentProps<TFieldValues>,
) => React.ReactElement | string | null;

export interface WidgetRegistryEntry<TFieldValues extends FieldValues = FieldValues> {
  type: WidgetType;
  component:
    | React.ComponentType<WidgetComponentProps<TFieldValues>>
    | WidgetRenderer<TFieldValues>;
  platforms?: Array<
    | typeof Platform.TRPC
    | typeof Platform.NEXT_PAGE
    | typeof Platform.NEXT_API
    | typeof Platform.CLI
  >;
  supportsEditing?: boolean;
  supportsCRUD?: boolean;
}

export interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  locale: CountryLanguage;
  fallback?: React.ReactElement;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface WidgetLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export interface WidgetEmptyStateProps {
  message: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
