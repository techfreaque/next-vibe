import type { TextRef, ViewRef } from "@rn-primitives/types";
import * as React from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

import { cn } from "../lib/utils";
import { Span } from "./span";
import { TextClassContext } from "./text";

// Cross-platform types for native - import from web
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "next-vibe-ui/ui/card";

import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "next-vibe-ui/ui/card";

// Type-safe View with className support (NativeWind)
const StyledView = View as unknown as React.ForwardRefExoticComponent<
  ViewProps & { className?: string } & React.RefAttributes<View>
>;

const Card = React.forwardRef<ViewRef, CardProps>(
  ({ className, children, ...props }, ref) => (
    <StyledView
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-card shadow-sm shadow-foreground/10",
        className,
      )}
    >
      {children}
    </StyledView>
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<ViewRef, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <StyledView
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
    >
      {children}
    </StyledView>
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<TextRef, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <Span
      ref={ref}
      className={cn(
        "text-2xl text-card-foreground font-semibold leading-none tracking-tight",
        className,
      )}
    >
      {children}
    </Span>
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<TextRef, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <Span
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
    >
      {children}
    </Span>
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<ViewRef, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <TextClassContext.Provider value="text-card-foreground">
      <StyledView ref={ref} className={cn("p-6 pt-0", className)}>
        {children}
      </StyledView>
    </TextClassContext.Provider>
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<ViewRef, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <StyledView
      ref={ref}
      className={cn("flex flex-row items-center p-6 pt-0", className)}
    >
      {children}
    </StyledView>
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
