/**
 * UI Component Exports
 *
 * This file re-exports all UI components and functions (excluding types).
 * For icons, use `export * from "next-vibe/ui/native/ui/icons"` to get all icon exports.
 */

// ============================================================================
// Components
// ============================================================================

// accordion
import type * as webAccordion from "next-vibe/ui/web/ui/accordion";

import * as Accordion from "./accordion";
const testAccordion: typeof webAccordion = Accordion;
void testAccordion;
export * from "./accordion";

// alert
import type * as webAlert from "next-vibe/ui/web/ui/alert";

import * as Alert from "./alert";
const testAlert: typeof webAlert = Alert;
void testAlert;
export * from "./alert";

// alert-dialog
import type * as webAlertDialog from "next-vibe/ui/web/ui/alert-dialog";

import * as AlertDialog from "./alert-dialog";
const testAlertDialog: typeof webAlertDialog = AlertDialog;
void testAlertDialog;
export * from "./alert-dialog";

// aspect-ratio
import type * as webAspectRatio from "next-vibe/ui/web/ui/aspect-ratio";

import * as AspectRatio from "./aspect-ratio";
const testAspectRatio: typeof webAspectRatio = AspectRatio;
void testAspectRatio;
export * from "./aspect-ratio";

// autocomplete-field
import type * as webAutocompleteField from "next-vibe/ui/web/ui/autocomplete-field";

import * as AutocompleteField from "./autocomplete-field";
const testAutocompleteField: typeof webAutocompleteField = AutocompleteField;
void testAutocompleteField;
export * from "./autocomplete-field";

// avatar
import type * as webAvatar from "next-vibe/ui/web/ui/avatar";

import * as Avatar from "./avatar";
const testAvatar: typeof webAvatar = Avatar;
void testAvatar;
export * from "./avatar";

// badge
import type * as webBadge from "next-vibe/ui/web/ui/badge";

import * as Badge from "./badge";
const testBadge: typeof webBadge = Badge;
void testBadge;
export * from "./badge";

// body
import type * as webBody from "next-vibe/ui/web/ui/body";

import * as Body from "./body";
const testBody: typeof webBody = Body;
void testBody;
export * from "./body";

// breadcrumb
import type * as webBreadcrumb from "next-vibe/ui/web/ui/breadcrumb";

import * as Breadcrumb from "./breadcrumb";
const testBreadcrumb: typeof webBreadcrumb = Breadcrumb;
void testBreadcrumb;
export * from "./breadcrumb";

// button
import type * as webButton from "next-vibe/ui/web/ui/button";

import * as Button from "./button";
const testButton: typeof webButton = Button;
void testButton;
export * from "./button";

// calendar
import type * as webCalendar from "next-vibe/ui/web/ui/calendar";

import * as Calendar from "./calendar";
const testCalendar: typeof webCalendar = Calendar;
void testCalendar;
export * from "./calendar";

// card
import type * as webCard from "next-vibe/ui/web/ui/card";

import * as Card from "./card";
const testCard: typeof webCard = Card;
void testCard;
export * from "./card";

// carousel
import type * as webCarousel from "next-vibe/ui/web/ui/carousel";

import * as Carousel from "./carousel";
const testCarousel: typeof webCarousel = Carousel;
void testCarousel;
export * from "./carousel";

// chart
import type * as webChart from "next-vibe/ui/web/ui/chart";

import * as Chart from "./chart";
const testChart: typeof webChart = Chart;
void testChart;
export * from "./chart";

// checkbox
import type * as webCheckbox from "next-vibe/ui/web/ui/checkbox";

import * as Checkbox from "./checkbox";
const testCheckbox: typeof webCheckbox = Checkbox;
void testCheckbox;
export * from "./checkbox";

// collapsible
import type * as webCollapsible from "next-vibe/ui/web/ui/collapsible";

import * as Collapsible from "./collapsible";
const testCollapsible: typeof webCollapsible = Collapsible;
void testCollapsible;
export * from "./collapsible";

// command
import type * as webCommand from "next-vibe/ui/web/ui/command";

import * as Command from "./command";
const testCommand: typeof webCommand = Command;
void testCommand;
export * from "./command";

// container
import type * as webContainer from "next-vibe/ui/web/ui/container";

import * as Container from "./container";
const testContainer: typeof webContainer = Container;
void testContainer;
export * from "./container";

// context-menu
import type * as webContextMenu from "next-vibe/ui/web/ui/context-menu";

import * as ContextMenu from "./context-menu";
const testContextMenu: typeof webContextMenu = ContextMenu;
void testContextMenu;
export * from "./context-menu";

// data-table
import type * as webDataTable from "next-vibe/ui/web/ui/data-table";

import * as DataTable from "./data-table";
const testDataTable: typeof webDataTable = DataTable;
void testDataTable;
export * from "./data-table";

// dialog
import type * as webDialog from "next-vibe/ui/web/ui/dialog";

import * as Dialog from "./dialog";
const testDialog: typeof webDialog = Dialog;
void testDialog;
export * from "./dialog";

// div
import type * as webDiv from "next-vibe/ui/web/ui/div";

import * as Div from "./div";
const testDiv: typeof webDiv = Div;
void testDiv;
export * from "./div";

// drawer
import type * as webDrawer from "next-vibe/ui/web/ui/drawer";

import * as Drawer from "./drawer";
const testDrawer: typeof webDrawer = Drawer;
void testDrawer;
export * from "./drawer";

// dropdown-item
import type * as webDropdownItem from "next-vibe/ui/web/ui/dropdown-item";

import * as DropdownItem from "./dropdown-item";
const testDropdownItem: typeof webDropdownItem = DropdownItem;
void testDropdownItem;
export * from "./dropdown-item";

// dropdown-menu
import type * as webDropdownMenu from "next-vibe/ui/web/ui/dropdown-menu";

import * as DropdownMenu from "./dropdown-menu";
const testDropdownMenu: typeof webDropdownMenu = DropdownMenu;
void testDropdownMenu;
export * from "./dropdown-menu";

// ============================================================================
// Form Components
// ============================================================================

// form-element
import type * as webFormElement from "next-vibe/ui/web/ui/form-element";

import * as FormElement from "./form-element";
const testFormElement: typeof webFormElement = FormElement;
void testFormElement;
export * from "./form-element";

// form/endpoint-form-field
import * as EndpointFormField from "next-vibe/ui/native/ui/form/endpoint-form-field";
import type * as webEndpointFormField from "next-vibe/ui/web/ui/form/endpoint-form-field";
const testEndpointFormField: typeof webEndpointFormField = EndpointFormField;
void testEndpointFormField;
export * from "next-vibe/ui/native/ui/form/endpoint-form-field";

// form/form
import * as FormForm from "next-vibe/ui/native/ui/form/form";
import type * as webFormForm from "next-vibe/ui/web/ui/form/form";
const testFormForm: typeof webFormForm = FormForm;
void testFormForm;
export * from "next-vibe/ui/native/ui/form/form";

// form/form-alert
import * as FormAlert from "next-vibe/ui/native/ui/form/form-alert";
import type * as webFormAlert from "next-vibe/ui/web/ui/form/form-alert";
const testFormAlert: typeof webFormAlert = FormAlert;
void testFormAlert;
export * from "next-vibe/ui/native/ui/form/form-alert";

// form/form-section
import * as FormSection from "next-vibe/ui/native/ui/form/form-section";
import type * as webFormSection from "next-vibe/ui/web/ui/form/form-section";
const testFormSection: typeof webFormSection = FormSection;
void testFormSection;
export * from "next-vibe/ui/native/ui/form/form-section";

// ============================================================================
// Layout & Container Components
// ============================================================================

// hover-card
import type * as webHoverCard from "next-vibe/ui/web/ui/hover-card";

import * as HoverCard from "./hover-card";
const testHoverCard: typeof webHoverCard = HoverCard;
void testHoverCard;
export * from "./hover-card";

// html
import type * as webHtml from "next-vibe/ui/web/ui/html";

import * as Html from "./html";
const testHtml: typeof webHtml = Html;
void testHtml;
export * from "./html";

// image
import type * as webImage from "next-vibe/ui/web/ui/image";

import * as Image from "./image";
const testImage: typeof webImage = Image;
void testImage;
export * from "./image";

// input
import type * as webInput from "next-vibe/ui/web/ui/input";

import * as Input from "./input";
const testInput: typeof webInput = Input;
void testInput;
export * from "./input";

// input-otp
import type * as webInputOTP from "next-vibe/ui/web/ui/input-otp";

import * as InputOTP from "./input-otp";
const testInputOTP: typeof webInputOTP = InputOTP;
void testInputOTP;
export * from "./input-otp";

// kbd
import type * as webKbd from "next-vibe/ui/web/ui/kbd";

import * as Kbd from "./kbd";
const testKbd: typeof webKbd = Kbd;
void testKbd;
export * from "./kbd";

// keyboard-avoiding-view
import type * as webKeyboardAvoidingView from "next-vibe/ui/web/ui/keyboard-avoiding-view";

import * as KeyboardAvoidingView from "./keyboard-avoiding-view";
const testKeyboardAvoidingView: typeof webKeyboardAvoidingView =
  KeyboardAvoidingView;
void testKeyboardAvoidingView;
export * from "./keyboard-avoiding-view";

// label
import type * as webLabel from "next-vibe/ui/web/ui/label";

import * as Label from "./label";
const testLabel: typeof webLabel = Label;
void testLabel;
export * from "./label";

// li
import type * as webLi from "next-vibe/ui/web/ui/li";

import * as Li from "./li";
const testLi: typeof webLi = Li;
void testLi;
export * from "./li";

// link
import type * as webLink from "next-vibe/ui/web/ui/link";

import * as Link from "./link";
const testLink: typeof webLink = Link;
void testLink;
export * from "./link";

// markdown
import type * as webMarkdown from "next-vibe/ui/web/ui/markdown";

import * as Markdown from "./markdown";
const testMarkdown: typeof webMarkdown = Markdown;
void testMarkdown;
export * from "./markdown";

// menubar
import type * as webMenubar from "next-vibe/ui/web/ui/menubar";

import * as Menubar from "./menubar";
const testMenubar: typeof webMenubar = Menubar;
void testMenubar;
export * from "./menubar";

// motion
import type * as webMotion from "next-vibe/ui/web/ui/motion";

import * as Motion from "./motion";
const testMotion: typeof webMotion = Motion;
void testMotion;
export * from "./motion";

// multi-select
import type * as webMultiSelect from "next-vibe/ui/web/ui/multi-select";

import * as MultiSelect from "./multi-select";
const testMultiSelect: typeof webMultiSelect = MultiSelect;
void testMultiSelect;
export * from "./multi-select";

// navigation-menu
import type * as webNavigationMenu from "next-vibe/ui/web/ui/navigation-menu";

import * as NavigationMenu from "./navigation-menu";
const testNavigationMenu: typeof webNavigationMenu = NavigationMenu;
void testNavigationMenu;
export * from "./navigation-menu";

// number-input
import type * as webNumberInput from "next-vibe/ui/web/ui/number-input";

import * as NumberInput from "./number-input";
const testNumberInput: typeof webNumberInput = NumberInput;
void testNumberInput;
export * from "./number-input";

// ol
import type * as webOl from "next-vibe/ui/web/ui/ol";

import * as Ol from "./ol";
const testOl: typeof webOl = Ol;
void testOl;
export * from "./ol";

// page-layout
import type * as webPageLayout from "next-vibe/ui/web/ui/page-layout";

import * as PageLayout from "./page-layout";
const testPageLayout: typeof webPageLayout = PageLayout;
void testPageLayout;
export * from "./page-layout";

// pagination
import type * as webPagination from "next-vibe/ui/web/ui/pagination";

import * as Pagination from "./pagination";
const testPagination: typeof webPagination = Pagination;
void testPagination;
export * from "./pagination";

// phone-field
import type * as webPhoneField from "next-vibe/ui/web/ui/phone-field";

import * as PhoneField from "./phone-field";
const testPhoneField: typeof webPhoneField = PhoneField;
void testPhoneField;
export * from "./phone-field";

// popover
import type * as webPopover from "next-vibe/ui/web/ui/popover";

import * as Popover from "./popover";
const testPopover: typeof webPopover = Popover;
void testPopover;
export * from "./popover";

// pre
import type * as webPre from "next-vibe/ui/web/ui/pre";

import * as Pre from "./pre";
const testPre: typeof webPre = Pre;
void testPre;
export * from "./pre";

// progress
import type * as webProgress from "next-vibe/ui/web/ui/progress";

import * as Progress from "./progress";
const testProgress: typeof webProgress = Progress;
void testProgress;
export * from "./progress";

// radio-group
import type * as webRadioGroup from "next-vibe/ui/web/ui/radio-group";

import * as RadioGroup from "./radio-group";
const testRadioGroup: typeof webRadioGroup = RadioGroup;
void testRadioGroup;
export * from "./radio-group";

// range-slider
import type * as webRangeSlider from "next-vibe/ui/web/ui/range-slider";

import * as RangeSlider from "./range-slider";
const testRangeSlider: typeof webRangeSlider = RangeSlider;
void testRangeSlider;
export * from "./range-slider";

// resizable
import type * as webResizable from "next-vibe/ui/web/ui/resizable";

import * as Resizable from "./resizable";
const testResizable: typeof webResizable = Resizable;
void testResizable;
export * from "./resizable";

// root-stack
import type * as webRootStack from "next-vibe/ui/web/ui/root-stack";

import * as RootStack from "./root-stack";
const testRootStack: typeof webRootStack = RootStack;
void testRootStack;
export * from "./root-stack";

// scroll-area
import type * as webScrollArea from "next-vibe/ui/web/ui/scroll-area";

import * as ScrollArea from "./scroll-area";
const testScrollArea: typeof webScrollArea = ScrollArea;
void testScrollArea;
export * from "./scroll-area";

// section
import type * as webSection from "next-vibe/ui/web/ui/section";

import * as Section from "./section";
const testSection: typeof webSection = Section;
void testSection;
export * from "./section";

// select
import type * as webSelect from "next-vibe/ui/web/ui/select";

import * as Select from "./select";
const testSelect: typeof webSelect = Select;
void testSelect;
export * from "./select";

// separator
import type * as webSeparator from "next-vibe/ui/web/ui/separator";

import * as Separator from "./separator";
const testSeparator: typeof webSeparator = Separator;
void testSeparator;
export * from "./separator";

// sheet
import type * as webSheet from "next-vibe/ui/web/ui/sheet";

import * as Sheet from "./sheet";
const testSheet: typeof webSheet = Sheet;
void testSheet;
export * from "./sheet";

// sidebar
import type * as webSidebar from "next-vibe/ui/web/ui/sidebar";

import * as Sidebar from "./sidebar";
const testSidebar: typeof webSidebar = Sidebar;
void testSidebar;
export * from "./sidebar";

// skeleton
import type * as webSkeleton from "next-vibe/ui/web/ui/skeleton";

import * as Skeleton from "./skeleton";
const testSkeleton: typeof webSkeleton = Skeleton;
void testSkeleton;
export * from "./skeleton";

// slider
import type * as webSlider from "next-vibe/ui/web/ui/slider";

import * as Slider from "./slider";
const testSlider: typeof webSlider = Slider;
void testSlider;
export * from "./slider";

// span
import type * as webSpan from "next-vibe/ui/web/ui/span";

import * as Span from "./span";
const testSpan: typeof webSpan = Span;
void testSpan;
export * from "./span";

// switch
import type * as webSwitch from "next-vibe/ui/web/ui/switch";

import * as Switch from "./switch";
const testSwitch: typeof webSwitch = Switch;
void testSwitch;
export * from "./switch";

// table
import type * as webTable from "next-vibe/ui/web/ui/table";

import * as Table from "./table";
const testTable: typeof webTable = Table;
void testTable;
export * from "./table";

// tabs
import type * as webTabs from "next-vibe/ui/web/ui/tabs";

import * as Tabs from "./tabs";
const testTabs: typeof webTabs = Tabs;
void testTabs;
export * from "./tabs";

// tags-field
import type * as webTagsField from "next-vibe/ui/web/ui/tags-field";

import * as TagsField from "./tags-field";
const testTagsField: typeof webTagsField = TagsField;
void testTagsField;
export * from "./tags-field";

// textarea
import type * as webTextarea from "next-vibe/ui/web/ui/textarea";

import * as Textarea from "./textarea";
const testTextarea: typeof webTextarea = Textarea;
void testTextarea;
export * from "./textarea";

// theme-provider
import type * as webThemeProvider from "next-vibe/ui/web/ui/theme-provider";

import * as ThemeProvider from "./theme-provider";
const testThemeProvider: typeof webThemeProvider = ThemeProvider;
void testThemeProvider;
export * from "./theme-provider";

// title
import type * as webTitle from "next-vibe/ui/web/ui/title";

import * as Title from "./title";
const testTitle: typeof webTitle = Title;
void testTitle;
export * from "./title";

// toast
import type * as webToast from "next-vibe/ui/web/ui/toast";

import * as Toast from "./toast";
const testToast: typeof webToast = Toast;
void testToast;
export * from "./toast";

// toaster
import type * as webToaster from "next-vibe/ui/web/ui/toaster";

import * as Toaster from "./toaster";
const testToaster: typeof webToaster = Toaster;
void testToaster;
export * from "./toaster";

// toggle
import type * as webToggle from "next-vibe/ui/web/ui/toggle";

import * as Toggle from "./toggle";
const testToggle: typeof webToggle = Toggle;
void testToggle;
export * from "./toggle";

// toggle-group
import type * as webToggleGroup from "next-vibe/ui/web/ui/toggle-group";

import * as ToggleGroup from "./toggle-group";
const testToggleGroup: typeof webToggleGroup = ToggleGroup;
void testToggleGroup;
export * from "./toggle-group";

// tooltip
import type * as webTooltip from "next-vibe/ui/web/ui/tooltip";

import * as Tooltip from "./tooltip";
const testTooltip: typeof webTooltip = Tooltip;
void testTooltip;
export * from "./tooltip";

// typography
import type * as webTypography from "next-vibe/ui/web/ui/typography";

import * as Typography from "./typography";
const testTypography: typeof webTypography = Typography;
void testTypography;
export * from "./typography";

// ul
import type * as webUl from "next-vibe/ui/web/ui/ul";

import * as Ul from "./ul";
const testUl: typeof webUl = Ul;
void testUl;
export * from "./ul";

// widget-shell
import type * as webWidgetShell from "next-vibe/ui/web/ui/widget-shell";

import * as WidgetShell from "./widget-shell";
const testWidgetShell: typeof webWidgetShell = WidgetShell;
void testWidgetShell;
export * from "./widget-shell";

// widget-header
import type * as webWidgetHeader from "next-vibe/ui/web/ui/widget-header";

import * as WidgetHeader from "./widget-header";
const testWidgetHeader: typeof webWidgetHeader = WidgetHeader;
void testWidgetHeader;
export * from "./widget-header";

// metric-card
import type * as webMetricCard from "next-vibe/ui/web/ui/metric-card";

import * as MetricCard from "./metric-card";
const testMetricCard: typeof webMetricCard = MetricCard;
void testMetricCard;
export * from "./metric-card";

// metric-grid
import type * as webMetricGrid from "next-vibe/ui/web/ui/metric-grid";

import * as MetricGrid from "./metric-grid";
const testMetricGrid: typeof webMetricGrid = MetricGrid;
void testMetricGrid;
export * from "./metric-grid";

// status-pill
import type * as webStatusPill from "next-vibe/ui/web/ui/status-pill";

import * as StatusPill from "./status-pill";
const testStatusPill: typeof webStatusPill = StatusPill;
void testStatusPill;
export * from "./status-pill";

// detail-grid
import type * as webDetailGrid from "next-vibe/ui/web/ui/detail-grid";

import * as DetailGrid from "./detail-grid";
const testDetailGrid: typeof webDetailGrid = DetailGrid;
void testDetailGrid;
export * from "./detail-grid";

// list-item
import type * as webListItem from "next-vibe/ui/web/ui/list-item";

import * as ListItem from "./list-item";
const testListItem: typeof webListItem = ListItem;
void testListItem;
export * from "./list-item";

// section-group
import type * as webSectionGroup from "next-vibe/ui/web/ui/section-group";

import * as SectionGroup from "./section-group";
const testSectionGroup: typeof webSectionGroup = SectionGroup;
void testSectionGroup;
export * from "./section-group";

// empty-block
import type * as webEmptyBlock from "next-vibe/ui/web/ui/empty-block";

import * as EmptyBlock from "./empty-block";
const testEmptyBlock: typeof webEmptyBlock = EmptyBlock;
void testEmptyBlock;
export * from "./empty-block";

// loading-block
import type * as webLoadingBlock from "next-vibe/ui/web/ui/loading-block";

import * as LoadingBlock from "./loading-block";
const testLoadingBlock: typeof webLoadingBlock = LoadingBlock;
void testLoadingBlock;
export * from "./loading-block";

// progress-block
import type * as webProgressBlock from "next-vibe/ui/web/ui/progress-block";

import * as ProgressBlock from "./progress-block";
const testProgressBlock: typeof webProgressBlock = ProgressBlock;
void testProgressBlock;
export * from "./progress-block";

// action-card
import type * as webActionCard from "next-vibe/ui/web/ui/action-card";

import * as ActionCard from "./action-card";
const testActionCard: typeof webActionCard = ActionCard;
void testActionCard;
export * from "./action-card";

// result-banner
import type * as webResultBanner from "next-vibe/ui/web/ui/result-banner";

import * as ResultBanner from "./result-banner";
const testResultBanner: typeof webResultBanner = ResultBanner;
void testResultBanner;
export * from "./result-banner";
