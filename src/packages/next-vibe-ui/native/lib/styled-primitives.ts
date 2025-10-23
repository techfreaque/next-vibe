/**
 * Styled wrappers for @rn-primitives components
 *
 * This file contains styled() wrappers for all @rn-primitives components used in the UI library.
 * Each primitive component is wrapped with styled() to add className support via NativeWind v5.
 *
 * @see https://www.nativewind.dev/v5/guides/third-party-components
 */

import * as AccordionPrimitive from "@rn-primitives/accordion";
import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import * as AspectRatioPrimitive from "@rn-primitives/aspect-ratio";
import * as AvatarPrimitive from "@rn-primitives/avatar";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import * as CollapsiblePrimitive from "@rn-primitives/collapsible";
import * as ContextMenuPrimitive from "@rn-primitives/context-menu";
import * as DialogPrimitive from "@rn-primitives/dialog";
import * as DropdownMenuPrimitive from "@rn-primitives/dropdown-menu";
import * as HoverCardPrimitive from "@rn-primitives/hover-card";
import * as LabelPrimitive from "@rn-primitives/label";
import * as MenubarPrimitive from "@rn-primitives/menubar";
import * as NavigationMenuPrimitive from "@rn-primitives/navigation-menu";
import * as PopoverPrimitive from "@rn-primitives/popover";
import * as ProgressPrimitive from "@rn-primitives/progress";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import * as SelectPrimitive from "@rn-primitives/select";
import * as SeparatorPrimitive from "@rn-primitives/separator";
import * as SliderPrimitive from "@rn-primitives/slider";
import * as SwitchPrimitive from "@rn-primitives/switch";
import * as TablePrimitive from "@rn-primitives/table";
import * as TabsPrimitive from "@rn-primitives/tabs";
import * as TogglePrimitive from "@rn-primitives/toggle";
import * as ToggleGroupPrimitive from "@rn-primitives/toggle-group";
import * as TooltipPrimitive from "@rn-primitives/tooltip";
import { styled } from "nativewind";

// Accordion
export const StyledAccordionRoot = styled(AccordionPrimitive.Root, {
  className: "style",
});
export const StyledAccordionItem = styled(AccordionPrimitive.Item, {
  className: "style",
});
export const StyledAccordionHeader = styled(AccordionPrimitive.Header, {
  className: "style",
});
export const StyledAccordionTrigger = styled(AccordionPrimitive.Trigger, {
  className: "style",
});
export const StyledAccordionContent = styled(AccordionPrimitive.Content, {
  className: "style",
});

// AlertDialog
export const StyledAlertDialogRoot = styled(AlertDialogPrimitive.Root, {
  className: "style",
});
export const StyledAlertDialogTrigger = styled(AlertDialogPrimitive.Trigger, {
  className: "style",
});
export const StyledAlertDialogPortal = styled(AlertDialogPrimitive.Portal, {
  className: "style",
});
export const StyledAlertDialogOverlay = styled(AlertDialogPrimitive.Overlay, {
  className: "style",
});
export const StyledAlertDialogContent = styled(AlertDialogPrimitive.Content, {
  className: "style",
});
export const StyledAlertDialogHeader = styled(AlertDialogPrimitive.Header, {
  className: "style",
});
export const StyledAlertDialogFooter = styled(AlertDialogPrimitive.Footer, {
  className: "style",
});
export const StyledAlertDialogTitle = styled(AlertDialogPrimitive.Title, {
  className: "style",
});
export const StyledAlertDialogDescription = styled(
  AlertDialogPrimitive.Description,
  { className: "style" },
);
export const StyledAlertDialogAction = styled(AlertDialogPrimitive.Action, {
  className: "style",
});
export const StyledAlertDialogCancel = styled(AlertDialogPrimitive.Cancel, {
  className: "style",
});

// AspectRatio
export const StyledAspectRatio = styled(AspectRatioPrimitive.Root, {
  className: "style",
});

// Avatar
export const StyledAvatarRoot = styled(AvatarPrimitive.Root, {
  className: "style",
});
export const StyledAvatarImage = styled(AvatarPrimitive.Image, {
  className: "style",
});
export const StyledAvatarFallback = styled(AvatarPrimitive.Fallback, {
  className: "style",
});

// Checkbox
export const StyledCheckboxRoot = styled(CheckboxPrimitive.Root, {
  className: "style",
});
export const StyledCheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
  className: "style",
});

// Collapsible
export const StyledCollapsibleRoot = styled(CollapsiblePrimitive.Root, {
  className: "style",
});
export const StyledCollapsibleTrigger = styled(CollapsiblePrimitive.Trigger, {
  className: "style",
});
export const StyledCollapsibleContent = styled(CollapsiblePrimitive.Content, {
  className: "style",
});

// ContextMenu
export const StyledContextMenuRoot = styled(ContextMenuPrimitive.Root, {
  className: "style",
});
export const StyledContextMenuTrigger = styled(ContextMenuPrimitive.Trigger, {
  className: "style",
});
export const StyledContextMenuPortal = styled(ContextMenuPrimitive.Portal, {
  className: "style",
});
export const StyledContextMenuContent = styled(ContextMenuPrimitive.Content, {
  className: "style",
});
export const StyledContextMenuItem = styled(ContextMenuPrimitive.Item, {
  className: "style",
});
export const StyledContextMenuCheckboxItem = styled(
  ContextMenuPrimitive.CheckboxItem,
  { className: "style" },
);
export const StyledContextMenuRadioGroup = styled(
  ContextMenuPrimitive.RadioGroup,
  { className: "style" },
);
export const StyledContextMenuRadioItem = styled(
  ContextMenuPrimitive.RadioItem,
  { className: "style" },
);
export const StyledContextMenuItemIndicator = styled(
  ContextMenuPrimitive.ItemIndicator,
  { className: "style" },
);
export const StyledContextMenuSeparator = styled(
  ContextMenuPrimitive.Separator,
  { className: "style" },
);
export const StyledContextMenuLabel = styled(ContextMenuPrimitive.Label, {
  className: "style",
});
export const StyledContextMenuSub = styled(ContextMenuPrimitive.Sub, {
  className: "style",
});
export const StyledContextMenuSubTrigger = styled(
  ContextMenuPrimitive.SubTrigger,
  { className: "style" },
);
export const StyledContextMenuSubContent = styled(
  ContextMenuPrimitive.SubContent,
  { className: "style" },
);
export const StyledContextMenuGroup = styled(ContextMenuPrimitive.Group, {
  className: "style",
});

// Dialog
export const StyledDialogRoot = styled(DialogPrimitive.Root, {
  className: "style",
});
export const StyledDialogTrigger = styled(DialogPrimitive.Trigger, {
  className: "style",
});
export const StyledDialogPortal = styled(DialogPrimitive.Portal, {
  className: "style",
});
export const StyledDialogOverlay = styled(DialogPrimitive.Overlay, {
  className: "style",
});
export const StyledDialogContent = styled(DialogPrimitive.Content, {
  className: "style",
});
export const StyledDialogHeader = styled(DialogPrimitive.Header, {
  className: "style",
});
export const StyledDialogFooter = styled(DialogPrimitive.Footer, {
  className: "style",
});
export const StyledDialogTitle = styled(DialogPrimitive.Title, {
  className: "style",
});
export const StyledDialogDescription = styled(DialogPrimitive.Description, {
  className: "style",
});
export const StyledDialogClose = styled(DialogPrimitive.Close, {
  className: "style",
});

// DropdownMenu
export const StyledDropdownMenuRoot = styled(DropdownMenuPrimitive.Root, {
  className: "style",
});
export const StyledDropdownMenuTrigger = styled(DropdownMenuPrimitive.Trigger, {
  className: "style",
});
export const StyledDropdownMenuPortal = styled(DropdownMenuPrimitive.Portal, {
  className: "style",
});
export const StyledDropdownMenuContent = styled(DropdownMenuPrimitive.Content, {
  className: "style",
});
export const StyledDropdownMenuItem = styled(DropdownMenuPrimitive.Item, {
  className: "style",
});
export const StyledDropdownMenuCheckboxItem = styled(
  DropdownMenuPrimitive.CheckboxItem,
  { className: "style" },
);
export const StyledDropdownMenuRadioGroup = styled(
  DropdownMenuPrimitive.RadioGroup,
  { className: "style" },
);
export const StyledDropdownMenuRadioItem = styled(
  DropdownMenuPrimitive.RadioItem,
  { className: "style" },
);
export const StyledDropdownMenuItemIndicator = styled(
  DropdownMenuPrimitive.ItemIndicator,
  { className: "style" },
);
export const StyledDropdownMenuSeparator = styled(
  DropdownMenuPrimitive.Separator,
  { className: "style" },
);
export const StyledDropdownMenuLabel = styled(DropdownMenuPrimitive.Label, {
  className: "style",
});
export const StyledDropdownMenuSub = styled(DropdownMenuPrimitive.Sub, {
  className: "style",
});
export const StyledDropdownMenuSubTrigger = styled(
  DropdownMenuPrimitive.SubTrigger,
  { className: "style" },
);
export const StyledDropdownMenuSubContent = styled(
  DropdownMenuPrimitive.SubContent,
  { className: "style" },
);
export const StyledDropdownMenuGroup = styled(DropdownMenuPrimitive.Group, {
  className: "style",
});
export const StyledDropdownMenuShortcut = styled(
  DropdownMenuPrimitive.Shortcut,
  { className: "style" },
);

// HoverCard
export const StyledHoverCardRoot = styled(HoverCardPrimitive.Root, {
  className: "style",
});
export const StyledHoverCardTrigger = styled(HoverCardPrimitive.Trigger, {
  className: "style",
});
export const StyledHoverCardPortal = styled(HoverCardPrimitive.Portal, {
  className: "style",
});
export const StyledHoverCardContent = styled(HoverCardPrimitive.Content, {
  className: "style",
});

// Label
export const StyledLabel = styled(LabelPrimitive.Text, { className: "style" });

// Menubar
export const StyledMenubarRoot = styled(MenubarPrimitive.Root, {
  className: "style",
});
export const StyledMenubarMenu = styled(MenubarPrimitive.Menu, {
  className: "style",
});
export const StyledMenubarTrigger = styled(MenubarPrimitive.Trigger, {
  className: "style",
});
export const StyledMenubarPortal = styled(MenubarPrimitive.Portal, {
  className: "style",
});
export const StyledMenubarContent = styled(MenubarPrimitive.Content, {
  className: "style",
});
export const StyledMenubarItem = styled(MenubarPrimitive.Item, {
  className: "style",
});
export const StyledMenubarCheckboxItem = styled(MenubarPrimitive.CheckboxItem, {
  className: "style",
});
export const StyledMenubarRadioGroup = styled(MenubarPrimitive.RadioGroup, {
  className: "style",
});
export const StyledMenubarRadioItem = styled(MenubarPrimitive.RadioItem, {
  className: "style",
});
export const StyledMenubarItemIndicator = styled(
  MenubarPrimitive.ItemIndicator,
  { className: "style" },
);
export const StyledMenubarSeparator = styled(MenubarPrimitive.Separator, {
  className: "style",
});
export const StyledMenubarLabel = styled(MenubarPrimitive.Label, {
  className: "style",
});
export const StyledMenubarSub = styled(MenubarPrimitive.Sub, {
  className: "style",
});
export const StyledMenubarSubTrigger = styled(MenubarPrimitive.SubTrigger, {
  className: "style",
});
export const StyledMenubarSubContent = styled(MenubarPrimitive.SubContent, {
  className: "style",
});
export const StyledMenubarGroup = styled(MenubarPrimitive.Group, {
  className: "style",
});
export const StyledMenubarShortcut = styled(MenubarPrimitive.Shortcut, {
  className: "style",
});

// NavigationMenu
export const StyledNavigationMenuRoot = styled(NavigationMenuPrimitive.Root, {
  className: "style",
});
export const StyledNavigationMenuList = styled(NavigationMenuPrimitive.List, {
  className: "style",
});
export const StyledNavigationMenuItem = styled(NavigationMenuPrimitive.Item, {
  className: "style",
});
export const StyledNavigationMenuTrigger = styled(
  NavigationMenuPrimitive.Trigger,
  { className: "style" },
);
export const StyledNavigationMenuContent = styled(
  NavigationMenuPrimitive.Content,
  { className: "style" },
);
export const StyledNavigationMenuLink = styled(NavigationMenuPrimitive.Link, {
  className: "style",
});
export const StyledNavigationMenuViewport = styled(
  NavigationMenuPrimitive.Viewport,
  { className: "style" },
);
export const StyledNavigationMenuIndicator = styled(
  NavigationMenuPrimitive.Indicator,
  { className: "style" },
);

// Popover
export const StyledPopoverRoot = styled(PopoverPrimitive.Root, {
  className: "style",
});
export const StyledPopoverTrigger = styled(PopoverPrimitive.Trigger, {
  className: "style",
});
export const StyledPopoverPortal = styled(PopoverPrimitive.Portal, {
  className: "style",
});
export const StyledPopoverContent = styled(PopoverPrimitive.Content, {
  className: "style",
});
export const StyledPopoverClose = styled(PopoverPrimitive.Close, {
  className: "style",
});

// Progress
export const StyledProgressRoot = styled(ProgressPrimitive.Root, {
  className: "style",
});
export const StyledProgressIndicator = styled(ProgressPrimitive.Indicator, {
  className: "style",
});

// RadioGroup
export const StyledRadioGroupRoot = styled(RadioGroupPrimitive.Root, {
  className: "style",
});
export const StyledRadioGroupItem = styled(RadioGroupPrimitive.Item, {
  className: "style",
});
export const StyledRadioGroupIndicator = styled(RadioGroupPrimitive.Indicator, {
  className: "style",
});

// Select
export const StyledSelectRoot = styled(SelectPrimitive.Root, {
  className: "style",
});
export const StyledSelectTrigger = styled(SelectPrimitive.Trigger, {
  className: "style",
});
export const StyledSelectValue = styled(SelectPrimitive.Value, {
  className: "style",
});
export const StyledSelectPortal = styled(SelectPrimitive.Portal, {
  className: "style",
});
export const StyledSelectContent = styled(SelectPrimitive.Content, {
  className: "style",
});
export const StyledSelectViewport = styled(SelectPrimitive.Viewport, {
  className: "style",
});
export const StyledSelectItem = styled(SelectPrimitive.Item, {
  className: "style",
});
export const StyledSelectItemText = styled(SelectPrimitive.ItemText, {
  className: "style",
});
export const StyledSelectItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  className: "style",
});
export const StyledSelectScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  { className: "style" },
);
export const StyledSelectScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  { className: "style" },
);
export const StyledSelectSeparator = styled(SelectPrimitive.Separator, {
  className: "style",
});
export const StyledSelectGroup = styled(SelectPrimitive.Group, {
  className: "style",
});
export const StyledSelectLabel = styled(SelectPrimitive.Label, {
  className: "style",
});

// Separator
export const StyledSeparator = styled(SeparatorPrimitive.Root, {
  className: "style",
});

// Slider
export const StyledSliderRoot = styled(SliderPrimitive.Root, {
  className: "style",
});
export const StyledSliderTrack = styled(SliderPrimitive.Track, {
  className: "style",
});
export const StyledSliderRange = styled(SliderPrimitive.Range, {
  className: "style",
});
export const StyledSliderThumb = styled(SliderPrimitive.Thumb, {
  className: "style",
});

// Switch
export const StyledSwitchRoot = styled(SwitchPrimitive.Root, {
  className: "style",
});
export const StyledSwitchThumb = styled(SwitchPrimitive.Thumb, {
  className: "style",
});

// Table
export const StyledTableRoot = styled(TablePrimitive.Root, {
  className: "style",
});
export const StyledTableHeader = styled(TablePrimitive.Header, {
  className: "style",
});
export const StyledTableBody = styled(TablePrimitive.Body, {
  className: "style",
});
export const StyledTableFooter = styled(TablePrimitive.Footer, {
  className: "style",
});
export const StyledTableRow = styled(TablePrimitive.Row, {
  className: "style",
});
export const StyledTableHead = styled(TablePrimitive.Head, {
  className: "style",
});
export const StyledTableCell = styled(TablePrimitive.Cell, {
  className: "style",
});

// Tabs
export const StyledTabsRoot = styled(TabsPrimitive.Root, {
  className: "style",
});
export const StyledTabsList = styled(TabsPrimitive.List, {
  className: "style",
});
export const StyledTabsTrigger = styled(TabsPrimitive.Trigger, {
  className: "style",
});
export const StyledTabsContent = styled(TabsPrimitive.Content, {
  className: "style",
});

// Toggle
export const StyledToggleRoot = styled(TogglePrimitive.Root, {
  className: "style",
});

// ToggleGroup
export const StyledToggleGroupRoot = styled(ToggleGroupPrimitive.Root, {
  className: "style",
});
export const StyledToggleGroupItem = styled(ToggleGroupPrimitive.Item, {
  className: "style",
});

// Tooltip
export const StyledTooltipRoot = styled(TooltipPrimitive.Root, {
  className: "style",
});
export const StyledTooltipTrigger = styled(TooltipPrimitive.Trigger, {
  className: "style",
});
export const StyledTooltipPortal = styled(TooltipPrimitive.Portal, {
  className: "style",
});
export const StyledTooltipContent = styled(TooltipPrimitive.Content, {
  className: "style",
});
