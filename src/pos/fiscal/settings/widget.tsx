"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Building } from "next-vibe/ui/components/icons/Building";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { accountingCalendarDay } from "@/chart-of-accounts/shared/calendar-date";

import type definition from "./definition";

export function PosFiscalSettingsWidget({
  field,
}: {
  field: typeof definition.GET.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const interactive = useWidgetIsInteractive();
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.GET>();
  const response = useWidgetResponse();
  const companyId = form.watch("companyId") ?? data?.settingsCompanyId;
  const provider = data?.provider ?? null;
  const certifiedAvailable = (data?.adapters ?? []).some(
    (adapter) => adapter.certified,
  );

  const openSave = (): void => {
    if (!data?.settingsCompanyId) {
      return;
    }
    const target = data.settingsCompanyId;
    void import("./definition").then(({ default: endpoints }) =>
      navigation.push(endpoints.POST, {
        data: provider
          ? {
              companyId: target,
              adapter: provider.adapter,
              deviceKind: provider.deviceKind,
              cashRegisterCode: provider.cashRegisterCode,
              isEnabled: provider.isEnabled,
              certifiedUntil: provider.certifiedUntil
                ? accountingCalendarDay(provider.certifiedUntil)
                : undefined,
              credentialRef: provider.credentialRef ?? undefined,
              offlineDeadlineHours: provider.offlineDeadlineHours,
            }
          : { companyId: target },
      }),
    );
  };

  const banner = !data ? null : data.blocked ? (
    <ResultBanner
      variant="danger"
      title={t("widget.blockedTitle")}
      message={t("widget.blockedMessage")}
    >
      {!certifiedAvailable && (
        <P className="mt-2 text-sm">{t("widget.noCertifiedProvider")}</P>
      )}
    </ResultBanner>
  ) : data.required ? (
    <ResultBanner
      variant="success"
      title={t("widget.readyTitle")}
      message={t("widget.readyMessage")}
    />
  ) : (
    <ResultBanner
      variant="info"
      title={t("widget.notRequiredTitle")}
      message={t("widget.notRequiredMessage")}
    />
  );

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={
          data?.companyName
            ? `${data.companyName}${data.country ? ` · ${data.country}` : ""}`
            : t("description")
        }
        actions={
          interactive &&
          data?.canEdit && (
            <Button type="button" onClick={openSave}>
              {provider ? t("widget.edit") : t("widget.configure")}
            </Button>
          )
        }
      />
      {interactive && (
        <Div className="grid gap-3 @xl:grid-cols-2">
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={withValue(field.children.companyId, undefined, null)}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {!data ? (
        response?.success === false ? null : (
          <Skeleton className="h-36 w-full rounded-lg" />
        )
      ) : !companyId ? (
        <Div className="rounded-lg border border-dashed bg-card">
          <EmptyBlock
            size="page"
            icon={<Building className="h-6 w-6" />}
            title={t("widget.pickCompany.title")}
            message={t("widget.pickCompany.message")}
          />
        </Div>
      ) : (
        <>
          {banner}
          {data.required && (
            <SectionGroup title={t("widget.requiredTitle")}>
              <P className="text-sm text-muted-foreground">
                {t("widget.requiredMessage")}
              </P>
            </SectionGroup>
          )}
          <SectionGroup
            title={t("response.provider")}
            subtitle={
              provider ? (
                <StatusPill
                  status={provider.certified ? "certified" : "uncertified"}
                  variant={provider.certified ? "success" : "warning"}
                  label={
                    provider.certified
                      ? t("widget.certified")
                      : t("widget.notCertified")
                  }
                />
              ) : undefined
            }
          >
            {provider ? (
              <DetailGrid columns={2}>
                <DetailField label={t("adapter")} value={t(provider.adapter)} />
                <DetailField
                  label={t("deviceKind")}
                  value={t(provider.deviceKind)}
                />
                <DetailField
                  label={t("cashRegisterCode")}
                  value={provider.cashRegisterCode}
                  mono
                  copyable
                />
                <DetailField
                  label={t("isEnabled")}
                  value={
                    provider.isEnabled
                      ? t("widget.enabled")
                      : t("widget.disabled")
                  }
                />
                <DetailField
                  label={t("certifiedUntil")}
                  value={
                    provider.certifiedUntil
                      ? formatDocDate(provider.certifiedUntil, locale)
                      : "-"
                  }
                />
                <DetailField
                  label={t("credentialRef")}
                  value={provider.credentialRef ?? "-"}
                />
                <DetailField
                  label={t("offlineDeadlineHours")}
                  value={String(provider.offlineDeadlineHours)}
                />
              </DetailGrid>
            ) : (
              <P className="text-sm text-muted-foreground">
                {t("widget.noProvider")}
              </P>
            )}
          </SectionGroup>
          <SectionGroup
            title={t("response.counts")}
            subtitle={t("widget.queueHint")}
          >
            <MetricGrid columns={4}>
              <MetricCard
                label={t("widget.pending")}
                value={data.counts.pending}
              />
              <MetricCard
                label={t("widget.offline")}
                value={data.counts.offline}
                variant={data.counts.offline > 0 ? "warning" : "default"}
              />
              <MetricCard
                label={t("widget.failed")}
                value={data.counts.failed}
                variant={data.counts.failed > 0 ? "danger" : "default"}
              />
              <MetricCard
                label={t("widget.overdue")}
                value={data.counts.overdue}
                variant={data.counts.overdue > 0 ? "danger" : "default"}
              />
            </MetricGrid>
          </SectionGroup>
        </>
      )}
      <P className="text-xs leading-relaxed text-muted-foreground">
        {t("widget.disclaimer")}
      </P>
    </WidgetShell>
  );
}

export function PosFiscalSettingsSaveWidget({
  field,
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const children = field.children;

  if (result?.saved) {
    return (
      <WidgetShell layout="page" className="mx-auto max-w-3xl">
        <WidgetHeader size="page" title={t("saveTitle")} />
        <ResultBanner
          variant={result.blocked ? "warning" : "success"}
          title={t("widget.savedTitle")}
          message={
            result.blocked ? t("widget.savedBlocked") : t("widget.savedReady")
          }
        />
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => navigation.pop()}
          >
            {t("widget.back")}
          </Button>
        )}
        <P className="text-xs leading-relaxed text-muted-foreground">
          {t("widget.disclaimer")}
        </P>
      </WidgetShell>
    );
  }

  return (
    <AdminForm
      className="mx-auto max-w-3xl"
      title={t("saveTitle")}
      description={t("saveDescription")}
      alert={<FormAlertWidget field={{}} />}
      backButton={
        navigation.canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start -ml-1"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            {t("widget.back")}
          </Button>
        )
      }
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "widget.save" }}
        />
      }
    >
      <AdminFormSection title={t("widget.sectionProvider")} columns={2}>
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={withValue(children.companyId, undefined, null)}
        />
        <SelectFieldWidget
          fieldName="adapter"
          field={withValue(children.adapter, undefined, null)}
        />
        <BooleanFieldWidget
          fieldName="isEnabled"
          field={withValue(children.isEnabled, undefined, null)}
        />
      </AdminFormSection>
      <AdminFormSection title={t("widget.sectionDevice")} columns={2}>
        <SelectFieldWidget
          fieldName="deviceKind"
          field={withValue(children.deviceKind, undefined, null)}
        />
        <TextFieldWidget
          fieldName="cashRegisterCode"
          field={withValue(children.cashRegisterCode, undefined, null)}
        />
        <DateFieldWidget
          utcCalendarDay
          fieldName="certifiedUntil"
          field={withValue(children.certifiedUntil, undefined, null)}
        />
        <TextFieldWidget
          fieldName="credentialRef"
          field={withValue(children.credentialRef, undefined, null)}
        />
        <NumberFieldWidget
          fieldName="offlineDeadlineHours"
          field={withValue(children.offlineDeadlineHours, undefined, null)}
        />
      </AdminFormSection>
      <P className="text-xs leading-relaxed text-muted-foreground">
        {t("widget.disclaimer")}
      </P>
    </AdminForm>
  );
}
