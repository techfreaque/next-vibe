"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { Input } from "next-vibe/ui/components/input";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";

import { useToolCompanyId } from "@/companies/_shared/workspace-company-context";
import companyDefinition from "@/companies/[companyId]/get/definition";
import { DocumentScopePicker } from "@/finance/document-list-ui";

import accountDefinition from "../../account/list/definition";
import { LineType, type LineTypeValue, PeriodStatus } from "../../enum";
import periodDefinition from "../../period/list/definition";
import { accountingCalendarDay } from "../../shared/calendar-date";
import { formatJournalCurrency } from "../../shared/journal-presentation";
import {
  accountingDay,
  journalAmountUnits,
  journalLineType,
} from "../../shared/journal-validation";
import type definition from "./definition";

export function CoaJournalCreateWidget({
  field: { children },
}: {
  field: typeof definition.POST.fields;
}): JSX.Element | null {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale().replace(/-GLOBAL$/, "");
  const form = useWidgetForm<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const disabled = useWidgetDisabled();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const editing = interactive && !responseOnly && !data?.id;
  const lineEditor = useFieldArray({ control: form.control, name: "lines" });
  const lines = form.watch("lines") ?? [];
  const toolCompanyId = useToolCompanyId();
  const companyId = form.watch("companyId");
  const [fixedCompanyId] = useState(() => companyId);
  const periodId = form.watch("periodId");
  const pickedDate = form.watch("date");
  const [amountEdits, setAmountEdits] = useState<Record<string, string>>({});
  const enabled = editing && !!companyId;

  const companyOptions = useMemo(
    () => ({
      read: { urlPathParams: { companyId }, queryOptions: { enabled } },
    }),
    [companyId, enabled],
  );
  const periodOptions = useMemo(
    () => ({
      read: {
        initialState: { companyId, status: PeriodStatus.OPEN },
        queryOptions: { enabled },
      },
    }),
    [companyId, enabled],
  );
  const accountOptions = useMemo(
    () => ({
      read: {
        initialState: { companyId, postableOnly: true, pageSize: 200 },
        queryOptions: { enabled },
      },
    }),
    [companyId, enabled],
  );
  const company = useEndpoint(companyDefinition, companyOptions, logger, user)
    .read?.data;
  const periodRows = useEndpoint(periodDefinition, periodOptions, logger, user)
    .read?.data?.periods;
  const periods = useMemo(
    () => periodRows?.filter((period) => period.companyId === companyId),
    [companyId, periodRows],
  );
  const accounts = useEndpoint(
    accountDefinition,
    accountOptions,
    logger,
    user,
  ).read?.data?.accounts.filter((account) => account.companyId === companyId);
  const currency =
    company && company.id === companyId
      ? (company?.currency ?? "EUR")
      : undefined;
  const activePeriod = periods?.find((period) => period.id === periodId);
  const dateStart = activePeriod
    ? accountingDay(new Date(activePeriod.startDate))
    : undefined;
  const dateEnd = activePeriod
    ? accountingDay(new Date(activePeriod.endDate))
    : undefined;
  const selectedCalendarDay =
    pickedDate === undefined ? undefined : accountingCalendarDay(pickedDate);
  const dateInPeriod = Boolean(
    selectedCalendarDay &&
    dateStart &&
    dateEnd &&
    selectedCalendarDay >= dateStart &&
    selectedCalendarDay <= dateEnd,
  );

  useEffect(() => {
    if (!editing || !periods?.length) {
      return;
    }
    const today = accountingDay(new Date());
    const target =
      activePeriod ??
      periods.find(
        (period) =>
          accountingDay(new Date(period.startDate)) <= today &&
          accountingDay(new Date(period.endDate)) >= today,
      ) ??
      periods.find(
        (period) => accountingDay(new Date(period.endDate)) < today,
      ) ??
      periods.at(-1);
    if (!target) {
      return;
    }
    if (periodId !== target.id) {
      form.setValue("periodId", target.id, { shouldValidate: true });
    }
    const start = accountingDay(new Date(target.startDate));
    const end = accountingDay(new Date(target.endDate));
    const date = form.getValues("date");
    const selectedDay =
      date === undefined ? undefined : accountingCalendarDay(date);
    if (!selectedDay || !(selectedDay >= start && selectedDay <= end)) {
      const suggestedDay = today < start ? start : today > end ? end : today;
      form.setValue("date", suggestedDay, { shouldValidate: true });
    }
  }, [activePeriod, editing, form, periodId, periods]);

  const pickCompany = (nextCompanyId: string): void => {
    if (companyId === nextCompanyId) {
      return;
    }

    form.setValue("companyId", nextCompanyId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("periodId", "", { shouldDirty: true });
    setAmountEdits({});
    lineEditor.replace(
      lines.map((line) => ({ ...line, accountId: "", currency: undefined })),
    );
  };

  const pickPeriod = (nextPeriodId: string): void => {
    form.setValue("periodId", nextPeriodId, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  let debitUnits = BigInt(0);
  let creditUnits = BigInt(0);
  let invalidAmounts = false;
  for (const line of lines) {
    const units = journalAmountUnits(line.amount);
    const side = journalLineType(line.type);
    if (units === null || side === null) {
      invalidAmounts = true;
    } else if (side === LineType.DEBIT) {
      debitUnits += units;
    } else {
      creditUnits += units;
    }
  }
  const difference =
    debitUnits >= creditUnits
      ? debitUnits - creditUnits
      : creditUnits - debitUnits;
  const money = (units: bigint): string =>
    formatJournalCurrency(units, currency, locale);
  const cent = BigInt(100);
  const subcentDifference = difference > BigInt(0) && difference < cent;
  const residual = subcentDifference ? `< ${money(cent)}` : money(difference);
  const missingSide =
    debitUnits > creditUnits ? LineType.CREDIT : LineType.DEBIT;
  const amountNumber = new Intl.NumberFormat(locale, {
    useGrouping: false,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const exactAmountNumber = new Intl.NumberFormat(locale, {
    useGrouping: false,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
  const emptyAmount = amountNumber.format(0);
  const previewLines = lineEditor.fields.flatMap(({ id }, index) => {
    const line = lines[index];
    if (!line || journalAmountUnits(line.amount) === null) {
      return [];
    }
    const account = accounts?.find(
      ({ id: accountId }) => accountId === line.accountId,
    );
    const side = journalLineType(line.type);
    return account && side
      ? [{ id, account, side, amount: exactAmountNumber.format(line.amount) }]
      : [];
  });
  const clearAmountEdit = (lineId: string): void => {
    setAmountEdits((edits) => {
      if (!(lineId in edits)) {
        return edits;
      }
      const remaining = { ...edits };
      delete remaining[lineId];
      return remaining;
    });
  };
  const changeAmount = (
    index: number,
    lineId: string,
    side: typeof LineTypeValue,
    raw: string,
  ): void => {
    setAmountEdits((edits) => ({ ...edits, [lineId]: raw }));
    const decimal = raw.trim().replace(",", ".");
    form.setValue(`lines.${index}.type`, side, { shouldDirty: true });
    form.setValue(
      `lines.${index}.amount`,
      /^\d*(?:\.\d*)?$/.test(decimal) ? Number(decimal) : Number.NaN,
      { shouldDirty: true, shouldValidate: true },
    );
  };
  const balanced =
    lines.length >= 2 && !invalidAmounts && difference === BigInt(0);

  const openEntry = (entryId: string): void => {
    void (async (): Promise<void> => {
      const mod = await import("../[entryId]/get/definition");
      navigation.push(mod.default.GET, { urlPathParams: { entryId } });
    })();
  };
  const postEntry = (entryId: string): void => {
    void (async (): Promise<void> => {
      const mod = await import("../[entryId]/post/definition");
      const details = await import("../[entryId]/get/definition");
      navigation.push(mod.default.POST, {
        urlPathParams: { entryId },
        replaceOnSuccess: {
          endpoint: details.default.GET,
          getUrlPathParams: () => ({ entryId }),
        },
      });
    })();
  };

  if (data?.id) {
    const entryId = data.id;
    return (
      <WidgetShell layout="page">
        <ResultBanner
          variant="success"
          title={t("journalCreate.widget.savedAsDraft")}
          message={data.entryNumber}
        >
          {interactive && !responseOnly ? (
            <>
              <Button
                type="button"
                size="sm"
                onClick={() => postEntry(entryId)}
              >
                {t("journalCreate.widget.postNowButton")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openEntry(entryId)}
              >
                {t("journalCreate.widget.viewEntryButton")}
              </Button>
            </>
          ) : null}
        </ResultBanner>
      </WidgetShell>
    );
  }
  if (!editing) {
    return null;
  }

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("journalCreate.title")}
        subtitle={t("journalCreate.description")}
        backButton={
          navigation.canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigation.pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("journalCreate.widget.back")}
            </Button>
          )
        }
        actions={
          <>
            {balanced && (
              <StatusPill
                status="balanced"
                label={t("journalCreate.widget.balanced")}
                variant="success"
              />
            )}
            <SubmitButtonWidget<typeof definition.POST>
              field={{ text: "journalCreate.widget.saveDraft" }}
            />
          </>
        }
      />
      <FormAlertWidget field={{}} />
      <SectionGroup title={currency ?? t("journalCreate.widget.currency")}>
        <DetailGrid columns={3} className="grid-cols-3 gap-x-2">
          <DetailField
            label={t("journalCreate.widget.totalDebits")}
            value={money(debitUnits)}
          />
          <DetailField
            label={t("journalCreate.widget.totalCredits")}
            value={money(creditUnits)}
          />
          <DetailField
            label={t("journalCreate.widget.difference")}
            value={residual}
          />
        </DetailGrid>
        {previewLines.length > 0 && (
          <Div
            data-testid="journal-balance-preview"
            className="flex min-w-0 flex-col gap-1 border-t pt-2 @md:hidden"
          >
            <Div className="grid grid-cols-[minmax(0,1fr)_5.25rem_5.25rem] gap-2 text-xs font-medium text-muted-foreground">
              <Span>{t("journalCreate.widget.account")}</Span>
              <Span className="text-right">{t(LineType.DEBIT)}</Span>
              <Span className="text-right">{t(LineType.CREDIT)}</Span>
            </Div>
            {previewLines.map(({ id, account, side, amount }) => (
              <Div
                key={id}
                data-testid="journal-balance-preview-line"
                className="grid grid-cols-[minmax(0,1fr)_5.25rem_5.25rem] items-start gap-2 text-xs"
              >
                <Span className="[overflow-wrap:anywhere]">
                  {account.code} {account.name}
                </Span>
                <Span className="text-right tabular-nums [overflow-wrap:anywhere]">
                  {side === LineType.DEBIT ? amount : emptyAmount}
                </Span>
                <Span className="text-right tabular-nums [overflow-wrap:anywhere]">
                  {side === LineType.CREDIT ? amount : emptyAmount}
                </Span>
              </Div>
            ))}
          </Div>
        )}
        {!balanced && (
          <Div aria-live="polite">
            {!invalidAmounts && difference !== BigInt(0) ? (
              <Span className="text-sm font-medium text-destructive">
                {t(missingSide)}:{" "}
                {subcentDifference
                  ? t("journalCreate.widget.offByLessThan", {
                      amount: money(cent),
                    })
                  : t("journalCreate.widget.offBy", { amount: residual })}
              </Span>
            ) : (
              <Span className="text-sm text-muted-foreground">
                {t("journalCreate.widget.incomplete")}
              </Span>
            )}
          </Div>
        )}
      </SectionGroup>
      <SectionGroup title={t("journalCreate.widget.details")}>
        <Div className="grid min-w-0 gap-3 @md:grid-cols-2 @xl:grid-cols-3">
          {!toolCompanyId && (
            <Div className="flex flex-col gap-1">
              <Span className="text-sm font-medium">
                {t("journalCreate.companyId.label")}
              </Span>
              {fixedCompanyId && company?.name ? (
                <Span className="min-h-9 py-1.5 text-sm">{company.name}</Span>
              ) : (
                <DocumentScopePicker
                  kind="company"
                  required
                  value={companyId}
                  appliedLabel={company?.name}
                  onSelect={pickCompany}
                />
              )}
            </Div>
          )}
          <Div className="flex flex-col gap-1">
            <Span className="text-sm font-medium">
              {t("journalCreate.periodId.label")}
            </Span>
            <Select
              value={periodId}
              disabled={disabled || !periods?.length}
              onValueChange={pickPeriod}
            >
              <SelectTrigger
                aria-label={t("journalCreate.periodId.label")}
                aria-invalid={Boolean(form.formState.errors.periodId)}
              >
                <SelectValue placeholder={t("journalCreate.periodId.label")} />
              </SelectTrigger>
              <SelectContent>
                {periods?.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {periods?.length === 0 && (
              <Span className="text-sm text-muted-foreground">
                {t("journalCreate.widget.noPeriods")}
              </Span>
            )}
          </Div>
          <DateFieldWidget
            utcCalendarDay
            localizedDate
            key={`${periodId}:${dateInPeriod}`}
            fieldName="date"
            field={{
              ...children.date,
              description: undefined,
              placeholder: undefined,
              minDate: dateStart,
              maxDate: dateEnd,
            }}
          />
          <TextFieldWidget
            fieldName="description"
            field={{ ...children.description, description: undefined }}
          />
          <TextareaFieldWidget
            fieldName="memo"
            field={{ ...children.memo, description: undefined }}
          />
        </Div>
      </SectionGroup>
      <SectionGroup title={t("journalCreate.lines.label")}>
        {!companyId && (
          <Span className="text-sm text-muted-foreground">
            {t("journalCreate.widget.missingScope")}
          </Span>
        )}
        {accounts?.length === 0 && (
          <Span className="text-sm text-muted-foreground">
            {t("journalCreate.widget.noAccounts")}
          </Span>
        )}
        {lineEditor.fields.length > 0 && (
          <Div className="hidden min-w-0 grid-cols-[minmax(12rem,2fr)_minmax(8rem,1fr)_minmax(6rem,0.8fr)_minmax(6rem,0.8fr)_2.25rem] gap-3 px-2 text-sm font-medium text-muted-foreground @xl:grid">
            <Span>{t("journalCreate.widget.account")}</Span>
            <Span>{t("journalCreate.widget.lineDescription")}</Span>
            <Span className="text-right">{t(LineType.DEBIT)}</Span>
            <Span className="text-right">{t(LineType.CREDIT)}</Span>
          </Div>
        )}
        {lineEditor.fields.map((line, index) => {
          const current = lines[index] ?? line;
          return (
            <Div
              key={line.id}
              className="grid min-w-0 grid-cols-2 gap-3 rounded-md border p-3 @xl:grid-cols-[minmax(12rem,2fr)_minmax(8rem,1fr)_minmax(6rem,0.8fr)_minmax(6rem,0.8fr)_2.25rem] @xl:rounded-none @xl:border-0 @xl:border-b @xl:px-2 @xl:py-2"
            >
              <Div className="col-span-2 flex min-w-0 flex-col gap-1 @xl:col-span-1">
                <Span className="text-sm font-medium @xl:hidden">
                  {t("journalCreate.widget.account")}
                </Span>
                <Select
                  value={current.accountId}
                  disabled={disabled || !accounts?.length}
                  onValueChange={(value) =>
                    form.setValue(`lines.${index}.accountId`, value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    aria-label={t("journalCreate.widget.account")}
                    aria-invalid={Boolean(
                      form.formState.errors.lines?.[index]?.accountId,
                    )}
                  >
                    <SelectValue
                      placeholder={t("journalCreate.widget.account")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.code} {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Div>
              <Div className="col-span-2 flex min-w-0 flex-col gap-1 @xl:col-span-1">
                <Span className="text-sm font-medium @xl:hidden">
                  {t("journalCreate.widget.lineDescription")}
                </Span>
                <Input
                  aria-label={t("journalCreate.widget.lineDescription")}
                  value={current.description ?? ""}
                  disabled={disabled}
                  onChangeText={(value) =>
                    form.setValue(`lines.${index}.description`, value, {
                      shouldDirty: true,
                    })
                  }
                />
              </Div>
              {[LineType.DEBIT, LineType.CREDIT].map((side) => {
                const amount = current.amount;
                const ownsAmount = journalLineType(current.type) === side;
                const raw = ownsAmount ? amountEdits[line.id] : undefined;
                const hasAmount =
                  ownsAmount && amount !== 0 && Number.isFinite(amount);
                const valid = journalAmountUnits(amount) !== null;
                const display = hasAmount
                  ? valid
                    ? amountNumber.format(amount)
                    : String(amount)
                  : "";

                return (
                  <Div key={side} className="flex min-w-0 flex-col gap-1">
                    <Span className="text-sm font-medium @xl:hidden">
                      {t(side)}
                    </Span>
                    <Input
                      aria-label={t(side)}
                      aria-invalid={Boolean(
                        ownsAmount &&
                        (form.formState.errors.lines?.[index]?.amount ||
                          ((hasAmount || Boolean(raw?.trim())) && !valid)),
                      )}
                      value={raw ?? display}
                      placeholder={emptyAmount}
                      keyboardType="decimal-pad"
                      className="text-right tabular-nums"
                      disabled={disabled}
                      onFocus={() => {
                        if (hasAmount && valid && raw === undefined) {
                          setAmountEdits((edits) => ({
                            ...edits,
                            [line.id]: exactAmountNumber.format(amount),
                          }));
                        }
                      }}
                      onBlur={() => {
                        if (ownsAmount && (valid || !raw?.trim())) {
                          clearAmountEdit(line.id);
                        }
                      }}
                      onChangeText={(value) =>
                        changeAmount(index, line.id, side, value)
                      }
                    />
                  </Div>
                );
              })}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="col-span-2 justify-self-end @xl:col-span-1"
                disabled={disabled}
                aria-label={t("journalCreate.widget.removeLine")}
                onClick={() => {
                  clearAmountEdit(line.id);
                  lineEditor.remove(index);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          disabled={disabled || !accounts?.length}
          onClick={() =>
            lineEditor.append({
              accountId: "",
              type: lines.length === 1 ? LineType.CREDIT : LineType.DEBIT,
              amount: 0,
            })
          }
        >
          <Plus className="h-4 w-4" />
          {t("journalCreate.widget.addLine")}
        </Button>
      </SectionGroup>
    </WidgetShell>
  );
}
