import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "../lib/utils";
import { buttonTextVariants, buttonVariants } from "./button";
import { TextClassContext } from "./text";

import type {
  AlertDialogRootProps,
  AlertDialogTriggerProps,
  AlertDialogPortalProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogHeaderProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
} from "@/packages/next-vibe-ui/web/ui/alert-dialog";

function AlertDialog({
  children,
  ...props
}: AlertDialogRootProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Root {...props}>{children}</AlertDialogPrimitive.Root>
  );
}
AlertDialog.displayName = AlertDialogPrimitive.Root.displayName;

function AlertDialogTrigger({
  children,
  asChild,
  ...props
}: AlertDialogTriggerProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </AlertDialogPrimitive.Trigger>
  );
}
AlertDialogTrigger.displayName = AlertDialogPrimitive.Trigger.displayName;

function AlertDialogPortal({
  children,
  ...props
}: AlertDialogPortalProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Portal {...props}>
      {children}
    </AlertDialogPrimitive.Portal>
  );
}
AlertDialogPortal.displayName = "AlertDialogPortal";

export function AlertDialogOverlay({
  className,
  children,
}: AlertDialogOverlayProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Overlay
      style={StyleSheet.absoluteFill}
      className={cn(
        "z-50 bg-black/80 flex justify-center items-center p-2",
        className,
      )}
      asChild
    >
      <Animated.View
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
      >
        {children}
      </Animated.View>
    </AlertDialogPrimitive.Overlay>
  );
}

function AlertDialogContent({
  className,
  children,
}: AlertDialogContentProps): React.JSX.Element {
  const { open } = AlertDialogPrimitive.useRootContext();

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay>
        <AlertDialogPrimitive.Content
          className={cn(
            "z-50 max-w-lg gap-4 border border-border bg-background p-6 shadow-lg shadow-foreground/10 duration-200 rounded-lg",
            open
              ? "animate-in fade-in-0 zoom-in-95"
              : "animate-out fade-out-0 zoom-out-95",
            className,
          )}
        >
          {children}
        </AlertDialogPrimitive.Content>
      </AlertDialogOverlay>
    </AlertDialogPortal>
  );
}
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

function AlertDialogHeader({
  className,
  children,
}: AlertDialogHeaderProps): React.JSX.Element {
  return (
    <View className={cn("flex flex-col gap-2", className)}>{children}</View>
  );
}
AlertDialogHeader.displayName = "AlertDialogHeader";

function AlertDialogFooter({
  className,
  children,
}: AlertDialogFooterProps): React.JSX.Element {
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
AlertDialogFooter.displayName = "AlertDialogFooter";

function AlertDialogTitle({
  className,
  children,
}: AlertDialogTitleProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Title
      className={cn("text-lg text-xl text-foreground font-semibold", className)}
    >
      {children}
    </AlertDialogPrimitive.Title>
  );
}
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

function AlertDialogDescription({
  className,
  children,
}: AlertDialogDescriptionProps): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-base text-muted-foreground", className)}
    >
      {children}
    </AlertDialogPrimitive.Description>
  );
}
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

function AlertDialogAction({
  className,
  children,
  asChild,
}: AlertDialogActionProps): React.JSX.Element {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ className })}>
      <AlertDialogPrimitive.Action
        className={cn(buttonVariants(), className)}
        asChild={asChild}
      >
        {children}
      </AlertDialogPrimitive.Action>
    </TextClassContext.Provider>
  );
}
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

function AlertDialogCancel({
  className,
  children,
  asChild,
}: AlertDialogCancelProps): React.JSX.Element {
  return (
    <TextClassContext.Provider
      value={buttonTextVariants({ className, variant: "outline" })}
    >
      <AlertDialogPrimitive.Cancel
        className={cn(buttonVariants({ variant: "outline", className }))}
        asChild={asChild}
      >
        {children}
      </AlertDialogPrimitive.Cancel>
    </TextClassContext.Provider>
  );
}
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
