import * as AccordionPrimitive from "@rn-primitives/accordion";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
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
  AccordionProps,
  AccordionTriggerProps,
} from "@/packages/next-vibe-ui/web/ui/accordion";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { ChevronDown } from "./icons/ChevronDown";
import { Text, TextClassContext } from "./text";

const StyledAnimatedView = styled(Animated.View, { className: "style" });
const StyledPressable = styled(Pressable, { className: "style" });

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const TEXT_CLASS_TRIGGER = "text-lg font-medium group-hover:underline";
const TEXT_CLASS_CONTENT = "text-lg";
/* eslint-enable i18next/no-literal-string */

export function Accordion({
  children,
  className,
  style,
  disabled,
  type = "single",
  value,
  onValueChange,
  defaultValue,
  collapsible = false,
}: AccordionProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Compute values for both modes
  const singleValue = typeof value === "string" ? value : undefined;
  const singleDefaultValue =
    typeof defaultValue === "string" ? defaultValue : undefined;

  // Hooks must be called unconditionally
  const [, setValue] = React.useState(singleDefaultValue ?? "");
  const handleValueChange = React.useCallback(
    (newValue: string | undefined) => {
      setValue(newValue ?? "");
      if (newValue !== undefined && onValueChange) {
        onValueChange(newValue);
      }
    },
    [onValueChange],
  );

  if (type === "multiple") {
    const multiValue = Array.isArray(value) ? value : undefined;
    const multiDefaultValue = Array.isArray(defaultValue)
      ? defaultValue
      : undefined;
    const multiOnValueChange =
      onValueChange && typeof onValueChange === "function"
        ? (newValue: string[]): void => {
            if (Array.isArray(newValue)) {
              onValueChange(newValue);
            }
          }
        : undefined;

    return (
      <LayoutAnimationConfig skipEntering>
        <AccordionPrimitive.Root
          type="multiple"
          value={multiValue}
          onValueChange={multiOnValueChange}
          defaultValue={multiDefaultValue}
          disabled={disabled}
          asChild
        >
          <StyledAnimatedView
            {...applyStyleType({ nativeStyle, className })}
            layout={LinearTransition.duration(200)}
          >
            {children}
          </StyledAnimatedView>
        </AccordionPrimitive.Root>
      </LayoutAnimationConfig>
    );
  }

  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        type="single"
        value={singleValue}
        onValueChange={handleValueChange}
        defaultValue={singleDefaultValue}
        collapsible={collapsible}
        disabled={disabled}
        asChild
      >
        <StyledAnimatedView
          {...applyStyleType({ nativeStyle, className })}
          layout={LinearTransition.duration(200)}
        >
          {children}
        </StyledAnimatedView>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  );
}

Accordion.displayName = AccordionPrimitive.Root.displayName;

export function AccordionItem({
  className,
  style,
  value,
  children,
  disabled,
}: AccordionItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledAnimatedView
      className="overflow-hidden"
      layout={LinearTransition.duration(200)}
    >
      <AccordionPrimitive.Item value={value} disabled={disabled} asChild>
        <StyledAnimatedView
          {...applyStyleType({
            nativeStyle,
            className: cn("border-b border-border", className),
          })}
        >
          {children}
        </StyledAnimatedView>
      </AccordionPrimitive.Item>
    </StyledAnimatedView>
  );
}
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

export function AccordionTrigger({
  className,
  style,
  children,
}: AccordionTriggerProps): React.JSX.Element {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

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
    <TextClassContext.Provider value={TEXT_CLASS_TRIGGER}>
      <AccordionPrimitive.Header asChild>
        <StyledAnimatedView className="flex">
          <AccordionPrimitive.Trigger asChild>
            <StyledPressable
              {...applyStyleType({
                nativeStyle,
                className: cn(
                  "flex flex-row flex-1 items-center justify-between py-4 transition-all group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted-foreground",
                  className,
                ),
              })}
            >
              <Text>{children}</Text>
              <StyledAnimatedView style={chevronStyle}>
                <ChevronDown size={18} className="text-foreground shrink-0" />
              </StyledAnimatedView>
            </StyledPressable>
          </AccordionPrimitive.Trigger>
        </StyledAnimatedView>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  );
}
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export function AccordionContent({
  className,
  style,
  children,
}: AccordionContentProps): React.JSX.Element {
  const { isExpanded } = AccordionPrimitive.useItemContext();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <TextClassContext.Provider value={TEXT_CLASS_CONTENT}>
      <AccordionPrimitive.Content asChild>
        <StyledAnimatedView
          {...applyStyleType({
            nativeStyle,
            className: cn(
              "overflow-hidden text-sm transition-all pb-4",
              isExpanded ? "animate-accordion-down" : "animate-accordion-up",
              className,
            ),
          })}
          entering={FadeIn}
          exiting={FadeOutUp.duration(200)}
        >
          {children}
        </StyledAnimatedView>
      </AccordionPrimitive.Content>
    </TextClassContext.Provider>
  );
}

AccordionContent.displayName = AccordionPrimitive.Content.displayName;
