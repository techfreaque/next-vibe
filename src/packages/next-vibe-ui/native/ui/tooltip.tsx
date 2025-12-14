import * as TooltipPrimitive from "@rn-primitives/tooltip";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import type {
  TooltipContentProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from "../../web/ui/tooltip";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { TextClassContext } from "./text";

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_CONTENT = "text-sm text-base text-popover-foreground";
/* eslint-enable i18next/no-literal-string */

export function TooltipProvider({
  children,
}: TooltipProviderProps): React.JSX.Element {
  // React Native primitive doesn't support these props directly
  return <TooltipPrimitive.Root>{children}</TooltipPrimitive.Root>;
}

export function Tooltip({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  open, // Intentionally extracted - React Native primitives don't support controlled open state
  onOpenChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  defaultOpen, // Intentionally extracted - React Native primitives don't support controlled open state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  delayDuration, // Intentionally extracted - not used in React Native
}: TooltipRootProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Root onOpenChange={onOpenChange}>
      {children}
    </TooltipPrimitive.Root>
  );
}

export function TooltipTrigger({
  asChild,
  children,
}: TooltipTriggerProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Trigger asChild={asChild}>
      {children}
    </TooltipPrimitive.Trigger>
  );
}

export function TooltipContent({
  className,
  style,
  sideOffset = 4,
  side = "top",
  align = "center",
  alignOffset = 0,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  onEscapeKeyDown, // Intentionally extracted - not used in React Native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  onPointerDownOutside, // Intentionally extracted - not used in React Native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  hidden, // Intentionally extracted - not used in React Native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  portalHost, // Intentionally extracted - not used in React Native
}: TooltipContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <TextClassContext.Provider value={TEXT_CLASS_CONTENT}>
            <TooltipPrimitive.Content
              sideOffset={sideOffset}
              side={side}
              align={align}
              alignOffset={alignOffset}
              {...applyStyleType({
                nativeStyle,
                className: cn(
                  "z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 shadow-md shadow-foreground/5 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                  className,
                ),
              })}
            >
              {children}
            </TooltipPrimitive.Content>
          </TextClassContext.Provider>
        </Animated.View>
      </TooltipPrimitive.Overlay>
    </TooltipPrimitive.Portal>
  );
}
