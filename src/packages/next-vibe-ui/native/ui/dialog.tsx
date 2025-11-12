import * as DialogPrimitive from "@rn-primitives/dialog";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "../lib/utils";
import { X } from "./icons/X";

// Import ALL types from web - ZERO definitions here
import type {
  DialogRootProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
} from "@/packages/next-vibe-ui/web/ui/dialog";

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

function DialogOverlayWeb({
  className,
  ...props
}: DialogPrimitive.OverlayProps & { className?: string }): React.JSX.Element {
  const { open } = DialogPrimitive.useRootContext();
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "bg-black/80 flex justify-center items-center p-2 absolute top-0 right-0 bottom-0 left-0",
        open ? "animate-in fade-in-0" : "animate-out fade-out-0",
        className,
      )}
      {...props}
    />
  );
}
DialogOverlayWeb.displayName = "DialogOverlayWeb";

function DialogOverlayNative({
  className,
  children,
  ...props
}: DialogPrimitive.OverlayProps & { className?: string }): React.JSX.Element {
  const renderChildren = (): React.ReactNode => {
    if (typeof children === "function") {
      return (children as (props: { pressed: boolean }) => React.ReactNode)({
        pressed: false,
      });
    }
    return children;
  };

  return (
    <DialogPrimitive.Overlay
      style={StyleSheet.absoluteFill}
      className={cn(
        "flex bg-black/80 justify-center items-center p-2",
        className,
      )}
      {...props}
    >
      <Animated.View
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
      >
        {renderChildren()}
      </Animated.View>
    </DialogPrimitive.Overlay>
  );
}
DialogOverlayNative.displayName = "DialogOverlayNative";

function DialogOverlay({
  className,
  children,
  ...props
}: DialogOverlayProps): React.JSX.Element {
  const renderChildren = (): React.ReactNode => {
    if (typeof children === "function") {
      return (children as (props: { pressed: boolean }) => React.ReactNode)({
        pressed: false,
      });
    }
    return children;
  };

  return (
    <DialogPrimitive.Overlay
      style={StyleSheet.absoluteFill}
      className={cn(
        "flex bg-black/80 justify-center items-center p-2",
        className,
      )}
      {...props}
    >
      <Animated.View
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
      >
        {renderChildren()}
      </Animated.View>
    </DialogPrimitive.Overlay>
  );
}
DialogOverlay.displayName = "DialogOverlay";

function DialogContent({
  className,
  children,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
}: DialogContentProps): React.JSX.Element {
  const { open } = DialogPrimitive.useRootContext();
  return (
    <DialogPortal>
      <DialogOverlay>
        <DialogPrimitive.Content
          className={cn(
            "max-w-lg gap-4 border border-border cursor-default bg-background p-6 shadow-lg duration-200 rounded-lg",
            open
              ? "animate-in fade-in-0 zoom-in-95"
              : "animate-out fade-out-0 zoom-out-95",
            className,
          )}
          onOpenAutoFocus={onOpenAutoFocus}
          onCloseAutoFocus={onCloseAutoFocus}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onInteractOutside={onInteractOutside}
        >
          {children}
          <DialogPrimitive.Close className={CLOSE_BUTTON_CLASSNAME}>
            <X
              size={Platform.OS === "web" ? 16 : 18}
              className={cn(
                "text-muted-foreground",
                open && "text-accent-foreground",
              )}
            />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
}
DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({
  className,
  children,
}: DialogHeaderProps): React.JSX.Element {
  return (
    <View
      className={cn(
        "flex flex-col gap-1.5 text-center sm:text-left",
        className,
      )}
    >
      {children}
    </View>
  );
}
DialogHeader.displayName = "DialogHeader";

function DialogFooter({
  className,
  children,
}: DialogFooterProps): React.JSX.Element {
  return (
    <View
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end gap-2",
        className,
      )}
    >
      {children}
    </View>
  );
}
DialogFooter.displayName = "DialogFooter";

function DialogTitle({
  className,
  ...props
}: DialogTitleProps): React.JSX.Element {
  return (
    <DialogPrimitive.Title
      className={cn(
        "text-lg text-xl text-foreground font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}
DialogTitle.displayName = DialogPrimitive.Title.displayName;

function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps): React.JSX.Element {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-base text-muted-foreground", className)}
      {...props}
    />
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
