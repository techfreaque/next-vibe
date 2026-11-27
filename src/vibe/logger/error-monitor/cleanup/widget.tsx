"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX } from "react";

import { toIntlLocale } from "../../../core/i18n/core/language-utils";
import {
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { scopedTranslation } from "../../../unified-ui/hooks/i18n";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import type definition from "./definition";

export function ErrorLogsCleanupWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { t: uiT } = scopedTranslation.scopedT(locale);
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const isSubmitting = useWidgetIsSubmitting();
  const submit = useWidgetOnSubmit();
  const title = t("errorMonitor.cleanup.post.title");
  const action = t("errorMonitor.cleanup.post.titleShort");
  const description = t("errorMonitor.cleanup.post.description");
  const formatter = new Intl.NumberFormat(toIntlLocale(locale));

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={title}
        subtitle={description}
        actions={
          interactive &&
          !responseOnly &&
          submit && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  data-testid="endpoint-submit"
                  variant="destructive"
                  className="min-h-10 w-full @lg:w-auto"
                  disabled={isSubmitting}
                >
                  {action}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{title}</AlertDialogTitle>
                  <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {uiT("widgets.endpointRenderer.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    data-testid="confirm-log-cleanup"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={submit}
                  >
                    {action}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {data && (
        <>
          <MetricGrid columns={3}>
            <MetricCard
              label={t("errorMonitor.cleanup.post.response.deletedCount")}
              value={formatter.format(data.deletedCount)}
            />
            <MetricCard
              label={t("errorMonitor.cleanup.post.response.deletedByTime")}
              value={formatter.format(data.deletedByTime)}
            />
            <MetricCard
              label={t("errorMonitor.cleanup.post.response.deletedByCount")}
              value={formatter.format(data.deletedByCount)}
            />
          </MetricGrid>
          <SectionGroup title={t("errorMonitor.cleanup.post.container.title")}>
            <DetailGrid className="p-4">
              <DetailField
                label={t("errorMonitor.cleanup.post.response.retentionDays")}
                value={formatter.format(data.retentionDays)}
              />
              <DetailField
                label={t("errorMonitor.cleanup.post.response.maxRows")}
                value={formatter.format(data.maxRows)}
              />
            </DetailGrid>
          </SectionGroup>
        </>
      )}
    </WidgetShell>
  );
}
