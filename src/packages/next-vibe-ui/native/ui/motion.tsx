import * as React from "react";
import { Pressable, Text as RNText } from "react-native";
import type {
  ImageSourcePropType,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import {
  MotiView,
  MotiText,
  MotiImage,
  AnimatePresence as MotiAnimatePresence,
} from "moti";
import type { MotiProps } from "moti";
import { styled } from "nativewind";

import {
  convertCSSToViewStyle,
  convertCSSToTextStyle,
  convertCSSToImageStyle,
} from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";
import type {
  AnimatePresenceProps,
  MotionTransition,
  MotionDivProps,
  MotionSpanProps,
  MotionButtonProps,
  MotionImgProps,
} from "@/packages/next-vibe-ui/web/ui/motion";

// Create styled wrappers for Moti components
const StyledMotiView = styled(MotiView, { className: "style" });
const StyledMotiText = styled(MotiText, { className: "style" });
const StyledMotiImage = styled(MotiImage, { className: "style" });

// Re-export all types from web (zero definitions in native)
export type {
  AnimatePresenceProps,
  MotionTransition,
  MotionDivProps,
  MotionSpanProps,
  MotionButtonProps,
  MotionImgProps,
};

// AnimatePresence component for native
export function AnimatePresence({
  children,
  mode,
  onExitComplete,
}: AnimatePresenceProps): React.JSX.Element {
  // Moti AnimatePresence doesn't support mode directly, but we can handle initial and onExitComplete
  return (
    <MotiAnimatePresence
      exitBeforeEnter={mode === "wait"}
      onExitComplete={onExitComplete}
    >
      {children}
    </MotiAnimatePresence>
  );
}

// Helper to convert web transition props to moti format
function convertTransitionToMoti(
  transition?: MotionTransition,
): MotiProps<ViewStyle | TextStyle | ImageStyle>["transition"] | undefined {
  if (!transition) {
    return undefined;
  }

  // Handle object transition
  if (typeof transition === "object" && transition !== null) {
    const motiTransition: NonNullable<
      MotiProps<ViewStyle | TextStyle | ImageStyle>["transition"]
    > = {};

    // Map type
    if ("type" in transition) {
      if (transition.type === "spring") {
        Object.assign(motiTransition, { type: "spring" as const });
      } else if (transition.type === "tween") {
        Object.assign(motiTransition, { type: "timing" as const });
      }
    }

    // Map duration (convert to milliseconds for moti)
    if ("duration" in transition && typeof transition.duration === "number") {
      Object.assign(motiTransition, {
        duration: transition.duration * 1000,
      });
    }

    // Map delay (convert to milliseconds for moti)
    if ("delay" in transition && typeof transition.delay === "number") {
      Object.assign(motiTransition, { delay: transition.delay * 1000 });
    }

    // Map spring properties
    if ("damping" in transition && typeof transition.damping === "number") {
      Object.assign(motiTransition, { damping: transition.damping });
    }
    if ("stiffness" in transition && typeof transition.stiffness === "number") {
      Object.assign(motiTransition, { stiffness: transition.stiffness });
    }
    if ("mass" in transition && typeof transition.mass === "number") {
      Object.assign(motiTransition, { mass: transition.mass });
    }

    // Map repeat properties
    if ("repeat" in transition && typeof transition.repeat === "number") {
      Object.assign(motiTransition, { loop: transition.repeat === Infinity });
    }
    if (
      "repeatType" in transition &&
      typeof transition.repeatType === "string"
    ) {
      Object.assign(motiTransition, {
        repeatReverse: transition.repeatType === "reverse",
      });
    }

    return motiTransition;
  }

  return undefined;
}

// Helper to convert web animation props (x/y) to native props (translateX/translateY)
function convertAnimationPropsToMoti(
  props?:
    | {
        opacity?: number;
        scale?: number;
        x?: number;
        y?: number;
        rotate?: number;
        width?: string | number;
      }
    | string
    | boolean,
): Record<string, number | string> | undefined {
  // Handle variant name strings
  if (typeof props === "string") {
    return undefined;
  }

  // Handle boolean (used for initial prop)
  if (typeof props === "boolean") {
    return undefined;
  }

  if (!props) {
    return undefined;
  }

  const result: Record<string, number | string> = {};

  // Map opacity
  if (props.opacity !== undefined) {
    result.opacity = props.opacity;
  }

  // Map scale
  if (props.scale !== undefined) {
    result.scale = props.scale;
  }

  // Map x/y to translateX/translateY
  if (props.x !== undefined) {
    result.translateX = props.x;
  }
  if (props.y !== undefined) {
    result.translateY = props.y;
  }

  // Map rotate (convert to degrees string)
  if (props.rotate !== undefined) {
    result.rotate = `${props.rotate}deg`;
  }

  // Map width (native supports number or string)
  if (props.width !== undefined) {
    result.width = props.width;
  }

  return result;
}

// Helper to wrap text children in Text components
function wrapTextChildren(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string" || typeof children === "number") {
    return <RNText>{children}</RNText>;
  }

  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>{wrapTextChildren(child)}</React.Fragment>
    ));
  }

  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props?.children) {
      return React.cloneElement(children, {
        ...props,
        children: wrapTextChildren(props.children),
      } as React.Attributes);
    }
  }

  return children;
}

// MotionDiv component - supports both className and style props
export function MotionDiv({
  initial,
  animate,
  exit,
  variants,
  transition,
  className,
  children,
  style,
}: MotionDivProps): React.JSX.Element {
  // Convert CSS style to React Native ViewStyle if provided
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // If using variants with string names, resolve them to actual animation values
  let fromProps: Record<string, number | string> | undefined;
  let animateProps: Record<string, number | string> | undefined;

  if (variants && typeof initial === "string" && variants[initial]) {
    fromProps = convertAnimationPropsToMoti(variants[initial]);
  } else {
    fromProps = convertAnimationPropsToMoti(initial);
  }

  if (variants && typeof animate === "string" && variants[animate]) {
    animateProps = convertAnimationPropsToMoti(variants[animate]);
  } else {
    animateProps = convertAnimationPropsToMoti(animate);
  }

  const exitProps = convertAnimationPropsToMoti(exit);

  return (
    <StyledMotiView
      from={fromProps}
      animate={animateProps}
      exit={exitProps}
      transition={convertTransitionToMoti(transition)}
      {...applyStyleType({ nativeStyle, className })}
    >
      {wrapTextChildren(children)}
    </StyledMotiView>
  );
}

MotionDiv.displayName = "MotionDiv";

// MotionSpan component - supports both className and style props
export function MotionSpan({
  initial,
  animate,
  transition,
  className,
  children,
  style,
}: MotionSpanProps): React.JSX.Element {
  // Convert CSS style to React Native TextStyle if provided
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledMotiText
      from={convertAnimationPropsToMoti(initial)}
      animate={convertAnimationPropsToMoti(animate)}
      transition={convertTransitionToMoti(transition)}
      {...applyStyleType({ nativeStyle, className })}
    >
      {children}
    </StyledMotiText>
  );
}

MotionSpan.displayName = "MotionSpan";

// MotionButton component - supports both className and style props
export function MotionButton({
  initial,
  animate,
  transition,
  className,
  children,
  style,
  onClick,
}: MotionButtonProps): React.JSX.Element {
  // Convert CSS style to React Native ViewStyle if provided
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledMotiView
      from={convertAnimationPropsToMoti(initial)}
      animate={convertAnimationPropsToMoti(animate)}
      transition={convertTransitionToMoti(transition)}
      {...applyStyleType({ nativeStyle, className })}
    >
      <Pressable onPress={onClick}>{wrapTextChildren(children)}</Pressable>
    </StyledMotiView>
  );
}

MotionButton.displayName = "MotionButton";

// MotionImg component - supports both className and style props
export function MotionImg({
  initial,
  animate,
  transition,
  className,
  style,
  src,
  alt,
}: MotionImgProps): React.JSX.Element {
  // Convert src to ImageSourcePropType
  const source: ImageSourcePropType | undefined = src
    ? { uri: src }
    : undefined;

  // Convert CSS style to React Native ImageStyle if provided
  const nativeStyle = style ? convertCSSToImageStyle(style) : undefined;

  const fromProps = convertAnimationPropsToMoti(initial);
  const animateProps = convertAnimationPropsToMoti(animate);

  // StyledMotiImage uses nativeStyle for direct React Native styling
  // Cannot pass both nativeStyle and className due to StyleType discriminated union
  // Here we prefer nativeStyle for MotiImage since it's a direct RN component
  return (
    <StyledMotiImage
      from={fromProps}
      animate={animateProps}
      transition={convertTransitionToMoti(transition)}
      style={nativeStyle}
      className={className}
      source={source}
      accessibilityLabel={alt}
    />
  );
}

MotionImg.displayName = "MotionImg";
