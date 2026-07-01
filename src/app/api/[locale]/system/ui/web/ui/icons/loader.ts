/**
 * Statically-analyzable icon loader.
 *
 * Uses a hardcoded switch of static await imports so both webpack (Next.js)
 * and Vite/TanStack can tree-shake and code-split per icon at build time.
 * Dynamic string imports (`./${name}.tsx`) are not statically analyzable
 * and cause build failures in strict compiler modes.
 */

import type { IconComponent } from "next-vibe/ui/web/lib/helper";

type IconModule = Record<string, IconComponent>;

/**
 * Load a single icon module by its PascalCase name (e.g. "Folder", "Activity").
 * Returns the module's named exports so callers can do `mod[name]`.
 */
export async function loadIconModule(name: string): Promise<IconModule> {
  switch (name) {
    case "Activity":
      return import("next-vibe/ui/web/ui/icons/Activity") as Promise<IconModule>;
    case "AlertCircle":
      return import("next-vibe/ui/web/ui/icons/AlertCircle") as Promise<IconModule>;
    case "AlertTriangle":
      return import("next-vibe/ui/web/ui/icons/AlertTriangle") as Promise<IconModule>;
    case "Archive":
      return import("next-vibe/ui/web/ui/icons/Archive") as Promise<IconModule>;
    case "ArchiveRestore":
      return import("next-vibe/ui/web/ui/icons/ArchiveRestore") as Promise<IconModule>;
    case "ArrowBigDown":
      return import("next-vibe/ui/web/ui/icons/ArrowBigDown") as Promise<IconModule>;
    case "ArrowBigUp":
      return import("next-vibe/ui/web/ui/icons/ArrowBigUp") as Promise<IconModule>;
    case "ArrowDown":
      return import("next-vibe/ui/web/ui/icons/ArrowDown") as Promise<IconModule>;
    case "ArrowLeft":
      return import("next-vibe/ui/web/ui/icons/ArrowLeft") as Promise<IconModule>;
    case "ArrowLeftIcon":
      return import("next-vibe/ui/web/ui/icons/ArrowLeftIcon") as Promise<IconModule>;
    case "ArrowRight":
      return import("next-vibe/ui/web/ui/icons/ArrowRight") as Promise<IconModule>;
    case "ArrowRightIcon":
      return import("next-vibe/ui/web/ui/icons/ArrowRightIcon") as Promise<IconModule>;
    case "ArrowUp":
      return import("next-vibe/ui/web/ui/icons/ArrowUp") as Promise<IconModule>;
    case "Atom":
      return import("next-vibe/ui/web/ui/icons/Atom") as Promise<IconModule>;
    case "AtSign":
      return import("next-vibe/ui/web/ui/icons/AtSign") as Promise<IconModule>;
    case "Award":
      return import("next-vibe/ui/web/ui/icons/Award") as Promise<IconModule>;
    case "Banknote":
      return import("next-vibe/ui/web/ui/icons/Banknote") as Promise<IconModule>;
    case "BarChart":
      return import("next-vibe/ui/web/ui/icons/BarChart") as Promise<IconModule>;
    case "BarChart2":
      return import("next-vibe/ui/web/ui/icons/BarChart2") as Promise<IconModule>;
    case "BarChart3":
      return import("next-vibe/ui/web/ui/icons/BarChart3") as Promise<IconModule>;
    case "BarChart3Icon":
      return import("next-vibe/ui/web/ui/icons/BarChart3Icon") as Promise<IconModule>;
    case "Bell":
      return import("next-vibe/ui/web/ui/icons/Bell") as Promise<IconModule>;
    case "BellOff":
      return import("next-vibe/ui/web/ui/icons/BellOff") as Promise<IconModule>;
    case "Bitcoin":
      return import("next-vibe/ui/web/ui/icons/Bitcoin") as Promise<IconModule>;
    case "Book":
      return import("next-vibe/ui/web/ui/icons/Book") as Promise<IconModule>;
    case "Bookmark":
      return import("next-vibe/ui/web/ui/icons/Bookmark") as Promise<IconModule>;
    case "BookOpen":
      return import("next-vibe/ui/web/ui/icons/BookOpen") as Promise<IconModule>;
    case "Bot":
      return import("next-vibe/ui/web/ui/icons/Bot") as Promise<IconModule>;
    case "Box":
      return import("next-vibe/ui/web/ui/icons/Box") as Promise<IconModule>;
    case "Brain":
      return import("next-vibe/ui/web/ui/icons/Brain") as Promise<IconModule>;
    case "Briefcase":
      return import("next-vibe/ui/web/ui/icons/Briefcase") as Promise<IconModule>;
    case "Brush":
      return import("next-vibe/ui/web/ui/icons/Brush") as Promise<IconModule>;
    case "Bug":
      return import("next-vibe/ui/web/ui/icons/Bug") as Promise<IconModule>;
    case "Building":
      return import("next-vibe/ui/web/ui/icons/Building") as Promise<IconModule>;
    case "Calendar":
      return import("next-vibe/ui/web/ui/icons/Calendar") as Promise<IconModule>;
    case "Camera":
      return import("next-vibe/ui/web/ui/icons/Camera") as Promise<IconModule>;
    case "Check":
      return import("next-vibe/ui/web/ui/icons/Check") as Promise<IconModule>;
    case "CheckCircle":
      return import("next-vibe/ui/web/ui/icons/CheckCircle") as Promise<IconModule>;
    case "CheckCircle2":
      return import("next-vibe/ui/web/ui/icons/CheckCircle2") as Promise<IconModule>;
    case "CheckIcon":
      return import("next-vibe/ui/web/ui/icons/CheckIcon") as Promise<IconModule>;
    case "ChevronDown":
      return import("next-vibe/ui/web/ui/icons/ChevronDown") as Promise<IconModule>;
    case "ChevronDownIcon":
      return import("next-vibe/ui/web/ui/icons/ChevronDownIcon") as Promise<IconModule>;
    case "ChevronLeft":
      return import("next-vibe/ui/web/ui/icons/ChevronLeft") as Promise<IconModule>;
    case "ChevronLeftIcon":
      return import("next-vibe/ui/web/ui/icons/ChevronLeftIcon") as Promise<IconModule>;
    case "ChevronRight":
      return import("next-vibe/ui/web/ui/icons/ChevronRight") as Promise<IconModule>;
    case "ChevronRightIcon":
      return import("next-vibe/ui/web/ui/icons/ChevronRightIcon") as Promise<IconModule>;
    case "ChevronsLeft":
      return import("next-vibe/ui/web/ui/icons/ChevronsLeft") as Promise<IconModule>;
    case "ChevronsRight":
      return import("next-vibe/ui/web/ui/icons/ChevronsRight") as Promise<IconModule>;
    case "ChevronUp":
      return import("next-vibe/ui/web/ui/icons/ChevronUp") as Promise<IconModule>;
    case "Circle":
      return import("next-vibe/ui/web/ui/icons/Circle") as Promise<IconModule>;
    case "CircleDashed":
      return import("next-vibe/ui/web/ui/icons/CircleDashed") as Promise<IconModule>;
    case "Clock":
      return import("next-vibe/ui/web/ui/icons/Clock") as Promise<IconModule>;
    case "Cloud":
      return import("next-vibe/ui/web/ui/icons/Cloud") as Promise<IconModule>;
    case "Code":
      return import("next-vibe/ui/web/ui/icons/Code") as Promise<IconModule>;
    case "Code2":
      return import("next-vibe/ui/web/ui/icons/Code2") as Promise<IconModule>;
    case "Coffee":
      return import("next-vibe/ui/web/ui/icons/Coffee") as Promise<IconModule>;
    case "Coins":
      return import("next-vibe/ui/web/ui/icons/Coins") as Promise<IconModule>;
    case "Compass":
      return import("next-vibe/ui/web/ui/icons/Compass") as Promise<IconModule>;
    case "Copy":
      return import("next-vibe/ui/web/ui/icons/Copy") as Promise<IconModule>;
    case "CornerDownRight":
      return import("next-vibe/ui/web/ui/icons/CornerDownRight") as Promise<IconModule>;
    case "Cpu":
      return import("next-vibe/ui/web/ui/icons/Cpu") as Promise<IconModule>;
    case "CreditCard":
      return import("next-vibe/ui/web/ui/icons/CreditCard") as Promise<IconModule>;
    case "Cross2Icon":
      return import("next-vibe/ui/web/ui/icons/Cross2Icon") as Promise<IconModule>;
    case "Crown":
      return import("next-vibe/ui/web/ui/icons/Crown") as Promise<IconModule>;
    case "DashIcon":
      return import("next-vibe/ui/web/ui/icons/DashIcon") as Promise<IconModule>;
    case "Database":
      return import("next-vibe/ui/web/ui/icons/Database") as Promise<IconModule>;
    case "DollarSign":
      return import("next-vibe/ui/web/ui/icons/DollarSign") as Promise<IconModule>;
    case "DotFilledIcon":
      return import("next-vibe/ui/web/ui/icons/DotFilledIcon") as Promise<IconModule>;
    case "DotsHorizontalIcon":
      return import("next-vibe/ui/web/ui/icons/DotsHorizontalIcon") as Promise<IconModule>;
    case "Download":
      return import("next-vibe/ui/web/ui/icons/Download") as Promise<IconModule>;
    case "DragHandleDots2Icon":
      return import("next-vibe/ui/web/ui/icons/DragHandleDots2Icon") as Promise<IconModule>;
    case "Dumbbell":
      return import("next-vibe/ui/web/ui/icons/Dumbbell") as Promise<IconModule>;
    case "Edit":
      return import("next-vibe/ui/web/ui/icons/Edit") as Promise<IconModule>;
    case "Edit2":
      return import("next-vibe/ui/web/ui/icons/Edit2") as Promise<IconModule>;
    case "ExternalLink":
      return import("next-vibe/ui/web/ui/icons/ExternalLink") as Promise<IconModule>;
    case "Eye":
      return import("next-vibe/ui/web/ui/icons/Eye") as Promise<IconModule>;
    case "EyeOff":
      return import("next-vibe/ui/web/ui/icons/EyeOff") as Promise<IconModule>;
    case "Facebook":
      return import("next-vibe/ui/web/ui/icons/Facebook") as Promise<IconModule>;
    case "FileCode":
      return import("next-vibe/ui/web/ui/icons/FileCode") as Promise<IconModule>;
    case "FilePlus":
      return import("next-vibe/ui/web/ui/icons/FilePlus") as Promise<IconModule>;
    case "FileText":
      return import("next-vibe/ui/web/ui/icons/FileText") as Promise<IconModule>;
    case "Film":
      return import("next-vibe/ui/web/ui/icons/Film") as Promise<IconModule>;
    case "Filter":
      return import("next-vibe/ui/web/ui/icons/Filter") as Promise<IconModule>;
    case "Flame":
      return import("next-vibe/ui/web/ui/icons/Flame") as Promise<IconModule>;
    case "Folder":
      return import("next-vibe/ui/web/ui/icons/Folder") as Promise<IconModule>;
    case "FolderClock":
      return import("next-vibe/ui/web/ui/icons/FolderClock") as Promise<IconModule>;
    case "FolderCode":
      return import("next-vibe/ui/web/ui/icons/FolderCode") as Promise<IconModule>;
    case "FolderGit":
      return import("next-vibe/ui/web/ui/icons/FolderGit") as Promise<IconModule>;
    case "FolderHeart":
      return import("next-vibe/ui/web/ui/icons/FolderHeart") as Promise<IconModule>;
    case "FolderIcon":
      return import("next-vibe/ui/web/ui/icons/FolderIcon") as Promise<IconModule>;
    case "FolderInput":
      return import("next-vibe/ui/web/ui/icons/FolderInput") as Promise<IconModule>;
    case "FolderOpen":
      return import("next-vibe/ui/web/ui/icons/FolderOpen") as Promise<IconModule>;
    case "FolderPen":
      return import("next-vibe/ui/web/ui/icons/FolderPen") as Promise<IconModule>;
    case "FolderPlus":
      return import("next-vibe/ui/web/ui/icons/FolderPlus") as Promise<IconModule>;
    case "FolderTree":
      return import("next-vibe/ui/web/ui/icons/FolderTree") as Promise<IconModule>;
    case "FolderX":
      return import("next-vibe/ui/web/ui/icons/FolderX") as Promise<IconModule>;
    case "Frame":
      return import("next-vibe/ui/web/ui/icons/Frame") as Promise<IconModule>;
    case "FreedomGptLogo":
      return import("next-vibe/ui/web/ui/icons/FreedomGptLogo") as Promise<IconModule>;
    case "GabAILogo":
      return import("next-vibe/ui/web/ui/icons/GabAILogo") as Promise<IconModule>;
    case "Gamepad":
      return import("next-vibe/ui/web/ui/icons/Gamepad") as Promise<IconModule>;
    case "Gift":
      return import("next-vibe/ui/web/ui/icons/Gift") as Promise<IconModule>;
    case "GitBranch":
      return import("next-vibe/ui/web/ui/icons/GitBranch") as Promise<IconModule>;
    case "GitFork":
      return import("next-vibe/ui/web/ui/icons/GitFork") as Promise<IconModule>;
    case "Globe":
      return import("next-vibe/ui/web/ui/icons/Globe") as Promise<IconModule>;
    case "GraduationCap":
      return import("next-vibe/ui/web/ui/icons/GraduationCap") as Promise<IconModule>;
    case "Grid3x3":
      return import("next-vibe/ui/web/ui/icons/Grid3x3") as Promise<IconModule>;
    case "Grip":
      return import("next-vibe/ui/web/ui/icons/Grip") as Promise<IconModule>;
    case "GripVertical":
      return import("next-vibe/ui/web/ui/icons/GripVertical") as Promise<IconModule>;
    case "Handshake":
      return import("next-vibe/ui/web/ui/icons/Handshake") as Promise<IconModule>;
    case "Hash":
      return import("next-vibe/ui/web/ui/icons/Hash") as Promise<IconModule>;
    case "Heart":
      return import("next-vibe/ui/web/ui/icons/Heart") as Promise<IconModule>;
    case "HelpCircle":
      return import("next-vibe/ui/web/ui/icons/HelpCircle") as Promise<IconModule>;
    case "History":
      return import("next-vibe/ui/web/ui/icons/History") as Promise<IconModule>;
    case "Home":
      return import("next-vibe/ui/web/ui/icons/Home") as Promise<IconModule>;
    case "Image":
      return import("next-vibe/ui/web/ui/icons/Image") as Promise<IconModule>;
    case "Inbox":
      return import("next-vibe/ui/web/ui/icons/Inbox") as Promise<IconModule>;
    case "Info":
      return import("next-vibe/ui/web/ui/icons/Info") as Promise<IconModule>;
    case "Instagram":
      return import("next-vibe/ui/web/ui/icons/Instagram") as Promise<IconModule>;
    case "Key":
      return import("next-vibe/ui/web/ui/icons/Key") as Promise<IconModule>;
    case "Keyboard":
      return import("next-vibe/ui/web/ui/icons/Keyboard") as Promise<IconModule>;
    case "Languages":
      return import("next-vibe/ui/web/ui/icons/Languages") as Promise<IconModule>;
    case "Laptop":
      return import("next-vibe/ui/web/ui/icons/Laptop") as Promise<IconModule>;
    case "Layers":
      return import("next-vibe/ui/web/ui/icons/Layers") as Promise<IconModule>;
    case "Layout":
      return import("next-vibe/ui/web/ui/icons/Layout") as Promise<IconModule>;
    case "LayoutTemplate":
      return import("next-vibe/ui/web/ui/icons/LayoutTemplate") as Promise<IconModule>;
    case "Leaf":
      return import("next-vibe/ui/web/ui/icons/Leaf") as Promise<IconModule>;
    case "Library":
      return import("next-vibe/ui/web/ui/icons/Library") as Promise<IconModule>;
    case "Lightbulb":
      return import("next-vibe/ui/web/ui/icons/Lightbulb") as Promise<IconModule>;
    case "LineChart":
      return import("next-vibe/ui/web/ui/icons/LineChart") as Promise<IconModule>;
    case "LineChartIcon":
      return import("next-vibe/ui/web/ui/icons/LineChartIcon") as Promise<IconModule>;
    case "Link":
      return import("next-vibe/ui/web/ui/icons/Link") as Promise<IconModule>;
    case "Link2":
      return import("next-vibe/ui/web/ui/icons/Link2") as Promise<IconModule>;
    case "Linkedin":
      return import("next-vibe/ui/web/ui/icons/Linkedin") as Promise<IconModule>;
    case "List":
      return import("next-vibe/ui/web/ui/icons/List") as Promise<IconModule>;
    case "Loader2":
      return import("next-vibe/ui/web/ui/icons/Loader2") as Promise<IconModule>;
    case "Lock":
      return import("next-vibe/ui/web/ui/icons/Lock") as Promise<IconModule>;
    case "LogIn":
      return import("next-vibe/ui/web/ui/icons/LogIn") as Promise<IconModule>;
    case "LogOut":
      return import("next-vibe/ui/web/ui/icons/LogOut") as Promise<IconModule>;
    case "MagnifyingGlassIcon":
      return import("next-vibe/ui/web/ui/icons/MagnifyingGlassIcon") as Promise<IconModule>;
    case "Mail":
      return import("next-vibe/ui/web/ui/icons/Mail") as Promise<IconModule>;
    case "MailOpen":
      return import("next-vibe/ui/web/ui/icons/MailOpen") as Promise<IconModule>;
    case "Map":
      return import("next-vibe/ui/web/ui/icons/Map") as Promise<IconModule>;
    case "Maximize":
      return import("next-vibe/ui/web/ui/icons/Maximize") as Promise<IconModule>;
    case "Megaphone":
      return import("next-vibe/ui/web/ui/icons/Megaphone") as Promise<IconModule>;
    case "Menu":
      return import("next-vibe/ui/web/ui/icons/Menu") as Promise<IconModule>;
    case "MessageCircle":
      return import("next-vibe/ui/web/ui/icons/MessageCircle") as Promise<IconModule>;
    case "MessageSquare":
      return import("next-vibe/ui/web/ui/icons/MessageSquare") as Promise<IconModule>;
    case "MessageSquarePlus":
      return import("next-vibe/ui/web/ui/icons/MessageSquarePlus") as Promise<IconModule>;
    case "Mic":
      return import("next-vibe/ui/web/ui/icons/Mic") as Promise<IconModule>;
    case "MicOff":
      return import("next-vibe/ui/web/ui/icons/MicOff") as Promise<IconModule>;
    case "Microscope":
      return import("next-vibe/ui/web/ui/icons/Microscope") as Promise<IconModule>;
    case "Minus":
      return import("next-vibe/ui/web/ui/icons/Minus") as Promise<IconModule>;
    case "Monitor":
      return import("next-vibe/ui/web/ui/icons/Monitor") as Promise<IconModule>;
    case "Moon":
      return import("next-vibe/ui/web/ui/icons/Moon") as Promise<IconModule>;
    case "MoonIcon":
      return import("next-vibe/ui/web/ui/icons/MoonIcon") as Promise<IconModule>;
    case "MoreHorizontal":
      return import("next-vibe/ui/web/ui/icons/MoreHorizontal") as Promise<IconModule>;
    case "MoreVertical":
      return import("next-vibe/ui/web/ui/icons/MoreVertical") as Promise<IconModule>;
    case "Mountain":
      return import("next-vibe/ui/web/ui/icons/Mountain") as Promise<IconModule>;
    case "MousePointer":
      return import("next-vibe/ui/web/ui/icons/MousePointer") as Promise<IconModule>;
    case "MousePointerClick":
      return import("next-vibe/ui/web/ui/icons/MousePointerClick") as Promise<IconModule>;
    case "Move":
      return import("next-vibe/ui/web/ui/icons/Move") as Promise<IconModule>;
    case "MoveLeft":
      return import("next-vibe/ui/web/ui/icons/MoveLeft") as Promise<IconModule>;
    case "Music":
      return import("next-vibe/ui/web/ui/icons/Music") as Promise<IconModule>;
    case "Navigation":
      return import("next-vibe/ui/web/ui/icons/Navigation") as Promise<IconModule>;
    case "Network":
      return import("next-vibe/ui/web/ui/icons/Network") as Promise<IconModule>;
    case "Newspaper":
      return import("next-vibe/ui/web/ui/icons/Newspaper") as Promise<IconModule>;
    case "Package":
      return import("next-vibe/ui/web/ui/icons/Package") as Promise<IconModule>;
    case "PackageCheck":
      return import("next-vibe/ui/web/ui/icons/PackageCheck") as Promise<IconModule>;
    case "PackagePlus":
      return import("next-vibe/ui/web/ui/icons/PackagePlus") as Promise<IconModule>;
    case "PackageX":
      return import("next-vibe/ui/web/ui/icons/PackageX") as Promise<IconModule>;
    case "Palette":
      return import("next-vibe/ui/web/ui/icons/Palette") as Promise<IconModule>;
    case "PanelLeft":
      return import("next-vibe/ui/web/ui/icons/PanelLeft") as Promise<IconModule>;
    case "PanelLeftClose":
      return import("next-vibe/ui/web/ui/icons/PanelLeftClose") as Promise<IconModule>;
    case "PanelLeftOpen":
      return import("next-vibe/ui/web/ui/icons/PanelLeftOpen") as Promise<IconModule>;
    case "Paperclip":
      return import("next-vibe/ui/web/ui/icons/Paperclip") as Promise<IconModule>;
    case "Pause":
      return import("next-vibe/ui/web/ui/icons/Pause") as Promise<IconModule>;
    case "PauseCircle":
      return import("next-vibe/ui/web/ui/icons/PauseCircle") as Promise<IconModule>;
    case "Pencil":
      return import("next-vibe/ui/web/ui/icons/Pencil") as Promise<IconModule>;
    case "PenTool":
      return import("next-vibe/ui/web/ui/icons/PenTool") as Promise<IconModule>;
    case "Phone":
      return import("next-vibe/ui/web/ui/icons/Phone") as Promise<IconModule>;
    case "PieChart":
      return import("next-vibe/ui/web/ui/icons/PieChart") as Promise<IconModule>;
    case "Pin":
      return import("next-vibe/ui/web/ui/icons/Pin") as Promise<IconModule>;
    case "PinOff":
      return import("next-vibe/ui/web/ui/icons/PinOff") as Promise<IconModule>;
    case "Plane":
      return import("next-vibe/ui/web/ui/icons/Plane") as Promise<IconModule>;
    case "Play":
      return import("next-vibe/ui/web/ui/icons/Play") as Promise<IconModule>;
    case "Plug":
      return import("next-vibe/ui/web/ui/icons/Plug") as Promise<IconModule>;
    case "Plus":
      return import("next-vibe/ui/web/ui/icons/Plus") as Promise<IconModule>;
    case "Printer":
      return import("next-vibe/ui/web/ui/icons/Printer") as Promise<IconModule>;
    case "Radio":
      return import("next-vibe/ui/web/ui/icons/Radio") as Promise<IconModule>;
    case "Receipt":
      return import("next-vibe/ui/web/ui/icons/Receipt") as Promise<IconModule>;
    case "RefreshCcw":
      return import("next-vibe/ui/web/ui/icons/RefreshCcw") as Promise<IconModule>;
    case "RefreshCw":
      return import("next-vibe/ui/web/ui/icons/RefreshCw") as Promise<IconModule>;
    case "Rocket":
      return import("next-vibe/ui/web/ui/icons/Rocket") as Promise<IconModule>;
    case "RotateCcw":
      return import("next-vibe/ui/web/ui/icons/RotateCcw") as Promise<IconModule>;
    case "Repeat":
      return import("next-vibe/ui/web/ui/icons/Repeat") as Promise<IconModule>;
    case "Save":
      return import("next-vibe/ui/web/ui/icons/Save") as Promise<IconModule>;
    case "Scale":
      return import("next-vibe/ui/web/ui/icons/Scale") as Promise<IconModule>;
    case "Search":
      return import("next-vibe/ui/web/ui/icons/Search") as Promise<IconModule>;
    case "Send":
      return import("next-vibe/ui/web/ui/icons/Send") as Promise<IconModule>;
    case "Server":
      return import("next-vibe/ui/web/ui/icons/Server") as Promise<IconModule>;
    case "Settings":
      return import("next-vibe/ui/web/ui/icons/Settings") as Promise<IconModule>;
    case "Settings2":
      return import("next-vibe/ui/web/ui/icons/Settings2") as Promise<IconModule>;
    case "Share":
      return import("next-vibe/ui/web/ui/icons/Share") as Promise<IconModule>;
    case "Share2":
      return import("next-vibe/ui/web/ui/icons/Share2") as Promise<IconModule>;
    case "Shield":
      return import("next-vibe/ui/web/ui/icons/Shield") as Promise<IconModule>;
    case "ShieldOff":
      return import("next-vibe/ui/web/ui/icons/ShieldOff") as Promise<IconModule>;
    case "ShieldPlus":
      return import("next-vibe/ui/web/ui/icons/ShieldPlus") as Promise<IconModule>;
    case "ShoppingBag":
      return import("next-vibe/ui/web/ui/icons/ShoppingBag") as Promise<IconModule>;
    case "ShoppingCart":
      return import("next-vibe/ui/web/ui/icons/ShoppingCart") as Promise<IconModule>;
    case "Shuffle":
      return import("next-vibe/ui/web/ui/icons/Shuffle") as Promise<IconModule>;
    case "SiAlibabadotcom":
      return import("next-vibe/ui/web/ui/icons/SiAlibabadotcom") as Promise<IconModule>;
    case "SiAndroid":
      return import("next-vibe/ui/web/ui/icons/SiAndroid") as Promise<IconModule>;
    case "SiAnthropic":
      return import("next-vibe/ui/web/ui/icons/SiAnthropic") as Promise<IconModule>;
    case "SiBytedance":
      return import("next-vibe/ui/web/ui/icons/SiBytedance") as Promise<IconModule>;
    case "SiApple":
      return import("next-vibe/ui/web/ui/icons/SiApple") as Promise<IconModule>;
    case "SiDiscord":
      return import("next-vibe/ui/web/ui/icons/SiDiscord") as Promise<IconModule>;
    case "SiDocker":
      return import("next-vibe/ui/web/ui/icons/SiDocker") as Promise<IconModule>;
    case "SiGit":
      return import("next-vibe/ui/web/ui/icons/SiGit") as Promise<IconModule>;
    case "SiGithub":
      return import("next-vibe/ui/web/ui/icons/SiGithub") as Promise<IconModule>;
    case "SiGo":
      return import("next-vibe/ui/web/ui/icons/SiGo") as Promise<IconModule>;
    case "SiGoogle":
      return import("next-vibe/ui/web/ui/icons/SiGoogle") as Promise<IconModule>;
    case "SiGooglegemini":
      return import("next-vibe/ui/web/ui/icons/SiGooglegemini") as Promise<IconModule>;
    case "SiJavascript":
      return import("next-vibe/ui/web/ui/icons/SiJavascript") as Promise<IconModule>;
    case "SiLinux":
      return import("next-vibe/ui/web/ui/icons/SiLinux") as Promise<IconModule>;
    case "SiMinimax":
      return import("next-vibe/ui/web/ui/icons/SiMinimax") as Promise<IconModule>;
    case "SiMistralai":
      return import("next-vibe/ui/web/ui/icons/SiMistralai") as Promise<IconModule>;
    case "SiNextdotjs":
      return import("next-vibe/ui/web/ui/icons/SiNextdotjs") as Promise<IconModule>;
    case "SiNodedotjs":
      return import("next-vibe/ui/web/ui/icons/SiNodedotjs") as Promise<IconModule>;
    case "SiOpenai":
      return import("next-vibe/ui/web/ui/icons/SiOpenai") as Promise<IconModule>;
    case "SiPython":
      return import("next-vibe/ui/web/ui/icons/SiPython") as Promise<IconModule>;
    case "SiReact":
      return import("next-vibe/ui/web/ui/icons/SiReact") as Promise<IconModule>;
    case "SiReddit":
      return import("next-vibe/ui/web/ui/icons/SiReddit") as Promise<IconModule>;
    case "SiRust":
      return import("next-vibe/ui/web/ui/icons/SiRust") as Promise<IconModule>;
    case "SiTypescript":
      return import("next-vibe/ui/web/ui/icons/SiTypescript") as Promise<IconModule>;
    case "SiX":
      return import("next-vibe/ui/web/ui/icons/SiX") as Promise<IconModule>;
    case "SiXiaomi":
      return import("next-vibe/ui/web/ui/icons/SiXiaomi") as Promise<IconModule>;
    case "SiZendesk":
      return import("next-vibe/ui/web/ui/icons/SiZendesk") as Promise<IconModule>;
    case "Smartphone":
      return import("next-vibe/ui/web/ui/icons/Smartphone") as Promise<IconModule>;
    case "Sparkle":
      return import("next-vibe/ui/web/ui/icons/Sparkle") as Promise<IconModule>;
    case "Sparkles":
      return import("next-vibe/ui/web/ui/icons/Sparkles") as Promise<IconModule>;
    case "Square":
      return import("next-vibe/ui/web/ui/icons/Square") as Promise<IconModule>;
    case "SquareCheck":
      return import("next-vibe/ui/web/ui/icons/SquareCheck") as Promise<IconModule>;
    case "Star":
      return import("next-vibe/ui/web/ui/icons/Star") as Promise<IconModule>;
    case "Sun":
      return import("next-vibe/ui/web/ui/icons/Sun") as Promise<IconModule>;
    case "Table":
      return import("next-vibe/ui/web/ui/icons/Table") as Promise<IconModule>;
    case "Tag":
      return import("next-vibe/ui/web/ui/icons/Tag") as Promise<IconModule>;
    case "Target":
      return import("next-vibe/ui/web/ui/icons/Target") as Promise<IconModule>;
    case "Terminal":
      return import("next-vibe/ui/web/ui/icons/Terminal") as Promise<IconModule>;
    case "TestTube":
      return import("next-vibe/ui/web/ui/icons/TestTube") as Promise<IconModule>;
    case "Theater":
      return import("next-vibe/ui/web/ui/icons/Theater") as Promise<IconModule>;
    case "ThumbsDown":
      return import("next-vibe/ui/web/ui/icons/ThumbsDown") as Promise<IconModule>;
    case "ThumbsUp":
      return import("next-vibe/ui/web/ui/icons/ThumbsUp") as Promise<IconModule>;
    case "Trash":
      return import("next-vibe/ui/web/ui/icons/Trash") as Promise<IconModule>;
    case "Trash2":
      return import("next-vibe/ui/web/ui/icons/Trash2") as Promise<IconModule>;
    case "TrendingDown":
      return import("next-vibe/ui/web/ui/icons/TrendingDown") as Promise<IconModule>;
    case "TrendingUp":
      return import("next-vibe/ui/web/ui/icons/TrendingUp") as Promise<IconModule>;
    case "TrendingUpIcon":
      return import("next-vibe/ui/web/ui/icons/TrendingUpIcon") as Promise<IconModule>;
    case "Trophy":
      return import("next-vibe/ui/web/ui/icons/Trophy") as Promise<IconModule>;
    case "Tv":
      return import("next-vibe/ui/web/ui/icons/Tv") as Promise<IconModule>;
    case "Twitter":
      return import("next-vibe/ui/web/ui/icons/Twitter") as Promise<IconModule>;
    case "TayLogo":
      return import("next-vibe/ui/web/ui/icons/TayLogo") as Promise<IconModule>;
    case "Type":
      return import("next-vibe/ui/web/ui/icons/Type") as Promise<IconModule>;
    case "UncensoredAILogo":
      return import("next-vibe/ui/web/ui/icons/UncensoredAILogo") as Promise<IconModule>;
    case "Upload":
      return import("next-vibe/ui/web/ui/icons/Upload") as Promise<IconModule>;
    case "User":
      return import("next-vibe/ui/web/ui/icons/User") as Promise<IconModule>;
    case "UserCheck":
      return import("next-vibe/ui/web/ui/icons/UserCheck") as Promise<IconModule>;
    case "UserPlus":
      return import("next-vibe/ui/web/ui/icons/UserPlus") as Promise<IconModule>;
    case "Users":
      return import("next-vibe/ui/web/ui/icons/Users") as Promise<IconModule>;
    case "UserSearch":
      return import("next-vibe/ui/web/ui/icons/UserSearch") as Promise<IconModule>;
    case "UserX":
      return import("next-vibe/ui/web/ui/icons/UserX") as Promise<IconModule>;
    case "Utensils":
      return import("next-vibe/ui/web/ui/icons/Utensils") as Promise<IconModule>;
    case "VeniceAILogo":
      return import("next-vibe/ui/web/ui/icons/VeniceAILogo") as Promise<IconModule>;
    case "Video":
      return import("next-vibe/ui/web/ui/icons/Video") as Promise<IconModule>;
    case "Volume2":
      return import("next-vibe/ui/web/ui/icons/Volume2") as Promise<IconModule>;
    case "VolumeX":
      return import("next-vibe/ui/web/ui/icons/VolumeX") as Promise<IconModule>;
    case "Wallet":
      return import("next-vibe/ui/web/ui/icons/Wallet") as Promise<IconModule>;
    case "Wand2":
      return import("next-vibe/ui/web/ui/icons/Wand2") as Promise<IconModule>;
    case "Wifi":
      return import("next-vibe/ui/web/ui/icons/Wifi") as Promise<IconModule>;
    case "WifiOff":
      return import("next-vibe/ui/web/ui/icons/WifiOff") as Promise<IconModule>;
    case "Wind":
      return import("next-vibe/ui/web/ui/icons/Wind") as Promise<IconModule>;
    case "Wrench":
      return import("next-vibe/ui/web/ui/icons/Wrench") as Promise<IconModule>;
    case "X":
      return import("next-vibe/ui/web/ui/icons/X") as Promise<IconModule>;
    case "XCircle":
      return import("next-vibe/ui/web/ui/icons/XCircle") as Promise<IconModule>;
    case "XSquare":
      return import("next-vibe/ui/web/ui/icons/XSquare") as Promise<IconModule>;
    case "Youtube":
      return import("next-vibe/ui/web/ui/icons/Youtube") as Promise<IconModule>;
    case "Zap":
      return import("next-vibe/ui/web/ui/icons/Zap") as Promise<IconModule>;
    default:
      return Promise.resolve({});
  }
}
