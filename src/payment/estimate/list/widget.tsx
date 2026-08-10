"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { FilePlus } from "next-vibe/ui/components/icons/FilePlus";
import { FolderX } from "next-vibe/ui/components/icons/FolderX";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX } from "react";

import { EstimateStatus } from "@/payment/enum";

import type definition from "./definition";

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case EstimateStatus.ACCEPTED:
      return "default";
    case EstimateStatus.SENT:
      return "secondary";
    case EstimateStatus.DECLINED:
    case EstimateStatus.EXPIRED:
      return "destructive";
    default:
      return "outline";
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EstimateListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const onPick =
    usePickerCallback<
      NonNullable<
        (typeof definition.GET.types.ResponseOutput)["estimates"]
      >[number]
    >();
  const isPickerMode = !!onPick;

  const handleNewEstimate = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("@/payment/estimate/create/definition"),
        import("@/payment/estimate/[estimateId]/get/definition"),
      ]);
      navigate(createDef.default.POST, {
        renderInModal: true,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            estimateId: responseData.estimate.id,
          }),
        },
      });
    })();
  };

  const handleView =
    (estimateId: string) =>
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      if (isPickerMode) {
        const estimate = (data?.estimates ?? []).find(
          (est) => est.id === estimateId,
        );
        if (estimate && onPick) {
          onPick(estimate);
          pop();
        }
        return;
      }
      void (async (): Promise<void> => {
        const def =
          await import("@/payment/estimate/[estimateId]/get/definition");
        navigate(def.default.GET, { urlPathParams: { estimateId } });
      })();
    };

  const estimates = data?.estimates;

  return (
    <Div className="flex flex-col gap-4">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("widget.back")}
        </Button>
      )}

      <Div className="flex items-center justify-between">
        <H3 className="text-base font-semibold">
          {t("widget.title")}
          {data && (
            <Span className="ml-2 text-sm font-normal text-muted-foreground">
              ({data.total})
            </Span>
          )}
        </H3>
        {!isPickerMode && (
          <Button
            type="button"
            size="sm"
            onClick={handleNewEstimate}
            className="gap-1.5"
          >
            <FilePlus className="h-4 w-4" />
            {t("widget.newEstimate")}
          </Button>
        )}
      </Div>

      {!data && (
        <Div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <Span className="text-sm">{t("widget.loading")}</Span>
        </Div>
      )}

      {data && (!estimates || estimates.length === 0) && (
        <Div className="py-14 text-center border border-dashed rounded-md flex flex-col items-center gap-4">
          <FolderX className="h-8 w-8 text-muted-foreground" />
          <Div className="flex flex-col gap-1">
            <P className="text-sm font-medium">{t("widget.empty.title")}</P>
            <P className="text-xs text-muted-foreground">
              {t("widget.empty.hint")}
            </P>
          </Div>
          {!isPickerMode && (
            <Button type="button" size="sm" onClick={handleNewEstimate}>
              {t("widget.empty.cta")}
            </Button>
          )}
        </Div>
      )}

      {estimates && estimates.length > 0 && (
        <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
          {estimates.map((est) => (
            <Div
              key={est.id}
              className="flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={handleView(est.id)}
            >
              <Div className="flex flex-col gap-0.5 min-w-0">
                <Div className="flex items-center gap-2">
                  <Span className="font-mono text-sm font-semibold">
                    {est.estimateNumber}
                  </Span>
                  {est.customerName && (
                    <Span className="text-xs text-muted-foreground truncate">
                      {est.customerName}
                    </Span>
                  )}
                </Div>
                <Div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Span className="font-medium text-foreground">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: est.currency,
                    }).format(est.total)}
                  </Span>
                  <Span>
                    {est.lineCount}{" "}
                    {est.lineCount !== 1 ? t("widget.lines") : t("widget.line")}
                  </Span>
                  {est.validUntil && (
                    <Span>
                      {t("widget.valid")}{" "}
                      {new Date(est.validUntil).toLocaleDateString(locale)}
                    </Span>
                  )}
                </Div>
              </Div>

              <Div className="flex items-center gap-3 shrink-0">
                <Badge variant={getStatusVariant(est.status)}>
                  {est.status === EstimateStatus.DRAFT
                    ? t("widget.status.draft")
                    : est.status === EstimateStatus.SENT
                      ? t("widget.status.sent")
                      : est.status === EstimateStatus.ACCEPTED
                        ? t("widget.status.accepted")
                        : est.status === EstimateStatus.DECLINED
                          ? t("widget.status.declined")
                          : est.status === EstimateStatus.EXPIRED
                            ? t("widget.status.expired")
                            : t("widget.status.converted")}
                </Badge>
              </Div>
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
}
