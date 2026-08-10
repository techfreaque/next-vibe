import * as React from "react";

export type {
  AnimatePresenceProps,
  MotionButtonProps,
  MotionDivProps,
  MotionImgProps,
  MotionSpanProps,
  MotionTransition,
} from "../../web/components/motion";

import type {
  AnimatePresenceProps,
  MotionButtonProps,
  MotionDivProps,
  MotionSpanProps,
} from "../../web/components/motion";
import { Div } from "./div";
import { Span } from "./span";

export function AnimatePresence({
  children,
}: AnimatePresenceProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MotionDiv({
  children,
  className,
}: MotionDivProps): React.JSX.Element | null {
  if (className) {
    return <Div className={className}>{children}</Div>;
  }
  return <>{children}</>;
}

export function MotionSpan({
  children,
  className,
}: MotionSpanProps): React.JSX.Element | null {
  if (className) {
    return <Span className={className}>{children}</Span>;
  }
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
