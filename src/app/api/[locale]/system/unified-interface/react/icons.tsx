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

/**
 * Type for React components that accept className prop
 */
export type IconComponent =
  | React.FC<{ className?: string }>
  | React.ComponentClass<{ className?: string }>;

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
  "si-anthropic": "SiAnthropic",
  "si-googlegemini": "SiGooglegemini",
  "si-mistralai": "SiMistralai",
  "si-x": "SiX",
  "si-zendesk": "SiZendesk",
  "si-alibabadotcom": "SiAlibabadotcom",
  "freedom-gpt-logo": "FreedomGptLogo",
  "gab-ai-logo": "GabAILogo",
  moon: "Moon",
  "moon-icon": "MoonIcon",

  // News & Media
  newspaper: "Newspaper",
  globe: "Globe",
  scale: "Scale",
} as const satisfies Record<string, string>;

/**
 * Type-safe union of all icon keys in the registry
 */
export type IconKey = keyof typeof ICON_REGISTRY;

/**
 * DB enum array for Zod/Drizzle
 */
export const IconKeyDB = Object.keys(ICON_REGISTRY) as readonly IconKey[];
