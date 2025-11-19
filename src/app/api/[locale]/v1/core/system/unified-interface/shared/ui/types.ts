/**
 * Shared Widget Types
 * Platform-agnostic widget interfaces for React, React Native, and CLI
 *
 * This file defines the core types that are shared across all widget implementations.
 * These types enable a unified widget system where definition.ts files drive UI rendering
 * across all platforms (CLI, Web, Mobile).
 */

import type React from "react";
import type { z } from "zod";

import type {
  FieldDataType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { TranslationKey } from "@/i18n/core/static-types";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { Platform } from "../types/platform";

/**
 * Valid primitive values that can be rendered
 */
export type RenderableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | RenderableValue[]
  | { [key: string]: RenderableValue };

/**
 * Widget configuration interface
 */
export interface WidgetConfig {
  layout?:
    | {
        columns: number;
        spacing: string;
      }
    | string
    | number;
  groupBy?: string;
  cardTemplate?: string;
  showSummary?: boolean;
  summaryTemplate?: string;
  itemConfig?: {
    template: string;
    size: string;
    spacing: string;
  };
  summaryTitle?: string;
  summaryStats?: Array<{
    field: string;
    value: string;
    label?: string;
    icon?: string;
    color?: string;
  }>;
  [key: string]: RenderableValue;
}

/**
 * Response field metadata extracted from endpoint definitions
 * Shared across all platforms (CLI, Web, Mobile)
 */
export interface ResponseFieldMetadata {
  name: string;
  type: FieldDataType;
  widgetType: WidgetType;
  value: RenderableValue;
  label?: TranslationKey;
  title?: TranslationKey;
  description?: TranslationKey;
  required?: boolean;
  schema?: z.ZodTypeAny;
  // Additional metadata for rendering
  format?: string;
  unit?: string;
  precision?: number;
  choices?: string[];
  columns?: Array<{
    key: string;
    label: TranslationKey;
    type: FieldDataType;
    width?: string;
    sortable?: boolean;
    filterable?: boolean;
  }>;
  // Grouped list specific properties
  groupBy?: string;
  sortBy?: string;
  showGroupSummary?: boolean;
  maxItemsPerGroup?: number;
  // Widget-specific configuration
  config?: WidgetConfig;
  // Nested structure for container/section widgets
  children?: Record<string, ResponseFieldMetadata>;
}

/**
 * Widget action types for interactive elements
 */
export type WidgetActionType =
  | "click"
  | "edit"
  | "delete"
  | "create"
  | "navigate"
  | "refresh"
  | "retry"
  | "cancel"
  | "submit";

/**
 * Widget action payload
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Generic widget system requires 'unknown' default for flexible action payloads across all widget types
export interface WidgetAction<TPayload = unknown> {
  type: WidgetActionType;
  payload: TPayload;
  metadata?: {
    fieldName?: string;
    fieldPath?: string;
    timestamp?: number;
  };
}

/**
 * Widget render context
 * Provides environment information and callbacks for widget rendering
 */
export interface WidgetRenderContext {
  /** Current locale for i18n */
  locale: CountryLanguage;

  /** Whether the widget should be interactive (vs read-only) */
  isInteractive: boolean;

  /** User permissions for conditional rendering */
  permissions: readonly UserRoleValue[];

  /** Navigation callback for links and routing */
  onNavigate?: (url: string) => void;

  /** Action handler for widget interactions */
  onAction?: (action: WidgetAction) => void | Promise<void>;

  /** Platform identifier */
  platform?: typeof Platform.WEB | typeof Platform.MOBILE | typeof Platform.CLI;

  /** Theme preference */
  theme?: "light" | "dark" | "system";
}

/**
 * Base widget component props
 * All widget components should extend this interface
 */
export interface WidgetComponentProps<TData = RenderableValue> {
  /** The data to render */
  data: TData;

  /** Field metadata from endpoint definition */
  metadata: ResponseFieldMetadata;

  /** Rendering context */
  context: WidgetRenderContext;

  /** Optional action handler (overrides context.onAction) */
  onAction?: (action: WidgetAction) => void | Promise<void>;

  /** Optional CSS class name */
  className?: string;
}

/**
 * Widget renderer function type
 * Used for functional widget implementations
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Generic widget renderer requires 'unknown' default to support any data type across all widgets
export type WidgetRenderer<TData = unknown> = (
  props: WidgetComponentProps<TData>,
) => React.ReactElement | string | null;

/**
 * Widget registry entry
 * Maps widget types to their implementations
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: Widget registry requires 'unknown' default to support dynamic widget registration with any data type
export interface WidgetRegistryEntry<TData = unknown> {
  /** Widget type identifier */
  type: WidgetType;

  /** Widget component or renderer function */
  component:
    | React.ComponentType<WidgetComponentProps<TData>>
    | WidgetRenderer<TData>;

  /** Supported platforms */
  platforms?: Array<
    typeof Platform.WEB | typeof Platform.MOBILE | typeof Platform.CLI
  >;

  /** Whether this widget supports editing */
  supportsEditing?: boolean;

  /** Whether this widget supports CRUD operations */
  supportsCRUD?: boolean;
}

/**
 * Widget configuration for tool results
 */
export interface ToolResultWidgetConfig {
  /** Endpoint ID for fetching definition */
  endpointId: string;

  /** Response field metadata */
  responseFields: ResponseFieldMetadata[];

  /** Credits used for this tool call */
  creditsUsed?: number;

  /** Execution time in milliseconds */
  executionTime?: number;

  /** Tool display metadata */
  toolMetadata?: {
    displayName: string;
    icon?: string;
    color?: string;
  };
}

/**
 * Link widget specific props
 */
export interface LinkWidgetData extends Record<string, RenderableValue> {
  url: string;
  title?: string;
  description?: string;
  openInNewTab?: boolean;
  rel?: string;
}

/**
 * Markdown widget specific props
 */
export interface MarkdownWidgetData extends Record<string, RenderableValue> {
  content: string;
  sanitize?: boolean;
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
}

/**
 * Data table column definition
 */
export interface DataTableColumn {
  key: string;
  label: string;
  type: FieldDataType;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
  format?: (value: RenderableValue) => string;
}

/**
 * Data table widget specific props
 */
export interface DataTableWidgetData {
  rows: Array<Record<string, RenderableValue>>;
  columns: DataTableColumn[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  pageSize?: number;
  currentPage?: number;
  totalRows?: number;
  [key: string]: RenderableValue | DataTableColumn[];
}

/**
 * Grouped list widget specific props
 */
export interface GroupedListWidgetData extends Record<string, RenderableValue> {
  groups: Array<{
    key: string;
    label: string;
    items: Array<Record<string, RenderableValue>>;
    summary?: Record<string, RenderableValue>;
  }>;
  groupBy: string;
  sortBy?: string;
  showGroupSummary?: boolean;
  maxItemsPerGroup?: number;
}

/**
 * Metric card widget specific props
 */
export interface MetricCardWidgetData extends Record<string, RenderableValue> {
  value: string | number;
  label: string;
  icon?: string;
  color?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  unit?: string;
}

/**
 * Stats grid widget specific props
 */
export interface StatsGridWidgetData extends Record<string, RenderableValue> {
  metrics: MetricCardWidgetData[];
  columns?: number;
  layout?: "grid" | "flex";
}

/**
 * Code output widget specific props
 */
export interface CodeOutputWidgetData extends Record<string, RenderableValue> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  theme?: "light" | "dark";
}

/**
 * Container widget specific props
 */
export interface ContainerWidgetData {
  children: Array<{
    type: WidgetType;
    data: RenderableValue;
    metadata: ResponseFieldMetadata;
  }>;
  title?: string;
  description?: string;
  layout?: {
    type: "grid" | "flex" | "stack";
    columns?: number;
    gap?: string;
  };
  [key: string]:
    | RenderableValue
    | Array<{
        type: WidgetType;
        data: RenderableValue;
        metadata: ResponseFieldMetadata;
      }>
    | { type: "grid" | "flex" | "stack"; columns?: number; gap?: string };
}

/**
 * Widget error boundary props
 */
export interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  locale: CountryLanguage;
  fallback?: React.ReactElement;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Widget loading state props
 */
export interface WidgetLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Widget empty state props
 */
export interface WidgetEmptyStateProps {
  message: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const definitions = {};

export default definitions;
