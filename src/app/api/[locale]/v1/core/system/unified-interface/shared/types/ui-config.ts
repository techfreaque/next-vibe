/**
 * Enhanced UI Configuration System
 *
 * This integrates the widget system and actions into our existing field architecture,
 * providing a complete definition-driven UI solution that works across all interface contexts.
 */

import type { z } from "zod";

import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  FieldDataType,
  InterfaceContext,
} from './enums';
import type {
  ActionConfig,
  BulkAction,
  ButtonAction,
  ContextMenuAction,
  FieldActions,
  InteractiveActions,
  LifecycleActions,
} from "./actions";
import type {
  ChartWidgetConfig,
  DataCardsWidgetConfig,
  DataTableWidgetConfig,
  FormFieldWidgetConfig,
  LayoutConfig,
  MetricCardWidgetConfig,
  WidgetConfig,
} from "../widgets";

/**
 * UI configuration that can be attached to any field
 */
export interface UIConfig {
  // Context-specific configurations
  contexts?: Partial<Record<InterfaceContext, ContextSpecificConfig>>;

  // Default configuration (applies to all contexts unless overridden)
  default?: ContextSpecificConfig;

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
export interface ContextSpecificConfig {
  // Widget configuration for this context
  widget?: WidgetConfig;

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
export interface EnhancedFieldConfig {
  // Core field properties (from existing system)
  key: string;
  schema: z.ZodTypeAny;
  usage: { request?: "data" | "urlPathParams"; response?: boolean };

  // Enhanced UI configuration
  ui?: UIConfig;

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
export interface FieldPresets {
  // Form field presets
  textInput: (label: TranslationKey, required?: boolean) => UIConfig;
  emailInput: (label: TranslationKey, required?: boolean) => UIConfig;
  passwordInput: (label: TranslationKey, required?: boolean) => UIConfig;
  numberInput: (label: TranslationKey, min?: number, max?: number) => UIConfig;
  selectInput: (
    label: TranslationKey,
    options: Array<{ value: string; label: TranslationKey }>,
  ) => UIConfig;
  dateInput: (label: TranslationKey, required?: boolean) => UIConfig;
  textareaInput: (label: TranslationKey, rows?: number) => UIConfig;

  // Display field presets
  badge: (variant?: "success" | "warning" | "error") => UIConfig;
  avatar: (size?: "sm" | "md" | "lg") => UIConfig;
  link: (external?: boolean) => UIConfig;
  currency: (currency?: string) => UIConfig;
  percentage: (decimals?: number) => UIConfig;
  date: (format?: string) => UIConfig;

  // Action presets
  editButton: (editAction: ActionConfig[]) => UIConfig;
  deleteButton: (deleteAction: ActionConfig[]) => UIConfig;
  viewButton: (viewAction: ActionConfig[]) => UIConfig;
  copyButton: (copyAction: ActionConfig[]) => UIConfig;
}

/**
 * Widget factory for creating complex UI patterns
 */
export interface EnhancedWidgetFactory {
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
  }) => DataTableWidgetConfig;

  createDataCards: (config: {
    layout: "grid" | "list";
    cardFields: {
      title: string;
      subtitle?: string;
      content: string[];
      image?: string;
    };
    actions?: ButtonAction[];
  }) => DataCardsWidgetConfig;

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
  ) => WidgetConfig[];

  createChart: (config: {
    type: "line" | "bar" | "pie" | "area";
    title?: TranslationKey;
    xField: string;
    yField: string | string[];
    seriesField?: string;
  }) => ChartWidgetConfig;

  // Form widgets
  createFormSection: (config: {
    title: TranslationKey;
    description?: TranslationKey;
    fields: EnhancedFieldConfig[];
    layout?: "vertical" | "horizontal" | "grid";
    collapsible?: boolean;
  }) => WidgetConfig;

  createFormWizard: (
    steps: Array<{
      title: TranslationKey;
      description?: TranslationKey;
      fields: EnhancedFieldConfig[];
      validation?: ActionConfig[];
    }>,
  ) => WidgetConfig;
}

/**
 * UI configuration builder for fluent API
 */
export interface UIConfigBuilder {
  // Context targeting
  forContext(context: InterfaceContext): UIConfigBuilder;
  forAllContexts(): UIConfigBuilder;

  // Widget configuration
  withWidget(widget: WidgetConfig): UIConfigBuilder;
  withFormField(config: Partial<FormFieldWidgetConfig>): UIConfigBuilder;
  withDataTable(config: Partial<DataTableWidgetConfig>): UIConfigBuilder;
  withMetricCard(config: Partial<MetricCardWidgetConfig>): UIConfigBuilder;

  // Actions
  withActions(actions: FieldActions & InteractiveActions): UIConfigBuilder;
  withLifecycleActions(actions: LifecycleActions): UIConfigBuilder;
  onSuccess(actions: ActionConfig[]): UIConfigBuilder;
  onError(actions: ActionConfig[]): UIConfigBuilder;
  onClick(actions: ActionConfig[]): UIConfigBuilder;
  onChange(actions: ActionConfig[]): UIConfigBuilder;

  // Layout
  withLayout(layout: LayoutConfig): UIConfigBuilder;
  withResponsive(config: {
    breakpoints?: Record<string, number>;
    behavior?: "hide" | "collapse" | "stack" | "scroll";
  }): UIConfigBuilder;

  // Conditions
  showWhen(
    field: string,
    operator: "equals" | "not_equals" | "exists" | "not_exists",
    value?: string | number | boolean,
  ): UIConfigBuilder;
  hideWhen(
    field: string,
    operator: "equals" | "not_equals" | "exists" | "not_exists",
    value?: string | number | boolean,
  ): UIConfigBuilder;

  // Build
  build(): UIConfig;
}

/**
 * Factory function to create UI config
 */
export declare function createUIConfig(config: Partial<UIConfig>): UIConfig;

/**
 * Factory function to create field presets
 */
export declare function createFieldPresets(): FieldPresets;

/**
 * Factory function to create widget factory
 */
export declare function createWidgetFactory(): EnhancedWidgetFactory;
