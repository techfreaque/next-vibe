import type { PressableStateCallbackType } from "react-native";

// Native-specific utility for checking if children are text
export function isTextChildren(
  children: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode),
): boolean {
  return Array.isArray(children)
    ? children.every((child) => typeof child === "string")
    : typeof children === "string";
}
