import * as React from "react";
import { View, Text as RNText, Pressable } from "react-native";
import type { ViewStyle } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import type {
  DivProps,
  DivRefObject,
  DivMouseEvent,
  DivGenericTarget,
} from "@/packages/next-vibe-ui/web/ui/div";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

const StyledView = styled(View, { className: "style" });
const StyledPressable = styled(Pressable, { className: "style" });

// Convert web ref to native ref
function convertRefToNative(
  webRef:
    | React.RefObject<DivRefObject | null>
    | ((node: DivRefObject | null) => void)
    | undefined,
): React.RefObject<View> | ((node: View | null) => void) | undefined {
  if (!webRef) {
    return undefined;
  }

  if (typeof webRef === "function") {
    // Convert callback ref
    return (node: View | null) => {
      // Create a proxy object that matches DivRefObject interface
      if (node) {
        // Type-safe conversion: View implements subset of DivRefObject interface
        const divRefObject = node as View & DivRefObject;
        webRef(divRefObject);
      } else {
        webRef(null);
      }
    };
  }

  // Convert RefObject - View implements subset of DivRefObject interface
  return webRef as React.RefObject<View> & React.RefObject<DivRefObject>;
}

export function Div({
  className,
  style,
  children,
  ref,
  role,
  ariaLabel,
  id,
  title,
  onClick,
  onTouchStart,
  onTouchEnd,
}: DivProps): React.JSX.Element {
  // Helper to wrap text strings in Text components for React Native
  const renderChildren = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === "string" || typeof content === "number") {
      return <RNText>{content}</RNText>;
    }

    if (Array.isArray(content)) {
      return content.map((child, index) => (
        <React.Fragment key={index}>{renderChildren(child)}</React.Fragment>
      ));
    }

    // Check if it's a React element with children
    if (React.isValidElement(content)) {
      const props = content.props as { children?: React.ReactNode };
      if (props?.children) {
        return React.cloneElement(content, {
          ...props,
          children: renderChildren(props.children),
        } as React.Attributes);
      }
    }

    return content;
  };

  // Convert web types to native types
  const nativeRef = convertRefToNative(ref);
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  // Convert event handlers for React Native
  const handlePress = onClick
    ? (): void => {
        const event: DivMouseEvent = {
          currentTarget: {} as DivGenericTarget,
          target: {} as DivGenericTarget,
          preventDefault: (): void => {
            // No-op for React Native
          },
          stopPropagation: (): void => {
            // No-op for React Native
          },
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
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
        onClick(event);
      }
    : undefined;

  const accessibilityRoleValue = role as
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

  // Support both className and style together
  if (handlePress || onTouchStart || onTouchEnd) {
    return (
      <StyledPressable
        ref={nativeRef}
        {...applyStyleType({
          nativeStyle,
          className: cn(className),
        })}
        nativeID={id}
        accessibilityLabel={ariaLabel || title}
        accessibilityRole={accessibilityRoleValue}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onPress={handlePress}
      >
        {renderChildren(children)}
      </StyledPressable>
    );
  }

  return (
    <StyledView
      ref={nativeRef}
      {...applyStyleType({
        nativeStyle,
        className: cn(className),
      })}
      nativeID={id}
      accessibilityLabel={ariaLabel || title}
      accessibilityRole={accessibilityRoleValue}
    >
      {renderChildren(children)}
    </StyledView>
  );
}

Div.displayName = "Div";
