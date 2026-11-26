"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
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
export function EstimateConvertToInvoiceWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const handleViewInvoice = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/payment/invoice/[invoiceId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { invoiceId: data?.invoiceId ?? "" },
      });
    })();
  };

  if (data?.invoiceId) {
    return (
      <ResultBanner
        variant="success"
        title={
          data.invoiceSequenceNumber
            ? t("widget.savedDraftNumber", {
                number: data.invoiceSequenceNumber,
              })
            : t("widget.savedDraft")
        }
        message={
          data.estimateNumber
            ? t("widget.convertedNumber", { number: data.estimateNumber })
            : t("widget.converted")
        }
      >
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleViewInvoice}
        >
          {t("widget.viewInvoice")}
        </Button>
      </ResultBanner>
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
          {t("widget.back")}
        </Button>
      )}

      <Div className="flex flex-col gap-2">
        <Span className="text-base font-semibold">{t("post.title")}</Span>
        <P className="text-sm text-muted-foreground">{t("post.description")}</P>
      </Div>

      <Div className="rounded-md border px-4 py-3 bg-muted/30">
        <P className="text-sm text-muted-foreground">
          {t("widget.convertNote")}
        </P>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "widget.submit" as const }}
      />
    </Div>
  );
}
