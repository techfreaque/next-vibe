import {
  motion as fmMotion,
  type Transition,
  AnimatePresence as FMAnimatePresence,
} from "framer-motion";
import type { JSX } from "react";

// AnimatePresence interface
export interface AnimatePresenceProps {
  children?: React.ReactNode;
  mode?: "sync" | "popLayout" | "wait";
  initial?: boolean;
  onExitComplete?: () => void;
}

export function AnimatePresence({
  children,
  mode,
  initial,
  onExitComplete,
}: AnimatePresenceProps): JSX.Element {
  return (
    <FMAnimatePresence
      mode={mode}
      initial={initial}
      onExitComplete={onExitComplete}
    >
      {children}
    </FMAnimatePresence>
  );
}

// Shared cross-platform motion interfaces - compatible with both framer-motion and moti
export type MotionTransition = Transition;

export interface MotionDivProps {
  initial?:
    | {
        opacity?: number;
        scale?: number;
        x?: number;
        y?: number;
        rotate?: number;
      }
    | string
    | boolean;
  animate?:
    | {
        width?: string | number;
        opacity?: number;
        scale?: number;
        x?: number;
        y?: number;
        rotate?: number;
      }
    | string;
  exit?:
    | {
        width?: string | number;
        opacity?: number;
        scale?: number;
        x?: number;
        y?: number;
        rotate?: number;
      }
    | string;
  variants?: Record<
    string,
    {
      opacity?: number;
      scale?: number;
      x?: number;
      y?: number;
      rotate?: number;
      transition?: MotionTransition;
    }
  >;
  transition?: MotionTransition;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface MotionSpanProps {
  initial?: {
    opacity?: number;
    scale?: number;
    x?: number;
    y?: number;
    rotate?: number;
  };
  animate?: {
    opacity?: number;
    scale?: number;
    x?: number;
    y?: number;
    rotate?: number;
  };
  transition?: MotionTransition;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface MotionButtonProps {
  initial?: {
    opacity?: number;
    scale?: number;
    x?: number;
    y?: number;
    rotate?: number;
  };
  animate?: {
    opacity?: number;
    scale?: number;
    x?: number;
    y?: number;
    rotate?: number;
  };
  transition?: MotionTransition;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export interface MotionImgProps {
  initial?: {
    opacity?: number;
    scale?: number;
    x?: number;
    y?: number;
    rotate?: number;
  };
  animate?: {
    opacity?: number;
    scale?: number;
    x?: number;
    y?: number;
    rotate?: number;
  };
  transition?: MotionTransition;
  className?: string;
  style?: React.CSSProperties;
  src?: string;
  alt?: string;
}

export function MotionDiv({
  initial,
  animate,
  exit,
  variants,
  transition,
  className,
  children,
  style,
}: MotionDivProps): JSX.Element {
  return (
    <fmMotion.div
      initial={initial}
      animate={animate}
      exit={exit}
      variants={variants}
      transition={transition}
      className={className}
      style={style}
    >
      {children}
    </fmMotion.div>
  );
}

export function MotionSpan({
  initial,
  animate,
  transition,
  className,
  children,
  style,
}: MotionSpanProps): JSX.Element {
  return (
    <fmMotion.span
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
      style={style}
    >
      {children}
    </fmMotion.span>
  );
}

export function MotionButton({
  initial,
  animate,
  transition,
  className,
  children,
  style,
  onClick,
}: MotionButtonProps): JSX.Element {
  return (
    <fmMotion.button
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </fmMotion.button>
  );
}

export function MotionImg({
  initial,
  animate,
  transition,
  className,
  style,
  src,
  alt,
}: MotionImgProps): JSX.Element {
  return (
    <fmMotion.img
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
      style={style}
      src={src}
      alt={alt}
    />
  );
}
