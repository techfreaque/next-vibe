import * as React from "react";
import { Pressable } from "react-native";
import { MotiView, MotiText, MotiImage, AnimatePresence as MotiAnimatePresence } from "moti";
import { styled } from "nativewind";

// Create styled wrappers for Moti components
const StyledMotiView = styled(MotiView);
const StyledMotiText = styled(MotiText);
const StyledMotiImage = styled(MotiImage);

// Import and re-export shared interfaces from web (source of truth)
export type {
  MotionDivProps,
  MotionSpanProps,
  MotionButtonProps,
  MotionImgProps,
  MotionTransition,
  AnimatePresenceProps,
} from "@/packages/next-vibe-ui/web/ui/motion";

import type {
  MotionDivProps,
  MotionSpanProps,
  MotionButtonProps,
  MotionImgProps,
  MotionTransition,
  AnimatePresenceProps,
} from "@/packages/next-vibe-ui/web/ui/motion";

// AnimatePresence component for native
export function AnimatePresence({ children }: AnimatePresenceProps): JSX.Element {
  return <MotiAnimatePresence>{children}</MotiAnimatePresence>;
}

// Helper to convert transition props from web format to moti format
function convertTransitionProps(transition?: MotionTransition): Record<string, number | string> | undefined {
  if (!transition) {
    return undefined;
  }

  const result: Record<string, number | string> = {};

  if (typeof transition === "object" && transition !== null) {
    const transitionType = transition.type;
    if (transitionType === "spring") {
      Object.assign(result, { type: "spring" });
    } else if (transitionType === "tween") {
      Object.assign(result, { type: "timing" });
    }

    if (transition.duration !== undefined) {
      Object.assign(result, { duration: transition.duration });
    }
    if (transition.delay !== undefined) {
      Object.assign(result, { delay: transition.delay });
    }
    if (transition.damping !== undefined) {
      Object.assign(result, { damping: transition.damping });
    }
    if (transition.stiffness !== undefined) {
      Object.assign(result, { stiffness: transition.stiffness });
    }
    if (transition.mass !== undefined) {
      Object.assign(result, { mass: transition.mass });
    }
  }

  return result;
}

// Helper to convert web props (x/y) to native props (translateX/translateY)
function convertAnimationProps(props?: {
  opacity?: number;
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
} | string | boolean):
  | {
      opacity?: number;
      scale?: number;
      translateX?: number;
      translateY?: number;
      rotate?: string;
    }
  | undefined {
  if (!props) {
    return undefined;
  }

  // If it's a string (variant name) or boolean, return undefined to skip
  if (typeof props === "string" || typeof props === "boolean") {
    return undefined;
  }

  const { x, y, opacity, scale, rotate } = props;
  const result: {
    opacity?: number;
    scale?: number;
    translateX?: number;
    translateY?: number;
    rotate?: string;
  } = {};

  if (opacity !== undefined) {
    result.opacity = opacity;
  }
  if (scale !== undefined) {
    result.scale = scale;
  }
  if (x !== undefined) {
    result.translateX = x;
  }
  if (y !== undefined) {
    result.translateY = y;
  }
  if (rotate !== undefined) {
    result.rotate = `${rotate}deg`;
  }

  return result;
}

// Export individual motion components - convert props for moti
export const MotionDiv = React.forwardRef<React.ElementRef<typeof StyledMotiView>, MotionDivProps>(
  ({ initial, animate, exit, variants: _variants, transition, children, className }, ref) => (
    <StyledMotiView
      ref={ref}
      from={convertAnimationProps(initial)}
      animate={convertAnimationProps(animate)}
      exit={exit ? convertAnimationProps(exit) : undefined}
      transition={convertTransitionProps(transition)}
      className={className}
    >
      {children}
    </StyledMotiView>
  )
);
MotionDiv.displayName = "MotionDiv";

export const MotionSpan = React.forwardRef<React.ElementRef<typeof StyledMotiText>, MotionSpanProps>(
  ({ initial, animate, transition, children, className }, ref) => (
    <StyledMotiText
      ref={ref}
      from={convertAnimationProps(initial)}
      animate={convertAnimationProps(animate)}
      transition={convertTransitionProps(transition)}
      className={className}
    >
      {children}
    </StyledMotiText>
  )
);
MotionSpan.displayName = "MotionSpan";

export const MotionButton = React.forwardRef<React.ElementRef<typeof StyledMotiView>, MotionButtonProps>(
  ({ initial, animate, transition, onClick, children, className }, ref) => (
    <StyledMotiView
      ref={ref}
      from={convertAnimationProps(initial)}
      animate={convertAnimationProps(animate)}
      transition={convertTransitionProps(transition)}
      className={className}
    >
      <Pressable onPress={onClick}>{children}</Pressable>
    </StyledMotiView>
  )
);
MotionButton.displayName = "MotionButton";

export const MotionImg = React.forwardRef<React.ElementRef<typeof StyledMotiImage>, MotionImgProps>(
  ({ initial, animate, transition, src, className }, ref) => (
    <StyledMotiImage
      ref={ref}
      from={convertAnimationProps(initial)}
      animate={convertAnimationProps(animate)}
      transition={convertTransitionProps(transition)}
      source={src ? { uri: src } : undefined}
      className={className}
    />
  )
);
MotionImg.displayName = "MotionImg";
