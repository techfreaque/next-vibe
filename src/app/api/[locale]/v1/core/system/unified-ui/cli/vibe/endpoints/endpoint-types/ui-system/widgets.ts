/**
 * Widget System for Definition-Driven UI
 *
 * This system provides strongly-typed widget configurations with enforced props
 * for common UI patterns like grids, titles, forms, stats, etc.
 */

import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  CardLayout,
  ChartType,
  ComponentSize,
  ComponentVariant,
  FieldDataType,
  InterfaceContext,
  LayoutType,
  SpacingSize,
  TableDensity,
  TextAlign,
  ValidationMode,
  WidgetType,
} from "../core/enums";
import type {
  BulkAction,
  ButtonAction,
  ContextMenuAction,
  FieldActions,
  InteractiveActions,
  LifecycleActions,
} from "./actions";

/**
 * Base widget configuration
 */
export interface BaseWidgetConfig {
  type: WidgetType;
  id?: string;
  className?: string;
  style?: Record<string, string>;
  contexts?: InterfaceContext[];
  visible?: boolean;
  disabled?: boolean;
  lifecycle?: LifecycleActions;
}

/**
 * Layout configuration for containers
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
 * Form field widget configuration
 */
export interface FormFieldWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_FIELD;
  fieldType: FieldDataType;
  label: TranslationKey;
  placeholder?: TranslationKey;
  description?: TranslationKey;
  required?: boolean;
  validation?: {
    mode: ValidationMode;
    rules?: Record<string, string | number | boolean>;
    customValidator?: string;
  };
  defaultValue?: string | number | boolean;
  options?: Array<{
    value: string | number;
    label: TranslationKey;
    disabled?: boolean;
  }>;
  actions?: FieldActions;
  size?: ComponentSize;
  variant?: ComponentVariant;
}

/**
 * Form group widget configuration
 */
export interface FormGroupWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_GROUP;
  title?: TranslationKey;
  description?: TranslationKey;
  layout: LayoutConfig;
  fields: FormFieldWidgetConfig[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * Data table widget configuration
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
    render?: string; // Custom render function name
  }>;
  density?: TableDensity;
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
 * Data cards widget configuration
 */
export interface DataCardsWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.DATA_CARDS;
  layout: CardLayout;
  columns?: number;
  spacing?: SpacingSize;
  cardConfig: {
    title?: string; // Field key for title
    subtitle?: string; // Field key for subtitle
    image?: string; // Field key for image
    content?: string[]; // Field keys for content
    actions?: ButtonAction[];
    metadata?: string[]; // Field keys for metadata
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
 * Data grid widget configuration
 */
export interface DataGridWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.DATA_GRID;
  layout: LayoutConfig;
  itemConfig: {
    template: string; // Template name or custom render function
    size?: ComponentSize;
    spacing?: SpacingSize;
  };
  actions?: {
    item?: ContextMenuAction[];
    bulk?: BulkAction[];
    toolbar?: ButtonAction[];
  };
}

/**
 * Code output widget configuration for ESLint-like output
 */
export interface CodeOutputWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CODE_OUTPUT;
  outputFormat: "eslint" | "generic" | "json";
  showSummary?: boolean;
  groupByFile?: boolean;
  showLineNumbers?: boolean;
  colorScheme?: "auto" | "light" | "dark";
}

/**
 * Title widget configuration
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
 * Text widget configuration
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
 * Button widget configuration
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
 * Button group widget configuration
 */
export interface ButtonGroupWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.BUTTON_GROUP;
  buttons: ButtonWidgetConfig[];
  orientation?: "horizontal" | "vertical";
  spacing?: SpacingSize;
  variant?: ComponentVariant;
  size?: ComponentSize;
}

/**
 * Metric card widget configuration
 */
export interface MetricCardWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.METRIC_CARD;
  title: TranslationKey;
  value: string; // Field key for value
  format?: "number" | "currency" | "percentage";
  trend?: {
    value: string; // Field key for trend value
    direction: "up" | "down" | "neutral";
    format?: "number" | "percentage";
  };
  icon?: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  actions?: InteractiveActions;
}

/**
 * Stats grid widget configuration
 */
export interface StatsGridWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.STATS_GRID;
  layout: LayoutConfig;
  metrics: MetricCardWidgetConfig[];
}

/**
 * Chart widget configuration
 */
export interface ChartWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CHART;
  chartType: ChartType;
  title?: TranslationKey;
  data: {
    x: string; // Field key for X axis
    y: string | string[]; // Field key(s) for Y axis
    series?: string; // Field key for series grouping
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

/**
 * Container widget configuration
 */
export interface ContainerWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.CONTAINER;
  title?: TranslationKey;
  description?: TranslationKey;
  layout: LayoutConfig;
  children: WidgetConfig[];
  border?: boolean;
  shadow?: boolean;
  background?: ComponentVariant;
}

/**
 * Section widget configuration
 */
export interface SectionWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.SECTION;
  title: TranslationKey;
  description?: TranslationKey;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  layout: LayoutConfig;
  children: WidgetConfig[];
  actions?: ButtonAction[];
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
 * Union type for all widget configurations
 */
export type WidgetConfig =
  | FormFieldWidgetConfig
  | FormGroupWidgetConfig
  | DataTableWidgetConfig
  | DataCardsWidgetConfig
  | DataGridWidgetConfig
  | GroupedListWidgetConfig
  | CodeOutputWidgetConfig
  | TitleWidgetConfig
  | TextWidgetConfig
  | ButtonWidgetConfig
  | ButtonGroupWidgetConfig
  | MetricCardWidgetConfig
  | StatsGridWidgetConfig
  | ChartWidgetConfig
  | ContainerWidgetConfig
  | SectionWidgetConfig;

/**
 * Widget preset for common patterns
 */
export interface WidgetPreset {
  name: string;
  description: TranslationKey;
  widgets: WidgetConfig[];
  contexts?: InterfaceContext[];
}

/**
 * Widget theme configuration
 */
export interface WidgetTheme {
  name: string;
  colors: Record<ComponentVariant, string>;
  spacing: Record<SpacingSize, string>;
  sizes: Record<ComponentSize, Record<string, string>>;
  typography: Record<string, Record<string, string>>;
}

/**
 * Widget factory for creating common widget patterns
 */
export interface WidgetFactory {
  createFormField(
    config: Partial<FormFieldWidgetConfig>,
  ): FormFieldWidgetConfig;
  createDataTable(
    config: Partial<DataTableWidgetConfig>,
  ): DataTableWidgetConfig;
  createMetricCard(
    config: Partial<MetricCardWidgetConfig>,
  ): MetricCardWidgetConfig;
  createChart(config: Partial<ChartWidgetConfig>): ChartWidgetConfig;
  createContainer(
    config: Partial<ContainerWidgetConfig>,
  ): ContainerWidgetConfig;
}

/**
 * Widget validation result
 */
export interface WidgetValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    message: string;
    code: string;
  }>;
  warnings: Array<{
    path: string;
    message: string;
    code: string;
  }>;
}
