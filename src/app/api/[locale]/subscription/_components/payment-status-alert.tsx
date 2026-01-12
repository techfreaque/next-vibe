import { Alert, AlertDescription, AlertTitle } from "next-vibe-ui/ui/alert";
import { Button } from "next-vibe-ui/ui/button";
import { AlertCircle, CheckCircle, X } from "next-vibe-ui/ui/icons";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";

import { useTranslation } from "@/i18n/core/client";

interface PaymentStatusAlertProps {
  showAlert: boolean;
  alertType: "success" | "error";
  alertMessage: string;
  onClose: () => void;
}

export function PaymentStatusAlert({
  showAlert,
  alertType,
  alertMessage,
  onClose,
}: PaymentStatusAlertProps): JSX.Element | null {
  const { t } = useTranslation();

  if (!showAlert) {
    return null;
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Alert
        variant={alertType === "success" ? "success" : "destructive"}
        className="relative"
      >
        {alertType === "success" ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <AlertTitle>
          {alertType === "success"
            ? t("app.subscription.subscription.payment.success.title")
            : t("app.subscription.subscription.payment.canceled.title")}
        </AlertTitle>
        <AlertDescription>{alertMessage}</AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </MotionDiv>
  );
}
