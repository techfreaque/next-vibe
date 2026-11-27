"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
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
  useWidgetNavigation,
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
import { type JSX, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import accountListDefinition from "@/chart-of-accounts/account/list/definition";

import candidatesDefinition from "../candidates/definition";
import { BankPageHeader } from "../page-header";
import type definition from "./definition";

type SplitTargetType = "journal_line" | "invoice" | "bill" | "account";

const SPLIT_TARGET_JOURNAL: SplitTargetType = "journal_line";
const SPLIT_TARGET_INVOICE: SplitTargetType = "invoice";
const SPLIT_TARGET_BILL: SplitTargetType = "bill";
const SPLIT_TARGET_ACCOUNT: SplitTargetType = "account";

interface DraftAllocation {
  key: string;
  targetType: SplitTargetType;
  targetId: string;
  amount: string;
  description: string;
}

export function BankSplitWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { push } = useWidgetNavigation();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const form = useWidgetForm<typeof definition.POST>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;

  const [companyId, lineId] = useWatch({
    control: form.control,
    name: ["companyId", "lineId"],
  });

  const validScope =
    interactive &&
    !data &&
    z.uuid().safeParse(companyId).success &&
    z.uuid().safeParse(lineId).success;

  const candidateOpts = useMemo(
    () => ({
      read: {
        initialState: { companyId, lineId },
        queryOptions: { enabled: validScope },
      },
    }),
    [companyId, lineId, validScope],
  );
  const candidateRead = useEndpoint(
    candidatesDefinition,
    candidateOpts,
    logger,
    user,
  ).read;
  const review = candidateRead?.data;

  const accountOpts = useMemo(
    () => ({
      read: {
        initialState: { companyId, activeOnly: true },
        queryOptions: { enabled: validScope },
      },
    }),
    [companyId, validScope],
  );
  const accountsRead = useEndpoint(
    accountListDefinition,
    accountOpts,
    logger,
    user,
  ).read;
  const accounts = (accountsRead?.data?.accounts ?? []).filter(
    (a) => a.isPostable && a.isActive,
  );

  const [rows, setRows] = useState<DraftAllocation[]>([
    {
      key: "row-1",
      targetType: "invoice",
      targetId: "",
      amount: "",
      description: "",
    },
  ]);

  const lineAmount = Number(review?.statementLine.amount ?? 0);
  const lineCurrency = review?.statementLine.currency ?? "EUR";
  const allocatedTotal = rows.reduce((sum, r) => {
    const val = Number(r.amount);
    return Number.isFinite(val) ? sum + val : sum;
  }, 0);
  const remaining = Math.round((lineAmount - allocatedTotal) * 10_000) / 10_000;
  const isBalanced =
    review !== undefined &&
    Math.abs(remaining) < 0.00005 &&
    rows.length > 0 &&
    rows.every(
      (r) =>
        z.uuid().safeParse(r.targetId).success &&
        /^-?(?:0|[1-9]\d{0,9})(?:\.\d{1,4})?$/u.test(r.amount.trim()) &&
        Number(r.amount) !== 0,
    );

  const addRow = (): void => {
    const nextAmount = remaining !== 0 ? remaining.toFixed(2) : "";
    setRows((prev) => [
      ...prev,
      {
        key: `row-${Date.now()}-${prev.length}`,
        targetType: lineAmount >= 0 ? "invoice" : "bill",
        targetId: "",
        amount: nextAmount,
        description: "",
      },
    ]);
  };

  const updateRow = (
    key: string,
    patch: Partial<Omit<DraftAllocation, "key">>,
  ): void => {
    setRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  };

  const removeRow = (key: string): void => {
    setRows((prev) =>
      prev.length > 1 ? prev.filter((r) => r.key !== key) : prev,
    );
  };

  const submitSplit = (): void => {
    form.setValue(
      "allocations",
      rows.map((r) => ({
        targetType: r.targetType,
        targetId: r.targetId,
        amount: r.amount.trim(),
        description: r.description.trim() || undefined,
      })),
      { shouldDirty: true },
    );
    form.setValue("confirm", true, { shouldDirty: true });
    onSubmit?.();
  };

  const invoiceOptions = (review?.documentCandidates ?? []).filter(
    (d) => d.documentType === "invoice",
  );
  const billOptions = (review?.documentCandidates ?? []).filter(
    (d) => d.documentType === "bill",
  );
  const journalOptions = review?.matches ?? [];

  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t("split.title")}
        subtitle={t("split.description")}
      />
      {data ? (
        <>
          <ResultBanner
            variant="success"
            title={t("split.success")}
            message={formatDocDate(data.matchedAt, locale)}
          />
          {interactive && data.createdJournalEntryId && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const entryId = data.createdJournalEntryId;
                if (entryId) {
                  void import("@/chart-of-accounts/journal/[entryId]/get/definition").then(
                    ({ default: routes }) =>
                      push(routes.GET, { urlPathParams: { entryId } }),
                  );
                }
              }}
            >
              {t("adjustment.journal")}
            </Button>
          )}
        </>
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
          {review && (
            <SectionGroup title={t("fields.line")}>
              <DetailGrid columns={3}>
                <DetailField
                  label={t("fields.transactionId")}
                  value={review.statementLine.transactionId}
                />
                <DetailField
                  label={t("fields.bookedDate")}
                  value={formatDocDate(review.statementLine.bookedDate, locale)}
                />
                <DetailField
                  label={t("fields.amount")}
                  value={formatMoney(
                    review.statementLine.amount,
                    lineCurrency,
                    locale,
                  )}
                />
                <DetailField
                  label={t("split.remaining")}
                  value={
                    <Span
                      className={
                        Math.abs(remaining) < 0.00005
                          ? "font-semibold text-success tabular-nums"
                          : "font-semibold text-warning tabular-nums"
                      }
                    >
                      {formatMoney(remaining, lineCurrency, locale)}
                    </Span>
                  }
                />
              </DetailGrid>
            </SectionGroup>
          )}

          {review && interactive && (
            <SectionGroup title={t("split.allocations")}>
              <Div className="flex flex-col gap-3">
                {rows.map((row) => (
                  <Div
                    key={row.key}
                    className="grid gap-2 rounded-lg border bg-card p-3 @md:grid-cols-[10rem_minmax(0,1.4fr)_8rem_minmax(0,1fr)_auto]"
                  >
                    <Select
                      value={row.targetType}
                      onValueChange={(value) => {
                        if (
                          value === "journal_line" ||
                          value === "invoice" ||
                          value === "bill" ||
                          value === "account"
                        ) {
                          updateRow(row.key, {
                            targetType: value,
                            targetId: "",
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SPLIT_TARGET_INVOICE}>
                          {t("split.types.invoice")}
                        </SelectItem>
                        <SelectItem value={SPLIT_TARGET_BILL}>
                          {t("split.types.bill")}
                        </SelectItem>
                        <SelectItem value={SPLIT_TARGET_ACCOUNT}>
                          {t("split.types.account")}
                        </SelectItem>
                        <SelectItem value={SPLIT_TARGET_JOURNAL}>
                          {t("split.types.journal_line")}
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={row.targetId}
                      onValueChange={(val) => {
                        let autoAmt = row.amount;
                        if (!autoAmt) {
                          if (row.targetType === "invoice") {
                            const inv = invoiceOptions.find(
                              (d) => d.id === val,
                            );
                            if (inv) {
                              autoAmt = inv.openAmount;
                            }
                          } else if (row.targetType === "bill") {
                            const bl = billOptions.find((d) => d.id === val);
                            if (bl) {
                              autoAmt = `-${bl.openAmount}`;
                            }
                          }
                        }
                        updateRow(row.key, { targetId: val, amount: autoAmt });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("split.selectTarget")} />
                      </SelectTrigger>
                      <SelectContent>
                        {row.targetType === "invoice" &&
                          invoiceOptions.map((inv) => (
                            <SelectItem key={inv.id} value={inv.id}>
                              {`${inv.documentNumber} · ${inv.counterpartyName} (${formatMoney(inv.openAmount, inv.currency, locale)})`}
                            </SelectItem>
                          ))}
                        {row.targetType === "bill" &&
                          billOptions.map((bl) => (
                            <SelectItem key={bl.id} value={bl.id}>
                              {`${bl.documentNumber} · ${bl.counterpartyName} (${formatMoney(bl.openAmount, bl.currency, locale)})`}
                            </SelectItem>
                          ))}
                        {row.targetType === "account" &&
                          accounts.map((acct) => (
                            <SelectItem key={acct.id} value={acct.id}>
                              {`${acct.code} ${acct.name}`}
                            </SelectItem>
                          ))}
                        {row.targetType === "journal_line" &&
                          journalOptions.map((jl) => (
                            <SelectItem key={jl.id} value={jl.id}>
                              {`${jl.entryNumber} · ${jl.description}`}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Input
                      value={row.amount}
                      onChange={(e) =>
                        updateRow(row.key, { amount: e.target.value })
                      }
                      placeholder={t("fields.amount")}
                      className="text-right tabular-nums"
                    />

                    <Input
                      value={row.description}
                      onChange={(e) =>
                        updateRow(row.key, { description: e.target.value })
                      }
                      placeholder={t("fields.description")}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={rows.length <= 1}
                      onClick={() => removeRow(row.key)}
                    >
                      {t("split.removeRow")}
                    </Button>
                  </Div>
                ))}
                <Div className="flex flex-wrap items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRow}
                  >
                    {t("split.addRow")}
                  </Button>
                  <Button
                    type="button"
                    disabled={isSubmitting || !isBalanced || !review.canMatch}
                    onClick={submitSplit}
                  >
                    {t("split.confirmAction")}
                  </Button>
                </Div>
              </Div>
            </SectionGroup>
          )}
          <FormAlertWidget field={{}} />
        </>
      )}
    </WidgetShell>
  );
}
