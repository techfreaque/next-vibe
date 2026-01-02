/**
 * Title Component for React Native
 * Provides semantic heading levels with responsive sizing
 */
import { cn } from "next-vibe/shared/utils/utils";
import type { TextStyle } from "react-native";
import { Text as RNText } from "react-native";

import type { TitleProps } from "../../web/ui/title";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToTextStyle } from "../utils/style-converter";

// Re-export types from web
export type { TitleProps };

/* eslint-disable i18next/no-literal-string -- CSS classNames */
// Native-specific size classes (override web's responsive classes)
export const sizeClasses: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-4xl text-5xl font-bold",
  2: "text-3xl text-4xl font-bold",
  3: "text-xl text-2xl font-semibold",
  4: "text-lg text-xl font-semibold",
  5: "text-base text-lg font-medium",
  6: "text-sm text-base font-medium",
};
/* eslint-enable i18next/no-literal-string */

export function Title({
  children,
  className = "",
  style,
  customSizeClassName,
  level,
}: TitleProps): React.JSX.Element {
  const levelKey = level as 1 | 2 | 3 | 4 | 5 | 6;
  const nativeStyle: TextStyle | undefined = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <RNText
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="heading"
      aria-level={level}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "leading-tight text-foreground",
          customSizeClassName ?? sizeClasses[levelKey],
          className,
        ),
      })}
    >
      {children}
    </RNText>
  );
}
