/**
 * Remote Connection by Instance ID Widget
 *
 * GET    → view: status + behavior + sync scope (per-provider) + cortex/SSH cross-refs
 * PATCH  → edit: rename, reauth, transport, behavior flags, per-provider sync toggles
 * DELETE → confirm: disconnect confirmation
 *
 * Admin vs customer:
 * - forceSystemProvider shown only to ADMIN in both view and edit
 * - transport / behavior / sync scope visible to ADMIN only in edit
 */

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe-ui/ui/alert-dialog";
import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { DetailField, DetailGrid } from "next-vibe-ui/ui/detail-grid";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { FolderOpen } from "next-vibe-ui/ui/icons/FolderOpen";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { LoadingBlock } from "next-vibe-ui/ui/loading-block";
import { SectionGroup } from "next-vibe-ui/ui/section-group";
import { StatusPill } from "next-vibe-ui/ui/status-pill";
import { Switch } from "next-vibe-ui/ui/switch";
import { Code, P } from "next-vibe-ui/ui/typography";
import { WidgetHeader } from "next-vibe-ui/ui/widget-header";
import { WidgetShell } from "next-vibe-ui/ui/widget-shell";
import {
  useWidgetEndpoint,
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe-ui/unified/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "next-vibe-ui/unified/form-fields/email-field/widget";
import { PasswordFieldWidget } from "next-vibe-ui/unified/form-fields/password-field/widget";
import { SelectFieldWidget } from "next-vibe-ui/unified/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe-ui/unified/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { useProviderAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import connectDefinitions from "../connect/definition";
import type { SyncScope } from "../db";
import type { SyncProviderInfo } from "../sync-providers/definition";
import syncProvidersDefinitions from "../sync-providers/definition";
import type { default as definitionsType } from "./definition";
import definitions from "./definition";
import { scopedTranslation } from "./i18n";

// The widget is registered for all three methods; field shape varies per method.
// We use the PATCH definition (most complete) for the shared prop type.
interface RemoteConnectionByIdWidgetProps {
  field: (typeof definitionsType.PATCH)["fields"];
}

const SYNC_SCOPE_KEYS = [
  "memories",
  "documents",
  "skills",
  "favorites",
  "threads",
] as const;
type SyncScopeKey = (typeof SYNC_SCOPE_KEYS)[number];

// ─── Sync scope editor (form-context aware) ───────────────────────────────────

function SyncScopeEditor({
  t,
}: {
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
}): JSX.Element {
  const { setValue } = useFormContext();
  const syncScope = useWatch({ name: "syncScope" }) as SyncScope | undefined;

  const current: SyncScope = {
    memories: syncScope?.memories ?? true,
    documents: syncScope?.documents ?? true,
    skills: syncScope?.skills ?? true,
    favorites: syncScope?.favorites ?? false,
    threads: syncScope?.threads ?? false,
  };

  const toggle = (key: SyncScopeKey): void => {
    setValue(
      "syncScope",
      { ...current, [key]: !current[key] },
      { shouldDirty: true },
    );
  };

  return (
    <SectionGroup title={t("patch.syncScope.label")}>
      <P className="text-xs text-muted-foreground mb-3">
        {t("patch.syncScope.description")}
      </P>
      <Div className="grid grid-cols-1 gap-2">
        {SYNC_SCOPE_KEYS.map((key: SyncScopeKey) => (
          <Div
            key={key}
            className="flex items-center justify-between rounded-md border px-3 py-2 bg-background"
          >
            <P className="text-sm">{t(`patch.syncScope.${key}` as const)}</P>
            <Switch
              checked={current[key]}
              onCheckedChange={() => toggle(key)}
              aria-label={t(`patch.syncScope.${key}` as const)}
            />
          </Div>
        ))}
      </Div>
    </SectionGroup>
  );
}

// ─── View (GET) ───────────────────────────────────────────────────────────────

function ViewWidget({ instanceId }: { instanceId: string }): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const endpointMutations = useWidgetEndpointMutations();

  const [pendingDisconnect, setPendingDisconnect] = useState(false);

  const status = useWidgetValue<typeof definitionsType.GET>();
  const isAdmin =
    !user.isPublic && user.roles?.includes(UserPermissionRole.ADMIN) === true;

  if (user.isPublic) {
    return (
      <WidgetShell>
        <WidgetHeader
          title={t("widget.title")}
          backButton={
            canGoBack ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => pop()}
                className="gap-1.5 -ml-1"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("widget.back")}
              </Button>
            ) : undefined
          }
        />
        <SectionGroup title={t("widget.title")}>
          <P className="text-muted-foreground text-sm">
            {t("widget.signInDescription")}
          </P>
        </SectionGroup>
      </WidgetShell>
    );
  }

  if (!status) {
    return <LoadingBlock />;
  }

  const isConnected = status.isConnected === true;

  if (!isConnected) {
    return (
      <WidgetShell>
        <WidgetHeader
          title={t("widget.notConnected.title")}
          backButton={
            canGoBack ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => pop()}
                className="gap-1.5 -ml-1"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("widget.back")}
              </Button>
            ) : undefined
          }
        />
        <SectionGroup title={t("widget.notConnected.title")}>
          <P className="text-sm text-muted-foreground mb-3">
            {t("widget.notConnected.description")}
          </P>
          <Div className="grid gap-2 text-sm text-muted-foreground mb-4">
            <P>✓ {t("widget.notConnected.benefit1")}</P>
            <P>
              ✓ {t("widget.notConnected.benefit2")}{" "}
              <Code>{t("widget.notConnected.benefit2Code")}</Code>
            </P>
            <P>✓ {t("widget.notConnected.benefit3")}</P>
          </Div>
          <EndpointsPage
            endpoint={connectDefinitions}
            locale={locale}
            user={user}
          />
        </SectionGroup>
      </WidgetShell>
    );
  }

  const handleRefresh = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void endpointMutations?.read?.refetch();
  };

  const handleEdit = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      navigate(definitions.PATCH, {
        urlPathParams: { instanceId },
        getEndpoint: definitions.GET,
        prefillFromGet: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleDisconnectConfirm = (): void => {
    setPendingDisconnect(false);
    navigate(definitions.DELETE, {
      urlPathParams: { instanceId },
      popNavigationOnSuccess: 2,
    });
  };

  const handleOpenCortex = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const defs =
        await import("@/app/api/[locale]/agent/cortex/list/definition");
      navigate(defs.default.GET, {});
    })();
  };

  const handleOpenTerminals = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const defs =
        await import("@/app/api/[locale]/agent/cortex/terminals/definition");
      navigate(defs.default.GET, {});
    })();
  };

  return (
    <WidgetShell>
      <WidgetHeader
        title={instanceId}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
              className="gap-1.5 -ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("widget.back")}
            </Button>
          ) : undefined
        }
        actions={
          <Div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              {t("widget.connected.refresh")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              {t("widget.editButton")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setPendingDisconnect(true);
              }}
            >
              {t("widget.disconnectButton")}
            </Button>
          </Div>
        }
      />

      {/* ── Status ─────────────────────────────────────────────────────── */}
      <SectionGroup title={t("widget.statusSection")}>
        <DetailGrid columns={2}>
          <DetailField
            label={t("widget.connected.connectedTo")}
            value={status.remoteUrl ?? "—"}
            mono
          />
          <DetailField
            label={t("widget.statusSection")}
            value={
              <StatusPill
                status={status.isActive ? "active" : "inactive"}
                variant={status.isActive ? "success" : "danger"}
              />
            }
          />
          {status.transportMode && (
            <DetailField
              label={t("widget.connected.transport")}
              value={status.transportMode}
              mono
            />
          )}
          {status.remoteInstanceId && (
            <DetailField
              label={t("widget.connected.remoteInstance")}
              value={status.remoteInstanceId}
              mono
            />
          )}
          {status.capabilitiesVersion && (
            <DetailField
              label={t("widget.connected.capabilities")}
              value={status.capabilitiesVersion}
              mono
            />
          )}
          {status.wsConnectedAt && (
            <DetailField
              label={t("widget.connected.wsConnected")}
              value={new Date(status.wsConnectedAt).toLocaleString(locale)}
            />
          )}
          {status.lastSyncedAt && (
            <DetailField
              label={t("widget.connected.lastSynced")}
              value={new Date(status.lastSyncedAt).toLocaleString(locale)}
            />
          )}
        </DetailGrid>
      </SectionGroup>

      {/* ── Sync scope — per provider ──────────────────────────────────── */}
      {status.syncScope && (
        <SectionGroup title={t("widget.syncSection")}>
          <DetailGrid columns={3}>
            {SYNC_SCOPE_KEYS.map((key: SyncScopeKey) => (
              <DetailField
                key={key}
                label={t(`widget.syncScope.${key}` as const)}
                value={
                  <StatusPill
                    status={status.syncScope?.[key] ? "on" : "off"}
                    variant={status.syncScope?.[key] ? "success" : "default"}
                  />
                }
              />
            ))}
          </DetailGrid>
        </SectionGroup>
      )}

      {/* ── Behavior — admin only ──────────────────────────────────────── */}
      {isAdmin && (
        <SectionGroup title={t("widget.behaviorSection")}>
          <DetailGrid columns={2}>
            {status.loopLocation && (
              <DetailField
                label={t("patch.loopLocation.label")}
                value={status.loopLocation}
              />
            )}
            {status.threadMirrorMode && (
              <DetailField
                label={t("patch.threadMirrorMode.label")}
                value={status.threadMirrorMode}
              />
            )}
            {status.toolSource && (
              <DetailField
                label={t("patch.toolSource.label")}
                value={status.toolSource}
              />
            )}
            <DetailField
              label={t("patch.isInferenceProvider.label")}
              value={
                <StatusPill
                  status={status.isInferenceProvider ? "enabled" : "disabled"}
                  variant={status.isInferenceProvider ? "success" : "default"}
                />
              }
            />
            <DetailField
              label={t("patch.forceSystemProvider.label")}
              value={
                <StatusPill
                  status={status.forceSystemProvider ? "forced" : "off"}
                  variant={status.forceSystemProvider ? "warning" : "default"}
                />
              }
            />
          </DetailGrid>
        </SectionGroup>
      )}

      {/* ── Cortex cross-reference ─────────────────────────────────────── */}
      <SectionGroup title={t("widget.cortexSection")}>
        <Card className="border shadow-none">
          <CardHeader className="pb-2">
            <Div className="flex items-center justify-between gap-3">
              <Div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm">
                  {t("widget.cortexSection")}
                </CardTitle>
              </Div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenCortex}
                className="gap-1.5 text-xs h-7"
              >
                <ExternalLink className="h-3 w-3" />
                {t("widget.cortexLink")}
              </Button>
            </Div>
            <CardDescription className="text-xs">
              {t("widget.cortexDescription")}
            </CardDescription>
          </CardHeader>
        </Card>
      </SectionGroup>

      {/* ── SSH & Terminal cross-reference ─────────────────────────────── */}
      <SectionGroup title={t("widget.sshSection")}>
        <Card className="border shadow-none">
          <CardHeader className="pb-2">
            <Div className="flex items-center justify-between gap-3">
              <Div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm">
                  {t("widget.sshSection")}
                </CardTitle>
              </Div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenTerminals}
                className="gap-1.5 text-xs h-7"
              >
                <ExternalLink className="h-3 w-3" />
                {t("widget.sshLink")}
              </Button>
            </Div>
            <CardDescription className="text-xs">
              {t("widget.sshDescription")}
            </CardDescription>
          </CardHeader>
        </Card>
      </SectionGroup>

      {/* ── Disconnect confirmation ────────────────────────────────────── */}
      <AlertDialog open={pendingDisconnect} onOpenChange={setPendingDisconnect}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("widget.disconnectConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("widget.disconnectConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("widget.disconnectConfirmCancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDisconnectConfirm}>
              {t("widget.disconnectConfirmProceed")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </WidgetShell>
  );
}

// ─── Edit (PATCH) ─────────────────────────────────────────────────────────────

function EditWidget({ field }: RemoteConnectionByIdWidgetProps): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const { pop, canGoBack } = useWidgetNavigation();
  const emptyField = useMemo(() => ({}), []);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isAdmin =
    !user.isPublic && user.roles?.includes(UserPermissionRole.ADMIN) === true;
  const children = field.children;

  return (
    <WidgetShell>
      {/* Sticky header with back + save */}
      <Div className="flex items-center gap-2 px-4 pt-4 pb-3 sticky top-0 bg-background z-10 border-b">
        {canGoBack ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => pop()}
            className="gap-1.5 -ml-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("widget.back")}
          </Button>
        ) : (
          <NavigateButtonWidget field={emptyField} />
        )}
        <Div className="ml-auto flex items-center gap-2">
          <SubmitButtonWidget field={emptyField} />
        </Div>
      </Div>

      <FormAlertWidget field={emptyField} />

      <Div className="px-4 py-4 flex flex-col gap-6">
        {/* ── Rename ────────────────────────────────────────────────── */}
        <SectionGroup title={t("patch.newInstanceId.label")}>
          <TextFieldWidget
            fieldName="newInstanceId"
            field={children.newInstanceId}
          />
        </SectionGroup>

        {/* ── Re-authenticate ───────────────────────────────────────── */}
        <SectionGroup title={t("widget.reauthButton")}>
          <P className="text-xs text-muted-foreground mb-3">
            {t("patch.email.description")}
          </P>
          <Div className="flex flex-col gap-3">
            <EmailFieldWidget fieldName="email" field={children.email} />
            <PasswordFieldWidget
              fieldName="password"
              field={children.password}
            />
          </Div>
        </SectionGroup>

        {/* ── Transport + Behavior + Sync — admin only ──────────────── */}
        {isAdmin && (
          <>
            {/* Advanced settings toggle */}
            <Div
              className="flex items-center gap-2 cursor-pointer select-none py-1 border-t pt-3"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <P className="text-xs font-medium text-muted-foreground">
                {t("widget.behaviorSection")}
              </P>
            </Div>

            {showAdvanced && (
              <Div className="flex flex-col gap-5 border rounded-md px-4 py-4 bg-muted/20">
                {/* Transport is auto-negotiated — read-only status shown in
                    the status section, never an editable setting (spec.md) */}

                {/* AI behavior */}
                <SectionGroup title={t("patch.isInferenceProvider.label")}>
                  <Div className="flex flex-col gap-3">
                    <BooleanFieldWidget
                      fieldName="isInferenceProvider"
                      field={children.isInferenceProvider}
                    />
                    <SelectFieldWidget
                      fieldName="loopLocation"
                      field={children.loopLocation}
                    />
                    <SelectFieldWidget
                      fieldName="threadMirrorMode"
                      field={children.threadMirrorMode}
                    />
                    <SelectFieldWidget
                      fieldName="toolSource"
                      field={children.toolSource}
                    />
                  </Div>
                </SectionGroup>

                {/* Force system provider */}
                <BooleanFieldWidget
                  fieldName="forceSystemProvider"
                  field={children.forceSystemProvider}
                />

                {/* Sync scope — per provider */}
                <SyncScopeEditor t={t} />
              </Div>
            )}
          </>
        )}
      </Div>
    </WidgetShell>
  );
}

// ─── Delete (DELETE) ──────────────────────────────────────────────────────────

function DeleteWidget(): JSX.Element {
  const emptyField = useMemo(() => ({}), []);
  return (
    <Div className="flex flex-col gap-4 px-6 py-6">
      <FormAlertWidget field={emptyField} />
      <Div className="flex flex-row gap-2">
        <NavigateButtonWidget field={emptyField} />
        <SubmitButtonWidget field={emptyField} />
      </Div>
    </Div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function RemoteConnectionByIdWidget({
  field,
}: RemoteConnectionByIdWidgetProps): JSX.Element {
  const endpoint = useWidgetEndpoint();
  const instanceId =
    (field as { urlPathParams?: { instanceId?: string } }).urlPathParams
      ?.instanceId ?? "";

  if (endpoint.method === Methods.DELETE) {
    return <DeleteWidget />;
  }

  if (endpoint.method === Methods.PATCH) {
    return <EditWidget field={field} />;
  }

  return <ViewWidget instanceId={instanceId} />;
}
