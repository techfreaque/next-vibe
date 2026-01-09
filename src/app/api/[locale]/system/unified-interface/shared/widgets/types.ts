import type React from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import type { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TParams } from "@/i18n/core/static-types";

import type { UseNavigationStackReturn } from "../../react/hooks/use-navigation-stack";
import type { IconKey } from "../../react/icons";
import type {
  CancelButtonConfig,
  SubmitButtonConfig,
} from "../../react/widgets/renderers/EndpointRenderer";
import type { EndpointLogger } from "../logger/endpoint";
import type { CreateApiEndpointAny, UnifiedField } from "../types/endpoint";
import type { Platform } from "../types/platform";
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

export interface WidgetInput<TKey extends string> {
  field: UnifiedField<TKey>;
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
  logger: EndpointLogger;

  onNavigate?: (url: string) => void;

  platform?:
    | typeof Platform.TRPC
    | typeof Platform.NEXT_PAGE
    | typeof Platform.NEXT_API
    | typeof Platform.CLI
    | typeof Platform.CLI_PACKAGE;
  theme?: "light" | "dark" | "system";
  endpointFields?: Record<string, WidgetData>; // Original endpoint fields for nested path lookup
  disabled?: boolean; // Disable all form inputs
  response?: ResponseType<WidgetData>; // Full ResponseType from endpoint (includes success/error state)
  /**
   * Navigation context for cross-definition navigation
   * Provides type-safe navigation methods (push/pop) for endpoint navigation
   */
  navigation?: UseNavigationStackReturn;
  /**
   * Translation function for widgets to use directly
   * This is the scoped translation from the endpoint definition
   * Automatically falls back to global translation if no scoped translation is defined
   * Widgets should ALWAYS use context.t for all translations
   */
  t: <K extends string>(key: K, params?: TParams) => string;
  /**
   * Endpoint mutations available for widgets to trigger directly
   * Widgets can call these methods to perform CRUD operations
   * This enables definition-driven interactions without custom handlers
   */
  endpointMutations?: {
    create?: {
      submit: (data: Record<string, WidgetData>) => Promise<void>;
      isSubmitting?: boolean;
    };
    update?: {
      submit: (data: Record<string, WidgetData>) => Promise<void>;
      isSubmitting?: boolean;
    };
    delete?: {
      submit: (data: Record<string, WidgetData>) => Promise<void>;
      isSubmitting?: boolean;
    };
    read?: {
      refetch: () => Promise<void>;
      isLoading?: boolean;
    };
  };
}

/**
 * Base widget component props.
 */
export interface WidgetComponentProps<
  TKey extends string,
  TFieldValues extends FieldValues = FieldValues,
> {
  field: UnifiedField<TKey>;
  fieldName?: string;
  value: WidgetData;
  context: WidgetRenderContext;
  className?: string;
  form?: UseFormReturn<TFieldValues>;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

/**
 * Field type with narrowed widget config based on WidgetType discriminator.
 */
export type NarrowedField<TKey extends string, T extends WidgetType> = UnifiedField<TKey> & {
  ui: ExtractWidgetConfig<T, TKey>;
};

// ============================================================================
// DISCRIMINATED UNION TYPES FOR TYPE-SAFE WIDGET PROPS
// ============================================================================

/**
 * Base widget props shared across all platforms.
 * The `widgetType` field acts as the discriminator for the union.
 */
export interface BaseWidgetProps<TKey extends string, T extends WidgetType> {
  widgetType: T;
  field: NarrowedField<TKey, T>;
  value: WidgetData;
}

/**
 * Maps each WidgetType to its base props.
 * Used to create discriminated unions that TypeScript can narrow automatically.
 */
export type WidgetPropsMap<TKey extends string> = {
  [T in WidgetType]: BaseWidgetProps<TKey, T>;
};

/**
 * Union of all widget props - TypeScript narrows this in switch statements.
 */
export type WidgetPropsUnion<TKey extends string> = WidgetPropsMap<TKey>[WidgetType];

/**
 * React-specific widget props. Extends base props with React context and form handling.
 */
export interface ReactWidgetProps<
  T extends WidgetType,
  TKey extends string,
  TFieldValues extends FieldValues = FieldValues,
> extends BaseWidgetProps<TKey, T> {
  context: WidgetRenderContext;
  fieldName?: string;
  onAction?: (action: WidgetAction) => void | Promise<void>;
  className?: string;
  form?: UseFormReturn<TFieldValues>;
  onSubmit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  endpoint: CreateApiEndpointAny;
  submitButton?: SubmitButtonConfig;
  cancelButton?: CancelButtonConfig;
}

/**
 * Value-only React widget props for widgets that don't need field definition.
 * Use this for leaf widgets that only consume value/context (e.g., MetricCardWidget).
 */
export interface ValueOnlyReactWidgetProps<T extends WidgetType> {
  widgetType: T;
  value: WidgetData;
  context: WidgetRenderContext;
  className?: string;
}

/**
 * Maps each WidgetType to React-specific props.
 */
export type ReactWidgetPropsMap<
  TKey extends string,
  TFieldValues extends FieldValues = FieldValues,
> = {
  [T in WidgetType]: ReactWidgetProps<T, TKey, TFieldValues>;
};

/**
 * Union of all React widget props.
 */
export type ReactWidgetPropsUnion<
  TKey extends string,
  TFieldValues extends FieldValues = FieldValues,
> = ReactWidgetPropsMap<TKey, TFieldValues>[WidgetType];

export type WidgetRenderer<TKey extends string, TFieldValues extends FieldValues = FieldValues> = (
  props: WidgetComponentProps<TKey, TFieldValues>,
) => React.ReactElement | string | null;

export interface WidgetRegistryEntry<
  TKey extends string,
  TFieldValues extends FieldValues = FieldValues,
> {
  type: WidgetType;
  component:
    | React.ComponentType<WidgetComponentProps<TKey, TFieldValues>>
    | WidgetRenderer<TKey, TFieldValues>;
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
  icon?: IconKey;
  action?: {
    label: string;
    onClick: () => void;
  };
}
