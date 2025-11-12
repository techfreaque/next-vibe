import * as HoverCardPrimitive from "@rn-primitives/hover-card";
import * as React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { cn } from "next-vibe/shared/utils/utils";
import { TextClassContext } from "./text";

// Import ALL types from web - ZERO definitions here
import type {
  HoverCardRootProps,
  HoverCardTriggerProps,
  HoverCardPortalProps,
  HoverCardContentProps,
} from "@/packages/next-vibe-ui/web/ui/hover-card";

// Local styled components - use direct primitives to avoid type instantiation issues
const StyledHoverCardContent = HoverCardPrimitive.Content;

function HoverCard({
  children,
  ...props
}: HoverCardRootProps): React.JSX.Element {
  return (
    <HoverCardPrimitive.Root {...props}>{children}</HoverCardPrimitive.Root>
  );
}
HoverCard.displayName = HoverCardPrimitive.Root.displayName;

function HoverCardTrigger({
  children,
  asChild,
  ...props
}: HoverCardTriggerProps): React.JSX.Element {
  return (
    <HoverCardPrimitive.Trigger asChild={asChild} {...props}>
      {children}
    </HoverCardPrimitive.Trigger>
  );
}
HoverCardTrigger.displayName = HoverCardPrimitive.Trigger.displayName;

function HoverCardPortal({
  children,
}: HoverCardPortalProps): React.JSX.Element {
  return <HoverCardPrimitive.Portal>{children}</HoverCardPrimitive.Portal>;
}
HoverCardPortal.displayName = "HoverCardPortal";

function HoverCardContent({
  align = "center",
  sideOffset = 4,
  className,
  children,
  disablePositioningStyle,
  asChild,
  forceMount,
  side,
  alignOffset,
  avoidCollisions,
  // WEB ONLY props - destructured but not used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  collisionBoundary,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  collisionPadding,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  arrowPadding,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sticky,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hideWhenDetached,
}: HoverCardContentProps): React.JSX.Element {
  const { open } = HoverCardPrimitive.useRootContext();

  // Filter side to only supported values for RN primitives
  const nativeSide = side === "left" || side === "right" ? undefined : side;

  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Overlay style={StyleSheet.absoluteFill}>
        <Animated.View entering={FadeIn}>
          <TextClassContext.Provider
            value={
              "text-popover-foreground" // eslint-disable-line i18next/no-literal-string -- CSS class
            }
          >
            <StyledHoverCardContent
              align={align}
              sideOffset={sideOffset}
              disablePositioningStyle={disablePositioningStyle}
              asChild={asChild}
              forceMount={forceMount}
              side={nativeSide}
              alignOffset={alignOffset}
              avoidCollisions={avoidCollisions}
              className={cn(
                "z-50 w-64 rounded-md border border-border bg-popover p-4 shadow-md shadow-foreground/5 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                open
                  ? "animate-in fade-in-0 zoom-in-95"
                  : "animate-out fade-out-0 zoom-out-95",
                className,
              )}
            >
              {children}
            </StyledHoverCardContent>
          </TextClassContext.Provider>
        </Animated.View>
      </HoverCardPrimitive.Overlay>
    </HoverCardPrimitive.Portal>
  );
}
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger };
