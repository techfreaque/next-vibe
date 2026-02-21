/**
 * User Detail/Edit/Delete Widget
 * Rich admin user management UI with nav stack integration
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  BarChart2,
  CheckCircle,
  Copy,
  CreditCard,
  Edit,
  Link,
  Loader2,
  Mail,
  Package,
  Shield,
  Trash2,
  User,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { UuidFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/uuid-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import type definition from "./definition";

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;
type PutResponseOutput = typeof definition.PUT.types.ResponseOutput;
type DeleteResponseOutput = typeof definition.DELETE.types.ResponseOutput;

interface GetWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

interface PutWidgetProps {
  field: {
    value: PutResponseOutput | null | undefined;
  } & (typeof definition.PUT)["fields"];
  fieldName: string;
}

interface DeleteWidgetProps {
  field: {
    value: DeleteResponseOutput | null | undefined;
  } & (typeof definition.DELETE)["fields"];
  fieldName: string;
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  PARTNER_ADMIN:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  PARTNER_EMPLOYEE:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  CUSTOMER:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  PUBLIC: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

export function UserDetailContainer({
  field,
}: GetWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const router = useRouter();
  const isLoading = !data;
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

  const handleEdit = useCallback((): void => {
    if (!userId) {
      return;
    }
    router.push(`/${locale}/admin/users/${userId}/edit`);
  }, [router, locale, userId]);

  const handleDelete = useCallback((): void => {
    if (!userId) {
      return;
    }
    router.push(`/${locale}/admin/users/${userId}/edit`);
  }, [router, locale, userId]);

  const handleViewCreditHistory = useCallback((): void => {
    if (!userId) {
      return;
    }
    router.push(`/${locale}/admin/users/${userId}/edit`);
  }, [router, locale, userId]);

  const handleViewLead = useCallback((): void => {
    if (!leadId) {
      return;
    }
    router.push(`/${locale}/admin/leads/${leadId}/edit`);
  }, [router, locale, leadId]);

  const handleFullProfile = useCallback((): void => {
    if (!userId) {
      return;
    }
    router.push(`/${locale}/admin/users/${userId}/edit`);
  }, [router, locale, userId]);

  const handleReferralStats = useCallback((): void => {
    router.push(`/${locale}/admin/users/${userId ?? ""}/edit`);
  }, [router, locale, userId]);

  const handleSubscription = useCallback((): void => {
    router.push(`/${locale}/admin/users/${userId ?? ""}/edit`);
  }, [router, locale, userId]);

  const handleCopyUserId = useCallback((): void => {
    if (!userId) {
      return;
    }
    void (async (): Promise<void> => {
      await navigator.clipboard.writeText(userId);
      setCopiedId(true);
      setTimeout((): void => {
        setCopiedId(false);
      }, 2000);
    })();
  }, [userId]);

  const handleCopyLeadId = useCallback((): void => {
    if (!leadId) {
      return;
    }
    void (async (): Promise<void> => {
      await navigator.clipboard.writeText(leadId);
      setCopiedLeadId(true);
      setTimeout((): void => {
        setCopiedLeadId(false);
      }, 2000);
    })();
  }, [leadId]);

  if (isLoading) {
    return (
      <Div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  const initials = (privateName ?? email ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base mr-auto">
          {t("app.api.users.user.id.widget.userProfile")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          title="Edit"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={handleDelete}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </Div>

      <Div className="p-4 flex flex-col gap-4">
        {/* Avatar + identity */}
        <Div className="flex items-center gap-4">
          <Div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
            {initials}
          </Div>
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span className="font-semibold text-lg">
                {privateName ?? "—"}
              </Span>
              {publicName && publicName !== privateName && (
                <Span className="text-muted-foreground text-sm">
                  ({publicName})
                </Span>
              )}
              <Div className="flex gap-1 flex-wrap">
                {isActive ? (
                  <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle className="h-3 w-3" />{" "}
                    {t("app.api.users.user.id.widget.active")}
                  </Span>
                ) : (
                  <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    <XCircle className="h-3 w-3" />{" "}
                    {t("app.api.users.user.id.widget.inactive")}
                  </Span>
                )}
              </Div>
            </Div>
            <Div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <Mail className="h-3.5 w-3.5 flex-shrink-0" />
              <Span className="truncate">{email}</Span>
              {emailVerified ? (
                <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
              )}
            </Div>
            {/* User ID with copy button */}
            {userId && (
              <Div className="flex items-center gap-1 mt-0.5">
                <Span className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                  {userId}
                </Span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                  onClick={handleCopyUserId}
                  title="Copy User ID"
                >
                  {copiedId ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </Div>
            )}
          </Div>
        </Div>

        {/* Roles */}
        {userRoles.length > 0 && (
          <Div className="flex items-center gap-2 flex-wrap">
            <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {userRoles.map((r) => (
              <Span
                key={r.id}
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  ROLE_COLORS[r.role] ??
                    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
                )}
              >
                {String(r.role).replace(/_/g, " ")}
              </Span>
            ))}
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
              {t("app.api.users.user.id.widget.leadId")}
            </Span>
            <Span className="font-mono text-xs truncate max-w-[160px] text-muted-foreground">
              {leadId}
            </Span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
              onClick={handleCopyLeadId}
              title="Copy Lead ID"
            >
              {copiedLeadId ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 px-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleViewLead}
            >
              {t("app.api.users.user.id.widget.viewLead")}
            </Button>
          </Div>
        )}

        {/* Timestamps */}
        <Div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          {createdAt && (
            <Div>
              <Span className="block font-medium text-foreground">
                {t("app.api.users.user.id.widget.created")}
              </Span>
              {formatSimpleDate(createdAt, locale)}
            </Div>
          )}
          {updatedAt && (
            <Div>
              <Span className="block font-medium text-foreground">
                {t("app.api.users.user.id.widget.lastUpdated")}
              </Span>
              {formatSimpleDate(updatedAt, locale)}
            </Div>
          )}
        </Div>

        {/* Quick actions */}
        <Div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFullProfile}
            className="gap-1"
            title="View full profile with stats"
          >
            <BarChart2 className="h-3.5 w-3.5" />
            {t("app.api.users.user.id.widget.fullProfile")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReferralStats}
            className="gap-1"
            title="View referral codes and stats"
          >
            <Link className="h-3.5 w-3.5" />
            {t("app.api.users.user.id.widget.referrals")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSubscription}
            className="gap-1"
            title="View subscription"
          >
            <Package className="h-3.5 w-3.5" />
            {t("app.api.users.user.id.widget.subscription")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleViewCreditHistory}
            className="gap-1"
          >
            <CreditCard className="h-3.5 w-3.5" />
            {t("app.api.users.user.id.widget.creditHistory")}
          </Button>
        </Div>
      </Div>
    </Div>
  );
}

export function UserEditContainer({
  field,
  fieldName,
}: PutWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const router = useRouter();
  const isLoading = data === null || data === undefined;
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLeadId, setCopiedLeadId] = useState(false);

  const userRoles = data?.userRoles ?? [];
  const stripeCustomerId = data?.stripeCustomerId;
  const createdAt = data?.createdAt;
  const updatedAt = data?.updatedAt;
  const leadId = data?.leadId;
  const email = data?.email;
  const privateName = data?.privateName;
  const publicName = data?.publicName;
  const userId = data?.id;

  const initials = (privateName ?? email ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleCopyUserId = useCallback((): void => {
    if (!userId) {
      return;
    }
    void (async (): Promise<void> => {
      await navigator.clipboard.writeText(userId);
      setCopiedId(true);
      setTimeout((): void => setCopiedId(false), 2000);
    })();
  }, [userId]);

  const handleCopyLeadId = useCallback((): void => {
    if (!leadId) {
      return;
    }
    void (async (): Promise<void> => {
      await navigator.clipboard.writeText(leadId);
      setCopiedLeadId(true);
      setTimeout((): void => setCopiedLeadId(false), 2000);
    })();
  }, [leadId]);

  const handleViewLead = useCallback((): void => {
    if (!leadId) {
      return;
    }
    router.push(`/${locale}/admin/leads/${leadId}/edit`);
  }, [router, locale, leadId]);

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.users.user.id.id.put.title")}
        </Span>
      </Div>

      {isLoading ? (
        <Div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      ) : (
        <Div className="p-4 flex flex-col gap-6">
          {/* User Profile Summary */}
          <Div className="flex items-center gap-4">
            <Div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
              {initials}
            </Div>
            <Div className="flex-1 min-w-0">
              <Div className="flex items-center gap-2 flex-wrap">
                <Span className="font-semibold text-lg">
                  {privateName ?? "—"}
                </Span>
                {publicName && publicName !== privateName && (
                  <Span className="text-muted-foreground text-sm">
                    ({publicName})
                  </Span>
                )}
                <Div className="flex gap-1 flex-wrap">
                  {data?.isActive ? (
                    <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle className="h-3 w-3" />{" "}
                      {t("app.api.users.user.id.widget.active")}
                    </Span>
                  ) : (
                    <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      <XCircle className="h-3 w-3" />{" "}
                      {t("app.api.users.user.id.widget.inactive")}
                    </Span>
                  )}
                </Div>
              </Div>
              <Div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <Span className="truncate">{email}</Span>
                {data?.emailVerified ? (
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                )}
              </Div>
              {userId && (
                <Div className="flex items-center gap-1 mt-0.5">
                  <Span className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                    {userId}
                  </Span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                    onClick={handleCopyUserId}
                    title="Copy User ID"
                  >
                    {copiedId ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </Div>
              )}
            </Div>
          </Div>

          {/* Roles */}
          {userRoles.length > 0 && (
            <Div className="flex items-center gap-2 flex-wrap">
              <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {userRoles.map((r) => (
                <Span
                  key={r.id}
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    ROLE_COLORS[r.role] ??
                      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
                  )}
                >
                  {String(r.role).replace(/_/g, " ")}
                </Span>
              ))}
            </Div>
          )}

          {/* Stripe + Lead + Timestamps info row */}
          <Div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {stripeCustomerId && (
              <Div className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 flex-shrink-0" />
                <Span className="font-mono truncate">{stripeCustomerId}</Span>
              </Div>
            )}
            {leadId && (
              <Div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 flex-shrink-0" />
                <Span className="font-mono truncate max-w-[140px]">
                  {leadId}
                </Span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                  onClick={handleCopyLeadId}
                  title="Copy Lead ID"
                >
                  {copiedLeadId ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleViewLead}
                >
                  {t("app.api.users.user.id.widget.viewLead")}
                </Button>
              </Div>
            )}
            {createdAt && (
              <Div className="flex items-center gap-1.5">
                <Span className="font-medium text-foreground">
                  {t("app.api.users.user.id.widget.created")}
                </Span>
                {formatSimpleDate(createdAt, locale)}
              </Div>
            )}
            {updatedAt && (
              <Div className="flex items-center gap-1.5">
                <Span className="font-medium text-foreground">
                  {t("app.api.users.user.id.widget.lastUpdated")}
                </Span>
                {formatSimpleDate(updatedAt, locale)}
              </Div>
            )}
          </Div>

          {/* Divider before edit form */}
          <Div className="border-t" />

          <FormAlertWidget field={{}} />

          {/* Basic Information */}
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("app.api.users.user.id.id.put.sections.basicInfo.title")}
            </Span>
            <EmailFieldWidget
              fieldName={`${fieldName}.email`}
              field={children.email}
            />
            <Div className="grid grid-cols-2 gap-3">
              <TextFieldWidget
                fieldName={`${fieldName}.privateName`}
                field={children.privateName}
              />
              <TextFieldWidget
                fieldName={`${fieldName}.publicName`}
                field={children.publicName}
              />
            </Div>
          </Div>

          {/* Administrative Settings */}
          <Div className="flex flex-col gap-3">
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t("app.api.users.user.id.id.put.sections.adminSettings.title")}
            </Span>
            <Div className="grid grid-cols-2 gap-3">
              <BooleanFieldWidget
                fieldName={`${fieldName}.isActive`}
                field={children.isActive}
              />
              <BooleanFieldWidget
                fieldName={`${fieldName}.emailVerified`}
                field={children.emailVerified}
              />
            </Div>
            <UuidFieldWidget
              fieldName={`${fieldName}.leadId`}
              field={children.leadId}
            />
          </Div>

          {/* Submit */}
          <Div className="flex items-center justify-end pt-2">
            <SubmitButtonWidget
              field={{
                text: "app.api.users.user.id.id.put.title",
                loadingText: "app.api.users.user.id.id.put.title",
                icon: "save",
                variant: "primary",
                size: "sm",
              }}
            />
          </Div>
        </Div>
      )}
    </Div>
  );
}

export function UserDeleteContainer({
  field,
}: DeleteWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const t = useWidgetTranslation();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base mr-auto text-destructive">
          {t("app.api.users.user.id.widget.deleteUser")}
        </Span>
      </Div>

      {data?.success && (
        <Div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <Div>
            <Span className="font-medium text-sm block text-green-700 dark:text-green-300">
              {data.message ??
                t("app.api.users.user.id.widget.userDeletedSuccessfully")}
            </Span>
            {data.deletedAt && (
              <Span className="text-xs text-green-600 dark:text-green-400">
                {t("app.api.users.user.id.widget.deletedAt")}{" "}
                {new Date(data.deletedAt).toLocaleString()}
              </Span>
            )}
          </Div>
        </Div>
      )}

      {!data && (
        <Div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20 p-4">
          <Div className="flex items-center gap-2 mb-2">
            <Trash2 className="h-5 w-5 text-destructive flex-shrink-0" />
            <Span className="font-medium text-sm text-destructive">
              {t("app.api.users.user.id.widget.confirmDeletion")}
            </Span>
          </Div>
          <P className="text-sm text-muted-foreground">
            {t("app.api.users.user.id.widget.confirmDeletionMessage")}
          </P>
        </Div>
      )}
    </Div>
  );
}
