/**
 * Application Constants
 * Centralized configuration values to avoid magic numbers
 */

/**
 * Timing constants (in milliseconds)
 */
export const TIMING = {
  /** Debounce delay for draft saving */
  DRAFT_SAVE_DEBOUNCE: 500,

  /** UI update interval during streaming */
  STREAM_UPDATE_INTERVAL: 100,

  /** Tooltip delay duration */
  TOOLTIP_DELAY: 500,

  /** Debounce delay for localStorage writes */
  STORAGE_DEBOUNCE: 500,

  /** Delay before submitting suggested prompt */
  SUGGESTED_PROMPT_SUBMIT_DELAY: 100,

  /** Delay before focusing textarea after text insertion */
  TEXT_INSERTION_FOCUS_DELAY: 0,

  /** Duration for copy button feedback (ms) */
  COPY_FEEDBACK_DURATION: 2000,

  /** Delay for message editor focus (ms) */
  MESSAGE_EDITOR_FOCUS_DELAY: 100,
} as const;

/**
 * API configuration constants
 */
export const API_CONFIG = {
  /** Default temperature for AI responses */
  DEFAULT_TEMPERATURE: 0.7,

  /** Default max tokens for AI responses */
  DEFAULT_MAX_TOKENS: 5000,

  /** Maximum duration for streaming requests (seconds) */
  MAX_STREAM_DURATION: 30,
} as const;

/**
 * UI configuration constants
 */
export const UI_CONFIG = {
  /** Sidebar width when expanded (in pixels) */
  SIDEBAR_WIDTH: "w-[290px]",

  /** Sidebar width when collapsed (in pixels) */
  SIDEBAR_COLLAPSED_WIDTH: 0,

  /** Transition duration for animations (in milliseconds) */
  TRANSITION_DURATION: 200,
} as const;

/**
 * 4chan-style post number configuration
 */
export const POST_NUMBER_CONFIG = {
  /** Starting post number for 4chan-style view */
  START_NUMBER: 1000000,
} as const;

/**
 * Screenshot configuration
 */
export const SCREENSHOT_CONFIG = {
  /** Prefix for screenshot filenames */
  FILENAME_PREFIX: "chat-",

  /** Default filename when thread has no title */
  DEFAULT_FILENAME: "chat-conversation",

  /** Regex pattern for sanitizing filenames */
  FILENAME_SANITIZE_REGEX: /[^a-z0-9]/gi,

  /** Replacement character for sanitized filenames */
  FILENAME_REPLACEMENT: "-",
} as const;

/**
 * Default folder IDs
 */
export const DEFAULT_FOLDER_IDS = {
  /** General/public folder ID */
  PRIVATE: "private",

  /** Incognito folder ID */
  INCOGNITO: "incognito",

  /** Shared folder ID */
  SHARED: "shared",

  /** Public folder ID */
  PUBLIC: "public",
} as const;

/**
 * DOM element IDs used for scrolling and targeting
 */
export const DOM_IDS = {
  /** Container for all chat messages */
  MESSAGES_CONTAINER: "chat-messages-container",

  /** Inner content area for messages */
  MESSAGES_CONTENT: "chat-messages-content",

  /** Prefix for individual message elements */
  MESSAGE_PREFIX: "msg-",
} as const;

/**
 * Layout dimensions and spacing
 */
export const LAYOUT = {
  /** Default input height in pixels */
  DEFAULT_INPUT_HEIGHT: 120,

  /** Additional padding below messages (in pixels) */
  MESSAGES_BOTTOM_PADDING: 16,

  /** Minimum viewport height for suggestions (in vh units) */
  SUGGESTIONS_MIN_HEIGHT: 60,

  /** Minimum touch target size (px) - WCAG AA standard */
  MIN_TOUCH_TARGET: 44,

  /** Thread indentation per level (px) */
  THREAD_INDENT: 8,

  /** Maximum thread depth for nested replies */
  MAX_THREAD_DEPTH: 8,

  /** Thread line width (px) */
  THREAD_LINE_WIDTH: 2,

  /** Thread line margin offset (px) */
  THREAD_LINE_MARGIN_OFFSET: 8,
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD = {
  /** Key for submitting message */
  SUBMIT_KEY: "Enter",

  /** Key for new line */
  NEW_LINE_MODIFIER: "Shift",
} as const;

/**
 * Quote character for 4chan-style quoting
 */
export const QUOTE_CHARACTER = ">" as const;

/**
 * Text truncation and formatting
 */
export const TEXT_FORMAT = {
  /** Maximum length for message preview in thread list */
  PREVIEW_MAX_LENGTH: 100,

  /** Maximum length for user profile card preview */
  PROFILE_PREVIEW_MAX_LENGTH: 100,

  /** Length of short ID display (characters) */
  SHORT_ID_LENGTH: 8,

  /** Ellipsis character for truncated text */
  ELLIPSIS: "...",

  /** Year format substring length (last 2 digits) */
  YEAR_SUBSTRING_LENGTH: 2,

  /** Maximum length for generated thread title */
  TITLE_MAX_LENGTH: 50,

  /** Minimum ratio for word boundary truncation (0.7 = 70%) */
  WORD_BOUNDARY_RATIO: 0.7,
} as const;

/**
 * ID generation constants
 */
export const ID_GENERATION = {
  /** Base for random ID generation */
  RANDOM_BASE: 36,

  /** Start index for substring extraction */
  RANDOM_SUBSTRING_START: 2,

  /** End index for substring extraction */
  RANDOM_SUBSTRING_END: 9,
} as const;

/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  /** Key for storing post number mappings */
  POST_NUMBER_MAP: "chat-post-numbers",

  /** Key for storing post number counter */
  POST_NUMBER_COUNTER: "chat-post-counter",

  /** Key for storing screenshot data */
  SCREENSHOT_PREFIX: "chat-screenshot-",

  /** Test key for localStorage availability check */
  STORAGE_TEST_KEY: "test",

  /** Test value for localStorage availability check */
  STORAGE_TEST_VALUE: "test",

  /** Key for global model selection */
  GLOBAL_MODEL: "chat-global-model",

  /** Key for global tone selection */
  GLOBAL_TONE: "chat-global-tone",

  /** Key for global search enable state */
  GLOBAL_ENABLE_SEARCH: "chat-global-enable-search",

  /** Key for global TTS autoplay state */
  GLOBAL_TTS_AUTOPLAY: "chat-global-tts-autoplay",

  /** Key for UI preferences */
  UI_PREFERENCES: "chat-ui-preferences",
} as const;

/**
 * Search configuration
 */
export const SEARCH_CONFIG = {
  /** Context length for search results (characters) */
  CONTEXT_LENGTH: 50,

  /** Days threshold for recency scoring */
  RECENCY_DAYS_DIVISOR: 1000 * 60 * 60 * 24, // Convert ms to days
} as const;

/**
 * Streaming data prefixes
 */
export const STREAM_PREFIXES = {
  /** Prefix for data lines in SSE stream */
  DATA: "d:",

  /** Prefix for JSON data in SSE stream */
  JSON_DATA: "data: ",

  /** Length of JSON data prefix */
  JSON_DATA_LENGTH: 6,

  /** Offset for content extraction */
  CONTENT_OFFSET: 2,
} as const;

/**
 * Opacity values for UI states
 */
export const OPACITY = {
  /** Opacity for visible touch device actions */
  TOUCH_VISIBLE: 0.7,

  /** Opacity for active touch state */
  TOUCH_ACTIVE: 1.0,

  /** Opacity for hidden hover actions */
  HOVER_HIDDEN: 0,

  /** Opacity for visible hover actions */
  HOVER_VISIBLE: 1.0,
} as const;
