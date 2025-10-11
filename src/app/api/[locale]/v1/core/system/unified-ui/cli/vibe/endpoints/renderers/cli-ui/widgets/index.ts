/**
 * Widget System Exports
 * Central export point for all widget renderers and utilities
 */

// Core types and interfaces
export type {
  CLIRenderingOptions,
  CodeOutputConfig,
  DataFormatter,
  LayoutConfig,
  MetricConfig,
  ResponseContainerMetadata,
  ResponseFieldMetadata,
  TableRenderConfig,
  WidgetConfig,
  WidgetRenderContext,
  WidgetRenderer,
} from "./types";

// Base classes
export { BaseWidgetRenderer } from "./base-widget-renderer";

// Widget renderers
export { CodeOutputWidgetRenderer } from "./code-output-widget-renderer";
export { ContainerWidgetRenderer } from "./container-widget-renderer";
export { DataCardsWidgetRenderer } from "./data-cards-widget-renderer";
export { DataTableWidgetRenderer } from "./data-table-widget-renderer";
export { GroupedListWidgetRenderer } from "./grouped-list-widget-renderer";
export { MetricWidgetRenderer } from "./metric-widget-renderer";
export { StatsGridWidgetRenderer } from "./stats-grid-widget-renderer";
export { TextWidgetRenderer } from "./text-widget-renderer";

// Registry and main renderer
export {
  ModularCLIResponseRenderer,
  modularCLIResponseRenderer,
} from "../modular-response-renderer";
export { defaultWidgetRegistry, WidgetRegistry } from "./widget-registry";
