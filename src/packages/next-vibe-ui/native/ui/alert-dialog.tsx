import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import * as React from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";
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

function AlertDialogOverlay({
  className,
  style,
  children,
}: AlertDialogOverlayProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  const combinedStyle: ViewStyle = nativeStyle
    ? { ...convertCSSToViewStyle({ zIndex: 50 }), ...nativeStyle }
    : convertCSSToViewStyle({ zIndex: 50 });
  return (
    <AlertDialogPrimitive.Overlay style={StyleSheet.absoluteFill} asChild>
      <Animated.View
        {...applyStyleType({
          nativeStyle: combinedStyle,
          className: cn(
            "z-50 bg-black/80 flex justify-center items-center p-2",
            className,
          ),
        })}
        entering={FadeIn.duration(150)}
        exiting={FadeOut.duration(150)}
      >
        {children}
      </Animated.View>
    </AlertDialogPrimitive.Overlay>
  );
}
AlertDialogOverlay.displayName = "AlertDialogOverlay";

function AlertDialogContent({
  className,
  style,
  children,
}: AlertDialogContentProps): React.JSX.Element {
  const { open } = AlertDialogPrimitive.useRootContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay>
        <AlertDialogPrimitive.Content
          {...applyStyleType({
            nativeStyle,
            className: cn(
              "z-50 max-w-lg gap-4 border border-border bg-background p-6 shadow-lg shadow-foreground/10 duration-200 rounded-lg",
              open
                ? "animate-in fade-in-0 zoom-in-95"
                : "animate-out fade-out-0 zoom-out-95",
              className,
            ),
          })}
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
  style,
  children,
}: AlertDialogHeaderProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-col gap-2", className),
      })}
    >
      {children}
    </View>
  );
}
AlertDialogHeader.displayName = "AlertDialogHeader";

function AlertDialogFooter({
  className,
  style,
  children,
}: AlertDialogFooterProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end gap-2",
          className,
        ),
      })}
    >
      {children}
    </View>
  );
}
AlertDialogFooter.displayName = "AlertDialogFooter";

function AlertDialogTitle({
  className,
  style,
  children,
}: AlertDialogTitleProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <AlertDialogPrimitive.Title
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "text-lg text-xl text-foreground font-semibold",
          className,
        ),
      })}
    >
      {children}
    </AlertDialogPrimitive.Title>
  );
}
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

function AlertDialogDescription({
  className,
  style,
  children,
}: AlertDialogDescriptionProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <AlertDialogPrimitive.Description
      {...applyStyleType({
        nativeStyle,
        className: cn("text-sm text-base text-muted-foreground", className),
      })}
    >
      {children}
    </AlertDialogPrimitive.Description>
  );
}
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

function AlertDialogAction({
  className,
  style,
  children,
  asChild,
}: AlertDialogActionProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <TextClassContext.Provider value={buttonTextVariants({ className })}>
      <AlertDialogPrimitive.Action
        {...applyStyleType({
          nativeStyle,
          className: cn(buttonVariants(), className),
        })}
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
  style,
  children,
  asChild,
}: AlertDialogCancelProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <TextClassContext.Provider
      value={buttonTextVariants({ className, variant: "outline" })}
    >
      <AlertDialogPrimitive.Cancel
        {...applyStyleType({
          nativeStyle,
          className: cn(buttonVariants({ variant: "outline", className })),
        })}
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
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
