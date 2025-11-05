import * as HoverCardPrimitive from "@rn-primitives/hover-card";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import type { HoverCardContentProps as WebHoverCardContentProps } from "@/packages/next-vibe-ui/web/ui/hover-card";
import { cn } from "next-vibe/shared/utils/utils";
import { TextClassContext } from "./text";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

// Native props type - uses the narrowed web interface with primitive-specific props
type NativeHoverCardContentProps = WebHoverCardContentProps &
  Pick<HoverCardPrimitive.ContentProps, "asChild"> & {
    disablePositioningStyle?: boolean;
  };

function HoverCardContent({
  align = "center",
  sideOffset = 4,
  className,
  children,
  disablePositioningStyle,
  asChild,
}: NativeHoverCardContentProps): JSX.Element {
  const { open } = HoverCardPrimitive.useRootContext();
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Overlay
        style={Platform.OS !== "web" ? StyleSheet.absoluteFill : undefined}
      >
        <Animated.View entering={FadeIn}>
          <TextClassContext.Provider
            value={
              "text-popover-foreground" // eslint-disable-line i18next/no-literal-string -- CSS class
            }
          >
            <HoverCardPrimitive.Content
              align={align}
              sideOffset={sideOffset}
              disablePositioningStyle={disablePositioningStyle}
              asChild={asChild}
              className={cn(
                "z-50 w-64 rounded-md border border-border bg-popover p-4 shadow-md shadow-foreground/5 web:outline-none web:cursor-auto data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                open
                  ? "web:animate-in web:fade-in-0 web:zoom-in-95"
                  : "web:animate-out web:fade-out-0 web:zoom-out-95",
                className,
              )}
            >
              {children}
            </HoverCardPrimitive.Content>
          </TextClassContext.Provider>
        </Animated.View>
      </HoverCardPrimitive.Overlay>
    </HoverCardPrimitive.Portal>
  );
}
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardContent, HoverCardTrigger };
