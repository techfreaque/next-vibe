import * as ContextMenuPrimitive from "@rn-primitives/context-menu";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type {
  ContextMenuCheckboxItemProps,
  ContextMenuContentProps,
  ContextMenuGroupProps,
  ContextMenuItemProps,
  ContextMenuLabelProps,
  ContextMenuPortalProps,
  ContextMenuRadioGroupProps,
  ContextMenuRadioItemProps,
  ContextMenuRootProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
  ContextMenuSubContentProps,
  ContextMenuSubProps,
  ContextMenuSubTriggerProps,
  ContextMenuTriggerProps,
} from "@/packages/next-vibe-ui/web/ui/context-menu";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle, styledNative } from "../utils/style-converter";
import { Check } from "./icons/Check";
import { ChevronRight } from "./icons/ChevronRight";
import { Span } from "./span";
import { TextClassContext } from "./text";

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_ITEM =
  "select-none text-sm text-lg text-popover-foreground group-focus:text-accent-foreground";
/* eslint-enable i18next/no-literal-string */

const StyledView = styledNative(View);
const StyledText = styledNative(Text);
const StyledPressable = styledNative(Pressable);

function ContextMenu({ children, ...props }: ContextMenuRootProps): React.JSX.Element {
  return <ContextMenuPrimitive.Root {...props}>{children}</ContextMenuPrimitive.Root>;
}
ContextMenu.displayName = ContextMenuPrimitive.Root.displayName;

function ContextMenuTrigger({
  children,
  asChild,
  className,
  style,
  ...props
}: ContextMenuTriggerProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <ContextMenuPrimitive.Trigger
      {...applyStyleType({
        nativeStyle,
        className,
      })}
      asChild={asChild}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Trigger>
  );
}
ContextMenuTrigger.displayName = ContextMenuPrimitive.Trigger.displayName;

function ContextMenuGroup({ children }: ContextMenuGroupProps): React.JSX.Element {
  return <ContextMenuPrimitive.Group>{children}</ContextMenuPrimitive.Group>;
}
ContextMenuGroup.displayName = ContextMenuPrimitive.Group.displayName;

function ContextMenuPortal({ children }: ContextMenuPortalProps): React.JSX.Element {
  return <ContextMenuPrimitive.Portal>{children}</ContextMenuPrimitive.Portal>;
}
ContextMenuPortal.displayName = "ContextMenuPortal";

function ContextMenuSub({ children, ...props }: ContextMenuSubProps): React.JSX.Element {
  return <ContextMenuPrimitive.Sub {...props}>{children}</ContextMenuPrimitive.Sub>;
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
      // eslint-disable-next-line no-empty-function -- Intentional no-op default handler
      onValueChange={onValueChange ?? (() => {})}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.RadioGroup>
  );
}
ContextMenuRadioGroup.displayName = ContextMenuPrimitive.RadioGroup.displayName;

function ContextMenuSubTrigger({
  className,
  style,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps): React.JSX.Element {
  const { open } = ContextMenuPrimitive.useSubContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <TextClassContext.Provider
      value={cn("select-none text-sm text-lg text-primary", open && "text-accent-foreground")}
    >
      <ContextMenuPrimitive.SubTrigger asChild {...props}>
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
      </ContextMenuPrimitive.SubTrigger>
    </TextClassContext.Provider>
  );
}
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

function ContextMenuSubContent({
  className,
  style,
  children,
  ...props
}: ContextMenuSubContentProps): React.JSX.Element {
  const { open } = ContextMenuPrimitive.useSubContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <ContextMenuPrimitive.SubContent asChild {...props}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "z-50 min-w-32 overflow-hidden rounded-md border border-border mt-1 bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            open ? "animate-in fade-in-0 zoom-in-95" : "animate-out fade-out-0 zoom-out",
            className,
          ),
        })}
      >
        {children}
      </StyledView>
    </ContextMenuPrimitive.SubContent>
  );
}
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

function ContextMenuContent({
  className,
  style,
  children,
  onCloseAutoFocus,
  forceMount,
}: ContextMenuContentProps): React.JSX.Element {
  const { open } = ContextMenuPrimitive.useRootContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <ContextMenuPrimitive.Content
          asChild
          onCloseAutoFocus={onCloseAutoFocus}
          forceMount={forceMount}
        >
          <StyledView
            {...applyStyleType({
              nativeStyle,
              className: cn(
                "z-50 min-w-32 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                open ? "animate-in fade-in-0 zoom-in-95" : "animate-out fade-out-0 zoom-out-95",
                className,
              ),
            })}
          >
            {children}
          </StyledView>
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Overlay>
    </ContextMenuPrimitive.Portal>
  );
}
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

function ContextMenuItem({
  className,
  style,
  inset,
  children,
  disabled,
  asChild,
}: ContextMenuItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  if (asChild) {
    return (
      <TextClassContext.Provider value={TEXT_CLASS_ITEM}>
        <ContextMenuPrimitive.Item asChild>{children}</ContextMenuPrimitive.Item>
      </TextClassContext.Provider>
    );
  }

  return (
    <TextClassContext.Provider value={TEXT_CLASS_ITEM}>
      <ContextMenuPrimitive.Item asChild disabled={disabled}>
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
      </ContextMenuPrimitive.Item>
    </TextClassContext.Provider>
  );
}
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

function ContextMenuCheckboxItem({
  className,
  style,
  children,
  checked,
  onCheckedChange,
  ...props
}: ContextMenuCheckboxItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <ContextMenuPrimitive.CheckboxItem
      asChild
      checked={checked ?? false}
      // eslint-disable-next-line no-empty-function -- Intentional no-op default handler
      onCheckedChange={onCheckedChange ?? (() => {})}
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
          <ContextMenuPrimitive.ItemIndicator>
            <Check size={14} strokeWidth={3} className="text-foreground" />
          </ContextMenuPrimitive.ItemIndicator>
        </StyledView>
        {children}
      </StyledPressable>
    </ContextMenuPrimitive.CheckboxItem>
  );
}
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

function ContextMenuRadioItem({
  className,
  style,
  children,
  value,
  ...props
}: ContextMenuRadioItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <ContextMenuPrimitive.RadioItem asChild value={value ?? ""} {...props}>
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
          <ContextMenuPrimitive.ItemIndicator>
            <StyledView className="bg-foreground h-2 w-2 rounded-full" />
          </ContextMenuPrimitive.ItemIndicator>
        </StyledView>
        {children}
      </StyledPressable>
    </ContextMenuPrimitive.RadioItem>
  );
}
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

function ContextMenuLabel({
  className,
  style,
  inset,
  children,
  ...props
}: ContextMenuLabelProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <ContextMenuPrimitive.Label asChild {...props}>
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
    </ContextMenuPrimitive.Label>
  );
}
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

function ContextMenuSeparator({
  className,
  style,
  ...props
}: ContextMenuSeparatorProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <ContextMenuPrimitive.Separator asChild {...props}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn("-mx-1 my-1 h-px bg-border", className),
        })}
      />
    </ContextMenuPrimitive.Separator>
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
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
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
