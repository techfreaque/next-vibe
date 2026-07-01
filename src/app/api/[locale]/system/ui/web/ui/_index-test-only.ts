/**
 * UI Component Exports
 *
 * This file re-exports all UI components and functions (excluding types).
 * For icons, use `export * from "next-vibe/ui/web/ui/icons"` to get all icon exports.
 */

// ============================================================================
// Components
// ============================================================================

// accordion
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe/ui/web/ui/accordion";

// alert
export {
  Alert,
  AlertDescription,
  AlertTitle,
  alertVariants,
} from "next-vibe/ui/web/ui/alert";

// alert-dialog
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "next-vibe/ui/web/ui/alert-dialog";

// aspect-ratio
export { AspectRatio } from "./aspect-ratio";

// autocomplete-field
export { AutocompleteField } from "./autocomplete-field";

// avatar
export {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "next-vibe/ui/web/ui/avatar";

// badge
export { Badge, badgeVariants } from "./badge";

// body
export { Body } from "./body";

// breadcrumb
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "next-vibe/ui/web/ui/breadcrumb";

// button
export {
  Button,
  buttonTextVariants,
  buttonVariants,
} from "next-vibe/ui/web/ui/button";

// calendar
export { Calendar } from "./calendar";

// card
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/web/ui/card";

// carousel
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "next-vibe/ui/web/ui/carousel";

// chart
export {
  Area,
  Axis,
  Bar,
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  Pie,
  Theme,
  useChart,
} from "next-vibe/ui/web/ui/chart";

// checkbox
export { Checkbox, CheckboxIndicator } from "./checkbox";

// collapsible
export {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "next-vibe/ui/web/ui/collapsible";

// command
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "next-vibe/ui/web/ui/command";

// container
export { Container } from "./container";

// context-menu
export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "next-vibe/ui/web/ui/context-menu";

// data-table
export { DataTable } from "./data-table";

// dialog
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "next-vibe/ui/web/ui/dialog";

// div
export { Div } from "./div";

// drawer
export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "next-vibe/ui/web/ui/drawer";

// dropdown-item
export { DropdownItem } from "./dropdown-item";

// dropdown-menu
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "next-vibe/ui/web/ui/dropdown-menu";

// ============================================================================
// Form Components
// ============================================================================

// form-element
export { FormElement } from "./form-element";

// form/endpoint-form-field
export { EndpointFormField } from "next-vibe/ui/web/ui/form/endpoint-form-field";

// form/form
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "next-vibe/ui/web/ui/form/form";

// form/form-alert
export { FormAlert } from "next-vibe/ui/web/ui/form/form-alert";

// form/form-section
export {
  FormFieldGroup,
  FormSection,
} from "next-vibe/ui/web/ui/form/form-section";

// ============================================================================
// Layout & Container Components
// ============================================================================

// hover-card
export {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from "next-vibe/ui/web/ui/hover-card";

// html
export { Html } from "./html";

// image
export { Image } from "./image";

// input
export { Input } from "./input";

// input-otp
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "next-vibe/ui/web/ui/input-otp";

// kbd
export { Kbd } from "./kbd";

// keyboard-avoiding-view
export { KeyboardAvoidingView } from "./keyboard-avoiding-view";

// label
export { Label } from "./label";

// li
export { Li } from "./li";

// link
export { Link } from "./link";

// markdown
export { Markdown } from "./markdown";

// menubar
export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "next-vibe/ui/web/ui/menubar";

// motion
export {
  AnimatePresence,
  MotionButton,
  MotionDiv,
  MotionImg,
  MotionSpan,
} from "next-vibe/ui/web/ui/motion";

// multi-select
export { MultiSelect } from "./multi-select";

// navigation-menu
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "next-vibe/ui/web/ui/navigation-menu";

// number-input
export { NumberInput } from "./number-input";

// ol
export { Ol } from "./ol";

// page-layout
export { PageLayout } from "./page-layout";

// pagination
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "next-vibe/ui/web/ui/pagination";

// phone-field
export { COUNTRIES, PhoneField } from "./phone-field";

// popover
export {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "next-vibe/ui/web/ui/popover";

// pre
export { Pre } from "./pre";

// progress
export { Progress, ProgressIndicator } from "./progress";

// radio-group
export { RadioGroup, RadioGroupItem } from "./radio-group";

// range-slider
export {
  RangeSlider,
  type RangeSliderProps,
} from "next-vibe/ui/web/ui/range-slider";

// resizable
export {
  ResizableContainer,
  ResizableHandle,
} from "next-vibe/ui/web/ui/resizable";

// root-stack
export { RootStack } from "./root-stack";

// scroll-area
export { ScrollArea, ScrollBar } from "./scroll-area";

// section
export { Section } from "./section";

// select
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/web/ui/select";

// separator
export { Separator } from "./separator";

// sheet
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "next-vibe/ui/web/ui/sheet";

// sidebar
export { SidebarLayout } from "./sidebar";

// skeleton
export { Skeleton } from "./skeleton";

// slider
export {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "next-vibe/ui/web/ui/slider";

// span
export { Span } from "./span";

// switch
export { Switch } from "./switch";

// table
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/web/ui/table";

// tabs
export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "next-vibe/ui/web/ui/tabs";

// tags-field
export { TagsField } from "./tags-field";

// textarea
export { Textarea, textareaVariants } from "./textarea";

// theme-provider
export { ThemeProvider } from "./theme-provider";

// title
export { sizeClasses, Title } from "./title";

// toast
export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "next-vibe/ui/web/ui/toast";

// toaster
export { Toaster } from "./toaster";

// toggle
export {
  Toggle,
  toggleTextVariants,
  toggleVariants,
} from "next-vibe/ui/web/ui/toggle";

// toggle-group
export { ToggleGroup, ToggleGroupItem } from "./toggle-group";

// tooltip
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe/ui/web/ui/tooltip";

// typography
export {
  BlockQuote,
  Code,
  H1,
  H2,
  H3,
  H4,
  Large,
  Lead,
  Muted,
  P,
  Small,
} from "next-vibe/ui/web/ui/typography";

// ul
export { Ul } from "./ul";

// widget-shell
export { WidgetShell } from "./widget-shell";

// widget-header
export { WidgetHeader } from "./widget-header";

// metric-card
export { MetricCard } from "./metric-card";

// metric-grid
export { MetricGrid } from "./metric-grid";

// status-pill
export { StatusPill } from "./status-pill";

// detail-grid
export { DetailField, DetailGrid } from "./detail-grid";

// list-item
export { ListItem } from "./list-item";

// section-group
export { SectionGroup } from "./section-group";

// empty-block
export { EmptyBlock } from "./empty-block";

// loading-block
export { LoadingBlock } from "./loading-block";

// progress-block
export { ProgressBlock } from "./progress-block";

// action-card
export { ActionCard } from "./action-card";

// result-banner
export { ResultBanner } from "./result-banner";
