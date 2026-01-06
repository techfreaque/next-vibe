/**
 * Centralized Icon System with Lazy Loading
 *
 * This module provides a unified icon system that supports:
 * 1. Unicode/emoji strings (e.g., "🤖", "🎨")
 * 2. Icon keys from ICON_REGISTRY (type-safe, e.g., "lock", "users")
 * 3. React components with className prop
 * 4. Lazy loading - icons are only loaded when used
 *
 * All icon props (model, character, folder) use the same IconValue type.
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import React, { lazy, Suspense } from "react";

/**
 * Type for React components that accept className prop
 * Explicitly includes all valid React component types
 */
export type IconComponent =
  | React.FC<{ className?: string }>
  | React.ComponentClass<{ className?: string }>;

/**
 * Fallback component shown while icons are loading
 */
const IconLoadingFallback: React.FC<{ className?: string }> = ({ className }) => (
  <Span className={cn("inline-block w-4 h-4", className)} />
);

/**
 * Central lazy icon loader component
 * This component handles lazy loading of icons with Suspense boundary
 */
export const LazyIcon: React.FC<{
  iconName: string;
  className?: string;
}> = ({ iconName, className }) => {
  const IconComponent = React.useMemo(() => {
    return lazy(async () => {
      const icons = await import("next-vibe-ui/ui/icons");
      const Icon = icons[iconName as keyof typeof icons];

      if (!Icon || typeof Icon !== "function") {
        // Return a fallback component for invalid icons
        return {
          default: (({ className: cls }: { className?: string }) => (
            /* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Fallback indicator, not user-facing text */
            <Span className={cls}>?</Span>
          )) as React.ComponentType<{ className?: string }>,
        };
      }

      return {
        default: Icon as React.ComponentType<{ className?: string }>,
      };
    });
  }, [iconName]);

  return (
    <Suspense fallback={<IconLoadingFallback className={className} />}>
      <IconComponent className={className} />
    </Suspense>
  );
};

/**
 * Helper to create lazy-loaded icon components
 */
const createLazyIcon = (iconName: string): IconComponent => {
  const LazyIconWrapper: IconComponent = ({ className = "" }) => (
    <LazyIcon iconName={iconName} className={className} />
  );
  return LazyIconWrapper;
};

/**
 * Helper to create emoji icon components
 */
/* eslint-disable i18next/no-literal-string -- Emoji icons are universal symbols */
const createEmojiIcon = (emoji: string): IconComponent => {
  const EmojiIcon: IconComponent = ({ className = "" }) => (
    <Span className={cn("text-base leading-none", className)}>{emoji}</Span>
  );
  return EmojiIcon;
};
/* eslint-enable i18next/no-literal-string */

/**
 * Special 1A icon component (defined outside registry due to JSX)
 * Note: "1A" is a technical UI identifier, not user-facing text
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
 * Central icon registry mapping icon keys to lazy-loaded React components
 * All icons here can be referenced by their key in a type-safe way
 * Icons are lazy-loaded only when used
 */
export const ICON_REGISTRY = {
  // General folders & organization
  folder: createLazyIcon("Folder"),
  "folder-icon": createLazyIcon("FolderIcon"),
  "folder-open": createLazyIcon("FolderOpen"),
  "folder-heart": createLazyIcon("FolderHeart"),
  "folder-clock": createLazyIcon("FolderClock"),
  "folder-code": createLazyIcon("FolderCode"),
  "folder-git": createLazyIcon("FolderGit"),
  "folder-input": createLazyIcon("FolderInput"),
  "folder-pen": createLazyIcon("FolderPen"),
  "folder-plus": createLazyIcon("FolderPlus"),
  "folder-tree": createLazyIcon("FolderTree"),
  "folder-x": createLazyIcon("FolderX"),
  briefcase: createLazyIcon("Briefcase"),
  home: createLazyIcon("Home"),
  star: createLazyIcon("Star"),
  heart: createLazyIcon("Heart"),
  sparkle: createLazyIcon("Sparkle"),
  sparkles: createLazyIcon("Sparkles"),
  link: createLazyIcon("Link"),
  "link-2": createLazyIcon("Link2"),
  bookmark: createLazyIcon("Bookmark"),
  archive: createLazyIcon("Archive"),
  "archive-restore": createLazyIcon("ArchiveRestore"),
  inbox: createLazyIcon("Inbox"),
  layers: createLazyIcon("Layers"),
  package: createLazyIcon("Package"),
  "package-check": createLazyIcon("PackageCheck"),
  "package-plus": createLazyIcon("PackagePlus"),
  "package-x": createLazyIcon("PackageX"),
  box: createLazyIcon("Box"),
  pencil: createLazyIcon("Pencil"),

  // AI & Technology
  brain: createLazyIcon("Brain"),
  bot: createLazyIcon("Bot"),
  cpu: createLazyIcon("Cpu"),
  "si-openai": createLazyIcon("SiOpenai"),
  terminal: createLazyIcon("Terminal"),
  laptop: createLazyIcon("Laptop"),
  monitor: createLazyIcon("Monitor"),
  mobile: createLazyIcon("Smartphone"),
  database: createLazyIcon("Database"),
  bug: createLazyIcon("Bug"),
  code: createLazyIcon("Code"),
  "code-2": createLazyIcon("Code2"),
  "file-code": createLazyIcon("FileCode"),
  network: createLazyIcon("Network"),
  cloud: createLazyIcon("Cloud"),
  wifi: createLazyIcon("Wifi"),
  "wifi-off": createLazyIcon("WifiOff"),
  server: createLazyIcon("Server"),
  "git-fork": createLazyIcon("GitFork"),

  // Education & Learning
  book: createLazyIcon("Book"),
  "book-open": createLazyIcon("BookOpen"),
  library: createLazyIcon("Library"),
  "graduation-cap": createLazyIcon("GraduationCap"),
  microscope: createLazyIcon("Microscope"),
  "test-tube": createLazyIcon("TestTube"),
  atom: createLazyIcon("Atom"),
  target: createLazyIcon("Target"),

  // Communication & Social
  "message-square": createLazyIcon("MessageSquare"),
  "message-square-plus": createLazyIcon("MessageSquarePlus"),
  "message-circle": createLazyIcon("MessageCircle"),
  users: createLazyIcon("Users"),
  user: createLazyIcon("User"),
  "user-check": createLazyIcon("UserCheck"),
  "user-plus": createLazyIcon("UserPlus"),
  "user-x": createLazyIcon("UserX"),
  "user-search": createLazyIcon("UserSearch"),
  "si-reddit": createLazyIcon("SiReddit"),
  "si-discord": createLazyIcon("SiDiscord"),
  mail: createLazyIcon("Mail"),
  "mail-open": createLazyIcon("MailOpen"),
  phone: createLazyIcon("Phone"),
  send: createLazyIcon("Send"),
  share: createLazyIcon("Share"),
  "share-2": createLazyIcon("Share2"),
  megaphone: createLazyIcon("Megaphone"),
  bell: createLazyIcon("Bell"),
  mic: createLazyIcon("Mic"),
  "mic-off": createLazyIcon("MicOff"),
  video: createLazyIcon("Video"),
  radio: createLazyIcon("Radio"),
  facebook: createLazyIcon("Facebook"),
  instagram: createLazyIcon("Instagram"),
  linkedin: createLazyIcon("Linkedin"),
  theater: createLazyIcon("Theater"),
  twitter: createLazyIcon("Twitter"),
  youtube: createLazyIcon("Youtube"),
  handshake: createLazyIcon("Handshake"),

  // Science & Innovation
  rocket: createLazyIcon("Rocket"),
  lightbulb: createLazyIcon("Lightbulb"),
  zap: createLazyIcon("Zap"),
  wand: createLazyIcon("Wand2"),
  compass: createLazyIcon("Compass"),

  // Arts & Entertainment
  music: createLazyIcon("Music"),
  palette: createLazyIcon("Palette"),
  film: createLazyIcon("Film"),
  camera: createLazyIcon("Camera"),
  image: createLazyIcon("Image"),
  gamepad: createLazyIcon("Gamepad"),
  trophy: createLazyIcon("Trophy"),
  tv: createLazyIcon("Tv"),
  play: createLazyIcon("Play"),
  volume: createLazyIcon("Volume2"),
  "volume-2": createLazyIcon("Volume2"),
  "volume-x": createLazyIcon("VolumeX"),

  // Finance & Business
  "dollar-sign": createLazyIcon("DollarSign"),
  "trending-up": createLazyIcon("TrendingUp"),
  "trending-up-icon": createLazyIcon("TrendingUpIcon"),
  "trending-down": createLazyIcon("TrendingDown"),
  banknote: createLazyIcon("Banknote"),
  wallet: createLazyIcon("Wallet"),
  "shopping-bag": createLazyIcon("ShoppingBag"),
  "shopping-cart": createLazyIcon("ShoppingCart"),
  "pie-chart": createLazyIcon("PieChart"),
  "bar-chart": createLazyIcon("BarChart"),
  "bar-chart-3": createLazyIcon("BarChart3"),
  "bar-chart-3-icon": createLazyIcon("BarChart3Icon"),
  "line-chart": createLazyIcon("LineChart"),
  "line-chart-icon": createLazyIcon("LineChartIcon"),
  "credit-card": createLazyIcon("CreditCard"),
  gift: createLazyIcon("Gift"),
  coins: createLazyIcon("Coins"),
  bitcoin: createLazyIcon("Bitcoin"),
  building: createLazyIcon("Building"),
  receipt: createLazyIcon("Receipt"),

  // Lifestyle & Hobbies
  coffee: createLazyIcon("Coffee"),
  utensils: createLazyIcon("Utensils"),
  dumbbell: createLazyIcon("Dumbbell"),
  activity: createLazyIcon("Activity"),
  plane: createLazyIcon("Plane"),
  map: createLazyIcon("Map"),
  mountain: createLazyIcon("Mountain"),
  leaf: createLazyIcon("Leaf"),
  flame: createLazyIcon("Flame"),
  wind: createLazyIcon("Wind"),
  sun: createLazyIcon("Sun"),

  // Security & Privacy
  lock: createLazyIcon("Lock"),
  key: createLazyIcon("Key"),
  "eye-off": createLazyIcon("EyeOff"),
  shield: createLazyIcon("Shield"),
  "shield-plus": createLazyIcon("ShieldPlus"),
  "shield-off": createLazyIcon("ShieldOff"),
  "shield-off-icon": createLazyIcon("ShieldOffIcon"),

  // Actions & UI
  plus: createLazyIcon("Plus"),
  minus: createLazyIcon("Minus"),
  x: createLazyIcon("X"),
  "x-circle": createLazyIcon("XCircle"),
  check: createLazyIcon("Check"),
  "check-icon": createLazyIcon("CheckIcon"),
  "check-circle": createLazyIcon("CheckCircle"),
  "check-circle-2": createLazyIcon("CheckCircle2"),
  edit: createLazyIcon("Edit"),
  "edit-2": createLazyIcon("Edit2"),
  save: createLazyIcon("Save"),
  download: createLazyIcon("Download"),
  upload: createLazyIcon("Upload"),
  search: createLazyIcon("Search"),
  "magnifying-glass-icon": createLazyIcon("MagnifyingGlassIcon"),
  filter: createLazyIcon("Filter"),
  settings: createLazyIcon("Settings"),
  wrench: createLazyIcon("Wrench"),
  "alert-circle": createLazyIcon("AlertCircle"),
  "alert-triangle": createLazyIcon("AlertTriangle"),
  info: createLazyIcon("Info"),
  "help-circle": createLazyIcon("HelpCircle"),
  "thumbs-up": createLazyIcon("ThumbsUp"),
  "thumbs-down": createLazyIcon("ThumbsDown"),
  pin: createLazyIcon("Pin"),
  "pin-off": createLazyIcon("PinOff"),
  paperclip: createLazyIcon("Paperclip"),
  "pen-tool": createLazyIcon("PenTool"),
  brush: createLazyIcon("Brush"),
  copy: createLazyIcon("Copy"),
  "external-link": createLazyIcon("ExternalLink"),
  eye: createLazyIcon("Eye"),
  trash: createLazyIcon("Trash2"),
  "refresh-cw": createLazyIcon("RefreshCw"),
  "refresh-ccw": createLazyIcon("RefreshCcw"),
  "rotate-ccw": createLazyIcon("RotateCcw"),
  printer: createLazyIcon("Printer"),
  pause: createLazyIcon("Pause"),
  "pause-circle": createLazyIcon("PauseCircle"),
  square: createLazyIcon("Square"),
  "square-check": createLazyIcon("SquareCheck"),
  "x-square": createLazyIcon("XSquare"),
  circle: createLazyIcon("Circle"),
  "circle-dashed": createLazyIcon("CircleDashed"),
  move: createLazyIcon("Move"),
  maximize: createLazyIcon("Maximize"),
  keyboard: createLazyIcon("Keyboard"),
  "file-plus": createLazyIcon("FilePlus"),
  "bell-off": createLazyIcon("BellOff"),
  table: createLazyIcon("Table"),
  layout: createLazyIcon("Layout"),
  "layout-template": createLazyIcon("LayoutTemplate"),
  "panel-left": createLazyIcon("PanelLeft"),
  menu: createLazyIcon("Menu"),
  "more-horizontal": createLazyIcon("MoreHorizontal"),
  "more-vertical": createLazyIcon("MoreVertical"),
  "mouse-pointer": createLazyIcon("MousePointer"),
  "grip-vertical": createLazyIcon("GripVertical"),
  "grid-3x3": createLazyIcon("Grid3x3"),
  "log-out": createLazyIcon("LogOut"),
  "log-in": createLazyIcon("LogIn"),
  navigation: createLazyIcon("Navigation"),
  plug: createLazyIcon("Plug"),
  languages: createLazyIcon("Languages"),
  loader: createLazyIcon("Loader2"),
  "loader-2": createLazyIcon("Loader2"),

  // Time & Organization
  calendar: createLazyIcon("Calendar"),
  clock: createLazyIcon("Clock"),
  history: createLazyIcon("History"),

  // Navigation & Arrows
  "arrow-up": createLazyIcon("ArrowUp"),
  "arrow-down": createLazyIcon("ArrowDown"),
  "arrow-left": createLazyIcon("ArrowLeft"),
  "arrow-left-icon": createLazyIcon("ArrowLeftIcon"),
  "arrow-right": createLazyIcon("ArrowRight"),
  "arrow-right-icon": createLazyIcon("ArrowRightIcon"),
  "arrow-big-up": createLazyIcon("ArrowBigUp"),
  "arrow-big-down": createLazyIcon("ArrowBigDown"),
  "chevron-up": createLazyIcon("ChevronUp"),
  "chevron-down": createLazyIcon("ChevronDown"),
  "chevron-down-icon": createLazyIcon("ChevronDownIcon"),
  "chevron-left": createLazyIcon("ChevronLeft"),
  "chevron-left-icon": createLazyIcon("ChevronLeftIcon"),
  "chevron-right": createLazyIcon("ChevronRight"),
  "chevron-right-icon": createLazyIcon("ChevronRightIcon"),
  "chevrons-left": createLazyIcon("ChevronsLeft"),
  "chevrons-right": createLazyIcon("ChevronsRight"),
  "corner-down-right": createLazyIcon("CornerDownRight"),
  "move-left": createLazyIcon("MoveLeft"),
  "cross-2-icon": createLazyIcon("Cross2Icon"),
  "dash-icon": createLazyIcon("DashIcon"),
  "dot-filled-icon": createLazyIcon("DotFilledIcon"),
  "dots-horizontal-icon": createLazyIcon("DotsHorizontalIcon"),
  "drag-handle-dots-2-icon": createLazyIcon("DragHandleDots2Icon"),

  // Lists & Content
  list: createLazyIcon("List"),
  "file-text": createLazyIcon("FileText"),
  type: createLazyIcon("Type"),
  hash: createLazyIcon("Hash"),
  tag: createLazyIcon("Tag"),
  "git-branch": createLazyIcon("GitBranch"),

  // Awards & Recognition
  award: createLazyIcon("Award"),
  crown: createLazyIcon("Crown"),

  // Programming Languages
  "si-javascript": createLazyIcon("SiJavascript"),
  "si-typescript": createLazyIcon("SiTypescript"),
  "si-python": createLazyIcon("SiPython"),
  "si-rust": createLazyIcon("SiRust"),
  "si-go": createLazyIcon("SiGo"),

  // Frameworks & Tools
  "si-react": createLazyIcon("SiReact"),
  "si-nextdotjs": createLazyIcon("SiNextdotjs"),
  "si-nodejs": createLazyIcon("SiNodedotjs"),
  "si-docker": createLazyIcon("SiDocker"),
  "si-git": createLazyIcon("SiGit"),
  "si-github": createLazyIcon("SiGithub"),

  // Operating Systems & Platforms
  "si-linux": createLazyIcon("SiLinux"),
  "si-apple": createLazyIcon("SiApple"),
  "si-android": createLazyIcon("SiAndroid"),
  "si-google": createLazyIcon("SiGoogle"),

  // AI Providers
  "si-anthropic": createLazyIcon("SiAnthropic"),
  "si-googlegemini": createLazyIcon("SiGooglegemini"),
  "si-mistralai": createLazyIcon("SiMistralai"),
  "si-x": createLazyIcon("SiX"),
  "si-zendesk": createLazyIcon("SiZendesk"),
  "si-alibabadotcom": createLazyIcon("SiAlibabadotcom"),
  "freedom-gpt-logo": createLazyIcon("FreedomGptLogo"),
  "gab-ai-logo": createLazyIcon("GabAILogo"),
  moon: createLazyIcon("Moon"),
  "moon-icon": createLazyIcon("MoonIcon"),

  // News & Media
  newspaper: createLazyIcon("Newspaper"),
  globe: createLazyIcon("Globe"),
  scale: createLazyIcon("Scale"),

  // Special: 1A icon (custom component)
  "1a": OneAIcon,

  // Emoji Icons (AI Model Providers & Characters)
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
} as const;

/**
 * Type-safe union of all icon keys in the registry
 */
export type IconKey = keyof typeof ICON_REGISTRY;

/**
 * DB enum array for Zod/Drizzle
 */
export const IconKeyDB = Object.keys(ICON_REGISTRY) as readonly IconKey[];

/**
 * Union type for all possible icon values:
 * - IconKey: String keys from ICON_REGISTRY
 * - IconComponent: React component with className prop
 *
 * Note: At runtime, we also accept emoji strings via Zod validation
 */
export type IconValue = IconKey | IconComponent;

/**
 * Check if a value is an IconKey (exists in ICON_REGISTRY)
 */
export function isIconKey(value: string | IconComponent): value is IconKey {
  return typeof value === "string" && value in ICON_REGISTRY;
}

/**
 * Check if a value is an IconComponent (React component)
 */
export function isIconComponent(value: string | IconComponent): value is IconComponent {
  return typeof value === "function";
}

/**
 * Resolve an IconValue to a renderable React component
 *
 * @param iconValue - The icon value to resolve (string or IconComponent)
 * @returns React component that can be rendered with className prop
 */
export function getIconComponent(iconValue: IconValue): IconComponent {
  // String: check if it's an icon key or emoji
  if (typeof iconValue === "string") {
    // Icon key from registry
    if (isIconKey(iconValue)) {
      return ICON_REGISTRY[iconValue];
    }
    // Emoji/unicode string - wrap in component
    return ({ className = "" }) => (
      <Span className={cn("text-base leading-none", className)}>{iconValue}</Span>
    );
  }

  // Check if it's a React element (JSX) instead of a component
  if (React.isValidElement(iconValue)) {
    // Return a wrapper component that renders the element
    return () => iconValue as React.ReactElement;
  }

  // Not a string = React component (function, class, ForwardRef, etc.)
  // TypeScript ensures it's IconComponent, just return it
  return iconValue;
}
