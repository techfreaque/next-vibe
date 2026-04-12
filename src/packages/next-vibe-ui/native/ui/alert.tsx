import { useTheme } from "@react-navigation/native";
import { cva } from "class-variance-authority";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View } from "react-native";

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
        default: "bg-card border-border",
        destructive:
          "border-destructive/50 bg-destructive/5 dark:bg-destructive/10",
        success: "border-success/50 bg-success/5 dark:bg-success/10",
        warning: "border-warning/50 bg-warning/5 dark:bg-warning/10",
        info: "border-info/50 bg-info/5 dark:bg-info/10",
      } satisfies Record<AlertVariant, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const variantTextColorMap: Record<AlertVariant, string> = {
  default: "text-card-foreground",
  destructive: "text-destructive",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
};

const AlertVariantContext = React.createContext<AlertVariant>("default");

function Alert({
  className,
  variant = "default",
  children,
  icon: Icon,
  iconSize = 16,
}: AlertProps): React.JSX.Element {
  const { colors } = useTheme();

  const iconColorForNative =
    variant === "destructive" ? colors.notification : colors.text;

  return (
    <AlertVariantContext.Provider value={variant}>
      <StyledView
        role="alert"
        className={cn(alertVariants({ variant }), className)}
      >
        {Icon && (
          <StyledView className="absolute left-3.5 top-4 -translate-y-0.5">
            <Icon size={iconSize} color={iconColorForNative} />
          </StyledView>
        )}
        {children}
      </StyledView>
    </AlertVariantContext.Provider>
  );
}
Alert.displayName = "Alert";

function AlertTitle({
  className,
  children,
}: AlertTitleProps): React.JSX.Element {
  const variant = React.useContext(AlertVariantContext);
  return (
    <Span
      className={cn(
        "pl-7 mb-1 font-medium text-base leading-none tracking-tight",
        variantTextColorMap[variant],
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
  const variant = React.useContext(AlertVariantContext);
  return (
    <Span
      className={cn(
        "pl-7 text-sm leading-relaxed",
        variantTextColorMap[variant],
        className,
      )}
    >
      {children}
    </Span>
  );
}
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle, alertVariants };
