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
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
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
import type definition from "./definition";

export function BankImportWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const { push } = useWidgetNavigation();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.POST>();
  const [companyId, accountId] = useWatch({
    control: form.control,
    name: ["companyId", "accountId"],
  });
  const [input, setInput] = useState(() => form.getValues("csv") ?? "");
  const [fileName, setFileName] = useState<string>();
  const fileInput = useRef<InputRefObject>(null);
  const [fileError, setFileError] = useState<"size" | "encoding">();
  const uploadAttempt = useRef(0);
  const [showPaste, setShowPaste] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const [separator, setSeparator] = useState<BankCsvSeparator>(",");
  const [mapping, setMapping] = useState<BankCsvMapping>({});
  const platform = useWidgetPlatform();
  const web =
    platform === Platform.NEXT_PAGE ||
    platform === Platform.ELECTRON ||
    platform === Platform.FRAME;
  const source = useMemo(
    () => (input ? readBankCsvColumns(input, separator) : undefined),
    [input, separator],
  );
  const updateInput = (value: string, name?: string): void => {
    uploadAttempt.current++;
    setFileError(undefined);
    setFileName(name);
    setMapping({});
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
    if (!source?.success) {
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
  }, [mapping, selectedCurrency, source]);
  const csv = mapped?.success && !fileError ? mapped.csv : "";
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
  if (data) {
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
        <ResultBanner title={t("import.success")} variant="success" />
        <DetailGrid columns={2}>
          <DetailField label={t("fields.imported")} value={data.imported} />
          <DetailField label={t("fields.skipped")} value={data.skipped} />
        </DetailGrid>
        <Button type="button" onClick={view} className="self-start">
          {t("ui.listAction")}
        </Button>
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
              accept=".csv,text/csv"
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
      {source?.success && (
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
      {errorMessage && <ResultBanner title={errorMessage} variant="danger" />}
      {mapped?.success && !fileError && (
        <SectionGroup title={t("ui.preview")}>
          <RecordTable
            label={t("ui.preview")}
            columns={BANK_CSV_FIELDS.map((key) => ({
              id: key,
              label: fieldLabel(key),
              numeric: key === "amount",
            }))}
            rows={previewRows.map((row) => ({
              id: row.transactionId,
              cells: {
                transactionId: row.transactionId,
                date: row.bookedDate,
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
                        label={t("fields.transactionId")}
                        value={row.transactionId}
                      />
                      <DetailField
                        label={t("fields.bookedDate")}
                        value={row.bookedDate}
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
      {csv && scopeReadEnabled && (
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "ui.importAction", className: "self-end" }}
        />
      )}
    </WidgetShell>
  );
}
