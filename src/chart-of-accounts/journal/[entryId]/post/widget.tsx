"use client";

import { Button } from "next-vibe/ui/components/button";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function CoaJournalPostWidget({
  field: { children },
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const showActions = interactive && !responseOnly;
  const entryId = form.watch("entryId");

  const handleViewList = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const viewEntry = (): void => {
    if (!entryId) {
      return;
    }
    void (async (): Promise<void> => {
      const mod = await import("../get/definition");
      navigation.push(mod.default.GET, { urlPathParams: { entryId } });
    })();
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("journalPost.title")}
        subtitle={data?.posted ? undefined : t("journalPost.description")}
        backButton={
          showActions &&
          navigation.canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigation.pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("journalPost.widget.back")}
            </Button>
          )
        }
        actions={
          showActions &&
          !data?.posted &&
          entryId && (
            <SubmitButtonWidget<typeof definition.POST>
              field={{ text: "journalPost.title" }}
            />
          )
        }
      />
      <FormAlertWidget field={{}} />
      {data?.posted && (
        <ResultBanner
          variant="success"
          title={t("enums.journalEntryStatus.POSTED")}
          message={t("journalPost.success.description")}
        >
          {showActions && (
            <>
              {entryId && (
                <Button type="button" size="sm" onClick={viewEntry}>
                  {t("journalCreate.widget.viewEntryButton")}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewList}
              >
                {t("journalPost.widget.backButton")}
              </Button>
            </>
          )}
        </ResultBanner>
      )}
      {showActions && !entryId && (
        <EntityPickerFieldWidget fieldName="entryId" field={children.entryId} />
      )}
    </WidgetShell>
  );
}
