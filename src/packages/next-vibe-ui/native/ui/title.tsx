/**
 * Title Component for React Native
 * Provides semantic heading levels with responsive sizing
 */
import type { ReactNode } from "react";
import { Text as RNText } from "react-native";

import { cn } from "../lib/utils";

interface TitleProps {
  children: ReactNode;
  className?: string;
  customSizeClassName?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

/* eslint-disable i18next/no-literal-string -- CSS classNames */
const sizeClasses = {
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
  return (
    <RNText
      role="heading"
      aria-level={level}
      className={cn(
        "leading-tight text-foreground",
        customSizeClassName || sizeClasses[level],
        className,
      )}
    >
      {children}
    </RNText>
  );
}
