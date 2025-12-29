"use client";

import { Alert, AlertDescription } from "next-vibe-ui/ui/alert";
import type { JSX } from "react";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { WidgetType } from "../../../shared/types/enums";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { getTranslator } from "../../../shared/widgets/utils/field-helpers";

/**
 * Displays alert messages with configurable variants.
 * Value should be a translation key string.
 */
export function AlertWidget<const TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.ALERT, TKey>): JSX.Element | null {
  const { t } = getTranslator(context);
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
