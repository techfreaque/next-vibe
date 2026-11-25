"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import candidatesDefinition from "../candidates/definition";
import { BankPageHeader } from "../page-header";
import type definition from "./definition";

export function BankMatchWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const form = useWidgetForm<typeof definition.POST>();
  const [lineId, journalLineId, companyId] = useWatch({
    control: form.control,
    name: ["lineId", "journalLineId", "companyId"],
  });
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const readEnabled =
    interactive &&
    !data &&
    z.uuid().safeParse(lineId).success &&
    z.uuid().safeParse(companyId).success;
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { lineId },
        initialState: { companyId },
        queryOptions: { enabled: readEnabled },
      },
    }),
    [companyId, lineId, readEnabled],
  );
  const candidateRead = useEndpoint(
    candidatesDefinition,
    options,
    logger,
    user,
  ).read;
  const loaded = candidateRead?.data;
  const review =
    !candidateRead?.isLoadingFresh &&
    loaded?.statementLine.id === lineId &&
    loaded?.selectedCompanyId === companyId
      ? loaded
      : undefined;
  const journal = review?.matches.find(({ id }) => id === journalLineId);

  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t("match.title")}
        subtitle={t("match.description")}
      />
      {data ? (
        <ResultBanner
          title={t("match.success")}
          variant="success"
          message={formatDocDate(data.matchedAt, locale)}
        />
      ) : (
        <>
          {!z.uuid().safeParse(companyId).success && (
            <EntityPickerFieldWidget
              fieldName="companyId"
              field={field.children.companyId}
            />
          )}
          {!z.uuid().safeParse(lineId).success && (
            <TextFieldWidget fieldName="lineId" field={field.children.lineId} />
          )}
          {!z.uuid().safeParse(journalLineId).success && (
            <TextFieldWidget
              fieldName="journalLineId"
              field={field.children.journalLineId}
            />
          )}
          {review && journal && (
            <DetailGrid columns={3}>
              <DetailField
                label={t("fields.transactionId")}
                value={review.statementLine.transactionId}
              />
              <DetailField
                label={t("fields.entryNumber")}
                value={journal.entryNumber}
              />
              <DetailField
                label={t("fields.amount")}
                value={formatMoney(
                  review.statementLine.amount,
                  review.statementLine.currency,
                  locale,
                )}
              />
              <DetailField
                label={t("fields.exactAmount")}
                value={`${review.statementLine.amount} ${review.statementLine.currency}`}
              />
            </DetailGrid>
          )}
          <P className="text-sm text-muted-foreground">{t("ui.confirmHint")}</P>
          <FormAlertWidget field={{}} />
          {interactive && onSubmit && (
            <Button
              type="button"
              className="self-end"
              disabled={isSubmitting || !journal || !review?.canMatch}
              onClick={() => {
                form.setValue("confirm", true);
                onSubmit();
              }}
            >
              {t("ui.matchAction")}
            </Button>
          )}
        </>
      )}
    </WidgetShell>
  );
}
