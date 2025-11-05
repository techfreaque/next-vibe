import * as React from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import { Span } from "./span";
import { TextClassContext } from "./text";

// Import all public types from web version (web is source of truth)
import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "@/packages/next-vibe-ui/web/ui/card";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

function Card({ className, children }: CardProps): React.JSX.Element {
  return (
    <StyledView
      className={cn(
        "rounded-lg border border-border bg-card shadow-sm shadow-foreground/10",
        className,
      )}
    >
      {children}
    </StyledView>
  );
}
Card.displayName = "Card";

function CardHeader({
  className,
  children,
}: CardHeaderProps): React.JSX.Element {
  return (
    <StyledView className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </StyledView>
  );
}
CardHeader.displayName = "CardHeader";

function CardTitle({ className, children }: CardTitleProps): React.JSX.Element {
  return (
    <Span
      className={cn(
        "text-2xl text-card-foreground font-semibold leading-none tracking-tight",
        className,
      )}
    >
      {children}
    </Span>
  );
}
CardTitle.displayName = "CardTitle";

function CardDescription({
  className,
  children,
}: CardDescriptionProps): React.JSX.Element {
  return (
    <Span className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </Span>
  );
}
CardDescription.displayName = "CardDescription";

function CardContent({
  className,
  children,
}: CardContentProps): React.JSX.Element {
  return (
    <TextClassContext.Provider value="text-card-foreground">
      <StyledView className={cn("p-6 pt-0", className)}>{children}</StyledView>
    </TextClassContext.Provider>
  );
}
CardContent.displayName = "CardContent";

function CardFooter({
  className,
  children,
}: CardFooterProps): React.JSX.Element {
  return (
    <StyledView
      className={cn("flex flex-row items-center p-6 pt-0", className)}
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
