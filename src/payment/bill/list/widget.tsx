"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Building } from "next-vibe/ui/components/icons/Building";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { FilePlus } from "next-vibe/ui/components/icons/FilePlus";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Receipt } from "next-vibe/ui/components/icons/Receipt";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { type JSX, useState } from "react";

import { BillStatus } from "@/payment/enum";

import type definition from "./definition";

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case BillStatus.PAID:
      return "default";
    case BillStatus.APPROVED:
    case BillStatus.RECEIVED:
      return "secondary";
    case BillStatus.DISPUTED:
      return "destructive";
    default:
      return "outline";
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BillListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const onPick =
    usePickerCallback<
      NonNullable<(typeof definition.GET.types.ResponseOutput)["bills"]>[number]
    >();
  const isPickerMode = !!onPick;

  const [companyName, setCompanyName] = useState<string | undefined>(undefined);

  const companyId = form?.watch("companyId") as string | undefined;
  const bills = companyId ? data?.bills : undefined;
  const resolvedData = companyId ? data : undefined;

  const handleSelectCompany = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("@/companies/list/definition");
      navigate(def.default.GET, {
        renderInModal: true,
        pickerCallback: (value) => {
          const picked = value as Record<string, string>;
          // oxlint-disable-next-line typescript/no-explicit-any
          form?.setValue("companyId" as any, picked["id"] ?? "");
          setCompanyName(picked["name"]);
        },
      });
    })();
  };

  const handleNewBill = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("@/payment/bill/create/definition"),
        import("@/payment/bill/[billId]/get/definition"),
      ]);
      navigate(createDef.default.POST, {
        renderInModal: true,
        data: companyId ? { companyId } : undefined,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            billId: responseData.id,
          }),
        },
      });
    })();
  };

  const handleView =
    (billId: string) =>
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      if (isPickerMode) {
        const bill = (data?.bills ?? []).find((b) => b.id === billId);
        if (bill && onPick) {
          onPick(bill);
          pop();
        }
        return;
      }
      void (async (): Promise<void> => {
        const def = await import("@/payment/bill/[billId]/get/definition");
        navigate(def.default.GET, { urlPathParams: { billId } });
      })();
    };

  // ── No company selected ──────────────────────────────────────────
  if (!companyId) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 py-6">
        {canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => pop()}
            className="self-start gap-1.5 mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("widget.back")}
          </Button>
        )}

        <Div className="flex flex-col items-center justify-center py-20 gap-6">
          <Div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Receipt className="h-8 w-8 text-primary" />
          </Div>
          <Div className="flex flex-col items-center gap-2 max-w-md text-center">
            <Span className="text-xl font-semibold">{t("widget.title")}</Span>
            <P className="text-sm text-muted-foreground leading-relaxed">
              {t("widget.empty.hint")}
            </P>
          </Div>
          <Button
            type="button"
            size="lg"
            onClick={handleSelectCompany}
            className="gap-2.5 px-6"
          >
            <Building className="h-5 w-5" />
            {t("widget.company.select")}
          </Button>
        </Div>
      </Div>
    );
  }

  // ── Company selected ─────────────────────────────────────────────
  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-6">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("widget.back")}
        </Button>
      )}

      {/* Header: company context + actions */}
      <Div className="flex flex-col gap-4">
        <Div className="flex items-center justify-between gap-3">
          <Span className="text-lg font-semibold">{t("widget.title")}</Span>
          {!isPickerMode && resolvedData && (
            <Button
              type="button"
              size="sm"
              onClick={handleNewBill}
              className="gap-1.5 shrink-0"
            >
              <FilePlus className="h-4 w-4" />
              {t("widget.newBill")}
            </Button>
          )}
        </Div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectCompany}
          className="self-start gap-2 font-normal max-w-64"
        >
          <Building className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Span className="truncate">
            {companyName ?? t("widget.company.selected")}
          </Span>
        </Button>
      </Div>

      {/* Loading */}
      {!resolvedData && (
        <Div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <Span className="text-sm">{t("widget.loading")}</Span>
        </Div>
      )}

      {/* Empty state */}
      {resolvedData && (!bills || bills.length === 0) && (
        <Div className="flex flex-col items-center justify-center py-16 gap-5">
          <Div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
            <Receipt className="h-7 w-7 text-muted-foreground" />
          </Div>
          <Div className="flex flex-col items-center gap-1.5 text-center">
            <Span className="text-sm font-medium">
              {t("widget.empty.title")}
            </Span>
            <P className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              {t("widget.empty.hint")}
            </P>
          </Div>
          {!isPickerMode && (
            <Button
              type="button"
              size="sm"
              onClick={handleNewBill}
              className="gap-1.5"
            >
              <FilePlus className="h-4 w-4" />
              {t("widget.empty.cta")}
            </Button>
          )}
        </Div>
      )}

      {/* Bill list */}
      {bills && bills.length > 0 && (
        <Div className="flex flex-col gap-3">
          <Div className="flex flex-col rounded-lg border overflow-hidden divide-y divide-border">
            {bills.map((bill) => {
              const isOverdue =
                (bill.status === BillStatus.DRAFT ||
                  bill.status === BillStatus.RECEIVED ||
                  bill.status === BillStatus.APPROVED) &&
                bill.dueDate !== null &&
                bill.dueDate !== undefined &&
                new Date(bill.dueDate) < new Date();

              return (
                <Div
                  key={bill.id}
                  className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={handleView(bill.id)}
                >
                  <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <Div className="flex items-center gap-2">
                      <Span className="text-sm font-semibold font-mono">
                        {bill.billNumber ?? "—"}
                      </Span>
                      <Span className="text-sm text-muted-foreground truncate">
                        {bill.supplierName}
                      </Span>
                    </Div>
                    <Div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {bill.dueDate && (
                        <Span>
                          {t("widget.due")}{" "}
                          {new Date(bill.dueDate).toLocaleDateString(locale)}
                        </Span>
                      )}
                      {isOverdue && (
                        <Span className="font-medium text-destructive">
                          {t("widget.overdue")}
                        </Span>
                      )}
                    </Div>
                  </Div>

                  <Div className="flex items-center gap-3 shrink-0">
                    <Span className="text-sm font-semibold font-mono tabular-nums">
                      {new Intl.NumberFormat(locale, {
                        style: "currency",
                        currency: bill.currency,
                      }).format(bill.billTotal)}
                    </Span>
                    <Badge
                      variant={statusVariant(bill.status)}
                      className="text-xs"
                    >
                      {t(bill.status)}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Div>
                </Div>
              );
            })}
          </Div>
        </Div>
      )}
    </Div>
  );
}
