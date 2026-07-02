/**
 * Subscription Admin Referrals Widget
 * Summary stats, referral codes table, payout requests with actions
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe/ui/web/ui/alert-dialog";
import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { ChevronLeft } from "next-vibe/ui/web/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/web/ui/icons/ChevronRight";
import { Loader2 } from "next-vibe/ui/web/ui/icons/Loader2";
import { RefreshCw } from "next-vibe/ui/web/ui/icons/RefreshCw";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { SelectFieldWidget } from "next-vibe/unified-ui/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/form-fields/text-field/widget";
import React, { useCallback, useState } from "react";

import { PayoutStatus } from "@/app/api/[locale]/referral/enum";

import { PayoutAction } from "../enum";
import type definition from "./definition";
import type { ReferralsGetResponseOutput } from "./definition";

type ReferralCode = NonNullable<
  ReferralsGetResponseOutput["response"]
>["codes"][number];
type PayoutRequest = NonNullable<
  ReferralsGetResponseOutput["response"]
>["payoutRequests"][number];

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

const STATUS_COLORS: Record<string, string> = {
  [PayoutStatus.PENDING]: "bg-warning/10 text-warning",
  [PayoutStatus.APPROVED]: "bg-info/10 text-info",
  [PayoutStatus.REJECTED]: "bg-destructive/10 text-destructive",
  [PayoutStatus.PROCESSING]:
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  [PayoutStatus.COMPLETED]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  [PayoutStatus.FAILED]: "bg-destructive/10 text-destructive",
};

function StatCard({
  label,
  value,
  locale,
}: {
  label: string;
  value: number | string;
  locale: CountryLanguage;
}): React.JSX.Element {
  return (
    <Div className="rounded-lg border p-3 text-center">
      <Div className="text-2xl font-bold tabular-nums">
        {typeof value === "number" ? value.toLocaleString(locale) : value}
      </Div>
      <Div className="text-xs text-muted-foreground mt-1">{label}</Div>
    </Div>
  );
}

function CodeRow({
  code,
  locale,
  t,
}: {
  code: ReferralCode;
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
}): React.JSX.Element {
  return (
    <Div className="flex items-start justify-between gap-3 py-3">
      <Div className="flex-1 min-w-0 space-y-1">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-mono font-medium text-sm">{code.code}</Span>
          <Badge
            className={
              code.isActive
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "bg-muted text-muted-foreground"
            }
          >
            {code.isActive ? t("widget.codeActive") : t("widget.codeInactive")}
          </Badge>
        </Div>
        <Div className="text-sm text-muted-foreground">
          {code.ownerEmail || code.ownerName}
        </Div>
        <Div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Span>
            {code.currentUses} {t("widget.clicks")}
          </Span>
          <Span>
            {code.totalSignups} {t("widget.signups")}
          </Span>
          <Span>
            {code.totalEarned.toLocaleString(locale)} {t("widget.earned")}
          </Span>
          <Span>{formatSimpleDate(code.createdAt, locale)}</Span>
        </Div>
      </Div>
    </Div>
  );
}

function PayoutRow({
  payout,
  locale,
  t,
  onAction,
}: {
  payout: PayoutRequest;
  locale: CountryLanguage;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  onAction: (
    requestId: string,
    action: (typeof PayoutAction)[keyof typeof PayoutAction],
  ) => void;
}): React.JSX.Element {
  return (
    <Div className="flex items-start justify-between gap-3 py-4">
      <Div className="flex-1 min-w-0 space-y-1">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-medium text-sm">{payout.userEmail}</Span>
          <Badge
            className={
              STATUS_COLORS[payout.status] ?? "bg-muted text-muted-foreground"
            }
          >
            {payout.status}
          </Badge>
        </Div>
        <Div className="text-sm text-muted-foreground">
          <Span className="tabular-nums">
            {payout.amountCents.toLocaleString(locale)}
          </Span>{" "}
          {payout.currency}
        </Div>
        {payout.walletAddress ? (
          <Div className="text-xs text-muted-foreground truncate max-w-xs">
            {payout.walletAddress}
          </Div>
        ) : null}
        {payout.rejectionReason ? (
          <Div className="text-xs text-destructive">
            {payout.rejectionReason}
          </Div>
        ) : null}
        <Div className="text-xs text-muted-foreground">
          {formatSimpleDate(payout.createdAt, locale)}
        </Div>
      </Div>
      <Div className="flex flex-col gap-1 shrink-0">
        {payout.status === PayoutStatus.PENDING ? (
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={(): void => onAction(payout.id, PayoutAction.APPROVE)}
            >
              {t("widget.approve")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs text-destructive"
              onClick={(): void => onAction(payout.id, PayoutAction.REJECT)}
            >
              {t("widget.reject")}
            </Button>
          </>
        ) : null}
        {payout.status === PayoutStatus.APPROVED ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={(): void => onAction(payout.id, PayoutAction.COMPLETE)}
          >
            {t("widget.complete")}
          </Button>
        ) : null}
      </Div>
    </Div>
  );
}

interface PendingAction {
  requestId: string;
  action: (typeof PayoutAction)[keyof typeof PayoutAction];
}

export function ReferralsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const { pop: goBack, canGoBack } = navigation;
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.GET>();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const summary = data?.response?.summary;
  const codes = data?.response?.codes ?? [];
  const payoutRequests = data?.response?.payoutRequests ?? [];
  const isLoading = data === null || data === undefined;
  const currentPage = data?.paginationInfo?.page ?? 1;
  const totalPages = data?.paginationInfo?.pageCount ?? 1;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handlePageChange = useCallback(
    (page: number): void => {
      form.setValue("paginationInfo.page", page);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handlePayoutAction = (
    requestId: string,
    action: (typeof PayoutAction)[keyof typeof PayoutAction],
  ): void => {
    setPendingAction({ requestId, action });
  };

  const handleConfirm = (): void => {
    if (!pendingAction) {
      return;
    }
    const { requestId, action } = pendingAction;
    setPendingAction(null);
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigation.push(def.POST, {
        data: { requestId, action },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleDialogClose = (open: boolean): void => {
    if (!open) {
      setPendingAction(null);
    }
  };

  if (isLoading) {
    return (
      <Div className="h-[300px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b">
        {canGoBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              goBack();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <Span className="font-semibold text-base mr-auto">
          {t("get.title")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Summary Stats */}
      {summary ? (
        <Div className="grid grid-cols-5 gap-2 p-4 border-b">
          <StatCard
            label={t("get.response.summary.totalCodes.label")}
            value={summary.totalCodes}
            locale={locale}
          />
          <StatCard
            label={t("get.response.summary.totalSignups.label")}
            value={summary.totalSignups}
            locale={locale}
          />
          <StatCard
            label={t("get.response.summary.totalEarned.label")}
            value={summary.totalEarned}
            locale={locale}
          />
          <StatCard
            label={t("get.response.summary.totalPaidOut.label")}
            value={summary.totalPaidOut}
            locale={locale}
          />
          <StatCard
            label={t("get.response.summary.pendingPayouts.label")}
            value={summary.pendingPayouts}
            locale={locale}
          />
        </Div>
      ) : null}

      {/* Search & Filters */}
      <Div className="px-4 pt-3 pb-1">
        <TextFieldWidget
          fieldName={"searchFilters.search"}
          field={children.searchFilters.children.search}
        />
      </Div>
      <Div className="px-4 pb-2 grid grid-cols-2 gap-2">
        <SelectFieldWidget
          fieldName="searchFilters.payoutStatus"
          field={children.searchFilters.children.payoutStatus}
        />
        <SelectFieldWidget
          fieldName="sortingOptions.sortBy"
          field={children.sortingOptions.children.sortBy}
        />
      </Div>

      {/* Referral Codes Section */}
      <Div className="px-4 pt-2">
        <Span className="font-semibold text-sm">
          {t("widget.sectionCodes")}
        </Span>
      </Div>
      <Div className="px-4 pb-2 overflow-y-auto max-h-[min(400px,calc(50dvh-200px))]">
        {codes.length > 0 ? (
          <Div className="divide-y">
            {codes.map((code) => (
              <CodeRow key={code.code} code={code} locale={locale} t={t} />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-6 text-sm">
            {t("widget.noReferrals")}
          </Div>
        )}
      </Div>

      {/* Payout Requests Section */}
      <Div className="px-4 pt-2 border-t">
        <Span className="font-semibold text-sm">
          {t("widget.sectionPayouts")}
        </Span>
      </Div>
      <Div className="px-4 pb-2 overflow-y-auto max-h-[min(400px,calc(50dvh-200px))]">
        {payoutRequests.length > 0 ? (
          <Div className="divide-y">
            {payoutRequests.map((payout) => (
              <PayoutRow
                key={payout.id}
                payout={payout}
                locale={locale}
                t={t}
                onAction={handlePayoutAction}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-6 text-sm">
            {t("widget.noPayouts")}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {currentPage} / {totalPages}
          </Span>
          <Div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Div>
        </Div>
      )}

      {/* Payout action confirmation dialog */}
      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={handleDialogClose}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("widget.confirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("widget.confirm.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("widget.confirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {t("widget.confirm.proceed")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Div>
  );
}
