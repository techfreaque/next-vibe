"use client";

import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
import { Alert } from "next-vibe/ui/components/alert";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "next-vibe/ui/components/form/form";
import { Input } from "next-vibe/ui/components/input";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  RelatedEntitiesPanel,
  useRelatedEntityNavigation,
} from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import { scopedTranslation as subscriptionTranslation } from "@/subscription/i18n";

import definitions from "./definition";

export function GrantRecipientContainer({
  field: { children },
}: {
  field: typeof definitions.GET.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.GET>();
  const value = useWidgetValue<typeof definitions.GET>();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const navigate = useRelatedEntityNavigation();
  const locale = useWidgetLocale();
  const { t: tSubscription } = subscriptionTranslation.scopedT(locale);
  const numbers = new Intl.NumberFormat(locale.split("-")[0], {
    maximumFractionDigits: 2,
  });
  const canAct = isInteractive && !responseOnly;
  const formatPrice = (amount: number, currency: string): string =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(
      amount,
    );

  return (
    <WidgetShell className="min-w-0 gap-4">
      <WidgetHeader title={t("adminAdd.recipient.title")} />
      <Span className="text-sm text-muted-foreground">
        {t("adminAdd.recipient.stepHint")}
      </Span>
      {canAct && (
        <Div className="flex min-w-0 flex-col gap-2 @md:flex-row @md:items-end">
          <Div className="min-w-0 flex-1">
            <TextFieldWidget
              field={children.targetUserId}
              fieldName="targetUserId"
            />
          </Div>
          <SubmitButtonWidget<typeof definitions.GET>
            field={{ text: "adminAdd.recipient.verify" }}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {value && (
        <Div className="flex min-w-0 flex-col gap-4 rounded-xl border border-success/40 bg-success/5 p-4">
          <Div className="flex min-w-0 flex-wrap items-center gap-2">
            <StatusPill
              status={t("adminAdd.recipient.verified")}
              variant="success"
            />
            <Span className="text-base font-semibold [overflow-wrap:anywhere]">
              {value.email}
            </Span>
          </Div>
          <DetailGrid columns={3}>
            <DetailField
              label={t("adminAdd.recipient.name")}
              value={value.name ?? t("adminAdd.recipient.noName")}
            />
            <DetailField
              label={t("adminAdd.recipient.kind")}
              value={t("adminAdd.recipient.kindAccount", {
                count: value.linkedDevices,
              })}
            />
            <DetailField
              label={t("adminAdd.recipient.subscription")}
              value={
                value.subscription
                  ? [
                      `${tSubscription(value.subscription.planId)} · ${tSubscription(value.subscription.status)}`,
                      ...(value.subscription.lastChargeAmount !== null &&
                      value.subscription.lastChargeCurrency
                        ? [
                            formatPrice(
                              value.subscription.lastChargeAmount,
                              value.subscription.lastChargeCurrency,
                            ),
                          ]
                        : []),
                      ...(value.subscription.currentPeriodEnd
                        ? [
                            t(
                              value.subscription.cancelAtPeriodEnd
                                ? "adminAdd.recipient.endsOn"
                                : "adminAdd.recipient.renewsOn",
                              {
                                date: formatDate(
                                  value.subscription.currentPeriodEnd,
                                  locale,
                                  "PP",
                                ),
                              },
                            ),
                          ]
                        : []),
                    ].join(" · ")
                  : t("adminAdd.recipient.noSubscription")
              }
            />
            <DetailField
              label={t("adminAdd.recipient.balance")}
              value={t("adminAdd.recipient.balanceSplit", {
                total: numbers.format(value.balance + value.freeBalance),
                paid: numbers.format(value.balance),
                free: numbers.format(value.freeBalance),
              })}
            />
            <DetailField
              label={t("adminAdd.recipient.joinedAt")}
              value={formatDate(value.joinedAt, locale, "PP")}
            />
            <DetailField
              label={t("adminAdd.recipient.accountId")}
              value={value.id}
              mono
              copyable
            />
          </DetailGrid>
          <Div className="flex min-w-0 flex-col gap-1">
            <Span className="text-xs font-medium text-muted-foreground">
              {t("adminAdd.recipient.recentGrants")}
            </Span>
            {value.recentGrants.length === 0 ? (
              <Span className="text-sm text-muted-foreground">
                {t("adminAdd.recipient.noGrants")}
              </Span>
            ) : (
              value.recentGrants.map((grant) => (
                <Span
                  key={`${grant.createdAt}-${grant.amount}`}
                  className="text-sm tabular-nums"
                >
                  {t("adminAdd.recipient.grantLine", {
                    count: numbers.format(grant.amount),
                    date: formatDate(grant.createdAt, locale, "PP"),
                  })}
                </Span>
              ))
            )}
          </Div>
          {canAct && (
            <Div className="flex flex-col gap-2 border-t pt-3">
              <Span className="text-sm font-medium">
                {t("adminAdd.recipient.nextStep")}
              </Span>
              <Div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    navigate(
                      () =>
                        import("./definition").then(
                          (module) => module.default.POST,
                        ),
                      { data: { targetUserId: value.id } },
                    )
                  }
                >
                  {t("adminAdd.recipient.grant")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      () =>
                        import("../history/definition").then(
                          (module) => module.default.GET,
                        ),
                      {
                        data: {
                          targetUserId: value.id,
                          paginationInfo: { page: 1, limit: 50 },
                        },
                      },
                    )
                  }
                >
                  {t("adminAdd.recipient.openLedger")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      () =>
                        import("@/users/view/definition").then(
                          (module) => module.default.GET,
                        ),
                      { data: { userId: value.id } },
                    )
                  }
                >
                  {t("adminAdd.recipient.openAccount")}
                </Button>
              </Div>
            </Div>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}

export function AdminAddCreditsContainer({
  field: { children },
}: {
  field: typeof definitions.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  const form = useWidgetForm<typeof definitions.POST>();
  const locale = useWidgetLocale();
  const numbers = new Intl.NumberFormat(locale.split("-")[0], {
    maximumFractionDigits: 2,
  });
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const responseOnly = useWidgetResponseOnly();
  const disabled = useWidgetDisabled();
  const isSubmitting = useWidgetIsSubmitting();
  const value = useWidgetValue<typeof definitions.POST>();
  const navigate = useRelatedEntityNavigation();
  const targetUserId = form?.watch("targetUserId");
  const grantAmount = Number(form?.watch("amount")) || 0;
  const { t: tSubscription } = subscriptionTranslation.scopedT(locale);
  const definitionsRead = useMemo(() => ({ GET: definitions.GET }), []);
  const options = useMemo(
    () => ({
      read: {
        initialState: { targetUserId: targetUserId ?? "" },
        queryOptions: {
          enabled: Boolean(targetUserId) && !responseOnly,
          refetchOnWindowFocus: false,
        },
      },
    }),
    [targetUserId, responseOnly],
  );
  const { read } = useEndpoint(definitionsRead, options, logger, user);
  const recipient =
    read.response?.success && read.data?.id === targetUserId
      ? read.data
      : undefined;

  return (
    <WidgetShell className="gap-4">
      {!responseOnly && (
        <>
          <WidgetHeader
            title={t("adminAdd.post.container.title")}
            backButton={<NavigateButtonWidget field={children.backButton} />}
          />
          <Span className="text-sm text-muted-foreground">
            {t("adminAdd.post.container.description")}
          </Span>
          {targetUserId && (
            <Span className="text-sm font-medium">
              {t("adminAdd.post.stepTwo")}
            </Span>
          )}
          {targetUserId ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              disabled={disabled || isSubmitting}
              onClick={() => {
                form.resetField("amount");
                form.setValue("targetUserId", "", { shouldDirty: true });
              }}
            >
              {t("adminAdd.recipient.change")}
            </Button>
          ) : (
            <EntityPickerFieldWidget
              field={children.targetUserId}
              fieldName="targetUserId"
            />
          )}
          {targetUserId &&
            !recipient &&
            (read.response?.success === false && !read.isFetching ? (
              <EmptyBlock
                title={t("adminAdd.recipient.loadFailed")}
                message={read.response.message}
                action={
                  disabled
                    ? undefined
                    : {
                        label: t("adminAdd.recipient.retry"),
                        onClick: () => {
                          void read.refetch();
                        },
                      }
                }
              />
            ) : (
              <LoadingBlock message={t("adminAdd.recipient.loading")} />
            ))}
          {recipient && (
            <>
              <RelatedEntitiesPanel
                title={t("adminAdd.recipient.email")}
                emptyTitle={t("adminAdd.recipient.loadFailed")}
                items={[
                  {
                    id: recipient.id,
                    title: recipient.email,
                    subtitle: [
                      ...(recipient.name ? [recipient.name] : []),
                      t("adminAdd.recipient.balanceSplit", {
                        total: numbers.format(
                          recipient.balance + recipient.freeBalance,
                        ),
                        paid: numbers.format(recipient.balance),
                        free: numbers.format(recipient.freeBalance),
                      }),
                      t("adminAdd.recipient.joinedLine", {
                        date: formatDate(recipient.joinedAt, locale, "PP"),
                      }),
                      recipient.subscription
                        ? `${tSubscription(recipient.subscription.planId)} · ${tSubscription(recipient.subscription.status)}`
                        : t("adminAdd.recipient.noSubscription"),
                      recipient.id,
                    ].join(" · "),
                    action: {
                      label: t("adminAdd.recipient.openAccount"),
                      onClick: () =>
                        navigate(
                          () =>
                            import("@/users/view/definition").then(
                              (module) => module.default.GET,
                            ),
                          { data: { userId: recipient.id } },
                        ),
                    },
                  },
                ]}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field: amount }) => (
                  <FormItem>
                    <FormLabel>{t("adminAdd.post.amount.label")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        keyboardType="numeric"
                        name={amount.name}
                        value={String(amount.value ?? "")}
                        onChange={(event) =>
                          amount.onChange(event.target.value)
                        }
                        onBlur={amount.onBlur}
                        placeholder={t("adminAdd.post.amount.placeholder")}
                        disabled={disabled}
                      />
                    </FormControl>
                    <Span className="text-sm text-muted-foreground">
                      {t("adminAdd.post.amount.description")}
                    </Span>
                    <FormMessage t={t} />
                  </FormItem>
                )}
              />
              <Div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || isSubmitting}
                  onClick={() =>
                    form.setValue("amount", 3000, { shouldDirty: true })
                  }
                >
                  {t("adminAdd.post.testerPreset")}
                </Button>
                <Span className="text-sm tabular-nums text-muted-foreground">
                  {t("adminAdd.post.preview", {
                    before: numbers.format(
                      recipient.balance + recipient.freeBalance,
                    ),
                    amount: numbers.format(grantAmount),
                    after: numbers.format(
                      recipient.balance + recipient.freeBalance + grantAmount,
                    ),
                  })}
                </Span>
              </Div>
              <Button
                type="submit"
                className="w-full"
                disabled={disabled || isSubmitting || !(grantAmount > 0)}
              >
                {isSubmitting
                  ? t("adminAdd.post.submitButton.loadingText")
                  : t("adminAdd.post.submitButton.label")}
              </Button>
            </>
          )}
        </>
      )}
      <FormAlertWidget field={{}} />
      {value?.message &&
        (responseOnly || value.recipientId === targetUserId) && (
          <Alert variant="success">{value.message}</Alert>
        )}
    </WidgetShell>
  );
}
