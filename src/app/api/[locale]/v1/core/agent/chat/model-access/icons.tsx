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
/* eslint-disable @typescript-eslint/no-unused-vars -- exhaustive destructuring for type checking */
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
  FolderPlus,
  FreedomGptLogo,
  GabAILogo,
  Gamepad,
  Gift,
  GitBranch,
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
  Sparkles,
  Square,
  Star,
  Sun,
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
  "folder-open": FolderOpen,
  "folder-heart": FolderHeart,
  "folder-clock": FolderClock,
  "folder-code": FolderCode,
  "folder-git": FolderGit,
  briefcase: Briefcase,
  home: Home,
  star: Star,
  heart: Heart,
  sparkles: Sparkles,
  link: Link,
  bookmark: Bookmark,
  archive: Archive,
  inbox: Inbox,
  layers: Layers,
  package: Package,

  // AI & Technology
  brain: Brain,
  bot: Bot,
  cpu: Cpu,
  "si-openai": SiOpenai,
  terminal: Terminal,
  laptop: Laptop,
  monitor: Monitor,
  database: Database,
  bug: Bug,
  code: Code,
  network: Network,
  cloud: Cloud,
  wifi: Wifi,

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
  "message-circle": MessageCircle,
  users: Users,
  user: User,
  "si-reddit": SiReddit,
  "si-discord": SiDiscord,
  mail: Mail,
  phone: Phone,
  send: Send,
  share: Share,
  megaphone: Megaphone,
  bell: Bell,
  mic: Mic,
  video: Video,
  radio: Radio,

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

  // Finance & Business
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
  banknote: Banknote,
  wallet: Wallet,
  "shopping-bag": ShoppingBag,
  "pie-chart": PieChart,
  gift: Gift,

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
  "eye-off": EyeOff,
  shield: Shield,
  "shield-plus": ShieldPlus,
  "shield-off": ShieldOffIcon,

  // Actions & UI
  plus: Plus,
  edit: Edit,
  save: Save,
  download: Download,
  upload: Upload,
  search: Search,
  filter: Filter,
  settings: Settings,
  "arrow-right": ArrowRight,
  "check-circle": CheckCircle,
  "alert-circle": AlertCircle,
  info: Info,
  "help-circle": HelpCircle,
  "thumbs-up": ThumbsUp,
  pin: Pin,
  paperclip: Paperclip,
  "pen-tool": PenTool,

  // Time & Organization
  calendar: Calendar,
  clock: Clock,
  history: History,

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
  moon: MoonIcon,

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
