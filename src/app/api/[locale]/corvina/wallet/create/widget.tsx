"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Save } from "next-vibe-ui/ui/icons/Save";
import { Wallet } from "next-vibe-ui/ui/icons/Wallet";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { WalletType } from "../enums";
import type definition from "./definition";
import type { WalletCreateResponseOutput } from "./definition";

function WalletResult({
  result,
  labels,
}: {
  result: WalletCreateResponseOutput;
  labels: {
    resultTitle: string;
    idLabel: string;
    typeLabel: string;
    descriptionLabel: string;
    webhookLabel: string;
    noType: string;
  };
}): React.JSX.Element {
  return (
    <Div className="mt-4 rounded-xl border bg-card p-4 space-y-3">
      <Div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-success" />
        <Span className="font-semibold text-sm">{labels.resultTitle}</Span>
      </Div>

      <Div className="grid grid-cols-2 gap-3 text-sm">
        {result.id !== null && result.id !== undefined && (
          <Div className="space-y-0.5">
            <Span className="text-xs text-muted-foreground">
              {labels.idLabel}
            </Span>
            <Div className="font-mono text-xs">{result.id}</Div>
          </Div>
        )}

        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.typeLabel}
          </Span>
          <Div className="font-mono text-xs">
            {result.type ?? labels.noType}
          </Div>
        </Div>

        {result.description !== null && result.description !== undefined && (
          <Div className="col-span-2 space-y-0.5">
            <Span className="text-xs text-muted-foreground">
              {labels.descriptionLabel}
            </Span>
            <Div className="text-xs">{result.description}</Div>
          </Div>
        )}

        {result.webhookUrl !== null && result.webhookUrl !== undefined && (
          <Div className="col-span-2 space-y-0.5">
            <Span className="text-xs text-muted-foreground">
              {labels.webhookLabel}
            </Span>
            <Div className="font-mono text-xs break-all">
              {result.webhookUrl}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}

export function WalletCreateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const idValue = form.watch("id") ?? "";
  const typeValue = form.watch("type") ?? "";
  const descriptionValue = form.watch("description") ?? "";
  const webhookUrlValue = form.watch("webhookUrl") ?? "";

  const idError = form.formState.errors.id?.message;
  const typeError = form.formState.errors.type?.message;
  const descriptionError = form.formState.errors.description?.message;
  const webhookUrlError = form.formState.errors.webhookUrl?.message;

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const resultLabels = {
    resultTitle: t("post.widget.resultTitle"),
    idLabel: t("post.widget.idLabel"),
    typeLabel: t("post.widget.typeLabel"),
    descriptionLabel: t("post.widget.descriptionLabel"),
    webhookLabel: t("post.widget.webhookLabel"),
    noType: t("post.widget.noType"),
  };

  if (isCompact) {
    if (result !== null && result !== undefined) {
      const parts: string[] = [];
      if (result.id !== undefined) {
        parts.push(`id:${result.id}`);
      }
      if (result.type !== undefined) {
        parts.push(`type:${result.type}`);
      }
      if (result.description !== undefined) {
        parts.push(`desc:${result.description}`);
      }
      if (result.webhookUrl !== undefined) {
        parts.push(`webhook:${result.webhookUrl}`);
      }
      return (
        <Div className="font-mono text-sm p-2">
          <Div className="font-semibold mb-1">
            {t("post.widget.resultTitle")}
          </Div>
          <Div>{parts.join(" | ")}</Div>
        </Div>
      );
    }
    return <Div />;
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            pop();
          }}
          title={t("post.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Wallet className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="space-y-1.5">
          <Label htmlFor="wallet-id">{t("post.id.label")}</Label>
          <Input
            id="wallet-id"
            type="text"
            value={idValue}
            onChange={(e) => {
              form.setValue("id", e.target.value || undefined, {
                shouldDirty: true,
              });
            }}
            placeholder={t("post.id.placeholder")}
          />
          {idError ? (
            <Span className="text-xs text-destructive">{idError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.id.description")}
            </Span>
          )}
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="wallet-type">{t("post.type.label")}</Label>
          <Input
            id="wallet-type"
            type="text"
            value={typeValue}
            onChange={(e) => {
              const v = e.target.value;
              const matched =
                v === WalletType.GENERIC
                  ? WalletType.GENERIC
                  : v === WalletType.APP
                    ? WalletType.APP
                    : undefined;
              form.setValue("type", matched, { shouldDirty: true });
            }}
            placeholder={t("post.type.placeholder")}
          />
          {typeError ? (
            <Span className="text-xs text-destructive">{typeError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.type.description")}
            </Span>
          )}
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="wallet-description">
            {t("post.walletDescription.label")}
          </Label>
          <Input
            id="wallet-description"
            type="text"
            value={descriptionValue}
            onChange={(e) =>
              form.setValue("description", e.target.value || undefined, {
                shouldDirty: true,
              })
            }
            placeholder={t("post.walletDescription.placeholder")}
          />
          {descriptionError ? (
            <Span className="text-xs text-destructive">{descriptionError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.walletDescription.description")}
            </Span>
          )}
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="wallet-webhook">{t("post.webhookUrl.label")}</Label>
          <Input
            id="wallet-webhook"
            type="text"
            value={webhookUrlValue}
            onChange={(e) =>
              form.setValue("webhookUrl", e.target.value || undefined, {
                shouldDirty: true,
              })
            }
            placeholder={t("post.webhookUrl.placeholder")}
          />
          {webhookUrlError ? (
            <Span className="text-xs text-destructive">{webhookUrlError}</Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.webhookUrl.description")}
            </Span>
          )}
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Save className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <WalletResult result={result} labels={resultLabels} />
        )}
      </Div>
    </Div>
  );
}
