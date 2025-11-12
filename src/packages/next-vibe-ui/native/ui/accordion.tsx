import * as AccordionPrimitive from "@rn-primitives/accordion";
import * as React from "react";
import { Pressable } from "react-native";
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
  AccordionRootProps,
  AccordionTriggerProps,
} from "@/packages/next-vibe-ui/web/ui/accordion";
import { cn } from "../lib/utils";
import { ChevronDown } from "./icons/ChevronDown";
import { TextClassContext } from "./text";

// Re-export all types
export type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionRootProps,
  AccordionTriggerProps,
};

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_TRIGGER = "text-lg font-medium group-hover:underline";
const TEXT_CLASS_CONTENT = "text-lg";
/* eslint-enable i18next/no-literal-string */

export function Accordion({
  children,
  className,
  disabled,
  type = "single",
  value,
  onValueChange,
  defaultValue,
  collapsible = false,
}: AccordionRootProps): React.JSX.Element {
  if (type === "multiple") {
    return (
      <LayoutAnimationConfig skipEntering>
        <AccordionPrimitive.Root
          type="multiple"
          value={value as string[] | undefined}
          onValueChange={
            onValueChange as ((value: string[]) => void) | undefined
          }
          defaultValue={defaultValue as string[] | undefined}
          disabled={disabled}
          className={className}
          asChild
        >
          <Animated.View layout={LinearTransition.duration(200)}>
            {children}
          </Animated.View>
        </AccordionPrimitive.Root>
      </LayoutAnimationConfig>
    );
  }

  const [_value, setValue] = React.useState(
    (defaultValue as string | undefined) || "",
  );
  const handleValueChange = React.useCallback(
    (newValue: string | undefined) => {
      setValue(newValue || "");
      if (newValue !== undefined && onValueChange) {
        (onValueChange as (value: string) => void)(newValue);
      }
    },
    [onValueChange],
  );

  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        type="single"
        value={value as string | undefined}
        onValueChange={handleValueChange}
        defaultValue={defaultValue as string | undefined}
        collapsible={collapsible}
        disabled={disabled}
        className={className}
        asChild
      >
        <Animated.View layout={LinearTransition.duration(200)}>
          {children}
        </Animated.View>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  );
}

Accordion.displayName = AccordionPrimitive.Root.displayName;

export function AccordionItem({
  className,
  value,
  children,
  disabled,
}: AccordionItemProps): React.JSX.Element {
  return (
    <Animated.View
      className="overflow-hidden"
      layout={LinearTransition.duration(200)}
    >
      <AccordionPrimitive.Item
        className={cn("border-b border-border", className)}
        value={value}
        disabled={disabled}
      >
        {children}
      </AccordionPrimitive.Item>
    </Animated.View>
  );
}
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

export function AccordionTrigger({
  className,
  children,
}: AccordionTriggerProps): React.JSX.Element {
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
    "flex flex-row flex-1 items-center justify-between py-4 transition-all group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted-foreground",
    className,
  );

  return (
    <TextClassContext.Provider value={TEXT_CLASS_TRIGGER}>
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger asChild>
          <Pressable className={triggerClassName}>
            {children}
            <Animated.View style={chevronStyle}>
              <ChevronDown size={18} className="text-foreground shrink-0" />
            </Animated.View>
          </Pressable>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  );
}
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export function AccordionContent({
  className,
  children,
}: AccordionContentProps): React.JSX.Element {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  return (
    <TextClassContext.Provider value={TEXT_CLASS_CONTENT}>
      <AccordionPrimitive.Content
        className={cn(
          "overflow-hidden text-sm transition-all",
          isExpanded ? "animate-accordion-down" : "animate-accordion-up",
        )}
      >
        <Animated.View
          entering={FadeIn}
          exiting={FadeOutUp.duration(200)}
          className={cn("pb-4", className)}
        >
          {children}
        </Animated.View>
      </AccordionPrimitive.Content>
    </TextClassContext.Provider>
  );
}

AccordionContent.displayName = AccordionPrimitive.Content.displayName;
