"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { FilePlus } from "next-vibe/ui/web/ui/icons/FilePlus";
import { FolderX } from "next-vibe/ui/web/ui/icons/FolderX";
import { Loader2 } from "next-vibe/ui/web/ui/icons/Loader2";
import { Span } from "next-vibe/ui/web/ui/span";
import { H3, P } from "next-vibe/ui/web/ui/typography";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { InvoiceStatus } from "@/app/api/[locale]/payment/enum";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function InvoiceListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const onPick =
    usePickerCallback<
      NonNullable<
        (typeof definition.GET.types.ResponseOutput)["invoices"]
      >[number]
    >();
  const isPickerMode = !!onPick;

  const handleNewInvoice = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("@/app/api/[locale]/payment/invoice/create/definition"),
        import("@/app/api/[locale]/payment/invoice/[invoiceId]/get/definition"),
      ]);
      navigate(createDef.default.POST, {
        renderInModal: true,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            invoiceId: responseData.invoice.id,
          }),
        },
      });
    })();
  };

  const handleView =
    (invoiceId: string) =>
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      if (isPickerMode) {
        const inv = (data?.invoices ?? []).find((i) => i.id === invoiceId);
        if (inv && onPick) {
          onPick(inv);
          pop();
        }
        return;
      }
      void (async (): Promise<void> => {
        const def =
          await import("@/app/api/[locale]/payment/invoice/[invoiceId]/get/definition");
        navigate(def.default.GET, { urlPathParams: { invoiceId } });
      })();
    };

  const invoices = data?.invoices;

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
            onClick={handleNewInvoice}
            className="gap-1.5"
          >
            <FilePlus className="h-4 w-4" />
            {t("widget.newInvoice")}
          </Button>
        )}
      </Div>

      {!data && (
        <Div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <Span className="text-sm">{t("widget.loading")}</Span>
        </Div>
      )}

      {data && (!invoices || invoices.length === 0) && (
        <Div className="py-14 text-center border border-dashed rounded-md flex flex-col items-center gap-4">
          <FolderX className="h-8 w-8 text-muted-foreground" />
          <Div className="flex flex-col gap-1">
            <P className="text-sm font-medium">{t("widget.empty.title")}</P>
            <P className="text-xs text-muted-foreground">
              {t("widget.empty.hint")}
            </P>
          </Div>
          {!isPickerMode && (
            <Button type="button" size="sm" onClick={handleNewInvoice}>
              {t("widget.empty.cta")}
            </Button>
          )}
        </Div>
      )}

      {invoices && invoices.length > 0 && (
        <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
          {invoices.map((inv) => (
            <Div
              key={inv.id}
              className="flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={handleView(inv.id)}
            >
              <Div className="flex flex-col gap-0.5 min-w-0">
                <Div className="flex items-center gap-2">
                  <Span className="font-mono text-sm font-semibold">
                    #{inv.invoiceSequenceNumber ?? "—"}
                  </Span>
                  {inv.isOverdue && (
                    <Span className="text-xs font-medium text-destructive">
                      {t("widget.overdue")}
                    </Span>
                  )}
                </Div>
                <Div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Span className="font-medium text-foreground">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: inv.currency,
                    }).format(parseFloat(inv.amount))}
                  </Span>
                  {inv.dueDate && (
                    <Span>
                      {t("widget.due")}{" "}
                      {new Date(inv.dueDate).toLocaleDateString(locale)}
                    </Span>
                  )}
                  <Span>
                    {inv.lineCount}{" "}
                    {inv.lineCount !== 1 ? t("widget.lines") : t("widget.line")}
                  </Span>
                </Div>
              </Div>

              <Div className="flex items-center gap-3 shrink-0">
                <Badge
                  variant={
                    inv.status === InvoiceStatus.PAID
                      ? "default"
                      : inv.status === InvoiceStatus.OPEN
                        ? "secondary"
                        : inv.status === InvoiceStatus.UNCOLLECTIBLE
                          ? "destructive"
                          : "outline"
                  }
                  className={
                    inv.status === InvoiceStatus.VOID
                      ? "line-through text-muted-foreground"
                      : inv.status === InvoiceStatus.OPEN && inv.isOverdue
                        ? "border-destructive text-destructive"
                        : ""
                  }
                >
                  {inv.status === InvoiceStatus.DRAFT
                    ? t("widget.status.draft")
                    : inv.status === InvoiceStatus.OPEN
                      ? t("widget.status.open")
                      : inv.status === InvoiceStatus.PAID
                        ? t("widget.status.paid")
                        : inv.status === InvoiceStatus.VOID
                          ? t("widget.status.void")
                          : t("widget.status.uncollectible")}
                </Badge>
              </Div>
            </Div>
          ))}
        </Div>
      )}
    </Div>
  );
}
