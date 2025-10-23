import type { PressableStateCallbackType } from "react-native";

// Re-export cn from shared utils for consistency
export { cn } from "next-vibe/shared/utils/utils";

// Native-specific utility for checking if children are text
export function isTextChildren(
  children:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode),
): boolean {
  return Array.isArray(children)
    ? children.every((child) => typeof child === "string")
    : typeof children === "string";
}
