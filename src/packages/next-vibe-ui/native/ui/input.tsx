import { TextInput } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import type { InputProps as WebInputProps } from "@/packages/next-vibe-ui/web/ui/input";

const StyledTextInput = styled(TextInput, { className: "style" });

export function Input({
  className,
  type: _type,
  onChange: _onChange,
  onBlur: _onBlur,
  onFocus: _onFocus,
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
  name: _name,
  id: _id,
  "aria-label": _ariaLabel,
  ref: _ref,
  min: _min,
  max: _max,
  step: _step,
  maxLength,
  accept: _accept,
}: WebInputProps): React.JSX.Element {
  const stringValue: string | undefined =
    value !== undefined ? String(value) : undefined;
  const stringDefaultValue: string | undefined =
    defaultValue !== undefined ? String(defaultValue) : undefined;

  return (
    <StyledTextInput
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm",
        disabled && "opacity-50",
        className,
      )}
      placeholderClassName="text-muted-foreground"
      value={stringValue}
      defaultValue={stringDefaultValue}
      placeholder={placeholder}
      onChangeText={onChangeText}
      editable={editable ?? (!disabled && !readOnly)}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect === "on"}
      maxLength={maxLength}
      scrollEnabled={false}
    />
  );
}
