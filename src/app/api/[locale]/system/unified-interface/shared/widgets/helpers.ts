/**
 * Widget System Helper Types
 *
 * This file contains helper types for working with widgets.
 * For widget configurations, import from widget-configs.ts.
 */

import type {
  ComponentSize,
  ComponentVariant,
  InterfaceContext,
  SpacingSize,
} from "../types/enums";
import type {
  ChartWidgetConfig,
  ContainerWidgetConfig,
  DataTableWidgetConfig,
  FormFieldWidgetConfig,
  MetricCardWidgetConfig,
  WidgetConfig,
} from "./configs";

/**
 * Widget preset for common patterns
 */
export interface WidgetPreset<TKey extends string> {
  name: string;
  description: TKey;
  widgets: WidgetConfig<TKey>[];
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
export interface WidgetFactory<TKey extends string> {
  createFormField(config: Partial<FormFieldWidgetConfig<TKey>>): FormFieldWidgetConfig<TKey>;
  createDataTable(config: Partial<DataTableWidgetConfig<TKey>>): DataTableWidgetConfig<TKey>;
  createMetricCard(config: Partial<MetricCardWidgetConfig<TKey>>): MetricCardWidgetConfig<TKey>;
  createChart(config: Partial<ChartWidgetConfig<TKey>>): ChartWidgetConfig<TKey>;
  createContainer(config: Partial<ContainerWidgetConfig<TKey>>): ContainerWidgetConfig<TKey>;
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
