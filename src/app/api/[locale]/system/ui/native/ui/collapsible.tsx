import * as CollapsiblePrimitive from "@rn-primitives/collapsible";
import {
  convertCSSToViewStyle,
  styledNative,
} from "next-vibe/ui/native/utils/style-converter";
import type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from "next-vibe/ui/web/ui/collapsible";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";
import Animated, {
  FadeIn,
  FadeOut,
  LayoutAnimationConfig,
  LinearTransition,
} from "react-native-reanimated";

const StyledAnimatedView = styledNative(Animated.View);

export function Collapsible({
  children,
  className,
  style,
  ...props
}: CollapsibleProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <LayoutAnimationConfig skipEntering>
      <CollapsiblePrimitive.Root {...props} asChild>
        <StyledAnimatedView
          {...applyStyleType({
            nativeStyle,
            className,
          })}
          layout={LinearTransition.duration(200)}
        >
          {children}
        </StyledAnimatedView>
      </CollapsiblePrimitive.Root>
    </LayoutAnimationConfig>
  );
}
Collapsible.displayName = CollapsiblePrimitive.Root.displayName;

export function CollapsibleTrigger({
  children,
  asChild,
  className,
  style,
  ...props
}: CollapsibleTriggerProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <CollapsiblePrimitive.Trigger
      asChild={asChild}
      {...applyStyleType({
        nativeStyle,
        className,
      })}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Trigger>
  );
}
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

export function CollapsibleContent({
  children,
  className,
  style,
  ...props
}: CollapsibleContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <CollapsiblePrimitive.Content {...props}>
      <StyledAnimatedView
        entering={FadeIn}
        exiting={FadeOut.duration(200)}
        {...applyStyleType({
          nativeStyle,
          className,
        })}
      >
        {children}
      </StyledAnimatedView>
    </CollapsiblePrimitive.Content>
  );
}
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;
