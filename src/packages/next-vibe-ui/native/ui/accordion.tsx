import * as AccordionPrimitive from "@rn-primitives/accordion";
import * as React from "react";
import { Platform, Pressable, View } from "react-native";
import {
  Extrapolation,
  FadeIn,
  FadeOutUp,
  interpolate,
  LayoutAnimationConfig,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { styled } from "nativewind";
import Animated from "react-native-reanimated";

import { ChevronDown } from "./icons/ChevronDown";
import { cn } from "../lib/utils";
import { TextClassContext } from "./text";

// Local styled components to avoid type instantiation issues
const StyledAccordionRoot = styled(AccordionPrimitive.Root, {
  className: "style",
});
const StyledAccordionItem = styled(AccordionPrimitive.Item, {
  className: "style",
});
const StyledAccordionHeader = styled(AccordionPrimitive.Header, {
  className: "style",
});
const StyledAccordionTrigger = styled(AccordionPrimitive.Trigger, {
  className: "style",
});
const StyledAccordionContent = styled(AccordionPrimitive.Content, {
  className: "style",
});
const StyledAnimatedView = styled(Animated.View, {
  className: "style",
});

const Accordion = React.forwardRef<
  AccordionPrimitive.RootRef,
  AccordionPrimitive.RootProps
>(({ children, ...props }, ref) => {
  return (
    <LayoutAnimationConfig skipEntering>
      <StyledAccordionRoot ref={ref} {...props} asChild={Platform.OS !== "web"}>
        <StyledAnimatedView layout={LinearTransition.duration(200)}>
          {children}
        </StyledAnimatedView>
      </StyledAccordionRoot>
    </LayoutAnimationConfig>
  );
});

Accordion.displayName = AccordionPrimitive.Root.displayName;

const AccordionItem = React.forwardRef<
  AccordionPrimitive.ItemRef,
  AccordionPrimitive.ItemProps & { className?: string }
>(({ className, value, ...props }, ref) => {
  return (
    <StyledAnimatedView
      className={"overflow-hidden"}
      layout={LinearTransition.duration(200)}
    >
      <StyledAccordionItem
        ref={ref}
        className={cn("border-b border-border", className)}
        value={value}
        {...props}
      />
    </StyledAnimatedView>
  );
});
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

const Trigger = Platform.OS === "web" ? View : Pressable;

const AccordionTrigger = React.forwardRef<
  AccordionPrimitive.TriggerRef,
  AccordionPrimitive.TriggerProps & { className?: string; children: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  const { isExpanded } = AccordionPrimitive.useItemContext();

  const progress = useDerivedValue(() =>
    isExpanded
      ? withTiming(1, { duration: 250 })
      : withTiming(0, { duration: 200 }),
  );
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
    opacity: interpolate(progress.value, [0, 1], [1, 0.8], Extrapolation.CLAMP),
  }));

  return (
    <TextClassContext.Provider
      value={
        "native:text-lg font-medium web:group-hover:underline" // eslint-disable-line i18next/no-literal-string -- CSS class names
      }
    >
      <StyledAccordionHeader className="flex">
        <StyledAccordionTrigger ref={ref} {...props} asChild>
          <Trigger
            className={cn(
              "flex flex-row web:flex-1 items-center justify-between py-4 web:transition-all group web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-muted-foreground",
              className,
            )}
          >
            {children}
            <StyledAnimatedView style={chevronStyle}>
              <ChevronDown size={18} className={"text-foreground shrink-0"} />
            </StyledAnimatedView>
          </Trigger>
        </StyledAccordionTrigger>
      </StyledAccordionHeader>
    </TextClassContext.Provider>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  AccordionPrimitive.ContentRef,
  AccordionPrimitive.ContentProps & { className?: string }
>(({ className, children, ...props }, ref) => {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  return (
    <TextClassContext.Provider value="native:text-lg">
      <StyledAccordionContent
        className={cn(
          "overflow-hidden text-sm web:transition-all",
          isExpanded
            ? "web:animate-accordion-down"
            : "web:animate-accordion-up",
        )}
        ref={ref}
        {...props}
      >
        <InnerContent className={cn("pb-4", className)}>
          {children}
        </InnerContent>
      </StyledAccordionContent>
    </TextClassContext.Provider>
  );
});

function InnerContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  if (Platform.OS === "web") {
    return <View className={cn("pb-4", className)}>{children}</View>;
  }
  return (
    <StyledAnimatedView
      entering={FadeIn}
      exiting={FadeOutUp.duration(200)}
      className={cn("pb-4", className)}
    >
      {children}
    </StyledAnimatedView>
  );
}

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
