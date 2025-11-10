/**
 * Enhanced Form Field Component
 * Reusable form field with required field highlighting and validation
 * Native implementation aligned with web version interfaces
 */

"use client";

import type { JSX } from "react";

import { useTranslation } from "@/i18n/core/client";

import type {
  FormFieldGroupProps,
  FormSectionProps,
} from "../../../web/ui/form/form-section";

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
      </div>
      {children}
    </div>
  );
}
