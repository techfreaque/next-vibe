import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "../lib/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";
import { TextClassContext } from "./text";
import type {
  TooltipContentProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from "../../web/ui/tooltip";

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_CONTENT = "text-sm text-base text-popover-foreground";
/* eslint-enable i18next/no-literal-string */

export function TooltipProvider({
  children,
  delayDuration: _delayDuration,
  skipDelayDuration: _skipDelayDuration,
  disableHoverableContent: _disableHoverableContent,
}: TooltipProviderProps): React.JSX.Element {
  // React Native primitive doesn't support these props directly
  return <TooltipPrimitive.Root>{children}</TooltipPrimitive.Root>;
}

export function Tooltip({
  children,
  open: _open,
  onOpenChange,
  defaultOpen: _defaultOpen,
  delayDuration: _delayDuration,
}: TooltipRootProps): React.JSX.Element {
  // Note: React Native primitives don't support controlled open state directly
  // They're accepted in the interface for cross-platform compatibility but not used
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
  onEscapeKeyDown: _onEscapeKeyDown,
  onPointerDownOutside: _onPointerDownOutside,
  hidden: _hidden,
  portalHost: _portalHost,
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
