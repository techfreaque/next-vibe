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
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { UnifiedField } from "../../../shared/types/endpoint";
import type {
  BaseWidgetProps,
  WidgetData,
  WidgetRenderContext as SharedWidgetRenderContext,
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
  formatValue: <TKey extends string>(
    field: UnifiedField<TKey>,
    value: WidgetData,
  ) => string;
  getFieldIcon: (type: FieldDataType) => string;
  renderEmptyState: (message: string) => string;
  getRenderer: (widgetType: WidgetType) => AnyWidgetRenderer;
  /**
   * Render a widget with proper type dispatch.
   * Use this instead of getRenderer().render() to avoid union type issues.
   */
  renderWidget: <TKey extends string>(
    widgetType: WidgetType,
    field: UnifiedField<TKey>,
    value: WidgetData,
  ) => string;
}

// Alias for backwards compatibility
export type WidgetRenderContext = CLIWidgetRenderContext;

/**
 * CLI-specific widget props. Extends base props with CLI context.
 * Uses the same pattern as ReactWidgetProps for type safety.
 */
export interface CLIWidgetProps<
  T extends WidgetType,
  TKey extends string = string,
> extends BaseWidgetProps<TKey, T> {
  context: CLIWidgetRenderContext;
}

/**
 * Widget renderer interface.
 * Each renderer handles a specific widget type.
 * TWidget is the specific widget type this renderer handles.
 */
export interface WidgetRenderer<TWidget extends WidgetType = WidgetType> {
  readonly widgetType: TWidget;
  render(props: CLIWidgetProps<TWidget, string>): string;
}

/**
 * Widget renderer type for registry storage.
 * Uses `any` for widget type like React's WidgetComponent pattern.
 * Each implementation still has strict types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyWidgetRenderer = WidgetRenderer<any>;

/**
 * Maps each WidgetType to CLI-specific props.
 */
export type CLIWidgetPropsMap<TKey extends string> = {
  [T in WidgetType]: CLIWidgetProps<T, TKey>;
};

/**
 * Union of all CLI widget props - TypeScript narrows this in switch statements.
 */
export type CLIWidgetPropsUnion<TKey extends string> =
  CLIWidgetPropsMap<TKey>[WidgetType];

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
