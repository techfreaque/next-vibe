"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";

import {
  useWidgetForm,
  useWidgetLocale,
} from "../../../../system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { scopedTranslation } from "./i18n";
import { calculatePasswordStrength } from "./calculate-password-strenght";

/**
 * Displays a visual indicator of password strength.
 */
export function PasswordStrengthIndicator(): React.JSX.Element | null {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const form = useWidgetForm();
  // Watch password value for strength indicator
  const password = form?.watch("password") || "";

  if (!password) {
    return null;
  }

  // Use shared logic for strength calculation
  const { level, widthPercentage, missing } =
    calculatePasswordStrength(password);

  // Get colors based on level
  const colorClass =
    level === "weak"
      ? "bg-red-500"
      : level === "fair"
        ? "bg-orange-500"
        : level === "good"
          ? "bg-yellow-500"
          : "bg-green-500";

  const textColorClass =
    level === "weak"
      ? "text-red-500"
      : level === "fair"
        ? "text-orange-500"
        : level === "good"
          ? "text-yellow-500"
          : "text-green-500";

  const levelKey =
    level === "weak"
      ? "passwordStrength.weak"
      : level === "fair"
        ? "passwordStrength.fair"
        : level === "good"
          ? "passwordStrength.good"
          : "passwordStrength.strong";

  const labelText = t(levelKey);

  return (
    <Div className="flex flex-col gap-2">
      <Div className="flex justify-between items-center text-sm">
        <Span className="font-medium">{t("passwordStrength.label")}</Span>
        <Span className={cn("font-semibold", textColorClass)}>{labelText}</Span>
      </Div>
      <Div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <Div
          style={{
            width: `${widthPercentage}%`,
            height: "100%",
            transitionProperty: "all",
            transitionDuration: "300ms",
            backgroundColor: colorClass,
          }}
        />
      </Div>
      {level !== "strong" && (
        <Div className="flex flex-col gap-1 text-sm mt-1 text-muted-foreground">
          {missing.minLength && (
            <Div className="flex items-center gap-2">
              <Span className="text-red-500">
                {t("passwordStrength.requirement.minLength.icon")}
              </Span>
              <Span>{t("passwordStrength.requirement.minLength.text")}</Span>
            </Div>
          )}
          {missing.uppercase && (
            <Div className="flex items-center gap-2">
              <Span className="text-red-500">
                {t("passwordStrength.requirement.uppercase.icon")}
              </Span>
              <Span>{t("passwordStrength.requirement.uppercase.text")}</Span>
            </Div>
          )}
          {missing.lowercase && (
            <Div className="flex items-center gap-2">
              <Span className="text-red-500">
                {t("passwordStrength.requirement.lowercase.icon")}
              </Span>
              <Span>{t("passwordStrength.requirement.lowercase.text")}</Span>
            </Div>
          )}
          {missing.number && (
            <Div className="flex items-center gap-2">
              <Span className="text-red-500">
                {t("passwordStrength.requirement.number.icon")}
              </Span>
              <Span>{t("passwordStrength.requirement.number.text")}</Span>
            </Div>
          )}
          {missing.special && (
            <Div className="flex items-center gap-2">
              <Span className="text-yellow-500">
                {t("passwordStrength.requirement.special.icon")}
              </Span>
              <Span>{t("passwordStrength.requirement.special.text")}</Span>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}

PasswordStrengthIndicator.displayName = "PasswordStrengthIndicator";

export default PasswordStrengthIndicator;
