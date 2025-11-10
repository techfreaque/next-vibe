/**
 * Type declarations for styled components
 *
 * These type declarations add className prop support to styled third-party components.
 * The styled() function from NativeWind adds className support at runtime, but TypeScript
 * doesn't automatically infer the className prop, so we need to explicitly declare it.
 */

import type * as AccordionPrimitive from "@rn-primitives/accordion";
import type { ComponentProps } from "react";
import type Animated from "react-native-reanimated";
import type { SafeAreaView } from "react-native-safe-area-context";

/**
 * Helper type to add className prop to component props
 */
type WithClassName<P> = P & { className?: string };

/**
 * Styled Animated.View with className support
 */
export declare const StyledAnimatedView: typeof Animated.View & {
  (props: WithClassName<ComponentProps<typeof Animated.View>>): JSX.Element;
};

/**
 * Styled SafeAreaView with className support
 */
export declare const StyledSafeAreaView: typeof SafeAreaView & {
  (props: WithClassName<ComponentProps<typeof SafeAreaView>>): JSX.Element;
};

/**
 * Styled @rn-primitives/accordion components with className support
 */
export declare const StyledAccordionRoot: typeof AccordionPrimitive.Root & {
  (props: WithClassName<AccordionPrimitive.RootProps>): JSX.Element;
};

export declare const StyledAccordionItem: typeof AccordionPrimitive.Item & {
  (props: WithClassName<AccordionPrimitive.ItemProps>): JSX.Element;
};

export declare const StyledAccordionHeader: typeof AccordionPrimitive.Header & {
  (props: WithClassName<AccordionPrimitive.HeaderProps>): JSX.Element;
};

export declare const StyledAccordionTrigger: typeof AccordionPrimitive.Trigger & {
  (props: WithClassName<AccordionPrimitive.TriggerProps>): JSX.Element;
};

export declare const StyledAccordionContent: typeof AccordionPrimitive.Content & {
  (props: WithClassName<AccordionPrimitive.ContentProps>): JSX.Element;
};
