/**
 * Enhanced UI Configuration System
 *
 * This integrates the widget system and actions into our existing field architecture,
 * providing a complete definition-driven UI solution that works across all interface contexts.
 */

import type { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  ChartWidgetConfig,
  DataCardsWidgetConfig,
  DataTableWidgetConfig,
  FormFieldWidgetConfig,
  LayoutConfig,
  MetricCardWidgetConfig,
  WidgetConfig,
} from "../widgets/configs";
import type {
  ActionConfig,
  BulkAction,
  ButtonAction,
  ContextMenuAction,
  FieldActions,
  InteractiveActions,
  LifecycleActions,
} from "./actions";
import type { FieldDataType, InterfaceContext } from "./enums";

/**
 * UI configuration that can be attached to any field
 */
export interface UIConfig<TKey extends string> {
  // Context-specific configurations
  contexts?: Partial<Record<InterfaceContext, ContextSpecificConfig<TKey>>>;

  // Default configuration (applies to all contexts unless overridden)
  default?: ContextSpecificConfig<TKey>;

  // Global actions that apply across all contexts
  globalActions?: LifecycleActions;

  // Responsive behavior
  responsive?: {
    breakpoints?: Record<string, number>;
    behavior?: "hide" | "collapse" | "stack" | "scroll";
  };
}

/**
 * Context-specific UI configuration
 */
export interface ContextSpecificConfig<TKey extends string> {
  // Widget configuration for this context
  widget?: WidgetConfig<TKey>;

  // Field-specific overrides
  field?: {
    type?: FieldDataType;
    label?: TranslationKey;
    placeholder?: TranslationKey;
    description?: TranslationKey;
    required?: boolean;
    disabled?: boolean;
    visible?: boolean;
    readonly?: boolean;
  };

  // Layout configuration
  layout?: LayoutConfig;

  // Actions for this context
  actions?: FieldActions & InteractiveActions;

  // Validation rules specific to this context
  validation?: {
    rules?: Record<string, string | number | boolean>;
    messages?: Record<string, TranslationKey>;
  };

  // Conditional rendering
  conditions?: Array<{
    field: string;
    operator: "equals" | "not_equals" | "exists" | "not_exists";
    value?: string | number | boolean;
    action: "show" | "hide" | "disable" | "require";
  }>;
}

/**
 * Enhanced field configuration that extends our existing field system
 */
export interface EnhancedFieldConfig<TKey extends string> {
  // Core field properties (from existing system)
  key: string;
  schema: z.ZodTypeAny;
  usage: { request?: "data" | "urlPathParams"; response?: boolean };

  // Enhanced UI configuration
  ui?: UIConfig<TKey>;

  // Cache strategy
  cache?: {
    strategy: "memory" | "localStorage" | "sessionStorage" | "indexedDB";
    ttl?: number;
    key?: string;
  };

  // API-specific configuration
  api?: {
    transform?: {
      request?: string; // Function name for request transformation
      response?: string; // Function name for response transformation
    };
    validation?: {
      client?: boolean;
      server?: boolean;
    };
  };
}

/**
 * Preset configurations for common field patterns
 */
export interface FieldPresets<TKey extends string> {
  // Form field presets
  textInput: (label: TranslationKey, required?: boolean) => UIConfig<TKey>;
  emailInput: (label: TranslationKey, required?: boolean) => UIConfig<TKey>;
  passwordInput: (label: TranslationKey, required?: boolean) => UIConfig<TKey>;
  numberInput: (
    label: TranslationKey,
    min?: number,
    max?: number,
  ) => UIConfig<TKey>;
  selectInput: (
    label: TranslationKey,
    options: Array<{ value: string; label: TranslationKey }>,
  ) => UIConfig<TKey>;
  dateInput: (label: TranslationKey, required?: boolean) => UIConfig<TKey>;
  textareaInput: (label: TranslationKey, rows?: number) => UIConfig<TKey>;

  // Display field presets
  badge: (variant?: "success" | "warning" | "error") => UIConfig<TKey>;
  avatar: (size?: "sm" | "md" | "lg") => UIConfig<TKey>;
  link: (external?: boolean) => UIConfig<TKey>;
  currency: (currency?: string) => UIConfig<TKey>;
  percentage: (decimals?: number) => UIConfig<TKey>;
  date: (format?: string) => UIConfig<TKey>;

  // Action presets
  editButton: (editAction: ActionConfig[]) => UIConfig<TKey>;
  deleteButton: (deleteAction: ActionConfig[]) => UIConfig<TKey>;
  viewButton: (viewAction: ActionConfig[]) => UIConfig<TKey>;
  copyButton: (copyAction: ActionConfig[]) => UIConfig<TKey>;
}

/**
 * Widget factory for creating complex UI patterns
 */
export interface EnhancedWidgetFactory<TKey extends string> {
  // Data display widgets
  createDataTable: (config: {
    columns: Array<{
      key: string;
      label: TranslationKey;
      type: FieldDataType;
      sortable?: boolean;
      filterable?: boolean;
    }>;
    actions?: {
      row?: ContextMenuAction[];
      bulk?: BulkAction[];
      toolbar?: ButtonAction[];
    };
  }) => DataTableWidgetConfig<TKey>;

  createDataCards: (config: {
    layout: "grid" | "list";
    cardFields: {
      title: string;
      subtitle?: string;
      content: string[];
      image?: string;
    };
    actions?: ButtonAction[];
  }) => DataCardsWidgetConfig<TKey>;

  // Stats widgets
  createMetricsGrid: (
    metrics: Array<{
      title: TranslationKey;
      valueField: string;
      format?: "number" | "currency" | "percentage";
      trend?: {
        field: string;
        direction: "up" | "down" | "neutral";
      };
    }>,
  ) => WidgetConfig<TKey>[];

  createChart: (config: {
    type: "line" | "bar" | "pie" | "area";
    title?: TranslationKey;
    xField: string;
    yField: string | string[];
    seriesField?: string;
  }) => ChartWidgetConfig<TKey>;

  // Form widgets
  createFormSection: (config: {
    title: TranslationKey;
    description?: TranslationKey;
    fields: EnhancedFieldConfig<TKey>[];
    layout?: "vertical" | "horizontal" | "grid";
    collapsible?: boolean;
  }) => WidgetConfig<TKey>;

  createFormWizard: (
    steps: Array<{
      title: TranslationKey;
      description?: TranslationKey;
      fields: EnhancedFieldConfig<TKey>[];
      validation?: ActionConfig[];
    }>,
  ) => WidgetConfig<TKey>;
}

/**
 * UI configuration builder for fluent API
 */
export interface UIConfigBuilder<TKey extends string> {
  // Context targeting
  forContext(context: InterfaceContext): UIConfigBuilder<TKey>;
  forAllContexts(): UIConfigBuilder<TKey>;

  // Widget configuration
  withWidget(widget: WidgetConfig<TKey>): UIConfigBuilder<TKey>;
  withFormField(
    config: Partial<FormFieldWidgetConfig<TKey>>,
  ): UIConfigBuilder<TKey>;
  withDataTable(
    config: Partial<DataTableWidgetConfig<TKey>>,
  ): UIConfigBuilder<TKey>;
  withMetricCard(
    config: Partial<MetricCardWidgetConfig<TKey>>,
  ): UIConfigBuilder<TKey>;

  // Actions
  withActions(
    actions: FieldActions & InteractiveActions,
  ): UIConfigBuilder<TKey>;
  withLifecycleActions(actions: LifecycleActions): UIConfigBuilder<TKey>;
  onSuccess(actions: ActionConfig[]): UIConfigBuilder<TKey>;
  onError(actions: ActionConfig[]): UIConfigBuilder<TKey>;
  onClick(actions: ActionConfig[]): UIConfigBuilder<TKey>;
  onChange(actions: ActionConfig[]): UIConfigBuilder<TKey>;

  // Layout
  withLayout(layout: LayoutConfig): UIConfigBuilder<TKey>;
  withResponsive(config: {
    breakpoints?: Record<string, number>;
    behavior?: "hide" | "collapse" | "stack" | "scroll";
  }): UIConfigBuilder<TKey>;

  // Conditions
  showWhen(
    field: string,
    operator: "equals" | "not_equals" | "exists" | "not_exists",
    value?: string | number | boolean,
  ): UIConfigBuilder<TKey>;
  hideWhen(
    field: string,
    operator: "equals" | "not_equals" | "exists" | "not_exists",
    value?: string | number | boolean,
  ): UIConfigBuilder<TKey>;

  // Build
  build(): UIConfig<TKey>;
}

/**
 * Factory function to create UI config
 */
export declare function createUIConfig<TKey extends string>(
  config: Partial<UIConfig<TKey>>,
): UIConfig<TKey>;

/**
 * Factory function to create field presets
 */
export declare function createFieldPresets<
  TKey extends string,
>(): FieldPresets<TKey>;

/**
 * Factory function to create widget factory
 */
export declare function createWidgetFactory<
  TKey extends string,
>(): EnhancedWidgetFactory<TKey>;
