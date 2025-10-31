import * as NavigationMenuPrimitive from "@rn-primitives/navigation-menu";
import * as React from "react";
import { Platform, View } from "react-native";
import Animated, {
  Extrapolation,
  FadeInLeft,
  FadeOutLeft,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { cn } from "../lib/utils";
import { buttonVariants } from "./button";

// Define types locally to avoid web dependency issues
interface NavigationMenuProps {
  className?: string;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
}

interface NavigationMenuListProps {
  className?: string;
}

interface NavigationMenuTriggerProps {
  className?: string;
}

interface NavigationMenuContentProps {
  className?: string;
}

interface NavigationMenuViewportProps {
  className?: string;
}

interface NavigationMenuIndicatorProps {
  className?: string;
}

// navigationMenuTriggerStyle helper function
function navigationMenuTriggerStyle(): string {
  return cn(
    buttonVariants({ variant: "ghost" }),
    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
  );
}
import { ChevronDown } from "./icons/ChevronDown";

const NavigationMenu = React.forwardRef<
  NavigationMenuPrimitive.RootRef,
  NavigationMenuProps & Omit<NavigationMenuPrimitive.RootProps, keyof NavigationMenuProps>
>(({ className, children, value, onValueChange, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    value={value}
    onValueChange={onValueChange || (() => {})}
    className={cn(
      "relative z-10 flex flex-row max-w-max items-center justify-center",
      className,
    )}
    {...props}
  >
    {children}
    {Platform.OS === "web" && <NavigationMenuViewport />}
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  NavigationMenuPrimitive.ListRef,
  NavigationMenuListProps & Omit<NavigationMenuPrimitive.ListProps, keyof NavigationMenuListProps>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "web:group flex flex-1 flex-row web:list-none items-center justify-center gap-1",
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const NavigationMenuTrigger = React.forwardRef<
  NavigationMenuPrimitive.TriggerRef,
  NavigationMenuTriggerProps & Omit<NavigationMenuPrimitive.TriggerProps, keyof NavigationMenuTriggerProps | 'children'> & {
    children?: React.ReactNode | ((props: { pressed: boolean }) => React.ReactNode);
  }
>(({ className, children, ...props }, ref) => {
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
      ref={ref}
      className={cn(
        navigationMenuTriggerStyle(),
        "web:group gap-1.5",
        value === itemValue && "bg-accent",
        className,
      )}
      {...props}
    >
      {typeof children === "function" ? children({ pressed: false }) : children}
      <Animated.View style={chevronStyle}>
        <ChevronDown
          size={12}
          className={cn(
            "relative text-foreground h-3 w-3 web:transition web:duration-200",
          )}
          aria-hidden={true}
        />
      </Animated.View>
    </NavigationMenuPrimitive.Trigger>
  );
});
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  NavigationMenuPrimitive.ContentRef,
  NavigationMenuContentProps & Omit<NavigationMenuPrimitive.ContentProps, keyof NavigationMenuContentProps> & {
    portalHost?: string;
  }
>(({ className, children, portalHost, ...props }, ref) => {
  const { value } = NavigationMenuPrimitive.useRootContext();
  const { value: itemValue } = NavigationMenuPrimitive.useItemContext();
  return (
    <NavigationMenuPrimitive.Portal hostName={portalHost}>
      <NavigationMenuPrimitive.Content
        ref={ref}
        className={cn(
          "w-full native:border native:border-border native:rounded-lg native:shadow-lg native:bg-popover native:text-popover-foreground native:overflow-hidden",
          value === itemValue
            ? "web:animate-in web:fade-in web:slide-in-from-right-20"
            : "web:animate-out web:fade-out web:slide-out-to-left-20",
          className,
        )}
        {...props}
      >
        <Animated.View
          entering={Platform.OS !== "web" ? FadeInLeft : undefined}
          exiting={Platform.OS !== "web" ? FadeOutLeft : undefined}
        >
          {children}
        </Animated.View>
      </NavigationMenuPrimitive.Content>
    </NavigationMenuPrimitive.Portal>
  );
});
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  NavigationMenuPrimitive.ViewportRef,
  NavigationMenuViewportProps & Omit<NavigationMenuPrimitive.ViewportProps, keyof NavigationMenuViewportProps>
>(({ className, ...props }, ref) => {
  return (
    <View className={cn("absolute left-0 top-full flex justify-center")}>
      <View
        className={cn(
          "web:origin-top-center relative mt-1.5 web:h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg web:animate-in web:zoom-in-90",
          className,
        )}
        ref={ref}
        {...props}
      >
        <NavigationMenuPrimitive.Viewport />
      </View>
    </View>
  );
});
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  NavigationMenuPrimitive.IndicatorRef,
  NavigationMenuIndicatorProps & Omit<NavigationMenuPrimitive.IndicatorProps, keyof NavigationMenuIndicatorProps>
>(({ className, ...props }, ref) => {
  const { value } = NavigationMenuPrimitive.useRootContext();
  const { value: itemValue } = NavigationMenuPrimitive.useItemContext();

  return (
    <NavigationMenuPrimitive.Indicator
      ref={ref}
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        value === itemValue
          ? "web:animate-in web:fade-in"
          : "web:animate-out web:fade-out",
        className,
      )}
      {...props}
    >
      <View className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md shadow-foreground/5" />
    </NavigationMenuPrimitive.Indicator>
  );
});
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
