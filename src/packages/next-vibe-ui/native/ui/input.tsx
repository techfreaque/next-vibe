import type { JSX } from "react";
import * as React from "react";
import { TextInput } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import type {
  InputProps as InputBaseProps,
  InputRefObject,
  InputChangeEvent,
  InputFocusEvent,
  InputGenericTarget,
  InferValueType,
} from "@/packages/next-vibe-ui/web/ui/input";
import type { StyleType } from "@/packages/next-vibe-ui/web/utils/style-type";
import { applyStyleType } from "@/packages/next-vibe-ui/web/utils/style-type";
import { convertCSSToTextStyle } from "../utils/style-converter";

const StyledTextInput = styled(TextInput);

export type InputProps<
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
> = InputBaseProps<T> & StyleType;

// Create compatibility layer functions
function createInputRefObject(
  input: TextInput | null,
  value: string | undefined,
): InputRefObject {
  return {
    focus: (): void => {
      if (input) {
        input.focus();
      }
    },
    blur: (): void => {
      if (input) {
        input.blur();
      }
    },
    select: (): void => {
      // React Native TextInput doesn't support select()
    },
    value: value,
  };
}

function createInputGenericTarget<T = undefined>(
  value: InferValueType<T>,
): InputGenericTarget<T> {
  return {
    addEventListener: (): void => {
      // No-op for React Native
    },
    removeEventListener: (): void => {
      // No-op for React Native
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
    value: value,
  };
}

function InputInner<
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
>(
  {
    className,
    style,
    type,
    onChange,
    onChangeText,
    onBlur,
    onFocus,
    onClick: _onClick,
    onKeyPress: _onKeyPress,
    onKeyDown: _onKeyDown,
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
    min: _min,
    max: _max,
    step: _step,
    maxLength,
    accept: _accept,
  }: Omit<InputProps<T>, "ref">,
  ref: React.ForwardedRef<InputRefObject>,
): JSX.Element {
  const stringValue: string | undefined =
    value !== undefined ? String(value) : undefined;
  const stringDefaultValue: string | undefined =
    defaultValue !== undefined ? String(defaultValue) : undefined;

  const nativeRef = React.useRef<TextInput>(null);

  // Handle ref forwarding
  React.useImperativeHandle(
    ref,
    (): InputRefObject => {
      return createInputRefObject(nativeRef.current, stringValue);
    },
    [stringValue],
  );

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

  const handleChangeText = React.useCallback(
    (text: string) => {
      onChangeText?.(text);

      if (onChange) {
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
          currentTarget: createInputGenericTarget<T>(typedValue),
          preventDefault: (): void => {
            // No-op for React Native
          },
          stopPropagation: (): void => {
            // No-op for React Native
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

    const focusEvent: InputFocusEvent<T> = {
      target: createInputGenericTarget<T>(value as InferValueType<T>),
      currentTarget: createInputGenericTarget<T>(value as InferValueType<T>),
      preventDefault: (): void => {
        // No-op for React Native
      },
      stopPropagation: (): void => {
        // No-op for React Native
      },
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

  const handleFocus = React.useCallback((): void => {
    if (!onFocus) {
      return;
    }

    const focusEvent: InputFocusEvent<T> = {
      target: createInputGenericTarget<T>(value as InferValueType<T>),
      currentTarget: createInputGenericTarget<T>(value as InferValueType<T>),
      preventDefault: (): void => {
        // No-op for React Native
      },
      stopPropagation: (): void => {
        // No-op for React Native
      },
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

  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;
  const disabledStyle = disabled ? { opacity: 0.5 } : undefined;

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
        nativeStyle: disabledStyle
          ? { ...nativeStyle, ...disabledStyle }
          : nativeStyle,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm",
          className,
        ),
      })}
    />
  );
}

const InputComponent = React.forwardRef(InputInner) as <
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
>(
  props: InputProps<T> & { ref?: React.ForwardedRef<InputRefObject> },
) => JSX.Element;

export const Input = Object.assign(InputComponent, { displayName: "Input" });
