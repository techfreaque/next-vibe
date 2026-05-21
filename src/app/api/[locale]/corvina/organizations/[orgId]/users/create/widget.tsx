"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { UserPlus } from "next-vibe-ui/ui/icons/UserPlus";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CorvinaUserCreateResponseOutput } from "./definition";

function BoolToggle({
  value,
  onToggle,
  label,
  description,
}: {
  value: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}): React.JSX.Element {
  return (
    <Div className="flex items-center justify-between py-2">
      <Div>
        <Span className="text-sm font-medium">{label}</Span>
        <Span className="block text-xs text-muted-foreground">
          {description}
        </Span>
      </Div>
      <Button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors p-0 min-h-0 shadow-none",
          value ? "bg-primary" : "bg-input",
        )}
      >
        <Span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
            value ? "translate-x-4" : "translate-x-0",
          )}
        />
      </Button>
    </Div>
  );
}

export function UserCreateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.POST>();

  const isLoading = data === undefined;
  const created = data as CorvinaUserCreateResponseOutput | null | undefined;
  const isCreated = created !== undefined && created !== null;

  const username = form.watch("username") ?? "";
  const email = form.watch("email") ?? "";
  const firstName = form.watch("firstName") ?? "";
  const lastName = form.watch("lastName") ?? "";
  const password = form.watch("password") ?? "";
  const temporaryPassword = form.watch("temporaryPassword") ?? false;
  const passwordChangeInvitation =
    form.watch("passwordChangeInvitation") ?? false;
  const serviceAccount = form.watch("serviceAccount") ?? false;
  const emailVerified = form.watch("emailVerified") ?? false;

  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => goBack()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">{t("post.title")}</Span>
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : isCreated ? (
        <Div className="px-4 py-6 flex flex-col items-center gap-3 text-center">
          <CheckCircle className="h-10 w-10 text-success" />
          <Span className="font-semibold text-sm">
            {t("post.success.title")}
          </Span>
          <Span className="text-xs font-medium">{created.usernameResult}</Span>
          <Span className="text-xs text-muted-foreground">
            {created.emailResult}
          </Span>
        </Div>
      ) : (
        <Div className="px-4 py-3 flex flex-col gap-4">
          <Div className="grid grid-cols-2 gap-3">
            <Div>
              <Label className="block text-xs font-medium mb-1">
                {t("post.username.label")}
              </Label>
              <Input
                value={username}
                onChange={(e) =>
                  form.setValue("username", e.target.value, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("post.username.placeholder")}
                className="w-full"
              />
            </Div>
            <Div>
              <Label className="block text-xs font-medium mb-1">
                {t("post.email.label")}
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) =>
                  form.setValue("email", e.target.value, { shouldDirty: true })
                }
                placeholder={t("post.email.placeholder")}
                className="w-full"
              />
            </Div>
            <Div>
              <Label className="block text-xs font-medium mb-1">
                {t("post.firstName.label")}
              </Label>
              <Input
                value={firstName}
                onChange={(e) =>
                  form.setValue("firstName", e.target.value || undefined, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("post.firstName.placeholder")}
                className="w-full"
              />
            </Div>
            <Div>
              <Label className="block text-xs font-medium mb-1">
                {t("post.lastName.label")}
              </Label>
              <Input
                value={lastName}
                onChange={(e) =>
                  form.setValue("lastName", e.target.value || undefined, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("post.lastName.placeholder")}
                className="w-full"
              />
            </Div>
          </Div>

          <Div>
            <Label className="block text-xs font-medium mb-1">
              {t("post.password.label")}
              <Span className="block text-xs text-muted-foreground font-normal mb-1">
                {t("post.password.description")}
              </Span>
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) =>
                form.setValue("password", e.target.value || undefined, {
                  shouldDirty: true,
                })
              }
              placeholder={t("post.password.placeholder")}
              className="w-full"
            />
          </Div>

          <Div className="divide-y border rounded-lg px-3">
            <BoolToggle
              value={temporaryPassword}
              onToggle={() =>
                form.setValue("temporaryPassword", !temporaryPassword, {
                  shouldDirty: true,
                })
              }
              label={t("post.temporaryPassword.label")}
              description={t("post.temporaryPassword.description")}
            />
            <BoolToggle
              value={passwordChangeInvitation}
              onToggle={() =>
                form.setValue(
                  "passwordChangeInvitation",
                  !passwordChangeInvitation,
                  { shouldDirty: true },
                )
              }
              label={t("post.passwordChangeInvitation.label")}
              description={t("post.passwordChangeInvitation.description")}
            />
            <BoolToggle
              value={serviceAccount}
              onToggle={() =>
                form.setValue("serviceAccount", !serviceAccount, {
                  shouldDirty: true,
                })
              }
              label={t("post.serviceAccount.label")}
              description={t("post.serviceAccount.description")}
            />
            <BoolToggle
              value={emailVerified}
              onToggle={() =>
                form.setValue("emailVerified", !emailVerified, {
                  shouldDirty: true,
                })
              }
              label={t("post.emailVerified.label")}
              description={t("post.emailVerified.description")}
            />
          </Div>

          <Button
            type="button"
            variant="default"
            className="w-full gap-2"
            onClick={onSubmit ?? undefined}
          >
            <UserPlus className="h-4 w-4" />
            {t("post.submitButton.label")}
          </Button>
        </Div>
      )}
    </Div>
  );
}
