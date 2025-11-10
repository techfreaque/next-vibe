import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import { Text as RNText } from "react-native";

// Define refs inline to avoid module resolution issues
type TextRef = React.ElementRef<typeof RNText>;

import { cn } from "../lib/utils";
import type { SlottableTextPropsWithClassName } from "../lib/types";

const TextClassContext = React.createContext<string | undefined>(undefined);

const Text = React.forwardRef<TextRef, SlottableTextPropsWithClassName>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);
    if (asChild) {
      return (
        <Slot.Text
          className={cn(
            "text-base text-foreground select-text",
            textClass,
            className,
          )}
          ref={ref}
          {...props}
        />
      );
    }
    return (
      <RNText
        className={cn(
          "text-base text-foreground select-text",
          textClass,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

export { Text, TextClassContext };
