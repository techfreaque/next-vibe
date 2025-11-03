/**
 * Number Input Component (React Native)
 * A number input with increment/decrement buttons
 */

import { Minus, Plus } from "lucide-react-native";

import { Button } from "./button";
import { Div } from "./div";
import { Input } from "./input";

export interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  name?: string;
}

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
      <Div className={`flex-row items-center gap-3 ${className || ""}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
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
          disabled={disabled || value >= max}
        >
          <Plus size={16} />
        </Button>
      </Div>
    );
}

NumberInput.displayName = "NumberInput";

