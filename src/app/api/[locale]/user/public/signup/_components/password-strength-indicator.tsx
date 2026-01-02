"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface PasswordStrengthIndicatorProps {
  password: string;
  locale: CountryLanguage;
}

export function PasswordStrengthIndicator({
  password,
  locale,
}: PasswordStrengthIndicatorProps): JSX.Element | null {
  const { t } = simpleT(locale);

  if (!password) {
    return null;
  }

  // Calculate password strength
  let strength = 0;
  let color = "bg-red-500";
  let labelText = t("app.user.components.auth.common.passwordStrength.weak");

  // Length check
  if (password.length >= 8) {
    strength += 1;
  }
  if (password.length >= 10) {
    strength += 1;
  }

  // Complexity checks
  if (/[A-Z]/.test(password)) {
    strength += 1;
  }
  if (/[0-9]/.test(password)) {
    strength += 1;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1;
  }

  // Determine color and label based on strength
  if (strength <= 2) {
    color = "bg-red-500";
    labelText = t("app.user.components.auth.common.passwordStrength.weak");
  } else if (strength <= 3) {
    color = "bg-orange-500";
    labelText = t("app.user.components.auth.common.passwordStrength.fair");
  } else if (strength <= 4) {
    color = "bg-yellow-500";
    labelText = t("app.user.components.auth.common.passwordStrength.good");
  } else {
    color = "bg-green-500";
    labelText = t("app.user.components.auth.common.passwordStrength.strong");
  }

  // Calculate width percentage (between 20% and 100%)
  const widthPercentage = Math.max(20, Math.min(100, (strength / 5) * 100));

  return (
    <Div className="mt-2 flex flex-col gap-1">
      <Div className="flex justify-between text-xs">
        <Span>{t("app.user.components.auth.common.passwordStrength.label")}</Span>
        <Span
          className={
            strength <= 2
              ? "text-red-500"
              : strength <= 3
                ? "text-orange-500"
                : strength <= 4
                  ? "text-yellow-500"
                  : "text-green-500"
          }
        >
          {labelText}
        </Span>
      </Div>
      <Div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <Div style={{ width: `${widthPercentage}%` }}>
          <Div className={`h-full ${color} transition-all duration-300`} />
        </Div>
      </Div>
      {strength <= 2 && (
        <P className="text-xs text-red-500 mt-1">
          {t("app.user.components.auth.common.passwordStrength.suggestion")}
        </P>
      )}
    </Div>
  );
}
