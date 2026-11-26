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

import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/components/card";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { Activity } from "next-vibe/ui/components/icons/Activity";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ExternalLink } from "next-vibe/ui/components/icons/ExternalLink";
import { FolderOpen } from "next-vibe/ui/components/icons/FolderOpen";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { WifiOff } from "next-vibe/ui/components/icons/WifiOff";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { Switch } from "next-vibe/ui/components/switch";
import { Code, P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { Methods } from "../../core/definition/enums";
import { coreClientEnv } from "../../core/env-client";
import { VibeMode } from "../../env/env-util";
import { UserPermissionRole } from "../../identity/roles/enum";
import {
  useWidgetEndpoint,
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetUser,
  useWidgetValue,
} from "../../unified-ui/_shared/use-widget-context";
import { apiClient } from "../../unified-ui/hooks/store";
import { useEndpoint } from "../../unified-ui/hooks/use-endpoint";
import { EndpointsPage } from "../../unified-ui/renderers/web/EndpointsPage";
import { BooleanFieldWidget } from "../../unified-ui/widgets/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "../../unified-ui/widgets/form-fields/email-field/widget";
import { PasswordFieldWidget } from "../../unified-ui/widgets/form-fields/password-field/widget";
import { SelectFieldWidget } from "../../unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "../../unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "../../unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "../../unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "../../unified-ui/widgets/interactive/submit-button/widget";
import connectDefinitions from "../connect/definition";
import type { SyncScope } from "../db";
import type { SyncProviderInfo } from "../sync/providers/definition";
import syncProvidersDefinitions from "../sync/providers/definition";
import type { default as definitionsType } from "./definition";
import definitions from "./definition";
import { scopedTranslation } from "./i18n";

// The widget is registered for all three methods; field shape varies per method.
// We use the PATCH definition (most complete) for the shared prop type.
interface RemoteConnectionByIdWidgetProps {
  field: (typeof definitionsType.PATCH)["fields"];
}

// ─── Connection state helpers ─────────────────────────────────────────────────

type ConnectionState =
  | "healthy-tunnel"
  | "sync-recorded"
  | "warning"
  | "inactive";

function deriveConnectionState(status: {
  isActive: boolean | null;
  lastSyncedAt: string | null;
  wsConnectedAt: string | null;
}): ConnectionState {
  if (!status.isActive) {
    return "inactive";
  }
  if (status.wsConnectedAt) {
    return "healthy-tunnel";
  }
  return status.lastSyncedAt ? "sync-recorded" : "warning";
}

function ConnectionStateBar({
  state,
  wsConnectedAt,
  lastSyncedAt,
  locale,
  t,
}: {
  state: ConnectionState;
  wsConnectedAt: string | null;
  lastSyncedAt: string | null;
  locale: string;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
}): JSX.Element {
  const iconClass = "h-4 w-4 flex-shrink-0";

  if (state === "healthy-tunnel") {
    const connectedSince = wsConnectedAt
      ? new Date(wsConnectedAt).toLocaleString(locale)
      : null;
    return (
      <Div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
        <Activity
          className={`${iconClass} text-emerald-600 dark:text-emerald-400`}
        />
        <Div className="flex flex-col gap-0.5 min-w-0">
          <P className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            {t("widget.state.tunnelActive")}
          </P>
          {connectedSince && (
            <P className="text-xs text-emerald-700/70 dark:text-emerald-400/70">
              {t("widget.state.connectedSince")} {connectedSince}
            </P>
          )}
        </Div>
      </Div>
    );
  }

  if (state === "sync-recorded") {
    const syncedAt = lastSyncedAt
      ? new Date(lastSyncedAt).toLocaleString(locale)
      : null;
    return (
      <Div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <Activity className={`${iconClass} text-blue-600 dark:text-blue-400`} />
        <Div className="flex flex-col gap-0.5 min-w-0">
          <P className="text-sm font-medium text-blue-800 dark:text-blue-300">
            {t("widget.state.syncRecorded")}
          </P>
          {syncedAt && (
            <P className="text-xs text-blue-700/70 dark:text-blue-400/70">
              {t("widget.connected.lastSynced")} {syncedAt}
            </P>
          )}
        </Div>
      </Div>
    );
  }

  if (state === "warning") {
    return (
      <Div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
        <AlertTriangle
          className={`${iconClass} text-amber-600 dark:text-amber-400`}
        />
        <P className="text-sm font-medium text-amber-800 dark:text-amber-300">
          {t("widget.state.noSyncRecorded")}
        </P>
      </Div>
    );
  }

  // inactive
  return (
    <Div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border">
      <WifiOff className={`${iconClass} text-muted-foreground`} />
      <P className="text-sm font-medium text-muted-foreground">
        {t("widget.state.inactive")}
      </P>
    </Div>
  );
}

// ─── Sync scope editor (form-context aware, provider-driven) ──────────────────

function SyncScopeEditor({
  t,
}: {
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
}): JSX.Element {
  const { setValue } = useFormContext();
  const syncScope = useWatch({ name: "syncScope" }) as SyncScope | undefined;
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const syncProvidersEndpoint = useEndpoint(
    syncProvidersDefinitions,
    undefined,
    logger,
    user,
  );
  const providers: SyncProviderInfo[] =
    syncProvidersEndpoint.read?.data?.providers ?? [];

  const current: Record<string, boolean> = {};
  const scopeRecord = syncScope as Record<string, boolean | undefined> | null;
  for (const p of providers) {
    current[p.key] = scopeRecord?.[p.key] ?? false;
  }

  const toggle = (key: string): void => {
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
        {providers.map((p) => (
          <Div
            key={p.key}
            className="flex items-center justify-between rounded-md border px-3 py-2 bg-background"
          >
            <Div className="flex flex-col gap-0.5">
              <P className="text-sm font-medium">{p.label}</P>
              {p.description && (
                <P className="text-xs text-muted-foreground">{p.description}</P>
              )}
            </Div>
            <Switch
              checked={current[p.key] ?? false}
              onCheckedChange={() => toggle(p.key)}
              aria-label={p.label}
            />
          </Div>
        ))}
      </Div>
    </SectionGroup>
  );
}

// ─── Sync scope view (read-only, provider-driven) ─────────────────────────────

function SyncScopeViewSection({
  syncScope,
}: {
  syncScope: SyncScope | null;
}): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(useWidgetLocale());
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const syncProvidersEndpoint = useEndpoint(
    syncProvidersDefinitions,
    undefined,
    logger,
    user,
  );
  const providers: SyncProviderInfo[] =
    syncProvidersEndpoint.read?.data?.providers ?? [];

  if (!syncScope || providers.length === 0) {
    return null;
  }

  return (
    <SectionGroup title={t("widget.syncSection")}>
      <DetailGrid columns={2}>
        {providers.map((p) => (
          <DetailField
            key={p.key}
            label={p.label}
            value={
              <StatusPill
                status={
                  (syncScope as Record<string, boolean | undefined>)[p.key]
                    ? "on"
                    : "off"
                }
                variant={
                  (syncScope as Record<string, boolean | undefined>)[p.key]
                    ? "success"
                    : "default"
                }
              />
            }
          />
        ))}
      </DetailGrid>
    </SectionGroup>
  );
}

// ─── View (GET) ───────────────────────────────────────────────────────────────

function ViewWidget({
  instanceId: instanceIdProp,
}: {
  instanceId: string;
}): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const platform = useWidgetPlatform();
  const logger = useWidgetLogger();
  const { push: navigate, pop, canGoBack, current } = useWidgetNavigation();
  const endpointMutations = useWidgetEndpointMutations();
  const [isReconnecting, setIsReconnecting] = useState(false);

  const status = useWidgetValue<typeof definitionsType.GET>();
  const response = useWidgetResponse();
  const form = useWidgetForm<typeof definitionsType.GET>();
  // Opened from a list: the navigation params carry it. Opened by URL
  // (/tools/remote-status?instanceId=x): only the form has it.
  const instanceId =
    (current?.params.urlPathParams as { instanceId?: string } | undefined)
      ?.instanceId ||
    form?.watch("instanceId") ||
    instanceIdProp;
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

  if (response?.success === false) {
    return <FormAlertWidget field={{}} />;
  }
  if (!status) {
    return (
      <Div aria-live="polite">
        <LoadingBlock message={t("widget.loading")} />
      </Div>
    );
  }

  const isConnected = status.isConnected === true;

  if (!isConnected) {
    return (
      <WidgetShell>
        <WidgetHeader
          title={
            status.isActive === false && instanceId
              ? instanceId
              : t("widget.notConnected.title")
          }
          titleAccessory={
            status.isActive === false && instanceId ? (
              <StatusPill
                status="disconnected"
                label={t("widget.notConnected.title")}
                variant="danger"
              />
            ) : undefined
          }
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
        <Div className="flex flex-col rounded-lg border bg-card p-4">
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
          {status.isActive === false && (
            <DetailGrid columns={2} className="mb-4">
              {status.remoteUrl && (
                <DetailField
                  label={t("widget.connected.connectedTo")}
                  value={status.remoteUrl}
                  mono
                />
              )}
              <DetailField
                label={t("widget.connected.lastSynced")}
                value={
                  status.lastSyncedAt
                    ? new Date(status.lastSyncedAt).toLocaleString(locale, {
                        timeZoneName: "short",
                      })
                    : t("widget.state.noSyncRecorded")
                }
              />
            </DetailGrid>
          )}
          {isAdmin &&
            coreClientEnv.NEXT_PUBLIC_VIBE_MODE !== VibeMode.CLOUD && (
              <EndpointsPage
                logger={logger}
                endpoint={connectDefinitions}
                locale={locale}
                user={user}
                platform={platform}
              />
            )}
        </Div>
      </WidgetShell>
    );
  }

  const connState = deriveConnectionState({
    isActive: status.isActive,
    lastSyncedAt: status.lastSyncedAt,
    wsConnectedAt: status.wsConnectedAt,
  });

  const isUnhealthy = connState === "warning";

  const handleRefresh = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void endpointMutations?.read?.refetch();
  };

  const handleReconnect = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    setIsReconnecting(true);
    void (async (): Promise<void> => {
      try {
        await apiClient.mutate(
          definitions.PATCH,
          logger,
          user,
          {
            reconnectNow: true,
            syncScope: status.syncScope ?? {
              memories: true,
              documents: true,
              skills: true,
              favorites: true,
              threads: false,
            },
          },
          { instanceId },
          locale,
        );
        void endpointMutations?.read?.refetch();
      } finally {
        setIsReconnecting(false);
      }
    })();
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

  const handleDisconnect = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    navigate(definitions.DELETE, {
      urlPathParams: { instanceId },
      renderInModal: true,
      popNavigationOnSuccess: 1,
    });
  };

  const handleOpenCortex = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const defs = await import("../../agent/cortex/list/definition");
      navigate(defs.default.GET, {});
    })();
  };

  const handleOpenTerminals = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const defs = await import("../../agent/cortex/terminals/definition");
      navigate(defs.default.GET, {});
    })();
  };

  return (
    <WidgetShell>
      <WidgetHeader
        title={instanceId}
        className="flex-wrap [&>div]:min-w-0 [&>div]:shrink [&>div]:flex-wrap"
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
          <Div className="flex flex-wrap items-center gap-2">
            {/* Settings + reconnect are PATCH (admin-only); customers manage
                the link from their own instance and can disconnect here. */}
            {isAdmin && isUnhealthy ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReconnect}
                disabled={isReconnecting}
                className="gap-1.5"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5${isReconnecting ? " animate-spin" : ""}`}
                />
                {t("widget.reconnectButton")}
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
              >
                {t("widget.connected.refresh")}
              </Button>
            )}
            {isAdmin && (
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
            )}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
            >
              {t("widget.disconnectButton")}
            </Button>
          </Div>
        }
      />

      {/* ── Connection state banner ────────────────────────────────────── */}
      <Div className="px-4 pt-4">
        <ConnectionStateBar
          state={connState}
          wsConnectedAt={status.wsConnectedAt ?? null}
          lastSyncedAt={status.lastSyncedAt ?? null}
          locale={locale}
          t={t}
        />
      </Div>

      {/* ── Connection details ─────────────────────────────────────────── */}
      <SectionGroup title={t("widget.statusSection")}>
        <DetailGrid columns={2}>
          <DetailField
            label={t("widget.connected.connectedTo")}
            value={status.remoteUrl ?? "—"}
            mono
          />
          {status.transportMode && (
            <DetailField
              label={t("widget.connected.transport")}
              value={
                status.transportMode === "reverse-ws"
                  ? t("widget.connected.transportReverseWs")
                  : t("widget.connected.transportDirectHttp")
              }
            />
          )}
          {status.remoteTransportMode && (
            <DetailField
              label={t("widget.connected.remoteTransport")}
              value={
                status.remoteTransportMode === "reverse-ws"
                  ? t("widget.connected.transportReverseWs")
                  : t("widget.connected.transportDirectHttp")
              }
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
              value={new Date(status.lastSyncedAt).toLocaleString(locale, {
                timeZoneName: "short",
              })}
            />
          )}
        </DetailGrid>
      </SectionGroup>

      {/* ── Sync scope — per provider ──────────────────────────────────── */}
      <SyncScopeViewSection syncScope={status.syncScope ?? null} />

      {/* ── Behavior — admin only ──────────────────────────────────────── */}
      {isAdmin && (
        <SectionGroup title={t("widget.behaviorSection")}>
          <DetailGrid columns={2}>
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

      {/* ── Cortex cross-reference (admin tooling) ─────────────────────── */}
      {isAdmin && (
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
      )}

      {/* ── SSH & Terminal cross-reference (admin tooling) ─────────────── */}
      {isAdmin && (
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
      )}
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

  const isAdmin =
    !user.isPublic && user.roles?.includes(UserPermissionRole.ADMIN) === true;
  const children = field.children;

  return (
    <WidgetShell>
      {/* Sticky header */}
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
        {/* ── Identity ─────────────────────────────────────────────── */}
        <SectionGroup title={t("widget.edit.identitySection")}>
          <TextFieldWidget
            fieldName="newInstanceId"
            field={children.newInstanceId}
          />
        </SectionGroup>

        {/* ── Re-authenticate ───────────────────────────────────────── */}
        <SectionGroup title={t("widget.edit.reauthSection")}>
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

        {/* ── Admin-only: Transport, Behavior & Sync ────────────────── */}
        {isAdmin && (
          <>
            <SectionGroup title={t("widget.edit.transportSection")}>
              <P className="text-xs text-muted-foreground mb-3">
                {t("patch.transportMode.description")}
              </P>
              <SelectFieldWidget
                fieldName="transportMode"
                field={children.transportMode}
              />
            </SectionGroup>

            <SectionGroup title={t("widget.edit.behaviorSection")}>
              <Div className="flex flex-col gap-3">
                <BooleanFieldWidget
                  fieldName="isInferenceProvider"
                  field={children.isInferenceProvider}
                />
                <BooleanFieldWidget
                  fieldName="forceSystemProvider"
                  field={children.forceSystemProvider}
                />
                <SelectFieldWidget
                  fieldName="threadMirrorMode"
                  field={children.threadMirrorMode}
                />
                <SelectFieldWidget
                  fieldName="loopLocation"
                  field={children.loopLocation}
                />
              </Div>
            </SectionGroup>

            <SyncScopeEditor t={t} />
          </>
        )}
      </Div>
    </WidgetShell>
  );
}

// ─── Delete (DELETE) ──────────────────────────────────────────────────────────

function DeleteWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const { pop } = useWidgetNavigation();
  const onSubmit = useWidgetOnSubmit();
  const emptyField = useMemo(() => ({}), []);

  return (
    <Div className="flex flex-col gap-4 px-6 py-6">
      <Div className="flex flex-col gap-1">
        <P className="font-semibold">{t("widget.disconnectConfirmTitle")}</P>
        <P className="text-sm text-muted-foreground">
          {t("widget.disconnectConfirmDescription")}
        </P>
      </Div>
      <FormAlertWidget field={emptyField} />
      <Div className="flex flex-row gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={() => pop()}>
          {t("widget.disconnectConfirmCancel")}
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onSubmit?.()}
        >
          {t("widget.disconnectConfirmProceed")}
        </Button>
      </Div>
    </Div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function RemoteConnectionByIdWidget({
  field,
}: RemoteConnectionByIdWidgetProps): JSX.Element {
  const endpoint = useWidgetEndpoint();

  if (endpoint.method === Methods.DELETE) {
    return <DeleteWidget />;
  }

  if (endpoint.method === Methods.PATCH) {
    return <EditWidget field={field} />;
  }

  return <ViewWidget instanceId="" />;
}
