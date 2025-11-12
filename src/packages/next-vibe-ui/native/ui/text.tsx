import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import { Text as RNText } from "react-native";

import { cn } from "../lib/utils";
import type { SlottableTextPropsWithClassName } from "../lib/types";

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  ...props
}: SlottableTextPropsWithClassName): React.JSX.Element {
  const textClass = React.useContext(TextClassContext);
  if (asChild) {
    return (
      <Slot.Text
        className={cn(
          "text-base text-foreground select-text",
          textClass,
          className,
        )}
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
      {...props}
    />
  );
}

export { Text, TextClassContext };
