import * as DialogPrimitive from "@rn-primitives/dialog";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "../lib/utils";
import { X } from "./icons/X";

// CSS className for close button
const CLOSE_BUTTON_CLASSNAME = "absolute right-4 top-4 p-0.5 group rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none";

// Cross-platform type definitions
export interface DialogRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface DialogTriggerProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DialogPortalProps {
  children?: React.ReactNode;
  hostName?: string;
}

export interface DialogOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DialogContentProps {
  className?: string;
  children?: React.ReactNode;
  portalHost?: string;
}

export interface DialogHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DialogFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DialogTitleProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DialogDescriptionProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DialogCloseProps {
  className?: string;
  children?: React.ReactNode;
}

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

function DialogOverlayWeb({
  className,
  ...props
}: DialogPrimitive.OverlayProps & { className?: string }): React.JSX.Element {
  const { open } = DialogPrimitive.useRootContext();
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "bg-black/80 flex justify-center items-center p-2 absolute top-0 right-0 bottom-0 left-0",
        open
          ? "animate-in fade-in-0"
          : "animate-out fade-out-0",
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
      return (children as (props: { pressed: boolean }) => React.ReactNode)({ pressed: false });
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

const DialogOverlay = DialogOverlayNative;

function DialogContent({
  className,
  children,
  portalHost,
  ...props
}: DialogPrimitive.ContentProps & { portalHost?: string; className?: string }): React.JSX.Element {
  const { open } = DialogPrimitive.useRootContext();
  return (
    <DialogPortal hostName={portalHost}>
      <DialogOverlay>
        <DialogPrimitive.Content
          className={cn(
            "max-w-lg gap-4 border border-border cursor-default bg-background p-6 shadow-lg duration-200 rounded-lg",
            open
              ? "animate-in fade-in-0 zoom-in-95"
              : "animate-out fade-out-0 zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close
            className={CLOSE_BUTTON_CLASSNAME}
          >
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

const DialogHeader = ({
  className,
  children,
}: DialogHeaderProps): React.JSX.Element => (
  <View className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}>
    {children}
  </View>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  children,
}: DialogFooterProps): React.JSX.Element => (
  <View
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end gap-2",
      className,
    )}
  >
    {children}
  </View>
);
DialogFooter.displayName = "DialogFooter";

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.TitleProps & { className?: string }): React.JSX.Element {
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
}: DialogPrimitive.DescriptionProps & { className?: string }): React.JSX.Element {
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
