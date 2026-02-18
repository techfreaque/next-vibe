/**
 * User Create Widget
 * Shows form state and rich success state after user creation
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  CheckCircle,
  Copy,
  CreditCard,
  ExternalLink,
  History,
  Mail,
  RotateCcw,
  Shield,
  UserCheck,
  UserPlus,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import type definition from "./definition";

type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

const handleCreateAnother = (): void => {
  // No-op: mutation reset is not available via endpointMutations context
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  PARTNER_ADMIN:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  CUSTOMER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

export function UserCreateContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const t = useWidgetTranslation();
  const router = useRouter();
  const locale = useWidgetLocale();

  const [idCopied, setIdCopied] = useState(false);

  const handleViewUser = (userId: string): void => {
    router.push(`/${locale}/admin/users/${userId}/edit`);
  };

  const handleFullProfile = (userId: string): void => {
    router.push(`/${locale}/admin/users/${userId}/edit`);
  };

  const handleCreditHistory = (userId: string): void => {
    router.push(`/${locale}/admin/users/${userId}/edit`);
  };

  const handleCopyId = (userId: string): void => {
    void (async (): Promise<void> => {
      await navigator.clipboard.writeText(userId);
      setIdCopied(true);
      setTimeout(() => {
        setIdCopied(false);
      }, 2000);
    })();
  };

  // Prefer nested userInfo, fall back to flat response fields
  const userId = data?.userInfo?.id ?? data?.responseId;
  const email = data?.userInfo?.email ?? data?.responseEmail;
  const privateName = data?.userInfo?.privateName ?? data?.responsePrivateName;
  const publicName = data?.userInfo?.publicName ?? data?.responsePublicName;
  const createdAt = data?.userInfo?.createdAt ?? data?.responseCreatedAt;
  const emailVerified = data?.responseEmailVerified;
  const isActive = data?.responseIsActive;
  const roles = data?.responseUserRoles ?? [];
  const stripeCustomerId = data?.responseStripeCustomerId;
  const created = data?.success?.created;
  const message = data?.success?.message;

  const initials = (privateName ?? email ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0] ?? "")
    .join("")
    .toUpperCase();

  if (created) {
    return (
      <Div className="flex flex-col gap-0">
        {/* Header */}
        <Div className="flex items-center gap-2 p-4 border-b">
          <NavigateButtonWidget field={children.backButton} />
          <Div className="flex items-center gap-2 mr-auto">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <Span className="font-semibold text-base">
              {t("app.api.users.create.widget.headerCreated")}
            </Span>
          </Div>
        </Div>

        <Div className="p-4 flex flex-col gap-4">
          {/* Success message banner */}
          {message && (
            <Div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-800 dark:text-green-300">
              {message}
            </Div>
          )}

          {/* User card */}
          <Div className="rounded-lg border bg-card p-4 flex items-start gap-4">
            {/* Avatar */}
            <Div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
              {initials}
            </Div>

            {/* Info */}
            <Div className="flex-1 min-w-0">
              {/* Name + status badges */}
              <Div className="flex items-center gap-2 flex-wrap">
                <Span className="font-semibold text-base">
                  {privateName ?? "—"}
                </Span>
                {publicName && publicName !== privateName && (
                  <Span className="text-sm text-muted-foreground">
                    ({publicName})
                  </Span>
                )}
                {isActive && (
                  <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {t("app.api.users.create.widget.activeBadge")}
                  </Span>
                )}
                {emailVerified && (
                  <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    <Mail className="h-3 w-3" />
                    {t("app.api.users.create.widget.verifiedBadge")}
                  </Span>
                )}
              </Div>

              {/* Email */}
              {email && (
                <Div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <Span className="truncate">{email}</Span>
                </Div>
              )}

              {/* Roles */}
              {roles.length > 0 && (
                <Div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  {roles.map((r, i) => {
                    const roleEntry = r as { id: string; role: string };
                    const roleName =
                      roleEntry.role.split(".").pop()?.toUpperCase() ??
                      roleEntry.role.toUpperCase();
                    return (
                      <Span
                        key={i}
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          ROLE_COLORS[roleName] ??
                            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                        )}
                      >
                        {roleName.replace(/_/g, " ")}
                      </Span>
                    );
                  })}
                </Div>
              )}

              {/* Stripe customer ID */}
              {stripeCustomerId && (
                <Div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5 flex-shrink-0" />
                  <Span className="font-mono truncate">{stripeCustomerId}</Span>
                </Div>
              )}

              {/* Timestamps + UUID with copy button */}
              <Div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground items-center">
                {createdAt && (
                  <Span>
                    {t("app.api.users.create.widget.createdPrefix")}{" "}
                    {formatSimpleDate(createdAt, locale)}
                  </Span>
                )}
                {userId && (
                  <Div className="flex items-center gap-1">
                    <Span className="font-mono opacity-60 truncate">
                      {userId}
                    </Span>
                    <Button
                      type="button"
                      title={
                        idCopied
                          ? t("app.api.users.create.widget.copiedTooltip")
                          : t("app.api.users.create.widget.copyUserIdTooltip")
                      }
                      onClick={() => {
                        handleCopyId(userId);
                      }}
                      className={cn(
                        "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs transition-colors",
                        idCopied
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <Copy className="h-3 w-3" />
                      {idCopied
                        ? t("app.api.users.create.widget.copiedButton")
                        : t("app.api.users.create.widget.copyIdButton")}
                    </Button>
                  </Div>
                )}
              </Div>
            </Div>
          </Div>

          {/* Primary actions */}
          {userId && (
            <Div className="flex flex-col gap-2">
              {/* Row 1: View User + Full Profile */}
              <Div className="flex gap-2">
                <Button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  onClick={() => {
                    handleViewUser(userId);
                  }}
                >
                  <UserPlus className="h-4 w-4" />
                  {t("app.api.users.create.widget.viewUserButton")}
                </Button>
                <Button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                  onClick={() => {
                    handleFullProfile(userId);
                  }}
                >
                  <UserCheck className="h-4 w-4" />
                  {t("app.api.users.create.widget.fullProfileButton")}
                </Button>
              </Div>

              {/* Row 2: Credit History */}
              <Button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
                onClick={() => {
                  handleCreditHistory(userId);
                }}
              >
                <History className="h-4 w-4 text-muted-foreground" />
                {t("app.api.users.create.widget.creditHistoryButton")}
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
              </Button>
            </Div>
          )}

          {/* Divider */}
          <Div className="border-t" />

          {/* Create Another User */}
          <Button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/50 transition-colors"
            onClick={handleCreateAnother}
          >
            <RotateCcw className="h-4 w-4" />
            {t("app.api.users.create.widget.createAnotherButton")}
          </Button>
        </Div>
      </Div>
    );
  }

  // Default: form state — framework renders form fields; widget provides the wrapper
  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <UserPlus className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.users.create.widget.headerCreate")}
          </Span>
        </Div>
        <Span className="text-xs text-muted-foreground hidden sm:block">
          {t("app.api.users.create.widget.headerSubtitle")}
        </Span>
      </Div>
    </Div>
  );
}
