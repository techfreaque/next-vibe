/**
 * PasswordStrength Widget - Ink implementation
 * Displays password strength indicator with colored bar
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import type { FieldUsageConfig, InkWidgetProps } from "../../_shared/cli-types";
import { calculatePasswordStrength } from "./shared";
import type { PasswordStrengthWidgetConfig } from "./types";

export function PasswordStrengthWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  PasswordStrengthWidgetConfig<TUsage, "widget", TEndpoint>
>): JSX.Element | null {
  const { t } = context;
  const { watchField } = field;

  // Get password value from form
  const password = context.form?.getValue<string>(watchField);

  if (!password) {
    return null;
  }

  // Calculate strength
  const { level, widthPercentage } = calculatePasswordStrength(password);

  // Get color for CLI
  const color =
    level === "weak"
      ? "red"
      : level === "fair"
        ? "yellow"
        : level === "good"
          ? "yellow"
          : "green";

  const labelText = t(
    `app.user.components.auth.common.passwordStrength.${level}`,
  );

  // Create simple bar using characters
  const barLength = 20;
  const filledLength = Math.round((widthPercentage / 100) * barLength);
  const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength);

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box justifyContent="space-between">
        <Text>
          {t("app.user.components.auth.common.passwordStrength.label")}:
        </Text>
        <Text color={color}>{labelText}</Text>
      </Box>
      <Box>
        <Text color={color}>{bar}</Text>
      </Box>
      {level === "weak" && (
        <Box marginTop={0}>
          <Text color="red" dimColor>
            {t("app.user.components.auth.common.passwordStrength.suggestion")}
          </Text>
        </Box>
      )}
    </Box>
  );
}
