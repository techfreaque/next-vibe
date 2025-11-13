import * as NavigationMenuPrimitive from "@rn-primitives/navigation-menu";
import * as React from "react";
import { View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { cn } from "next-vibe/shared/utils/utils";
import { buttonVariants } from "./button";
import { ChevronDown } from "./icons/ChevronDown";

import type {
  NavigationMenuProps,
  NavigationMenuListProps,
  NavigationMenuItemProps,
  NavigationMenuTriggerProps,
  NavigationMenuContentProps,
  NavigationMenuLinkProps,
  NavigationMenuViewportProps,
  NavigationMenuIndicatorProps,
} from "@/packages/next-vibe-ui/web/ui/navigation-menu";

// navigationMenuTriggerStyle helper function (native implementation)
function navigationMenuTriggerStyle(): string {
  return cn(
    buttonVariants({ variant: "ghost" }),
    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
  );
}

function NavigationMenu({
  className,
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
  return (
    <View
      className={cn(
        "relative z-10 flex flex-row max-w-max items-center justify-center",
        className,
      )}
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
    </View>
  );
}
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

function NavigationMenuList({
  className,
  children,
  ...props
}: NavigationMenuListProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.List
      className={cn(
        "group flex flex-1 flex-row list-none items-center justify-center gap-1",
        className,
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.List>
  );
}
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

function NavigationMenuItem({
  value,
  children,
}: NavigationMenuItemProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Item value={value}>
      {children}
    </NavigationMenuPrimitive.Item>
  );
}
NavigationMenuItem.displayName = NavigationMenuPrimitive.Item.displayName;

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuTriggerProps): React.JSX.Element {
  const { value } = NavigationMenuPrimitive.useRootContext();
  const { value: itemValue } = NavigationMenuPrimitive.useItemContext();

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
      className={cn(
        navigationMenuTriggerStyle(),
        "group gap-1.5",
        value === itemValue && "bg-accent",
        className,
      )}
      {...props}
    >
      {children}
      <Animated.View style={chevronStyle}>
        <ChevronDown
          size={12}
          className={cn(
            "relative text-foreground h-3 w-3",
          )}
          aria-hidden={true}
        />
      </Animated.View>
    </NavigationMenuPrimitive.Trigger>
  );
}
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

function NavigationMenuContent({
  className,
  children,
  ...props
}: NavigationMenuContentProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "w-full border border-border rounded-lg shadow-lg bg-popover text-popover-foreground overflow-hidden data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        className,
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Content>
  );
}
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

function NavigationMenuLink({
  children,
  ...props
}: NavigationMenuLinkProps): React.JSX.Element {
  return (
    <NavigationMenuPrimitive.Link {...props}>
      {children}
    </NavigationMenuPrimitive.Link>
  );
}
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName;

function NavigationMenuViewport({
  className,
  ...props
}: NavigationMenuViewportProps): React.JSX.Element {
  return (
    <View className={cn("absolute left-0 top-full flex justify-center")}>
      <View
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg animate-in zoom-in-90",
          className,
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Viewport />
      </View>
    </View>
  );
}
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

function NavigationMenuIndicator({
  className,
  ...props
}: NavigationMenuIndicatorProps): React.JSX.Element {
  const { value } = NavigationMenuPrimitive.useRootContext();
  const { value: itemValue } = NavigationMenuPrimitive.useItemContext();

  return (
    <NavigationMenuPrimitive.Indicator
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        value === itemValue ? "animate-in fade-in" : "animate-out fade-out",
        className,
      )}
      {...props}
    >
      <View className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md shadow-foreground/5" />
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
