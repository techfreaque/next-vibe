import * as Slot from "@rn-primitives/slot";
import { cn } from "next-vibe/core/utils/utils";
import type { SlottableTextPropsWithClassName } from "next-vibe/ui/native/lib/types";
import { convertCSSToTextStyle } from "next-vibe/ui/native/utils/style-converter";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";
import { Text as RNText } from "react-native";

const TextClassContext = React.createContext<string | undefined>(undefined);

type TextProps = SlottableTextPropsWithClassName & {
  style?: React.CSSProperties;
};

function Text({
  className,
  style,
  asChild = false,
  ...props
}: TextProps): React.JSX.Element {
  const textClass = React.useContext(TextClassContext);
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  if (asChild) {
    return (
      <Slot.Text
        {...applyStyleType({
          nativeStyle,
          className: cn(
            "text-base text-foreground select-text",
            textClass,
            className,
          ),
        })}
        {...props}
      />
    );
  }
  return (
    <RNText
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "text-base text-foreground select-text",
          textClass,
          className,
        ),
      })}
      {...props}
    />
  );
}

export { Text, TextClassContext };
