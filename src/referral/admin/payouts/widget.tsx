"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  formatCurrency,
  formatDate,
} from "next-vibe/core/i18n/core/localization-utils";
import { Alert } from "next-vibe/ui/components/alert";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  RelatedEntitiesPanel,
  type RelatedEntityItem,
  useRelatedEntityNavigation,
} from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import { PayoutStatus, type PayoutStatusValue } from "../../enum";
import type { ReferralT } from "../../i18n";
import { getAdminPayoutActions } from "../../payout-actions";
import definitions, { type AdminPayoutsGetResponseOutput } from "./definition";

type Payout = AdminPayoutsGetResponseOutput["items"][number];

const statusVariants: Record<typeof PayoutStatusValue, StatusPillVariant> = {
  [PayoutStatus.PENDING]: "warning",
  [PayoutStatus.APPROVED]: "info",
  [PayoutStatus.REJECTED]: "danger",
  [PayoutStatus.PROCESSING]: "info",
  [PayoutStatus.COMPLETED]: "success",
  [PayoutStatus.FAILED]: "danger",
};

const actionLabels = {
  approve: "admin.payouts.widget.approve",
  reject: "admin.payouts.widget.reject",
  complete: "admin.payouts.widget.complete",
} as const;

const actionDescriptions = {
  approve: "admin.payouts.widget.approveDetail",
  reject: "admin.payouts.widget.rejectDetail",
  complete: "admin.payouts.widget.completeDetail",
} as const;

function formatPayoutValue(
  item: Payout,
  locale: CountryLanguage,
  t: ReferralT,
): string {
  return t("admin.payouts.widget.amount", {
    credits: item.amountCents.toLocaleString(locale.split("-")[0]),
    value: formatCurrency(item.amountCents / 100, "USD", locale),
  });
}

export function AdminPayoutsContainer({
  field: { children },
}: {
  field: typeof definitions.GET.fields;
}): JSX.Element {
  const data = useWidgetValue<typeof definitions.GET>();
  const form = useWidgetForm<typeof definitions.GET>();
  const t = useWidgetTranslation<typeof definitions.GET>();
  const locale = useWidgetLocale();
  const response = useWidgetResponse();
  const navigate = useRelatedEntityNavigation();
  const onSubmit = useWidgetOnSubmit();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const { read } = useWidgetEndpointMutations() ?? {};
  const isFetching = read?.isFetching ?? false;
  const canFilter = interactive && !responseOnly && Boolean(onSubmit);
  const userId = form?.watch("userId");
  const requestId = form?.watch("requestId");
  const page = data?.resultPage ?? 1;
  const pageCount = data
    ? Math.max(1, Math.ceil(data.totalCount / data.pageSize))
    : 1;

  function goToPage(nextPage: number): void {
    form.setValue("page", nextPage);
    onSubmit?.();
  }

  function clearFilters(): void {
    form.reset({ userId, requestId, page: 1, limit: data?.pageSize ?? 20 });
    onSubmit?.();
  }

  function buildRow(item: Payout): RelatedEntityItem {
    const badges = (
      <StatusPill
        status={t(item.status)}
        variant={statusVariants[item.status]}
      />
    );
    const meta = (
      <Div className="flex w-full min-w-0 flex-col gap-2 text-sm">
        <Span className="block break-all font-mono text-xs">{item.id}</Span>
        <Div className="grid min-w-0 gap-1 @sm:grid-cols-2">
          <Span>
            {t("admin.payouts.widget.requestedAt", {
              date: formatDate(new Date(item.createdAt), locale, "PP p"),
            })}
          </Span>
          {item.processedAt && (
            <Span>
              {t("admin.payouts.widget.processedAt", {
                date: formatDate(new Date(item.processedAt), locale, "PP p"),
              })}
            </Span>
          )}
        </Div>
        {item.walletAddress && (
          <Span className="block break-all font-mono text-xs">
            {item.walletAddress}
          </Span>
        )}
        {item.rejectionReason && (
          <Span className="break-words">
            {t("admin.payouts.widget.rejectionReason", {
              reason: item.rejectionReason,
            })}
          </Span>
        )}
        {item.adminNotes && (
          <Span className="break-words">
            {t("admin.payouts.widget.adminNotes", {
              notes: item.adminNotes,
            })}
          </Span>
        )}
        {canFilter && (
          <Div className="flex flex-wrap gap-2">
            {getAdminPayoutActions(item).map((action) => (
              <Button
                key={action}
                type="button"
                size="sm"
                variant={action === "reject" ? "destructive" : "outline"}
                aria-label={t("admin.payouts.widget.actionFor", {
                  action: t(actionLabels[action]),
                  email: item.userEmail,
                })}
                onClick={() =>
                  navigate(() => Promise.resolve(definitions.POST), {
                    data: { requestId: item.id, action },
                    renderInModal: true,
                    popNavigationOnSuccess: 1,
                  })
                }
              >
                {t(actionLabels[action])}
              </Button>
            ))}
          </Div>
        )}
      </Div>
    );
    return {
      id: item.id,
      title: item.userEmail,
      subtitle: t("admin.payouts.widget.payoutSummary", {
        amount: formatPayoutValue(item, locale, t),
        currency: t(item.currency),
      }),
      badges,
      meta,
      action: canFilter
        ? {
            label: t("admin.payouts.widget.openPartner"),
            ariaLabel: t("admin.payouts.widget.openPartnerFor", {
              email: item.userEmail,
            }),
            onClick: () =>
              navigate(
                () =>
                  import("@/users/view/definition").then(
                    (module) => module.default.GET,
                  ),
                {
                  data: { userId: item.userId },
                },
              ),
          }
        : undefined,
    };
  }

  return (
    <WidgetShell className="gap-4">
      {canFilter && (
        <>
          <WidgetHeader
            title={t("admin.payouts.get.title")}
            backButton={<NavigateButtonWidget field={children.backButton} />}
          />
          {userId && (
            <Div className="flex flex-col gap-1">
              <Span className="text-sm font-medium">
                {t("admin.payouts.fields.userId.label")}
              </Span>
              <Span className="break-all text-xs text-muted-foreground">
                {data?.items[0]?.userEmail ?? userId}
              </Span>
            </Div>
          )}
          <Div className="grid min-w-0 gap-3 @sm:grid-cols-2">
            <TextFieldWidget fieldName="search" field={children.search} />
            <SelectFieldWidget fieldName="status" field={children.status} />
          </Div>
          <Div className="flex flex-wrap items-center gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={isFetching}
              onClick={() => form.setValue("page", 1)}
            >
              {t("admin.payouts.widget.apply")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isFetching}
              onClick={clearFilters}
            >
              {t("admin.payouts.widget.clear")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={isFetching}
              onClick={() => {
                void read?.refetch();
              }}
            >
              {t("admin.payouts.widget.refresh")}
            </Button>
          </Div>
        </>
      )}
      <FormAlertWidget field={{}} />
      {((!data && !response) || isFetching) && (
        <LoadingBlock message={t("admin.payouts.widget.loading")} size="sm" />
      )}
      {data && response?.success !== false && !isFetching && (
        <>
          <RelatedEntitiesPanel
            title={t("admin.payouts.widget.results", {
              count: data.totalCount,
            })}
            emptyTitle={t("admin.payouts.widget.empty")}
            emptyMessage={t("admin.payouts.widget.emptyHint")}
            items={data.items.map(buildRow)}
          />
          <Div className="flex flex-wrap items-center gap-2">
            {canFilter && page > 1 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => goToPage(page - 1)}
              >
                {t("admin.payouts.widget.previous")}
              </Button>
            )}
            {(page > 1 || pageCount > 1) && (
              <Span className="text-sm tabular-nums text-muted-foreground">
                {t("admin.payouts.widget.page", { page, total: pageCount })}
              </Span>
            )}
            {canFilter && page < pageCount && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => goToPage(page + 1)}
              >
                {t("admin.payouts.widget.next")}
              </Button>
            )}
          </Div>
        </>
      )}
    </WidgetShell>
  );
}

export function PayoutActionContainer({
  field: { children },
}: {
  field: typeof definitions.POST.fields;
}): JSX.Element {
  const form = useWidgetForm<typeof definitions.POST>();
  const value = useWidgetValue<typeof definitions.POST>();
  const t = useWidgetTranslation<typeof definitions.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const responseOnly = useWidgetResponseOnly();
  const requestId = form?.watch("requestId");
  const action = form?.watch("action");
  const lookup = children.requestId.schema.safeParse(requestId);
  const lookupId = lookup.success ? lookup.data : undefined;
  const definitionsRead = useMemo(() => ({ GET: definitions.GET }), []);
  const options = useMemo(
    () => ({
      read: {
        initialState: {
          requestId: lookupId,
          userId: undefined,
          page: 1,
          limit: 1,
        },
        queryOptions: {
          enabled: Boolean(lookupId) && !responseOnly,
          refetchOnWindowFocus: false,
        },
      },
    }),
    [lookupId, responseOnly],
  );
  const { read } = useEndpoint(definitionsRead, options, logger, user);
  const payout = read.response?.success
    ? read.data?.items.find((item) => item.id === lookupId)
    : undefined;
  const allowedActions = payout ? getAdminPayoutActions(payout) : [];
  const allowed =
    !read.isFetching && Boolean(action && allowedActions.includes(action));

  return (
    <WidgetShell className="gap-4">
      {!responseOnly && (
        <>
          <WidgetHeader
            title={t("admin.payouts.post.title")}
            backButton={<NavigateButtonWidget field={children.backButton} />}
          />
          <Div
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
          >
            <TextFieldWidget fieldName="requestId" field={children.requestId} />
          </Div>
          {lookupId && read.isFetching && (
            <LoadingBlock message={t("admin.payouts.widget.loading")} />
          )}
          {lookupId && !read.isFetching && !payout && (
            <EmptyBlock
              title={t("admin.payouts.widget.lookupFailed")}
              message={read.error?.message ?? t("payout.errors.notFound")}
              action={{
                label: t("admin.payouts.widget.refresh"),
                onClick: () => {
                  void read.refetch();
                },
              }}
            />
          )}
          {payout && (
            <DetailGrid columns={2}>
              <DetailField
                label={t("admin.payouts.fields.userId.label")}
                value={payout.userEmail}
              />
              <DetailField
                label={t("admin.payouts.widget.state")}
                value={
                  <StatusPill
                    status={t(payout.status)}
                    variant={statusVariants[payout.status]}
                  />
                }
              />
              <DetailField
                label={t("admin.payouts.widget.valueLabel")}
                value={formatPayoutValue(payout, locale, t)}
              />
              <DetailField
                label={t("admin.payouts.widget.destinationLabel")}
                value={t(payout.currency)}
              />
              {payout.walletAddress && (
                <DetailField
                  label={t("payout.fields.walletAddress.label")}
                  value={payout.walletAddress}
                  mono
                  copyable
                />
              )}
            </DetailGrid>
          )}
          {payout && allowedActions.length > 0 && (
            <SelectFieldWidget
              fieldName="action"
              field={{
                ...children.action,
                options: children.action.options.filter((option) =>
                  allowedActions.includes(option.value),
                ),
              }}
            />
          )}
          {payout &&
            (!allowedActions.length ||
              Boolean(action && !allowedActions.includes(action))) && (
              <Span className="text-sm text-muted-foreground">
                {t("payout.errors.invalidStatus")}
              </Span>
            )}
          {allowed && action && (
            <>
              <Span className="text-sm text-muted-foreground">
                {t(actionDescriptions[action])}
              </Span>
              {action === "reject" ? (
                <TextFieldWidget
                  fieldName="rejectionReason"
                  field={children.rejectionReason}
                />
              ) : (
                <TextFieldWidget
                  fieldName="adminNotes"
                  field={children.adminNotes}
                />
              )}
              <SubmitButtonWidget<typeof definitions.POST>
                field={children.submitButton}
              />
            </>
          )}
        </>
      )}
      <FormAlertWidget field={{}} />
      {value?.message && <Alert variant="success">{value.message}</Alert>}
    </WidgetShell>
  );
}
