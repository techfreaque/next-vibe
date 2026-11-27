"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Send } from "next-vibe/ui/components/icons/Send";
import { ListItem } from "next-vibe/ui/components/list-item";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import definition from "./definition";

export function InvoiceDeliveryLogWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definition.GET>();
  const { push, pop, canGoBack } = useWidgetNavigation();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;

  const invoiceId = data?.deliveries[0]?.documentId;

  const openSend = (recipientEmail: string | null, isResend: boolean): void => {
    if (!invoiceId && !data) {
      return;
    }
    const targetId = invoiceId ?? "";
    if (!targetId) {
      return;
    }
    push(definition.POST, {
      urlPathParams: { invoiceId: targetId },
      renderInModal: true,
      data: {
        recipientEmail: recipientEmail ?? data.defaultRecipientEmail ?? "",
        recipientName: data.defaultRecipientName ?? undefined,
        isResend,
      },
    });
  };

  const backButton = canGoBack ? (
    <Button type="button" variant="ghost" size="sm" onClick={() => pop()}>
      <ChevronLeft className="h-4 w-4" />
      {t("pdf.back")}
    </Button>
  ) : undefined;

  const rows = (data?.deliveries ?? []).map((item) => {
    const statusPill = (
      <StatusPill
        status={item.status}
        variant={item.status === "sent" ? "success" : "danger"}
        label={
          item.status === "sent"
            ? item.isResend
              ? t("deliver.resendBadge")
              : t("deliver.statusSent")
            : t("deliver.statusFailed")
        }
      />
    );
    const resendButton = interactive ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => openSend(item.recipientEmail, true)}
      >
        <Send className="h-3.5 w-3.5" />
        {t("deliver.resendAction")}
      </Button>
    ) : undefined;
    return {
      id: item.id,
      cells: {
        sentAt: formatDocDate(item.sentAt, locale),
        recipient: item.recipientEmail,
        sender: item.senderEmail,
        attachment: item.attachmentFilename ?? "-",
        status: statusPill,
        action: resendButton,
      },
      item,
    };
  });

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("deliver.logTitle")}
        subtitle={data?.documentNumber ?? t("deliver.logDescription")}
        backButton={backButton}
      />
      <FormAlertWidget field={{}} />
      {rows.length > 0 ? (
        <RecordTable
          label={t("deliver.logTitle")}
          columns={[
            { id: "sentAt", label: t("deliver.sentAt") },
            { id: "recipient", label: t("deliver.recipientEmail") },
            { id: "sender", label: t("deliver.sender") },
            { id: "attachment", label: t("deliver.attachment") },
            { id: "status", label: t("deliver.status") },
            { id: "action", label: "" },
          ]}
          rows={rows.map(({ id, cells }) => ({ id, cells }))}
          compact={
            <Div className="flex flex-col gap-2">
              {rows.map(({ id, item }) => (
                <ListItem
                  key={id}
                  title={item.recipientEmail}
                  subtitle={`${formatDocDate(item.sentAt, locale)} · ${item.attachmentFilename ?? ""}`}
                  meta={
                    item.status === "sent"
                      ? t("deliver.statusSent")
                      : t("deliver.statusFailed")
                  }
                />
              ))}
            </Div>
          }
        />
      ) : (
        <EmptyBlock
          title={t("deliver.emptyLog")}
          message={t("deliver.emptyLogHint")}
        />
      )}
    </WidgetShell>
  );
}

export function InvoiceDeliverEmailWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const { pop, canGoBack } = useWidgetNavigation();

  const backButton = canGoBack ? (
    <Button type="button" variant="ghost" size="sm" onClick={() => pop()}>
      <ChevronLeft className="h-4 w-4" />
      {t("pdf.back")}
    </Button>
  ) : undefined;

  return (
    <AdminForm
      title={t("deliver.sendTitle")}
      description={t("deliver.sendDescription")}
      backButton={backButton}
      primaryAction={
        data ? null : (
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "deliver.sendAction" }}
          />
        )
      }
    >
      {data ? (
        <ResultBanner
          variant="success"
          title={t("deliver.sendSuccess")}
          message={`${data.delivery.recipientEmail} · ${data.delivery.attachmentFilename ?? ""}`}
        />
      ) : (
        <AdminFormSection title={t("deliver.sendTitle")}>
          <EmailFieldWidget
            fieldName="recipientEmail"
            field={field.children.recipientEmail}
          />
          <TextFieldWidget
            fieldName="recipientName"
            field={field.children.recipientName}
          />
          <TextareaFieldWidget
            fieldName="customMessage"
            field={field.children.customMessage}
          />
        </AdminFormSection>
      )}
    </AdminForm>
  );
}
