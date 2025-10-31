import * as AccordionPrimitive from "@rn-primitives/accordion";
import * as React from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, {
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

import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from "next-vibe-ui/ui/accordion";
import { cn } from "../lib/utils";
import { ChevronDown } from "./icons/ChevronDown";
import { TextClassContext } from "./text";

const Accordion = React.forwardRef<
  AccordionPrimitive.RootRef,
  AccordionProps
>((props, ref) => {
  const { children, className, type, value, onValueChange, defaultValue, collapsible, disabled } = props;
  const asChild = Platform.OS !== "web";

  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        ref={ref}
        type={type}
        value={value}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        collapsible={collapsible}
        disabled={disabled}
        className={className}
        asChild={asChild}
      >
        <Animated.View layout={LinearTransition.duration(200)}>
          {children}
        </Animated.View>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  );
});

Accordion.displayName = AccordionPrimitive.Root.displayName;

const AccordionItem = React.forwardRef<
  AccordionPrimitive.ItemRef,
  AccordionItemProps
>(({ className, value, children, disabled }, ref) => {
  return (
    <Animated.View
      className="overflow-hidden"
      layout={LinearTransition.duration(200)}
    >
      <AccordionPrimitive.Item
        ref={ref}
        className={cn("border-b border-border", className)}
        value={value}
        disabled={disabled}
      >
        {children}
      </AccordionPrimitive.Item>
    </Animated.View>
  );
});
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

const AccordionTrigger = React.forwardRef<
  AccordionPrimitive.TriggerRef,
  AccordionTriggerProps
>(({ className, children }, ref) => {
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

  const triggerClassName = cn(
    "flex flex-row web:flex-1 items-center justify-between py-4 web:transition-all group web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-muted-foreground",
    className,
  );

  const TriggerContent = (): React.JSX.Element => (
    <>
      {children}
      <Animated.View style={chevronStyle}>
        <ChevronDown size={18} className="text-foreground shrink-0" />
      </Animated.View>
    </>
  );

  return (
    <TextClassContext.Provider
      value={
        "native:text-lg font-medium web:group-hover:underline" // eslint-disable-line i18next/no-literal-string -- CSS class names
      }
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger ref={ref} asChild>
          {Platform.OS === "web" ? (
            <View className={triggerClassName}>
              <TriggerContent />
            </View>
          ) : (
            <Pressable className={triggerClassName}>
              <TriggerContent />
            </Pressable>
          )}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  AccordionPrimitive.ContentRef,
  AccordionContentProps
>(({ className, children }, ref) => {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  return (
    <TextClassContext.Provider value="native:text-lg">
      <AccordionPrimitive.Content
        className={cn(
          "overflow-hidden text-sm web:transition-all",
          isExpanded
            ? "web:animate-accordion-down"
            : "web:animate-accordion-up",
        )}
        ref={ref}
      >
        <InnerContent className={cn("pb-4", className)}>
          {children}
        </InnerContent>
      </AccordionPrimitive.Content>
    </TextClassContext.Provider>
  );
});

interface InnerContentProps {
  children: React.ReactNode;
  className?: string;
}

function InnerContent({ children, className }: InnerContentProps): React.JSX.Element {
  if (Platform.OS === "web") {
    return <View className={cn("pb-4", className)}>{children}</View>;
  }
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOutUp.duration(200)}
      className={cn("pb-4", className)}
    >
      {children}
    </Animated.View>
  );
}

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
