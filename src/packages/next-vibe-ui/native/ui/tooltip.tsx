import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "../lib/utils";
import { TextClassContext } from "./text";
import type {
  TooltipContentProps,
  TooltipPortalProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from "../../web/ui/tooltip";

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_CONTENT = "text-sm text-base text-popover-foreground";
/* eslint-enable i18next/no-literal-string */

export type {
  TooltipContentProps,
  TooltipPortalProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
};

export function TooltipProvider(props: TooltipProviderProps): React.JSX.Element {
  return <TooltipPrimitive.Root {...props} />;
}

export function Tooltip(props: TooltipRootProps): React.JSX.Element {
  return <TooltipPrimitive.Root {...props} />;
}

export function TooltipTrigger(props: TooltipTriggerProps): React.JSX.Element {
  return <TooltipPrimitive.Trigger {...props} />;
}

export function TooltipContent({
  className,
  sideOffset = 4,
  side = "top",
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipContentProps): React.JSX.Element {
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
              className={cn(
                "z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 shadow-md shadow-foreground/5 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                className,
              )}
              {...props}
            >
              {children}
            </TooltipPrimitive.Content>
          </TextClassContext.Provider>
        </Animated.View>
      </TooltipPrimitive.Overlay>
    </TooltipPrimitive.Portal>
  );
}
