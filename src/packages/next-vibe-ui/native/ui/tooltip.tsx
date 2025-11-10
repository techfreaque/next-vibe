import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "../lib/utils";
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

export type {
  TooltipContentProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
};

const TooltipProvider = TooltipPrimitive.Root;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  TooltipPrimitive.ContentRef,
  TooltipContentProps
>(({ className, sideOffset = 4, portalHost, side, align, alignOffset, ..._props }, ref) => (
  <TooltipPrimitive.Portal hostName={portalHost}>
    <TooltipPrimitive.Overlay
      style={Platform.OS !== "web" ? StyleSheet.absoluteFill : undefined}
    >
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
      >
        <TextClassContext.Provider
          value={TEXT_CLASS_CONTENT}
        >
          <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            side={side}
            align={align}
            alignOffset={alignOffset}
            className={cn(
              "z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 shadow-md shadow-foreground/5 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className,
            )}
          />
        </TextClassContext.Provider>
      </Animated.View>
    </TooltipPrimitive.Overlay>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
