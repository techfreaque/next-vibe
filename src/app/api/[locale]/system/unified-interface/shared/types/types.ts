/**
 * UI System Types
 *
 * Complete type definitions for the widget-based UI configuration system.
 * Supports all interface contexts with type-safe widget configurations.
 */

import type { TranslationKey } from "@/i18n/core/static-types";

import type { LayoutConfig, WidgetConfig } from "../widgets/configs";
import type {
  FieldActions,
  InteractiveActions,
  LifecycleActions,
} from "./endpoint";
import type { FieldDataType, InterfaceContext } from "./enums";

// ============================================================================
// UI CONFIGURATION SYSTEM
// ============================================================================

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
 * Complete UI configuration that can be attached to any field
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
