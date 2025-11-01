/**
 * Title Component for React Native
 * Provides semantic heading levels with responsive sizing
 */
import { Text as RNText } from "react-native";

import { cn } from "../lib/utils";
import type { TitleProps } from "../../web/ui/title";

// Re-export types from web
export type { TitleProps };

/* eslint-disable i18next/no-literal-string -- CSS classNames */
// Native-specific size classes (override web's responsive classes)
const sizeClasses: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-4xl native:text-5xl font-bold",
  2: "text-3xl native:text-4xl font-bold",
  3: "text-xl native:text-2xl font-semibold",
  4: "text-lg native:text-xl font-semibold",
  5: "text-base native:text-lg font-medium",
  6: "text-sm native:text-base font-medium",
};
/* eslint-enable i18next/no-literal-string */

export function Title({
  children,
  className = "",
  customSizeClassName,
  level,
}: TitleProps): React.JSX.Element {
  const levelKey = level as 1 | 2 | 3 | 4 | 5 | 6;
  return (
    <RNText
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="heading"
      aria-level={level}
      className={cn(
        "leading-tight text-foreground",
        customSizeClassName ?? sizeClasses[levelKey],
        className,
      )}
    >
      {children}
    </RNText>
  );
}
