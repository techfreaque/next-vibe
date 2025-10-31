import * as DialogPrimitive from "@rn-primitives/dialog";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import type { WithClassName } from "../lib/types";
import { cn } from "../lib/utils";
import { X } from "./icons/X";

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

const DialogOverlayWeb = React.forwardRef<
  DialogPrimitive.OverlayRef,
  DialogPrimitive.OverlayProps
>(({ className, ...props }, ref) => {
  const { open } = DialogPrimitive.useRootContext();
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "bg-black/80 flex justify-center items-center p-2 absolute top-0 right-0 bottom-0 left-0",
        open
          ? "web:animate-in web:fade-in-0"
          : "web:animate-out web:fade-out-0",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});

DialogOverlayWeb.displayName = "DialogOverlayWeb";

const DialogOverlayNative = React.forwardRef<
  DialogPrimitive.OverlayRef,
  DialogPrimitive.OverlayProps
>(({ className, children, ...props }, ref) => {
  const renderChildren = () => {
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
      ref={ref}
    >
      <Animated.View
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
      >
        {renderChildren()}
      </Animated.View>
    </DialogPrimitive.Overlay>
  );
});

DialogOverlayNative.displayName = "DialogOverlayNative";

const DialogOverlay = Platform.select({
  web: DialogOverlayWeb,
  default: DialogOverlayNative,
});

const DialogContent = React.forwardRef<
  DialogPrimitive.ContentRef,
  DialogPrimitive.ContentProps & { portalHost?: string }
>(({ className, children, portalHost, ...props }, ref) => {
  const { open } = DialogPrimitive.useRootContext();
  return (
    <DialogPortal hostName={portalHost}>
      <DialogOverlay>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "max-w-lg gap-4 border border-border web:cursor-default bg-background p-6 shadow-lg web:duration-200 rounded-lg",
            open
              ? "web:animate-in web:fade-in-0 web:zoom-in-95"
              : "web:animate-out web:fade-out-0 web:zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close
            className={
              "absolute right-4 top-4 p-0.5 web:group rounded-sm opacity-70 web:ring-offset-background web:transition-opacity web:hover:opacity-100 web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2 web:disabled:pointer-events-none"
            }
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
});
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

const DialogTitle = React.forwardRef<
  DialogPrimitive.TitleRef,
  WithClassName<DialogPrimitive.TitleProps>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg native:text-xl text-foreground font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  DialogPrimitive.DescriptionRef,
  WithClassName<DialogPrimitive.DescriptionProps>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm native:text-base text-muted-foreground", className)}
    {...props}
  />
));
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
