"use client";

import { styled } from "nativewind";
import type { JSX } from "react";
import * as React from "react";
import { Pressable,Text as RNText, View } from "react-native";

import type {
  DivGenericTarget,
  DivMouseEvent,
  DivProps as DivBaseProps,
  DivRefObject,
} from "@/packages/next-vibe-ui/web/ui/div";
import type { StyleType } from "@/packages/next-vibe-ui/web/utils/style-type";
import { applyStyleType } from "@/packages/next-vibe-ui/web/utils/style-type";

import { convertCSSToViewStyle } from "../utils/style-converter";

const StyledView = styled(View);
const StyledPressable = styled(Pressable, { className: "style" });

export type DivProps = DivBaseProps & StyleType;

// Create compatibility layer functions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Accepted for API compatibility with web
function createDivRefObject(view: View | null): DivRefObject {
  // React Native doesn't have DOM refs, return polyfill object for compatibility
  // The web version returns actual DOM Element refs
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
    scrollTo: (): void => {
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
  } as DivRefObject;
}

function createDivGenericTarget(): DivGenericTarget {
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

function createDivMouseEvent(): DivMouseEvent {
  const target = createDivGenericTarget();
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

export const Div = React.forwardRef<DivRefObject, Omit<DivProps, "ref">>(
  (
    {
      className,
      style,
      children,
      id,
      role,
      ariaLabel,
      title,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
      onDrop,
      onDragOver,
      onDragLeave,
      onKeyDown,
    },
    ref,
  ): JSX.Element => {
    const wrappedChildren = React.useMemo(
      () => wrapTextChildren(children),
      [children],
    );

    const viewRef = React.useRef<View>(null);

    React.useImperativeHandle(ref, (): DivRefObject => {
      const node = viewRef.current;
      return createDivRefObject(node);
    }, []);

    const handlePress = React.useCallback((): void => {
      if (onClick) {
        const event = createDivMouseEvent();
        onClick(event);
      }
    }, [onClick]);

    const handlePressIn = React.useCallback((): void => {
      if (onMouseEnter) {
        const event = createDivMouseEvent();
        onMouseEnter(event);
      }
    }, [onMouseEnter]);

    const handlePressOut = React.useCallback((): void => {
      if (onMouseLeave) {
        const event = createDivMouseEvent();
        onMouseLeave(event);
      }
    }, [onMouseLeave]);

    const accessibilityRole = role as
      | "none"
      | "button"
      | "link"
      | "search"
      | "image"
      | "text"
      | "adjustable"
      | "imagebutton"
      | "header"
      | "summary"
      | "alert"
      | "checkbox"
      | "combobox"
      | "menu"
      | "menubar"
      | "menuitem"
      | "progressbar"
      | "radio"
      | "radiogroup"
      | "scrollbar"
      | "spinbutton"
      | "switch"
      | "tab"
      | "tablist"
      | "timer"
      | "toolbar"
      | undefined;

    // Use Pressable if any interaction handlers are present
    if (
      onClick ||
      onMouseEnter ||
      onMouseLeave ||
      onTouchStart ||
      onTouchEnd ||
      onDrop ||
      onDragOver ||
      onDragLeave ||
      onKeyDown
    ) {
      return (
        <StyledPressable
          {...applyStyleType({
            nativeStyle: style ? convertCSSToViewStyle(style) : undefined,
            className: className,
          })}
          ref={viewRef}
          nativeID={id}
          accessibilityLabel={ariaLabel || title}
          accessibilityRole={accessibilityRole}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {wrappedChildren}
        </StyledPressable>
      );
    }

    return (
      <StyledView
        ref={viewRef}
        {...applyStyleType({
          nativeStyle: style ? convertCSSToViewStyle(style) : undefined,
          className: className,
        })}
        nativeID={id}
        accessibilityLabel={ariaLabel || title}
        accessibilityRole={accessibilityRole}
      >
        {wrappedChildren}
      </StyledView>
    );
  },
);
