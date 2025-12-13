/**
 * Widget Types and Interfaces
 * CLI-specific widget rendering types
 *
 * Extends shared types from ../../../shared/widgets/types.ts
 * Types flow from widget configs in ../../../shared/widgets/configs.ts
 */

import type {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { TFunction } from "@/i18n/core/static-types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { UnifiedField } from "../../../shared/types/endpoint";
import type {
  WidgetData,
  WidgetRenderContext as SharedWidgetRenderContext,
  BaseWidgetProps,
} from "../../../shared/widgets/types";

/**
 * CLI rendering options
 */
export interface CLIRenderingOptions {
  useColors: boolean;
  useEmojis: boolean;
  maxWidth: number;
  indentSize: number;
  locale: CountryLanguage;
}

/**
 * CLI-specific widget render context.
 * Extends the shared context with CLI-specific utilities.
 */
export interface CLIWidgetRenderContext extends SharedWidgetRenderContext {
  options: CLIRenderingOptions;
  depth: number;
  t: TFunction;
  formatValue: (field: UnifiedField, value: WidgetData) => string;
  getFieldIcon: (type: FieldDataType) => string;
  renderEmptyState: (message: string) => string;
  getRenderer: (widgetType: WidgetType) => WidgetRenderer;
}

// Alias for backwards compatibility
export type WidgetRenderContext = CLIWidgetRenderContext;

/**
 * Widget renderer interface.
 * Each renderer handles a specific widget type.
 * The generic T enables type-safe props within implementations.
 * Registry uses WidgetRenderer (without T) for storage, with runtime type checking.
 */
export interface WidgetRenderer<T extends WidgetType = WidgetType> {
  readonly widgetType: T;
  render(props: CLIWidgetProps<T>): string;
}

/**
 * Type for storing renderers in arrays - allows any widget type.
 */
export type AnyWidgetRenderer = WidgetRenderer<WidgetType>;

/**
 * CLI-specific widget props. Extends base props with CLI context.
 * Uses the same discriminated union pattern as React for type safety.
 */
export interface CLIWidgetProps<
  T extends WidgetType,
> extends BaseWidgetProps<T> {
  context: CLIWidgetRenderContext;
}

/**
 * Maps each WidgetType to CLI-specific props.
 */
export type CLIWidgetPropsMap = {
  [T in WidgetType]: CLIWidgetProps<T>;
};

/**
 * Union of all CLI widget props - TypeScript narrows this in switch statements.
 */
export type CLIWidgetPropsUnion = CLIWidgetPropsMap[WidgetType];

/**
 * Data formatting utilities for CLI output
 */
export interface DataFormatter {
  formatText(value: string, options?: { maxLength?: number }): string;
  formatNumber(
    value: number,
    locale: CountryLanguage,
    options?: { precision?: number; unit?: string },
  ): string;
  formatBoolean(value: boolean): string;
  formatDate(value: Date | string, locale: CountryLanguage): string;
  formatArray(
    value: WidgetData[],
    options?: { separator?: string; maxItems?: number },
  ): string;
  formatObject(
    value: Record<string, WidgetData>,
    options?: { maxDepth?: number },
  ): string;
  formatDuration(milliseconds: number): string;
}
