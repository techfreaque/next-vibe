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
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "next-vibe/ui/components/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "next-vibe/ui/components/form/form";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Edit } from "next-vibe/ui/components/icons/Edit";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { MoreHorizontal } from "next-vibe/ui/components/icons/MoreHorizontal";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { User } from "next-vibe/ui/components/icons/User";
import { Users } from "next-vibe/ui/components/icons/Users";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { Input } from "next-vibe/ui/components/input";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
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
import { UserDeleteDialog } from "./delete-dialog";

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
  const [deleteOpen, setDeleteOpen] = useState(false);

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
    n === null || n === undefined ? "-" : formatNumber(n, locale);

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
              status === 404 || status === 400
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
  const credits = (n: number | null | undefined): string =>
    n === null || n === undefined
      ? "-"
      : t("id.widget.creditsAmount", { count: formatNumber(n, locale) });
  const related = [
    {
      tab: "billing",
      label: t("id.widget.relatedPayments"),
      icon: CreditCard,
      count: engagement?.paymentsCount,
    },
    {
      tab: "credits",
      label: accountT("tabs.credits"),
      icon: Wallet,
      count: engagement?.creditEntriesCount,
    },
    {
      tab: "activity",
      label: t("id.widget.relatedThreadActivity"),
      icon: MessageSquare,
      count: engagement?.threadsCount,
    },
    {
      tab: "referrals",
      label: accountT("tabs.referrals"),
      icon: Users,
      count: totalReferrals,
    },
  ] satisfies Array<{
    tab: UserViewTab;
    label: string;
    icon: typeof CreditCard;
    count: number | undefined;
  }>;
  const earningsValue =
    earnings.length === 0
      ? t("id.widget.noEarnings")
      : earnings
          .map(({ unit, confirmed }) =>
            formatReferralEarning(confirmed, unit, locale),
          )
          .join(" · ");
  const pendingEarnings = earnings.filter(({ pending }) => pending > 0);
  const moreActions = [
    {
      key: "edit",
      label: t("id.widget.editAccount"),
      icon: Edit,
      run: (): void => void handleEdit(),
    },
    {
      key: "copy",
      label: t("id.widget.titleCopyUserId"),
      icon: copiedId ? CheckCircle : Copy,
      run: handleCopyUserId,
    },
    ...(leadId
      ? [
          {
            key: "lead",
            label: t("id.widget.viewLead"),
            icon: User,
            run: handleViewLead,
          },
        ]
      : []),
  ];

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
        <StatusPill
          status={emailVerified ? "verified" : "unverified"}
          label={accountT(
            emailVerified ? "status.verified" : "status.unverified",
          )}
          variant={emailVerified ? "info" : "warning"}
        />
      }
      actions={
        interactive &&
        userId && (
          <Div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline">
                  <MoreHorizontal aria-hidden="true" className="size-4" />
                  {t("id.widget.moreActions")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                collisionPadding={12}
                className="min-w-48"
              >
                <DropdownMenuItem
                  className="gap-2 @md:hidden"
                  onSelect={() => openProfile()}
                >
                  <User aria-hidden="true" className="size-4" />
                  {t("id.widget.fullProfile")}
                </DropdownMenuItem>
                {moreActions.map(({ key, label, icon: ActionIcon, run }) => (
                  <DropdownMenuItem
                    key={key}
                    className="gap-2"
                    onSelect={() => run()}
                  >
                    <ActionIcon aria-hidden="true" className="size-4" />
                    {label}
                  </DropdownMenuItem>
                ))}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 text-destructive"
                      onSelect={() => setDeleteOpen(true)}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                      {t("id.widget.deleteAccount")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              type="button"
              variant="outline"
              className="hidden @md:inline-flex"
              onClick={() => openProfile()}
            >
              {t("id.widget.fullProfile")}
            </Button>
            {isAdmin && (
              <Button type="button" onClick={openGrant}>
                <Coins aria-hidden="true" className="size-4" />
                {accountT("widget.actions.addCredits")}
              </Button>
            )}
          </Div>
        )
      }
    >
      <MetricGrid columns={4}>
        <MetricCard
          label={t("id.widget.balance")}
          value={credits(creditBalance)}
          description={
            freeAllowance === undefined
              ? undefined
              : t("id.widget.freeAllowanceHint", {
                  count: formatNumber(freeAllowance, locale),
                })
          }
          icon={<Wallet className="size-4" />}
        />
        <MetricCard
          label={t("id.widget.lifetimeSpend")}
          value={credits(lifetimeCreditsSpent)}
          icon={<Coins className="size-4" />}
        />
        <MetricCard
          label={t("id.widget.earned")}
          value={earningsValue}
          description={
            pendingEarnings.length > 0
              ? `${t("id.widget.earnedPending")} ${pendingEarnings
                  .map(({ unit, pending }) =>
                    formatReferralEarning(pending, unit, locale),
                  )
                  .join(" · ")}`
              : undefined
          }
          className={
            earnings.length === 0
              ? "[&>div:nth-child(2)>span]:text-base [&>div:nth-child(2)>span]:font-medium [&>div:nth-child(2)>span]:text-muted-foreground"
              : undefined
          }
          icon={<CreditCard className="size-4" />}
        />
        <MetricCard
          label={t("id.widget.referred")}
          value={fmtNum(totalReferrals)}
          icon={<Users className="size-4" />}
        />
      </MetricGrid>

      <Div className="grid min-w-0 gap-4 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <SectionGroup title={t("id.widget.accountTitle")}>
          <DetailGrid columns={2}>
            <DetailField
              label={t("id.widget.publicName")}
              value={publicName || "-"}
            />
            <DetailField
              label={t("id.widget.roles")}
              value={
                userRoles.length > 0 ? (
                  <Div className="flex flex-wrap gap-1.5">
                    {userRoles.map((r) => (
                      <AccountRoleBadge
                        key={r.id}
                        role={r.role}
                        locale={locale}
                      />
                    ))}
                  </Div>
                ) : (
                  "-"
                )
              }
            />
            <DetailField
              label={t("id.widget.newsletter")}
              value={
                <Span className="inline-flex items-center gap-1.5">
                  {hasConfirmedNewsletter ? (
                    <CheckCircle className="size-4 text-success" />
                  ) : newsletterConsent ? (
                    <CheckCircle className="size-4 text-warning" />
                  ) : (
                    <XCircle className="size-4 text-muted-foreground" />
                  )}
                  {t(
                    hasConfirmedNewsletter
                      ? "id.widget.newsletterConfirmed"
                      : newsletterConsent
                        ? "id.widget.newsletterConsent"
                        : "id.widget.newsletterNone",
                  )}
                </Span>
              }
            />
            <DetailField
              label={t("id.widget.savedItems")}
              value={t("id.widget.savedItemsValue", {
                favorites: fmtNum(favoritesCount),
                skills: fmtNum(customSkillsCount),
              })}
            />
            <DetailField
              label={t("id.widget.created")}
              value={createdAt ? formatSimpleDate(createdAt, locale) : "-"}
            />
            <DetailField
              label={t("id.widget.lastUpdated")}
              value={updatedAt ? formatSimpleDate(updatedAt, locale) : "-"}
            />
          </DetailGrid>
        </SectionGroup>

        {interactive && userId && (
          <SectionGroup title={t("id.widget.relatedRecords")}>
            <Div className="-mx-2 flex flex-col">
              {related.map(({ tab, label, icon: Icon, count }) => (
                <Button
                  key={tab}
                  type="button"
                  variant="ghost"
                  className="h-auto min-h-11 w-full min-w-0 justify-start gap-3 px-2 text-start font-normal"
                  onClick={() => openProfile(tab)}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <Span className="min-w-0 flex-1 truncate">{label}</Span>
                  {count !== undefined && (
                    <Span
                      aria-hidden="true"
                      className="rounded-full bg-muted px-2 text-xs tabular-nums text-muted-foreground"
                    >
                      {formatNumber(count, locale)}
                    </Span>
                  )}
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                </Button>
              ))}
            </Div>
          </SectionGroup>
        )}
      </Div>

      <Accordion collapsible className="rounded-lg border bg-card px-4">
        <AccordionItem value="record-references" className="border-0">
          <AccordionTrigger className="text-start text-sm">
            {t("id.widget.identifiers")}
          </AccordionTrigger>
          <AccordionContent>
            <DetailGrid columns={2}>
              {userId && (
                <DetailField
                  label={t("id.widget.userId")}
                  value={userId}
                  mono
                  copyable
                  copyLabel={t("id.widget.titleCopyUserId")}
                />
              )}
              {leadId && (
                <DetailField
                  label={t("id.widget.leadId")}
                  value={leadId}
                  mono
                  copyable
                  copyLabel={t("id.widget.copyLeadId")}
                />
              )}
              {stripeCustomerId && (
                <DetailField
                  label={t("id.widget.stripeCustomer")}
                  value={stripeCustomerId}
                  mono
                  copyable
                />
              )}
            </DetailGrid>
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
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 aria-hidden="true" className="size-4" />
              {t("id.widget.deleteAccount")}
            </Button>
          </Div>
          <UserDeleteDialog
            userId={userId}
            name={name}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onDeleted={openDirectory}
          />
        </SectionGroup>
      )}
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
