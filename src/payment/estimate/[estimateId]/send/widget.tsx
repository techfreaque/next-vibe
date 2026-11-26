"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { P } from "next-vibe/ui/components/typography";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EstimateSendWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const sent = data?.success === true;

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("widget.back")}
    </Button>
  ) : undefined;

  return (
    <AdminForm
      title={t("post.title")}
      description={t("post.description")}
      backButton={backButton}
      primaryAction={
        sent ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "widget.submit" }}
          />
        )
      }
    >
      {sent ? (
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={t("widget.sent")}
        >
          {navigation.canGoBack && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigation.pop()}
            >
              {t("widget.back")}
            </Button>
          )}
        </ResultBanner>
      ) : (
        <Div className="rounded-lg border bg-muted/30 px-4 py-3">
          <P className="text-sm text-muted-foreground">
            {t("widget.sendNote")}
          </P>
        </Div>
      )}
    </AdminForm>
  );
}
