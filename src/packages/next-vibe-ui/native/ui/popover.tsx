import * as PopoverPrimitive from "@rn-primitives/popover";
import * as React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { cn } from "next-vibe/shared/utils/utils";
import { TextClassContext } from "./text";

// Import ALL types from web - ZERO definitions here
import type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverAnchorProps,
  PopoverPortalProps,
  PopoverContentProps,
  PopoverCloseProps,
} from "@/packages/next-vibe-ui/web/ui/popover";


// Local styled components - use direct primitives to avoid type instantiation issues
const StyledPopoverContent = PopoverPrimitive.Content;

function Popover({ children, ...props }: PopoverRootProps): React.JSX.Element {
  return <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>;
}
Popover.displayName = PopoverPrimitive.Root.displayName;

function PopoverTrigger({ children, asChild, ...props }: PopoverTriggerProps): React.JSX.Element {
  return (
    <PopoverPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </PopoverPrimitive.Trigger>
  );
}
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

function PopoverAnchor({ children, asChild, ...props }: PopoverAnchorProps): React.JSX.Element {
  return (
    <PopoverPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </PopoverPrimitive.Trigger>
  );
}
PopoverAnchor.displayName = "PopoverAnchor";

function PopoverPortal({ children }: PopoverPortalProps): React.JSX.Element {
  return <PopoverPrimitive.Portal>{children}</PopoverPrimitive.Portal>;
}
PopoverPortal.displayName = "PopoverPortal";

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  alignOffset,
  side,
  forceMount,
}: PopoverContentProps): React.JSX.Element {
  // Filter side to only supported values for RN primitives
  const nativeSide = side === "left" || side === "right" ? undefined : side;

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut}>
          <TextClassContext.Provider value="text-popover-foreground">
            <StyledPopoverContent
              align={align}
              sideOffset={sideOffset}
              alignOffset={alignOffset}
              side={nativeSide}
              forceMount={forceMount}
              className={cn(
                "z-50 w-72 rounded-md cursor-auto border border-border bg-popover p-4 shadow-md shadow-foreground/5 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 animate-in zoom-in-95 fade-in-0",
                className,
              )}
            >
              {children}
            </StyledPopoverContent>
          </TextClassContext.Provider>
        </Animated.View>
      </PopoverPrimitive.Overlay>
    </PopoverPrimitive.Portal>
  );
}
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

function PopoverClose({ children, asChild, ...props }: PopoverCloseProps): React.JSX.Element {
  return (
    <PopoverPrimitive.Close asChild={asChild} {...props}>
      {children}
    </PopoverPrimitive.Close>
  );
}
PopoverClose.displayName = "PopoverClose";

export {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
};
