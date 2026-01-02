/**
 * Native Form Alert Component
 * Production-ready implementation aligned with web version interfaces
 * Imports types from web version using relative paths to ensure type safety
 */

import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react-native";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import { useTranslation } from "@/i18n/core/client";

// Import all public types from web version (web is source of truth)
import type { FormAlertProps } from "../../../web/ui/form/form-alert";
import { convertCSSToViewStyle } from "../../utils/style-converter";
import { Alert, AlertDescription, AlertTitle } from "../alert";

/**
 * Central alert component for forms with consistent styling and icons
 * Provides proper dark mode support and semantic variants
 *
 * Can be used with either:
 * 1. New alert prop from useEndpoint: <FormAlert alert={endpoint.alert} />
 * 2. Legacy individual props: <FormAlert variant="success" title="..." message="..." />
 */
export function FormAlert({ alert, className, style }: FormAlertProps): JSX.Element | null {
  const { t } = useTranslation();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Use alert prop if provided, otherwise fall back to legacy props

  // Don't render if no alert data or content is provided
  if (!alert || (!alert.title && !alert.message)) {
    return null;
  }

  const getIcon = ():
    | typeof AlertCircle
    | typeof CheckCircle
    | typeof AlertTriangle
    | typeof Info => {
    switch (alert.variant) {
      case "destructive":
        return AlertCircle;
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const Icon = getIcon();

  // Note: style prop is not passed to Alert due to StyleType discriminated union
  // Alert uses className for styling via NativeWind (either style OR className, not both)
  void nativeStyle; // Acknowledge nativeStyle is intentionally unused for Alert
  return (
    <Alert variant={alert.variant} icon={Icon} className={cn("my-4", className)}>
      {alert.title && <AlertTitle>{t(alert.title.message, alert.title.messageParams)}</AlertTitle>}
      {alert.message.message && (
        <AlertDescription>{t(alert.message.message, alert.message.messageParams)}</AlertDescription>
      )}
    </Alert>
  );
}
