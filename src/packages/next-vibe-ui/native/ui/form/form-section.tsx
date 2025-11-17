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

import { Span } from "../span";
import { Div } from "../div";
import { H2, H3, P } from "../typography";

// StyledView is kept for potential future use with dynamic styles
// const _StyledView = styled(View, { className: "style" });

export function FormFieldGroup({
  children,
  title,
  description,
  className = "",
}: FormFieldGroupProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Div className={`space-y-4 ${className}`}>
      {title && (
        <Div className="space-y-1">
          <H3 className="text-lg font-semibold">{t(title)}</H3>
          {description && (
            <P className="text-sm text-muted-foreground">{t(description)}</P>
          )}
        </Div>
      )}
      <Div className="space-y-6">{children}</Div>
    </Div>
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
    <Div className={`space-y-6 ${className}`}>
      <Div className="space-y-2">
        <Div className="flex items-center justify-between">
          <H2 className="text-2xl font-bold">{t(title)}</H2>
          {completionStatus && (
            <Div className="flex items-center gap-2">
              <Span className="text-sm text-muted-foreground">
                {completionStatus.completedFields} of{" "}
                {completionStatus.totalFields} fields
              </Span>
              <Div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <Div
                  className={`h-full bg-primary transition-all duration-300 w-[${completionStatus.completionPercentage}%]`}
                />
              </Div>
            </Div>
          )}
        </Div>
        {description && (
          <P className="text-muted-foreground">{t(description)}</P>
        )}
      </Div>
      {children}
    </Div>
  );
}
