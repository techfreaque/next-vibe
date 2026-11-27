"use client";

import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";
import { isAgentPlatform, isCliPlatform } from "next-vibe/platforms/platforms";
import { Alert } from "next-vibe/ui/components/alert";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
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
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import payouts from "@/referral/admin/payouts/definition";
import { scopedTranslation as referralTranslation } from "@/referral/i18n";
import { getAdminPayoutActions } from "@/referral/payout-actions";

import { PayoutAction } from "../enum";
import definition from "./definition";

const payoutRead = { GET: payouts.GET };
const actionValue = {
  approve: PayoutAction.APPROVE,
  reject: PayoutAction.REJECT,
  complete: PayoutAction.COMPLETE,
};

export default function ReferralPayoutAction({
  field: { children },
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const form = useWidgetForm<typeof definition.POST>();
  const value = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const responseOnly = useWidgetResponseOnly();
  const platform = useWidgetPlatform();
  const { t: referralT } = referralTranslation.scopedT(locale);
  const navigation = useWidgetNavigation();
  const request = children.requestId.schema.safeParse(form?.watch("requestId"));
  const requestId = request.success ? request.data : undefined;
  const action = form?.watch("action");
  const options = useMemo(
    () => ({
      read: {
        initialState: { requestId, userId: undefined, page: 1, limit: 1 },
        queryOptions: { enabled: Boolean(requestId) && !responseOnly },
      },
    }),
    [requestId, responseOnly],
  );
  const { read } = useEndpoint(payoutRead, options, logger, user);
  const payout = read.data?.items.find((item) => item.id === requestId);
  const allowed = payout
    ? getAdminPayoutActions(payout).map((key) => actionValue[key])
    : [];
  const canSubmit = action !== undefined && allowed.includes(action);
  const isRejecting = action === PayoutAction.REJECT;
  const title = canSubmit
    ? referralT(
        isRejecting
          ? "admin.payouts.widget.reject"
          : action === PayoutAction.APPROVE
            ? "admin.payouts.widget.approve"
            : "admin.payouts.widget.complete",
      )
    : t("post.title");
  const showForm = !responseOnly && !value?.success;

  if (isCliPlatform(platform) || isAgentPlatform(platform)) {
    return (
      <WidgetShell>
        <FormAlertWidget field={{}} />
        {value?.message && <Alert variant="success">{value.message}</Alert>}
      </WidgetShell>
    );
  }

  return (
    <WidgetShell className="mx-auto w-full max-w-3xl gap-4">
      <WidgetHeader size="page" title={title} />
      {showForm && requestId && read.isFetching && (
        <LoadingBlock message={referralT("admin.payouts.widget.loading")} />
      )}
      {showForm && !payout && !read.isFetching && (
        <EmptyBlock
          title={
            requestId
              ? referralT("admin.payouts.widget.lookupFailed")
              : t("widget.sectionPayouts")
          }
          message={
            requestId
              ? (read.error?.message ?? referralT("payout.errors.notFound"))
              : t("post.description")
          }
          action={{
            label: t("widget.sectionPayouts"),
            onClick: () => navigation.push(definition.GET, {}),
          }}
        />
      )}
      {showForm && payout && (
        <>
          <DetailGrid columns={2}>
            <DetailField
              label={referralT("admin.payouts.widget.col.partner")}
              value={payout.partnerName ?? payout.userEmail}
            />
            <DetailField
              label={referralT("admin.payouts.widget.state")}
              value={referralT(payout.status)}
            />
            <DetailField
              label={referralT("admin.payouts.widget.valueLabel")}
              value={formatCurrency(payout.amountCents / 100, "USD", locale)}
            />
            <DetailField
              label={referralT("admin.payouts.widget.destinationLabel")}
              value={referralT(payout.currency)}
            />
          </DetailGrid>
          {allowed.length > 0 ? (
            <SelectFieldWidget
              fieldName="action"
              field={{
                ...children.action,
                options: children.action.options.filter((option) =>
                  allowed.includes(option.value),
                ),
              }}
            />
          ) : (
            <Alert>{referralT("payout.errors.invalidStatus")}</Alert>
          )}
          {canSubmit && (
            <>
              {isRejecting ? (
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
              <SubmitButtonWidget<typeof definition.POST>
                field={{}}
                label={title}
                variant={isRejecting ? "destructive" : "default"}
              />
            </>
          )}
        </>
      )}
      <FormAlertWidget field={{}} />
      {value?.message && <Alert variant="success">{value.message}</Alert>}
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          className="self-start"
          onClick={() => navigation.pop()}
        >
          {t("widget.confirm.cancel")}
        </Button>
      )}
    </WidgetShell>
  );
}
