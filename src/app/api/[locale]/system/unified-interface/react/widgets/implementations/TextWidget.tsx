"use client";

import type { Route } from "next";
import Link from "next/link";
import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { TranslationKey } from "@/i18n/core/static-types";

import { FieldDataType, type WidgetType } from "../../../shared/types/enums";
import {
  extractTextData,
  formatText,
} from "../../../shared/widgets/logic/text";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import { getTranslator } from "../../../shared/widgets/utils/field-helpers";
import { getTextFormatClassName } from "../../../shared/widgets/utils/widget-helpers";

function formatDate(value: string | Date, locale: string): string {
  try {
    const date = typeof value === "string" ? new Date(value) : value;
    if (isNaN(date.getTime())) {
      return String(value);
    }
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return String(value);
  }
}

/**
 * Displays text data with optional label, formatting, and link support.
 */
export function TextWidget<TKey extends string>({
  value,
  field,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.TEXT, TKey>): JSX.Element {
  const { t } = getTranslator(context);
  const {
    fieldType,
    label: labelKey,
    format,
    href,
    content,
    textAlign,
  } = field.ui;
  const label = labelKey ? t(labelKey as TranslationKey) : undefined;

  // Text alignment classes
  const alignmentClass =
    textAlign === "center"
      ? "text-center"
      : textAlign === "right"
        ? "text-right"
        : "";

  // Handle format="link" with href from field.ui config
  if (format === "link" && href && content) {
    const linkText = t(content as TranslationKey);
    // Prepend locale to href if it doesn't start with http
    const localizedHref = href.startsWith("http")
      ? href
      : `/${context.locale}${href.startsWith("/") ? "" : "/"}${href}`;

    return (
      <Div className={cn("py-2", alignmentClass, className)}>
        <Link
          href={localizedHref as Route}
          className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
        >
          {linkText}
        </Link>
      </Div>
    );
  }

  const renderTextValue = (): JSX.Element => {
    if (fieldType === FieldDataType.DATETIME && value) {
      const dateValue =
        typeof value === "string" || value instanceof Date
          ? value
          : String(value);
      const formattedDate = formatDate(dateValue, context.locale);
      return <Span className="font-mono text-sm">{formattedDate}</Span>;
    }

    if (fieldType === FieldDataType.DATE && value) {
      try {
        const date =
          typeof value === "string"
            ? new Date(value)
            : value instanceof Date
              ? value
              : new Date(String(value));
        if (!isNaN(date.getTime())) {
          const formattedDate = new Intl.DateTimeFormat(context.locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(date);
          return <Span className="font-mono text-sm">{formattedDate}</Span>;
        }
      } catch {
        // Fall through to regular text handling
      }
    }

    const data = extractTextData(value);

    // No data - show empty placeholder
    if (!data) {
      return <Span className="text-muted-foreground">—</Span>;
    }

    const { text, truncate, format: dataFormat } = data;
    const displayText = formatText(text, truncate);
    const normalizedFormat = dataFormat === "plain" ? "normal" : dataFormat;
    const formatClassName = getTextFormatClassName(normalizedFormat);

    return <Span className={formatClassName}>{displayText}</Span>;
  };

  if (label) {
    return (
      <Div className={cn("flex flex-col gap-1.5", alignmentClass, className)}>
        <Label className="text-sm font-medium">{label}</Label>
        {renderTextValue()}
      </Div>
    );
  }

  return (
    <Div className={cn(alignmentClass, className)}>{renderTextValue()}</Div>
  );
}

TextWidget.displayName = "TextWidget";
