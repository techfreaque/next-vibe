"use client";

import { MimeType } from "next-vibe/identity/lead/enum";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe/ui/components/accordion";
import { Button } from "next-vibe/ui/components/button";
import { Checkbox } from "next-vibe/ui/components/checkbox";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { FormAlert } from "next-vibe/ui/components/form/form-alert";
import { Download } from "next-vibe/ui/components/icons/Download";
import { FileText } from "next-vibe/ui/components/icons/FileText";
import { Label } from "next-vibe/ui/components/label";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { downloadBinaryFile } from "next-vibe/ui/lib/download";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import {
  pickerDateFromUtcDay,
  utcDayFromPickerDate,
} from "next-vibe/unified-ui/widgets/form-fields/date-field/calendar-date";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { type JSX, useState } from "react";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

function decodedByteLength(base64: string): number {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

export function LeadsExportContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const { children } = field;
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const onSubmit = useWidgetOnSubmit();
  const form = useWidgetForm<typeof definition.GET>();
  const read = endpointMutations?.read;
  const isLoading = read?.isFetching || read?.isLoading || false;
  const failed = response?.success === false;

  const [openSection, setOpenSection] = useState("");

  const filters = form
    .watch(["status", "source", "country", "language", "dateFrom", "dateTo"])
    .filter(Boolean).length;

  const includeMetadata = form.watch("includeMetadata") ?? false;
  const includeEngagementData = form.watch("includeEngagementData") ?? false;

  const handleDownload = (): void => {
    if (!data?.fileContent || !data.fileName || !data.mimeType) {
      return;
    }
    const bytes = Uint8Array.from(atob(data.fileContent), (character) =>
      character.charCodeAt(0),
    );
    downloadBinaryFile(
      data.fileName,
      bytes,
      data.mimeType === MimeType.CSV
        ? "text/csv;charset=utf-8"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  };

  const handleRunExport = (): void => {
    const end = utcDayFromPickerDate(
      pickerDateFromUtcDay(form.getValues("dateTo")),
    );
    if (end) {
      end.setUTCHours(23, 59, 59, 999);
      form.setValue("dateTo", end);
    }
    if (onSubmit) {
      onSubmit();
    } else {
      void read?.refetch();
    }
  };

  const actionLabel = isLoading
    ? t("widget.generatingExport")
    : failed
      ? t("widget.retry")
      : t("widget.prepareFile");

  return (
    <Div className="mx-auto w-full min-w-0 max-w-3xl">
      <AdminForm
        title={t("widget.exportLeads")}
        description={t("widget.description")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        alert={
          failed && response.errorType.errorCode >= 500 ? (
            <FormAlert
              alert={{
                variant: "destructive",
                message: { message: t("widget.exportFailed") },
              }}
            />
          ) : undefined
        }
        primaryAction={
          <Button
            type="button"
            disabled={isLoading}
            variant={data && !isLoading && !failed ? "outline" : "default"}
            onClick={handleRunExport}
            className="min-h-11 gap-2"
          >
            <FileText className="size-4" aria-hidden="true" />
            {actionLabel}
          </Button>
        }
      >
        <AdminFormSection title={t("widget.configureExport")} columns={2}>
          <SelectFieldWidget fieldName="format" field={children.format} />
          <TextFieldWidget fieldName="search" field={children.search} />
        </AdminFormSection>

        <Accordion
          type="single"
          collapsible
          value={openSection}
          onValueChange={(value) => {
            setOpenSection(typeof value === "string" ? value : "");
          }}
          className="rounded-lg border bg-card"
        >
          <AccordionItem value="filters" className="border-0">
            <AccordionTrigger className="min-h-11 gap-3 px-4 py-3 text-start">
              <Span>{t("widget.advancedFilters")}</Span>
              {filters > 0 && (
                <Span className="ms-auto text-xs text-muted-foreground">
                  {t("widget.activeFilters", {
                    count: filters.toLocaleString(locale),
                  })}
                </Span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <Div className="grid min-w-0 grid-cols-1 gap-4 border-t p-4 @lg:grid-cols-2">
                <SelectFieldWidget fieldName="status" field={children.status} />
                <SelectFieldWidget fieldName="source" field={children.source} />
                <SelectFieldWidget
                  fieldName="country"
                  field={children.country}
                />
                <SelectFieldWidget
                  fieldName="language"
                  field={children.language}
                />
                <DateFieldWidget
                  localizedDate
                  utcCalendarDay
                  fieldName="dateFrom"
                  field={children.dateFrom}
                />
                <DateFieldWidget
                  localizedDate
                  utcCalendarDay
                  fieldName="dateTo"
                  field={children.dateTo}
                />
                <Div className="grid grid-cols-1 gap-3 @lg:col-span-2 @lg:grid-cols-2">
                  <Label className="flex min-h-11 cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={includeMetadata}
                      onCheckedChange={(checked) => {
                        form.setValue("includeMetadata", checked === true);
                      }}
                    />
                    <Span>{t(children.includeMetadata.label)}</Span>
                  </Label>
                  <Label className="flex min-h-11 cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={includeEngagementData}
                      onCheckedChange={(checked) => {
                        form.setValue(
                          "includeEngagementData",
                          checked === true,
                        );
                      }}
                    />
                    <Span>{t(children.includeEngagementData.label)}</Span>
                  </Label>
                </Div>
              </Div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {isLoading && (
          <LoadingBlock
            announce
            message={t("widget.generatingExportHint")}
            className="justify-start rounded-lg border border-border bg-muted/40 p-4 text-start [&>span]:text-foreground"
          />
        )}
      </AdminForm>

      {!isLoading && !failed && data && (
        <WidgetShell layout="page" scroll={false}>
          {data.totalRecords === 0 ? (
            <EmptyBlock
              size="page"
              action={{
                label: t("widget.changeFilters"),
                onClick: () => {
                  setOpenSection("filters");
                  form.setFocus("search");
                },
              }}
              icon={<FileText className="size-6" aria-hidden="true" />}
              title={t("widget.noMatchingRecords")}
              message={t("widget.noMatchingRecordsHint")}
              className="rounded-lg border bg-card px-4 py-6"
            />
          ) : (
            <SectionGroup title={t("widget.exportReady")} className="min-w-0">
              <Div className="flex flex-wrap items-center gap-3">
                <Div className="flex min-w-0 flex-1 basis-52 flex-col gap-1">
                  <Span className="break-all text-sm font-medium">
                    {data.fileName}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {t("widget.fileDetails", {
                      count: data.totalRecords.toLocaleString(locale),
                      size: new Intl.NumberFormat(locale, {
                        style: "unit",
                        unit: "byte",
                        unitDisplay: "long",
                      }).format(decodedByteLength(data.fileContent)),
                    })}
                  </Span>
                  <Span className="text-xs text-muted-foreground">
                    {t("widget.generatedAt", {
                      date: new Date(data.exportedAt).toLocaleString(locale),
                    })}
                  </Span>
                </Div>
                <Button
                  type="button"
                  onClick={handleDownload}
                  className="min-h-11 w-full gap-2 @sm:w-auto"
                >
                  <Download className="size-4" aria-hidden="true" />
                  {t("widget.download")}
                </Button>
              </Div>
            </SectionGroup>
          )}
        </WidgetShell>
      )}
    </Div>
  );
}
