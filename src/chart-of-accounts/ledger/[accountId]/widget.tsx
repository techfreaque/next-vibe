"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { scopedTranslation as frameworkTranslation } from "next-vibe/unified-ui/hooks/i18n";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { LineType } from "../../enum";
import type definition from "./definition";

export function CoaLedgerWidget({
  field: { children },
}: {
  field: typeof definition.GET.fields;
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const response = useWidgetResponse();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const showInputs = interactive && !responseOnly;
  const { t: frameworkT } = frameworkTranslation.scopedT(locale);

  const pathParams = navigation.current?.params?.urlPathParams;
  const hasAccountId =
    !!pathParams && "accountId" in pathParams && !!pathParams.accountId;

  const page = form.watch("page") ?? 1;
  const pageSize = form.watch("pageSize") ?? 20;
  const totalCount = data?.totalCount ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  const openEntry = (entryId: string): void => {
    void (async (): Promise<void> => {
      const mod = await import("../../journal/[entryId]/get/definition");
      navigation.push(mod.default.GET, { urlPathParams: { entryId } });
    })();
  };

  const changePage = (nextPage: number): void => {
    form.setValue("page", nextPage, { shouldDirty: true });
    onSubmit?.();
  };

  const formatLocale = locale.replace(/-GLOBAL$/, "");
  const date = new Intl.DateTimeFormat(formatLocale, {
    dateStyle: "medium",
    timeZone: "UTC",
  });

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("ledger.title")}
        backButton={
          interactive &&
          navigation.canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigation.pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("ledger.widget.back")}
            </Button>
          )
        }
        actions={
          showInputs &&
          hasAccountId && (
            <SubmitButtonWidget<typeof definition.GET> field={{ size: "sm" }} />
          )
        }
      />
      {showInputs && hasAccountId && (
        <Div className="grid gap-3 @sm:grid-cols-2">
          <DateFieldWidget
            utcCalendarDay
            fieldName="dateFrom"
            field={children.dateFrom}
          />
          <DateFieldWidget
            utcCalendarDay
            fieldName="dateTo"
            field={children.dateTo}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />

      {response?.success !== false &&
        (data?.lines === undefined ? (
          hasAccountId ? (
            <LoadingBlock message={t("ledger.widget.loading")} />
          ) : (
            <EmptyBlock title={t("ledger.widget.noAccount")} />
          )
        ) : data.lines.length === 0 ? (
          <EmptyBlock title={t("ledger.widget.empty")} />
        ) : (
          <Div className="rounded-md border">
            <Table scrollLabel={t("ledger.title")}>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("ledger.response.date")}</TableHead>
                  <TableHead>{t("ledger.response.description")}</TableHead>
                  <TableHead>{t("ledger.response.type")}</TableHead>
                  <TableHead className="text-right">
                    {t("ledger.response.amount")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("ledger.widget.runningBalance")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="whitespace-nowrap">
                      {date.format(new Date(line.date))}
                    </TableCell>
                    <TableCell>
                      {interactive ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto justify-start px-0 text-left text-primary"
                          onClick={() => openEntry(line.entryId)}
                        >
                          {line.description ?? line.entryNumber}
                        </Button>
                      ) : (
                        (line.description ?? line.entryNumber)
                      )}
                    </TableCell>
                    <TableCell>
                      {t(
                        line.type === LineType.DEBIT
                          ? LineType.DEBIT
                          : LineType.CREDIT,
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums whitespace-nowrap">
                      {formatMoney(line.amount, line.currency, formatLocale)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums whitespace-nowrap font-medium">
                      {formatMoney(
                        line.runningBalance,
                        line.currency,
                        formatLocale,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Div>
        ))}
      {showInputs && (pageCount > 1 || page > 1) && (
        <Div className="flex flex-wrap items-center justify-between gap-2">
          <Span className="text-sm text-muted-foreground">
            {frameworkT("widgets.pagination.page", {
              current: page,
              total: pageCount,
            })}
          </Span>
          <Div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page <= 1}
              aria-label={frameworkT("widgets.pagination.page", {
                current: Math.min(page - 1, pageCount),
                total: pageCount,
              })}
              onClick={() => changePage(Math.min(page - 1, pageCount))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page >= pageCount}
              aria-label={frameworkT("widgets.pagination.page", {
                current: Math.min(page + 1, pageCount),
                total: pageCount,
              })}
              onClick={() => changePage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Div>
        </Div>
      )}
    </WidgetShell>
  );
}
