import * as DropdownMenuPrimitive from "@rn-primitives/dropdown-menu";
import * as React from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import { cn } from "next-vibe/shared/utils/utils";
import { Check } from "./icons/Check";
import { ChevronRight } from "./icons/ChevronRight";
import { Span } from "./span";
import { TextClassContext } from "./text";

// Import ALL types from web - ZERO definitions here
import type {
  DropdownMenuRootProps,
  DropdownMenuTriggerProps,
  DropdownMenuGroupProps,
  DropdownMenuPortalProps,
  DropdownMenuSubProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
} from "@/packages/next-vibe-ui/web/ui/dropdown-menu";


/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_ITEM =
  "select-none text-sm text-lg text-popover-foreground group-focus:text-accent-foreground";
/* eslint-enable i18next/no-literal-string */

// Local styled components - use direct primitives to avoid type instantiation issues
// The styled() function from nativewind has overly complex type inference for these components
const StyledDropdownMenuSubTrigger = DropdownMenuPrimitive.SubTrigger;
const StyledDropdownMenuSubContent = DropdownMenuPrimitive.SubContent;
const StyledDropdownMenuContent = DropdownMenuPrimitive.Content;
const StyledDropdownMenuItem = DropdownMenuPrimitive.Item;
const StyledDropdownMenuCheckboxItem = DropdownMenuPrimitive.CheckboxItem;
const StyledDropdownMenuRadioItem = DropdownMenuPrimitive.RadioItem;
const StyledDropdownMenuLabel = DropdownMenuPrimitive.Label;
const StyledDropdownMenuSeparator = DropdownMenuPrimitive.Separator;
const StyledDropdownMenuItemIndicator = DropdownMenuPrimitive.ItemIndicator;

function DropdownMenu({ children, ...props }: DropdownMenuRootProps): React.JSX.Element {
  return <DropdownMenuPrimitive.Root {...props}>{children}</DropdownMenuPrimitive.Root>;
}
DropdownMenu.displayName = DropdownMenuPrimitive.Root.displayName;

function DropdownMenuTrigger({ children, asChild, ...props }: DropdownMenuTriggerProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
}
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

function DropdownMenuGroup({ children }: DropdownMenuGroupProps): React.JSX.Element {
  return <DropdownMenuPrimitive.Group>{children}</DropdownMenuPrimitive.Group>;
}
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName;

function DropdownMenuPortal({ children }: DropdownMenuPortalProps): React.JSX.Element {
  return <DropdownMenuPrimitive.Portal>{children}</DropdownMenuPrimitive.Portal>;
}
DropdownMenuPortal.displayName = "DropdownMenuPortal";

function DropdownMenuSub({ children, ...props }: DropdownMenuSubProps): React.JSX.Element {
  return <DropdownMenuPrimitive.Sub {...props}>{children}</DropdownMenuPrimitive.Sub>;
}
DropdownMenuSub.displayName = DropdownMenuPrimitive.Sub.displayName;

function DropdownMenuRadioGroup({ children, value, onValueChange, ...props }: DropdownMenuRadioGroupProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.RadioGroup
      value={value ?? ""}
      onValueChange={onValueChange ?? (() => {})} // eslint-disable-line no-empty-function
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.RadioGroup>
  );
}
DropdownMenuRadioGroup.displayName = DropdownMenuPrimitive.RadioGroup.displayName;

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps): React.JSX.Element {
  const { open } = DropdownMenuPrimitive.useSubContext();
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm text-lg text-primary",
        open && "text-accent-foreground",
      )}
    >
      <StyledDropdownMenuSubTrigger
        className={cn(
          "flex flex-row cursor-default select-none gap-2 items-center focus:bg-accent hover:bg-accent active:bg-accent rounded-sm px-2 py-1.5 py-2 outline-none",
          open && "bg-accent",
          inset && "pl-8",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronRight size={18} className="ml-auto text-foreground" />
      </StyledDropdownMenuSubTrigger>
    </TextClassContext.Provider>
  );
}
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

function DropdownMenuSubContent({
  className,
  children,
  ...props
}: DropdownMenuSubContentProps): React.JSX.Element {
  const { open } = DropdownMenuPrimitive.useSubContext();
  return (
    <StyledDropdownMenuSubContent
      className={cn(
        "z-50 min-w-32 overflow-hidden rounded-md border border-border mt-1 bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        open
          ? "animate-in fade-in-0 zoom-in-95"
          : "animate-out fade-out-0 zoom-out",
        className,
      )}
      {...props}
    >
      {children}
    </StyledDropdownMenuSubContent>
  );
}
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

function DropdownMenuContent({
  className,
  children,
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps): React.JSX.Element {
  const { open } = DropdownMenuPrimitive.useRootContext();
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <StyledDropdownMenuContent
          sideOffset={sideOffset}
          className={cn(
            "z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            open
              ? "animate-in fade-in-0 zoom-in-95"
              : "animate-out fade-out-0 zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
        </StyledDropdownMenuContent>
      </DropdownMenuPrimitive.Overlay>
    </DropdownMenuPrimitive.Portal>
  );
}
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

function DropdownMenuItem({
  className,
  inset,
  children,
  ...props
}: DropdownMenuItemProps): React.JSX.Element {
  return (
    <TextClassContext.Provider value={TEXT_CLASS_ITEM}>
      <StyledDropdownMenuItem
        className={cn(
          "relative flex flex-row cursor-default gap-2 items-center rounded-sm px-2 py-1.5 py-2 outline-none focus:bg-accent active:bg-accent hover:bg-accent group",
          inset && "pl-8",
          className,
        )}
        {...props}
      >
        {children}
      </StyledDropdownMenuItem>
    </TextClassContext.Provider>
  );
}
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: DropdownMenuCheckboxItemProps): React.JSX.Element {
  return (
    <StyledDropdownMenuCheckboxItem
      className={cn(
        "relative flex flex-row cursor-default items-center group rounded-sm py-1.5 py-2 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
        className,
      )}
      checked={checked ?? false}
      onCheckedChange={onCheckedChange ?? (() => {})} // eslint-disable-line no-empty-function
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledDropdownMenuItemIndicator>
          <Check size={14} strokeWidth={3} className="text-foreground" />
        </StyledDropdownMenuItemIndicator>
      </View>
      {children}
    </StyledDropdownMenuCheckboxItem>
  );
}
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

function DropdownMenuRadioItem({
  className,
  children,
  value,
  ...props
}: DropdownMenuRadioItemProps): React.JSX.Element {
  return (
    <StyledDropdownMenuRadioItem
      className={cn(
        "relative flex flex-row cursor-default group items-center rounded-sm py-1.5 py-2 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
        className,
      )}
      value={value ?? ""}
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledDropdownMenuItemIndicator>
          <View className="bg-foreground h-2 w-2 rounded-full" />
        </StyledDropdownMenuItemIndicator>
      </View>
      {children}
    </StyledDropdownMenuRadioItem>
  );
}
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

function DropdownMenuLabel({
  className,
  inset,
  children,
  ...props
}: DropdownMenuLabelProps): React.JSX.Element {
  return (
    <StyledDropdownMenuLabel
      className={cn(
        "px-2 py-1.5 text-sm text-base font-semibold text-foreground cursor-default",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </StyledDropdownMenuLabel>
  );
}
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps): React.JSX.Element {
  return (
    <StyledDropdownMenuSeparator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

function DropdownMenuShortcut({
  className,
  children,
  ...props
}: DropdownMenuShortcutProps): React.JSX.Element {
  return (
    <Span
      className={cn(
        "ml-auto text-xs text-sm tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </Span>
  );
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

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
};
