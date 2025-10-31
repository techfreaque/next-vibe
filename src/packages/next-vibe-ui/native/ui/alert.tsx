import { useTheme } from "@react-navigation/native";
import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import type {
  AlertDescriptionProps,
  AlertProps,
  AlertTitleProps,
  AlertVariant,
} from "next-vibe-ui/ui/alert";
import { cn } from "../lib/utils";
import { Span } from "./span";
import { Text } from "./text";

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

// Native-specific extension: requires icon prop for visual consistency
interface NativeAlertProps extends AlertProps {
  icon: LucideIcon;
  iconSize?: number;
  iconClassName?: string;
}

const Alert = React.forwardRef<React.ElementRef<typeof View>, NativeAlertProps>(
  (
    { className, variant, children, icon: Icon, iconSize = 16 },
    ref,
  ) => {
    const { colors } = useTheme();
    return (
      <View
        ref={ref}
        role="alert"
        className={alertVariants({ variant, className })}
      >
        <View className="absolute left-3.5 top-4 -translate-y-0.5">
          <Icon
            size={iconSize}
            color={
              variant === "destructive" ? colors.notification : colors.text
            }
          />
        </View>
        {children}
      </View>
    );
  },
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  React.ElementRef<typeof Text>,
  AlertTitleProps
>(({ className, children }, ref) => (
  <Span
    ref={ref}
    className={cn(
      "pl-7 mb-1 font-medium text-base leading-none tracking-tight text-foreground",
      className,
    )}
  >
    {children}
  </Span>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  React.ElementRef<typeof Text>,
  AlertDescriptionProps
>(({ className, children }, ref) => (
  <Span
    ref={ref}
    className={cn("pl-7 text-sm leading-relaxed text-foreground", className)}
  >
    {children}
  </Span>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
