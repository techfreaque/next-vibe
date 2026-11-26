"use client";

import { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { Input, type InputRefObject } from "next-vibe/ui/components/input";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Textarea } from "next-vibe/ui/components/textarea";
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
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import { DocumentScopePicker } from "@/finance/document-list-ui";

import { BankAccountPicker } from "../account-picker";
import {
  BANK_CSV_FIELDS,
  BANK_STATEMENT_CSV_LIMIT,
  type BankCsvField,
  type BankCsvMapping,
  type BankCsvSeparator,
  mapBankCsvColumns,
  readBankCsvColumns,
} from "../csv";
import listDefinition from "../list/definition";
import { BankPageHeader } from "../page-header";
import { statementColumns, type StatementMapping } from "../statement-csv";
import { parseStatementFile } from "../statement-file";
import {
  bankStatementFormats,
  bankStatementFormatSchema,
} from "../statement-format";
import type definition from "./definition";

export function BankImportWidget({
  field: fields,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const { push } = useWidgetNavigation();
  const onSubmit = useWidgetOnSubmit();
  const isSubmitting = useWidgetIsSubmitting();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.POST>();
  const [companyId, accountId, selectedFormat] = useWatch({
    control: form.control,
    name: ["companyId", "accountId", "format"],
  });
  const format = selectedFormat ?? "normalized";
  const [input, setInput] = useState(() => form.getValues("csv") ?? "");
  const [fileName, setFileName] = useState<string>();
  const fileInput = useRef<InputRefObject>(null);
  const [fileError, setFileError] = useState<"size" | "encoding">();
  const uploadAttempt = useRef(0);
  const [showPaste, setShowPaste] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const [separator, setSeparator] = useState<BankCsvSeparator>(
    () =>
      form.getValues("fileOptions")?.separator ??
      (form.getValues("format") === "c24" ? ";" : ","),
  );
  const [mapping, setMapping] = useState<BankCsvMapping>({});
  const [customMapping, setCustomMapping] = useState<StatementMapping>(
    () => form.getValues("fileOptions")?.mapping ?? {},
  );
  const [decimal, setDecimal] = useState<"," | ".">(
    () =>
      form.getValues("fileOptions")?.decimal ??
      (form.getValues("format") === "c24" ? "," : "."),
  );
  const platform = useWidgetPlatform();
  const web =
    platform === Platform.NEXT_PAGE ||
    platform === Platform.ELECTRON ||
    platform === Platform.FRAME;
  const source = useMemo(
    () =>
      input && (format === "normalized" || format === "mapped")
        ? readBankCsvColumns(input, separator, format === "mapped" ? 2 : 4)
        : undefined,
    [format, input, separator],
  );
  const updateInput = (value: string, name?: string): void => {
    uploadAttempt.current++;
    setFileError(undefined);
    setFileName(name);
    setMapping({});
    setCustomMapping({});
    setInput(value);
  };
  const readFile = async (file: File | undefined): Promise<void> => {
    if (!file) {
      return;
    }
    const attempt = ++uploadAttempt.current;
    setFileName(undefined);
    if (file.size > BANK_STATEMENT_CSV_LIMIT) {
      setFileError("size");
      return;
    }
    try {
      const contents = new TextDecoder("utf-8", { fatal: true }).decode(
        await file.arrayBuffer(),
      );
      if (attempt === uploadAttempt.current) {
        updateInput(contents, file.name);
        if (/\.xml$/iu.test(file.name)) {
          form.setValue("format", "camt053", { shouldDirty: true });
        } else if (/\.(mt940|sta)$/iu.test(file.name)) {
          form.setValue("format", "mt940", { shouldDirty: true });
        }
      }
    } catch {
      if (attempt === uploadAttempt.current) {
        setFileError("encoding");
      }
    }
  };
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const scopeReadEnabled =
    interactive &&
    !data &&
    z.uuid().safeParse(companyId).success &&
    z.uuid().safeParse(accountId).success;
  const scopeOptions = useMemo(
    () => ({
      read: {
        initialState: { companyId, accountId, page: 1 },
        queryOptions: { enabled: scopeReadEnabled },
      },
    }),
    [companyId, accountId, scopeReadEnabled],
  );
  const scope = useEndpoint(listDefinition, scopeOptions, logger, user).read
    ?.data;
  const appliedScope =
    scope?.selectedCompanyId === companyId &&
    scope?.selectedAccountId === accountId
      ? scope
      : undefined;

  const selectedCurrency = appliedScope?.selectedCurrency;
  const mapped = useMemo(() => {
    if (format !== "normalized" || !source?.success) {
      return undefined;
    }
    const defaults: BankCsvMapping = {};
    for (const field of BANK_CSV_FIELDS) {
      const index = source.headers.indexOf(field);
      if (index >= 0) {
        defaults[field] = index;
      }
    }
    return mapBankCsvColumns(
      source,
      { ...defaults, ...mapping },
      selectedCurrency,
    );
  }, [format, mapping, selectedCurrency, source]);
  const fileOptions = useMemo(
    () => ({
      mapping: customMapping,
      separator,
      decimal,
    }),
    [customMapping, decimal, separator],
  );
  const advanced = useMemo(
    () =>
      input && format !== "normalized"
        ? parseStatementFile(input, format, fileOptions, selectedCurrency)
        : undefined,
    [fileOptions, format, input, selectedCurrency],
  );
  const mismatch =
    advanced?.success &&
    selectedCurrency &&
    advanced.rows.some(({ currency }) => currency !== selectedCurrency);
  const csv =
    !fileError && !mismatch
      ? mapped?.success
        ? mapped.csv
        : advanced?.success
          ? input
          : ""
      : "";
  useEffect(() => {
    if (!data && format !== "normalized") {
      form.setValue("fileOptions", fileOptions);
    }
  }, [data, fileOptions, form, format]);
  useEffect(() => {
    if (!data && csv !== form.getValues("csv")) {
      form.setValue("csv", csv, { shouldDirty: Boolean(input) });
    }
  }, [csv, data, form, input]);
  const fieldLabel = (key: BankCsvField): string => {
    switch (key) {
      case "transactionId":
        return t("fields.transactionId");
      case "date":
        return t("fields.bookedDate");
      case "amount":
        return t("fields.amount");
      case "currency":
        return t("fields.currency");
    }
  };
  const errorMessage =
    fileError === "encoding"
      ? t("check.encoding")
      : fileError === "size"
        ? t("check.size")
        : mismatch
          ? t("check.currency")
          : advanced && !advanced.success
            ? t("statement.invalid", { row: advanced.row ?? 0 })
            : source && !source.success
              ? source.error === "header"
                ? t("check.mappingHeader")
                : source.error === "size"
                  ? t("check.size")
                  : t("check.empty")
              : mapped && !mapped.success
                ? mapped.error === "mapping"
                  ? t("check.mapping")
                  : mapped.error === "columns"
                    ? t("check.columns", { row: mapped.row ?? 0 })
                    : mapped.error === "value" && mapped.field
                      ? t("check.value", {
                          row: mapped.row ?? 0,
                          field: fieldLabel(mapped.field),
                        })
                      : mapped.error === "duplicate"
                        ? t("check.duplicate", { row: mapped.row ?? 0 })
                        : mapped.error === "size"
                          ? t("check.size")
                          : mapped.error === "currency"
                            ? t("check.currency")
                            : t("check.row", { row: mapped.row ?? 0 })
                : undefined;

  const previewRows = mapped?.success ? mapped.rows.slice(0, 5) : [];
  const statementRows = advanced?.success ? advanced.rows.slice(0, 5) : [];
  if (data) {
    const canApplyPreview =
      data.preview &&
      data.imported > 0 &&
      interactive &&
      !!onSubmit &&
      !!csv &&
      companyId === data.selectedCompanyId &&
      accountId === data.selectedAccountId;
    const view = (): void => {
      void (async (): Promise<void> => {
        const { default: list } = await import("../list/definition");
        push(list.GET, {
          data: {
            companyId: data.selectedCompanyId,
            accountId: data.selectedAccountId,
            page: 1,
          },
        });
      })();
    };
    return (
      <WidgetShell layout="page">
        <BankPageHeader
          title={t("import.title")}
          subtitle={t("import.description")}
        />
        <ResultBanner
          title={t(
            data.preview ? "statement.previewSuccess" : "import.success",
          )}
          variant="success"
        />
        <DetailGrid columns={2}>
          <DetailField
            label={t(data.preview ? "statement.projected" : "fields.imported")}
            value={data.imported}
          />
          <DetailField label={t("fields.skipped")} value={data.skipped} />
          {!data.preview && typeof data.autoMatched === "number" && (
            <DetailField
              label={t("adjustment.autoMatched")}
              value={data.autoMatched}
            />
          )}
        </DetailGrid>
        {typeof data.screenedOut === "number" && data.screenedOut > 0 && (
          <P className="text-sm text-muted-foreground">
            {t("statement.screenedOutCount", { count: data.screenedOut })}
          </P>
        )}
        <FormAlertWidget field={{}} />
        <Div className="flex flex-wrap gap-2">
          {canApplyPreview && (
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                form.setValue("dryRun", false, { shouldDirty: true });
                onSubmit();
              }}
            >
              {t("ui.importAction")}
            </Button>
          )}
          <Button
            type="button"
            onClick={view}
            variant={canApplyPreview ? "outline" : "default"}
          >
            {t("ui.listAction")}
          </Button>
        </Div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell layout="page">
      <BankPageHeader
        title={t("import.title")}
        subtitle={t("import.description")}
      />
      <SectionGroup title={t("fields.account")}>
        <Div className="flex min-w-0 flex-wrap gap-2">
          <DocumentScopePicker
            kind="company"
            required
            value={companyId}
            appliedLabel={appliedScope?.selectedCompanyName}
            onSelect={(id) => {
              if (id !== companyId) {
                form.setValue("companyId", id, { shouldDirty: true });
                form.setValue("accountId", "", { shouldDirty: true });
              }
            }}
          />
          <BankAccountPicker
            companyId={companyId}
            accountId={accountId}
            accountName={appliedScope?.selectedAccountName}
            onSelect={(id) =>
              form.setValue("accountId", id, { shouldDirty: true })
            }
          />
        </Div>
      </SectionGroup>
      <SectionGroup title={t("fields.csv")}>
        {web && (
          <Div
            className="flex flex-col gap-2 rounded-lg border border-dashed p-3"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void readFile(event.dataTransfer.files[0]);
            }}
          >
            <Button
              type="button"
              variant="outline"
              className="self-start"
              onClick={() => fileInput.current?.click?.()}
            >
              {t("ui.upload")}
            </Button>
            <Input
              ref={fileInput}
              type="file"
              accept=".csv,.xml,.sta,.mt940,.txt,text/csv,text/plain,application/xml"
              aria-label={t("ui.upload")}
              className="hidden"
              onChange={(event) => {
                void readFile(event.target.files?.[0]);
                if (fileInput.current) {
                  fileInput.current.value = "";
                }
              }}
            />
            {fileName && <P className="break-all text-sm">{fileName}</P>}
            <P className="text-xs text-muted-foreground">{t("ui.dropCsv")}</P>
          </Div>
        )}
        <Div className="flex min-w-0 flex-col items-start gap-1">
          <P className="text-sm font-medium">{t("statement.format")}</P>
          <Select
            value={format}
            onValueChange={(value) => {
              const parsed = bankStatementFormatSchema.safeParse(value);
              if (parsed.success) {
                form.setValue("format", parsed.data, { shouldDirty: true });
                setSeparator(parsed.data === "c24" ? ";" : ",");
                setDecimal(parsed.data === "c24" ? "," : ".");
                setCustomMapping({});
              }
            }}
          >
            <SelectTrigger aria-label={t("statement.format")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bankStatementFormats.map((value) => (
                <SelectItem key={value} value={value}>
                  {t(`statement.formats.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Div>
        {format !== "mt940" && format !== "camt053" && (
          <Div className="flex min-w-0 flex-col items-start gap-1">
            <P className="text-sm font-medium">{t("ui.csvFormat")}</P>
            <Select
              value={separator}
              onValueChange={(value) => {
                if (value === "," || value === ";") {
                  setMapping({});
                  setSeparator(value);
                }
              }}
            >
              <SelectTrigger aria-label={t("ui.csvFormat")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">{t("ui.commaFormat")}</SelectItem>
                <SelectItem value=";">{t("ui.semicolonFormat")}</SelectItem>
              </SelectContent>
            </Select>
          </Div>
        )}
        {(format === "mapped" ||
          format === "revolut" ||
          format === "revolutBusiness" ||
          format === "c24") && (
          <Select
            value={decimal}
            onValueChange={(value) => {
              if (value === "," || value === ".") {
                setDecimal(value);
              }
            }}
          >
            <SelectTrigger aria-label={t("statement.decimal")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=".">{t("statement.dotDecimal")}</SelectItem>
              <SelectItem value=",">{t("statement.commaDecimal")}</SelectItem>
            </SelectContent>
          </Select>
        )}
        {(!web || showPaste) && (
          <Textarea
            aria-label={t("ui.pasteCsv")}
            placeholder={t("ui.pasteCsv")}
            value={input}
            onChangeText={updateInput}
            rows={4}
          />
        )}
        <Div className="flex flex-wrap gap-2">
          {web && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-expanded={showPaste}
              onClick={() => setShowPaste(!showPaste)}
            >
              {t("ui.pasteCsv")}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-expanded={showFormat}
            onClick={() => setShowFormat(!showFormat)}
          >
            {t("ui.supportedFormat")}
          </Button>
        </Div>
        {showFormat && (
          <Div className="flex flex-col gap-1 text-muted-foreground">
            <P className="text-sm">{t("ui.csvHelp")}</P>
            <P className="text-sm">{t("ui.unsupported")}</P>
          </Div>
        )}
      </SectionGroup>
      {format === "normalized" && source?.success && (
        <SectionGroup title={t("ui.mapping")}>
          <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @xl:grid-cols-4">
            {BANK_CSV_FIELDS.map((key) => {
              const label = fieldLabel(key);
              const inferred = source.headers.indexOf(key);
              const value =
                mapping[key] ?? (inferred >= 0 ? inferred : undefined);
              return (
                <Div key={key} className="flex min-w-0 flex-col gap-1">
                  <P className="text-sm font-medium">{label}</P>
                  <Select
                    value={value === undefined ? "" : String(value)}
                    onValueChange={(index) =>
                      setMapping((previous) => ({
                        ...previous,
                        [key]: Number(index),
                      }))
                    }
                  >
                    <SelectTrigger aria-label={label}>
                      <SelectValue placeholder={t("ui.chooseColumn")} />
                    </SelectTrigger>
                    <SelectContent>
                      {source.headers.map((header, index) => (
                        <SelectItem key={index} value={String(index)}>
                          {index + 1}. {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Div>
              );
            })}
          </Div>
        </SectionGroup>
      )}
      {format === "mapped" && source?.success && (
        <SectionGroup title={t("statement.mapping")}>
          <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @xl:grid-cols-4">
            {statementColumns.map((field) => (
              <Div key={field} className="flex min-w-0 flex-col gap-1">
                <P className="text-sm">{t(`statement.columns.${field}`)}</P>
                <Select
                  value={
                    customMapping[field] === undefined
                      ? "unset"
                      : String(customMapping[field])
                  }
                  onValueChange={(value) =>
                    setCustomMapping((previous) => {
                      const next = { ...previous };
                      if (value === "unset") {
                        delete next[field];
                      } else {
                        next[field] = Number(value);
                      }
                      return next;
                    })
                  }
                >
                  <SelectTrigger aria-label={t(`statement.columns.${field}`)}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unset">
                      {t("statement.unmapped")}
                    </SelectItem>
                    {source.headers.map((header, index) => (
                      <SelectItem key={index} value={String(index)}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Div>
            ))}
          </Div>
        </SectionGroup>
      )}
      {statementRows.length > 0 && !fileError && !mismatch && (
        <SectionGroup title={t("ui.preview")}>
          <P className="text-sm text-muted-foreground">
            {t("statement.localPreview")}
          </P>
          {statementRows.map((row, index) => (
            <Div key={index} className="border-t py-2">
              <DetailGrid columns={3}>
                <DetailField
                  label={t("fields.bookedDate")}
                  value={formatDocDate(row.bookedDate, locale)}
                />
                <DetailField
                  label={t("statement.columns.amount")}
                  value={formatMoney(row.amount, row.currency, locale)}
                />
                {row.valueDate && row.valueDate !== row.bookedDate && (
                  <DetailField
                    label={t("statement.columns.valueDate")}
                    value={formatDocDate(row.valueDate, locale)}
                  />
                )}
                {row.nativeAmount && row.nativeCurrency && (
                  <DetailField
                    label={t("statement.columns.nativeAmount")}
                    value={formatMoney(
                      row.nativeAmount,
                      row.nativeCurrency,
                      locale,
                    )}
                  />
                )}
                {row.feeAmount && row.feeCurrency && (
                  <DetailField
                    label={t("statement.columns.feeAmount")}
                    value={formatMoney(row.feeAmount, row.feeCurrency, locale)}
                  />
                )}
              </DetailGrid>
            </Div>
          ))}
        </SectionGroup>
      )}
      {errorMessage && <ResultBanner title={errorMessage} variant="danger" />}
      {mapped?.success && !fileError && (
        <SectionGroup title={t("ui.preview")}>
          <P className="text-sm text-muted-foreground">
            {t("statement.localPreview")}
          </P>
          <RecordTable
            label={t("ui.preview")}
            columns={BANK_CSV_FIELDS.filter(
              (key) => key !== "transactionId",
            ).map((key) => ({
              id: key,
              label: fieldLabel(key),
              numeric: key === "amount",
            }))}
            rows={previewRows.map((row) => ({
              id: row.transactionId,
              cells: {
                date: formatDocDate(row.bookedDate, locale),
                amount: formatMoney(row.amount, row.currency, locale),
                currency: row.currency,
              },
            }))}
            compact={
              <Div className="flex flex-col gap-2">
                {previewRows.map((row) => (
                  <Div
                    key={row.transactionId}
                    className="rounded-lg border p-2"
                  >
                    <DetailGrid columns={2}>
                      <DetailField
                        label={t("fields.bookedDate")}
                        value={formatDocDate(row.bookedDate, locale)}
                      />
                      <DetailField
                        label={t("fields.amount")}
                        value={formatMoney(row.amount, row.currency, locale)}
                      />
                      <DetailField
                        label={t("fields.currency")}
                        value={row.currency}
                      />
                    </DetailGrid>
                  </Div>
                ))}
              </Div>
            }
          />
        </SectionGroup>
      )}
      <FormAlertWidget field={{}} />
      {csv && appliedScope && (
        <Div className="flex flex-wrap gap-3">
          <BooleanFieldWidget
            fieldName="dryRun"
            field={fields.children.dryRun}
          />
          <BooleanFieldWidget
            fieldName="autoMatch"
            field={fields.children.autoMatch}
          />
        </Div>
      )}
      {csv && appliedScope && (
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "ui.importAction", className: "self-end" }}
        />
      )}
    </WidgetShell>
  );
}
