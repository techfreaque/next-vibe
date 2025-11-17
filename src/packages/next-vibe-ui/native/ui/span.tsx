import * as React from "react";
import { Text as RNText } from "react-native";
import type { TextStyle } from "react-native";

import type {
  SpanProps,
  SpanRefObject,
} from "@/packages/next-vibe-ui/web/ui/span";
import { cn } from "../lib/utils";
import { styled } from "nativewind";
import { convertCSSToTextStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

const StyledText = styled(RNText, { className: "style" });

// Convert web ref to native ref
function convertRefToNative(
  webRef:
    | React.RefObject<SpanRefObject | null>
    | ((node: SpanRefObject | null) => void)
    | undefined,
): React.RefObject<RNText> | ((node: RNText | null) => void) | undefined {
  if (!webRef) {
    return undefined;
  }

  if (typeof webRef === "function") {
    return (node: RNText | null) => {
      if (node) {
        // Type-safe conversion: RNText implements subset of SpanRefObject interface
        const spanRefObject = node as RNText & SpanRefObject;
        webRef(spanRefObject);
      } else {
        webRef(null);
      }
    };
  }

  // Convert RefObject - RNText implements subset of SpanRefObject interface
  return webRef as React.RefObject<RNText> & React.RefObject<SpanRefObject>;
}

// Native: Use Text component (inline text in React Native)
export function Span({
  className,
  style,
  children,
  ref,
  role: _role,
  ariaLabel,
  id,
  title,
  onClick: _onClick,
  onMouseEnter: _onMouseEnter,
  onMouseLeave: _onMouseLeave,
  onTouchStart: _onTouchStart,
  onTouchEnd: _onTouchEnd,
  onDrop: _onDrop,
  onDragOver: _onDragOver,
  onDragLeave: _onDragLeave,
  suppressHydrationWarning: _suppressHydrationWarning,
  dangerouslySetInnerHTML: _dangerouslySetInnerHTML,
  tabIndex: _tabIndex,
  onKeyDown: _onKeyDown,
}: SpanProps): React.JSX.Element {
  const nativeRef = convertRefToNative(ref);
  const nativeStyle: TextStyle | undefined = style
    ? convertCSSToTextStyle(style)
    : undefined;

  return (
    <StyledText
      ref={nativeRef}
      nativeID={id}
      accessibilityLabel={ariaLabel || title}
      {...applyStyleType({
        nativeStyle,
        className: cn("text-base text-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}
