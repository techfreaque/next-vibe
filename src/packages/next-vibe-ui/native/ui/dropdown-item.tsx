/**
 * DropdownItem Component for React Native
 * Reusable dropdown item with icon, label, and description
 */
import React, { useState } from "react";
import type { GestureResponderEvent } from "react-native";
import { Pressable, Text as RNText, View } from "react-native";

// Import ALL types from web - ZERO definitions here
import type { DropdownItemProps } from "@/packages/next-vibe-ui/web/ui/dropdown-item";

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

  const handlePress = (e?: GestureResponderEvent): void => {
    if (!disabled && onClick) {
      onClick(e as never);
    }
  };

  return (
    <Pressable
      onPressIn={() => !disabled && setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={handlePress}
      disabled={disabled}
      className={`w-full rounded-md px-3 py-2.5 ${
        shouldShowHighlight
          ? "border-2 border-blue-500/50 bg-blue-500/10"
          : "border-2 border-transparent active:bg-accent/50"
      } ${disabled ? "opacity-50" : ""} ${className}`}
    >
      <View className="flex flex-row items-center gap-3 w-full">
        {icon && (
          <View className="text-base w-6 h-6 flex items-center justify-center flex-shrink-0">
            {React.isValidElement(icon)
              ? icon
              : typeof icon === "function"
                ? React.createElement(
                    icon as React.ComponentType<{ className?: string }>,
                    { className: "w-6 h-6" },
                  )
                : null}
          </View>
        )}
        <View className="flex flex-col items-start flex-1">
          <RNText className="font-medium text-sm text-foreground">
            {label}
          </RNText>
          {description && (
            <RNText className="text-xs text-muted-foreground/80 leading-tight mt-0.5">
              {description}
            </RNText>
          )}
        </View>
      </View>
    </Pressable>
  );
}
