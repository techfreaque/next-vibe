/**
 * Chat UI Configuration Constants
 * Local constants for chat UI layout and behavior
 */

import { createContext, useContext } from "react";
import type { JSX, ReactNode } from "react";
import React from "react";

/**
 * Context for the current input overlay height, set by the chat layout and
 * read by ChatMessages to add bottom padding behind the floating input.
 * Supports nesting: each chat layout wraps its own subtree with a provider.
 */
// Default is 0: no provider = no overlay input = no bottom padding needed.
// Providers initialize at LAYOUT.DEFAULT_INPUT_HEIGHT (120) so SSR is sane
// before ResizeObserver fires on the client.
const InputHeightContext = createContext<number>(0);

export function InputHeightProvider({
  height,
  children,
}: {
  height: number;
  children: ReactNode;
}): JSX.Element {
  return (
    <InputHeightContext.Provider value={height}>
      {children}
    </InputHeightContext.Provider>
  );
}

export const useInputHeight = (): number => useContext(InputHeightContext);

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
