/**
 * Number Input Component (React Native)
 * A number input with increment/decrement buttons
 */

import { Minus, Plus } from "lucide-react-native";

import { Button } from "./button";
import { Div } from "./div";
import { Input } from "./input";

// Import ALL types from web - ZERO definitions here
import type { NumberInputProps } from "@/packages/next-vibe-ui/web/ui/number-input";

export function NumberInput({
  value = 1,
  onChange,
  onBlur,
  min = 1,
  max = 10,
  step = 1,
  disabled = false,
  className,
  name: _name,
}: NumberInputProps): React.JSX.Element {
  const handleDecrement = (): void => {
    const newValue = Math.max(min, (value || min) - step);
    onChange?.(newValue);
  };

  const handleIncrement = (): void => {
    const newValue = Math.min(max, (value || min) + step);
    onChange?.(newValue);
  };

  const handleInputChange = (text: string): void => {
    if (text === "") {
      onChange?.(min);
      return;
    }
    const numValue = Number(text);
    if (!Number.isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange?.(clampedValue);
    }
  };

  return (
    <Div className={`flex flex-row items-center gap-3 ${className || ""}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={disabled || (value !== undefined && value <= min)}
      >
        <Minus size={16} />
      </Button>
      <Input
        keyboardType="numeric"
        value={String(value)}
        onChangeText={handleInputChange}
        onBlur={onBlur}
        editable={!disabled}
        className="text-center w-20"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={disabled || (value !== undefined && value >= max)}
      >
        <Plus size={16} />
      </Button>
    </Div>
  );
}
