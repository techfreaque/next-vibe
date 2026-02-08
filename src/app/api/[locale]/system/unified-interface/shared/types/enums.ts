/**
 * Core Enums for Endpoint Types System
 *
 * All fundamental enums used throughout the endpoint types system.
 * These are the building blocks for type-safe endpoint definitions.
 *
 * This is the single source of truth for all enums - consolidated from multiple files.
 */

/**
 * HTTP Methods
 */
export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

/**
 * All HTTP methods as array
 */
export const ALL_METHODS = [
  Methods.GET,
  Methods.POST,
  Methods.PUT,
  Methods.PATCH,
  Methods.DELETE,
] as const;

/**
 * Field usage enum for type inference
 */
export enum FieldUsage {
  RequestData = "request-data",
  RequestUrlParams = "request-url-params",
  ResponseData = "response",
}

/**
 * Widget types for definition-driven UI components
 * Each widget type enforces specific props and behavior
 */
export enum WidgetType {
  // Form widgets
  FORM_FIELD = "form_field",

  // Data display widgets
  CODE_QUALITY_LIST = "code_quality_list",
  CODE_QUALITY_SUMMARY = "code_quality_summary",
  CODE_QUALITY_FILES = "code_quality_files",
  KEY_VALUE = "key_value",

  // Layout widgets
  CONTAINER = "container",
  CUSTOM_WIDGET = "custom-widget",
  SEPARATOR = "separator",

  // Content widgets
  TITLE = "title",
  TEXT = "text",
  DESCRIPTION = "description",
  METADATA = "metadata",
  BADGE = "badge",
  ICON = "icon",
  AVATAR = "avatar",
  MARKDOWN = "markdown",
  MARKDOWN_EDITOR = "markdown_editor",
  LINK = "link",

  // Specialized content widgets
  CODE_OUTPUT = "code_output",
  CREDIT_TRANSACTION_CARD = "credit_transaction_card",
  CREDIT_TRANSACTION_LIST = "credit_transaction_list",
  PAGINATION = "pagination",

  // Interactive widgets
  BUTTON = "button",
  NAVIGATE_BUTTON = "navigate_button",
  DRAG_HANDLE = "drag_handle",

  // Stats widgets
  STAT = "stat", // Simple stat display: number + label from field definition
  CHART = "chart",

  // Status widgets
  LOADING = "loading",
  EMPTY_STATE = "empty_state",
  STATUS_INDICATOR = "status_indicator",
  ALERT = "alert",
  FORM_ALERT = "form_alert",

  // Interactive action widgets
  SUBMIT_BUTTON = "submit_button",
}

/**
 * Field data types that map to appropriate UI components across all contexts
 * These are inferred from Zod schemas and automatically generate context-specific UI
 */
export enum FieldDataType {
  // Input field types
  TEXT = "text",
  EMAIL = "email",
  TEL = "tel",
  URL = "url",
  PASSWORD = "password",
  NUMBER = "number",
  INT = "int",
  BOOLEAN = "boolean",
  DATE = "date",
  DATETIME = "datetime",
  TIME = "time",
  TEXTAREA = "textarea",
  SELECT = "select",
  MULTISELECT = "multiselect",
  FILE = "file",
  UUID = "uuid",
  JSON = "json",

  // Advanced input types for data-driven UI
  DATE_RANGE = "date_range",
  TIME_RANGE = "time_range",
  TIMEZONE = "timezone",
  CURRENCY_SELECT = "currency_select",
  LANGUAGE_SELECT = "language_select",
  COUNTRY_SELECT = "country_select",
  COLOR = "color",
  ICON = "icon",
  SLIDER = "slider",
  TAGS = "tags",
  TEXT_ARRAY = "text_array",
  FILTER_PILLS = "filter_pills",
  RANGE_SLIDER = "range_slider",
  MODEL_SELECTION = "model_selection",

  // Complex data types
  ARRAY = "array",
  OBJECT = "object",

  // Response display types
  BADGE = "badge",
  AVATAR = "avatar",
  LINK = "link",
  CURRENCY = "currency",
  PERCENTAGE = "percentage",
  STATUS = "status",
  PROGRESS = "progress",
  RATING = "rating",
  IMAGE = "image",
  CODE = "code",
  MARKDOWN = "markdown",
}

/**
 * Layout types for containers and forms
 */
export enum LayoutType {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
  INLINE = "inline",
  GRID = "grid",
  FLEX = "flex",
  STACKED = "stacked",
  FULL_WIDTH = "full_width",
  COLLAPSIBLE = "collapsible",
  GRID_2_COLUMNS = "grid_2_columns",
  GRID_ITEM = "grid_item",
  ACTIONS = "actions",
}

/**
 * Spacing sizes for consistent design
 */
export enum SpacingSize {
  COMPACT = "compact",
  NORMAL = "normal",
  RELAXED = "relaxed",
}

/**
 * Text alignment options
 */
export enum TextAlign {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
  JUSTIFY = "justify",
}

/**
 * Chart types for data visualization
 */
export enum ChartType {
  LINE = "line",
  BAR = "bar",
  PIE = "pie",
  AREA = "area",
  SCATTER = "scatter",
  DONUT = "donut",
  HISTOGRAM = "histogram",
}

/**
 * Hook-specific error types for toast notifications
 */
export enum EndpointErrorTypes {
  VALIDATION_FAILED = "validation_failed",
  NETWORK_ERROR = "network_error",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not_found",
  SERVER_ERROR = "server_error",
  UNKNOWN_ERROR = "unknown_error",
  UNSAVED_CHANGES = "unsaved_changes",
  CONFLICT = "conflict",
}
