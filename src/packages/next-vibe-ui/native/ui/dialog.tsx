import * as DialogPrimitive from "@rn-primitives/dialog";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "@/packages/next-vibe-ui/web/ui/dialog";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle, styledNative } from "../utils/style-converter";
import { X } from "./icons/X";

const StyledView = styledNative(View);
const StyledText = styledNative(Text);
const StyledPressable = styledNative(Pressable);

// CSS className for close button
const CLOSE_BUTTON_CLASSNAME =
  "absolute right-4 top-4 p-0.5 group rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none";

function Dialog({ children, ...props }: DialogRootProps): React.JSX.Element {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}
Dialog.displayName = DialogPrimitive.Root.displayName;

function DialogTrigger({
  children,
  asChild,
  ...props
}: DialogTriggerProps): React.JSX.Element {
  return (
    <DialogPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
}
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

function DialogPortal({
  children,
  ...props
}: DialogPortalProps): React.JSX.Element {
  return <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>;
}
DialogPortal.displayName = "DialogPortal";

function DialogClose({
  children,
  asChild,
  ...props
}: DialogCloseProps): React.JSX.Element {
  return (
    <DialogPrimitive.Close asChild={asChild} {...props}>
      {children}
    </DialogPrimitive.Close>
  );
}
DialogClose.displayName = DialogPrimitive.Close.displayName;

function DialogOverlay({
  className,
  style,
  children,
}: DialogOverlayProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  const renderChildren = (): React.ReactNode => {
    if (typeof children === "function") {
      return (children as (props: { pressed: boolean }) => React.ReactNode)({
        pressed: false,
      });
    }
    return children;
  };

  return (
    <DialogPrimitive.Overlay asChild style={StyleSheet.absoluteFill}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "flex bg-black/80 justify-center items-center p-2",
            className,
          ),
        })}
      >
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          style={convertCSSToViewStyle({ flex: 1 })}
        >
          {renderChildren()}
        </Animated.View>
      </StyledView>
    </DialogPrimitive.Overlay>
  );
}
DialogOverlay.displayName = "DialogOverlay";

function DialogContent({
  className,
  style,
  children,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
}: DialogContentProps): React.JSX.Element {
  const { open } = DialogPrimitive.useRootContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DialogPortal>
      <DialogOverlay>
        <DialogPrimitive.Content
          asChild
          onOpenAutoFocus={onOpenAutoFocus}
          onCloseAutoFocus={onCloseAutoFocus}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onInteractOutside={onInteractOutside}
        >
          <StyledView
            {...applyStyleType({
              nativeStyle,
              className: cn(
                "max-w-lg gap-4 border border-border cursor-default bg-background p-6 shadow-lg duration-200 rounded-lg",
                open
                  ? "animate-in fade-in-0 zoom-in-95"
                  : "animate-out fade-out-0 zoom-out-95",
                className,
              ),
            })}
          >
            {children}
            <DialogPrimitive.Close asChild>
              <StyledPressable className={CLOSE_BUTTON_CLASSNAME}>
                <X
                  size={Platform.OS === "web" ? 16 : 18}
                  className={cn(
                    "text-muted-foreground",
                    open && "text-accent-foreground",
                  )}
                />
              </StyledPressable>
            </DialogPrimitive.Close>
          </StyledView>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
}
DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({
  className,
  style,
  children,
}: DialogHeaderProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex flex-col gap-1.5 text-center sm:text-left",
          className,
        ),
      })}
    >
      {children}
    </StyledView>
  );
}
DialogHeader.displayName = "DialogHeader";

function DialogFooter({
  className,
  style,
  children,
}: DialogFooterProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end gap-2",
          className,
        ),
      })}
    >
      {children}
    </StyledView>
  );
}
DialogFooter.displayName = "DialogFooter";

function DialogTitle({
  className,
  style,
  children,
  ...props
}: DialogTitleProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DialogPrimitive.Title asChild {...props}>
      <StyledText
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "text-lg text-xl text-foreground font-semibold leading-none tracking-tight",
            className,
          ),
        })}
      >
        {children}
      </StyledText>
    </DialogPrimitive.Title>
  );
}
DialogTitle.displayName = DialogPrimitive.Title.displayName;

function DialogDescription({
  className,
  style,
  children,
  ...props
}: DialogDescriptionProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <DialogPrimitive.Description asChild {...props}>
      <StyledText
        {...applyStyleType({
          nativeStyle,
          className: cn("text-sm text-base text-muted-foreground", className),
        })}
      >
        {children}
      </StyledText>
    </DialogPrimitive.Description>
  );
}
DialogDescription.displayName = DialogPrimitive.Description.displayName;

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
};
