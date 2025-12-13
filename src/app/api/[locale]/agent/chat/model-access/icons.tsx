/**
 * Centralized Icon System
 *
 * This module provides a unified icon system that supports:
 * 1. Unicode/emoji strings (e.g., "🤖", "🎨")
 * 2. Icon keys from ICON_REGISTRY (type-safe, e.g., "lock", "users")
 * 3. React components with className prop
 *
 * All icon props (model, persona, folder) use the same IconValue type.
 */

import * as Icons from "next-vibe-ui/ui/icons";
const {
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  ArchiveRestore,
  ArrowBigDown,
  ArrowBigUp,
  ArrowDown,
  ArrowLeft,
  ArrowLeftIcon,
  ArrowRight,
  ArrowRightIcon,
  ArrowUp,
  Atom,
  Award,
  Banknote,
  BarChart3,
  BarChart3Icon,
  Bell,
  Bitcoin,
  Book,
  BookOpen,
  Bookmark,
  Bot,
  Box,
  Brain,
  Briefcase,
  Brush,
  Bug,
  Building,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  CheckCircle2,
  CheckIcon,
  ChevronDown,
  ChevronDownIcon,
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Circle,
  Clock,
  Cloud,
  Code,
  Code2,
  Coffee,
  Coins,
  Compass,
  Copy,
  CornerDownRight,
  Cpu,
  CreditCard,
  Cross2Icon,
  Crown,
  DashIcon,
  Database,
  DollarSign,
  DotFilledIcon,
  DotsHorizontalIcon,
  Download,
  DragHandleDots2Icon,
  Dumbbell,
  Edit,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Facebook,
  FileText,
  FileCode,
  Film,
  Filter,
  Flame,
  Folder,
  FolderClock,
  FolderCode,
  FolderGit,
  FolderHeart,
  FolderIcon,
  FolderInput,
  FolderOpen,
  FolderPen,
  FolderPlus,
  FolderTree,
  FolderX,
  FreedomGptLogo,
  GabAILogo,
  Gamepad,
  Gift,
  GitBranch,
  GitFork,
  Globe,
  GraduationCap,
  Grid3x3,
  GripVertical,
  Handshake,
  Hash,
  Heart,
  HelpCircle,
  History,
  Home,
  Image,
  Inbox,
  Info,
  Instagram,
  Laptop,
  Languages,
  Layers,
  Layout,
  LayoutTemplate,
  Leaf,
  Library,
  Lightbulb,
  LineChart,
  LineChartIcon,
  Link,
  Linkedin,
  List,
  Loader2,
  Lock,
  LogOut,
  MagnifyingGlassIcon,
  Mail,
  MailOpen,
  Map,
  Megaphone,
  Menu,
  MessageCircle,
  MessageSquare,
  MessageSquarePlus,
  Mic,
  MicOff,
  Microscope,
  Minus,
  Monitor,
  Moon,
  MoonIcon,
  MoreHorizontal,
  MoreVertical,
  Mountain,
  MousePointer,
  MoveLeft,
  Music,
  Navigation,
  Network,
  Newspaper,
  Package,
  PackageCheck,
  PackagePlus,
  PackageX,
  Palette,
  PanelLeft,
  Paperclip,
  Pause,
  PenTool,
  Phone,
  PieChart,
  Pin,
  PinOff,
  Plane,
  Play,
  Plus,
  Plug,
  Printer,
  Radio,
  RefreshCw,
  Rocket,
  RotateCcw,
  Save,
  Scale,
  Search,
  Send,
  Server,
  Settings,
  Share,
  Share2,
  Shield,
  ShieldOff,
  ShieldOffIcon,
  ShieldPlus,
  ShoppingBag,
  ShoppingCart,
  Sparkle,
  Sparkles,
  Square,
  Star,
  Sun,
  BarChart,
  BellOff,
  FilePlus,
  Key,
  Keyboard,
  LogIn,
  Maximize,
  Move,
  PauseCircle,
  Receipt,
  RefreshCcw,
  Smartphone,
  SquareCheck,
  UserSearch,
  XSquare,
  Table,
  Tag,
  Target,
  Terminal,
  TestTube,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingDown,
  TrendingUp,
  TrendingUpIcon,
  Trophy,
  Tv,
  Twitter,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  Utensils,
  Video,
  Volume2,
  VolumeX,
  Wallet,
  Wand2,
  Wifi,
  WifiOff,
  Wind,
  Wrench,
  X,
  XCircle,
  Youtube,
  Zap,
  SiAlibabadotcom,
  SiAndroid,
  SiAnthropic,
  SiApple,
  SiDiscord,
  SiDocker,
  SiGit,
  SiGithub,
  SiGo,
  SiGoogle,
  SiGooglegemini,
  SiJavascript,
  SiLinux,
  SiMistralai,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiReact,
  SiReddit,
  SiRust,
  SiTypescript,
  SiX,
  SiZendesk,
  ...exhaustiveCheck
} = Icons;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _exhaustiveCheck: Record<string, never> = exhaustiveCheck;

import { cn } from "next-vibe/shared/utils";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

/**
 * Type for React components that accept className prop
 * Explicitly includes all valid React component types
 */
export type IconComponent =
  | React.FC<{ className?: string }>
  | React.ComponentClass<{ className?: string }>;

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
 * Central icon registry mapping icon keys to React components
 * All icons here can be referenced by their key in a type-safe way
 */
export const ICON_REGISTRY = {
  // General folders & organization
  folder: Folder,
  "folder-icon": FolderIcon,
  "folder-open": FolderOpen,
  "folder-heart": FolderHeart,
  "folder-clock": FolderClock,
  "folder-code": FolderCode,
  "folder-git": FolderGit,
  "folder-input": FolderInput,
  "folder-pen": FolderPen,
  "folder-plus": FolderPlus,
  "folder-tree": FolderTree,
  "folder-x": FolderX,
  briefcase: Briefcase,
  home: Home,
  star: Star,
  heart: Heart,
  sparkle: Sparkle,
  sparkles: Sparkles,
  link: Link,
  bookmark: Bookmark,
  archive: Archive,
  "archive-restore": ArchiveRestore,
  inbox: Inbox,
  layers: Layers,
  package: Package,
  "package-check": PackageCheck,
  "package-plus": PackagePlus,
  "package-x": PackageX,
  box: Box,

  // AI & Technology
  brain: Brain,
  bot: Bot,
  cpu: Cpu,
  "si-openai": SiOpenai,
  terminal: Terminal,
  laptop: Laptop,
  monitor: Monitor,
  mobile: Smartphone,
  database: Database,
  bug: Bug,
  code: Code,
  "code-2": Code2,
  "file-code": FileCode,
  network: Network,
  cloud: Cloud,
  wifi: Wifi,
  "wifi-off": WifiOff,
  server: Server,
  "git-fork": GitFork,

  // Education & Learning
  book: Book,
  "book-open": BookOpen,
  library: Library,
  "graduation-cap": GraduationCap,
  microscope: Microscope,
  "test-tube": TestTube,
  atom: Atom,
  target: Target,

  // Communication & Social
  "message-square": MessageSquare,
  "message-square-plus": MessageSquarePlus,
  "message-circle": MessageCircle,
  users: Users,
  user: User,
  "user-check": UserCheck,
  "user-plus": UserPlus,
  "user-x": UserX,
  "user-search": UserSearch,
  "si-reddit": SiReddit,
  "si-discord": SiDiscord,
  mail: Mail,
  "mail-open": MailOpen,
  phone: Phone,
  send: Send,
  share: Share,
  "share-2": Share2,
  megaphone: Megaphone,
  bell: Bell,
  mic: Mic,
  "mic-off": MicOff,
  video: Video,
  radio: Radio,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  handshake: Handshake,

  // Science & Innovation
  rocket: Rocket,
  lightbulb: Lightbulb,
  zap: Zap,
  wand: Wand2,
  compass: Compass,

  // Arts & Entertainment
  music: Music,
  palette: Palette,
  film: Film,
  camera: Camera,
  image: Image,
  gamepad: Gamepad,
  trophy: Trophy,
  tv: Tv,
  play: Play,
  volume: Volume2,
  "volume-2": Volume2,
  "volume-x": VolumeX,

  // Finance & Business
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
  "trending-up-icon": TrendingUpIcon,
  "trending-down": TrendingDown,
  banknote: Banknote,
  wallet: Wallet,
  "shopping-bag": ShoppingBag,
  "shopping-cart": ShoppingCart,
  "pie-chart": PieChart,
  "bar-chart": BarChart,
  "bar-chart-3": BarChart3,
  "bar-chart-3-icon": BarChart3Icon,
  "line-chart": LineChart,
  "line-chart-icon": LineChartIcon,
  "credit-card": CreditCard,
  gift: Gift,
  coins: Coins,
  bitcoin: Bitcoin,
  building: Building,
  receipt: Receipt,

  // Lifestyle & Hobbies
  coffee: Coffee,
  utensils: Utensils,
  dumbbell: Dumbbell,
  activity: Activity,
  plane: Plane,
  map: Map,
  mountain: Mountain,
  leaf: Leaf,
  flame: Flame,
  wind: Wind,
  sun: Sun,

  // Security & Privacy
  lock: Lock,
  key: Key,
  "eye-off": EyeOff,
  shield: Shield,
  "shield-plus": ShieldPlus,
  "shield-off": ShieldOff,
  "shield-off-icon": ShieldOffIcon,

  // Actions & UI
  plus: Plus,
  minus: Minus,
  x: X,
  "x-circle": XCircle,
  check: Check,
  "check-icon": CheckIcon,
  "check-circle": CheckCircle,
  "check-circle-2": CheckCircle2,
  edit: Edit,
  "edit-2": Edit2,
  save: Save,
  download: Download,
  upload: Upload,
  search: Search,
  "magnifying-glass-icon": MagnifyingGlassIcon,
  filter: Filter,
  settings: Settings,
  wrench: Wrench,
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  info: Info,
  "help-circle": HelpCircle,
  "thumbs-up": ThumbsUp,
  "thumbs-down": ThumbsDown,
  pin: Pin,
  "pin-off": PinOff,
  paperclip: Paperclip,
  "pen-tool": PenTool,
  brush: Brush,
  copy: Copy,
  "external-link": ExternalLink,
  eye: Eye,
  trash: Trash2,
  "refresh-cw": RefreshCw,
  "refresh-ccw": RefreshCcw,
  "rotate-ccw": RotateCcw,
  printer: Printer,
  pause: Pause,
  "pause-circle": PauseCircle,
  square: Square,
  "square-check": SquareCheck,
  "x-square": XSquare,
  circle: Circle,
  move: Move,
  maximize: Maximize,
  keyboard: Keyboard,
  "file-plus": FilePlus,
  "bell-off": BellOff,
  table: Table,
  layout: Layout,
  "layout-template": LayoutTemplate,
  "panel-left": PanelLeft,
  menu: Menu,
  "more-horizontal": MoreHorizontal,
  "more-vertical": MoreVertical,
  "mouse-pointer": MousePointer,
  "grip-vertical": GripVertical,
  "grid-3x3": Grid3x3,
  "log-out": LogOut,
  "log-in": LogIn,
  navigation: Navigation,
  plug: Plug,
  languages: Languages,
  loader: Loader2,
  "loader-2": Loader2,

  // Time & Organization
  calendar: Calendar,
  clock: Clock,
  history: History,

  // Navigation & Arrows
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-left-icon": ArrowLeftIcon,
  "arrow-right": ArrowRight,
  "arrow-right-icon": ArrowRightIcon,
  "arrow-big-up": ArrowBigUp,
  "arrow-big-down": ArrowBigDown,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  "chevron-down-icon": ChevronDownIcon,
  "chevron-left": ChevronLeft,
  "chevron-left-icon": ChevronLeftIcon,
  "chevron-right": ChevronRight,
  "chevron-right-icon": ChevronRightIcon,
  "chevrons-left": ChevronsLeft,
  "chevrons-right": ChevronsRight,
  "corner-down-right": CornerDownRight,
  "move-left": MoveLeft,
  "cross-2-icon": Cross2Icon,
  "dash-icon": DashIcon,
  "dot-filled-icon": DotFilledIcon,
  "dots-horizontal-icon": DotsHorizontalIcon,
  "drag-handle-dots-2-icon": DragHandleDots2Icon,

  // Lists & Content
  list: List,
  "file-text": FileText,
  hash: Hash,
  tag: Tag,
  "git-branch": GitBranch,

  // Awards & Recognition
  award: Award,
  crown: Crown,

  // Programming Languages
  "si-javascript": SiJavascript,
  "si-typescript": SiTypescript,
  "si-python": SiPython,
  "si-rust": SiRust,
  "si-go": SiGo,

  // Frameworks & Tools
  "si-react": SiReact,
  "si-nextdotjs": SiNextdotjs,
  "si-nodejs": SiNodedotjs,
  "si-docker": SiDocker,
  "si-git": SiGit,
  "si-github": SiGithub,

  // Operating Systems & Platforms
  "si-linux": SiLinux,
  "si-apple": SiApple,
  "si-android": SiAndroid,
  "si-google": SiGoogle,

  // AI Providers
  "si-anthropic": SiAnthropic,
  "si-googlegemini": SiGooglegemini,
  "si-mistralai": SiMistralai,
  "si-x": SiX,
  "si-zendesk": SiZendesk,
  "si-alibabadotcom": SiAlibabadotcom,
  "freedom-gpt-logo": FreedomGptLogo,
  "gab-ai-logo": GabAILogo,
  moon: Moon,
  "moon-icon": MoonIcon,

  // News & Media
  newspaper: Newspaper,
  globe: Globe,
  scale: Scale,

  // Special: 1A icon (custom component)
  "1a": OneAIcon,

  // Emoji Icons (AI Model Providers & Personas)
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
export function isIconComponent(
  value: string | IconComponent,
): value is IconComponent {
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
      <Span className={cn("text-base leading-none", className)}>
        {iconValue}
      </Span>
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
