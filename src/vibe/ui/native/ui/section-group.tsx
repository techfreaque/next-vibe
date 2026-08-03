"use client";

import { styled } from "nativewind";
import { cn } from "../../../unified-ui/_shared/cn";
import * as React from "react";
import { Pressable, View } from "react-native";

import { styledNative } from "../utils/style-converter";
import type { SectionGroupProps } from "../../web/ui/section-group";
import { Text } from "./text";

export type { SectionGroupProps } from "../../web/ui/section-group";

const StyledView = styled(View, { className: "style" });
const StyledPressable = styledNative(Pressable);

export function SectionGroup({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultOpen = true,
  className,
}: SectionGroupProps): React.JSX.Element {
  const [open, setOpen] = React.useState(defaultOpen);

  const Header = collapsible ? StyledPressable : StyledView;

  return (
    <StyledView
      className={cn("rounded-lg border border-border bg-card", className)}
    >
      <Header
        className={cn(
          "flex-row items-center gap-2 px-4 py-3",
          open && children ? "border-b border-border" : "",
        )}
        {...(collapsible ? { onPress: () => setOpen((prev) => !prev) } : {})}
      >
        <StyledView className="flex-1 flex-row items-center gap-2">
          <Text className="text-sm font-semibold flex-1">{title}</Text>
          {typeof subtitle === "string" ? (
            <Text className="text-xs text-muted-foreground">{subtitle}</Text>
          ) : subtitle ? (
            <StyledView>{subtitle}</StyledView>
          ) : null}
        </StyledView>
        {collapsible ? (
          <Text className="text-xs text-muted-foreground">
            {open ? "\u25BC" : "\u25B6"}
          </Text>
        ) : null}
      </Header>
      {(!collapsible || open) && children ? (
        <StyledView className="p-4">{children}</StyledView>
      ) : null}
    </StyledView>
  );
}
SectionGroup.displayName = "SectionGroup";
