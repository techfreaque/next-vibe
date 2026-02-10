/**
 * Chat UI Configuration Constants
 * Local constants for chat UI layout and behavior
 */

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
 * Quote character for 4chan-style quoting
 */
export const QUOTE_CHARACTER = ">" as const;
