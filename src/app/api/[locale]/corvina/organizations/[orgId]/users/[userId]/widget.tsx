"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { CorvinaUserGetResponseOutput } from "./definition";

type UserData = CorvinaUserGetResponseOutput;

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-start justify-between py-2 border-b last:border-b-0">
      <Span className="text-xs text-muted-foreground w-36 shrink-0">
        {label}
      </Span>
      <Span className="text-sm font-medium text-right flex-1 break-all">
        {value}
      </Span>
    </Div>
  );
}

function Badge({
  on,
  onLabel,
  offLabel,
}: {
  on: boolean;
  onLabel: string;
  offLabel: string;
}): React.JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        on ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
      )}
    >
      {on ? onLabel : offLabel}
    </Span>
  );
}

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

export function UserDetailContainer(): React.JSX.Element {
  const { push: navigate, pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const user = data as UserData | undefined;
  const isLoading = data === undefined;

  const handleEdit = useCallback((): void => {
    if (!user) {
      return;
    }
    void (async (): Promise<void> => {
      const detail = await import("./definition");
      navigate(detail.default.PUT, {
        urlPathParams: { orgId: 0, userId: user.id },
      });
    })();
  }, [navigate, user]);

  const handleDelete = useCallback((): void => {
    if (!user) {
      return;
    }
    void (async (): Promise<void> => {
      const detail = await import("./definition");
      navigate(detail.default.DELETE, {
        urlPathParams: { orgId: 0, userId: user.id },
      });
    })();
  }, [navigate, user]);

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
        <Span className="font-semibold text-sm mr-auto">
          {isLoading ? "Loading…" : (user?.username ?? t("get.title"))}
        </Span>
        {user && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="gap-1 text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("get.widget.delete")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="gap-1"
            >
              <Pencil className="h-3.5 w-3.5" />
              {t("get.widget.edit")}
            </Button>
          </>
        )}
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : !user ? null : (
        <Div className="px-4 py-3 flex flex-col gap-4">
          <Div>
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("get.widget.sections.identity")}
            </Span>
            <InfoRow
              label={t("get.widget.labels.username")}
              value={<Span className="font-mono">{user.username}</Span>}
            />
            <InfoRow label={t("get.widget.labels.email")} value={user.email} />
            {(user.firstName ?? user.lastName) && (
              <InfoRow
                label={t("get.widget.labels.name")}
                value={[user.firstName, user.lastName]
                  .filter(Boolean)
                  .join(" ")}
              />
            )}
            {user.country && (
              <InfoRow
                label={t("get.widget.labels.country")}
                value={user.country}
              />
            )}
            <InfoRow label={t("get.widget.labels.owner")} value={user.owner} />
          </Div>

          <Div>
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("get.widget.sections.flags")}
            </Span>
            <Div className="flex flex-wrap gap-2">
              {user.serviceAccount && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {t("get.widget.badges.serviceAccount")}
                </Span>
              )}
              <Badge
                on={user.mfaEnabled}
                onLabel={t("get.widget.badges.mfaEnabled")}
                offLabel={t("get.widget.badges.mfaDisabled")}
              />
              {user.groupPoliciesEnabled && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  {t("get.widget.badges.groupPolicies")}
                </Span>
              )}
              {user.userImpersonation && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  {t("get.widget.badges.impersonation")}
                </Span>
              )}
            </Div>
          </Div>
        </Div>
      )}
    </Div>
  );
}

export function UserUpdateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const form = useWidgetForm<typeof definition.PUT>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.PUT>();

  const isLoading = data === undefined;
  const user = data;

  const emailValue = form.watch("email") ?? "";
  const firstNameValue = form.watch("firstName") ?? "";
  const lastNameValue = form.watch("lastName") ?? "";
  const countryValue = form.watch("country") ?? "";
  const defaultHomePageValue = form.watch("defaultHomePage") ?? "";
  const groupPoliciesEnabled = form.watch("groupPoliciesEnabled") ?? false;
  const userImpersonation = form.watch("userImpersonation") ?? false;

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
        <Span className="font-semibold text-sm mr-auto">
          {t("put.title")}
          {user && (
            <Span className="ml-1 text-muted-foreground font-normal">
              {`— ${user.username}`}
            </Span>
          )}
        </Span>
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : (
        <Div className="px-4 py-3 flex flex-col gap-4">
          <Div>
            <Label className="block text-xs font-medium mb-1">
              {t("put.email.label")}
            </Label>
            <Input
              type="email"
              value={emailValue}
              onChange={(e) =>
                form.setValue("email", e.target.value, { shouldDirty: true })
              }
              placeholder={t("put.email.placeholder")}
              className="w-full"
            />
          </Div>
          <Div className="grid grid-cols-2 gap-3">
            <Div>
              <Label className="block text-xs font-medium mb-1">
                {t("put.firstName.label")}
              </Label>
              <Input
                value={firstNameValue}
                onChange={(e) =>
                  form.setValue("firstName", e.target.value || undefined, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("put.firstName.placeholder")}
                className="w-full"
              />
            </Div>
            <Div>
              <Label className="block text-xs font-medium mb-1">
                {t("put.lastName.label")}
              </Label>
              <Input
                value={lastNameValue}
                onChange={(e) =>
                  form.setValue("lastName", e.target.value || undefined, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("put.lastName.placeholder")}
                className="w-full"
              />
            </Div>
            <Div>
              <Label className="block text-xs font-medium mb-1">
                {t("put.country.label")}
              </Label>
              <Input
                value={countryValue}
                onChange={(e) =>
                  form.setValue("country", e.target.value || undefined, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("put.country.placeholder")}
                className="w-full"
              />
            </Div>
            <Div>
              <Label className="block text-xs font-medium mb-1">
                {t("put.defaultHomePage.label")}
              </Label>
              <Input
                value={defaultHomePageValue}
                onChange={(e) =>
                  form.setValue(
                    "defaultHomePage",
                    e.target.value || undefined,
                    {
                      shouldDirty: true,
                    },
                  )
                }
                placeholder={t("put.defaultHomePage.placeholder")}
                className="w-full"
              />
            </Div>
          </Div>

          <Div className="divide-y border rounded-lg px-3">
            <BoolToggle
              value={groupPoliciesEnabled}
              onToggle={() =>
                form.setValue("groupPoliciesEnabled", !groupPoliciesEnabled, {
                  shouldDirty: true,
                })
              }
              label={t("put.groupPoliciesEnabled.label")}
              description={t("put.groupPoliciesEnabled.description")}
            />
            <BoolToggle
              value={userImpersonation}
              onToggle={() =>
                form.setValue("userImpersonation", !userImpersonation, {
                  shouldDirty: true,
                })
              }
              label={t("put.userImpersonation.label")}
              description={t("put.userImpersonation.description")}
            />
          </Div>

          <Button
            type="button"
            variant="default"
            className="w-full gap-2"
            onClick={onSubmit ?? undefined}
          >
            <Save className="h-4 w-4" />
            {t("put.submitButton.label")}
          </Button>
        </Div>
      )}
    </Div>
  );
}

export function UserDeleteContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.DELETE>();

  const isLoading = data === undefined;
  const deleted = data as CorvinaUserGetResponseOutput | null | undefined;
  const isDeleted = deleted !== undefined && deleted !== null;

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
        <Span className="font-semibold text-sm mr-auto">
          {t("delete.title")}
        </Span>
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : isDeleted ? (
        <Div className="px-4 py-6 flex flex-col items-center gap-3 text-center">
          <CheckCircle className="h-10 w-10 text-success" />
          <Span className="font-semibold text-sm">
            {t("delete.widget.deletedTitle")}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {deleted.username} (#{deleted.id})
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t("delete.widget.deletedDescription")}
          </Span>
        </Div>
      ) : (
        <Div className="px-4 py-4 flex flex-col gap-4">
          <Div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <Span className="text-sm text-destructive">
              {t("delete.widget.warning")}
            </Span>
          </Div>
          <Div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => goBack()}
            >
              {t("delete.widget.cancelButton")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1 gap-2"
              onClick={onSubmit ?? undefined}
            >
              <Trash2 className="h-4 w-4" />
              {t("delete.widget.confirmButton")}
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}
