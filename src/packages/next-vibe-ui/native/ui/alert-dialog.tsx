import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "../lib/utils";
import { buttonTextVariants, buttonVariants } from "./button";
import { TextClassContext } from "./text";
import type {
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogTitleProps,
} from "next-vibe-ui/ui/alert-dialog";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

interface AlertDialogOverlayWebProps {
  className?: string;
  children?: React.ReactNode;
}

const AlertDialogOverlayWeb = React.forwardRef<
  AlertDialogPrimitive.OverlayRef,
  AlertDialogOverlayWebProps
>(({ className, children }, ref) => {
  const { open } = AlertDialogPrimitive.useRootContext();
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "z-50 bg-black/80 flex justify-center items-center p-2 absolute top-0 right-0 bottom-0 left-0",
        open
          ? "web:animate-in web:fade-in-0"
          : "web:animate-out web:fade-out-0",
        className,
      )}
      ref={ref}
    >
      {children}
    </AlertDialogPrimitive.Overlay>
  );
});

AlertDialogOverlayWeb.displayName = "AlertDialogOverlayWeb";

interface AlertDialogOverlayNativeProps {
  className?: string;
  children?: React.ReactNode;
}

const AlertDialogOverlayNative = React.forwardRef<
  AlertDialogPrimitive.OverlayRef,
  AlertDialogOverlayNativeProps
>(({ className, children }, ref) => {
  return (
    <AlertDialogPrimitive.Overlay
      style={StyleSheet.absoluteFill}
      className={cn(
        "z-50 bg-black/80 flex justify-center items-center p-2",
        className,
      )}
      asChild
      ref={ref}
    >
      <Animated.View
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
      >
        {children}
      </Animated.View>
    </AlertDialogPrimitive.Overlay>
  );
});

AlertDialogOverlayNative.displayName = "AlertDialogOverlayNative";

const AlertDialogOverlay = Platform.select({
  web: AlertDialogOverlayWeb,
  default: AlertDialogOverlayNative,
});

interface AlertDialogContentProps {
  className?: string;
  children?: React.ReactNode;
  portalHost?: string;
}

const AlertDialogContent = React.forwardRef<
  AlertDialogPrimitive.ContentRef,
  AlertDialogContentProps
>(({ className, portalHost, children }, ref) => {
  const { open } = AlertDialogPrimitive.useRootContext();

  return (
    <AlertDialogPortal hostName={portalHost}>
      <AlertDialogOverlay>
        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn(
            "z-50 max-w-lg gap-4 border border-border bg-background p-6 shadow-lg shadow-foreground/10 web:duration-200 rounded-lg",
            open
              ? "web:animate-in web:fade-in-0 web:zoom-in-95"
              : "web:animate-out web:fade-out-0 web:zoom-out-95",
            className,
          )}
        >
          {children}
        </AlertDialogPrimitive.Content>
      </AlertDialogOverlay>
    </AlertDialogPortal>
  );
});
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({
  className,
  children,
}: AlertDialogHeaderProps): React.JSX.Element => (
  <View className={cn("flex flex-col gap-2", className)}>
    {children}
  </View>
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  children,
}: AlertDialogFooterProps): React.JSX.Element => (
  <View
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end gap-2",
      className,
    )}
  >
    {children}
  </View>
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  AlertDialogPrimitive.TitleRef,
  AlertDialogTitleProps
>(({ className, children }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg native:text-xl text-foreground font-semibold",
      className,
    )}
  >
    {children}
  </AlertDialogPrimitive.Title>
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  AlertDialogPrimitive.DescriptionRef,
  AlertDialogDescriptionProps
>(({ className, children }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm native:text-base text-muted-foreground", className)}
  >
    {children}
  </AlertDialogPrimitive.Description>
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

interface AlertDialogActionProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

const AlertDialogAction = React.forwardRef<
  AlertDialogPrimitive.ActionRef,
  AlertDialogActionProps
>(({ className, children, asChild }, ref) => (
  <TextClassContext.Provider value={buttonTextVariants({ className })}>
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(buttonVariants(), className)}
      asChild={asChild}
    >
      {children}
    </AlertDialogPrimitive.Action>
  </TextClassContext.Provider>
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

interface AlertDialogCancelProps {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

const AlertDialogCancel = React.forwardRef<
  AlertDialogPrimitive.CancelRef,
  AlertDialogCancelProps
>(({ className, children, asChild }, ref) => (
  <TextClassContext.Provider
    value={buttonTextVariants({ className, variant: "outline" })}
  >
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: "outline", className }))}
      asChild={asChild}
    >
      {children}
    </AlertDialogPrimitive.Cancel>
  </TextClassContext.Provider>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
