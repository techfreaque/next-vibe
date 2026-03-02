/**
 * CLI Icon System for Ink
 *
 * Maps icon keys to terminal-friendly emoji representations
 * Used in CLI widgets to display consistent icons
 */

import { type Text as InkText, Text } from "ink";
import type { ComponentProps, JSX } from "react";

import type { IconKey } from "./icons";

/**
 * Map of icon keys to emoji representations
 * Covers ALL 352+ icons from the React system
 */
export const CLI_ICONS: Record<IconKey, string> = {
  // Folders & Organization
  folder: "📁",
  "folder-icon": "📁",
  "folder-open": "📂",
  "folder-heart": "💝",
  "folder-clock": "🕐",
  "folder-code": "💻",
  "folder-git": "🔀",
  "folder-input": "📥",
  "folder-pen": "✏️",
  "folder-plus": "📁➕",
  "folder-tree": "🌳",
  "folder-x": "📁❌",
  briefcase: "💼",
  home: "🏠",
  star: "⭐",
  heart: "❤️",
  sparkle: "✨",
  sparkles: "✨",
  link: "🔗",
  "link-2": "🔗",
  bookmark: "🔖",
  archive: "📦",
  "archive-restore": "📦↩️",
  inbox: "📥",
  layers: "📚",
  package: "📦",
  "package-check": "📦✓",
  "package-plus": "📦➕",
  "package-x": "📦❌",
  box: "📦",
  pencil: "✏️",

  // AI & Technology
  brain: "🧠",
  bot: "🤖",
  cpu: "🖥️",
  "si-openai": "🤖",
  terminal: "💻",
  laptop: "💻",
  monitor: "🖥️",
  mobile: "📱",
  database: "💾",
  bug: "🐛",
  code: "💻",
  "code-2": "💻",
  "file-code": "📄",
  network: "🌐",
  cloud: "☁️",
  wifi: "📶",
  "wifi-off": "📶❌",
  server: "🖥️",
  "git-fork": "🔀",

  // Education & Learning
  book: "📖",
  "book-open": "📖",
  library: "📚",
  "graduation-cap": "🎓",
  microscope: "🔬",
  "test-tube": "🧪",
  atom: "⚛️",
  target: "🎯",

  // Communication & Social
  "message-square": "💬",
  "message-square-plus": "💬➕",
  "message-circle": "💬",
  users: "👥",
  user: "👤",
  "user-check": "👤✓",
  "user-plus": "👤➕",
  "user-x": "👤❌",
  "user-search": "🔍👤",
  "si-reddit": "🤖",
  "si-discord": "💬",
  mail: "✉️",
  "mail-open": "📧",
  phone: "📞",
  send: "📤",
  share: "↗️",
  "share-2": "↗️",
  megaphone: "📣",
  bell: "🔔",
  mic: "🎤",
  "mic-off": "🎤❌",
  video: "📹",
  radio: "📻",
  facebook: "📘",
  instagram: "📷",
  linkedin: "💼",
  theater: "🎭",
  twitter: "🐦",
  youtube: "📹",
  handshake: "🤝",

  // Science & Innovation
  rocket: "🚀",
  lightbulb: "💡",
  zap: "⚡",
  wand: "🪄",
  compass: "🧭",
  music: "🎵",
  palette: "🎨",
  film: "🎬",
  camera: "📷",
  image: "🖼️",
  gamepad: "🎮",
  trophy: "🏆",
  tv: "📺",
  play: "▶️",
  volume: "🔊",
  "volume-2": "🔊",
  "volume-x": "🔇",

  // Finance & Commerce
  "dollar-sign": "$",
  "trending-up": "📈",
  "trending-up-icon": "📈",
  "trending-down": "📉",
  banknote: "💵",
  wallet: "👛",
  "shopping-bag": "🛍️",
  "shopping-cart": "🛒",
  "pie-chart": "📊",
  "bar-chart": "📊",
  "bar-chart-2": "📊",
  "bar-chart-3": "📊",
  "bar-chart-3-icon": "📊",
  "line-chart": "📈",
  "line-chart-icon": "📈",
  "credit-card": "💳",
  gift: "🎁",
  coins: "💰",
  bitcoin: "₿",
  building: "🏢",
  receipt: "🧾",

  // Lifestyle & Activities
  coffee: "☕",
  utensils: "🍴",
  dumbbell: "🏋️",
  activity: "📊",
  plane: "✈️",
  map: "🗺️",
  mountain: "⛰️",
  leaf: "🍃",
  flame: "🔥",
  frame: "🖼️",
  wind: "💨",
  sun: "☀️",

  // Security & Access
  lock: "🔒",
  key: "🔑",
  "eye-off": "👁️❌",
  shield: "🛡️",
  "shield-plus": "🛡️➕",
  "shield-off": "🛡️❌",

  // Actions & Controls
  plus: "➕",
  minus: "➖",
  x: "❌",
  "x-circle": "❌",
  check: "✓",
  "check-icon": "✓",
  "check-circle": "✓",
  "check-circle-2": "✓",
  edit: "✏️",
  "edit-2": "✏️",
  save: "💾",
  download: "⬇️",
  upload: "⬆️",
  search: "🔍",
  "magnifying-glass-icon": "🔍",
  filter: "🔽",
  settings: "⚙️",
  wrench: "🔧",

  // Status & Alerts
  "alert-circle": "⚠️",
  "alert-triangle": "⚠️",
  info: "ℹ️",
  "help-circle": "❓",
  "thumbs-up": "👍",
  "thumbs-down": "👎",

  // Utilities
  pin: "📌",
  "pin-off": "📌❌",
  paperclip: "📎",
  "pen-tool": "✒️",
  brush: "🖌️",
  copy: "📋",
  "external-link": "🔗",
  eye: "👁️",
  trash: "🗑️",
  "refresh-cw": "🔄",
  "refresh-ccw": "🔄",
  "rotate-ccw": "↻",
  printer: "🖨️",
  pause: "⏸️",
  "pause-circle": "⏸️",

  // Shapes & Layout
  square: "⬜",
  "square-check": "☑️",
  "x-square": "❌",
  circle: "⭕",
  "circle-dashed": "⭕",
  move: "↔️",
  maximize: "⛶",

  // Input & Navigation
  keyboard: "⌨️",
  "file-plus": "📄➕",
  "bell-off": "🔕",
  table: "📋",
  layout: "▦",
  "layout-template": "▦",
  "panel-left": "◧",
  menu: "☰",
  "more-horizontal": "⋯",
  "more-vertical": "⋮",
  "mouse-pointer": "🖱️",
  "mouse-pointer-click": "🖱️",
  grip: "☰",
  "grip-vertical": "⋮",
  "grid-3x3": "▦",
  "log-out": "🚪",
  "log-in": "🚪",
  navigation: "🧭",
  plug: "🔌",
  languages: "🌐",
  loader: "⟳",
  "loader-2": "⟳",

  // Time & Calendar
  calendar: "📅",
  clock: "🕐",
  history: "🕐",

  // Arrows & Directions
  "arrow-up": "↑",
  "arrow-down": "↓",
  "arrow-left": "←",
  "arrow-left-icon": "←",
  "arrow-right": "→",
  "arrow-right-icon": "→",
  "arrow-big-up": "⬆️",
  "arrow-big-down": "⬇️",
  "chevron-up": "⌃",
  "chevron-down": "⌄",
  "chevron-down-icon": "⌄",
  "chevron-left": "⌃",
  "chevron-left-icon": "⌃",
  "chevron-right": "⌄",
  "chevron-right-icon": "⌄",
  "chevrons-left": "«",
  "chevrons-right": "»",
  "corner-down-right": "↴",
  "move-left": "←",

  // Special UI Elements
  "cross-2-icon": "✕",
  "dash-icon": "−",
  "dot-filled-icon": "●",
  "dots-horizontal-icon": "⋯",
  "drag-handle-dots-2-icon": "⋮",
  list: "≡",
  "file-text": "📄",
  type: "📝",
  hash: "#",
  tag: "🏷️",
  "git-branch": "🔀",
  award: "🏅",
  crown: "👑",

  // Programming Languages & Tools
  "si-javascript": "JS",
  "si-typescript": "TS",
  "si-python": "🐍",
  "si-rust": "🦀",
  "si-go": "Go",
  "si-react": "⚛️",
  "si-nextdotjs": "▲",
  "si-nodejs": "🟢",
  "si-docker": "🐳",
  "si-git": "🔀",
  "si-github": "🐙",
  "si-linux": "🐧",
  "si-apple": "🍎",
  "si-android": "🤖",
  "si-google": "🔍",
  "uncensored-ai": "🤖",
  "si-anthropic": "🤖",
  "si-googlegemini": "✨",
  "si-mistralai": "🌪️",
  "si-x": "✕",
  "si-zendesk": "💬",
  "si-alibabadotcom": "🛒",
  "freedom-gpt-logo": "🦅",
  "gab-ai-logo": "💬",
  "venice-ai-logo": "🌊",

  // Moon & Night
  moon: "🌙",
  "moon-icon": "🌙",

  // Media & News
  newspaper: "📰",
  globe: "🌐",
  scale: "⚖️",

  // Special Icons & Emojis
  "1a": "1A",
  whale: "🐋",
  ocean: "🌊",
  "robot-face": "🤖",
  "speaking-head": "🗣️",
  "smiling-devil": "😈",
  gear: "⚙️",
  eagle: "🦅",
  scroll: "📜",
  "thinking-face": "🤔",
  "artist-palette": "🎨",
  "sleeping-face": "😴",
  salute: "🫡",
  "smiling-face": "😊",
  "high-voltage": "⚡",
  books: "📚",
  fire: "🔥",
  "glowing-star": "🌟",
  "direct-hit": "🎯",
  technologist: "🧑‍💻",
  locked: "🔒",
  "globe-emoji": "🌐",
  people: "👥",
  "rocket-emoji": "🚀",
  bulb: "💡",
  "star-emoji": "⭐",
  "mobile-phone": "📱",
  "game-controller": "🎮",
  general: "📦",
  ai: "🤖",
  education: "🎓",
  communication: "💬",
  science: "🔬",
  arts: "🎨",
  finance: "💰",
  lifestyle: "☕",
  security: "🔒",
  programming: "💻",
  platforms: "🖥️",
  media: "📺",
  special: "✨",
  ui: "🖼️",
  file: "📄",
  files: "📋",
  document: "📄",
  success: "✓",
  error: "❌",
  alert: "⚠️",
  warning: "⚠️",
  tool: "🔧",
  outbox: "📤",
  wand2: "🪄",
};

/**
 * Get icon emoji by key
 * @param key Icon key
 * @param fallback Fallback emoji if key not found
 * @returns Emoji string
 */
export function getCliIcon(key: IconKey): string {
  return CLI_ICONS[key];
}

/**
 * Props for CliIcon component
 */
export interface CliIconProps extends Omit<
  ComponentProps<typeof InkText>,
  "children"
> {
  /** Icon key or direct emoji string */
  icon: IconKey;
  /** Fallback if icon not found */
  fallback?: string;
}

/**
 * CLI Icon component for Ink
 * Renders an emoji icon in the terminal
 *
 * @example
 * <CliIcon icon="folder" />
 * <CliIcon icon="chart-bar" color="blue" />
 * <CliIcon icon="✓" /> // Direct emoji also works
 */
export function CliIcon({ icon, ...textProps }: CliIconProps): JSX.Element {
  // Check if icon is already an emoji (starts with emoji range)
  const isDirectEmoji = /^[\u{1F300}-\u{1F9FF}]/u.test(icon);
  const emoji = isDirectEmoji ? icon : getCliIcon(icon);

  return <Text {...textProps}>{emoji}</Text>;
}
