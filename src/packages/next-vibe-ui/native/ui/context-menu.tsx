import * as ContextMenuPrimitive from "@rn-primitives/context-menu";
import * as React from "react";
import { StyleSheet, View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";
import { Check } from "./icons/Check";
import { ChevronRight } from "./icons/ChevronRight";
import { Span } from "./span";
import { TextClassContext } from "./text";

// Import ALL types from web - ZERO definitions here
import type {
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuGroupProps,
  ContextMenuPortalProps,
  ContextMenuSubProps,
  ContextMenuRadioGroupProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioItemProps,
  ContextMenuLabelProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
} from "@/packages/next-vibe-ui/web/ui/context-menu";

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_ITEM =
  "select-none text-sm text-lg text-popover-foreground group-focus:text-accent-foreground";
/* eslint-enable i18next/no-literal-string */

// Local styled components - use direct primitives to avoid type instantiation issues
// The styled() function from nativewind has overly complex type inference for these components
const StyledContextMenuSubTrigger = ContextMenuPrimitive.SubTrigger;
const StyledContextMenuSubContent = ContextMenuPrimitive.SubContent;
const StyledContextMenuContent = ContextMenuPrimitive.Content;
const StyledContextMenuItem = ContextMenuPrimitive.Item;
const StyledContextMenuCheckboxItem = ContextMenuPrimitive.CheckboxItem;
const StyledContextMenuRadioItem = ContextMenuPrimitive.RadioItem;
const StyledContextMenuLabel = ContextMenuPrimitive.Label;
const StyledContextMenuSeparator = ContextMenuPrimitive.Separator;
const StyledContextMenuItemIndicator = ContextMenuPrimitive.ItemIndicator;

function ContextMenu({
  children,
  ...props
}: ContextMenuRootProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Root {...props}>{children}</ContextMenuPrimitive.Root>
  );
}
ContextMenu.displayName = ContextMenuPrimitive.Root.displayName;

function ContextMenuTrigger({
  children,
  asChild,
  ...props
}: ContextMenuTriggerProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </ContextMenuPrimitive.Trigger>
  );
}
ContextMenuTrigger.displayName = ContextMenuPrimitive.Trigger.displayName;

function ContextMenuGroup({
  children,
}: ContextMenuGroupProps): React.JSX.Element {
  return <ContextMenuPrimitive.Group>{children}</ContextMenuPrimitive.Group>;
}
ContextMenuGroup.displayName = ContextMenuPrimitive.Group.displayName;

function ContextMenuPortal({
  children,
}: ContextMenuPortalProps): React.JSX.Element {
  return <ContextMenuPrimitive.Portal>{children}</ContextMenuPrimitive.Portal>;
}
ContextMenuPortal.displayName = "ContextMenuPortal";

function ContextMenuSub({
  children,
  ...props
}: ContextMenuSubProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.Sub {...props}>{children}</ContextMenuPrimitive.Sub>
  );
}
ContextMenuSub.displayName = ContextMenuPrimitive.Sub.displayName;

function ContextMenuRadioGroup({
  children,
  value,
  onValueChange,
  ...props
}: ContextMenuRadioGroupProps): React.JSX.Element {
  return (
    <ContextMenuPrimitive.RadioGroup
      value={value ?? ""}
      onValueChange={onValueChange ?? (() => {})} // eslint-disable-line no-empty-function
      {...props}
    >
      {children}
    </ContextMenuPrimitive.RadioGroup>
  );
}
ContextMenuRadioGroup.displayName = ContextMenuPrimitive.RadioGroup.displayName;

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps): React.JSX.Element {
  const { open } = ContextMenuPrimitive.useSubContext();
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm text-lg text-primary",
        open && "text-accent-foreground",
      )}
    >
      <StyledContextMenuSubTrigger
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
      </StyledContextMenuSubTrigger>
    </TextClassContext.Provider>
  );
}
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

function ContextMenuSubContent({
  className,
  children,
  ...props
}: ContextMenuSubContentProps): React.JSX.Element {
  const { open } = ContextMenuPrimitive.useSubContext();
  return (
    <StyledContextMenuSubContent
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
    </StyledContextMenuSubContent>
  );
}
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

function ContextMenuContent({
  className,
  children,
  ...props
}: ContextMenuContentProps): React.JSX.Element {
  const { open } = ContextMenuPrimitive.useRootContext();
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <StyledContextMenuContent
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
        </StyledContextMenuContent>
      </ContextMenuPrimitive.Overlay>
    </ContextMenuPrimitive.Portal>
  );
}
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

function ContextMenuItem({
  className,
  inset,
  children,
  ...props
}: ContextMenuItemProps): React.JSX.Element {
  return (
    <TextClassContext.Provider value={TEXT_CLASS_ITEM}>
      <StyledContextMenuItem
        className={cn(
          "relative flex flex-row cursor-default gap-2 items-center rounded-sm px-2 py-1.5 py-2 outline-none focus:bg-accent active:bg-accent hover:bg-accent group",
          inset && "pl-8",
          className,
        )}
        {...props}
      >
        {children}
      </StyledContextMenuItem>
    </TextClassContext.Provider>
  );
}
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: ContextMenuCheckboxItemProps): React.JSX.Element {
  return (
    <StyledContextMenuCheckboxItem
      className={cn(
        "relative flex flex-row cursor-default items-center group rounded-sm py-1.5 py-2 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
        className,
      )}
      checked={checked ?? false}
      onCheckedChange={onCheckedChange ?? (() => {})} // eslint-disable-line no-empty-function
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledContextMenuItemIndicator>
          <Check size={14} strokeWidth={3} className="text-foreground" />
        </StyledContextMenuItemIndicator>
      </View>
      {children}
    </StyledContextMenuCheckboxItem>
  );
}
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName;

function ContextMenuRadioItem({
  className,
  children,
  value,
  ...props
}: ContextMenuRadioItemProps): React.JSX.Element {
  return (
    <StyledContextMenuRadioItem
      className={cn(
        "relative flex flex-row cursor-default group items-center rounded-sm py-1.5 py-2 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
        className,
      )}
      value={value ?? ""}
      {...props}
    >
      <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <StyledContextMenuItemIndicator>
          <View className="bg-foreground h-2 w-2 rounded-full" />
        </StyledContextMenuItemIndicator>
      </View>
      {children}
    </StyledContextMenuRadioItem>
  );
}
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

function ContextMenuLabel({
  className,
  inset,
  children,
  ...props
}: ContextMenuLabelProps): React.JSX.Element {
  return (
    <StyledContextMenuLabel
      className={cn(
        "px-2 py-1.5 text-sm text-base font-semibold text-foreground cursor-default",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </StyledContextMenuLabel>
  );
}
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuSeparatorProps): React.JSX.Element {
  return (
    <StyledContextMenuSeparator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

function ContextMenuShortcut({
  className,
  children,
  ...props
}: ContextMenuShortcutProps): React.JSX.Element {
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
ContextMenuShortcut.displayName = "ContextMenuShortcut";

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
};
