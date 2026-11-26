"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div, type DivRefObject } from "next-vibe/ui/components/div";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { H1, H2, P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useWindowSize } from "next-vibe/ui/hooks/use-window-size";
import { canRetryRecordRead } from "next-vibe/unified-ui/_shared/admin-record-context";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

import { DocumentDraftLines } from "@/finance/document-draft-lines";
import invoiceDefinition from "@/payment/invoice/[invoiceId]/get/definition";
import { scopedTranslation as draftCopy } from "@/payment/invoice/create/i18n";
import { calculateInvoiceLine } from "@/payment/invoice/line/amounts";

import type definition from "./definition";

const selection = z.object({ id: z.uuid(), companyId: z.uuid().nullable() });

export function CreditNoteCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const inModal = navigation.current?.renderInModal === true;
  const { width } = useWindowSize();
  const [reviewing, setReviewing] = useState(false);
  const openRelated = useRelatedEntityNavigation();
  const submitting = useWidgetIsSubmitting();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { t: lineT } = draftCopy.scopedT(locale);
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const selectedInvoiceId = form.watch("invoiceId");
  const note = data?.creditNote;
  const editorRef = useRef<DivRefObject>(null);
  const invoiceId = note?.invoiceId ?? selectedInvoiceId;
  const companyId = form.watch("companyId");
  const items = form.watch("lineItems");
  const verify = interactive && Boolean(invoiceId);
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { invoiceId: invoiceId ?? "" },
        queryOptions: {
          enabled: verify,
          staleTime: 0,
          refetchOnMount: "always" as const,
          disableLocalCache: true,
          queryKey: `credit-source:${invoiceId}`,
        },
      },
    }),
    [invoiceId, verify],
  );
  const read = useEndpoint(invoiceDefinition, options, logger, user).read;
  const invoice =
    read?.response?.success && read.response.data.id === invoiceId
      ? read.response.data
      : undefined;
  useEffect(() => {
    if (invoice?.companyId && !companyId) {
      form.setValue("companyId", invoice.companyId, { shouldValidate: true });
    }
  }, [companyId, form, invoice?.companyId]);
  useEffect(() => {
    const editor = editorRef.current;
    if (!inModal || note?.id || !editor) {
      return undefined;
    }
    const keepFieldVisible = (event: Event): void => {
      const target = event.target;
      if (typeof Element === "undefined" || !(target instanceof Element)) {
        return;
      }
      // Keep the field label with its input as the editor scrolls.
      const focusedField =
        target.closest('[data-field="reason"]') ??
        target
          .closest("input[aria-label]")
          ?.parentElement?.closest(".flex-col");
      if (!focusedField) {
        return;
      }

      const viewport = editor.getBoundingClientRect();
      const bounds = focusedField.getBoundingClientRect();
      const gutter = 12;
      if (bounds.bottom > viewport.bottom - gutter) {
        editor.scrollTo({
          top: editor.scrollTop + bounds.bottom - viewport.bottom + gutter,
        });
      } else if (bounds.top < viewport.top + gutter) {
        editor.scrollTo({
          top: editor.scrollTop + bounds.top - viewport.top - gutter,
        });
      }
    };
    editor.addEventListener("focusin", keepFieldVisible);
    return (): void => editor.removeEventListener("focusin", keepFieldVisible);
  }, [inModal, note?.id]);
  const money = (amount: number | string): string =>
    invoice ? formatMoney(amount, invoice.currency, locale) : "";
  const readPending = verify && (read?.isLoading || read?.isFetching);
  const readFailure =
    verify && read?.response?.success === false ? read.response : undefined;
  const fetchFailed = verify && !readPending && (readFailure || read?.error);
  const retryRead =
    !readFailure || canRetryRecordRead(readFailure.errorType.errorCode);
  const originalReference = invoice?.invoiceNumber ?? undefined;
  const dismiss = !inModal && interactive && navigation.canGoBack && (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={submitting}
      onClick={() => navigation.pop()}
    >
      {t("post.widget.dismiss")}
    </Button>
  );
  const openDocument = (id: string): void => {
    openRelated(() => Promise.resolve(invoiceDefinition.GET), {
      urlPathParams: { invoiceId: id },
    });
  };
  if (note?.id) {
    const noteReference = note.invoiceNumber;
    return (
      <WidgetShell layout="page">
        <ResultBanner variant="success" title={t("post.widget.issued")}>
          <Div className="flex min-w-0 flex-col items-start gap-3 text-foreground">
            <P className="text-2xl font-semibold tabular-nums">
              {formatMoney(note.amount, note.currency, locale)}
            </P>
            {!interactive && noteReference && (
              <P className="font-semibold">{noteReference}</P>
            )}
            <P>{note.reason}</P>
            {interactive && (
              <Div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="h-auto min-h-10 whitespace-normal text-start"
                  onClick={() => openDocument(note.id)}
                >
                  {noteReference
                    ? t("post.widget.openNamedNote", {
                        reference: noteReference,
                      })
                    : t("post.widget.openNote")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto min-h-10 whitespace-normal text-start"
                  onClick={() => openDocument(note.invoiceId)}
                >
                  {originalReference
                    ? t("post.widget.openNamedSource", {
                        reference: originalReference,
                      })
                    : t("post.widget.openSource")}
                </Button>
              </Div>
            )}
          </Div>
        </ResultBanner>
      </WidgetShell>
    );
  }

  const choose = (): void => {
    void import("@/payment/invoice/list/definition").then(
      ({ default: list }) => {
        navigation.push(list.GET, {
          renderInModal: true,
          data: { companyId: companyId || undefined, selection: "credit" },
          pickerCallback: (value) => {
            const row = selection.safeParse(value);
            if (row.success) {
              form.setValue("invoiceId", row.data.id, { shouldDirty: true });
              form.setValue("companyId", row.data.companyId ?? "", {
                shouldDirty: true,
              });
              form.setValue("lineItems", undefined, { shouldDirty: true });
              setReviewing(false);
            }
          },
        });
        return undefined;
      },
    );
  };
  const remaining = invoice?.remainingCredit;
  const eligible =
    invoice &&
    invoice.companyId === companyId &&
    invoice.canCreateCreditNote &&
    remaining !== undefined;
  const full = items === undefined;
  const followsSteps = inModal && interactive && width < 640 && !full;
  const editingItems = followsSteps && !reviewing;
  const reviewingItems = followsSteps && reviewing;
  const changeStep = (review: boolean): void => {
    setReviewing(review);
    editorRef.current?.focus?.();
    editorRef.current?.scrollTo({ top: 0 });
  };
  const lineAmounts = (items ?? []).map(
    (line) =>
      calculateInvoiceLine(
        {
          ...line,
          unitPrice: Math.abs(line.unitPrice),
          taxRate: line.taxRate / 100,
        },
        invoice?.lineSettlement,
      ).lineTotal,
  );
  const credit = full
    ? Number(invoice?.amount)
    : Math.round(
        lineAmounts.reduce(
          (sum, amount) => sum + Math.round(amount * 10000),
          0,
        ) / 100,
      ) / 100;
  const validAmount =
    Number.isFinite(credit) &&
    credit > 0 &&
    remaining !== undefined &&
    credit <= remaining;
  const appendOriginal = (
    original: (typeof invoiceDefinition.GET.types.ResponseOutput)["lines"][number],
  ): void => {
    form.setValue(
      "lineItems",
      [
        ...(items ?? []),
        {
          description: original.description,
          quantity: original.quantity,
          unitPrice: original.unitPrice,
          taxRate: Math.round((original.taxRate ?? 0) * 1000000) / 10000,
        },
      ],
      { shouldDirty: true },
    );
  };
  return (
    <WidgetShell
      layout={inModal ? "compact" : "page"}
      padding="none"
      scroll={false}
      className={
        inModal
          ? "min-h-0 max-h-[calc(min(80dvh,100dvh_-_80px)_-_3rem)] gap-0 overflow-hidden"
          : undefined
      }
    >
      <Div className="flex max-w-3xl shrink-0 flex-col gap-2 border-b pb-3">
        {inModal ? (
          <Div className="flex items-start justify-between gap-2 pe-5">
            <H1 className="min-w-0 break-words text-lg font-semibold tracking-tight lg:text-lg">
              {t("post.title")}
            </H1>
          </Div>
        ) : (
          <WidgetHeader
            size="page"
            title={t("post.title")}
            subtitle={invoice ? undefined : t("post.description")}
            titleAccessory={dismiss}
            border={false}
          />
        )}
        <Div className="flex min-w-0 items-center justify-between gap-2">
          {invoice && (
            <Div className="min-w-0">
              <Span className="break-words text-sm font-semibold">
                {originalReference
                  ? t("post.widget.namedSource", {
                      reference: originalReference,
                    })
                  : t("post.widget.sourceInvoice")}
              </Span>
              {!inModal && (
                <P className="break-words text-sm text-muted-foreground">
                  {invoice.companyName}
                </P>
              )}
            </Div>
          )}
          {interactive && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-auto min-h-9 max-w-36 whitespace-normal text-start"
              onClick={choose}
            >
              {t(
                invoice
                  ? "post.widget.changeInvoice"
                  : "post.widget.chooseInvoice",
              )}
            </Button>
          )}
        </Div>
      </Div>
      <Div
        ref={editorRef}
        tabIndex={followsSteps ? -1 : undefined}
        onKeyDown={(event) => {
          if (
            editingItems &&
            event.key === "Enter" &&
            event.target.closest?.("input")
          ) {
            event.preventDefault();
          }
        }}
        className={
          inModal
            ? "flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto scroll-py-4 py-4 pe-1"
            : "flex max-w-3xl min-w-0 flex-col gap-4"
        }
      >
        {readPending && <LoadingBlock />}
        {fetchFailed && (
          <ResultBanner variant="warning" title={t("post.widget.readFailed")}>
            {retryRead && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void read?.refetch()}
              >
                {t("post.widget.retryRead")}
              </Button>
            )}
          </ResultBanner>
        )}
        {invoiceId && !eligible && !readPending && !fetchFailed && (
          <P>{t("post.widget.unavailable")}</P>
        )}
        {eligible && (
          <>
            <P className="font-medium">
              {t("post.widget.amountLabel", {
                label: t("post.widget.available"),
                amount: money(remaining),
              })}
            </P>
            {!reviewingItems && (
              <Div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={full ? "default" : "outline"}
                  disabled={remaining < Number(invoice.amount)}
                  onClick={() =>
                    form.setValue("lineItems", undefined, { shouldDirty: true })
                  }
                >
                  {t("post.widget.full")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={full ? "outline" : "default"}
                  onClick={() => {
                    if (full) {
                      form.setValue("lineItems", [], { shouldDirty: true });
                      changeStep(false);
                    }
                  }}
                >
                  {t("post.widget.partial")}
                </Button>
              </Div>
            )}
            {!full && !reviewingItems && (
              <>
                <Div className="flex flex-wrap gap-2">
                  {invoice.lines
                    .filter((line) => line.lineTotal > 0)
                    .map((line) => (
                      <Button
                        key={line.id}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => appendOriginal(line)}
                      >
                        {t("post.widget.amountLabel", {
                          label: line.description,
                          amount: money(line.lineTotal),
                        })}
                      </Button>
                    ))}
                </Div>
                <DocumentDraftLines
                  locale={locale}
                  maxLines={100}
                  labels={{
                    title: t("post.widget.partial"),
                    description: lineT("post.widget.item"),
                    quantity: lineT("post.widget.quantity"),
                    unitPrice: lineT("post.widget.unitPrice"),
                    taxRate: lineT("post.widget.taxRate"),
                    total: lineT("post.widget.lineTotal"),
                    add: lineT("post.widget.addItem"),
                    remove: lineT("post.widget.removeItem"),
                    empty: lineT("post.widget.itemsHint"),
                    invalid: lineT("post.widget.itemError"),
                  }}
                  rows={items.map((line, index) => ({
                    ...line,
                    id: String(index),
                    taxRate: line.taxRate / 100,
                    formattedTotal: Number.isFinite(lineAmounts[index])
                      ? money(lineAmounts[index])
                      : "",
                  }))}
                  onDescription={(index, value) =>
                    form.setValue(`lineItems.${index}.description`, value, {
                      shouldDirty: true,
                    })
                  }
                  onNumber={(index, key, value) =>
                    form.setValue(
                      `lineItems.${index}.${key}`,
                      key === "taxRate"
                        ? Math.round(value * 1_000_000) / 10_000
                        : value,
                      { shouldDirty: true },
                    )
                  }
                  onAdd={() =>
                    form.setValue(
                      "lineItems",
                      [
                        ...items,
                        {
                          description: "",
                          quantity: 1,
                          unitPrice: 0,
                          taxRate: 0,
                        },
                      ],
                      { shouldDirty: true },
                    )
                  }
                  onRemove={(index) =>
                    form.setValue("lineItems", items.toSpliced(index, 1), {
                      shouldDirty: true,
                    })
                  }
                />
              </>
            )}
            {reviewingItems && (
              <Div className="flex flex-col gap-2 rounded-md border p-3">
                <H2 className="border-0 pb-0 text-base font-semibold">
                  {t("post.widget.reviewStep")}
                </H2>
                {(items ?? []).map((line, index) => (
                  <Div
                    key={`${line.description}-${index}`}
                    className="flex min-w-0 justify-between gap-2 text-sm"
                  >
                    <Span className="min-w-0 break-words">
                      {line.description}
                    </Span>
                    <Span className="shrink-0 tabular-nums">
                      {Number.isFinite(lineAmounts[index])
                        ? money(lineAmounts[index])
                        : ""}
                    </Span>
                  </Div>
                ))}
              </Div>
            )}
            {!editingItems && (
              <TextareaFieldWidget
                fieldName="reason"
                field={withValue(field.children.reason, undefined, null)}
              />
            )}
            <FormAlertWidget field={{}} />
            {credit > remaining && (
              <P className="text-sm text-destructive">
                {t("post.errors.creditLimit")}
              </P>
            )}
          </>
        )}
        {!eligible && <FormAlertWidget field={{}} />}
      </Div>
      {eligible && (
        <Div className="flex max-w-3xl shrink-0 flex-wrap items-center justify-between gap-2 border-t pt-3">
          <Span className="font-semibold">
            {t("post.widget.amountLabel", {
              label: t("post.widget.creditTotal"),
              amount: Number.isFinite(credit) ? money(credit) : "",
            })}
          </Span>
          <Div className="flex flex-wrap gap-2">
            {reviewingItems && (
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => changeStep(false)}
              >
                {t("post.widget.backToItems")}
              </Button>
            )}
            {editingItems ? (
              <Button
                type="button"
                disabled={!validAmount || readPending}
                onClick={() => changeStep(true)}
              >
                {t("post.widget.reviewCredit")}
              </Button>
            ) : (
              validAmount &&
              !readPending && (
                <SubmitButtonWidget<typeof definition.POST>
                  field={{ text: "post.widget.issue" }}
                />
              )
            )}
          </Div>
        </Div>
      )}
    </WidgetShell>
  );
}
