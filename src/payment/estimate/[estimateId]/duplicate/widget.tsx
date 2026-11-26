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

import { useEstimateActionContext } from "../get/hooks";
import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EstimateDuplicateWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.POST>();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const estimateId = form.watch("estimateId");
  const newEstimateId = data?.newEstimateId;
  const { estimate, loading } = useEstimateActionContext(
    estimateId,
    interactive && !newEstimateId,
  );

  const openCopy = (): void => {
    if (!newEstimateId) {
      return;
    }
    void import("../get/definition").then((def) =>
      navigation.push(def.default.GET, {
        urlPathParams: { estimateId: newEstimateId },
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
        estimate
          ? {
              number: estimate.estimateNumber,
              party: estimate.customerName ?? estimate.customerEmail,
              amount: formatMoney(estimate.total, estimate.currency, locale),
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
        newEstimateId
          ? {
              title: t("post.success.title"),
              message: t("widget.created", {
                number: data?.estimateNumber ?? "",
              }),
              primary: interactive
                ? { label: t("widget.viewDuplicate"), onClick: openCopy }
                : undefined,
            }
          : null
      }
    />
  );
}
