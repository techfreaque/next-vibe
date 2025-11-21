/**
 * Core Enums for Endpoint Types System
 *
 * All fundamental enums used throughout the endpoint types system.
 * These are the building blocks for type-safe endpoint definitions.
 *
 * This is the single source of truth for all enums - consolidated from multiple files.
 */

/**
 * Interface contexts where endpoints are consumed
 * These are the 5+ core interfaces that every endpoint must support
 */
export enum InterfaceContext {
  /** Web UI forms and components */
  WEB_UI = "web_ui",
  /** Command line interface */
  CLI = "cli",
  /** AI tool function calls */
  AI_TOOLS = "ai_tools",
  /** Chat confirmation interface for AI tool calls with editable forms */
  CHAT_CONFIRMATION = "chat_confirmation",
  /** Composable pages using EndpointPage */
  COMPOSABLE_PAGES = "composable_pages",
  /** Email interface */
  EMAIL = "email",
  /** Export interface */
  EXPORT = "export",
}

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
  Response = "response",
}

/**
 * Cache strategy options
 */
export enum CacheStrategy {
  None = "none",
  Local = "local",
  Persistent = "persistent",
}

/**
 * Widget types for definition-driven UI components
 * Each widget type enforces specific props and behavior
 */
export enum WidgetType {
  // Form widgets
  FORM_FIELD = "form_field",
  FORM_GROUP = "form_group",
  FORM_SECTION = "form_section",

  // Data display widgets
  DATA_TABLE = "data_table",
  DATA_CARD = "data_card",
  DATA_CARDS = "data_cards",
  DATA_LIST = "data_list",
  DATA_GRID = "data_grid",
  GROUPED_LIST = "grouped_list",
  CODE_QUALITY_LIST = "code_quality_list",
  METADATA_CARD = "metadata_card",

  // Layout widgets
  CONTAINER = "container",
  SECTION = "section",
  TABS = "tabs",
  ACCORDION = "accordion",

  // Content widgets
  TITLE = "title",
  TEXT = "text",
  BADGE = "badge",
  AVATAR = "avatar",
  MARKDOWN = "markdown",
  MARKDOWN_EDITOR = "markdown_editor",
  LINK = "link",
  LINK_CARD = "link_card",
  LINK_LIST = "link_list",

  // Specialized content widgets
  FILE_PATH = "file_path",
  LINE_NUMBER = "line_number",
  COLUMN_NUMBER = "column_number",
  CODE_RULE = "code_rule",
  CODE_OUTPUT = "code_output",
  SEVERITY_BADGE = "severity_badge",
  MESSAGE_TEXT = "message_text",
  ISSUE_CARD = "issue_card",

  // Interactive widgets
  BUTTON = "button",
  BUTTON_GROUP = "button_group",
  ACTION_BAR = "action_bar",
  PAGINATION_INFO = "pagination_info",
  ACTION_LIST = "action_list",

  // Stats widgets
  METRIC_CARD = "metric_card",
  STATS_GRID = "stats_grid",
  CHART = "chart",
  PROGRESS = "progress",

  // Status widgets
  LOADING = "loading",
  ERROR = "error",
  EMPTY_STATE = "empty_state",
  STATUS_INDICATOR = "status_indicator",

  // Custom widgets
  CUSTOM = "custom",
}

/**
 * Field data types that map to appropriate UI components across all contexts
 * These are inferred from Zod schemas and automatically generate context-specific UI
 */
export enum FieldDataType {
  // Input field types
  TEXT = "text",
  EMAIL = "email",
  PHONE = "phone",
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
  SLIDER = "slider",
  TAGS = "tags",
  TEXT_ARRAY = "text_array",

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
 * Action types for interactive elements
 */
export enum ActionType {
  // UI Actions
  TOAST = "toast",
  NOTIFICATION = "notification",
  ALERT = "alert",
  MODAL = "modal",
  DRAWER = "drawer",

  // Navigation Actions
  ROUTER_PUSH = "router_push",
  ROUTER_REPLACE = "router_replace",
  ROUTER_BACK = "router_back",
  REDIRECT = "redirect",

  // Data Actions
  REFETCH = "refetch",
  INVALIDATE_CACHE = "invalidate_cache",
  UPDATE_CACHE = "update_cache",
  CLEAR_CACHE = "clear_cache",

  // Form Actions
  RESET_FORM = "reset_form",
  CLEAR_FORM = "clear_form",
  SET_FORM_VALUES = "set_form_values",
  FOCUS_FIELD = "focus_field",

  // State Actions
  SET_STATE = "set_state",
  TOGGLE_STATE = "toggle_state",
  UPDATE_STATE = "update_state",

  // External Actions
  API_CALL = "api_call",
  WEBHOOK = "webhook",
  EMAIL = "email",
  DOWNLOAD = "download",
  COPY_TO_CLIPBOARD = "copy_to_clipboard",

  // Custom Actions
  CUSTOM = "custom",
}

/**
 * Layout types for containers and forms
 */
export enum LayoutType {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
  GRID = "grid",
  FLEX = "flex",
  STACKED = "stacked",
  FULL_WIDTH = "full_width",
  COLLAPSIBLE = "collapsible",
  GRID_2_COLUMNS = "grid_2_columns",
  GRID_ITEM = "grid_item",
}

/**
 * Component variants for theming
 */
export enum ComponentVariant {
  DEFAULT = "default",
  PRIMARY = "primary",
  SECONDARY = "secondary",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  DESTRUCTIVE = "destructive",
  GHOST = "ghost",
  OUTLINE = "outline",
  SEVERITY = "severity",
  TYPE = "type",
}

/**
 * Component sizes
 */
export enum ComponentSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
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
 * Action execution timing
 */
export enum ActionTiming {
  IMMEDIATE = "immediate",
  DEBOUNCED = "debounced",
  THROTTLED = "throttled",
  DELAYED = "delayed",
}

/**
 * Validation modes for form fields
 */
export enum ValidationMode {
  ON_CHANGE = "onChange",
  ON_BLUR = "onBlur",
  ON_SUBMIT = "onSubmit",
  ON_TOUCHED = "onTouched",
}

/**
 * Table density options
 */
export enum TableDensity {
  COMPACT = "compact",
  NORMAL = "normal",
  COMFORTABLE = "comfortable",
}

/**
 * Card layout types
 */
export enum CardLayout {
  COMPACT = "compact",
  DETAILED = "detailed",
  MEDIA = "media",
  CUSTOM = "custom",
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
