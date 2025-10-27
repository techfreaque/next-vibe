/**
 * Comprehensive Endpoint Types System
 *
 * This is the complete, production-ready endpoint types system that provides:
 * - Type-safe field definitions with schema inference
 * - Widget-based UI configuration for all interface contexts
 * - Action system for interactive behaviors
 * - Complete type inference from Zod schemas
 * - Support for all interface contexts (Web UI, CLI, AI Tools, etc.)
 */

import type { Route } from "next";

import type {
  ActionBarWidgetConfig,
  AvatarWidgetConfig,
  BadgeWidgetConfig,
  ButtonGroupWidgetConfig,
  DataListWidgetConfig,
  FormGroupWidgetConfig,
  FormSectionWidgetConfig,
} from "@/app/api/[locale]/v1/core/system/unified-ui/shared/types";
import type { TranslationKey } from "@/i18n/core/static-types";

// Import types from core enums
import type {
  ActionTiming,
  ActionType,
  ChartType,
  ComponentSize,
  ComponentVariant,
  FieldDataType,
  InterfaceContext,
  LayoutType,
  SpacingSize,
  TextAlign,
  WidgetType,
} from "./enums";

// Import all enums from the consolidated core enums file
export {
  ActionTiming,
  ActionType,
  CacheStrategy,
  CardLayout,
  ChartType,
  ComponentSize,
  ComponentVariant,
  EndpointErrorTypes,
  FieldDataType,
  FieldUsage,
  InterfaceContext,
  LayoutType,
  Methods,
  SpacingSize,
  TableDensity,
  TextAlign,
  ValidationMode,
  WidgetType,
} from "./enums";

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
  type:
    | ActionType.SET_STATE
    | ActionType.TOGGLE_STATE
    | ActionType.UPDATE_STATE;
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
  icon?: string;
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
  icon?: string;
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
  icon?: string;
  variant?: ComponentVariant;
  actions: ActionConfig[];
  confirmationMessage?: TranslationKey;
  requiresSelection?: boolean;
  maxSelection?: number;
}

// ============================================================================
// WIDGET SYSTEM
// ============================================================================

/**
 * Forward declaration for WidgetConfig to resolve circular references
 * The actual union type is defined at the end of this file
 */
export type WidgetConfig =
  | FormFieldWidgetConfig
  | FormGroupWidgetConfig
  | FormSectionWidgetConfig
  | DataTableWidgetConfig
  | DataCardsWidgetConfig
  | DataListWidgetConfig
  | GroupedListWidgetConfig
  | MetricCardWidgetConfig
  | StatsGridWidgetConfig
  | ChartWidgetConfig
  | ContainerWidgetConfig
  | SectionWidgetConfig
  | ButtonWidgetConfig
  | TitleWidgetConfig
  | BadgeWidgetConfig
  | AvatarWidgetConfig
  | ButtonGroupWidgetConfig
  | ActionBarWidgetConfig
  | TextWidgetConfig
  | LinkWidgetConfig
  | LinkCardWidgetConfig
  | LinkListWidgetConfig
  | MarkdownWidgetConfig;

/**
 * Layout configuration
 */
export interface LayoutConfig {
  type: LayoutType;
  columns?: number;
  rows?: number;
  gap?: SpacingSize;
  padding?: SpacingSize;
  margin?: SpacingSize;
  responsive?: {
    sm?: Partial<LayoutConfig>;
    md?: Partial<LayoutConfig>;
    lg?: Partial<LayoutConfig>;
    xl?: Partial<LayoutConfig>;
  };
}

/**
 * Base widget configuration
 */
export interface BaseWidgetConfig {
  type: WidgetType;
  className?: string;
  style?: Record<string, string>;
  contexts?: InterfaceContext[];
  visible?: boolean;
  disabled?: boolean;
  lifecycle?: LifecycleActions;
}

/**
 * Form field widget with conditional constraints based on field type
 */
/**
 * Field validation configuration for data-driven UI
 */
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  minItems?: number;
  maxItems?: number;
  custom?: string; // Custom validation function name
}

/**
 * Field layout configuration for data-driven UI
 */
export interface FieldLayout {
  columns?: number; // Grid columns (1-12)
  order?: number; // Display order
  group?: string; // Field grouping
  inline?: boolean; // Inline display
  hidden?: boolean; // Conditional visibility
}

/**
 * Field behavior configuration for data-driven UI
 */
export interface FieldBehavior {
  searchable?: boolean; // For SELECT/MULTISELECT
  clearable?: boolean; // Can be cleared
  disabled?: boolean; // Disabled state
  readonly?: boolean; // Read-only state
  autoFocus?: boolean; // Auto focus on load
  debounce?: number; // Input debounce ms
}

export type FormFieldWidgetConfig<
  T extends Record<string, TranslationKey> = Record<string, TranslationKey>,
> = BaseWidgetConfig & {
  type: WidgetType.FORM_FIELD;
  label: TranslationKey;
  placeholder?: TranslationKey;
  description?: TranslationKey;
  helpText?: TranslationKey; // For tooltips/help
  required?: boolean;
  defaultValue?: string | number | boolean;
  actions?: FieldActions;
  size?: ComponentSize;
  variant?: ComponentVariant;

  // Enhanced metadata for data-driven UI
  validation?: FieldValidation;
  layout?: FieldLayout;
  behavior?: FieldBehavior;
} & ( // SELECT, MULTISELECT and specialized select fields require options
    | {
        fieldType:
          | FieldDataType.SELECT
          | FieldDataType.MULTISELECT
          | FieldDataType.CURRENCY_SELECT
          | FieldDataType.LANGUAGE_SELECT
          | FieldDataType.COUNTRY_SELECT
          | FieldDataType.TIMEZONE;

        options: readonly {
          readonly value: keyof T | T[keyof T];
          readonly label: string; // Allow any string for specialized fields
          readonly disabled?: boolean;
          readonly symbol?: string; // For currency fields
        }[];
      }
    // All other field types cannot have options
    | {
        fieldType: Exclude<
          FieldDataType,
          | FieldDataType.SELECT
          | FieldDataType.MULTISELECT
          | FieldDataType.CURRENCY_SELECT
          | FieldDataType.LANGUAGE_SELECT
          | FieldDataType.COUNTRY_SELECT
          | FieldDataType.TIMEZONE
        >;
        options?: never;
      }
  );

/**
 * Data table widget
 */
export interface DataTableWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.DATA_TABLE;
  columns: Array<{
    key: string;
    label: TranslationKey;
    type: FieldDataType;
    sortable?: boolean;
    filterable?: boolean;
    width?: string | number;
    align?: TextAlign;
    render?: string;
  }>;
  pagination?: {
    enabled: boolean;
    pageSize?: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
  };
  selection?: {
    enabled: boolean;
    multiple?: boolean;
    preserveSelection?: boolean;
  };
  sorting?: {
    enabled: boolean;
    multiple?: boolean;
    defaultSort?: Array<{
      key: string;
      direction: "asc" | "desc";
    }>;
  };
  filtering?: {
    enabled: boolean;
    global?: boolean;
    columnFilters?: boolean;
  };
  actions?: {
    row?: ContextMenuAction[];
    bulk?: BulkAction[];
    toolbar?: ButtonAction[];
  };
  emptyState?: {
    title: TranslationKey;
    description?: TranslationKey;
    action?: ButtonAction;
  };
}

/**
 * Data cards widget
 */
export interface DataCardsWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.DATA_CARDS;
  layout?: "grid" | "list";
  columns?: number;
  spacing?: SpacingSize;
  cardConfig?: {
    title?: string;
    subtitle?: string;
    image?: string;
    content?: string[];
    actions?: ButtonAction[];
    metadata?: string[];
  };
  actions?: {
    card?: ContextMenuAction[];
    bulk?: BulkAction[];
    toolbar?: ButtonAction[];
  };
  emptyState?: {
    title: TranslationKey;
    description?: TranslationKey;
    action?: ButtonAction;
  };
}

/**
 * Metric card widget
 */
export interface MetricCardWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.METRIC_CARD;
  title: TranslationKey;
  value: string;
  format?: "number" | "currency" | "percentage";
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    format?: "number" | "percentage";
  };
  icon?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  actions?: InteractiveActions;
}

/**
 * Chart widget
 */
export interface ChartWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CHART;
  chartType: ChartType;
  title: TranslationKey;
  data: {
    x: string;
    y: string | string[];
    series?: string;
  };
  options?: {
    responsive?: boolean;
    legend?: boolean;
    grid?: boolean;
    tooltip?: boolean;
    zoom?: boolean;
    export?: boolean;
  };
  size?: {
    width?: string | number;
    height?: string | number;
    aspectRatio?: number;
  };
}

export interface ContainerWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CONTAINER;
  title?: TranslationKey;
  description?: TranslationKey;
  layout: LayoutConfig;
  children?: WidgetConfig[];
  border?: boolean;
  shadow?: boolean;
  background?: ComponentVariant;
}

export interface SectionWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.SECTION;
  title: TranslationKey;
  description?: TranslationKey;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  layout: LayoutConfig;
  children?: WidgetConfig[];
  actions?: ButtonAction[];
}

/**
 * Button widget
 */
export interface ButtonWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.BUTTON;
  label: TranslationKey;
  icon?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
  loading?: boolean;
  actions: InteractiveActions;
}

/**
 * Title widget
 */
export interface TitleWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.TITLE;
  text: TranslationKey;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  align?: TextAlign;
  variant?: ComponentVariant;
  size?: ComponentSize;
  icon?: string;
  actions?: InteractiveActions;
}

/**
 * Text widget
 */
export interface TextWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.TEXT;
  content: TranslationKey;
  variant?: "body" | "caption" | "subtitle";
  align?: TextAlign;
  size?: ComponentSize;
  color?: ComponentVariant;
  truncate?: boolean;
  maxLines?: number;
}

/**
 * Grouped list widget configuration
 */
export interface GroupedListWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.GROUPED_LIST;
  groupBy: string;
  sortBy?: string;
  showGroupSummary?: boolean;
  maxItemsPerGroup?: number;
  layout?: LayoutConfig;
}

/**
 * Stats grid widget configuration
 */
export interface StatsGridWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.STATS_GRID;
  title?: TranslationKey;
  description?: TranslationKey;
  columns?: number;
  showTotals?: boolean;
  showPercentages?: boolean;
  layout?: LayoutConfig;
}

/**
 * Link widget configuration
 */
export interface LinkWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.LINK;
  content: TranslationKey;
  href?: string;
  openInNewTab?: boolean;
  variant?: ComponentVariant;
}

/**
 * Link card widget configuration
 */
export interface LinkCardWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.LINK_CARD;
  title?: TranslationKey;
  description?: TranslationKey;
  href?: string;
  openInNewTab?: boolean;
  image?: string;
  layout?: LayoutConfig;
}

/**
 * Link list widget configuration
 */
export interface LinkListWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.LINK_LIST;
  title?: TranslationKey;
  description?: TranslationKey;
  layout?: LayoutConfig;
}

/**
 * Markdown widget configuration
 */
export interface MarkdownWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.MARKDOWN;
  content: TranslationKey;
  sanitize?: boolean;
}

// WidgetConfig union type is declared at the top of the file (line ~300)
// to resolve circular references with Container and Section widgets
