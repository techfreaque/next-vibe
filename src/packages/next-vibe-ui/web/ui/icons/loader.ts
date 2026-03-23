/**
 * Statically-analyzable icon loader.
 *
 * Uses a hardcoded switch of static await imports so both webpack (Next.js)
 * and Vite/TanStack can tree-shake and code-split per icon at build time.
 * Dynamic string imports (`./${name}.tsx`) are not statically analyzable
 * and cause build failures in strict compiler modes.
 */

import type { IconComponent } from "../../lib/helper";

type IconModule = Record<string, IconComponent>;

/**
 * Load a single icon module by its PascalCase name (e.g. "Folder", "Activity").
 * Returns the module's named exports so callers can do `mod[name]`.
 */
export async function loadIconModule(name: string): Promise<IconModule> {
  switch (name) {
    case "Activity":
      return import("./Activity") as Promise<IconModule>;
    case "AlertCircle":
      return import("./AlertCircle") as Promise<IconModule>;
    case "AlertTriangle":
      return import("./AlertTriangle") as Promise<IconModule>;
    case "Archive":
      return import("./Archive") as Promise<IconModule>;
    case "ArchiveRestore":
      return import("./ArchiveRestore") as Promise<IconModule>;
    case "ArrowBigDown":
      return import("./ArrowBigDown") as Promise<IconModule>;
    case "ArrowBigUp":
      return import("./ArrowBigUp") as Promise<IconModule>;
    case "ArrowDown":
      return import("./ArrowDown") as Promise<IconModule>;
    case "ArrowLeft":
      return import("./ArrowLeft") as Promise<IconModule>;
    case "ArrowLeftIcon":
      return import("./ArrowLeftIcon") as Promise<IconModule>;
    case "ArrowRight":
      return import("./ArrowRight") as Promise<IconModule>;
    case "ArrowRightIcon":
      return import("./ArrowRightIcon") as Promise<IconModule>;
    case "ArrowUp":
      return import("./ArrowUp") as Promise<IconModule>;
    case "Atom":
      return import("./Atom") as Promise<IconModule>;
    case "Award":
      return import("./Award") as Promise<IconModule>;
    case "Banknote":
      return import("./Banknote") as Promise<IconModule>;
    case "BarChart":
      return import("./BarChart") as Promise<IconModule>;
    case "BarChart2":
      return import("./BarChart2") as Promise<IconModule>;
    case "BarChart3":
      return import("./BarChart3") as Promise<IconModule>;
    case "BarChart3Icon":
      return import("./BarChart3Icon") as Promise<IconModule>;
    case "Bell":
      return import("./Bell") as Promise<IconModule>;
    case "BellOff":
      return import("./BellOff") as Promise<IconModule>;
    case "Bitcoin":
      return import("./Bitcoin") as Promise<IconModule>;
    case "Book":
      return import("./Book") as Promise<IconModule>;
    case "Bookmark":
      return import("./Bookmark") as Promise<IconModule>;
    case "BookOpen":
      return import("./BookOpen") as Promise<IconModule>;
    case "Bot":
      return import("./Bot") as Promise<IconModule>;
    case "Box":
      return import("./Box") as Promise<IconModule>;
    case "Brain":
      return import("./Brain") as Promise<IconModule>;
    case "Briefcase":
      return import("./Briefcase") as Promise<IconModule>;
    case "Brush":
      return import("./Brush") as Promise<IconModule>;
    case "Bug":
      return import("./Bug") as Promise<IconModule>;
    case "Building":
      return import("./Building") as Promise<IconModule>;
    case "Calendar":
      return import("./Calendar") as Promise<IconModule>;
    case "Camera":
      return import("./Camera") as Promise<IconModule>;
    case "Check":
      return import("./Check") as Promise<IconModule>;
    case "CheckCircle":
      return import("./CheckCircle") as Promise<IconModule>;
    case "CheckCircle2":
      return import("./CheckCircle2") as Promise<IconModule>;
    case "CheckIcon":
      return import("./CheckIcon") as Promise<IconModule>;
    case "ChevronDown":
      return import("./ChevronDown") as Promise<IconModule>;
    case "ChevronDownIcon":
      return import("./ChevronDownIcon") as Promise<IconModule>;
    case "ChevronLeft":
      return import("./ChevronLeft") as Promise<IconModule>;
    case "ChevronLeftIcon":
      return import("./ChevronLeftIcon") as Promise<IconModule>;
    case "ChevronRight":
      return import("./ChevronRight") as Promise<IconModule>;
    case "ChevronRightIcon":
      return import("./ChevronRightIcon") as Promise<IconModule>;
    case "ChevronsLeft":
      return import("./ChevronsLeft") as Promise<IconModule>;
    case "ChevronsRight":
      return import("./ChevronsRight") as Promise<IconModule>;
    case "ChevronUp":
      return import("./ChevronUp") as Promise<IconModule>;
    case "Circle":
      return import("./Circle") as Promise<IconModule>;
    case "CircleDashed":
      return import("./CircleDashed") as Promise<IconModule>;
    case "Clock":
      return import("./Clock") as Promise<IconModule>;
    case "Cloud":
      return import("./Cloud") as Promise<IconModule>;
    case "Code":
      return import("./Code") as Promise<IconModule>;
    case "Code2":
      return import("./Code2") as Promise<IconModule>;
    case "Coffee":
      return import("./Coffee") as Promise<IconModule>;
    case "Coins":
      return import("./Coins") as Promise<IconModule>;
    case "Compass":
      return import("./Compass") as Promise<IconModule>;
    case "Copy":
      return import("./Copy") as Promise<IconModule>;
    case "CornerDownRight":
      return import("./CornerDownRight") as Promise<IconModule>;
    case "Cpu":
      return import("./Cpu") as Promise<IconModule>;
    case "CreditCard":
      return import("./CreditCard") as Promise<IconModule>;
    case "Cross2Icon":
      return import("./Cross2Icon") as Promise<IconModule>;
    case "Crown":
      return import("./Crown") as Promise<IconModule>;
    case "DashIcon":
      return import("./DashIcon") as Promise<IconModule>;
    case "Database":
      return import("./Database") as Promise<IconModule>;
    case "DollarSign":
      return import("./DollarSign") as Promise<IconModule>;
    case "DotFilledIcon":
      return import("./DotFilledIcon") as Promise<IconModule>;
    case "DotsHorizontalIcon":
      return import("./DotsHorizontalIcon") as Promise<IconModule>;
    case "Download":
      return import("./Download") as Promise<IconModule>;
    case "DragHandleDots2Icon":
      return import("./DragHandleDots2Icon") as Promise<IconModule>;
    case "Dumbbell":
      return import("./Dumbbell") as Promise<IconModule>;
    case "Edit":
      return import("./Edit") as Promise<IconModule>;
    case "Edit2":
      return import("./Edit2") as Promise<IconModule>;
    case "ExternalLink":
      return import("./ExternalLink") as Promise<IconModule>;
    case "Eye":
      return import("./Eye") as Promise<IconModule>;
    case "EyeOff":
      return import("./EyeOff") as Promise<IconModule>;
    case "Facebook":
      return import("./Facebook") as Promise<IconModule>;
    case "FileCode":
      return import("./FileCode") as Promise<IconModule>;
    case "FilePlus":
      return import("./FilePlus") as Promise<IconModule>;
    case "FileText":
      return import("./FileText") as Promise<IconModule>;
    case "Film":
      return import("./Film") as Promise<IconModule>;
    case "Filter":
      return import("./Filter") as Promise<IconModule>;
    case "Flame":
      return import("./Flame") as Promise<IconModule>;
    case "Folder":
      return import("./Folder") as Promise<IconModule>;
    case "FolderClock":
      return import("./FolderClock") as Promise<IconModule>;
    case "FolderCode":
      return import("./FolderCode") as Promise<IconModule>;
    case "FolderGit":
      return import("./FolderGit") as Promise<IconModule>;
    case "FolderHeart":
      return import("./FolderHeart") as Promise<IconModule>;
    case "FolderIcon":
      return import("./FolderIcon") as Promise<IconModule>;
    case "FolderInput":
      return import("./FolderInput") as Promise<IconModule>;
    case "FolderOpen":
      return import("./FolderOpen") as Promise<IconModule>;
    case "FolderPen":
      return import("./FolderPen") as Promise<IconModule>;
    case "FolderPlus":
      return import("./FolderPlus") as Promise<IconModule>;
    case "FolderTree":
      return import("./FolderTree") as Promise<IconModule>;
    case "FolderX":
      return import("./FolderX") as Promise<IconModule>;
    case "Frame":
      return import("./Frame") as Promise<IconModule>;
    case "FreedomGptLogo":
      return import("./FreedomGptLogo") as Promise<IconModule>;
    case "GabAILogo":
      return import("./GabAILogo") as Promise<IconModule>;
    case "Gamepad":
      return import("./Gamepad") as Promise<IconModule>;
    case "Gift":
      return import("./Gift") as Promise<IconModule>;
    case "GitBranch":
      return import("./GitBranch") as Promise<IconModule>;
    case "GitFork":
      return import("./GitFork") as Promise<IconModule>;
    case "Globe":
      return import("./Globe") as Promise<IconModule>;
    case "GraduationCap":
      return import("./GraduationCap") as Promise<IconModule>;
    case "Grid3x3":
      return import("./Grid3x3") as Promise<IconModule>;
    case "Grip":
      return import("./Grip") as Promise<IconModule>;
    case "GripVertical":
      return import("./GripVertical") as Promise<IconModule>;
    case "Handshake":
      return import("./Handshake") as Promise<IconModule>;
    case "Hash":
      return import("./Hash") as Promise<IconModule>;
    case "Heart":
      return import("./Heart") as Promise<IconModule>;
    case "HelpCircle":
      return import("./HelpCircle") as Promise<IconModule>;
    case "History":
      return import("./History") as Promise<IconModule>;
    case "Home":
      return import("./Home") as Promise<IconModule>;
    case "Image":
      return import("./Image") as Promise<IconModule>;
    case "Inbox":
      return import("./Inbox") as Promise<IconModule>;
    case "Info":
      return import("./Info") as Promise<IconModule>;
    case "Instagram":
      return import("./Instagram") as Promise<IconModule>;
    case "Key":
      return import("./Key") as Promise<IconModule>;
    case "Keyboard":
      return import("./Keyboard") as Promise<IconModule>;
    case "Languages":
      return import("./Languages") as Promise<IconModule>;
    case "Laptop":
      return import("./Laptop") as Promise<IconModule>;
    case "Layers":
      return import("./Layers") as Promise<IconModule>;
    case "Layout":
      return import("./Layout") as Promise<IconModule>;
    case "LayoutTemplate":
      return import("./LayoutTemplate") as Promise<IconModule>;
    case "Leaf":
      return import("./Leaf") as Promise<IconModule>;
    case "Library":
      return import("./Library") as Promise<IconModule>;
    case "Lightbulb":
      return import("./Lightbulb") as Promise<IconModule>;
    case "LineChart":
      return import("./LineChart") as Promise<IconModule>;
    case "LineChartIcon":
      return import("./LineChartIcon") as Promise<IconModule>;
    case "Link":
      return import("./Link") as Promise<IconModule>;
    case "Link2":
      return import("./Link2") as Promise<IconModule>;
    case "Linkedin":
      return import("./Linkedin") as Promise<IconModule>;
    case "List":
      return import("./List") as Promise<IconModule>;
    case "Loader2":
      return import("./Loader2") as Promise<IconModule>;
    case "Lock":
      return import("./Lock") as Promise<IconModule>;
    case "LogIn":
      return import("./LogIn") as Promise<IconModule>;
    case "LogOut":
      return import("./LogOut") as Promise<IconModule>;
    case "MagnifyingGlassIcon":
      return import("./MagnifyingGlassIcon") as Promise<IconModule>;
    case "Mail":
      return import("./Mail") as Promise<IconModule>;
    case "MailOpen":
      return import("./MailOpen") as Promise<IconModule>;
    case "Map":
      return import("./Map") as Promise<IconModule>;
    case "Maximize":
      return import("./Maximize") as Promise<IconModule>;
    case "Megaphone":
      return import("./Megaphone") as Promise<IconModule>;
    case "Menu":
      return import("./Menu") as Promise<IconModule>;
    case "MessageCircle":
      return import("./MessageCircle") as Promise<IconModule>;
    case "MessageSquare":
      return import("./MessageSquare") as Promise<IconModule>;
    case "MessageSquarePlus":
      return import("./MessageSquarePlus") as Promise<IconModule>;
    case "Mic":
      return import("./Mic") as Promise<IconModule>;
    case "MicOff":
      return import("./MicOff") as Promise<IconModule>;
    case "Microscope":
      return import("./Microscope") as Promise<IconModule>;
    case "Minus":
      return import("./Minus") as Promise<IconModule>;
    case "Monitor":
      return import("./Monitor") as Promise<IconModule>;
    case "Moon":
      return import("./Moon") as Promise<IconModule>;
    case "MoonIcon":
      return import("./MoonIcon") as Promise<IconModule>;
    case "MoreHorizontal":
      return import("./MoreHorizontal") as Promise<IconModule>;
    case "MoreVertical":
      return import("./MoreVertical") as Promise<IconModule>;
    case "Mountain":
      return import("./Mountain") as Promise<IconModule>;
    case "MousePointer":
      return import("./MousePointer") as Promise<IconModule>;
    case "MousePointerClick":
      return import("./MousePointerClick") as Promise<IconModule>;
    case "Move":
      return import("./Move") as Promise<IconModule>;
    case "MoveLeft":
      return import("./MoveLeft") as Promise<IconModule>;
    case "Music":
      return import("./Music") as Promise<IconModule>;
    case "Navigation":
      return import("./Navigation") as Promise<IconModule>;
    case "Network":
      return import("./Network") as Promise<IconModule>;
    case "Newspaper":
      return import("./Newspaper") as Promise<IconModule>;
    case "Package":
      return import("./Package") as Promise<IconModule>;
    case "PackageCheck":
      return import("./PackageCheck") as Promise<IconModule>;
    case "PackagePlus":
      return import("./PackagePlus") as Promise<IconModule>;
    case "PackageX":
      return import("./PackageX") as Promise<IconModule>;
    case "Palette":
      return import("./Palette") as Promise<IconModule>;
    case "PanelLeft":
      return import("./PanelLeft") as Promise<IconModule>;
    case "PanelLeftClose":
      return import("./PanelLeftClose") as Promise<IconModule>;
    case "PanelLeftOpen":
      return import("./PanelLeftOpen") as Promise<IconModule>;
    case "Paperclip":
      return import("./Paperclip") as Promise<IconModule>;
    case "Pause":
      return import("./Pause") as Promise<IconModule>;
    case "PauseCircle":
      return import("./PauseCircle") as Promise<IconModule>;
    case "Pencil":
      return import("./Pencil") as Promise<IconModule>;
    case "PenTool":
      return import("./PenTool") as Promise<IconModule>;
    case "Phone":
      return import("./Phone") as Promise<IconModule>;
    case "PieChart":
      return import("./PieChart") as Promise<IconModule>;
    case "Pin":
      return import("./Pin") as Promise<IconModule>;
    case "PinOff":
      return import("./PinOff") as Promise<IconModule>;
    case "Plane":
      return import("./Plane") as Promise<IconModule>;
    case "Play":
      return import("./Play") as Promise<IconModule>;
    case "Plug":
      return import("./Plug") as Promise<IconModule>;
    case "Plus":
      return import("./Plus") as Promise<IconModule>;
    case "Printer":
      return import("./Printer") as Promise<IconModule>;
    case "Radio":
      return import("./Radio") as Promise<IconModule>;
    case "Receipt":
      return import("./Receipt") as Promise<IconModule>;
    case "RefreshCcw":
      return import("./RefreshCcw") as Promise<IconModule>;
    case "RefreshCw":
      return import("./RefreshCw") as Promise<IconModule>;
    case "Rocket":
      return import("./Rocket") as Promise<IconModule>;
    case "RotateCcw":
      return import("./RotateCcw") as Promise<IconModule>;
    case "Save":
      return import("./Save") as Promise<IconModule>;
    case "Scale":
      return import("./Scale") as Promise<IconModule>;
    case "Search":
      return import("./Search") as Promise<IconModule>;
    case "Send":
      return import("./Send") as Promise<IconModule>;
    case "Server":
      return import("./Server") as Promise<IconModule>;
    case "Settings":
      return import("./Settings") as Promise<IconModule>;
    case "Share":
      return import("./Share") as Promise<IconModule>;
    case "Share2":
      return import("./Share2") as Promise<IconModule>;
    case "Shield":
      return import("./Shield") as Promise<IconModule>;
    case "ShieldOff":
      return import("./ShieldOff") as Promise<IconModule>;
    case "ShieldPlus":
      return import("./ShieldPlus") as Promise<IconModule>;
    case "ShoppingBag":
      return import("./ShoppingBag") as Promise<IconModule>;
    case "ShoppingCart":
      return import("./ShoppingCart") as Promise<IconModule>;
    case "SiAlibabadotcom":
      return import("./SiAlibabadotcom") as Promise<IconModule>;
    case "SiAndroid":
      return import("./SiAndroid") as Promise<IconModule>;
    case "SiAnthropic":
      return import("./SiAnthropic") as Promise<IconModule>;
    case "SiApple":
      return import("./SiApple") as Promise<IconModule>;
    case "SiDiscord":
      return import("./SiDiscord") as Promise<IconModule>;
    case "SiDocker":
      return import("./SiDocker") as Promise<IconModule>;
    case "SiGit":
      return import("./SiGit") as Promise<IconModule>;
    case "SiGithub":
      return import("./SiGithub") as Promise<IconModule>;
    case "SiGo":
      return import("./SiGo") as Promise<IconModule>;
    case "SiGoogle":
      return import("./SiGoogle") as Promise<IconModule>;
    case "SiGooglegemini":
      return import("./SiGooglegemini") as Promise<IconModule>;
    case "SiJavascript":
      return import("./SiJavascript") as Promise<IconModule>;
    case "SiLinux":
      return import("./SiLinux") as Promise<IconModule>;
    case "SiMinimax":
      return import("./SiMinimax") as Promise<IconModule>;
    case "SiMistralai":
      return import("./SiMistralai") as Promise<IconModule>;
    case "SiNextdotjs":
      return import("./SiNextdotjs") as Promise<IconModule>;
    case "SiNodedotjs":
      return import("./SiNodedotjs") as Promise<IconModule>;
    case "SiOpenai":
      return import("./SiOpenai") as Promise<IconModule>;
    case "SiPython":
      return import("./SiPython") as Promise<IconModule>;
    case "SiReact":
      return import("./SiReact") as Promise<IconModule>;
    case "SiReddit":
      return import("./SiReddit") as Promise<IconModule>;
    case "SiRust":
      return import("./SiRust") as Promise<IconModule>;
    case "SiTypescript":
      return import("./SiTypescript") as Promise<IconModule>;
    case "SiX":
      return import("./SiX") as Promise<IconModule>;
    case "SiXiaomi":
      return import("./SiXiaomi") as Promise<IconModule>;
    case "SiZendesk":
      return import("./SiZendesk") as Promise<IconModule>;
    case "Smartphone":
      return import("./Smartphone") as Promise<IconModule>;
    case "Sparkle":
      return import("./Sparkle") as Promise<IconModule>;
    case "Sparkles":
      return import("./Sparkles") as Promise<IconModule>;
    case "Square":
      return import("./Square") as Promise<IconModule>;
    case "SquareCheck":
      return import("./SquareCheck") as Promise<IconModule>;
    case "Star":
      return import("./Star") as Promise<IconModule>;
    case "Sun":
      return import("./Sun") as Promise<IconModule>;
    case "Table":
      return import("./Table") as Promise<IconModule>;
    case "Tag":
      return import("./Tag") as Promise<IconModule>;
    case "Target":
      return import("./Target") as Promise<IconModule>;
    case "Terminal":
      return import("./Terminal") as Promise<IconModule>;
    case "TestTube":
      return import("./TestTube") as Promise<IconModule>;
    case "Theater":
      return import("./Theater") as Promise<IconModule>;
    case "ThumbsDown":
      return import("./ThumbsDown") as Promise<IconModule>;
    case "ThumbsUp":
      return import("./ThumbsUp") as Promise<IconModule>;
    case "Trash":
      return import("./Trash") as Promise<IconModule>;
    case "Trash2":
      return import("./Trash2") as Promise<IconModule>;
    case "TrendingDown":
      return import("./TrendingDown") as Promise<IconModule>;
    case "TrendingUp":
      return import("./TrendingUp") as Promise<IconModule>;
    case "TrendingUpIcon":
      return import("./TrendingUpIcon") as Promise<IconModule>;
    case "Trophy":
      return import("./Trophy") as Promise<IconModule>;
    case "Tv":
      return import("./Tv") as Promise<IconModule>;
    case "Twitter":
      return import("./Twitter") as Promise<IconModule>;
    case "Type":
      return import("./Type") as Promise<IconModule>;
    case "UncensoredAILogo":
      return import("./UncensoredAILogo") as Promise<IconModule>;
    case "Upload":
      return import("./Upload") as Promise<IconModule>;
    case "User":
      return import("./User") as Promise<IconModule>;
    case "UserCheck":
      return import("./UserCheck") as Promise<IconModule>;
    case "UserPlus":
      return import("./UserPlus") as Promise<IconModule>;
    case "Users":
      return import("./Users") as Promise<IconModule>;
    case "UserSearch":
      return import("./UserSearch") as Promise<IconModule>;
    case "UserX":
      return import("./UserX") as Promise<IconModule>;
    case "Utensils":
      return import("./Utensils") as Promise<IconModule>;
    case "VeniceAILogo":
      return import("./VeniceAILogo") as Promise<IconModule>;
    case "Video":
      return import("./Video") as Promise<IconModule>;
    case "Volume2":
      return import("./Volume2") as Promise<IconModule>;
    case "VolumeX":
      return import("./VolumeX") as Promise<IconModule>;
    case "Wallet":
      return import("./Wallet") as Promise<IconModule>;
    case "Wand2":
      return import("./Wand2") as Promise<IconModule>;
    case "Wifi":
      return import("./Wifi") as Promise<IconModule>;
    case "WifiOff":
      return import("./WifiOff") as Promise<IconModule>;
    case "Wind":
      return import("./Wind") as Promise<IconModule>;
    case "Wrench":
      return import("./Wrench") as Promise<IconModule>;
    case "X":
      return import("./X") as Promise<IconModule>;
    case "XCircle":
      return import("./XCircle") as Promise<IconModule>;
    case "XSquare":
      return import("./XSquare") as Promise<IconModule>;
    case "Youtube":
      return import("./Youtube") as Promise<IconModule>;
    case "Zap":
      return import("./Zap") as Promise<IconModule>;
    default:
      return Promise.resolve({});
  }
}
