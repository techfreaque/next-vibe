/**
 * User Detail/Edit/Delete Widget
 * Rich admin user management UI with nav stack integration
 */

"use client";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "next-vibe/ui/components/accordion";
import { Button } from "next-vibe/ui/components/button";
import { Checkbox } from "next-vibe/ui/components/checkbox";
import { Div } from "next-vibe/ui/components/div";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "next-vibe/ui/components/form/form";
import { Bookmark } from "next-vibe/ui/components/icons/Bookmark";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Edit } from "next-vibe/ui/components/icons/Edit";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { User } from "next-vibe/ui/components/icons/User";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { Input } from "next-vibe/ui/components/input";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { canRetryRecordRead } from "next-vibe/unified-ui/_shared/admin-record-context";
import { AdminRecordDetail } from "next-vibe/unified-ui/_shared/admin-record-detail";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetDisabled,
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React, { useCallback, useState } from "react";

import { AccountRoleBadge } from "../../account-role-badge";
import { formatNumber, formatReferralEarning } from "../../format";
import type { UserViewTab } from "../../view/definition";
import { scopedTranslation as accountTranslation } from "../../view/i18n";
import definition from "./definition";

interface GetWidgetProps {
  field: (typeof definition.GET)["fields"];
}

interface PutWidgetProps {
  field: (typeof definition.PUT)["fields"];
}

interface DeleteWidgetProps {
  field: (typeof definition.DELETE)["fields"];
}

export function UserDetailContainer({
  field,
}: GetWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const openRelated = useRelatedEntityNavigation();
  const locale = useWidgetLocale();
  const accountT = accountTranslation.scopedT(locale).t;
  const t = useWidgetTranslation<typeof definition.GET>();
  const viewer = useWidgetUser();
  const form = useWidgetForm<typeof definition.GET>();
  const read = useWidgetEndpointMutations()?.read;
  const { push: navigate, canGoBack } = useWidgetNavigation();
  const logger = useWidgetLogger();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLeadId, setCopiedLeadId] = useState(false);

  // Flatten data - handle both nested and flat response formats
  const email = data?.email ?? data?.userProfile?.basicInfo?.email;
  const privateName =
    data?.privateName ?? data?.userProfile?.basicInfo?.privateName;
  const publicName =
    data?.publicName ?? data?.userProfile?.basicInfo?.publicName;
  const userId = data?.userProfile?.basicInfo?.id;
  const isActive = data?.isActive ?? data?.accountStatus?.isActive;
  const emailVerified =
    data?.emailVerified ?? data?.accountStatus?.emailVerified;
  const stripeCustomerId =
    data?.stripeCustomerId ?? data?.accountStatus?.stripeCustomerId;
  const userRoles = data?.userRoles ?? data?.accountStatus?.userRoles ?? [];
  const createdAt = data?.createdAt ?? data?.timestamps?.createdAt;
  const updatedAt = data?.updatedAt ?? data?.timestamps?.updatedAt;
  const leadId = data?.leadId;

  // Target-user engagement + credits (scoped to [id], never the viewer)
  const engagement = data?.engagement;
  const referralInfo = data?.referralInfo;
  const creditBalance = engagement?.creditBalance;
  const freeAllowance = engagement?.freeAllowance;
  const lifetimeCreditsSpent = engagement?.lifetimeCreditsSpent;
  const favoritesCount = engagement?.favoritesCount;
  const customSkillsCount = engagement?.customSkillsCount;
  const newsletterConsent = engagement?.newsletterConsent ?? false;
  const hasConfirmedNewsletter = engagement?.hasConfirmedNewsletter ?? false;
  const totalReferrals = referralInfo?.totalReferrals ?? 0;
  const earnings = referralInfo?.earningsByUnit ?? [];
  const fmtNum = (n: number | null | undefined): string =>
    n === null || n === undefined ? "–" : formatNumber(n, locale);

  const handleEdit = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    const defs = await import("./definition");
    navigate(defs.default.PUT, {
      urlPathParams: { id: userId },
      popNavigationOnSuccess: 1,
    });
  }, [navigate, userId]);

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }
    const defs = await import("./definition");
    navigate(defs.default.DELETE, {
      urlPathParams: { id: userId },
      popNavigationOnSuccess: 1,
    });
  }, [navigate, userId]);

  const handleViewLead = useCallback((): void => {
    if (!leadId) {
      return;
    }
    void (async (): Promise<void> => {
      const leadDef = await import("@/leads/[id]/definition");
      navigate(leadDef.default.GET, { urlPathParams: { id: leadId } });
    })();
  }, [navigate, leadId]);

  const handleCopyUserId = useCallback((): void => {
    if (!userId) {
      return;
    }
    void (async (): Promise<void> => {
      await copyToClipboard(userId, logger);
      setCopiedId(true);
      setTimeout((): void => {
        setCopiedId(false);
      }, 2000);
    })();
  }, [userId, logger]);

  const handleCopyLeadId = useCallback((): void => {
    if (!leadId) {
      return;
    }
    void (async (): Promise<void> => {
      await copyToClipboard(leadId, logger);
      setCopiedLeadId(true);
      setTimeout((): void => {
        setCopiedLeadId(false);
      }, 2000);
    })();
  }, [leadId, logger]);

  const requestedId = form?.watch("id");
  const openDirectory = (): void => {
    openRelated(() =>
      import("../../list/definition").then((m) => m.default.GET),
    );
  };
  const openProfile = (tab?: UserViewTab): void => {
    if (userId) {
      openRelated(
        () => import("../../view/definition").then((m) => m.default.GET),
        { data: { userId, tab } },
      );
    }
  };
  const openGrant = (): void => {
    if (userId) {
      openRelated(
        () =>
          import("@/credits/admin-add/definition").then((m) => m.default.POST),
        { data: { targetUserId: userId }, renderInModal: true },
      );
    }
  };

  if (!data) {
    if (response?.success === false) {
      const status = response.errorType.errorCode;
      return (
        <AdminRecordDetail
          title={t("id.get.title")}
          backButton={
            interactive && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={openDirectory}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                {accountT("widget.actions.browse")}
              </Button>
            )
          }
          state={{
            kind: "error",
            title: accountT("widget.unavailable"),
            message:
              status === 404
                ? accountT("errors.notFound.description")
                : response.message,
            action:
              interactive && requestedId && canRetryRecordRead(status)
                ? {
                    label: accountT("widget.actions.retry"),
                    onClick: () => void read?.refetch(),
                  }
                : undefined,
          }}
        />
      );
    }
    if (requestedId && read?.isLoading !== false) {
      return (
        <AdminRecordDetail
          title={t("id.get.title")}
          backButton={<NavigateButtonWidget field={children.backButton} />}
          state={{ kind: "loading", label: accountT("widget.loading") }}
        />
      );
    }
    return (
      <WidgetShell>
        <WidgetHeader
          title={t("id.get.title")}
          backButton={<NavigateButtonWidget field={children.backButton} />}
        />
        {interactive && !responseOnly && (
          <>
            <EntityPickerFieldWidget fieldName="id" field={children.id} />
            <SubmitButtonWidget<typeof definition.GET>
              field={{ text: "id.get.titleShort" }}
            />
          </>
        )}
        <FormAlertWidget field={{}} />
      </WidgetShell>
    );
  }

  const name = privateName || publicName || email || t("id.widget.userProfile");
  const isAdmin =
    !viewer.isPublic && viewer.roles.includes(UserPermissionRole.ADMIN);
  const related = [
    { tab: "billing", label: t("id.widget.relatedPayments"), icon: CreditCard },
    { tab: "credits", label: accountT("tabs.credits"), icon: Wallet },
    {
      tab: "activity",
      label: t("id.widget.relatedThreadActivity"),
      icon: MessageSquare,
    },
    { tab: "referrals", label: accountT("tabs.referrals"), icon: Users },
  ] satisfies Array<{
    tab: UserViewTab;
    label: string;
    icon: typeof CreditCard;
  }>;

  return (
    <AdminRecordDetail
      title={name}
      subtitle={email !== name ? email : undefined}
      backButton={
        canGoBack ? (
          <NavigateButtonWidget field={children.backButton} />
        ) : (
          interactive && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openDirectory}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              {accountT("widget.actions.browse")}
            </Button>
          )
        )
      }
      status={{
        status: isActive ? "active" : "inactive",
        label: t(isActive ? "id.widget.active" : "id.widget.inactive"),
        variant: isActive ? "success" : "muted",
      }}
      titleAccessory={
        <Span className="text-xs text-muted-foreground">
          {accountT(emailVerified ? "status.verified" : "status.unverified")}
        </Span>
      }
      actions={
        interactive &&
        userId && (
          <Div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <Button type="button" onClick={openGrant}>
                <Coins aria-hidden="true" className="size-4" />
                {accountT("widget.actions.addCredits")}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => openProfile()}
            >
              {t("id.widget.fullProfile")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => void handleEdit()}
            >
              <Edit aria-hidden="true" className="size-4" />
              {t("id.put.titleShort")}
            </Button>
          </Div>
        )
      }
    >
      <Div className="flex min-w-0 flex-col gap-4">
        {publicName && publicName !== name && (
          <P className="text-sm text-muted-foreground">{publicName}</P>
        )}
        {/* Roles */}
        {userRoles.length > 0 && (
          <Div className="flex items-center gap-2 flex-wrap">
            <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {userRoles.map((r) => (
              <AccountRoleBadge key={r.id} role={r.role} locale={locale} />
            ))}
          </Div>
        )}

        {interactive && userId && (
          <SectionGroup title={t("id.widget.relatedRecords")}>
            <Div className="grid grid-cols-2 gap-2 @lg:grid-cols-4">
              {related.map(({ tab, label, icon: Icon }) => (
                <Button
                  key={tab}
                  type="button"
                  variant="outline"
                  className="h-auto min-h-11 min-w-0 justify-start gap-2 whitespace-normal px-3 text-start"
                  onClick={() => openProfile(tab)}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  <Span className="min-w-0 [overflow-wrap:anywhere]">
                    {label}
                  </Span>
                </Button>
              ))}
            </Div>
          </SectionGroup>
        )}

        {/* Timestamps */}
        <Div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          {createdAt && (
            <Div>
              <Span className="block font-medium text-foreground">
                {t("id.widget.created")}
              </Span>
              {formatSimpleDate(createdAt, locale)}
            </Div>
          )}
          {updatedAt && (
            <Div>
              <Span className="block font-medium text-foreground">
                {t("id.widget.lastUpdated")}
              </Span>
              {formatSimpleDate(updatedAt, locale)}
            </Div>
          )}
        </Div>

        {/* Engagement & credits (target [id] user, not the viewer) */}
        <Div className="pt-2 border-t">
          <H2 className="text-base font-semibold">
            {t("id.widget.engagementTitle")}
          </H2>
          <Div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            <Div className="rounded-lg border bg-card p-3 flex flex-col gap-1">
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wallet className="h-3.5 w-3.5" />
                {t("id.widget.balance")}
              </Div>
              <Span className="text-lg font-bold tabular-nums">
                {fmtNum(creditBalance)}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-3 flex flex-col gap-1">
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Gift className="h-3.5 w-3.5" />
                {t("id.widget.freeAllowance")}
              </Div>
              <Span className="text-lg font-bold tabular-nums">
                {fmtNum(freeAllowance)}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-3 flex flex-col gap-1">
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Coins className="h-3.5 w-3.5" />
                {t("id.widget.lifetimeSpend")}
              </Div>
              <Span className="text-lg font-bold tabular-nums">
                {fmtNum(lifetimeCreditsSpent)}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-3 flex flex-col gap-1">
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CreditCard className="h-3.5 w-3.5" />
                {t("id.widget.earned")}
              </Div>
              {earnings.length === 0 ? (
                <Span className="text-sm text-muted-foreground">
                  {t(
                    referralInfo?.earningsByUnit
                      ? "id.widget.noEarnings"
                      : "id.widget.earningUnitsUnavailable",
                  )}
                </Span>
              ) : (
                earnings.map(({ unit, confirmed, pending }) => (
                  <Div key={unit} className="flex min-w-0 flex-col gap-1">
                    <Span className="text-lg font-semibold tabular-nums">
                      {formatReferralEarning(confirmed, unit, locale)}
                    </Span>
                    {pending > 0 && (
                      <Span className="text-xs text-muted-foreground">
                        {t("id.widget.earnedPending")}{" "}
                        {formatReferralEarning(pending, unit, locale)}
                      </Span>
                    )}
                  </Div>
                ))
              )}
            </Div>
            <Div className="rounded-lg border bg-card p-3 flex flex-col gap-1">
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {t("id.widget.referred")}
              </Div>
              <Span className="text-lg font-bold tabular-nums">
                {fmtNum(totalReferrals)}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-3 flex flex-col gap-1">
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Bookmark className="h-3.5 w-3.5" />
                {t("id.widget.favorites")}
              </Div>
              <Span className="text-lg font-bold tabular-nums">
                {fmtNum(favoritesCount)}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-3 flex flex-col gap-1">
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                {t("id.widget.skills")}
              </Div>
              <Span className="text-lg font-bold tabular-nums">
                {fmtNum(customSkillsCount)}
              </Span>
            </Div>
            <Div className="rounded-lg border bg-card p-3 flex flex-col gap-1">
              <Div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {t("id.widget.newsletter")}
              </Div>
              <Span className="inline-flex items-center gap-1 text-sm font-medium">
                {hasConfirmedNewsletter ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-success" />
                    {t("id.widget.newsletterConfirmed")}
                  </>
                ) : newsletterConsent ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-warning" />
                    {t("id.widget.newsletterConsent")}
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                    {t("id.widget.newsletterNone")}
                  </>
                )}
              </Span>
            </Div>
          </Div>
        </Div>
        <Accordion collapsible className="rounded-lg border bg-card px-3">
          <AccordionItem value="record-references" className="border-0">
            <AccordionTrigger className="text-start">
              {t("id.widget.identifiers")}
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {userId && (
                <Div className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
                  <Span className="break-all font-mono text-xs text-muted-foreground">
                    {userId}
                  </Span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyUserId}
                    aria-label={t("id.widget.titleCopyUserId")}
                  >
                    {copiedId ? (
                      <CheckCircle className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </Div>
              )}
              {/* Stripe info */}
              {stripeCustomerId && (
                <Div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 flex-shrink-0" />
                  <Span className="font-mono text-xs truncate">
                    {stripeCustomerId}
                  </Span>
                </Div>
              )}

              {/* Lead ID info row */}
              {leadId && (
                <Div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Span className="text-muted-foreground text-xs">
                    {t("id.widget.leadId")}
                  </Span>
                  <Span className="font-mono text-xs truncate max-w-[160px] text-muted-foreground">
                    {leadId}
                  </Span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-9 p-0 text-muted-foreground hover:text-foreground"
                    onClick={handleCopyLeadId}
                    title={t("id.widget.copyLeadId")}
                  >
                    {copiedLeadId ? (
                      <CheckCircle className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2 text-sm text-muted-foreground hover:text-foreground"
                    onClick={handleViewLead}
                  >
                    {t("id.widget.viewLead")}
                  </Button>
                </Div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {interactive && isAdmin && userId && (
          <SectionGroup title={t("id.widget.dangerZone")}>
            <Div className="flex flex-wrap items-center justify-between gap-3">
              <P className="min-w-0 break-words text-sm text-muted-foreground">
                {t("id.widget.deleteAccountHint", { name })}
              </P>
              <Button
                type="button"
                variant="outline"
                className="min-h-10 border-destructive/30 text-destructive"
                onClick={() => void handleDelete()}
              >
                <Trash2 aria-hidden="true" className="size-4" />
                {t("id.delete.titleShort")}
              </Button>
            </Div>
          </SectionGroup>
        )}
      </Div>
    </AdminRecordDetail>
  );
}

export function UserEditContainer({
  field: { children },
}: PutWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.PUT>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const accountT = accountTranslation.scopedT(locale).t;
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const readOnly = useWidgetDisabled();
  const submitting = useWidgetIsSubmitting();
  const disabled = readOnly || submitting;
  const form = useWidgetForm<typeof definition.PUT>();
  const result = useWidgetValue<typeof definition.PUT>();
  const navigate = useRelatedEntityNavigation();
  const id = form?.watch("id");
  const emailDraft = form?.watch("email");
  const banChange = form?.watch("isBanned");
  const read = useEndpoint(
    { GET: definition.GET },
    {
      read: {
        urlPathParams: { id: id ?? "" },
        queryOptions: { enabled: Boolean(id && interactive && !responseOnly) },
      },
    },
    logger,
    user,
  ).read;
  const record =
    read?.data?.userProfile?.basicInfo.id === id ? read?.data : undefined;
  const title = t("id.put.title");
  const back = <NavigateButtonWidget field={children.backButton} />;

  if (result?.id && (responseOnly || result.id === id)) {
    return (
      <AdminRecordDetail
        title={t("id.put.success.title")}
        subtitle={result.email}
        backButton={back}
        actions={
          interactive &&
          !responseOnly && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(
                  () =>
                    import("./definition").then((module) => module.default.GET),
                  {
                    urlPathParams: { id: result.id },
                  },
                )
              }
            >
              {t("id.get.titleShort")}
            </Button>
          )
        }
      >
        <Span>{result.privateName || result.publicName || result.email}</Span>
      </AdminRecordDetail>
    );
  }
  if (!id) {
    return (
      <WidgetShell>
        <WidgetHeader title={title} backButton={back} />
        <EntityPickerFieldWidget fieldName="id" field={children.id} />
      </WidgetShell>
    );
  }
  if (!record) {
    const error = read?.response?.success === false ? read.response : undefined;
    return (
      <AdminRecordDetail
        title={title}
        backButton={back}
        state={
          error
            ? {
                kind: "error",
                title: accountT("widget.unavailable"),
                message: error.message,
                action: canRetryRecordRead(error.errorType.errorCode)
                  ? {
                      label: accountT("widget.actions.retry"),
                      onClick: () => void read?.refetch(),
                    }
                  : undefined,
              }
            : { kind: "loading", label: accountT("widget.loading") }
        }
      />
    );
  }
  const info = record.userProfile.basicInfo;
  if (banChange !== undefined) {
    const action = accountT(banChange ? "ban.banUser" : "ban.unbanUser");
    return (
      <AdminForm
        title={action}
        description={info.email}
        backButton={back}
        primaryAction={
          <Button
            type="submit"
            data-testid="endpoint-submit"
            disabled={disabled}
            variant={banChange ? "destructive" : "default"}
          >
            {action}
          </Button>
        }
      >
        <P>
          {t(banChange ? "id.widget.confirmBan" : "id.widget.confirmUnban", {
            name: info.privateName || info.publicName || info.email,
          })}
        </P>
        {banChange && (
          <FormField
            name="bannedReason"
            control={form.control}
            render={({ field: input }) => (
              <FormItem>
                <FormLabel>{t("id.put.bannedReason.label")}</FormLabel>
                <FormControl>
                  <Input
                    value={input.value ?? ""}
                    name={input.name}
                    onChangeText={input.onChange}
                    onBlur={input.onBlur}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage t={t} />
              </FormItem>
            )}
          />
        )}
      </AdminForm>
    );
  }
  const action = t("id.widget.saveAccount");
  return (
    <AdminForm
      title={t("id.widget.editAccountNamed", {
        name: info.privateName || info.publicName || info.email,
      })}
      description={info.email}
      className="[&_h1]:[overflow-wrap:anywhere] [&_h1+p]:[overflow-wrap:anywhere]"
      backButton={back}
      primaryAction={
        <Button
          type="submit"
          data-testid="endpoint-submit"
          disabled={disabled || !form.formState.isDirty}
        >
          {action}
        </Button>
      }
    >
      <AdminFormSection title={t("id.put.sections.basicInfo.title")}>
        {(["email", "privateName", "publicName"] as const).map((name) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field: input }) => {
              const value = input.value ?? info[name] ?? "";
              const wrapEmail =
                name === "email" && platform === Platform.NEXT_PAGE;
              const control = (
                <FormControl>
                  <Input
                    type={name === "email" ? "email" : "text"}
                    name={name}
                    value={value}
                    className={
                      wrapEmail
                        ? "peer absolute inset-0 h-full text-transparent focus:text-foreground"
                        : undefined
                    }
                    onChangeText={(nextValue) =>
                      form.setValue(
                        name,
                        nextValue === info[name] ? undefined : nextValue,
                        { shouldDirty: true },
                      )
                    }
                    onBlur={input.onBlur}
                    disabled={disabled}
                  />
                </FormControl>
              );
              return (
                <FormItem>
                  <FormLabel>{t(children[name].label)}</FormLabel>
                  {wrapEmail ? (
                    <Div className="relative min-w-0">
                      {control}
                      <Span
                        aria-hidden="true"
                        className="pointer-events-none relative block min-h-9 px-[13px] py-2 text-sm leading-5 [overflow-wrap:anywhere] peer-focus:invisible"
                      >
                        {value}
                      </Span>
                    </Div>
                  ) : (
                    control
                  )}
                  <FormMessage t={t} />
                </FormItem>
              );
            }}
          />
        ))}
      </AdminFormSection>
      <AdminFormSection
        title={t("id.put.sections.adminSettings.title")}
        columns={2}
      >
        {(["isActive", "emailVerified"] as const).map((name) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field: input }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    name={name}
                    checked={
                      input.value ??
                      (name === "emailVerified" &&
                      emailDraft !== undefined &&
                      emailDraft !== info.email
                        ? false
                        : record.accountStatus[name])
                    }
                    onCheckedChange={(value) =>
                      form.setValue(name, value, { shouldDirty: true })
                    }
                    disabled={disabled}
                  />
                </FormControl>
                <FormLabel>{t(children[name].label)}</FormLabel>
              </FormItem>
            )}
          />
        ))}
      </AdminFormSection>
    </AdminForm>
  );
}

export function UserDeleteContainer({
  field,
}: DeleteWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.DELETE>();
  const locale = useWidgetLocale();
  const { canGoBack, pop } = useWidgetNavigation();
  const isSubmitting = useWidgetIsSubmitting();
  const t = useWidgetTranslation<typeof definition.DELETE>();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 pb-2 border-b">
        {data?.success && <NavigateButtonWidget field={children.backButton} />}
        <H2 className="font-semibold text-base text-destructive">
          {t("id.delete.title")}
        </H2>
      </Div>

      {data?.success ? (
        <Div className="rounded-lg border border-success/30 bg-success/10 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
          <Div>
            <Span className="font-medium text-sm block text-success-foreground">
              {data.message ?? t("id.widget.userDeletedSuccessfully")}
            </Span>
            {data.deletedAt && (
              <Span className="text-xs text-success">
                {t("id.widget.deletedAt")}{" "}
                {new Date(data.deletedAt).toLocaleString(locale)}
              </Span>
            )}
          </Div>
        </Div>
      ) : (
        <>
          <Div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <Div className="flex items-center gap-2 mb-2">
              <Trash2 className="h-5 w-5 text-destructive flex-shrink-0" />
              <Span className="font-medium text-sm text-destructive">
                {t("id.widget.confirmDeletion")}
              </Span>
            </Div>
            <P className="text-sm text-muted-foreground">
              {t("id.widget.confirmDeletionMessage")}
            </P>
          </Div>
          <FormAlertWidget field={{}} />
          <Div className="flex flex-wrap items-center justify-end gap-2">
            {canGoBack && (
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => pop()}
              >
                {t("id.widget.cancelDeletion")}
              </Button>
            )}
            <SubmitButtonWidget<typeof definition.DELETE>
              field={children.submitButton}
            />
          </Div>
        </>
      )}
    </Div>
  );
}
