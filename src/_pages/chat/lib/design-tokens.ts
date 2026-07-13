/**
 * Design tokens for chat interface
 * Cohesive blue gradient color system
 */

/* eslint-disable i18next/no-literal-string -- All strings are CSS class names and technical identifiers */

export const chatColors = {
  // Sidebar colors
  sidebar: {
    bg: "bg-slate-50 dark:bg-slate-950",
    hover: "hover:bg-blue-200 dark:hover:bg-blue-950",
    active: "bg-blue-200 dark:bg-blue-950",
    border: "border-slate-200 dark:border-slate-800",
  },

  // Message bubbles
  message: {
    user: "bg-blue-200 dark:bg-blue-950",
    assistant: "bg-white dark:bg-slate-900",
    error: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900",
  },
} as const;

export const chatShadows = {
  sm: "shadow-sm",
} as const;

export const chatAnimations = {
  slideIn: "animate-in slide-in-from-bottom-2 duration-300",
} as const;

export const chatTransitions = {
  colors: "transition-colors duration-200",
  default: "transition-all duration-200",
} as const;

export const chatProse = {
  all: "prose prose-sm dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-code:text-blue-600 dark:prose-code:text-blue-400",
} as const;
