/**
 * Enhanced Form Field Component
 * Reusable form field with required field highlighting and validation
 */

"use client";

import type { JSX, ReactNode } from "react";
import type { StyleType } from "../../utils/style-type";

import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";


/**
 * Form Field Group Component
 * Groups multiple form fields with consistent spacing
 */

export type FormFieldGroupProps = {
  children: ReactNode;
  title?: TranslationKey;
  description?: TranslationKey;
} & StyleType;

export function FormFieldGroup({
  children,
  title,
  description,
  className,
  style,
}: FormFieldGroupProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={`space-y-4 ${className || ""}`} style={style}>
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

export type FormSectionProps = {
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
} & StyleType;

export function FormSection({
  children,
  title,
  description,
  completionStatus,
  className,
  style,
}: FormSectionProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={`space-y-6 ${className || ""}`} style={style}>
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
