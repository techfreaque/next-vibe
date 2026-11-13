/**
 * Subscription Stripe Sync widget (web, CLI, MCP, AI, native)
 * Form (target / all / dry run) on top, before -> after report below.
 */

"use client";

import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ListItem } from "next-vibe/ui/components/list-item";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import {
  StatusPill,
  type StatusPillProps,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type React from "react";

import { scopedTranslation as subscriptionScopedTranslation } from "../../i18n";
import type definition from "./definition";
import type { SubscriptionSyncStripeResponseOutput } from "./definition";
import { SubscriptionSyncAction } from "./enum";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

type SyncItem = SubscriptionSyncStripeResponseOutput["items"][number];

const actionVariant: Record<
  SyncItem["action"],
  NonNullable<StatusPillProps["variant"]>
> = {
  [SubscriptionSyncAction.UPDATED]: "success",
  [SubscriptionSyncAction.EXPIRED]: "warning",
  [SubscriptionSyncAction.MISSING_IN_STRIPE]: "warning",
  [SubscriptionSyncAction.UNCHANGED]: "muted",
  [SubscriptionSyncAction.SKIPPED]: "muted",
  [SubscriptionSyncAction.ERROR]: "danger",
};

export function SubscriptionSyncStripeContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const result = useWidgetValue<typeof definition.POST>();
  const statusT = subscriptionScopedTranslation.scopedT(locale).t;

  const formatDate = (date: Date | null): string =>
    date ? formatSimpleDate(date, locale) : t("post.widget.none");

  const describe = (item: SyncItem): string => {
    const status =
      item.statusBefore === item.statusAfter
        ? statusT(item.statusAfter)
        : `${statusT(item.statusBefore)} -> ${statusT(item.statusAfter)}`;
    const before = formatDate(item.periodEndBefore);
    const after = formatDate(item.periodEndAfter);
    const period = before === after ? before : `${before} -> ${after}`;
    return [
      item.userEmail ?? item.subscriptionId,
      status,
      period,
      ...(item.note ? [item.note] : []),
    ].join(" | ");
  };

  return (
    <WidgetShell className="gap-4">
      <WidgetHeader
        title={t("post.title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
      />
      <Div className="grid grid-cols-1 items-end gap-3 @sm:grid-cols-4">
        <Div className="@sm:col-span-2">
          <TextFieldWidget
            fieldName="subscriptionId"
            field={children.subscriptionId}
          />
        </Div>
        <BooleanFieldWidget fieldName="all" field={children.all} />
        <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />
      </Div>
      <FormAlertWidget field={{}} />
      <Div className="flex justify-end">
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "post.widget.submit",
            loadingText: "post.widget.submitting",
            icon: "refresh-cw",
            variant: "primary",
            size: "sm",
          }}
        />
      </Div>

      {result !== null && result !== undefined && "items" in result && (
        <>
          <Div className="flex flex-wrap items-center gap-2">
            <StatusPill
              status={result.dryRunResult ? "preview" : "applied"}
              variant={result.dryRunResult ? "muted" : "success"}
              label={
                result.dryRunResult
                  ? t("post.widget.preview")
                  : t("post.widget.applied")
              }
            />
          </Div>
          <MetricGrid columns={3}>
            <MetricCard
              label={t("post.response.scanned")}
              value={result.scanned}
            />
            <MetricCard
              label={t("post.response.changed")}
              value={result.changed}
              variant={result.changed > 0 ? "warning" : "default"}
            />
            <MetricCard
              label={t("post.response.failed")}
              value={result.failed}
              variant={result.failed > 0 ? "danger" : "default"}
            />
          </MetricGrid>
          <SectionGroup title={t("post.response.items")}>
            {result.items.length === 0 ? (
              <EmptyBlock title={t("post.widget.empty")} />
            ) : (
              result.items.map((item) => (
                <ListItem
                  key={item.subscriptionId}
                  title={item.providerSubscriptionId ?? item.subscriptionId}
                  subtitle={describe(item)}
                  badges={
                    <StatusPill
                      status={item.action}
                      variant={actionVariant[item.action]}
                      label={t(item.action)}
                    />
                  }
                />
              ))
            )}
          </SectionGroup>
        </>
      )}
    </WidgetShell>
  );
}
