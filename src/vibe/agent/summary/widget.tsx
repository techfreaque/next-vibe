"use client";

import { P } from "next-vibe/ui/components/typography";
import { CategorySummaryPanel } from "next-vibe/unified-ui/_shared/category-summary-panel";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import type definitions from "./definition";

export function AiSummaryWidget(): JSX.Element {
  const response = useWidgetValue<typeof definitions.GET>();
  const t = useWidgetTranslation<typeof definitions.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const navigation = useWidgetNavigation();
  if (!response?.summary) {
    return (
      <>
        <FormAlertWidget field={{}} />
        <P className="text-sm text-muted-foreground">{t("loading")}</P>
      </>
    );
  }
  return (
    <CategorySummaryPanel
      summary={response.summary}
      locale={locale}
      translate={(key, args) => t(key, args)}
      sectionName={t("title")}
      attentionTitle={t("attention")}
      clearLabel={t("clear")}
      unavailable={t("unavailable")}
      recentTitle={t("recent")}
      onOpen={
        interactive
          ? (drill) => {
              void (async (): Promise<void> => {
                const { getEndpoint } =
                  await import("@/generated/endpoints/endpoint");
                const target = await getEndpoint(drill.alias);
                if (target) {
                  navigation.push(target, {
                    data: drill.args,
                    urlPathParams: drill.urlPathParams,
                  });
                }
              })();
            }
          : undefined
      }
    />
  );
}
