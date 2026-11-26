"use client";

import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import {
  DocumentActionConfirm,
  documentLineContext,
} from "@/finance/document-action-confirm";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function InvoiceLineRemoveWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const lineId = form.watch("lineId");
  const context = lineId ? documentLineContext.get(lineId) : undefined;

  return (
    <DocumentActionConfirm
      title={t("post.title")}
      description={t("post.form.description")}
      backLabel={navigation.canGoBack ? t("widget.cancel") : t("widget.back")}
      closeLabel={t("widget.back")}
      onBack={navigation.canGoBack ? (): void => navigation.pop() : undefined}
      context={
        context ? { ...context, amountLabel: t("widget.lineTotal") } : null
      }
      note={{ tone: "danger", text: t("widget.warning") }}
      alert={<FormAlertWidget field={{}} />}
      submit={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "widget.submit" as const, variant: "destructive" }}
        />
      }
      success={data?.success === true ? { title: t("widget.removed") } : null}
    />
  );
}
