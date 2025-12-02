import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { styled } from "nativewind";

import { useTranslation } from "@/i18n/core/client";

import type {
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastProviderProps,
  ToastRootProps,
  ToastTitleProps,
  ToastViewportProps,
} from "@/packages/next-vibe-ui/web/ui/toast";
import { toastVariants } from "@/packages/next-vibe-ui/web/ui/toast";
import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

import { Span } from "./span";

// Re-export types for cross-platform compatibility
export type {
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastProviderProps,
  ToastRootProps,
  ToastTitleProps,
  ToastViewportProps,
};

// Define ToastActionElement and ToastProps locally since they're not exported from web
export type ToastActionElement = React.ReactElement<ToastActionProps>;
export type ToastProps = ToastRootProps;

const StyledAnimatedView = styled(Animated.View, { className: "style" });
const StyledView = styled(View, { className: "style" });
const StyledPressable = styled(Pressable, { className: "style" });

export function ToastProvider({
  children,
  swipeDirection: _swipeDirection,
  swipeThreshold: _swipeThreshold,
  duration: _duration,
  label: _label,
}: ToastProviderProps): React.JSX.Element {
  // Native implementation: Toast management handled by context/hooks
  // Props stored for potential future gesture handling
  return <>{children}</>;
}
ToastProvider.displayName = "ToastProvider";

export function ToastViewport({
  className,
  style,
  hotkey: _hotkey,
  label,
}: ToastViewportProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  // Native implementation: Viewport is a positioned container
  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "absolute top-0 right-0 z-[100] flex max-h-screen flex-col-reverse p-4 pointer-events-none md:max-w-[420px]",
          className,
        ),
      })}
      accessibilityLabel={label}
    />
  );
}
ToastViewport.displayName = "ToastViewport";

export function Toast({
  type: _type,
  open,
  onOpenChange,
  defaultOpen,
  duration,
  variant,
  className,
  style,
  children,
}: ToastRootProps): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(defaultOpen ?? open ?? true);
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  React.useEffect((): (() => void) | undefined => {
    if (duration && isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        onOpenChange?.(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, isOpen, onOpenChange]);

  const _handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange],
  );

  if (!isOpen) {
    return <></>;
  }

  return (
    <StyledAnimatedView
      entering={FadeInUp}
      exiting={FadeOutUp}
      {...applyStyleType({
        nativeStyle,
        className: cn(toastVariants({ variant }), className),
      })}
      role="alert"
    >
      {children}
    </StyledAnimatedView>
  );
}
Toast.displayName = "Toast";

export function ToastAction({
  altText,
  className,
  style,
  children,
  onClick,
}: ToastActionProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledPressable
      onPress={onClick}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "inline-flex flex-row h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className,
        ),
      })}
      accessibilityRole="button"
      accessibilityLabel={altText}
    >
      {typeof children === "string" ? (
        <Span className="text-sm font-medium text-foreground">{children}</Span>
      ) : (
        children
      )}
    </StyledPressable>
  );
}
ToastAction.displayName = "ToastAction";

export function ToastClose({
  className,
  style,
  children,
}: ToastCloseProps): React.JSX.Element {
  const { t } = useTranslation();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledPressable
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
          className,
        ),
      })}
      accessibilityRole="button"
      accessibilityLabel={t("app.common.accessibility.srOnly.close")}
    >
      {children ?? <Span className="text-foreground h-4 w-4">✕</Span>}
    </StyledPressable>
  );
}
ToastClose.displayName = "ToastClose";

export function ToastTitle({
  className,
  style: _style,
  children,
}: ToastTitleProps): React.JSX.Element {
  // Note: style prop is not passed to sub-component due to StyleType discriminated union
  // Native uses className for styling via NativeWind (either style OR className, not both)
  return (
    <Span
      className={cn("text-sm font-semibold text-foreground", className)}
    >
      {children}
    </Span>
  );
}
ToastTitle.displayName = "ToastTitle";

export function ToastDescription({
  className,
  style: _style,
  children,
}: ToastDescriptionProps): React.JSX.Element {
  // Note: style prop is not passed to sub-component due to StyleType discriminated union
  // Native uses className for styling via NativeWind (either style OR className, not both)
  return (
    <Span className={cn("text-sm opacity-90 text-foreground", className)}>
      {children}
    </Span>
  );
}
ToastDescription.displayName = "ToastDescription";

export { toastVariants };
export default Toast;
