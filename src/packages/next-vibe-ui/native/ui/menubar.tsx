import * as MenubarPrimitive from "@rn-primitives/menubar";
import * as React from "react";
import { Platform, type TextProps, View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";

// Import all types from web (web is source of truth)
import type {
  MenubarProps,
  MenubarTriggerProps,
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

import { Check } from "./icons/Check";
import { ChevronDown } from "./icons/ChevronDown";
import { ChevronRight } from "./icons/ChevronRight";
import { ChevronUp } from "./icons/ChevronUp";
import { Span } from "./span";
import { TextClassContext } from "./text";

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_ITEM =
  "select-none text-sm text-lg text-popover-foreground group-focus:text-accent-foreground";
/* eslint-enable i18next/no-literal-string */

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

const MenubarPortal = MenubarPrimitive.Portal;

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

function Menubar({ className, children }: MenubarProps): JSX.Element {
  const [value, setValue] = React.useState<string | undefined>(undefined);

  return (
    <MenubarPrimitive.Root
      value={value}
      onValueChange={setValue}
      className={cn(
        "flex flex-row h-10 h-12 items-center space-x-1 rounded-md border border-border bg-background p-1",
        className,
      )}
    >
      {children}
    </MenubarPrimitive.Root>
  );
}
Menubar.displayName = MenubarPrimitive.Root.displayName;

function MenubarTrigger({
  className,
  children,
}: MenubarTriggerProps): JSX.Element {
  const { value } = MenubarPrimitive.useRootContext();
  const { value: itemValue } = MenubarPrimitive.useMenuContext();

  return (
    <MenubarPrimitive.Trigger
      className={cn(
        "flex flex-row cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm h-10 px-5 py-0 font-medium outline-none focus:bg-accent active:bg-accent focus:text-accent-foreground",
        value === itemValue && "bg-accent text-accent-foreground",
        className,
      )}
    >
      {children}
    </MenubarPrimitive.Trigger>
  );
}
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

function MenubarSubTrigger({
  className,
  inset,
  children,
}: MenubarSubTriggerProps): JSX.Element {
  const { open } = MenubarPrimitive.useSubContext();
  const Icon =
    Platform.OS === "web" ? ChevronRight : open ? ChevronUp : ChevronDown;
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm text-lg text-primary",
        open && "text-accent-foreground",
      )}
    >
      <MenubarPrimitive.SubTrigger
        className={cn(
          "flex flex-row cursor-default select-none items-center gap-2 focus:bg-accent active:bg-accent hover:bg-accent rounded-sm px-2 py-1.5 py-2 outline-none",
          open && "bg-accent",
          inset && "pl-8",
          className,
        )}
      >
        <>
          {children}
          <Icon size={18} className="ml-auto text-foreground" />
        </>
      </MenubarPrimitive.SubTrigger>
    </TextClassContext.Provider>
  );
}
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

function MenubarSubContent({
  className,
  children,
}: MenubarSubContentProps): JSX.Element {
  const { open } = MenubarPrimitive.useSubContext();
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border mt-1 border-border bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        open
          ? "animate-in fade-in-0 zoom-in-95"
          : "animate-out fade-out-0 zoom-out ",
        className,
      )}
    >
      {children}
    </MenubarPrimitive.SubContent>
  );
}
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

function MenubarContent({
  className,
  portalHost,
  children,
  align,
  alignOffset,
  sideOffset,
}: MenubarContentProps & { portalHost?: string }): JSX.Element {
  const { value } = MenubarPrimitive.useRootContext();
  const { value: itemValue } = MenubarPrimitive.useMenuContext();
  return (
    <MenubarPrimitive.Portal hostName={portalHost}>
      <MenubarPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md shadow-foreground/5",
          value === itemValue
            ? "animate-in fade-in-0 zoom-in-95"
            : "animate-out fade-out-0 zoom-out-95",
          className,
        )}
      >
        {children}
      </MenubarPrimitive.Content>
    </MenubarPrimitive.Portal>
  );
}
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

function MenubarItem({
  className,
  inset,
  children,
}: MenubarItemProps): JSX.Element {
  return (
    <TextClassContext.Provider value={TEXT_CLASS_ITEM}>
      <MenubarPrimitive.Item
        className={cn(
          "relative flex flex-row cursor-default items-center gap-2 rounded-sm px-2 py-1.5 py-2 outline-none focus:bg-accent active:bg-accent hover:bg-accent group",
          inset && "pl-8",
          className,
        )}
      >
        {children}
      </MenubarPrimitive.Item>
    </TextClassContext.Provider>
  );
}
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

function MenubarCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
}: MenubarCheckboxItemProps): JSX.Element {
  const handleCheckedChange =
    onCheckedChange ?? ((() => undefined) as (checked: boolean) => void);
  return (
    <MenubarPrimitive.CheckboxItem
      className={cn(
        "relative flex flex-row cursor-default items-center group rounded-sm py-1.5 py-2 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
        className,
      )}
      checked={checked ?? false}
      onCheckedChange={handleCheckedChange}
    >
      <>
        <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <MenubarPrimitive.ItemIndicator>
            <Check size={14} strokeWidth={3} color="#000" />
          </MenubarPrimitive.ItemIndicator>
        </View>
        {children}
      </>
    </MenubarPrimitive.CheckboxItem>
  );
}
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

function MenubarRadioItem({
  className,
  children,
  value,
}: MenubarRadioItemProps): JSX.Element {
  return (
    <MenubarPrimitive.RadioItem
      value={value ?? ""}
      className={cn(
        "relative flex flex-row cursor-default group items-center rounded-sm py-1.5 py-2 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
        className,
      )}
    >
      <>
        <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <MenubarPrimitive.ItemIndicator>
            <View className="bg-foreground h-2 w-2 rounded-full" />
          </MenubarPrimitive.ItemIndicator>
        </View>
        {children}
      </>
    </MenubarPrimitive.RadioItem>
  );
}
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

function MenubarLabel({
  className,
  inset,
  children,
}: MenubarLabelProps): JSX.Element {
  return (
    <MenubarPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-sm text-base font-semibold text-foreground cursor-default",
        inset && "pl-8",
        className,
      )}
    >
      {children}
    </MenubarPrimitive.Label>
  );
}
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

function MenubarSeparator({ className }: MenubarSeparatorProps): JSX.Element {
  return (
    <MenubarPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
    />
  );
}
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({
  className,
  ...props
}: MenubarShortcutProps & TextProps): React.JSX.Element => {
  return (
    <Span
      className={cn(
        "ml-auto text-xs text-sm tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};
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
