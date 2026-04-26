import * as React from "react";

export type {
  AnimatePresenceProps,
  MotionTransition,
  MotionDivProps,
  MotionSpanProps,
  MotionButtonProps,
  MotionImgProps,
} from "../../web/ui/motion";

import type {
  AnimatePresenceProps,
  MotionDivProps,
  MotionSpanProps,
  MotionButtonProps,
} from "../../web/ui/motion";

export function AnimatePresence({
  children,
}: AnimatePresenceProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MotionDiv({
  children,
}: MotionDivProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MotionSpan({
  children,
}: MotionSpanProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MotionButton({
  children,
}: MotionButtonProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MotionImg(): null {
  return null;
}
