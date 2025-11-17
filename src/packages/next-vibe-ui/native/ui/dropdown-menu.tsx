import * as DropdownMenuPrimitive from "@rn-primitives/dropdown-menu";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";
import { Check } from "./icons/Check";
import { ChevronRight } from "./icons/ChevronRight";
import { Span } from "./span";
import { TextClassContext } from "./text";

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

const StyledView = styled(View, { className: "style" });
const StyledText = styled(Text, { className: "style" });
const StyledPressable = styled(Pressable, { className: "style" });

function DropdownMenu({
  children,
  ...props
}: DropdownMenuRootProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Root {...props}>
      {children}
    </DropdownMenuPrimitive.Root>
  );
}
DropdownMenu.displayName = DropdownMenuPrimitive.Root.displayName;

function DropdownMenuTrigger({
  children,
  asChild,
  ...props
}: DropdownMenuTriggerProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
}
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

function DropdownMenuGroup({
  children,
}: DropdownMenuGroupProps): React.JSX.Element {
  return <DropdownMenuPrimitive.Group>{children}</DropdownMenuPrimitive.Group>;
}
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName;

function DropdownMenuPortal({
  children,
}: DropdownMenuPortalProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Portal>{children}</DropdownMenuPrimitive.Portal>
  );
}
DropdownMenuPortal.displayName = "DropdownMenuPortal";

function DropdownMenuSub({
  children,
  ...props
}: DropdownMenuSubProps): React.JSX.Element {
  return (
    <DropdownMenuPrimitive.Sub {...props}>{children}</DropdownMenuPrimitive.Sub>
  );
}
DropdownMenuSub.displayName = DropdownMenuPrimitive.Sub.displayName;

function DropdownMenuRadioGroup({
  children,
  value,
  onValueChange,
  ...props
}: DropdownMenuRadioGroupProps): React.JSX.Element {
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
DropdownMenuRadioGroup.displayName =
  DropdownMenuPrimitive.RadioGroup.displayName;

function DropdownMenuSubTrigger({
  className,
  style,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps): React.JSX.Element {
  const { open } = DropdownMenuPrimitive.useSubContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-sm text-lg text-primary",
        open && "text-accent-foreground",
      )}
    >
      <DropdownMenuPrimitive.SubTrigger asChild {...props}>
        <StyledPressable
          {...applyStyleType({
            nativeStyle,
            className: cn(
              "flex flex-row cursor-default select-none gap-2 items-center focus:bg-accent hover:bg-accent active:bg-accent rounded-sm px-2 py-1.5 py-2 outline-none",
              open && "bg-accent",
              inset && "pl-8",
              className,
            ),
          })}
        >
          {children}
          <ChevronRight size={18} className="ml-auto text-foreground" />
        </StyledPressable>
      </DropdownMenuPrimitive.SubTrigger>
    </TextClassContext.Provider>
  );
}
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

function DropdownMenuSubContent({
  className,
  style,
  children,
  ...props
}: DropdownMenuSubContentProps): React.JSX.Element {
  const { open } = DropdownMenuPrimitive.useSubContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DropdownMenuPrimitive.SubContent asChild {...props}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "z-50 min-w-32 overflow-hidden rounded-md border border-border mt-1 bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            open
              ? "animate-in fade-in-0 zoom-in-95"
              : "animate-out fade-out-0 zoom-out",
            className,
          ),
        })}
      >
        {children}
      </StyledView>
    </DropdownMenuPrimitive.SubContent>
  );
}
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

function DropdownMenuContent({
  className,
  style,
  children,
  sideOffset = 4,
  align,
  onCloseAutoFocus,
  forceMount,
}: DropdownMenuContentProps): React.JSX.Element {
  const { open } = DropdownMenuPrimitive.useRootContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Overlay
        style={StyleSheet.absoluteFill}
      >
        <DropdownMenuPrimitive.Content
          asChild
          sideOffset={sideOffset}
          align={align}
          onCloseAutoFocus={onCloseAutoFocus}
          forceMount={forceMount}
        >
          <StyledView
            {...applyStyleType({
              nativeStyle,
              className: cn(
                "z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                open
                  ? "animate-in fade-in-0 zoom-in-95"
                  : "animate-out fade-out-0 zoom-out-95",
                className,
              ),
            })}
          >
            {children}
          </StyledView>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Overlay>
    </DropdownMenuPrimitive.Portal>
  );
}
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

function DropdownMenuItem({
  className,
  style,
  inset,
  children,
  onSelect: _onSelect, // Web-only: native handles internally via onPress
  disabled,
  asChild,
  onClick: _onClick, // Filter out web-only props
  key: _key, // Filter out web-only props
  // Filter out web-only props
}: DropdownMenuItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  if (asChild) {
    return (
      <TextClassContext.Provider value={TEXT_CLASS_ITEM}>
        <DropdownMenuPrimitive.Item asChild>
          {children}
        </DropdownMenuPrimitive.Item>
      </TextClassContext.Provider>
    );
  }

  return (
    <TextClassContext.Provider value={TEXT_CLASS_ITEM}>
      <DropdownMenuPrimitive.Item asChild disabled={disabled}>
        <StyledPressable
          {...applyStyleType({
            nativeStyle,
            className: cn(
              "relative flex flex-row cursor-default gap-2 items-center rounded-sm px-2 py-1.5 py-2 outline-none focus:bg-accent active:bg-accent hover:bg-accent group",
              inset && "pl-8",
              className,
            ),
          })}
          disabled={disabled}
        >
          {children}
        </StyledPressable>
      </DropdownMenuPrimitive.Item>
    </TextClassContext.Provider>
  );
}
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

function DropdownMenuCheckboxItem({
  className,
  style,
  children,
  checked,
  onCheckedChange,
  ...props
}: DropdownMenuCheckboxItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DropdownMenuPrimitive.CheckboxItem
      asChild
      checked={checked ?? false}
      onCheckedChange={onCheckedChange ?? (() => {})} // eslint-disable-line no-empty-function
      {...props}
    >
      <StyledPressable
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "relative flex flex-row cursor-default items-center group rounded-sm py-1.5 py-2 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
            className,
          ),
        })}
      >
        <StyledView
          className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
          style={convertCSSToViewStyle({ position: "absolute", left: 8 })}
        >
          <DropdownMenuPrimitive.ItemIndicator>
            <Check size={14} strokeWidth={3} className="text-foreground" />
          </DropdownMenuPrimitive.ItemIndicator>
        </StyledView>
        {children}
      </StyledPressable>
    </DropdownMenuPrimitive.CheckboxItem>
  );
}
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

function DropdownMenuRadioItem({
  className,
  style,
  children,
  value,
  ...props
}: DropdownMenuRadioItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DropdownMenuPrimitive.RadioItem
      asChild
      value={value ?? ""}
      {...props}
    >
      <StyledPressable
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "relative flex flex-row cursor-default group items-center rounded-sm py-1.5 py-2 pl-8 pr-2 outline-none focus:bg-accent active:bg-accent",
            className,
          ),
        })}
      >
        <StyledView
          className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"
          style={convertCSSToViewStyle({ position: "absolute", left: 8 })}
        >
          <DropdownMenuPrimitive.ItemIndicator>
            <StyledView className="bg-foreground h-2 w-2 rounded-full" />
          </DropdownMenuPrimitive.ItemIndicator>
        </StyledView>
        {children}
      </StyledPressable>
    </DropdownMenuPrimitive.RadioItem>
  );
}
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

function DropdownMenuLabel({
  className,
  style,
  inset,
  children,
  ...props
}: DropdownMenuLabelProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DropdownMenuPrimitive.Label asChild {...props}>
      <StyledText
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "px-2 py-1.5 text-sm text-base font-semibold text-foreground cursor-default",
            inset && "pl-8",
            className,
          ),
        })}
      >
        {children}
      </StyledText>
    </DropdownMenuPrimitive.Label>
  );
}
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

function DropdownMenuSeparator({
  className,
  style,
  ...props
}: DropdownMenuSeparatorProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DropdownMenuPrimitive.Separator asChild {...props}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn("-mx-1 my-1 h-px bg-border", className),
        })}
      />
    </DropdownMenuPrimitive.Separator>
  );
}
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

function DropdownMenuShortcut({
  className,
  style: _style,
  children,
  ...props
}: DropdownMenuShortcutProps): React.JSX.Element {
  // Note: style prop is not passed to sub-component due to StyleType discriminated union
  // Native uses className for styling via NativeWind (either style OR className, not both)
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
