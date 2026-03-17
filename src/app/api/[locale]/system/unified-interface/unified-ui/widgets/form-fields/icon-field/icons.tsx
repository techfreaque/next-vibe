/**
 * Centralized Icon System with Lazy Loading
 *
 * This module provides ONE unified Icon component that handles:
 * 1. Type-safe icon keys
 * 2. Unicode/emoji strings (e.g., "🤖", "🎨")
 * 3. React components with className prop
 * 4. Automatic lazy loading
 *
 * Usage: <Icon icon="folder" className="w-4 h-4" />
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import type * as IconsLibrary from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import type { TranslationKey } from "@/i18n/core/static-types";

/**
 * Type for React components that accept className prop
 */
export type IconComponent =
  | React.FC<{ className?: string }>
  | React.ComponentClass<{ className?: string }>;

/**
 * Type-safe icon names from the icon library
 */
type IconLibraryName = keyof typeof IconsLibrary;

/**
 * Icon loader function type
 */
type IconLoader = (name: string) => Promise<{ [key: string]: IconComponent }>;

/**
 * Lazy loader for a single icon by its PascalCase library name.
 * Using a function instead of a static map of 300 entries eliminates
 * the compile-time cost of registering 300 dynamic import() boundaries.
 */
const loadIcon: IconLoader = async (name: string) =>
  import(
    /* webpackMode: "lazy-once" */
    `next-vibe-ui/ui/icons/${name}`
  ) as Promise<{ [key: string]: IconComponent }>;

/**
 * Helper to create emoji icon components
 */
/* eslint-disable i18next/no-literal-string -- Emoji icons are universal symbols */
const createEmojiIcon = (emoji: string): IconComponent => {
  const EmojiIcon: IconComponent = ({ className = "" }) => (
    <Span className={cn("text-base leading-none", getFontSizeClass(className))}>
      {emoji}
    </Span>
  );
  return EmojiIcon;
};
/* eslint-enable i18next/no-literal-string */

function getFontSizeClass(classes: string): string {
  const match = classes.match(/[wh]-(\d+)/g);
  if (!match || match.length === 0) {
    return "";
  }

  const numbers = match.map((cls) => parseInt(cls.match(/\d+/)![0]));
  const avg = Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);

  const sizeMap: Record<number, string> = {
    1: "text-xs",
    2: "text-sm",
    3: "text-base",
    4: "text-lg",
    5: "text-xl",
    6: "text-2xl",
    7: "text-3xl",
    8: "text-4xl",
    9: "text-5xl",
    10: "text-6xl",
  };

  return sizeMap[avg] || "text-base";
}

/**
 * Special 1A icon component
 */
/* eslint-disable i18next/no-literal-string -- Technical UI element, not user-facing text */
const OneAIcon: IconComponent = ({ className = "" }) => (
  <Span
    className={cn(
      "text-lg font-bold leading-none flex items-center justify-center",
      "bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600",
      "bg-clip-text text-transparent",
      className,
    )}
  >
    {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
    1A
  </Span>
);
/* eslint-enable i18next/no-literal-string */

/**
 * Central icon registry - TYPE SAFE with exhaustive checking
 * Maps kebab-case keys to lazy-loaded icon component names or IconComponent instances
 */
export const ICON_REGISTRY = {
  // General folders & organization
  folder: "Folder",
  "folder-icon": "FolderIcon",
  "folder-open": "FolderOpen",
  "folder-heart": "FolderHeart",
  "folder-clock": "FolderClock",
  "folder-code": "FolderCode",
  "folder-git": "FolderGit",
  "folder-input": "FolderInput",
  "folder-pen": "FolderPen",
  "folder-plus": "FolderPlus",
  "folder-tree": "FolderTree",
  "folder-x": "FolderX",
  briefcase: "Briefcase",
  home: "Home",
  star: "Star",
  heart: "Heart",
  sparkle: "Sparkle",
  sparkles: "Sparkles",
  link: "Link",
  "link-2": "Link2",
  bookmark: "Bookmark",
  archive: "Archive",
  "archive-restore": "ArchiveRestore",
  inbox: "Inbox",
  layers: "Layers",
  package: "Package",
  "package-check": "PackageCheck",
  "package-plus": "PackagePlus",
  "package-x": "PackageX",
  box: "Box",
  pencil: "Pencil",

  // AI & Technology
  brain: "Brain",
  bot: "Bot",
  cpu: "Cpu",
  "si-openai": "SiOpenai",
  terminal: "Terminal",
  laptop: "Laptop",
  monitor: "Monitor",
  mobile: "Smartphone",
  database: "Database",
  bug: "Bug",
  code: "Code",
  "code-2": "Code2",
  "file-code": "FileCode",
  network: "Network",
  cloud: "Cloud",
  wifi: "Wifi",
  "wifi-off": "WifiOff",
  server: "Server",
  "git-fork": "GitFork",

  // Education & Learning
  book: "Book",
  "book-open": "BookOpen",
  library: "Library",
  "graduation-cap": "GraduationCap",
  microscope: "Microscope",
  "test-tube": "TestTube",
  atom: "Atom",
  target: "Target",

  // Communication & Social
  "message-square": "MessageSquare",
  "message-square-plus": "MessageSquarePlus",
  "message-circle": "MessageCircle",
  users: "Users",
  user: "User",
  "user-check": "UserCheck",
  "user-plus": "UserPlus",
  "user-x": "UserX",
  "user-search": "UserSearch",
  "si-reddit": "SiReddit",
  "si-discord": "SiDiscord",
  mail: "Mail",
  "mail-open": "MailOpen",
  phone: "Phone",
  send: "Send",
  share: "Share",
  "share-2": "Share2",
  megaphone: "Megaphone",
  bell: "Bell",
  mic: "Mic",
  "mic-off": "MicOff",
  video: "Video",
  radio: "Radio",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "Linkedin",
  theater: "Theater",
  twitter: "Twitter",
  youtube: "Youtube",
  handshake: "Handshake",

  // Science & Innovation
  rocket: "Rocket",
  lightbulb: "Lightbulb",
  zap: "Zap",
  wand: "Wand2",
  compass: "Compass",

  // Arts & Entertainment
  music: "Music",
  palette: "Palette",
  film: "Film",
  camera: "Camera",
  image: "Image",
  gamepad: "Gamepad",
  trophy: "Trophy",
  tv: "Tv",
  play: "Play",
  volume: "Volume2",
  "volume-2": "Volume2",
  "volume-x": "VolumeX",

  // Finance & Business
  "dollar-sign": "DollarSign",
  "trending-up": "TrendingUp",
  "trending-up-icon": "TrendingUpIcon",
  "trending-down": "TrendingDown",
  banknote: "Banknote",
  wallet: "Wallet",
  "shopping-bag": "ShoppingBag",
  "shopping-cart": "ShoppingCart",
  "pie-chart": "PieChart",
  "bar-chart": "BarChart",
  "bar-chart-2": "BarChart2",
  "bar-chart-3": "BarChart3",
  "bar-chart-3-icon": "BarChart3Icon",
  "line-chart": "LineChart",
  "line-chart-icon": "LineChartIcon",
  "credit-card": "CreditCard",
  gift: "Gift",
  coins: "Coins",
  bitcoin: "Bitcoin",
  building: "Building",
  receipt: "Receipt",

  // Lifestyle & Hobbies
  coffee: "Coffee",
  utensils: "Utensils",
  dumbbell: "Dumbbell",
  activity: "Activity",
  plane: "Plane",
  map: "Map",
  mountain: "Mountain",
  leaf: "Leaf",
  flame: "Flame",
  frame: "Frame",
  wind: "Wind",
  sun: "Sun",

  // Security & Privacy
  lock: "Lock",
  key: "Key",
  "eye-off": "EyeOff",
  shield: "Shield",
  "shield-plus": "ShieldPlus",
  "shield-off": "ShieldOff",

  // Actions & UI
  plus: "Plus",
  minus: "Minus",
  x: "X",
  "x-circle": "XCircle",
  check: "Check",
  "check-icon": "CheckIcon",
  "check-circle": "CheckCircle",
  "check-circle-2": "CheckCircle2",
  edit: "Edit",
  "edit-2": "Edit2",
  save: "Save",
  download: "Download",
  upload: "Upload",
  search: "Search",
  "magnifying-glass-icon": "MagnifyingGlassIcon",
  filter: "Filter",
  settings: "Settings",
  wrench: "Wrench",
  "alert-circle": "AlertCircle",
  "alert-triangle": "AlertTriangle",
  info: "Info",
  "help-circle": "HelpCircle",
  "thumbs-up": "ThumbsUp",
  "thumbs-down": "ThumbsDown",
  pin: "Pin",
  "pin-off": "PinOff",
  paperclip: "Paperclip",
  "pen-tool": "PenTool",
  brush: "Brush",
  copy: "Copy",
  "external-link": "ExternalLink",
  eye: "Eye",
  trash: "Trash2",
  "refresh-cw": "RefreshCw",
  "refresh-ccw": "RefreshCcw",
  "rotate-ccw": "RotateCcw",
  printer: "Printer",
  pause: "Pause",
  "pause-circle": "PauseCircle",
  square: "Square",
  "square-check": "SquareCheck",
  "x-square": "XSquare",
  circle: "Circle",
  "circle-dashed": "CircleDashed",
  move: "Move",
  maximize: "Maximize",
  keyboard: "Keyboard",
  "file-plus": "FilePlus",
  "bell-off": "BellOff",
  table: "Table",
  layout: "Layout",
  "layout-template": "LayoutTemplate",
  "panel-left": "PanelLeft",
  menu: "Menu",
  "more-horizontal": "MoreHorizontal",
  "more-vertical": "MoreVertical",
  "mouse-pointer": "MousePointer",
  "mouse-pointer-click": "MousePointerClick",
  grip: "Grip",
  "grip-vertical": "GripVertical",
  "grid-3x3": "Grid3x3",
  "log-out": "LogOut",
  "log-in": "LogIn",
  navigation: "Navigation",
  plug: "Plug",
  languages: "Languages",
  loader: "Loader2",
  "loader-2": "Loader2",

  // Time & Organization
  calendar: "Calendar",
  clock: "Clock",
  history: "History",

  // Navigation & Arrows
  "arrow-up": "ArrowUp",
  "arrow-down": "ArrowDown",
  "arrow-left": "ArrowLeft",
  "arrow-left-icon": "ArrowLeftIcon",
  "arrow-right": "ArrowRight",
  "arrow-right-icon": "ArrowRightIcon",
  "arrow-big-up": "ArrowBigUp",
  "arrow-big-down": "ArrowBigDown",
  "chevron-up": "ChevronUp",
  "chevron-down": "ChevronDown",
  "chevron-down-icon": "ChevronDownIcon",
  "chevron-left": "ChevronLeft",
  "chevron-left-icon": "ChevronLeftIcon",
  "chevron-right": "ChevronRight",
  "chevron-right-icon": "ChevronRightIcon",
  "chevrons-left": "ChevronsLeft",
  "chevrons-right": "ChevronsRight",
  "corner-down-right": "CornerDownRight",
  "move-left": "MoveLeft",
  "cross-2-icon": "Cross2Icon",
  "dash-icon": "DashIcon",
  "dot-filled-icon": "DotFilledIcon",
  "dots-horizontal-icon": "DotsHorizontalIcon",
  "drag-handle-dots-2-icon": "DragHandleDots2Icon",

  // Lists & Content
  list: "List",
  "file-text": "FileText",
  type: "Type",
  hash: "Hash",
  tag: "Tag",
  "git-branch": "GitBranch",

  // Awards & Recognition
  award: "Award",
  crown: "Crown",

  // Programming Languages
  "si-javascript": "SiJavascript",
  "si-typescript": "SiTypescript",
  "si-python": "SiPython",
  "si-rust": "SiRust",
  "si-go": "SiGo",

  // Frameworks & Tools
  "si-react": "SiReact",
  "si-nextdotjs": "SiNextdotjs",
  "si-nodejs": "SiNodedotjs",
  "si-docker": "SiDocker",
  "si-git": "SiGit",
  "si-github": "SiGithub",

  // Operating Systems & Platforms
  "si-linux": "SiLinux",
  "si-apple": "SiApple",
  "si-android": "SiAndroid",
  "si-google": "SiGoogle",

  // AI Providers
  "uncensored-ai": "UncensoredAILogo",
  "si-anthropic": "SiAnthropic",
  "si-googlegemini": "SiGooglegemini",
  "si-mistralai": "SiMistralai",
  "si-x": "SiX",
  "si-zendesk": "SiZendesk",
  "si-alibabadotcom": "SiAlibabadotcom",
  "freedom-gpt-logo": "FreedomGptLogo",
  "gab-ai-logo": "GabAILogo",
  "venice-ai-logo": "VeniceAILogo",
  moon: "Moon",
  "moon-icon": "MoonIcon",

  // News & Media
  newspaper: "Newspaper",
  globe: "Globe",
  scale: "Scale",

  // Special: 1A icon (custom component)
  "1a": OneAIcon,

  // Emoji Icons (AI Model Providers & Skills)
  whale: createEmojiIcon("🐋"),
  ocean: createEmojiIcon("🌊"),
  "robot-face": createEmojiIcon("🤖"),
  "speaking-head": createEmojiIcon("🗣️"),
  "smiling-devil": createEmojiIcon("😈"),
  gear: createEmojiIcon("⚙️"),
  eagle: createEmojiIcon("🦅"),
  scroll: createEmojiIcon("📜"),
  "thinking-face": createEmojiIcon("🤔"),
  "artist-palette": createEmojiIcon("🎨"),
  "sleeping-face": createEmojiIcon("💤"),
  salute: createEmojiIcon("o/"),
  "smiling-face": createEmojiIcon("😊"),
  "high-voltage": createEmojiIcon("⚡"),
  books: createEmojiIcon("📚"),
  fire: createEmojiIcon("🔥"),
  "glowing-star": createEmojiIcon("🌟"),
  "direct-hit": createEmojiIcon("🎯"),
  technologist: createEmojiIcon("👨‍💻"),
  locked: createEmojiIcon("🔒"),
  "globe-emoji": createEmojiIcon("🌍"),
  people: createEmojiIcon("👥"),
  "rocket-emoji": createEmojiIcon("🚀"),
  bulb: createEmojiIcon("💡"),
  "star-emoji": createEmojiIcon("⭐"),
  "mobile-phone": createEmojiIcon("📱"),
  "game-controller": createEmojiIcon("🎮"),
  general: createEmojiIcon("📦"),
  ai: createEmojiIcon("🤖"),
  education: createEmojiIcon("🎓"),
  communication: createEmojiIcon("💬"),
  science: createEmojiIcon("🔬"),
  arts: createEmojiIcon("🎨"),
  finance: createEmojiIcon("💰"),
  lifestyle: createEmojiIcon("☕"),
  security: createEmojiIcon("🔒"),
  programming: createEmojiIcon("💻"),
  platforms: createEmojiIcon("🖥️"),
  media: createEmojiIcon("📺"),
  special: createEmojiIcon("✨"),
  ui: createEmojiIcon("🖼️"),
  file: createEmojiIcon("📄"),
  files: createEmojiIcon("📋"),
  document: createEmojiIcon("📄"),
  success: createEmojiIcon("✓"),
  error: createEmojiIcon("❌"),
  alert: createEmojiIcon("⚠️"),
  warning: createEmojiIcon("⚠️"),
  tool: createEmojiIcon("🔧"),
  outbox: createEmojiIcon("📤"),
  wand2: createEmojiIcon("🪄"),
} satisfies Record<string, IconLibraryName | IconComponent>;

/**
 * Type-safe union of all icon keys in the registry
 */
export type IconKey = keyof typeof ICON_REGISTRY;

/**
 * DB enum array for Zod/Drizzle
 */
export const IconKeyDB = Object.keys(ICON_REGISTRY) as readonly IconKey[];

/**
 * Fallback component shown while icons are loading
 */
const IconLoadingFallback: React.FC<{ className?: string }> = ({
  className,
}) => <Span className={cn("inline-block w-4 h-4", className)} />;

/**
 * THE Icon component - use this everywhere
 * Handles lazy loading automatically
 *
 * @example
 * ```tsx
 * <Icon icon="folder" className="w-4 h-4" />
 * <Icon icon="🎨" className="w-4 h-4" />
 * ```
 */
export const Icon: React.FC<{
  icon: IconKey;
  className?: string;
}> = ({ icon, className }) => {
  const [LoadedIcon, setLoadedIcon] = useState<IconComponent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const registryValue = ICON_REGISTRY[icon];

  // Load icon component from library
  useEffect(() => {
    // Only lazy load if it's a string component name from registry
    if (typeof registryValue !== "string") {
      setLoadedIcon(null);
      return;
    }

    setIsLoading(true);
    setLoadedIcon(null);

    (async (): Promise<void> => {
      try {
        const iconModule = await loadIcon(registryValue);
        const IconComp = iconModule[registryValue as IconLibraryName];

        if (!IconComp) {
          setLoadedIcon(
            () =>
              ({ className: cls }: { className?: string }): JSX.Element => (
                /* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Fallback indicator */
                <Span className={cls}>??</Span>
              ),
          );
        } else {
          setLoadedIcon(() => IconComp as IconComponent);
        }
      } catch {
        // Error fallback
        setLoadedIcon(
          () =>
            ({ className: cls }: { className?: string }): JSX.Element => (
              /* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Error indicator */
              <Span className={cls}>!</Span>
            ),
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [registryValue]);

  // Handle component from registry (emoji or special)
  if (registryValue && typeof registryValue !== "string") {
    const IconComponent = registryValue;
    return <IconComponent className={className} />;
  }

  // Handle lazy-loaded icon
  if (LoadedIcon) {
    return <LoadedIcon className={className} />;
  }

  // Loading state
  if (isLoading) {
    return <IconLoadingFallback className={className} />;
  }

  // Fallback
  return <IconLoadingFallback className={className} />;
};

/**
 * Icon categories for better organization
 * Maps category names to their icon keys
 * Used by IconPicker and other components
 */
export const ICON_CATEGORIES = {
  all: {
    name: "app.ui.iconPicker.categories.all",
    icons: Object.keys(ICON_REGISTRY) as IconKey[],
  },
  general: {
    name: "app.ui.iconPicker.categories.general",
    icons: [
      "folder",
      "folder-open",
      "folder-heart",
      "folder-clock",
      "folder-code",
      "folder-git",
      "folder-icon",
      "folder-input",
      "folder-pen",
      "folder-plus",
      "folder-tree",
      "folder-x",
      "briefcase",
      "home",
      "star",
      "heart",
      "sparkles",
      "link",
      "link-2",
      "bookmark",
      "archive",
      "archive-restore",
      "inbox",
      "layers",
      "package",
      "package-check",
      "package-plus",
      "package-x",
      "box",
      "plus",
      "minus",
      "x",
      "x-circle",
      "check",
      "check-icon",
      "check-circle",
      "check-circle-2",
      "edit",
      "edit-2",
      "pencil",
      "save",
      "download",
      "upload",
      "search",
      "magnifying-glass-icon",
      "filter",
      "settings",
      "wrench",
      "alert-circle",
      "alert-triangle",
      "info",
      "help-circle",
      "thumbs-up",
      "thumbs-down",
      "pin",
      "pin-off",
      "paperclip",
      "pen-tool",
      "brush",
      "copy",
      "external-link",
      "eye",
      "trash",
      "refresh-cw",
      "refresh-ccw",
      "rotate-ccw",
      "printer",
      "pause",
      "pause-circle",
      "play",
      "square",
      "square-check",
      "x-square",
      "circle",
      "circle-dashed",
      "move",
      "maximize",
    ],
  },
  ai: {
    name: "app.ui.iconPicker.categories.ai",
    icons: [
      "brain",
      "bot",
      "cpu",
      "si-openai",
      "terminal",
      "laptop",
      "monitor",
      "database",
      "bug",
      "code",
      "code-2",
      "network",
      "cloud",
      "robot-face",
      "mobile",
      "wifi",
      "wifi-off",
      "server",
    ],
  },
  education: {
    name: "app.ui.iconPicker.categories.education",
    icons: [
      "book",
      "book-open",
      "library",
      "graduation-cap",
      "microscope",
      "test-tube",
      "atom",
      "target",
      "books",
    ],
  },
  communication: {
    name: "app.ui.iconPicker.categories.communication",
    icons: [
      "message-square",
      "message-circle",
      "message-square-plus",
      "users",
      "user",
      "user-check",
      "user-plus",
      "user-x",
      "user-search",
      "si-reddit",
      "si-discord",
      "mail",
      "mail-open",
      "phone",
      "send",
      "share",
      "share-2",
      "megaphone",
      "bell",
      "bell-off",
      "mic",
      "mic-off",
      "video",
      "handshake",
    ],
  },
  science: {
    name: "app.ui.iconPicker.categories.science",
    icons: [
      "rocket",
      "lightbulb",
      "zap",
      "wand",
      "compass",
      "microscope",
      "test-tube",
      "atom",
      "rocket-emoji",
    ],
  },
  arts: {
    name: "app.ui.iconPicker.categories.arts",
    icons: [
      "music",
      "palette",
      "film",
      "camera",
      "image",
      "gamepad",
      "trophy",
      "tv",
      "artist-palette",
      "radio",
      "theater",
      "play",
      "pause",
      "pause-circle",
      "volume",
      "volume-2",
      "volume-x",
    ],
  },
  finance: {
    name: "app.ui.iconPicker.categories.finance",
    icons: [
      "dollar-sign",
      "trending-up",
      "trending-up-icon",
      "trending-down",
      "banknote",
      "wallet",
      "shopping-cart",
      "shopping-bag",
      "pie-chart",
      "bar-chart",
      "bar-chart-2",
      "bar-chart-3",
      "bar-chart-3-icon",
      "line-chart",
      "line-chart-icon",
      "credit-card",
      "coins",
      "bitcoin",
      "gift",
      "building",
      "receipt",
    ],
  },
  lifestyle: {
    name: "app.ui.iconPicker.categories.lifestyle",
    icons: [
      "coffee",
      "utensils",
      "dumbbell",
      "activity",
      "plane",
      "map",
      "mountain",
      "leaf",
      "flame",
      "sun",
      "moon",
      "moon-icon",
      "wind",
    ],
  },
  security: {
    name: "app.ui.iconPicker.categories.security",
    icons: [
      "lock",
      "key",
      "eye",
      "eye-off",
      "shield",
      "shield-plus",
      "shield-off",
      "locked",
    ],
  },
  programming: {
    name: "app.ui.iconPicker.categories.programming",
    icons: [
      "si-javascript",
      "si-typescript",
      "si-python",
      "si-rust",
      "si-go",
      "si-react",
      "si-nextdotjs",
      "si-nodejs",
      "si-docker",
      "si-git",
      "si-github",
      "technologist",
      "file-code",
      "git-branch",
      "git-fork",
    ],
  },
  platforms: {
    name: "app.ui.iconPicker.categories.platforms",
    icons: [
      "si-linux",
      "si-apple",
      "si-android",
      "si-google",
      "facebook",
      "instagram",
      "linkedin",
      "twitter",
      "si-x",
      "youtube",
      "si-zendesk",
      "si-alibabadotcom",
    ],
  },
  aiProviders: {
    name: "app.ui.iconPicker.categories.aiProviders",
    icons: [
      "si-anthropic",
      "si-googlegemini",
      "si-mistralai",
      "si-openai",
      "freedom-gpt-logo",
      "gab-ai-logo",
      "venice-ai-logo",
    ],
  },
  media: {
    name: "app.ui.iconPicker.categories.media",
    icons: ["newspaper", "globe", "scale", "file-text", "file-plus"],
  },
  special: {
    name: "app.ui.iconPicker.categories.special",
    icons: [
      "1a",
      "sparkle",
      "fire",
      "glowing-star",
      "high-voltage",
      "star-emoji",
      "globe-emoji",
      "people",
      "bulb",
      "direct-hit",
      "mobile-phone",
      "game-controller",
    ],
  },
  navigation: {
    name: "app.ui.iconPicker.categories.navigation",
    icons: [
      "arrow-left",
      "arrow-left-icon",
      "arrow-right",
      "arrow-right-icon",
      "arrow-up",
      "arrow-down",
      "arrow-big-up",
      "arrow-big-down",
      "chevron-left",
      "chevron-left-icon",
      "chevron-right",
      "chevron-right-icon",
      "chevrons-left",
      "chevrons-right",
      "chevron-up",
      "chevron-down",
      "chevron-down-icon",
      "corner-down-right",
      "navigation",
      "move-left",
      "mouse-pointer",
      "mouse-pointer-click",
      "log-in",
      "log-out",
    ],
  },
  ui: {
    name: "app.ui.iconPicker.categories.ui",
    icons: [
      "menu",
      "more-horizontal",
      "more-vertical",
      "dots-horizontal-icon",
      "drag-handle-dots-2-icon",
      "cross-2-icon",
      "dash-icon",
      "dot-filled-icon",
      "grip",
      "grip-vertical",
      "panel-left",
      "layout",
      "layout-template",
      "grid-3x3",
      "table",
      "list",
      "calendar",
      "clock",
      "history",
      "loader-2",
      "plug",
      "keyboard",
      "type",
      "languages",
      "tag",
      "hash",
      "award",
      "crown",
    ],
  },
} satisfies Record<
  string,
  { readonly name: TranslationKey; readonly icons: IconKey[] }
>;

export const ICON_CATEGORIES_LIST = Object.entries(ICON_CATEGORIES) as [
  CategoryKey,
  (typeof ICON_CATEGORIES)[CategoryKey],
][];

export type CategoryKey = keyof typeof ICON_CATEGORIES;
