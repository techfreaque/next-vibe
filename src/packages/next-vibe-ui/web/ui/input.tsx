import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

export interface InputChangeEvent {
  target: {
    value: string;
    name?: string;
    id?: string;
  };
  currentTarget?: {
    value?: string;
  };
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export interface InputFocusEvent {
  target?: {
    focus?: () => void;
    blur?: () => void;
    value?: string;
  };
  currentTarget?: {
    focus?: () => void;
    blur?: () => void;
  };
}

export interface InputKeyboardEvent {
  key: string;
  code?: string;
  preventDefault?: () => void;
  stopPropagation?: () => void;
  currentTarget?: {
    value?: string;
  };
}

export interface InputProps {
  className?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: string;
  autoCorrect?: string;
  spellCheck?: string;
  onChange?: (e: InputChangeEvent) => void;
  onChangeText?: (text: string) => void;
  onBlur?: ((e: InputFocusEvent) => void) | (() => void);
  onFocus?: ((e: InputFocusEvent) => void) | (() => void);
  onKeyPress?: (e: InputKeyboardEvent) => void;
  onKeyDown?: (e: InputKeyboardEvent) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  editable?: boolean;
  name?: string;
  id?: string;
  "aria-label"?: string;
  ref?: (node: { focus?: () => void; blur?: () => void; select?: () => void; value?: string } | null) => void;
}

function Input({
  className,
  type,
  value,
  defaultValue,
  placeholder,
  disabled,
  readOnly,
  required,
  min,
  max,
  step,
  autoComplete,
  autoCorrect: _autoCorrect,
  spellCheck,
  onChange,
  onChangeText,
  onBlur,
  onFocus,
  onKeyPress,
  onKeyDown,
  autoCapitalize: _autoCapitalize,
  secureTextEntry: _secureTextEntry,
  keyboardType: _keyboardType,
  editable: _editable,
  name,
  id,
  "aria-label": ariaLabel,
  ref,
}: InputProps): React.JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange?.({ target: { value: e.target.value } });
    onChangeText?.(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    if (typeof onBlur === "function") {
      onBlur({ target: e.target });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    if (typeof onFocus === "function") {
      onFocus({ target: e.target });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    onKeyPress?.({ key: e.key, preventDefault: () => e.preventDefault(), stopPropagation: () => e.stopPropagation() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    onKeyDown?.({ key: e.key, preventDefault: () => e.preventDefault(), stopPropagation: () => e.stopPropagation() });
  };

  return (
    <input
      ref={ref}
      type={type}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      min={min}
      max={max}
      step={step}
      autoComplete={autoComplete}
      spellCheck={spellCheck}
      name={name}
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onChange={handleChange}
      onBlur={onBlur ? handleBlur : undefined}
      onFocus={onFocus ? handleFocus : undefined}
      onKeyPress={onKeyPress ? handleKeyPress : undefined}
      onKeyDown={onKeyDown ? handleKeyDown : undefined}
    />
  );
}

export { Input };
