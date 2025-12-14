/**
 * Textarea Component for React Native
 * Production-ready multiline text input with proper event handling
 *
 * TYPE SAFETY: All types imported from web version (source of truth)
 * FEATURES:
 * ✅ Multiline text input using TextInput with multiline prop
 * ✅ Proper event handling (onChange, onBlur, onFocus via onChangeText)
 * ✅ Controlled and uncontrolled components support
 * ✅ Variant support (default, ghost)
 * ✅ Disabled and readOnly states
 */

import { cva } from "class-variance-authority";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { TextInput, View } from "react-native";

// Import ALL types from web - ZERO definitions here
import type {
  TextareaChangeEvent,
  TextareaProps,
  TextareaRefObject,
} from "@/packages/next-vibe-ui/web/ui/textarea";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
const noop = (): void => {
  return undefined;
};
const noopBool = (): boolean => {
  return false;
};

const StyledView = styled(View, { className: "style" });
const StyledTextInput = styled(TextInput, { className: "style" });

// Native textarea variants using CVA (matches web version structure)
export const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-input",
        ghost:
          "border-none bg-transparent rounded-t-md rounded-b-none px-6 pb-4 border-b py-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const TextareaInner = (
  {
    className,
    style,
    variant,
    onChangeText,
    onChange,
    onBlur,
    onFocus,
    minRows = 4,
    disabled,
    placeholder,
    value,
    defaultValue,
    readOnly,
    maxLength,
    rows,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
    required, // Intentionally extracted - not used in React Native
    name: nameAttr,
    id: idAttr,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
    title, // Intentionally extracted - not used in React Native
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
    onKeyDown, // Intentionally extracted - not used in React Native
  }: Omit<TextareaProps, "ref">,
  ref: React.ForwardedRef<TextareaRefObject>,
): React.JSX.Element => {
  const textInputRef = React.useRef<TextInput>(null);

  React.useImperativeHandle(
    ref,
    (): TextareaRefObject => ({
      focus: (): void => textInputRef.current?.focus(),
      blur: (): void => textInputRef.current?.blur(),
      select: (): void => {
        // React Native doesn't support select
      },
      value: value ?? "",
    }),
    [value],
  );
  // Use rows or minRows as numberOfLines
  const numberOfLines = rows ?? minRows;

  // Handle disabled/readOnly state
  const isEditable = !disabled && !readOnly;

  // Convert CSS style to React Native style
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Handle text changes - support both onChangeText and onChange
  const handleChangeText = React.useCallback(
    (text: string): void => {
      // Call native-specific handler (primary for React Native)
      onChangeText?.(text);

      // Call web-compatible onChange handler if provided with proper event object
      if (onChange) {
        // Mock event object for web API compatibility in React Native
        // eslint-disable-next-line no-empty-function -- Mock event stubs required for web API interface
        const changeEvent: TextareaChangeEvent = {
          target: {
            value: text,
            name: nameAttr,
            id: idAttr,
          },
          currentTarget: {
            addEventListener: () => {/* no-op stub for web interface */},
            removeEventListener: () => {/* no-op stub for web interface */},
            dispatchEvent: () => false,
            getBoundingClientRect: () => ({
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              width: 0,
              height: 0,
              x: 0,
              y: 0,
            }),
            value: text,
          },
          preventDefault: () => {/* no-op stub for web interface */},
          stopPropagation: () => {/* no-op stub for web interface */},
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 0,
          isTrusted: true,
          timeStamp: Date.now(),
          type: "change",
        };
         
        onChange(changeEvent);
      }
    },
    [onChangeText, onChange, nameAttr, idAttr],
  );

  // Handle blur events
  const handleBlur = React.useCallback((): void => {
    if (!onBlur) {
      return;
    }

    const focusEvent = {
      target: {
        addEventListener: noop,
        removeEventListener: noop,
        dispatchEvent: noopBool,
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
        value,
      },
      currentTarget: {
        addEventListener: noop,
        removeEventListener: noop,
        dispatchEvent: noopBool,
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
        value,
      },
      preventDefault: noop,
      stopPropagation: noop,
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      timeStamp: Date.now(),
      type: "blur",
    };
    onBlur(focusEvent);
  }, [onBlur, value]);

  // Handle focus events
  const handleFocus = React.useCallback((): void => {
    if (!onFocus) {
      return;
    }

    const focusEvent = {
      target: {
        addEventListener: noop,
        removeEventListener: noop,
        dispatchEvent: noopBool,
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
        value,
      },
      currentTarget: {
        addEventListener: noop,
        removeEventListener: noop,
        dispatchEvent: noopBool,
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
        value,
      },
      preventDefault: noop,
      stopPropagation: noop,
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      timeStamp: Date.now(),
      type: "focus",
    };
    onFocus(focusEvent);
  }, [onFocus, value]);

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          textareaVariants({ variant }),
          "flex-row",
          !isEditable && "opacity-50",
          className,
        ),
      })}
      pointerEvents="box-none"
    >
      <StyledTextInput
        ref={textInputRef}
        className="flex-1 text-base text-foreground"
        placeholderTextColor="hsl(var(--muted-foreground))"
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        multiline={true}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        onFocus={handleFocus}
        editable={isEditable}
      />
    </StyledView>
  );
};

export const Textarea = React.forwardRef(TextareaInner);
