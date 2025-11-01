import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import type { MessageResponseType } from "next-vibe/shared/types/response.schema";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";

import { useTranslation } from "@/i18n/core/client";

import { Alert, AlertDescription, AlertTitle } from "../alert";

export interface FormAlertState {
  variant: "default" | "destructive" | "success" | "warning";
  title: MessageResponseType;
  message: MessageResponseType;
}

export interface FormAlertProps {
  alert: FormAlertState | null;
  className?: string;
}

/**
 * Central alert component for forms with consistent styling and icons
 * Provides proper dark mode support and semantic variants
 *
 * Can be used with either:
 * 1. New alert prop from useEndpoint: <FormAlert alert={endpoint.alert} />
 * 2. Legacy individual props: <FormAlert variant="success" title="..." message="..." />
 */
export function FormAlert({
  alert,
  className,
}: FormAlertProps): JSX.Element | null {
  const { t } = useTranslation();

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

  return (
    <Alert variant={alert.variant} icon={Icon} className={cn("my-4", className)}>
      {alert.title && (
        <AlertTitle>
          {t(alert.title.message, alert.title.messageParams)}
        </AlertTitle>
      )}
      {alert.message.message && (
        <AlertDescription>
          {t(alert.message.message, alert.message.messageParams)}
        </AlertDescription>
      )}
    </Alert>
  );
}
