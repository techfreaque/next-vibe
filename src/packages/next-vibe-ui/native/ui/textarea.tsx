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

import * as React from "react";
import { TextInput, View } from "react-native";
import { styled } from "nativewind";
import { cva } from "class-variance-authority";

// Import ALL types from web - ZERO definitions here
import type {
  TextareaProps,
  TextareaChangeEvent,
} from "@/packages/next-vibe-ui/web/ui/textarea";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

import { cn } from "../lib/utils";

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

function Textarea({
  className,
  style,
  variant,
  onChangeText,
  onChange,
  onBlur,
  onFocus,
  minRows = 4,
  maxRows: _maxRows,
  disabled,
  placeholder,
  value,
  defaultValue,
  readOnly,
  maxLength,
  rows,
  required: _required,
  name: _name,
  id: _id,
  title: _title,
  onKeyDown: _onKeyDown,
  ref: _ref,
}: TextareaProps): React.JSX.Element {
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
        /* eslint-disable no-empty-function -- Required for cross-platform event compatibility (React Native to Web adapter) */
        const changeEvent: TextareaChangeEvent = {
          target: {
            value: text,
            name: _name,
            id: _id,
          },
          currentTarget: {
            addEventListener: () => {},
            removeEventListener: () => {},
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
          preventDefault: () => {},
          stopPropagation: () => {},
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 0,
          isTrusted: true,
          timeStamp: Date.now(),
          type: "change",
        };
        /* eslint-enable no-empty-function */
        onChange(changeEvent);
      }
    },
    [onChangeText, onChange, _name, _id],
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
}

export { Textarea };
