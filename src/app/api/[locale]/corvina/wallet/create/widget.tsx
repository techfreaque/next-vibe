"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Wallet } from "next-vibe-ui/ui/icons/Wallet";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useState } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import definition from "./definition";
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
            <Div className="font-mono text-xs break-all">{result.webhookUrl}</Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}

export function WalletCreateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();

  const [walletId, setWalletId] = useState("");
  const [walletType, setWalletType] = useState<"GENERIC" | "APP" | "">("");
  const [walletDescription, setWalletDescription] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleSubmit = useCallback((): void => {
    setIsSubmitting(true);
    void endpointMutations?.create
      ?.submit({
        id: walletId !== "" ? walletId : undefined,
        type: walletType !== "" ? walletType : undefined,
        description: walletDescription !== "" ? walletDescription : undefined,
        webhookUrl: webhookUrl !== "" ? webhookUrl : undefined,
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [endpointMutations, walletId, walletType, walletDescription, webhookUrl]);

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
          <Div className="font-semibold mb-1">{t("post.widget.resultTitle")}</Div>
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
            value={walletId}
            onChange={(e) => {
              setWalletId(e.target.value);
            }}
            placeholder={t("post.id.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.id.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="wallet-type">{t("post.type.label")}</Label>
          <Select
            value={walletType}
            onValueChange={(val) => {
              setWalletType(val as "GENERIC" | "APP" | "");
            }}
          >
            <SelectTrigger id="wallet-type">
              <SelectValue placeholder={t("post.type.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GENERIC">GENERIC</SelectItem>
              <SelectItem value="APP">APP</SelectItem>
            </SelectContent>
          </Select>
          <Span className="text-xs text-muted-foreground">
            {t("post.type.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="wallet-description">{t("post.description.label")}</Label>
          <Input
            id="wallet-description"
            type="text"
            value={walletDescription}
            onChange={(e) => {
              setWalletDescription(e.target.value);
            }}
            placeholder={t("post.description.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.description.description")}
          </Span>
        </Div>

        <Div className="space-y-1.5">
          <Label htmlFor="wallet-webhook">{t("post.webhookUrl.label")}</Label>
          <Input
            id="wallet-webhook"
            type="url"
            value={webhookUrl}
            onChange={(e) => {
              setWebhookUrl(e.target.value);
            }}
            placeholder={t("post.webhookUrl.placeholder")}
          />
          <Span className="text-xs text-muted-foreground">
            {t("post.webhookUrl.description")}
          </Span>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("post.submitButton.loadingText")}
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              {t("post.submitButton.label")}
            </>
          )}
        </Button>

        {result !== null && result !== undefined && (
          <WalletResult result={result} labels={resultLabels} />
        )}
      </Div>
    </Div>
  );
}
