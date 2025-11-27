/**
 * Widget System Helper Types
 *
 * This file contains helper types for working with widgets.
 * For widget configurations, import from widget-configs.ts.
 */

import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  ComponentSize,
  ComponentVariant,
  InterfaceContext,
  SpacingSize,
} from "../types/enums";

import type {
  WidgetConfig,
  FormFieldWidgetConfig,
  DataTableWidgetConfig,
  MetricCardWidgetConfig,
  ChartWidgetConfig,
  ContainerWidgetConfig,
} from "./configs";

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

/**
 * Type guard to check if value is a plain object
 */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

/**
 * Type guard to check if object has a string property
 */
export function hasStringProperty<K extends string>(
  obj: unknown,
  key: K,
): obj is Record<K, string> {
  return isPlainObject(obj) && key in obj && typeof obj[key] === "string";
}
