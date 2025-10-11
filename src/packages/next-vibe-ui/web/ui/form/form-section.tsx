/**
 * Enhanced Form Field Component
 * Reusable form field with required field highlighting and validation
 */

"use client";

import { AlertCircle } from "lucide-react";
import type { JSX, ReactNode } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

/**
 * Form Field Group Component
 * Groups multiple form fields with consistent spacing
 */
interface FormFieldGroupProps {
  children: ReactNode;
  title?: TranslationKey;
  description?: TranslationKey;
  className?: string;
}

export function FormFieldGroup({
  children,
  title,
  description,
  className = "",
}: FormFieldGroupProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{t(title)}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{t(description)}</p>
          )}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
}

/**
 * Form Section Component
 * Wraps form content with consistent styling and completion status
 */
interface FormSectionProps {
  children: ReactNode;
  title: TranslationKey;
  description?: TranslationKey;
  completionStatus?: {
    isComplete: boolean;
    completedFields: number;
    totalFields: number;
    completionPercentage: number;
    missingRequiredFields: string[];
  };
  className?: string;
}

export function FormSection({
  children,
  title,
  description,
  completionStatus,
  className = "",
}: FormSectionProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t(title)}</h2>
          {completionStatus && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {completionStatus.completedFields} of{" "}
                {completionStatus.totalFields} fields
              </span>
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${completionStatus.completionPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground">{t(description)}</p>
        )}
        {(completionStatus?.missingRequiredFields?.length ?? 0) > 0 && (
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-4 w-4" />
            {t("businessInfo.form.requiredFields")}:{" "}
            {completionStatus?.missingRequiredFields?.join(", ")}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
