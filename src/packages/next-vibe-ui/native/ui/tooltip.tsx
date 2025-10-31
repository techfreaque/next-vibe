import * as TooltipPrimitive from "@rn-primitives/tooltip";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "../lib/utils";
import { TextClassContext } from "./text";

// Cross-platform type exports
export interface TooltipProviderProps {
  children?: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}

export interface TooltipRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  delayDuration?: number;
}

export interface TooltipTriggerProps {
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface TooltipContentProps {
  className?: string;
  children?: React.ReactNode;
  sideOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  alignOffset?: number;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: Event) => void;
  portalHost?: string;
}

const TooltipProvider = TooltipPrimitive.Root;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  TooltipPrimitive.ContentRef,
  TooltipPrimitive.ContentProps & TooltipContentProps
>(({ className, sideOffset = 4, portalHost, ...props }, ref) => (
  <TooltipPrimitive.Portal hostName={portalHost}>
    <TooltipPrimitive.Overlay
      style={Platform.OS !== "web" ? StyleSheet.absoluteFill : undefined}
    >
      <Animated.View
        entering={Platform.select({ web: undefined, default: FadeIn })}
        exiting={Platform.select({ web: undefined, default: FadeOut })}
      >
        <TextClassContext.Provider
          value={
            "text-sm native:text-base text-popover-foreground" // eslint-disable-line i18next/no-literal-string -- CSS class names
          }
        >
          <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
              "z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 shadow-md shadow-foreground/5 web:animate-in web:fade-in-0 web:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className,
            )}
            {...props}
          />
        </TextClassContext.Provider>
      </Animated.View>
    </TooltipPrimitive.Overlay>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
