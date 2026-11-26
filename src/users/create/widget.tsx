/**
 * User Create Widget
 * Shows form state and rich success state after user creation
 */

"use client";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { UserPlus } from "next-vibe/ui/components/icons/UserPlus";
import { Span } from "next-vibe/ui/components/span";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  AdminForm,
  AdminFormSection,
} from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { MultiSelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/multiselect-field/widget";
import { PasswordFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/password-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React, { useEffect, useState } from "react";

import { AccountRoleBadge } from "../account-role-badge";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function UserCreateContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const { push: navigate } = useWidgetNavigation();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();

  const [idCopied, setIdCopied] = useState(false);
  const form = useWidgetForm<typeof definition.POST>();
  // The server creates active accounts unless told otherwise; show that.
  useEffect(() => {
    if (form && form.getValues("adminSettings.isActive") === undefined) {
      form.setValue("adminSettings.isActive", true);
    }
  }, [form]);

  const handleViewUser = (userId: string): void => {
    void (async (): Promise<void> => {
      const userDef = await import("../view/definition");
      navigate(userDef.default.GET, { data: { userId } });
    })();
  };

  const handleCopyId = (userId: string): void => {
    void (async (): Promise<void> => {
      await copyToClipboard(userId, logger);
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
            <CheckCircle className="h-5 w-5 text-success" />
            <Span className="font-semibold text-base">
              {t("widget.headerCreated")}
            </Span>
          </Div>
        </Div>

        <Div className="p-4 flex flex-col gap-4">
          {/* Success message banner */}
          {message && (
            <Div className="rounded-lg bg-success/10 border border-success/30 p-3 text-sm text-success-foreground">
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
                  {privateName ?? "-"}
                </Span>
                {publicName && publicName !== privateName && (
                  <Span className="text-sm text-muted-foreground">
                    ({publicName})
                  </Span>
                )}
                {isActive && (
                  <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                    {t("widget.activeBadge")}
                  </Span>
                )}
                {emailVerified && (
                  <Span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info">
                    <Mail className="h-3 w-3" />
                    {t("widget.verifiedBadge")}
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
                  {roles.map((entry) => (
                    <AccountRoleBadge
                      key={entry.id}
                      role={entry.role}
                      locale={locale}
                    />
                  ))}
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
                    {t("widget.createdPrefix")}{" "}
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
                          ? t("widget.copiedTooltip")
                          : t("widget.copyUserIdTooltip")
                      }
                      onClick={() => {
                        handleCopyId(userId);
                      }}
                      className={cn(
                        "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs transition-colors",
                        idCopied
                          ? "text-success"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <Copy className="h-3 w-3" />
                      {idCopied
                        ? t("widget.copiedButton")
                        : t("widget.copyIdButton")}
                    </Button>
                  </Div>
                )}
              </Div>
            </Div>
          </Div>

          {userId && (
            <Button type="button" onClick={() => handleViewUser(userId)}>
              <UserPlus className="size-4" />
              {t("widget.viewUserButton")}
            </Button>
          )}
        </Div>
      </Div>
    );
  }

  // Default: form state
  return (
    <AdminForm
      title={t("widget.headerCreate")}
      description={t("widget.headerSubtitle")}
      backButton={<NavigateButtonWidget field={children.backButton} />}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "widget.createButton" }}
        />
      }
    >
      <AdminFormSection title={t("widget.sections.signIn")} columns={2}>
        <EmailFieldWidget
          fieldName="basicInfo.email"
          field={children.basicInfo.children.email}
        />
        <PasswordFieldWidget
          fieldName="basicInfo.password"
          field={children.basicInfo.children.password}
        />
      </AdminFormSection>
      <AdminFormSection title={t("widget.sections.profile")} columns={2}>
        <TextFieldWidget
          fieldName="basicInfo.privateName"
          field={children.basicInfo.children.privateName}
        />
        <TextFieldWidget
          fieldName="basicInfo.publicName"
          field={children.basicInfo.children.publicName}
        />
        <SelectFieldWidget
          fieldName="basicInfo.country"
          field={children.basicInfo.children.country}
        />
        <SelectFieldWidget
          fieldName="basicInfo.language"
          field={children.basicInfo.children.language}
        />
      </AdminFormSection>
      <AdminFormSection title={t("widget.sections.access")}>
        <MultiSelectFieldWidget
          fieldName="adminSettings.roles"
          field={children.adminSettings.children.roles}
        />
        <Div className="grid gap-3 @sm:grid-cols-2">
          <BooleanFieldWidget
            fieldName="adminSettings.isActive"
            field={children.adminSettings.children.isActive}
          />
          <BooleanFieldWidget
            fieldName="adminSettings.emailVerified"
            field={children.adminSettings.children.emailVerified}
          />
        </Div>
      </AdminFormSection>
    </AdminForm>
  );
}
