"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Table } from "next-vibe-ui/ui/icons/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import type { JSX } from "react";
import React, { useCallback, useEffect, useState } from "react";

import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";

interface SpreadsheetOption {
  id: string;
  name: string;
}

export function GoogleSheetsWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const { endpointMutations } = useWidgetContext();

  const [sheets, setSheets] = useState<SpreadsheetOption[]>([]);
  const [loadingSheets, setLoadingSheets] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState("");
  const [sheetTab, setSheetTab] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Check if connected via URL param after OAuth redirect
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("gs_connected") === "1") {
      setIsConnected(true);
      // Clean URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("gs_connected");
      window.history.replaceState({}, "", newUrl.toString());
    }
    if (params.get("gs_error")) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("gs_error");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, []);

  const loadSheets = useCallback((): void => {
    setLoadingSheets(true);
    void (async (): Promise<void> => {
      try {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const sheetsListDef = await import("./sheets-list/definition");
        if (!user) {
          return;
        }
        const result = await apiClient.fetch(
          sheetsListDef.GET,
          logger,
          user,
          undefined,
          undefined,
          locale,
        );
        if (result.success && result.data) {
          setSheets(result.data.sheets);
          setIsConnected(true);
        }
      } finally {
        setLoadingSheets(false);
      }
    })();
  }, [user, locale, logger]);

  useEffect(() => {
    if (isConnected && sheets.length === 0) {
      loadSheets();
    }
  }, [isConnected, sheets.length, loadSheets]);

  const handleConnectGoogle = useCallback((): void => {
    window.location.href = `/api/${locale.split("-")[0]}/lead-magnet/providers/google-sheets/oauth/start`;
  }, [locale]);

  const handleSave = useCallback((): void => {
    if (!selectedSheetId) {
      setSaveError(t("providers.googleSheets.widget.selectRequired"));
      return;
    }
    setSaving(true);
    setSaveError("");
    void (async (): Promise<void> => {
      try {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const def = await import("./definition");
        if (!user) {
          return;
        }
        await apiClient.mutate(
          def.POST,
          logger,
          user,
          {
            spreadsheetId: selectedSheetId,
            sheetTab: sheetTab || undefined,
            isActive: true,
          },
          undefined,
          locale,
        );
        endpointMutations?.read?.refetch?.();
      } catch {
        setSaveError(t("providers.googleSheets.widget.saveFailed"));
      } finally {
        setSaving(false);
      }
    })();
  }, [selectedSheetId, sheetTab, user, locale, logger, endpointMutations, t]);

  if (!isConnected) {
    return (
      <Div className="flex flex-col items-center gap-6 px-4 py-10 text-center">
        <Div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Table className="h-8 w-8 text-green-600" />
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
      <Div className="flex items-center gap-3 rounded-lg border bg-green-50 px-4 py-3">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
        <Span className="text-sm font-medium text-green-800">
          {t("providers.googleSheets.connected.description")}
        </Span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto gap-1 text-xs text-muted-foreground"
          onClick={handleConnectGoogle}
        >
          <RefreshCw className="h-3 w-3" />
          {t("providers.googleSheets.widget.reconnect")}
        </Button>
      </Div>

      {/* Sheet selector */}
      <Div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">
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
          <Select value={selectedSheetId} onValueChange={setSelectedSheetId}>
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "providers.googleSheets.spreadsheetId.placeholder",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {sheets.length === 0 ? (
                <Div className="px-3 py-2 text-sm text-muted-foreground">
                  {t("providers.googleSheets.widget.noSheets")}
                </Div>
              ) : (
                sheets.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-fit text-xs"
          onClick={loadSheets}
          disabled={loadingSheets}
        >
          <RefreshCw className="mr-1 h-3 w-3" />
          {t("providers.googleSheets.widget.refresh")}
        </Button>
      </Div>

      {/* Tab name */}
      <Div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">
          {t("providers.googleSheets.sheetTab.label")}
        </Label>
        <Span className="text-xs text-muted-foreground">
          {t("providers.googleSheets.sheetTab.description")}
        </Span>
        <Input
          value={sheetTab}
          onChange={(e) => {
            setSheetTab(e.target.value);
          }}
          placeholder={t("providers.googleSheets.sheetTab.placeholder")}
        />
      </Div>

      {saveError && (
        <Span className="text-sm text-destructive">{saveError}</Span>
      )}

      <Button onClick={handleSave} disabled={saving || !selectedSheetId}>
        {saving
          ? t("providers.googleSheets.widget.saving")
          : t("providers.googleSheets.saveTitle")}
      </Button>
    </Div>
  );
}
