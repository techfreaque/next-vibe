"use client";

import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { DocumentActionConfirm } from "@/finance/document-action-confirm";

import { useInvoiceActionContext } from "../get/hooks";
import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function InvoiceDuplicateWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.POST>();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const invoiceId = form.watch("invoiceId");
  const copyId = data?.invoice?.id;
  const { invoice, loading } = useInvoiceActionContext(
    invoiceId,
    interactive && !copyId,
  );

  const openCopy = (): void => {
    if (!copyId) {
      return;
    }
    void import("../get/definition").then((def) =>
      navigation.push(def.default.GET, {
        urlPathParams: { invoiceId: copyId },
      }),
    );
  };

  return (
    <DocumentActionConfirm
      title={t("post.title")}
      description={t("widget.duplicateNote")}
      backLabel={navigation.canGoBack ? t("widget.cancel") : t("widget.back")}
      closeLabel={t("widget.back")}
      onBack={navigation.canGoBack ? (): void => navigation.pop() : undefined}
      context={
        invoice
          ? {
              number: invoice.invoiceNumber ?? t("post.title"),
              party: invoice.customerName,
              amount: formatMoney(invoice.amount, invoice.currency, locale),
              amountLabel: t("widget.total"),
            }
          : null
      }
      loadingText={loading ? t("widget.loading") : null}
      alert={<FormAlertWidget field={{}} />}
      submit={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "widget.submit" as const }}
        />
      }
      success={
        copyId
          ? {
              title: t("widget.duplicated"),
              message: t("post.success.description"),
              primary: interactive
                ? { label: t("widget.viewDuplicate"), onClick: openCopy }
                : undefined,
            }
          : null
      }
    />
  );
}
