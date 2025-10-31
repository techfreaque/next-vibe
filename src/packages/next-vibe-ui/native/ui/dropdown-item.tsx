/**
 * DropdownItem Component for React Native
 * Reusable dropdown item with icon, label, and description
 */
import React, { useState } from "react";
import type { GestureResponderEvent } from "react-native";
import { Text as RNText, View } from "react-native";

import { Button } from "./button";

/**
 * Props for the DropdownItem component
 */
export interface DropdownItemProps {
  /** Whether this dropdown item is currently selected/active */
  isSelected?: boolean;
  /** Click handler for the dropdown item */
  onClick?: (e?: GestureResponderEvent) => void;
  /** Icon component to display */
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  /** Display label */
  label: string;
  /** Optional description text */
  description?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional className for customization */
  className?: string;
}

export function DropdownItem({
  isSelected = false,
  onClick,
  icon,
  label,
  description,
  disabled = false,
  className = "",
}: DropdownItemProps): React.JSX.Element {
  const [isPressed, setIsPressed] = useState(false);
  const shouldShowHighlight = isSelected || isPressed;

  const handlePressIn = (): void => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handlePressOut = (): void => {
    setIsPressed(false);
  };

  const handlePress = (_e: GestureResponderEvent): void => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant={shouldShowHighlight ? "default" : "ghost"}
      size="sm"
      className={`w-full justify-start font-medium rounded-md px-3 py-2.5 min-h-fit h-auto ${
        shouldShowHighlight
          ? "border-2 border-blue-500/50 bg-blue-500/10"
          : "border-2 border-transparent active:bg-accent/50"
      } ${className}`}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
    >
      <View className="flex flex-row items-center gap-3 w-full">
        {icon && (
          <View className="w-6 h-6 flex items-center justify-center shrink-0">
            {React.isValidElement(icon) ? (
              icon
            ) : typeof icon === "string" ? (
              <RNText style={{ fontSize: 16 }}>{icon}</RNText>
            ) : (
              React.createElement(
                icon as React.ComponentType<{ className?: string }>,
                { className: "w-6 h-6 size-6" },
              )
            )}
          </View>
        )}
        <View className="flex flex-col items-start flex-1 min-w-0">
          <RNText style={{ fontWeight: "500", fontSize: 14 }} className="w-full">
            {label}
          </RNText>
          {description && (
            <RNText
              style={{ fontSize: 12, lineHeight: 16, marginTop: 2 }}
              className="w-full"
            >
              {description}
            </RNText>
          )}
        </View>
      </View>
    </Button>
  );
}
