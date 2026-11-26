"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { P } from "next-vibe/ui/components/typography";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TaxRateDeleteWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const done = data?.deleted !== undefined;

  const handleBack = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  return (
    <AdminForm
      title={t("rate.delete.widget.confirmTitle")}
      secondaryActions={
        !done && navigation.canGoBack ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            type="button"
          >
            {t("rate.delete.widget.cancelButton")}
          </Button>
        ) : undefined
      }
      primaryAction={
        done ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "rate.delete.widget.confirmButton",
              variant: "destructive",
            }}
          />
        )
      }
    >
      {done ? (
        <ResultBanner
          variant="success"
          title={t("rate.delete.success.title")}
          message={t("rate.delete.success.description")}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
          >
            {t("rate.delete.widget.backToList")}
          </Button>
        </ResultBanner>
      ) : (
        <Div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <P className="text-sm text-muted-foreground">
            {t("rate.delete.widget.confirmDescription")}
          </P>
        </Div>
      )}
    </AdminForm>
  );
}
