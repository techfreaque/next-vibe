/**
 * Design tokens for chat interface
 * Cohesive blue gradient color system
 */

/* eslint-disable i18next/no-literal-string -- All strings are CSS class names and technical identifiers */

export const chatColors = {
  // Primary blue gradients
  primary: {
    from: "from-blue-500",
    to: "to-blue-600",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
  },

  // Secondary blue gradients (lighter)
  secondary: {
    from: "from-blue-400",
    to: "to-indigo-500",
    gradient: "bg-gradient-to-br from-blue-400 to-indigo-500",
  },

  // Accent blue gradients (for highlights)
  accent: {
    from: "from-blue-50",
    to: "to-indigo-50",
    gradient: "bg-gradient-to-br from-blue-50 to-indigo-50",
    dark: "dark:from-blue-950/30 dark:to-indigo-950/30",
  },

  // Sidebar colors
  sidebar: {
    bg: "bg-slate-50 dark:bg-slate-950",
    hover: "hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
    active: "bg-blue-100/70 dark:bg-blue-900/30",
    border: "border-slate-200 dark:border-slate-800",
  },

  // Message bubbles
  message: {
    user: "bg-blue-100 dark:bg-blue-950",
    assistant: "bg-white dark:bg-slate-900",
    error: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900",
  },

  // UI elements
  ui: {
    border: "border-slate-200 dark:border-slate-800",
    borderSubtle: "border-slate-100 dark:border-slate-900",
    text: "text-slate-900 dark:text-slate-100",
    textMuted: "text-slate-600 dark:text-slate-400",
    textSubtle: "text-slate-500 dark:text-slate-500",
  },
} as const;

export const chatShadows = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg shadow-blue-500/10",
  xl: "shadow-xl shadow-blue-500/20",
} as const;

export const chatAnimations = {
  fadeIn: "animate-in fade-in duration-200",
  slideIn: "animate-in slide-in-from-bottom-2 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-200",
} as const;

export const chatTransitions = {
  default: "transition-all duration-200",
  fast: "transition-all duration-150",
  slow: "transition-all duration-300",
  colors: "transition-colors duration-200",
} as const;

export const chatProse = {
  base: "prose prose-sm dark:prose-invert max-w-none",
  headings: "prose-headings:text-slate-900 dark:prose-headings:text-slate-100",
  paragraphs: "prose-p:text-slate-700 dark:prose-p:text-slate-300",
  code: "prose-code:text-blue-600 dark:prose-code:text-blue-400",
  links: "prose-a:text-blue-600 dark:prose-a:text-blue-400",
  all: "prose prose-sm dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-code:text-blue-600 dark:prose-code:text-blue-400",
} as const;

