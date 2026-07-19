"use client";

import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { convertCSSToTextStyle } from "../../native/utils/style-converter";
import type { SummaryProps } from "../../web/ui/summary";
import { DetailsContext } from "./details";

export function Summary({
  className,
  style,
  children,
  id,
}: SummaryProps): JSX.Element {
  const { toggle } = React.useContext(DetailsContext);
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <View nativeID={id}>
      <TouchableOpacity onPress={toggle}>
        <Text style={nativeStyle} className={cn(className)}>
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
