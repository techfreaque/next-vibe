"use client";

import { Calendar, CheckCircle, Clock, Save, X } from "lucide-react";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";

import { useTranslation } from "@/i18n/core/client";

interface SubmitSectionProps {
  canSubmit: boolean;
  isSubmitting: boolean;
  isSuccess?: boolean;
  isUpdate?: boolean;
  hasChanges?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export function SubmitSection({
  canSubmit,
  isSubmitting,
  isSuccess = false,
  isUpdate = false,
  hasChanges = true,
  onSubmit,
  onCancel,
}: SubmitSectionProps): JSX.Element {
  const { t } = useTranslation();

  // For updates, only show submit button if there are changes
  const showSubmitButton = !isUpdate || hasChanges;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
      {/* Cancel Button */}
      <Button
        variant="outline"
        onClick={onCancel}
        className="px-6 py-3 h-12 border-2 hover:bg-muted/50 transition-all duration-200"
        disabled={isSubmitting}
      >
        <X className="h-4 w-4 mr-2" />
        {isUpdate ? t("common.actions.back") : t("common.cancel")}
      </Button>

      {/* Submit Button - Only show if not update or has changes */}
      {showSubmitButton && (
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting || isSuccess}
          className={`px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:shadow-md ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-primary bg-gradient-to-r from-primary to-primary/90 hover:bg-primary/90 hover:from-primary/90 hover:to-primary/80"
          }`}
        >
          {isSuccess ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              {isUpdate
                ? t("consultation.success.booked")
                : t("consultation.schedule.success")}
            </>
          ) : isSubmitting ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              {isUpdate
                ? t("onboarding.consultation.update.updating")
                : t("onboarding.consultation.schedule.scheduling")}
            </>
          ) : (
            <>
              {isUpdate ? (
                <Save className="h-4 w-4 mr-2" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              {isUpdate
                ? t("onboarding.consultation.update.updateButton")
                : t("onboarding.consultation.schedule.scheduleButton")}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
