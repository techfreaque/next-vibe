"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CoaJournalPostWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleViewList = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  if (data?.posted !== undefined) {
    return (
      <Div className="flex flex-col gap-4">
        <Div className="flex items-center gap-3 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
          <Span className="text-sm font-medium flex-1">
            {t("journalPost.success.description")}
          </Span>
          <Badge
            variant={data.posted ? "default" : "destructive"}
            className={`text-xs shrink-0 ${data.posted ? "bg-emerald-600 hover:bg-emerald-600 dark:bg-emerald-700" : ""}`}
          >
            {t("enums.journalEntryStatus.POSTED")}
          </Badge>
        </Div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleViewList}
        >
          {t("journalPost.widget.backButton")}
        </Button>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("journalPost.widget.back")}
        </Button>
      )}

      <Span className="text-base font-semibold">{t("journalPost.title")}</Span>
      <Span className="text-sm text-muted-foreground">
        {t("journalPost.description")}
      </Span>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
