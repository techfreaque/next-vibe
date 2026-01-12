import * as HoverCardPrimitive from "@rn-primitives/hover-card";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import type {
  HoverCardContentProps,
  HoverCardPortalProps,
  HoverCardRootProps,
  HoverCardTriggerProps,
} from "@/packages/next-vibe-ui/web/ui/hover-card";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { TextClassContext } from "./text";

const StyledView = styled(View, { className: "style" });

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
  style,
  children,
  forceMount,
  side,
  alignOffset,
  avoidCollisions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  collisionPadding, // Intentionally extracted - Web-only, not used in React Native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  arrowPadding, // Intentionally extracted - Web-only, not used in React Native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  sticky, // Intentionally extracted - Web-only, not used in React Native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  hideWhenDetached, // Intentionally extracted - Web-only, not used in React Native
  onEscapeKeyDown, // Web-only but accepted by RN primitive
  onPointerDownOutside, // Web-only but accepted by RN primitive
}: HoverCardContentProps): React.JSX.Element {
  const { open } = HoverCardPrimitive.useRootContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Filter side to only supported values for RN primitives
  const nativeSide = side === "left" || side === "right" ? undefined : side;

  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Overlay>
        <Animated.View
          entering={FadeIn}
          style={convertCSSToViewStyle({ zIndex: 50 })}
        >
          <TextClassContext.Provider
            value={
              "text-popover-foreground" // eslint-disable-line i18next/no-literal-string -- CSS class
            }
          >
            <HoverCardPrimitive.Content
              asChild
              align={align}
              sideOffset={sideOffset}
              forceMount={forceMount}
              side={nativeSide}
              alignOffset={alignOffset}
              avoidCollisions={avoidCollisions}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
            >
              <StyledView
                {...applyStyleType({
                  nativeStyle,
                  className: cn(
                    "z-50 w-64 rounded-md border border-border bg-popover p-4 shadow-md shadow-foreground/5 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    open
                      ? "animate-in fade-in-0 zoom-in-95"
                      : "animate-out fade-out-0 zoom-out-95",
                    className,
                  ),
                })}
              >
                {children}
              </StyledView>
            </HoverCardPrimitive.Content>
          </TextClassContext.Provider>
        </Animated.View>
      </HoverCardPrimitive.Overlay>
    </HoverCardPrimitive.Portal>
  );
}
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger };
