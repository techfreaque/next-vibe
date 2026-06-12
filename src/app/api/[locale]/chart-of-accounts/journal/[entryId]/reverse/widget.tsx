"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe-ui/unified/form-fields/date-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function CoaJournalReverseWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleViewEntry = (entryId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { entryId },
      });
    })();
  };

  if (data?.reversalEntryId) {
    return (
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col gap-2 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("journalReverse.widget.reversalCreated")}
          </Span>
          <Span className="text-sm font-mono font-semibold text-muted-foreground mt-1">
            {data.reversalEntryNumber}
          </Span>
        </Div>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => {
            handleViewEntry(data.reversalEntryId);
          }}
        >
          {t("journalReverse.widget.viewReversalButton")}
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
          {t("journalReverse.widget.back")}
        </Button>
      )}

      <Span className="text-base font-semibold">
        {t("journalReverse.title")}
      </Span>
      <Span className="text-sm text-muted-foreground">
        {t("journalReverse.description")}
      </Span>

      <Div className="flex flex-col gap-3">
        <DateFieldWidget
          fieldName="reversalDate"
          field={withValue(field.children.reversalDate, undefined, null)}
        />
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
