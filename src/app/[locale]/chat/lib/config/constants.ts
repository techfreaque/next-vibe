/**
 * Chat UI Configuration Constants
 * Local constants for chat UI layout and behavior
 */

/**
 * Timing constants (in milliseconds)
 */
export const TIMING = {
  /** Delay for message editor focus (ms) */
  MESSAGE_EDITOR_FOCUS_DELAY: 100,

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

