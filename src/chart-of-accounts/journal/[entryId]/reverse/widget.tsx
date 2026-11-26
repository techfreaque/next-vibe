"use client";

import { Button } from "next-vibe/ui/components/button";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function CoaJournalReverseWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.POST>();
  const entryId = form.watch("entryId");
  const t = useWidgetTranslation<typeof definition.POST>();
  const reversed = Boolean(data?.reversalEntryId);

  const handleViewEntry = (reversalEntryId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { entryId: reversalEntryId },
      });
    })();
  };

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("journalReverse.widget.back")}
    </Button>
  ) : undefined;

  return (
    <AdminForm
      title={t("journalReverse.title")}
      description={t("journalReverse.description")}
      backButton={backButton}
      primaryAction={
        reversed ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "journalReverse.title", variant: "destructive" }}
          />
        )
      }
    >
      {data?.reversalEntryId ? (
        <ResultBanner
          variant="success"
          title={t("journalReverse.widget.reversalCreated")}
          message={data.reversalEntryNumber}
        >
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
        </ResultBanner>
      ) : (
        <AdminFormSection title={t("journalReverse.title")}>
          {!entryId && (
            <EntityPickerFieldWidget
              fieldName="entryId"
              field={field.children.entryId}
            />
          )}
          <DateFieldWidget
            utcCalendarDay
            fieldName="reversalDate"
            field={withValue(field.children.reversalDate, undefined, null)}
          />
        </AdminFormSection>
      )}
    </AdminForm>
  );
}
