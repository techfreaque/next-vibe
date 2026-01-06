/**
 * Action and Field Configuration Types
 *
 * This file contains action configurations, field behaviors, and related types.
 * For widget configurations, import from widget-configs.ts.
 */

import type { Route } from "next";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { IconKey } from "../../react/icons";
// Import types from core enums
import type {
  ActionTiming,
  ActionType,
  ComponentSize,
  ComponentVariant,
  InterfaceContext,
} from "../types/enums";

// ============================================================================
// FIELD USAGE TYPES
// ============================================================================

/**
 * Field usage configuration
 */
export type FieldUsageConfig =
  | {
      request: "data" | "urlPathParams" | "data&urlPathParams";
      response?: never;
    }
  | { request?: never; response: true }
  | {
      request: "data" | "urlPathParams" | "data&urlPathParams";
      response: true;
    };

/**
 * Action condition for conditional execution
 */
export interface ActionCondition {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "exists"
    | "not_exists"
    | "greater_than"
    | "less_than";
  value?: string | number | boolean;
}

/**
 * Base action configuration
 */
export interface BaseActionConfig {
  type: ActionType;
  timing?: ActionTiming;
  delay?: number;
  conditions?: ActionCondition[];
  contexts?: InterfaceContext[];
}

/**
 * Toast/Notification action
 */
export interface ToastActionConfig extends BaseActionConfig {
  type: ActionType.TOAST | ActionType.NOTIFICATION | ActionType.ALERT;
  message: TranslationKey;
  variant?: ComponentVariant;
  duration?: number;
  title?: TranslationKey;
  description?: TranslationKey;
}

/**
 * Navigation action
 */
export interface NavigationActionConfig extends BaseActionConfig {
  type:
    | ActionType.ROUTER_PUSH
    | ActionType.ROUTER_REPLACE
    | ActionType.ROUTER_BACK
    | ActionType.REDIRECT;
  path?: string;
  route?: Route;
  params?: Record<string, string>;
  query?: Record<string, string>;
  replace?: boolean;
  external?: boolean;
}

/**
 * Data/Cache action
 */
export interface RefetchActionConfig extends BaseActionConfig {
  type:
    | ActionType.REFETCH
    | ActionType.INVALIDATE_CACHE
    | ActionType.UPDATE_CACHE
    | ActionType.CLEAR_CACHE;
  queryKeys?: string[][];
  exact?: boolean;
  data?: Record<string, string | number | boolean>;
}

/**
 * Form action
 */
export interface FormActionConfig extends BaseActionConfig {
  type:
    | ActionType.RESET_FORM
    | ActionType.CLEAR_FORM
    | ActionType.SET_FORM_VALUES
    | ActionType.FOCUS_FIELD;
  formId?: string;
  values?: Record<string, string | number | boolean>;
  fieldName?: string;
  resetToDefaults?: boolean;
}

/**
 * State action
 */
export interface StateActionConfig extends BaseActionConfig {
  type: ActionType.SET_STATE | ActionType.TOGGLE_STATE | ActionType.UPDATE_STATE;
  key: string;
  value?: string | number | boolean;
  updater?: (current: string | number | boolean) => string | number | boolean;
}

/**
 * Custom action
 */
export interface CustomActionConfig extends BaseActionConfig {
  type: ActionType.CUSTOM;
  handler: string | ((context: ActionContext) => Promise<ActionResult>);
  payload?: Record<string, string | number | boolean>;
}

/**
 * Union type for all action configurations
 */
export type ActionConfig =
  | ToastActionConfig
  | NavigationActionConfig
  | RefetchActionConfig
  | FormActionConfig
  | StateActionConfig
  | CustomActionConfig;

/**
 * Action execution context
 */
export interface ActionContext {
  context: InterfaceContext;
  data?: Record<string, string | number | boolean>;
  error?: Error;
  endpoint?: Record<string, string | number | boolean>;
  timestamp: string;
  user: {
    id: string;
    roles: string[];
  };
  metadata?: Record<string, string | number | boolean>;
  formValues?: Record<string, string | number | boolean>;
  fieldValue?: string | number | boolean;
}

/**
 * Action execution result
 */
export interface ActionResult {
  success: boolean;
  data?: Record<string, string | number | boolean>;
  error?: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Lifecycle actions
 */
export interface LifecycleActions {
  onSuccess?: ActionConfig[];
  onError?: ActionConfig[];
  onLoading?: ActionConfig[];
  onComplete?: ActionConfig[];
  onMount?: ActionConfig[];
  onUnmount?: ActionConfig[];
}

/**
 * Interactive actions
 */
export interface InteractiveActions {
  onClick?: ActionConfig[];
  onDoubleClick?: ActionConfig[];
  onHover?: ActionConfig[];
  onFocus?: ActionConfig[];
  onBlur?: ActionConfig[];
}

/**
 * Form field actions
 */
export interface FieldActions {
  onChange?: ActionConfig[];
  onValidation?: ActionConfig[];
  onError?: ActionConfig[];
  onClear?: ActionConfig[];
}

/**
 * Button action configuration
 */
export interface ButtonAction {
  label: TranslationKey;
  icon?: IconKey;
  variant?: ComponentVariant;
  size?: ComponentSize;
  actions: ActionConfig[];
  conditions?: ActionCondition[];
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Context menu action
 */
export interface ContextMenuAction {
  label: TranslationKey;
  icon?: IconKey;
  actions: ActionConfig[];
  separator?: boolean;
  disabled?: boolean;
  dangerous?: boolean;
}

/**
 * Bulk action for data tables
 */
export interface BulkAction {
  label: TranslationKey;
  icon?: IconKey;
  variant?: ComponentVariant;
  actions: ActionConfig[];
  confirmationMessage?: TranslationKey;
  requiresSelection?: boolean;
  maxSelection?: number;
}
