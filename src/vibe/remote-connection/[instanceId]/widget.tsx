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

import { useProviderAvailability } from "next-vibe/agent/env-availability-context";
import { Methods } from "next-vibe/core/definition/enums";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/ui/card";
import { DetailField, DetailGrid } from "next-vibe/ui/ui/detail-grid";
import { Div } from "next-vibe/ui/ui/div";
import { Activity } from "next-vibe/ui/ui/icons/Activity";
import { AlertCircle } from "next-vibe/ui/ui/icons/AlertCircle";
import { AlertTriangle } from "next-vibe/ui/ui/icons/AlertTriangle";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { ExternalLink } from "next-vibe/ui/ui/icons/ExternalLink";
import { FolderOpen } from "next-vibe/ui/ui/icons/FolderOpen";
import { Pencil } from "next-vibe/ui/ui/icons/Pencil";
import { RefreshCw } from "next-vibe/ui/ui/icons/RefreshCw";
import { Terminal } from "next-vibe/ui/ui/icons/Terminal";
import { WifiOff } from "next-vibe/ui/ui/icons/WifiOff";
import { LoadingBlock } from "next-vibe/ui/ui/loading-block";
import { SectionGroup } from "next-vibe/ui/ui/section-group";
import { StatusPill } from "next-vibe/ui/ui/status-pill";
import { Switch } from "next-vibe/ui/ui/switch";
import { Code, P } from "next-vibe/ui/ui/typography";
import { WidgetHeader } from "next-vibe/ui/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import {
  useWidgetEndpoint,
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { PasswordFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/password-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

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
  | "healthy-bridge"
  | "warning"
  | "critical"
  | "inactive";

function deriveConnectionState(status: {
  isActive: boolean | null;
  transportMode: string | null;
  wsConnectedAt: string | null;
}): ConnectionState {
  if (!status.isActive) {
    return "inactive";
  }
  if (status.wsConnectedAt) {
    return status.transportMode === "reverse-ws"
      ? "healthy-tunnel"
      : "healthy-bridge";
  }
  // Active but no WS — critical (initial sync not yet done or dropped)
  return "critical";
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

  if (state === "healthy-bridge") {
    const syncedAt = lastSyncedAt
      ? new Date(lastSyncedAt).toLocaleString(locale)
      : null;
    return (
      <Div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
        <Activity
          className={`${iconClass} text-emerald-600 dark:text-emerald-400`}
        />
        <Div className="flex flex-col gap-0.5 min-w-0">
          <P className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            {t("widget.state.bridgeActive")}
          </P>
          {syncedAt && (
            <P className="text-xs text-emerald-700/70 dark:text-emerald-400/70">
              {t("widget.state.initialSync")} {syncedAt}
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
          {t("widget.state.degraded")}
        </P>
      </Div>
    );
  }

  if (state === "critical") {
    return (
      <Div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
        <AlertCircle
          className={`${iconClass} text-red-600 dark:text-red-400`}
        />
        <P className="text-sm font-medium text-red-800 dark:text-red-300">
          {t("widget.state.connectionLost")}
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
  const logger = useWidgetLogger();
  const { push: navigate, pop, canGoBack, current } = useWidgetNavigation();
  const endpointMutations = useWidgetEndpointMutations();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const availability = useProviderAvailability();

  const status = useWidgetValue<typeof definitionsType.GET>();
  const instanceId =
    (current?.params.urlPathParams as { instanceId?: string } | undefined)
      ?.instanceId ?? instanceIdProp;
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

  const connState = deriveConnectionState({
    isActive: status.isActive,
    transportMode: status.transportMode,
    wsConnectedAt: status.wsConnectedAt,
  });

  const isUnhealthy =
    connState === "critical" ||
    connState === "inactive" ||
    connState === "warning";

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
          availability,
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
      const defs = await import("next-vibe/agent/cortex/list/definition");
      navigate(defs.default.GET, {});
    })();
  };

  const handleOpenTerminals = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const defs = await import("next-vibe/agent/cortex/terminals/definition");
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
            {isUnhealthy ? (
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
              value={new Date(status.lastSyncedAt).toLocaleString(locale)}
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
