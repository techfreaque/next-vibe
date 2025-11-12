import * as MenubarPrimitive from "@rn-primitives/menubar";
import * as React from "react";
import { StyleSheet, View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";
import { Check } from "./icons/Check";
import { ChevronRight } from "./icons/ChevronRight";
import { Span } from "./span";
import { TextClassContext } from "./text";

// Import ALL types from web - ZERO definitions here
import type {
  MenubarRootProps,
  MenubarMenuProps,
  MenubarTriggerProps,
  MenubarGroupProps,
  MenubarPortalProps,
  MenubarSubProps,
  MenubarRadioGroupProps,
  MenubarSubTriggerProps,
  MenubarSubContentProps,
  MenubarContentProps,
  MenubarItemProps,
  MenubarCheckboxItemProps,
  MenubarRadioItemProps,
  MenubarLabelProps,
  MenubarSeparatorProps,
  MenubarShortcutProps,
} from "@/packages/next-vibe-ui/web/ui/menubar";

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_ITEM =
  "select-none text-sm text-lg text-popover-foreground group-focus:text-accent-foreground";
/* eslint-enable i18next/no-literal-string */

// Local styled components - use direct primitives to avoid type instantiation issues
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

function Menubar({
  className,
  children,
  value,
  onValueChange,
  ...props
}: MenubarRootProps): React.JSX.Element {
  const handleValueChange = React.useCallback(
    (newValue: string | undefined) => {
      if (onValueChange) {
        onValueChange(newValue ?? "");
      }
    },
    [onValueChange],
  );

  return (
    <MenubarPrimitive.Root
      value={value}
      onValueChange={handleValueChange}
      className={cn(
        "flex flex-row h-9 items-center space-x-1 rounded-md border border-border bg-background p-1 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </MenubarPrimitive.Root>
  );
}
Menubar.displayName = MenubarPrimitive.Root.displayName;

function MenubarMenu({
  children,
  value,
  ...props
}: MenubarMenuProps): React.JSX.Element {
  return (
    <MenubarPrimitive.Menu value={value} {...props}>
      {children}
    </MenubarPrimitive.Menu>
  );
}
MenubarMenu.displayName = MenubarPrimitive.Menu.displayName;

function MenubarTrigger({
  className,
  children,
  ...props
}: MenubarTriggerProps): React.JSX.Element {
  const { value } = MenubarPrimitive.useRootContext();
  const { value: itemValue } = MenubarPrimitive.useMenuContext();

  return (
    <StyledMenubarTrigger
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground active:bg-accent",
        value === itemValue && "bg-accent text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </StyledMenubarTrigger>
  );
}
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

function MenubarGroup({ children }: MenubarGroupProps): React.JSX.Element {
  return <MenubarPrimitive.Group>{children}</MenubarPrimitive.Group>;
}
MenubarGroup.displayName = MenubarPrimitive.Group.displayName;

function MenubarPortal({ children }: MenubarPortalProps): React.JSX.Element {
  return <MenubarPrimitive.Portal>{children}</MenubarPrimitive.Portal>;
}
MenubarPortal.displayName = "MenubarPortal";

function MenubarSub({
  children,
  ...props
}: MenubarSubProps): React.JSX.Element {
  return <MenubarPrimitive.Sub {...props}>{children}</MenubarPrimitive.Sub>;
}
MenubarSub.displayName = MenubarPrimitive.Sub.displayName;

function MenubarRadioGroup({
  children,
  value,
  onValueChange,
  ...props
}: MenubarRadioGroupProps): React.JSX.Element {
  return (
    <MenubarPrimitive.RadioGroup
      value={value ?? ""}
      onValueChange={onValueChange ?? (() => {})} // eslint-disable-line no-empty-function
      {...props}
    >
      {children}
    </MenubarPrimitive.RadioGroup>
  );
}
MenubarRadioGroup.displayName = MenubarPrimitive.RadioGroup.displayName;

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenubarSubTriggerProps): React.JSX.Element {
  const { open } = MenubarPrimitive.useSubContext();
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm text-lg text-primary",
        open && "text-accent-foreground",
      )}
    >
      <StyledMenubarSubTrigger
        className={cn(
          "flex flex-row cursor-default select-none gap-2 items-center focus:bg-accent hover:bg-accent active:bg-accent rounded-sm px-2 py-1.5 outline-none",
          open && "bg-accent",
          inset && "pl-8",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronRight size={18} className="ml-auto text-foreground" />
      </StyledMenubarSubTrigger>
    </TextClassContext.Provider>
  );
}
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

function MenubarSubContent({
  className,
  children,
  ...props
}: MenubarSubContentProps): React.JSX.Element {
  const { open } = MenubarPrimitive.useSubContext();
  return (
    <StyledMenubarSubContent
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-md border border-border mt-1 bg-popover p-1 text-popover-foreground shadow-lg shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        open
          ? "animate-in fade-in-0 zoom-in-95"
          : "animate-out fade-out-0 zoom-out",
        className,
      )}
      {...props}
    >
      {children}
    </StyledMenubarSubContent>
  );
}
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

function MenubarContent({
  className,
  children,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: MenubarContentProps): React.JSX.Element {
  const { value } = MenubarPrimitive.useRootContext();
  const { value: itemValue } = MenubarPrimitive.useMenuContext();
  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <StyledMenubarContent
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          className={cn(
            "z-50 min-w-48 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            value === itemValue
              ? "animate-in fade-in-0 zoom-in-95"
              : "animate-out fade-out-0 zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
        </StyledMenubarContent>
      </MenubarPrimitive.Overlay>
    </MenubarPrimitive.Portal>
  );
}
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

function MenubarItem({
  className,
  inset,
  children,
  ...props
}: MenubarItemProps): React.JSX.Element {
  return (
    <TextClassContext.Provider value={TEXT_CLASS_ITEM}>
      <StyledMenubarItem
        className={cn(
          "relative flex flex-row cursor-default gap-2 items-center rounded-sm px-2 py-1.5 outline-none focus:bg-accent active:bg-accent hover:bg-accent group",
          inset && "pl-8",
          className,
        )}
        {...props}
      >
        {children}
      </StyledMenubarItem>
    </TextClassContext.Provider>
  );
}
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

function MenubarCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: MenubarCheckboxItemProps): React.JSX.Element {
  return (
    <StyledMenubarCheckboxItem
      className={cn(
        "relative flex flex-row cursor-default items-center group rounded-sm py-1.5 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
        className,
      )}
      checked={checked ?? false}
      onCheckedChange={onCheckedChange ?? (() => {})} // eslint-disable-line no-empty-function
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledMenubarItemIndicator>
          <Check size={14} strokeWidth={3} className="text-foreground" />
        </StyledMenubarItemIndicator>
      </View>
      {children}
    </StyledMenubarCheckboxItem>
  );
}
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

function MenubarRadioItem({
  className,
  children,
  value,
  ...props
}: MenubarRadioItemProps): React.JSX.Element {
  return (
    <StyledMenubarRadioItem
      className={cn(
        "relative flex flex-row cursor-default group items-center rounded-sm py-1.5 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
        className,
      )}
      value={value ?? ""}
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledMenubarItemIndicator>
          <View className="bg-foreground h-2 w-2 rounded-full" />
        </StyledMenubarItemIndicator>
      </View>
      {children}
    </StyledMenubarRadioItem>
  );
}
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

function MenubarLabel({
  className,
  inset,
  children,
  ...props
}: MenubarLabelProps): React.JSX.Element {
  return (
    <StyledMenubarLabel
      className={cn(
        "px-2 py-1.5 text-sm text-base font-semibold text-foreground cursor-default",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </StyledMenubarLabel>
  );
}
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

function MenubarSeparator({
  className,
  ...props
}: MenubarSeparatorProps): React.JSX.Element {
  return (
    <StyledMenubarSeparator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

function MenubarShortcut({
  className,
  children,
  ...props
}: MenubarShortcutProps): React.JSX.Element {
  return (
    <Span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Span>
  );
}
MenubarShortcut.displayName = "MenubarShortcut";

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
};
