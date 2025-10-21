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

import {
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
} from "@icons-pack/react-simple-icons";
import {
  Activity,
  AlertCircle,
  Archive,
  ArrowRight,
  Atom,
  Award,
  Banknote,
  Bell,
  Book,
  Bookmark,
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  Bug,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Cloud,
  Code,
  Coffee,
  Compass,
  Cpu,
  Crown,
  Database,
  DollarSign,
  Download,
  Dumbbell,
  Edit,
  EyeOff,
  FileText,
  Film,
  Filter,
  Flame,
  Folder,
  FolderClock,
  FolderCode,
  FolderGit,
  FolderHeart,
  FolderOpen,
  Gamepad,
  Gift,
  GitBranch,
  Globe,
  GraduationCap,
  Hash,
  Heart,
  HelpCircle,
  History,
  Home,
  Image,
  Inbox,
  Info,
  Laptop,
  Layers,
  Leaf,
  Library,
  Lightbulb,
  Link,
  List,
  Lock,
  Mail,
  Map,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Mic,
  Microscope,
  Monitor,
  MoonIcon,
  Mountain,
  Music,
  Network,
  Newspaper,
  Package,
  Palette,
  Paperclip,
  PenTool,
  Phone,
  PieChart,
  Pin,
  Plane,
  Play,
  Plus,
  Radio,
  Rocket,
  Save,
  Scale,
  Search,
  Send,
  Settings,
  Share,
  Shield,
  ShieldOffIcon,
  ShieldPlus,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Tag,
  Target,
  Terminal,
  TestTube,
  ThumbsUp,
  TrendingUp,
  Trophy,
  Tv,
  Upload,
  User,
  Users,
  Utensils,
  Video,
  Volume2,
  Wallet,
  Wand2,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import React from "react";

/**
 * Type for React components that accept className prop
 * Explicitly includes all valid React component types
 */
export type IconComponent =
  | React.FC<{ className?: string }>
  | React.ComponentClass<{ className?: string }>
  | React.ForwardRefExoticComponent<
      React.PropsWithoutRef<{ className?: string }> &
        React.RefAttributes<HTMLElement>
    >;

/**
 * Special 1A icon component (defined outside registry due to JSX)
 */
/* eslint-disable i18next/no-literal-string -- Technical UI element, not user-facing text */
const OneAIcon: IconComponent = ({ className = "" }) => (
  <span
    className={cn(
      "text-lg font-bold leading-none flex items-center justify-center",
      "bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600",
      "bg-clip-text text-transparent",
      className,
    )}
  >
    1A
  </span>
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
  moon: MoonIcon,

  // News & Media
  newspaper: Newspaper,
  globe: Globe,
  scale: Scale,

  // Special: 1A icon (custom component)
  "1a": OneAIcon,
} as const;

/**
 * Type-safe union of all icon keys in the registry
 */
export type IconKey = keyof typeof ICON_REGISTRY;

/**
 * Union type for all possible icon values:
 * - string: Unicode/emoji (e.g., "🤖", "🎨") - includes IconKey strings
 * - IconComponent: React component with className prop
 *
 * Note: IconKey is a subset of string, so we don't need to include it separately
 */
export type IconValue = string | IconComponent;

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
      <span className={cn("text-base leading-none", className)}>
        {iconValue}
      </span>
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
