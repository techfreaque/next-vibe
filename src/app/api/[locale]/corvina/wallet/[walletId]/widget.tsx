"use client";

import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Wallet } from "next-vibe-ui/ui/icons/Wallet";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import definition from "./definition";
import type { WalletGetResponseOutput } from "./definition";

type Wallet_ = WalletGetResponseOutput;

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

export function WalletDetailContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate, pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const wallet = data as Wallet_ | undefined;
  const isLoading = data === undefined;
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleEdit = useCallback((): void => {
    if (!wallet) {
      return;
    }
    navigate(definition.PUT, {
      urlPathParams: { walletId: wallet.walletId },
    });
  }, [navigate, wallet]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  if (isCompact) {
    if (!wallet) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")}
          {` [${wallet.walletId}]`}
        </Div>
        {wallet.type && (
          <Div>
            {t("get.widget.labels.type")}
            {`: ${wallet.type}`}
          </Div>
        )}
        {wallet.description && (
          <Div>
            {t("get.widget.labels.description")}
            {`: ${wallet.description}`}
          </Div>
        )}
        {wallet.webhookUrl && (
          <Div>
            {t("get.widget.labels.webhookUrl")}
            {`: ${wallet.webhookUrl}`}
          </Div>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            pop();
          }}
          title={t("get.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Wallet className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {isLoading
            ? "Loading…"
            : (wallet?.description ?? wallet?.walletId ?? t("get.widget.title"))}
        </Span>
        {wallet && (
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
        )}
      </Div>

      {isLoading ? (
        <Div className="h-48 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </Div>
      ) : !wallet ? (
        <Div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          {t("get.widget.noData")}
        </Div>
      ) : (
        <Div className="px-4 py-3 flex flex-col gap-2">
          {wallet.id && (
            <InfoRow
              label={t("get.widget.labels.id")}
              value={<Span className="font-mono text-xs">{wallet.id}</Span>}
            />
          )}
          {wallet.type && (
            <InfoRow
              label={t("get.widget.labels.type")}
              value={
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {wallet.type}
                </Span>
              }
            />
          )}
          {wallet.description && (
            <InfoRow
              label={t("get.widget.labels.description")}
              value={wallet.description}
            />
          )}
          {wallet.webhookUrl && (
            <InfoRow
              label={t("get.widget.labels.webhookUrl")}
              value={
                <Span className="font-mono text-xs break-all">
                  {wallet.webhookUrl}
                </Span>
              }
            />
          )}
        </Div>
      )}
    </Div>
  );
}

export function WalletUpdateContainer(): React.JSX.Element {
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const form = useWidgetForm<typeof definition.PUT>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definition.PUT>();

  const isLoading = data === undefined;

  const typeValue = form.watch("type") ?? "";
  const descriptionValue = form.watch("description") ?? "";
  const webhookUrlValue = form.watch("webhookUrl") ?? "";

  return (
    <Div className="flex flex-col gap-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            goBack();
          }}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Span className="font-semibold text-sm mr-auto">
          {t("put.title")}
          {data && data.walletId && (
            <Span className="ml-1 text-muted-foreground font-normal">
              {"—"} {data.walletId}
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
              {t("put.type.label")}
              <Span className="block text-xs text-muted-foreground font-normal mb-1">
                {t("put.type.description")}
              </Span>
            </Label>
            <Input
              value={typeValue}
              onChange={(e) =>
                form.setValue(
                  "type",
                  e.target.value as "GENERIC" | "APP" | undefined,
                  { shouldDirty: true },
                )
              }
              placeholder={t("put.type.placeholder")}
              className="w-full"
            />
          </Div>

          <Div>
            <Label className="block text-xs font-medium mb-1">
              {t("put.description.label")}
              <Span className="block text-xs text-muted-foreground font-normal mb-1">
                {t("put.description.description")}
              </Span>
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

          <Div>
            <Label className="block text-xs font-medium mb-1">
              {t("put.webhookUrl.label")}
              <Span className="block text-xs text-muted-foreground font-normal mb-1">
                {t("put.webhookUrl.description")}
              </Span>
            </Label>
            <Input
              value={webhookUrlValue}
              onChange={(e) =>
                form.setValue("webhookUrl", e.target.value || undefined, {
                  shouldDirty: true,
                })
              }
              placeholder={t("put.webhookUrl.placeholder")}
              className="w-full"
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
