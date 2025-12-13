"use client";

import type { JSX } from "react";
import * as React from "react";
import { Text as RNText, Pressable } from "react-native";
import { styled } from "nativewind";

import type {
  SpanProps as SpanBaseProps,
  SpanRefObject,
  SpanMouseEvent,
  SpanGenericTarget,
} from "@/packages/next-vibe-ui/web/ui/span";
import type { StyleType } from "@/packages/next-vibe-ui/web/utils/style-type";
import { applyStyleType } from "@/packages/next-vibe-ui/web/utils/style-type";
import { convertCSSToTextStyle } from "../utils/style-converter";

const StyledText = styled(RNText);
const StyledPressable = styled(Pressable, { className: "style" });

export type SpanProps = SpanBaseProps & StyleType;

// Create compatibility layer functions
function createSpanRefObject(): SpanRefObject {
  return {
    focus: (): void => {
      // No-op for React Native
    },
    blur: (): void => {
      // No-op for React Native
    },
    scrollIntoView: (): void => {
      // No-op for React Native
    },
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    addEventListener: (): void => {
      // No-op for React Native
    },
    removeEventListener: (): void => {
      // No-op for React Native
    },
  };
}

function createSpanGenericTarget(): SpanGenericTarget {
  return {
    addEventListener: (): void => {
      // No-op for React Native
    },
    removeEventListener: (): void => {
      // No-op for React Native
    },
    dispatchEvent: (): boolean => false,
    closest: (): Element | null => null,
    getBoundingClientRect: (): {
      left: number;
      top: number;
      right: number;
      bottom: number;
      width: number;
      height: number;
      x: number;
      y: number;
    } => ({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
    }),
  };
}

function createSpanMouseEvent(): SpanMouseEvent {
  const target = createSpanGenericTarget();
  return {
    currentTarget: target,
    target: target,
    preventDefault: (): void => {
      // No-op for React Native
    },
    stopPropagation: (): void => {
      // No-op for React Native
    },
    isDefaultPrevented: (): boolean => false,
    isPropagationStopped: (): boolean => false,
    persist: (): void => {
      // No-op for React Native
    },
    button: 0,
    buttons: 0,
    clientX: 0,
    clientY: 0,
    bubbles: true,
    cancelable: true,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: true,
    timeStamp: Date.now(),
    type: "press",
  };
}

export const Span = React.forwardRef<SpanRefObject, Omit<SpanProps, "ref">>(
  (
    {
      className,
      style,
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
      role, // Intentionally extracted - not used in React Native
      ariaLabel,
      title,
      id,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
      onDrop, // Intentionally extracted - not used in React Native
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
      onDragOver, // Intentionally extracted - not used in React Native
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
      onDragLeave, // Intentionally extracted - not used in React Native
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
      suppressHydrationWarning, // Intentionally extracted - not used in React Native
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
      dangerouslySetInnerHTML, // Intentionally extracted - not used in React Native
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
      tabIndex, // Intentionally extracted - not used in React Native
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
      onKeyDown, // Intentionally extracted - not used in React Native
    },
    ref,
  ): JSX.Element => {
    const textRef = React.useRef<RNText>(null);

    React.useImperativeHandle(ref, (): SpanRefObject => {
      return createSpanRefObject();
    }, []);

    const handlePress = React.useCallback((): void => {
      if (onClick) {
        const event = createSpanMouseEvent();
        onClick(event);
      }
    }, [onClick]);

    const handlePressIn = React.useCallback((): void => {
      if (onMouseEnter) {
        const event = createSpanMouseEvent();
        onMouseEnter(event);
      }
    }, [onMouseEnter]);

    const handlePressOut = React.useCallback((): void => {
      if (onMouseLeave) {
        const event = createSpanMouseEvent();
        onMouseLeave(event);
      }
    }, [onMouseLeave]);

    // Use Pressable wrapper if any interaction handlers are present
    if (onClick || onMouseEnter || onMouseLeave || onTouchStart || onTouchEnd) {
      return (
        <StyledPressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <StyledText
            {...applyStyleType({
              nativeStyle: style ? convertCSSToTextStyle(style) : undefined,
              className: className,
            })}
            ref={textRef}
            nativeID={id}
            accessibilityLabel={ariaLabel || title}
          >
            {children}
          </StyledText>
        </StyledPressable>
      );
    }

    return (
      <StyledText
        ref={textRef}
        {...applyStyleType({
          nativeStyle: style ? convertCSSToTextStyle(style) : undefined,
          className: className,
        })}
        nativeID={id}
        accessibilityLabel={ariaLabel || title}
      >
        {children}
      </StyledText>
    );
  },
);

Span.displayName = "Span";
