"use client";

import { styled } from "nativewind";
import type { JSX } from "react";
import * as React from "react";
import type { ViewStyle } from "react-native";
import { View } from "react-native";

import type { DetailsProps } from "@/packages/next-vibe-ui/web/ui/details";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

const StyledView = styled(View, { className: "style" });

export function Details({
  className,
  style,
  children,
  id,
  open,
}: DetailsProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(open ?? false);
  const nativeStyle: ViewStyle | undefined = style
    ? convertCSSToViewStyle(style)
    : undefined;

  // Update isOpen when open prop changes
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  // For React Native, we render all children and pass isOpen state via context
  // Summary children can access this context to show/hide toggle icons
  const contextValue = React.useMemo(
    () => ({ isOpen, toggle: (): void => setIsOpen(!isOpen) }),
    [isOpen],
  );

  return (
    <DetailsContext.Provider value={contextValue}>
      <StyledView
        nativeID={id}
        {...applyStyleType({
          nativeStyle,
          className: className,
        })}
      >
        {isOpen ? children : React.Children.toArray(children)[0]}
      </StyledView>
    </DetailsContext.Provider>
  );
}

export const DetailsContext = React.createContext<{
  isOpen: boolean;
  toggle: () => void;
}>({
  isOpen: false,
  toggle: (): void => {
    // Default no-op
  },
});
