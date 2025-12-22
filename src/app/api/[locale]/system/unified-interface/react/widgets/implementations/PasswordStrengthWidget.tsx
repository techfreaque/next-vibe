"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

/**
 * Displays a visual indicator of password strength.
 * Watches the password form field and updates in real-time.
 */
export function PasswordStrengthWidget<TKey extends string>({
  field,
  context,
  className,
  form,
}: ReactWidgetProps<
  typeof WidgetType.PASSWORD_STRENGTH,
  TKey
>): JSX.Element | null {
  const { t } = simpleT(context.locale);
  const { watchField = "password" } = field.ui;

  const password = form?.watch(watchField) as string | undefined;

  if (!password) {
    return null;
  }

  let strength = 0;
  let color = "bg-red-500";
  let labelText = t("app.user.components.auth.common.passwordStrength.weak");

  if (password.length >= 8) {
    strength += 1;
  }
  if (password.length >= 10) {
    strength += 1;
  }

  if (/[A-Z]/.test(password)) {
    strength += 1;
  }
  if (/[0-9]/.test(password)) {
    strength += 1;
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1;
  }

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

  const widthPercentage = Math.max(20, Math.min(100, (strength / 5) * 100));

  return (
    <Div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <Div className="flex justify-between text-xs">
        <Span>
          {t("app.user.components.auth.common.passwordStrength.label")}
        </Span>
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

PasswordStrengthWidget.displayName = "PasswordStrengthWidget";
