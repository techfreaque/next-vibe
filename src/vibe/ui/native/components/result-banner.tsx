import { styled } from "nativewind";
import { View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";
import type { ResultBannerProps } from "../../web/components/result-banner";
import { Text } from "./text";

export type {
  ResultBannerProps,
  ResultBannerVariant,
} from "../../web/components/result-banner";

const StyledView = styled(View, { className: "style" });

const variantClasses: Record<string, string> = {
  success: "border-success/30 bg-success/10",
  danger: "border-destructive/30 bg-destructive/10",
  warning: "border-warning/30 bg-warning/10",
  info: "border-info/30 bg-info/10",
};

const titleClasses: Record<string, string> = {
  success: "text-success",
  danger: "text-destructive",
  warning: "text-warning",
  info: "text-info",
};

export function ResultBanner({
  variant,
  icon,
  title,
  message,
  children,
  className,
}: ResultBannerProps): React.JSX.Element {
  return (
    <StyledView
      className={cn(
        "rounded-lg border p-4 flex-row items-start gap-3",
        variantClasses[variant],
        className,
      )}
    >
      {icon ? <StyledView className="mt-0.5">{icon}</StyledView> : null}
      <StyledView className="flex-1 gap-1">
        <Text className={cn("text-sm font-medium", titleClasses[variant])}>
          {title}
        </Text>
        {message ? (
          <Text className={cn("text-xs", titleClasses[variant])}>
            {message}
          </Text>
        ) : null}
        {children ? (
          <StyledView className="flex-row gap-2 mt-1.5">{children}</StyledView>
        ) : null}
      </StyledView>
    </StyledView>
  );
}
ResultBanner.displayName = "ResultBanner";
