import * as MenubarPrimitive from "@rn-primitives/menubar";
import { cn } from "next-vibe/shared/utils/utils";
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "next-vibe-ui/ui/icons";
import * as React from "react";
import { View } from "react-native";

import type {
  MenubarCheckboxItemProps,
  MenubarContentProps,
  MenubarGroupProps,
  MenubarItemProps,
  MenubarLabelProps,
  MenubarMenuProps,
  MenubarPortalProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarRootProps,
  MenubarSeparatorProps,
  MenubarShortcutProps,
  MenubarSubContentProps,
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarTriggerProps,
} from "@/packages/next-vibe-ui/web/ui/menubar";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { Span } from "./span";

// The styled() function from nativewind has overly complex type inference for these components
const StyledMenubarTrigger = MenubarPrimitive.Trigger;
const StyledMenubarSubTrigger = MenubarPrimitive.SubTrigger;
const StyledMenubarSubContent = MenubarPrimitive.SubContent;
const StyledMenubarContent = MenubarPrimitive.Content;
const StyledMenubarItem = MenubarPrimitive.Item;
const StyledMenubarCheckboxItem = MenubarPrimitive.CheckboxItem;
const StyledMenubarRadioItem = MenubarPrimitive.RadioItem;
const StyledMenubarLabel = MenubarPrimitive.Label;
const StyledMenubarSeparator = MenubarPrimitive.Separator;
const StyledMenubarItemIndicator = MenubarPrimitive.ItemIndicator;

export function Menubar({
  className,
  style,
  children,
  value,
  onValueChange,
}: MenubarRootProps): React.JSX.Element {
  const handleValueChange = React.useCallback(
    (val: string | undefined) => {
      if (onValueChange) {
        onValueChange(val || "");
      }
    },
    [onValueChange],
  );

  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <MenubarPrimitive.Root
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
          className,
        ),
      })}
      value={value || undefined}
      onValueChange={handleValueChange}
    >
      {children}
    </MenubarPrimitive.Root>
  );
}
Menubar.displayName = MenubarPrimitive.Root.displayName || "Menubar";

export function MenubarMenu({ children, value }: MenubarMenuProps): React.JSX.Element {
  return <MenubarPrimitive.Menu value={value || undefined}>{children}</MenubarPrimitive.Menu>;
}
MenubarMenu.displayName = MenubarPrimitive.Menu.displayName || "MenubarMenu";

export function MenubarTrigger({
  className,
  style,
  children,
  ...props
}: MenubarTriggerProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledMenubarTrigger
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          className,
        ),
      })}
      {...props}
    >
      {children}
    </StyledMenubarTrigger>
  );
}
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

export function MenubarGroup({ children }: MenubarGroupProps): React.JSX.Element {
  return <MenubarPrimitive.Group>{children}</MenubarPrimitive.Group>;
}
MenubarGroup.displayName = MenubarPrimitive.Group.displayName;

export function MenubarPortal({
  children,
  forceMount,
  container,
}: MenubarPortalProps): React.JSX.Element {
  return (
    <MenubarPrimitive.Portal forceMount={forceMount} container={container}>
      {children}
    </MenubarPrimitive.Portal>
  );
}
MenubarPortal.displayName = "MenubarPortal";

export function MenubarSub({ children, ...props }: MenubarSubProps): React.JSX.Element {
  return <MenubarPrimitive.Sub {...props}>{children}</MenubarPrimitive.Sub>;
}
MenubarSub.displayName = MenubarPrimitive.Sub.displayName;

export function MenubarRadioGroup({
  children,
  value,
  onValueChange,
}: MenubarRadioGroupProps): React.JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-empty-function -- Default no-op handler for optional prop
  const handleValueChange = onValueChange || ((): void => {});

  return (
    <MenubarPrimitive.RadioGroup value={value || undefined} onValueChange={handleValueChange}>
      {children}
    </MenubarPrimitive.RadioGroup>
  );
}
MenubarRadioGroup.displayName = MenubarPrimitive.RadioGroup.displayName || "MenubarRadioGroup";

export function MenubarSubTrigger({
  className,
  style,
  inset,
  children,
  ...props
}: MenubarSubTriggerProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledMenubarSubTrigger
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
          inset && "pl-8",
          className,
        ),
      })}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </StyledMenubarSubTrigger>
  );
}
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

export function MenubarSubContent({
  className,
  style,
  ...props
}: MenubarSubContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledMenubarSubContent
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        ),
      })}
      {...props}
    />
  );
}
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

export function MenubarContent({
  className,
  style,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: MenubarContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <MenubarPrimitive.Portal>
      <StyledMenubarContent
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          ),
        })}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
}
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

export function MenubarItem({
  className,
  style,
  inset,
  children,
  ...props
}: MenubarItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledMenubarItem
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          inset && "pl-8",
          className,
        ),
      })}
      {...props}
    >
      {children}
    </StyledMenubarItem>
  );
}
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

export function MenubarCheckboxItem({
  className,
  style,
  children,
  checked,
  onCheckedChange,
  ...props
}: MenubarCheckboxItemProps): React.JSX.Element {
  const handleCheckedChange = React.useCallback(
    (checkedValue: boolean): void => {
      if (onCheckedChange) {
        onCheckedChange(checkedValue);
      }
    },
    [onCheckedChange],
  );

  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledMenubarCheckboxItem
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className,
        ),
      })}
      checked={checked ?? false}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledMenubarItemIndicator>
          <CheckIcon className="h-4 w-4" />
        </StyledMenubarItemIndicator>
      </View>
      {children}
    </StyledMenubarCheckboxItem>
  );
}
MenubarCheckboxItem.displayName =
  MenubarPrimitive.CheckboxItem.displayName || "MenubarCheckboxItem";

export function MenubarRadioItem({
  className,
  style,
  children,
  value,
  ...props
}: MenubarRadioItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledMenubarRadioItem
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className,
        ),
      })}
      value={value}
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledMenubarItemIndicator>
          <DotFilledIcon className="h-4 w-4 fill-current" />
        </StyledMenubarItemIndicator>
      </View>
      {children}
    </StyledMenubarRadioItem>
  );
}
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName || "MenubarRadioItem";

export function MenubarLabel({
  className,
  style,
  inset,
  children,
  ...props
}: MenubarLabelProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledMenubarLabel
      {...applyStyleType({
        nativeStyle,
        className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
      })}
      {...props}
    >
      {children}
    </StyledMenubarLabel>
  );
}
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

export function MenubarSeparator({
  className,
  style,
  ...props
}: MenubarSeparatorProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledMenubarSeparator
      {...applyStyleType({
        nativeStyle,
        className: cn("-mx-1 my-1 h-px bg-muted", className),
      })}
      {...props}
    />
  );
}
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

export function MenubarShortcut({
  className,
  children,
  ...props
}: MenubarShortcutProps): React.JSX.Element {
  return (
    <Span
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    >
      {children}
    </Span>
  );
}
MenubarShortcut.displayName = "MenubarShortcut";
