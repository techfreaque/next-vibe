"use client";

import { cn } from "next-vibe/shared/utils/utils";
import type { JSX } from "react";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import type { SummaryProps } from "@/packages/next-vibe-ui/web/ui/summary";

import { convertCSSToTextStyle } from "../utils/style-converter";
import { DetailsContext } from "./details";

export function Summary({ className, style, children, id }: SummaryProps): JSX.Element {
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
