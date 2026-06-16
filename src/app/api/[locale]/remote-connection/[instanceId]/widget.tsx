/**
 * Remote Connection by Instance ID Widget
 *
 * GET    → view: status + behavior + sync sections, with Edit / Disconnect actions
 * PATCH  → edit: sectioned form (rename, reauth, transport, behavior, sync scope)
 * DELETE → confirm: disconnect confirmation
 *
 * Admin vs customer:
 * - forceSystemProvider shown only to ADMIN in both view and edit
 * - Transport / behavior settings shown to both (they are per-user settings)
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
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { FolderOpen } from "next-vibe-ui/ui/icons/FolderOpen";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { Switch } from "next-vibe-ui/ui/switch";
import { DetailField, DetailGrid } from "next-vibe-ui/ui/detail-grid";
import { Div } from "next-vibe-ui/ui/div";
import { LoadingBlock } from "next-vibe-ui/ui/loading-block";
import { SectionGroup } from "next-vibe-ui/ui/section-group";
import { StatusPill } from "next-vibe-ui/ui/status-pill";
import { WidgetHeader } from "next-vibe-ui/ui/widget-header";
import { WidgetShell } from "next-vibe-ui/ui/widget-shell";
import { Code, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  useWidgetEndpoint,
  useWidgetEndpointMutations,
  useWidgetLocale,
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
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import connectDefinitions from "../connect/definition";
import definitions from "./definition";
import type { default as definitionsType } from "./definition";
import { scopedTranslation } from "./i18n";

interface RemoteConnectionByIdWidgetProps {
  field: {
    urlPathParams?: { instanceId?: string };
    children: (typeof definitionsType.GET)["fields"]["children"];
  };
}

// ─── View (GET) ──────────────────────────────────────────────────────────────

function ViewWidget({ instanceId }: { instanceId: string }): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const endpointMutations = useWidgetEndpointMutations();

  const [pendingDisconnect, setPendingDisconnect] = useState(false);

  const status = useWidgetValue<typeof definitionsType.GET>();
  const isAdmin =
    !user.isPublic && user.roles?.includes(UserPermissionRole.ADMIN);

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
              {t("widget.renameButton")}
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

      {/* ── Behavior ───────────────────────────────────────────────────── */}
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
            label={t("patch.isDefault.label")}
            value={
              <StatusPill
                status={status.isDefault ? "default" : "no"}
                variant={status.isDefault ? "info" : "default"}
              />
            }
          />
          {isAdmin && (
            <DetailField
              label={t("patch.forceSystemProvider.label")}
              value={
                <StatusPill
                  status={status.forceSystemProvider ? "forced" : "off"}
                  variant={status.forceSystemProvider ? "warning" : "default"}
                />
              }
            />
          )}
        </DetailGrid>
      </SectionGroup>

      {/* ── Sync & Access ──────────────────────────────────────────────── */}
      {status.syncScope && (
        <SectionGroup title={t("widget.syncSection")}>
          <DetailGrid columns={3}>
            {Object.entries(status.syncScope).map(([key, enabled]) => (
              <DetailField
                key={key}
                label={key}
                value={
                  <StatusPill
                    status={enabled ? "on" : "off"}
                    variant={enabled ? "success" : "default"}
                  />
                }
              />
            ))}
          </DetailGrid>
        </SectionGroup>
      )}

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

function EditWidget({
  field,
}: {
  field: RemoteConnectionByIdWidgetProps["field"];
}): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const { pop, canGoBack } = useWidgetNavigation();

  const isAdmin =
    !user.isPublic && user.roles?.includes(UserPermissionRole.ADMIN);
  // The PATCH definition has the same children shape — cast is safe since
  // the widget is only mounted when endpoint.method === Methods.PATCH.
  const patchChildren =
    field.children as unknown as (typeof definitionsType.PATCH)["fields"]["children"];

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
          <NavigateButtonWidget
            field={{ icon: "arrow-left", variant: "outline" }}
          />
        )}
        <Div className="ml-auto flex items-center gap-2">
          <SubmitButtonWidget<typeof definitionsType.PATCH>
            field={{
              text: "patch.success.title",
              loadingText: "patch.success.title",
              icon: "save",
              variant: "primary",
            }}
          />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />

      <Div className="px-4 py-4 flex flex-col gap-6">
        {/* ── Rename ────────────────────────────────────────────────── */}
        <SectionGroup title={t("patch.newInstanceId.label")}>
          <TextFieldWidget
            fieldName="newInstanceId"
            field={patchChildren.newInstanceId}
          />
        </SectionGroup>

        {/* ── Re-authenticate ───────────────────────────────────────── */}
        <SectionGroup title={t("widget.reauthButton")}>
          <P className="text-xs text-muted-foreground mb-3">
            {t("patch.email.description")}
          </P>
          <Div className="flex flex-col gap-3">
            <EmailFieldWidget fieldName="email" field={patchChildren.email} />
            <PasswordFieldWidget
              fieldName="password"
              field={patchChildren.password}
            />
          </Div>
        </SectionGroup>

        {/* ── Transport ─────────────────────────────────────────────── */}
        <SectionGroup title={t("patch.transportMode.label")}>
          <Div className="flex flex-col gap-3">
            <SelectFieldWidget
              fieldName="transportMode"
              field={patchChildren.transportMode}
            />
            <BooleanFieldWidget
              fieldName="allowTaskQueue"
              field={patchChildren.allowTaskQueue}
            />
          </Div>
        </SectionGroup>

        {/* ── Behavior ──────────────────────────────────────────────── */}
        <SectionGroup title={t("widget.behaviorSection")}>
          <Div className="flex flex-col gap-3">
            <BooleanFieldWidget
              fieldName="isInferenceProvider"
              field={patchChildren.isInferenceProvider}
            />
            <BooleanFieldWidget
              fieldName="isDefault"
              field={patchChildren.isDefault}
            />
            <SelectFieldWidget
              fieldName="loopLocation"
              field={patchChildren.loopLocation}
            />
            <SelectFieldWidget
              fieldName="threadMirrorMode"
              field={patchChildren.threadMirrorMode}
            />
            <SelectFieldWidget
              fieldName="toolSource"
              field={patchChildren.toolSource}
            />
            {isAdmin && (
              <BooleanFieldWidget
                fieldName="forceSystemProvider"
                field={patchChildren.forceSystemProvider}
              />
            )}
          </Div>
        </SectionGroup>
      </Div>
    </WidgetShell>
  );
}

// ─── Delete (DELETE) ──────────────────────────────────────────────────────────

function DeleteWidget(): JSX.Element {
  return (
    <Div className="flex flex-col gap-4 px-6 py-6">
      <FormAlertWidget field={{}} />
      <Div className="flex flex-row gap-2">
        <NavigateButtonWidget
          field={{ icon: "arrow-left", variant: "outline" }}
        />
        <SubmitButtonWidget<typeof definitionsType.DELETE>
          field={{
            text: "delete.title",
            loadingText: "delete.title",
            icon: "trash",
            variant: "destructive",
          }}
        />
      </Div>
    </Div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function RemoteConnectionByIdWidget({
  field,
}: RemoteConnectionByIdWidgetProps): JSX.Element {
  const endpoint = useWidgetEndpoint();
  const instanceId = field.urlPathParams?.instanceId ?? "";

  if (endpoint.method === Methods.DELETE) {
    return <DeleteWidget />;
  }

  if (endpoint.method === Methods.PATCH) {
    return <EditWidget field={field} />;
  }

  return <ViewWidget instanceId={instanceId} />;
}
