"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { Title } from "next-vibe-ui/ui/title";
import type { JSX } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import { extractTitleData } from "../../../shared/widgets/logic/title";
import type { ReactWidgetProps } from "../../../shared/widgets/types";

/**
 * Renders H1-H6 headings with optional subtitle and alignment.
 */
export function TitleWidget<const TKey extends string>({
  value,
  context,
  className,
}: ReactWidgetProps<typeof WidgetType.TITLE, TKey>): JSX.Element {
  const { t } = simpleT(context.locale);
  const data = extractTitleData(value);

  if (!data) {
    return (
      <Div className={cn("text-muted-foreground italic", className)}>
        {t("app.api.system.unifiedInterface.react.widgets.title.noData")}
      </Div>
    );
  }

  const { text, level, subtitle, align } = data;

  const alignmentClass = align
    ? {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      }[align]
    : "text-left";

  return (
    <Div className={cn("flex flex-col", alignmentClass, className)}>
      <Title level={level} className="leading-tight">
        {text}
      </Title>

      {subtitle && (
        <Span className="mt-2 text-base text-muted-foreground">{subtitle}</Span>
      )}
    </Div>
  );
}

TitleWidget.displayName = "TitleWidget";
