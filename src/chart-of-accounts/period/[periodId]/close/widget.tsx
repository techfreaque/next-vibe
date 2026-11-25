"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
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
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import { JournalEntryStatus } from "../../../enum";
import { scopedTranslation as accountingTranslation } from "../../../i18n";
import journalDefinition from "../../../journal/list/definition";
import trialBalanceDefinition from "../../../reports/trial-balance/definition";
import periodDefinition from "../get/definition";
import type definition from "./definition";

export function CoaPeriodCloseWidget({
  field: { children },
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const showActions = interactive && !responseOnly;
  const { t: accountingT } = accountingTranslation.scopedT(locale);

  const periodId = form.watch("periodId");
  const periodOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { periodId },
        queryOptions: { enabled: showActions && !!periodId },
      },
    }),
    [periodId, showActions],
  );
  const period = useEndpoint(periodDefinition, periodOptions, logger, user).read
    ?.data?.result;
  const companyId = period?.companyId;
  const periodEnd = period?.endDate;
  const preview = showActions && !!companyId && !!periodId && !data?.closed;
  const draftOptions = useMemo(
    () => ({
      read: {
        queryOptions: { enabled: preview },
        initialState: {
          companyId,
          periodId,
          status: JournalEntryStatus.DRAFT,
          pageSize: 1,
        },
      },
    }),
    [companyId, periodId, preview],
  );
  const trialOptions = useMemo(
    () => ({
      read: {
        queryOptions: { enabled: preview },
        initialState: { companyId, periodId, asOfDate: periodEnd },
      },
    }),
    [companyId, periodEnd, periodId, preview],
  );
  const drafts = useEndpoint(journalDefinition, draftOptions, logger, user).read
    ?.data?.totalCount;
  const balanced = useEndpoint(
    trialBalanceDefinition,
    trialOptions,
    logger,
    user,
  ).read?.data?.isBalanced;

  const viewTrial = (): void => {
    navigation.push(trialBalanceDefinition.GET, {
      data: { companyId, periodId, asOfDate: periodEnd },
    });
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={
          period
            ? data?.closed
              ? period.name
              : t("post.widget.closeNamed", { name: period.name })
            : t("post.title")
        }
        backButton={
          showActions &&
          navigation.canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigation.pop()}
            >
              <ChevronLeft className="h-4 w-4" />
              {accountingT("periodGet.widget.back")}
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {period && (
        <SectionGroup title={period.name}>
          <DetailGrid columns={2}>
            <DetailField
              label={accountingT("periodGet.response.startDate")}
              value={formatDocDate(period.startDate, locale)}
            />
            <DetailField
              label={accountingT("periodGet.response.endDate")}
              value={formatDocDate(period.endDate, locale)}
            />
            {!data?.closed && drafts !== undefined && (
              <DetailField
                label={t("post.widget.draftCount")}
                value={
                  <StatusPill
                    status={String(drafts)}
                    variant={drafts > 0 ? "warning" : "success"}
                  />
                }
              />
            )}
            {!data?.closed && balanced !== undefined && (
              <DetailField
                label={accountingT("reports.nav.trialBalance")}
                value={
                  <StatusPill
                    status={
                      balanced
                        ? accountingT("trialBalance.widget.balanced")
                        : accountingT("trialBalance.widget.unbalanced")
                    }
                    variant={balanced ? "success" : "danger"}
                  />
                }
              />
            )}
          </DetailGrid>
        </SectionGroup>
      )}
      {data?.closed ? (
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={t("post.success.description")}
        >
          {showActions && companyId && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={viewTrial}
            >
              {accountingT("reports.nav.trialBalance")}
            </Button>
          )}
        </ResultBanner>
      ) : (
        showActions && (
          <>
            {!periodId && (
              <EntityPickerFieldWidget
                fieldName="periodId"
                field={children.periodId}
              />
            )}
            <SectionGroup title={t("post.widget.confirmTitle")}>
              <P className="text-sm text-muted-foreground">
                {t("post.widget.confirmDescription")}
              </P>
              <Div className="flex flex-wrap items-center justify-end gap-2">
                {navigation.canGoBack && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => navigation.pop()}
                  >
                    {t("post.widget.cancelButton")}
                  </Button>
                )}
                {periodId && (drafts ?? 0) === 0 && (
                  <SubmitButtonWidget<typeof definition.POST>
                    field={{
                      text: "post.widget.confirmButton",
                      variant: "destructive",
                      size: "sm",
                    }}
                  />
                )}
                {(drafts ?? 0) > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigation.push(journalDefinition.GET, {
                        data: {
                          companyId,
                          periodId,
                          status: JournalEntryStatus.DRAFT,
                        },
                      })
                    }
                  >
                    {t("post.widget.draftCount")}
                  </Button>
                )}
              </Div>
            </SectionGroup>
          </>
        )
      )}
    </WidgetShell>
  );
}
