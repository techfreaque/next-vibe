"use client";

import type { JSX } from "react";
import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import type { TranslationKey } from "@/i18n/core/static-types";
import { simpleT } from "@/i18n/core/shared";
import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

/**
 * Displays alert messages with configurable variants.
 * Value should be a translation key string.
 */
export function AlertWidget({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.ALERT>): JSX.Element | null {
  const { t } = simpleT(context.locale);
  const { variant = "default" } = field.ui;

  let content: string | undefined;
  if (typeof value === "string") {
    content = t(value as TranslationKey);
  }

  if (!content) {
    return null;
  }

  return (
    <Alert variant={variant} className={className}>
      <AlertDescription>{content}</AlertDescription>
    </Alert>
  );
}

AlertWidget.displayName = "AlertWidget";
