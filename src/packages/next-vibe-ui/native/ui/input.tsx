import * as React from "react";
import { TextInput } from "react-native";
import type { TextStyle } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import type {
  InputProps,
  InputChangeEvent,
  InputRefObject,
  InferValueType,
} from "@/packages/next-vibe-ui/web/ui/input";
import { convertCSSToTextStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

const noop = (): void => {
  return undefined;
};
const noopBool = (): boolean => {
  return false;
};

const StyledTextInput = styled(TextInput, { className: "style" });

export function Input<
  T extends
    | "text"
    | "email"
    | "tel"
    | "url"
    | "password"
    | "number"
    | "date"
    | "time"
    | "file"
    | "hidden"
    | undefined = undefined,
>({
  className,
  style,
  type,
  onChange,
  onBlur,
  onFocus,
  onKeyPress: _onKeyPress,
  onKeyDown: _onKeyDown,
  onClick: _onClick,
  onChangeText,
  disabled,
  editable,
  value,
  defaultValue,
  placeholder,
  readOnly,
  required: _required,
  autoComplete: _autoComplete,
  autoCorrect,
  spellCheck: _spellCheck,
  autoCapitalize,
  secureTextEntry,
  keyboardType,
  name,
  id,
  "aria-label": ariaLabel,
  ref,
  min: _min,
  max: _max,
  step: _step,
  maxLength,
  accept: _accept,
}: InputProps<T>): React.JSX.Element {
  const stringValue: string | undefined =
    value !== undefined ? String(value) : undefined;
  const stringDefaultValue: string | undefined =
    defaultValue !== undefined ? String(defaultValue) : undefined;

  const nativeStyle: TextStyle | undefined = style
    ? convertCSSToTextStyle(style)
    : undefined;

  // Map web input type to React Native keyboard type
  const resolvedKeyboardType = React.useMemo(():
    | "default"
    | "numeric"
    | "email-address"
    | "phone-pad"
    | undefined => {
    if (keyboardType) {
      return keyboardType;
    }
    switch (type) {
      case "email":
        return "email-address";
      case "tel":
        return "phone-pad";
      case "number":
        return "numeric";
      default:
        return "default";
    }
  }, [type, keyboardType]);

  // Map web input type to React Native secure text entry
  const resolvedSecureTextEntry = React.useMemo((): boolean => {
    if (secureTextEntry !== undefined) {
      return secureTextEntry;
    }
    return type === "password";
  }, [type, secureTextEntry]);

  // Convert web ref to native ref
  const nativeRef = React.useRef<TextInput>(null);

  React.useImperativeHandle(
    ref,
    (): InputRefObject => ({
      focus: (): void => nativeRef.current?.focus(),
      blur: (): void => nativeRef.current?.blur(),
      select: (): void => {
        // Not available in React Native TextInput
      },
      value: stringValue,
    }),
  );

  // Event adapters
  const handleChangeText = React.useCallback(
    (text: string) => {
      onChangeText?.(text);

      if (onChange) {
        // Convert text to the appropriate type based on T
        // When T is "number", InferValueType<T> is number
        // When T is anything else, InferValueType<T> is string
        const typedValue: InferValueType<T> = (
          type === "number" && text !== "" ? Number(text) : text
        ) as InferValueType<T>;

        const changeEvent: InputChangeEvent<T> = {
          target: {
            value: typedValue,
            name,
            id,
            files: null,
          },
          currentTarget: {
            addEventListener: (): void => {
              // No-op for compatibility
            },
            removeEventListener: (): void => {
              // No-op for compatibility
            },
            dispatchEvent: (): boolean => false,
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
            value: typedValue,
          },
          preventDefault: (): void => {
            // No-op for compatibility
          },
          stopPropagation: (): void => {
            // No-op for compatibility
          },
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
    [onChange, onChangeText, name, id, type],
  );

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
        value: value,
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
        value: value,
      },
      preventDefault: noop,
      stopPropagation: noop,
      bubbles: true as const,
      cancelable: true as const,
      defaultPrevented: false as const,
      eventPhase: 0 as const,
      isTrusted: true as const,
      timeStamp: Date.now(),
      type: "blur" as const,
    };
    onBlur(focusEvent);
  }, [onBlur, value]);

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
        value: value,
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
        value: value,
      },
      preventDefault: noop,
      stopPropagation: noop,
      bubbles: true as const,
      cancelable: true as const,
      defaultPrevented: false as const,
      eventPhase: 0 as const,
      isTrusted: true as const,
      timeStamp: Date.now(),
      type: "focus" as const,
    };
    onFocus(focusEvent);
  }, [onFocus, value]);

  const combinedStyle: TextStyle | undefined = nativeStyle
    ? disabled
      ? { ...nativeStyle, opacity: 0.5 }
      : nativeStyle
    : disabled
      ? { opacity: 0.5 }
      : undefined;

  return (
    <StyledTextInput
      ref={nativeRef}
      placeholderTextColor="hsl(var(--muted-foreground))"
      value={stringValue}
      defaultValue={stringDefaultValue}
      placeholder={placeholder}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
      onFocus={handleFocus}
      editable={editable ?? (!disabled && !readOnly)}
      secureTextEntry={resolvedSecureTextEntry}
      keyboardType={resolvedKeyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect === "on"}
      maxLength={maxLength}
      scrollEnabled={false}
      nativeID={id}
      accessibilityLabel={ariaLabel}
      {...applyStyleType({
        nativeStyle: combinedStyle,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm",
          className,
        ),
      })}
    />
  );
}
