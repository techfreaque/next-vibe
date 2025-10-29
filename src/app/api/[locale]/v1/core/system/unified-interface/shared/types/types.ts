/**
 * UI System Types
 *
 * Complete type definitions for the widget-based UI configuration system.
 * Supports all interface contexts with type-safe widget configurations.
 */

import type { TranslationKey } from "@/i18n/core/static-types";

import type {
  BulkAction,
  ButtonAction,
  ContextMenuAction,
  FieldActions,
  InteractiveActions,
  LifecycleActions,
} from "../../unified-interface/shared/types/endpoint";
import type {
  CardLayout,
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
} from "../../unified-interface/shared/types/enums";

// ============================================================================
// LAYOUT CONFIGURATION
// ============================================================================

/**
 * Layout configuration for containers and widgets
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

// ============================================================================
// BASE WIDGET CONFIGURATION
// ============================================================================

/**
 * Base widget configuration that all widgets extend
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

// ============================================================================
// FORM WIDGETS
// ============================================================================

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
  options?: readonly {
    readonly value: string | number;
    readonly label: TranslationKey; // Allow any string for specialized fields
    readonly disabled?: boolean;
    readonly symbol?: string; // For currency fields
  }[];
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
 * Form section widget configuration
 */
export interface FormSectionWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.FORM_SECTION;
  title: TranslationKey;
  description?: TranslationKey;
  layout: LayoutConfig;
  groups: FormGroupWidgetConfig[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

// ============================================================================
// DATA DISPLAY WIDGETS
// ============================================================================

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
 * Data list widget configuration
 */
export interface DataListWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.DATA_LIST;
  itemConfig: {
    template: string; // Template name or custom render function
    spacing?: SpacingSize;
    divider?: boolean;
  };
  actions?: {
    item?: ContextMenuAction[];
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
  emptyState?: {
    title: TranslationKey;
    description?: TranslationKey;
    action?: ButtonAction;
  };
}

// ============================================================================
// CONTENT WIDGETS
// ============================================================================

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
 * Badge widget configuration
 */
export interface BadgeWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.BADGE;
  text: TranslationKey;
  variant?: ComponentVariant;
  size?: ComponentSize;
  icon?: string;
}

/**
 * Avatar widget configuration
 */
export interface AvatarWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.AVATAR;
  src?: string; // Field key for image source
  alt?: TranslationKey;
  fallback?: TranslationKey; // Field key for fallback text
  size?: ComponentSize;
  shape?: "circle" | "square";
}

// ============================================================================
// INTERACTIVE WIDGETS
// ============================================================================

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
 * Action bar widget configuration
 */
export interface ActionBarWidgetConfig extends BaseWidgetConfig {
  type: WidgetType.ACTION_BAR;
  actions: ButtonAction[];
  layout?: "start" | "center" | "end" | "space-between";
  spacing?: SpacingSize;
  variant?: ComponentVariant;
}

// ============================================================================
// UNION TYPES
// ============================================================================

/**
 * Union type for all widget configurations
 */
export type WidgetConfig =
  | FormFieldWidgetConfig
  | FormGroupWidgetConfig
  | FormSectionWidgetConfig
  | DataTableWidgetConfig
  | DataCardsWidgetConfig
  | DataListWidgetConfig
  | DataGridWidgetConfig
  | TitleWidgetConfig
  | TextWidgetConfig
  | BadgeWidgetConfig
  | AvatarWidgetConfig
  | ButtonWidgetConfig
  | ButtonGroupWidgetConfig
  | ActionBarWidgetConfig;

// ============================================================================
// UI CONFIGURATION SYSTEM
// ============================================================================

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
 * Complete UI configuration that can be attached to any field
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

const definitions = {};

export default definitions;
