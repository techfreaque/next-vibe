"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { ExternalLink } from "next-vibe/ui/components/icons/ExternalLink";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Table } from "next-vibe/ui/components/icons/Table";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import {
  assignUrl,
  getCurrentUrl,
  silentReplaceState,
} from "next-vibe/ui/lib/location";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";
import { useCallback, useEffect, useId, useState } from "react";

import type endpoints from "./definition";
import sheetsList from "./sheets-list/definition";

export function GoogleSheetsWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const form = useWidgetForm<typeof endpoints.POST>();
  const response = useWidgetValue<typeof endpoints.POST>();
  const submit = useWidgetOnSubmit();
  const { endpointMutations } = useWidgetContext();
  const searchParams = useSearchParams();
  const sheetLabelId = useId();
  const tabId = useId();

  const [returnedFromOAuth] = useState(
    () => searchParams.get("gs_connected") === "1",
  );
  const selectedSheetId = form.watch("spreadsheetId") ?? "";
  const isConnected = returnedFromOAuth || Boolean(selectedSheetId);
  const sheetTab = form.watch("sheetTab") ?? "";
  const { read } = useEndpoint(
    sheetsList,
    {
      read: {
        queryOptions: {
          enabled: isConnected && !user.isPublic,
          queryKey: `google-sheets-list:${user.id}:${locale}`,
        },
      },
    },
    logger,
    user,
  );
  const sheets = read?.data?.sheets;
  const loadingSheets = read?.isLoading || read?.isLoadingFresh;
  const loadError =
    user.isPublic || loadingSheets
      ? null
      : (read?.error?.message ??
        (read?.isError
          ? t("providers.shared.errors.network.description")
          : null));
  const saving = endpointMutations?.create?.isSubmitting ?? false;

  // Clean OAuth redirect params from the URL
  useEffect(() => {
    const params = new URLSearchParams(new URL(getCurrentUrl()).search);
    if (params.get("gs_connected") === "1") {
      const newUrl = new URL(getCurrentUrl());
      newUrl.searchParams.delete("gs_connected");
      silentReplaceState(newUrl.toString());
    }
    const oauthError = params.get("gs_error");
    if (oauthError) {
      // OAuth callback bounced back with an error - user stays disconnected
      logger.warn("Google Sheets OAuth returned an error", {
        component: "GoogleSheetsWidget",
        operation: "oauthCallback",
        oauthError: oauthError.slice(0, 200),
      });
      const newUrl = new URL(getCurrentUrl());
      newUrl.searchParams.delete("gs_error");
      silentReplaceState(newUrl.toString());
    }
  }, [logger]);

  const handleConnectGoogle = useCallback((): void => {
    assignUrl(`/api/${locale}/lead-magnet/providers/google-sheets/oauth/start`);
  }, [locale]);

  const handleSave = (): void => {
    if (!selectedSheetId) {
      return;
    }
    form.setValue("isActive", true, { shouldDirty: true });
    submit?.();
  };

  if (!isConnected) {
    return (
      <Div className="flex flex-col items-center gap-6 px-4 py-10 text-center">
        <Div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <Table className="h-8 w-8 text-success" />
        </Div>
        <Div className="flex flex-col gap-2">
          <Span className="text-lg font-semibold">
            {t("providers.googleSheets.widget.connectTitle")}
          </Span>
          <Span className="text-sm text-muted-foreground max-w-xs">
            {t("providers.googleSheets.widget.connectDescription")}
          </Span>
        </Div>
        <Button onClick={handleConnectGoogle} className="gap-2" size="lg">
          <ExternalLink className="h-4 w-4" />
          {t("providers.googleSheets.connect.label")}
        </Button>
        <Span className="text-xs text-muted-foreground">
          {t("providers.googleSheets.widget.redirectNote")}
        </Span>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-6 p-4">
      {/* Connected badge */}
      <Div className="flex flex-wrap items-center gap-3 rounded-lg border border-success/30 bg-success/10 px-4 py-3">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
        <Span className="min-w-0 flex-1 text-sm font-medium text-success">
          {t("providers.googleSheets.connected.description")}
        </Span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto min-h-10 gap-1 text-xs text-muted-foreground"
          onClick={handleConnectGoogle}
        >
          <RefreshCw className="h-3 w-3" />
          {t("providers.googleSheets.widget.reconnect")}
        </Button>
      </Div>

      {/* Sheet selector */}
      <Div className="flex flex-col gap-2">
        <Label htmlFor={sheetLabelId} className="text-sm font-medium">
          {t("providers.googleSheets.spreadsheetId.label")}
        </Label>
        <Span className="text-xs text-muted-foreground">
          {t("providers.googleSheets.spreadsheetId.description")}
        </Span>
        {loadingSheets ? (
          <Div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
            <RefreshCw className="h-3 w-3 animate-spin" />
            {t("providers.googleSheets.widget.loading")}
          </Div>
        ) : (
          <Select
            value={selectedSheetId}
            onValueChange={(id) => {
              form.setValue("spreadsheetId", id, { shouldDirty: true });
            }}
          >
            <SelectTrigger id={sheetLabelId} className="min-h-10">
              <SelectValue
                placeholder={t(
                  "providers.googleSheets.spreadsheetId.placeholder",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {!user.isPublic && sheets?.length ? (
                sheets.map((sheet) => (
                  <SelectItem key={sheet.id} value={sheet.id}>
                    {sheet.name}
                  </SelectItem>
                ))
              ) : (
                <Div className="px-3 py-2 text-sm text-muted-foreground">
                  {t("providers.googleSheets.widget.noSheets")}
                </Div>
              )}
            </SelectContent>
          </Select>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="min-h-10 w-fit text-xs"
          onClick={() => void read?.refetch()}
          disabled={user.isPublic || loadingSheets}
        >
          <RefreshCw className="mr-1 h-3 w-3" />
          {t("providers.googleSheets.widget.refresh")}
        </Button>
        {loadError && <ResultBanner variant="danger" title={loadError} />}
      </Div>

      {/* Tab name */}
      <Div className="flex flex-col gap-2">
        <Label htmlFor={tabId} className="text-sm font-medium">
          {t("providers.googleSheets.sheetTab.label")}
        </Label>
        <Span className="text-xs text-muted-foreground">
          {t("providers.googleSheets.sheetTab.description")}
        </Span>
        <Input
          id={tabId}
          value={sheetTab}
          onChange={(e) => {
            form.setValue("sheetTab", e.target.value, { shouldDirty: true });
          }}
          placeholder={t("providers.googleSheets.sheetTab.placeholder")}
          className="min-h-10"
        />
      </Div>

      <FormAlertWidget field={{}} />
      {response?.isActiveResponse && (
        <ResultBanner
          variant="success"
          title={t("providers.shared.saveSuccess.title")}
        />
      )}

      <Button
        type="button"
        className="min-h-10 self-stretch @md:self-end"
        onClick={handleSave}
        disabled={saving || !selectedSheetId}
      >
        {saving
          ? t("providers.googleSheets.widget.saving")
          : t("providers.googleSheets.saveTitle")}
      </Button>
    </Div>
  );
}
