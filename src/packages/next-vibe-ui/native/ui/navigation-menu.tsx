import * as NavigationMenuPrimitive from "@rn-primitives/navigation-menu";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import type {
  NavigationMenuContentProps,
  NavigationMenuIndicatorProps,
  NavigationMenuItemProps,
  NavigationMenuLinkProps,
  NavigationMenuListProps,
  NavigationMenuProps,
  NavigationMenuTriggerProps,
  NavigationMenuViewportProps,
} from "@/packages/next-vibe-ui/web/ui/navigation-menu";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { buttonVariants } from "./button";
import { ChevronDown } from "./icons/ChevronDown";

const StyledView = styled(View, { className: "style" });
const StyledAnimatedView = styled(Animated.View, { className: "style" });

// navigationMenuTriggerStyle helper function (native implementation)
function navigationMenuTriggerStyle(): string {
  return cn(
    buttonVariants({ variant: "ghost" }),
    "group inline-flex flex-row h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
  );
}

function NavigationMenu({
  className,
  style,
  children,
  value,
  onValueChange,
  // Native primitives don't support defaultValue - destructured but not used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultValue,
  delayDuration,
  skipDelayDuration,
  dir,
  orientation,
}: NavigationMenuProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "relative z-10 flex flex-row max-w-max items-center justify-center",
          className,
        ),
      })}
    >
      <NavigationMenuPrimitive.Root
        value={value}
        onValueChange={onValueChange ?? (() => undefined)}
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
        dir={dir}
        orientation={orientation}
      >
        {children}
      </NavigationMenuPrimitive.Root>
    </StyledView>
  );
}
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

function NavigationMenuList({
  className,
  style,
  children,
}: NavigationMenuListProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <NavigationMenuPrimitive.List
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "group flex flex-1 flex-row list-none items-center justify-center gap-1",
          className,
        ),
      })}
    >
      {children}
    </NavigationMenuPrimitive.List>
  );
}
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

function NavigationMenuItem({
  value,
  className,
  style,
  children,
}: NavigationMenuItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <NavigationMenuPrimitive.Item
      value={value}
      {...applyStyleType({
        nativeStyle,
        className,
      })}
    >
      {children}
    </NavigationMenuPrimitive.Item>
  );
}
NavigationMenuItem.displayName = NavigationMenuPrimitive.Item.displayName;

function NavigationMenuTrigger({
  className,
  style,
  children,
}: NavigationMenuTriggerProps): React.JSX.Element {
  const { value } = NavigationMenuPrimitive.useRootContext();
  const { value: itemValue } = NavigationMenuPrimitive.useItemContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const progress = useDerivedValue(() =>
    value === itemValue
      ? withTiming(1, { duration: 250 })
      : withTiming(0, { duration: 200 }),
  );
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
    opacity: interpolate(progress.value, [0, 1], [1, 0.8], Extrapolation.CLAMP),
  }));

  return (
    <NavigationMenuPrimitive.Trigger
      {...applyStyleType({
        nativeStyle,
        className: cn(
          navigationMenuTriggerStyle(),
          "group gap-1.5",
          value === itemValue && "bg-accent",
          className,
        ),
      })}
    >
      {children}
      <StyledAnimatedView style={chevronStyle}>
        <ChevronDown
          size={12}
          className={cn("relative text-foreground h-3 w-3")}
          aria-hidden={true}
        />
      </StyledAnimatedView>
    </NavigationMenuPrimitive.Trigger>
  );
}
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

function NavigationMenuContent({
  className,
  style,
  children,
}: NavigationMenuContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <NavigationMenuPrimitive.Content
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "w-full border border-border rounded-lg shadow-lg bg-popover text-popover-foreground overflow-hidden data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
          className,
        ),
      })}
    >
      {children}
    </NavigationMenuPrimitive.Content>
  );
}
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

function NavigationMenuLink({
  className,
  style,
  children,
  ...props
}: NavigationMenuLinkProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <NavigationMenuPrimitive.Link
      {...applyStyleType({
        nativeStyle,
        className,
      })}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Link>
  );
}
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName;

function NavigationMenuViewport({
  className,
  style,
}: NavigationMenuViewportProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView className={cn("absolute left-0 top-full flex justify-center")}>
      <StyledView
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg animate-in zoom-in-90",
            className,
          ),
        })}
      >
        <NavigationMenuPrimitive.Viewport />
      </StyledView>
    </StyledView>
  );
}
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

function NavigationMenuIndicator({
  className,
  style,
}: NavigationMenuIndicatorProps): React.JSX.Element {
  const { value } = NavigationMenuPrimitive.useRootContext();
  const { value: itemValue } = NavigationMenuPrimitive.useItemContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <NavigationMenuPrimitive.Indicator
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
          value === itemValue ? "animate-in fade-in" : "animate-out fade-out",
          className,
        ),
      })}
    >
      <StyledView className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md shadow-foreground/5" />
    </NavigationMenuPrimitive.Indicator>
  );
}
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
};
