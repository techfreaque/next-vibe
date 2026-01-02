import * as PopoverPrimitive from "@rn-primitives/popover";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import type {
  PopoverAnchorProps,
  PopoverCloseProps,
  PopoverContentProps,
  PopoverPortalProps,
  PopoverRootProps,
  PopoverTriggerProps,
} from "@/packages/next-vibe-ui/web/ui/popover";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { TextClassContext } from "./text";

const StyledView = styled(View, { className: "style" });

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
  style,
  align = "center",
  sideOffset = 4,
  children,
  alignOffset,
  side,
  forceMount,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
}: PopoverContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Filter side to only supported values for RN primitives
  const nativeSide = side === "left" || side === "right" ? undefined : side;

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Overlay>
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut}
          style={convertCSSToViewStyle({ zIndex: 9999 })}
        >
          <TextClassContext.Provider value="text-popover-foreground">
            <PopoverPrimitive.Content
              asChild
              align={align}
              sideOffset={sideOffset}
              alignOffset={alignOffset}
              side={nativeSide}
              forceMount={forceMount}
              onOpenAutoFocus={onOpenAutoFocus}
              onCloseAutoFocus={onCloseAutoFocus}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              onInteractOutside={onInteractOutside}
            >
              <StyledView
                {...applyStyleType({
                  nativeStyle,
                  className: cn(
                    "z-50 w-72 rounded-md cursor-auto border border-border bg-popover p-4 shadow-md shadow-foreground/5 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 animate-in zoom-in-95 fade-in-0",
                    className,
                  ),
                })}
              >
                {children}
              </StyledView>
            </PopoverPrimitive.Content>
          </TextClassContext.Provider>
        </Animated.View>
      </PopoverPrimitive.Overlay>
    </PopoverPrimitive.Portal>
  );
}
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

function PopoverClose({
  children,
  asChild,
  className,
  style,
}: PopoverCloseProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <PopoverPrimitive.Close
      asChild={asChild}
      {...applyStyleType({
        nativeStyle,
        className,
      })}
    >
      {children}
    </PopoverPrimitive.Close>
  );
}
PopoverClose.displayName = "PopoverClose";

export { Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverPortal, PopoverTrigger };
