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
import type { CorvinaRoleGetResponseOutput } from "./definition";

type RoleData = CorvinaRoleGetResponseOutput;

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

export function RoleDetailContainer(): React.JSX.Element {
  const { push: navigate, pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const role = data as RoleData | undefined;
  const isLoading = data === undefined;

  const handleEdit = useCallback((): void => {
    if (!role) {
      return;
    }
    void (async (): Promise<void> => {
      const detail = await import("./definition");
      navigate(detail.default.PUT, {
        urlPathParams: { orgId: 0, roleId: role.id },
      });
    })();
  }, [navigate, role]);

  const handleDelete = useCallback((): void => {
    if (!role) {
      return;
    }
    void (async (): Promise<void> => {
      const detail = await import("./definition");
      navigate(detail.default.DELETE, {
        urlPathParams: { orgId: 0, roleId: role.id },
      });
    })();
  }, [navigate, role]);

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
          {isLoading
            ? "Loading…"
            : (role?.label ?? role?.name ?? t("get.title"))}
        </Span>
        {role && (
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
      ) : !role ? null : (
        <Div className="px-4 py-3 flex flex-col gap-4">
          <Div>
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("get.widget.sections.identity")}
            </Span>
            <Div className="flex flex-wrap gap-2 mb-3">
              <Span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  role.enabled
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {role.enabled
                  ? t("get.widget.badges.enabled")
                  : t("get.widget.badges.disabled")}
              </Span>
              <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {role.type}
              </Span>
              <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {role.owner}
              </Span>
              {role.defaultStar && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  {t("get.widget.badges.defaultRole")}
                </Span>
              )}
            </Div>
            <InfoRow
              label={t("get.widget.labels.name")}
              value={<Span className="font-mono">{role.name}</Span>}
            />
            {role.label && (
              <InfoRow
                label={t("get.widget.labels.label")}
                value={role.label}
              />
            )}
            {role.description && (
              <InfoRow
                label={t("get.widget.labels.description")}
                value={role.description}
              />
            )}
            <InfoRow
              label={t("get.widget.labels.resourceId")}
              value={
                <Span className="font-mono text-xs">{role.resourceId}</Span>
              }
            />
          </Div>

          <Div>
            <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              {t("get.widget.sections.permissions")}
            </Span>
            <InfoRow
              label={t("get.response.deviceGeneralPermission")}
              value={role.deviceGeneralPermission}
            />
            <InfoRow
              label={t("get.response.vpnGeneralPermission")}
              value={role.vpnGeneralPermission}
            />
          </Div>
        </Div>
      )}
    </Div>
  );
}

export function RoleUpdateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const form = useWidgetForm<typeof definition.PUT>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.PUT>();

  const isLoading = data === undefined;
  const role = data;

  const labelValue = form.watch("label") ?? "";
  const descriptionValue = form.watch("description") ?? "";
  const defaultStar = form.watch("defaultStar") ?? false;

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
          {role && (
            <Span className="ml-1 text-muted-foreground font-normal">
              {`— ${role.label ?? role.name ?? ""}`}
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
          <Div className="grid grid-cols-2 gap-3">
            <Div>
              <Label className="block text-xs font-medium mb-1">
                {t("put.label.label")}
              </Label>
              <Input
                value={labelValue}
                onChange={(e) =>
                  form.setValue("label", e.target.value || undefined, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("put.label.placeholder")}
                className="w-full"
              />
            </Div>
            <Div>
              <Label className="block text-xs font-medium mb-1">
                {t("put.description.label")}
              </Label>
              <Input
                value={descriptionValue}
                onChange={(e) =>
                  form.setValue("description", e.target.value || undefined, {
                    shouldDirty: true,
                  })
                }
                placeholder={t("put.description.placeholder")}
                className="w-full"
              />
            </Div>
          </Div>

          <Div className="divide-y border rounded-lg px-3">
            <BoolToggle
              value={defaultStar}
              onToggle={() =>
                form.setValue("defaultStar", !defaultStar, {
                  shouldDirty: true,
                })
              }
              label={t("put.defaultStar.label")}
              description={t("put.defaultStar.description")}
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

export function RoleDeleteContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.DELETE>();

  const isLoading = data === undefined;
  const deleted = data as
    | { success: boolean; message: string }
    | null
    | undefined;
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
