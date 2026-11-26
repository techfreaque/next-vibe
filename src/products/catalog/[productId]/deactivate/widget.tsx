"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "next-vibe/ui/components/alert";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
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
export function CatalogProductDeactivateWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const { pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const result = data?.result;
  const back = canGoBack ? (
    <Button type="button" variant="ghost" size="sm" onClick={() => pop()}>
      <ChevronLeft className="size-4" aria-hidden="true" />
      {t("post.widget.back")}
    </Button>
  ) : undefined;

  return (
    <WidgetShell layout="page">
      <WidgetHeader size="page" title={t("post.title")} backButton={back} />
      <Div className="flex max-w-2xl flex-col gap-4">
        {result !== undefined ? (
          <Alert variant="success">
            <AlertTitle>{t("post.success.title")}</AlertTitle>
            <AlertDescription>{t("post.success.description")}</AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert variant="warning">
              <AlertDescription>{t("post.widget.warning")}</AlertDescription>
            </Alert>
            <FormAlertWidget field={{}} />
            <Div className="flex flex-wrap items-center justify-end gap-2">
              {canGoBack && (
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-10"
                  onClick={() => pop()}
                >
                  {t("post.widget.cancel")}
                </Button>
              )}
              <SubmitButtonWidget<typeof definition.POST>
                field={{}}
                variant="destructive"
              />
            </Div>
          </>
        )}
        {result !== undefined && canGoBack && (
          <Button
            type="button"
            variant="outline"
            className="min-h-10 self-start"
            onClick={() => pop()}
          >
            {t("post.widget.backToList")}
          </Button>
        )}
      </Div>
    </WidgetShell>
  );
}
