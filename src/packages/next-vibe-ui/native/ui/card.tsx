import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { Text as RNText,View } from "react-native";

import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from "@/packages/next-vibe-ui/web/ui/card";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToTextStyle,convertCSSToViewStyle } from "../utils/style-converter";
import { TextClassContext } from "./text";

const StyledView = styled(View, { className: "style" });
const StyledText = styled(RNText, { className: "style" });

function Card({ className, style, id, children }: CardProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      nativeID={id}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "rounded-lg border border-border bg-card shadow-sm shadow-foreground/10",
          className,
        ),
      })}
    >
      {children}
    </StyledView>
  );
}
Card.displayName = "Card";

function CardHeader({
  className,
  style,
  id,
  children,
}: CardHeaderProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      nativeID={id}
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-col gap-1.5 p-6", className),
      })}
    >
      {children}
    </StyledView>
  );
}
CardHeader.displayName = "CardHeader";

function CardTitle({ className, style, id, children }: CardTitleProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "text-2xl text-card-foreground font-semibold leading-none tracking-tight",
          className,
        ),
      })}
    >
      {children}
    </StyledText>
  );
}
CardTitle.displayName = "CardTitle";

function CardDescription({
  className,
  style,
  id,
  children,
}: CardDescriptionProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToTextStyle(style) : undefined;

  return (
    <StyledText
      nativeID={id}
      {...applyStyleType({
        nativeStyle,
        className: cn("text-sm text-muted-foreground", className),
      })}
    >
      {children}
    </StyledText>
  );
}
CardDescription.displayName = "CardDescription";

function CardContent({
  className,
  style,
  id,
  children,
}: CardContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <TextClassContext.Provider value="text-card-foreground">
      <StyledView
        nativeID={id}
        {...applyStyleType({
          nativeStyle,
          className: cn("p-6 pt-0", className),
        })}
      >
        {children}
      </StyledView>
    </TextClassContext.Provider>
  );
}
CardContent.displayName = "CardContent";

function CardFooter({
  className,
  style,
  id,
  children,
}: CardFooterProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      nativeID={id}
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-row items-center p-6 pt-0", className),
      })}
    >
      {children}
    </StyledView>
  );
}
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
