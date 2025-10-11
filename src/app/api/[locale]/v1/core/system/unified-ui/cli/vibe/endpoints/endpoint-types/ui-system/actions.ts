/**
 * Action System for Definition-Driven UI
 *
 * This system allows defining actions directly on fields and widgets,
 * providing a declarative way to handle user interactions across all interface contexts.
 */

import type { Route } from "next";

import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  ActionType,
  ComponentVariant,
  InterfaceContext,
} from "../core/enums";

/**
 * Action execution timing
 */
export enum ActionTiming {
  IMMEDIATE = "immediate",
  DEBOUNCED = "debounced",
  THROTTLED = "throttled",
  DELAYED = "delayed",
}

/**
 * Action execution priority
 */
export enum ActionPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

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
  priority?: ActionPriority;
  delay?: number;
  dependencies?: string[];
  conditions?: ActionCondition[];
  contexts?: InterfaceContext[]; // Which contexts this action applies to
}

/**
 * Toast/Notification action configuration
 */
export interface ToastActionConfig extends BaseActionConfig {
  type: ActionType.TOAST | ActionType.NOTIFICATION | ActionType.ALERT;
  message: TranslationKey;
  variant?: ComponentVariant;
  duration?: number;
  title?: TranslationKey;
  description?: TranslationKey;
  action?: {
    label: TranslationKey;
    onClick: () => void;
  };
}

/**
 * Navigation action configuration
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
 * Data/Cache action configuration
 */
export interface RefetchActionConfig extends BaseActionConfig {
  type:
    | ActionType.REFETCH
    | ActionType.INVALIDATE_CACHE
    | ActionType.UPDATE_CACHE
    | ActionType.CLEAR_CACHE;
  queryKeys?: string[][];
  exact?: boolean;
  predicate?: (query: Record<string, string | number | boolean>) => boolean;
  data?: Record<string, string | number | boolean>;
}

/**
 * Form action configuration
 */
export interface FormActionConfig extends BaseActionConfig {
  type:
    | ActionType.RESET_FORM
    | ActionType.CLEAR_FORM
    | ActionType.SET_FORM_VALUES
    | ActionType.FOCUS_FIELD;
  formId?: string;
  values?:
    | Record<string, string | number | boolean>
    | ((context: ActionContext) => Record<string, string | number | boolean>);
  fieldName?: string;
  resetToDefaults?: boolean;
}

/**
 * State action configuration
 */
export interface StateActionConfig extends BaseActionConfig {
  type:
    | ActionType.SET_STATE
    | ActionType.TOGGLE_STATE
    | ActionType.UPDATE_STATE;
  key: string;
  value?: string | number | boolean;
  updater?: (current: string | number | boolean) => string | number | boolean;
}

/**
 * Custom action configuration
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
 * Lifecycle actions for endpoints and widgets
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
 * Interactive actions for buttons and clickable elements
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
 * Action execution context
 */
export interface ActionContext {
  context: InterfaceContext;
  data?: Record<string, string | number | boolean>;
  error?: Error;
  endpoint?: Record<string, string | number | boolean>;
  timestamp: string;
  user?: {
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
 * Action executor interface
 */
export interface ActionExecutor {
  context: InterfaceContext;
  canExecute(action: ActionConfig, context: ActionContext): boolean;
  execute(action: ActionConfig, context: ActionContext): Promise<ActionResult>;
}

/**
 * Action chain configuration for complex workflows
 */
export interface ActionChain {
  actions: ActionConfig[];
  parallel?: boolean;
  stopOnError?: boolean;
  timeout?: number;
}

/**
 * Action preset for common patterns
 */
export interface ActionPreset {
  name: string;
  description: TranslationKey;
  actions: ActionConfig[];
  contexts?: InterfaceContext[];
}

/**
 * Button action configuration for UI elements
 */
export interface ButtonAction {
  label: TranslationKey;
  icon?: string;
  variant?: ComponentVariant;
  size?: "sm" | "md" | "lg";
  actions: ActionConfig[];
  conditions?: ActionCondition[];
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Context menu action configuration
 */
export interface ContextMenuAction {
  label: TranslationKey;
  icon?: string;
  actions: ActionConfig[];
  separator?: boolean;
  disabled?: boolean;
  dangerous?: boolean;
}

/**
 * Bulk action configuration for data tables
 */
export interface BulkAction {
  label: TranslationKey;
  icon?: string;
  variant?: ComponentVariant;
  actions: ActionConfig[];
  confirmationMessage?: TranslationKey;
  requiresSelection?: boolean;
  maxSelection?: number;
}
