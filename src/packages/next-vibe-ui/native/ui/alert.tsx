import { useTheme } from "@react-navigation/native";
import { cva } from "class-variance-authority";
import * as React from "react";
import { View } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";

import type {
  AlertDescriptionProps,
  AlertProps,
  AlertTitleProps,
  AlertVariant,
} from "@/packages/next-vibe-ui/web/ui/alert";
import { Span } from "./span";

// Re-export types for consistency
export type {
  AlertDescriptionProps,
  AlertProps,
  AlertTitleProps,
  AlertVariant,
};

const StyledView = styled(View, { className: "style" });

const alertVariants = cva(
  "relative bg-background w-full rounded-lg border border-border p-4 shadow shadow-foreground/10",
  {
    variants: {
      variant: {
        default: "",
        destructive: "border-destructive",
        success: "border-green-500/50",
        warning: "border-yellow-500/50",
      } satisfies Record<AlertVariant, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  children,
  icon: Icon,
  iconSize = 16,
}: AlertProps): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <StyledView
      role="alert"
      className={cn(alertVariants({ variant }), className)}
    >
      {Icon && (
        <StyledView className="absolute left-3.5 top-4 -translate-y-0.5">
          <Icon
            size={iconSize}
            color={
              variant === "destructive" ? colors.notification : colors.text
            }
          />
        </StyledView>
      )}
      {children}
    </StyledView>
  );
}
Alert.displayName = "Alert";

function AlertTitle({
  className,
  children,
}: AlertTitleProps): React.JSX.Element {
  return (
    <Span
      className={cn(
        "pl-7 mb-1 font-medium text-base leading-none tracking-tight text-foreground",
        className,
      )}
    >
      {children}
    </Span>
  );
}
AlertTitle.displayName = "AlertTitle";

function AlertDescription({
  className,
  children,
}: AlertDescriptionProps): React.JSX.Element {
  return (
    <Span
      className={cn("pl-7 text-sm leading-relaxed text-foreground", className)}
    >
      {children}
    </Span>
  );
}
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle, alertVariants };
