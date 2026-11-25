"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ListItem } from "next-vibe/ui/components/list-item";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { BankPageHeader } from "../page-header";
import type definition from "./definition";

export function BankCandidatesWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { push } = useWidgetNavigation();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;

  if (!data) {
    return (
      <WidgetShell layout="page">
        <BankPageHeader
          title={t("candidates.title")}
          subtitle={t("candidates.description")}
        />
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={field.children.companyId}
        />
        <TextFieldWidget fieldName="lineId" field={field.children.lineId} />
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget<typeof definition.GET>
          field={{ text: "ui.review" }}
        />
      </WidgetShell>
    );
  }

  const { statementLine } = data;
  const selectCandidate = (journalLineId: string): void => {
    void (async (): Promise<void> => {
      const { default: match } = await import("../match/definition");
      push(match.POST, {
        renderInModal: false,
        popNavigationOnSuccess: 1,
        urlPathParams: { lineId: statementLine.id },
        data: { companyId: data.selectedCompanyId, journalLineId },
      });
    })();
  };
  const amount = formatMoney(
    statementLine.amount,
    statementLine.currency,
    locale,
  );
  const statementDate = formatDocDate(statementLine.bookedDate, locale);
  const rows = data.matches.map((row) => {
    const date = formatDocDate(row.journalDate, locale);
    const sameDay = date === statementDate;
    const dateCell = sameDay ? (
      <Div className="flex flex-col gap-1">
        <Span>{date}</Span>
        <Span className="text-xs font-medium text-success">
          {t("ui.sameDay")}
        </Span>
      </Div>
    ) : (
      date
    );
    const canOpen = interactive && data.canMatch;
    const onOpen = canOpen ? (): void => selectCandidate(row.id) : undefined;
    const matchButton = onOpen ? (
      <Button type="button" size="sm" variant="outline" onClick={onOpen}>
        {t("ui.matchRow")}
      </Button>
    ) : undefined;
    return {
      id: row.id,
      cells: {
        entryNumber: row.entryNumber,
        description: row.description,
        date: dateCell,
        amount,
        action: matchButton,
      },
      onOpen,
      date,
      sameDay,
    };
  });
  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t("candidates.title")}
        subtitle={t("candidates.description")}
      />
      <SectionGroup title={t("fields.line")}>
        <DetailGrid columns={3}>
          <DetailField
            label={t("fields.transactionId")}
            value={statementLine.transactionId}
          />
          <DetailField
            label={t("fields.bookedDate")}
            value={formatDocDate(statementLine.bookedDate, locale)}
          />
          <DetailField label={t("fields.amount")} value={amount} />
        </DetailGrid>
      </SectionGroup>
      <FormAlertWidget field={{}} />
      {data.matchedJournalLineId ? (
        <ResultBanner variant="success" title={t("ui.alreadyMatched")} />
      ) : rows.length === 0 ? (
        <EmptyBlock
          title={t("ui.noCandidates")}
          message={t("ui.noCandidatesHint")}
        />
      ) : (
        <RecordTable
          label={t("candidates.title")}
          columns={[
            { id: "entryNumber", label: t("fields.entryNumber") },
            { id: "description", label: t("fields.description") },
            { id: "date", label: t("fields.journalDate") },
            { id: "amount", label: t("fields.amount"), numeric: true },
            { id: "action", label: "" },
          ]}
          rows={rows.map(({ id, cells }) => ({ id, cells }))}
          compact={
            <Div className="flex flex-col gap-2">
              {rows.map((row) => (
                <ListItem
                  key={row.id}
                  title={row.cells.entryNumber}
                  subtitle={row.cells.description}
                  meta={`${row.date} · ${row.cells.amount}${row.sameDay ? ` · ${t("ui.sameDay")}` : ""}`}
                  onClick={row.onOpen}
                />
              ))}
            </Div>
          }
        />
      )}
    </WidgetShell>
  );
}
