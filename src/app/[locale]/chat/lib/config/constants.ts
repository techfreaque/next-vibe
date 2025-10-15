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
} as const;

/**
 * API configuration constants
 */
export const API_CONFIG = {
  /** Default temperature for AI responses */
  DEFAULT_TEMPERATURE: 0.7,

  /** Default max tokens for AI responses */
  DEFAULT_MAX_TOKENS: 2000,

  /** Maximum duration for streaming requests (seconds) */
  MAX_STREAM_DURATION: 30,
} as const;

/**
 * UI configuration constants
 */
export const UI_CONFIG = {
  /** Sidebar width when expanded (in pixels) */
  SIDEBAR_WIDTH: 256, // w-64 = 16rem = 256px

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
