"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";
import type { LicenseTrialDeleteResponseOutput } from "./definition";

function formatDate(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

function LicenseTrialDeleteResult({
  result,
  labels,
}: {
  result: LicenseTrialDeleteResponseOutput;
  labels: {
    productLabel: string;
    productCode: string;
    code: string;
    expirationDate: string;
  };
}): React.JSX.Element {
  return (
    <Div className="mt-4 rounded-xl border bg-muted/30 p-4 space-y-3">
      <Div className="grid grid-cols-2 gap-3 text-sm">
        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.productLabel}
          </Span>
          <Div className="font-mono text-xs">{result.productLabel}</Div>
        </Div>
        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.productCode}
          </Span>
          <Div className="font-mono text-xs">{result.productCode}</Div>
        </Div>
        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">{labels.code}</Span>
          <Div className="font-mono text-xs">{result.code}</Div>
        </Div>
        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.expirationDate}
          </Span>
          <Div className="font-mono text-xs">
            {formatDate(result.expirationDate)}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}

export function LicenseTrialDeleteContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const result = useWidgetValue<typeof definition.DELETE>();

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const resultLabels = {
    productLabel: t("delete.response.productLabel"),
    productCode: t("delete.response.productCode"),
    code: t("delete.response.code"),
    expirationDate: t("delete.response.expirationDate"),
  };

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`deleted trial #${result.licenseId}: ${result.productCode}`}
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
          title={t("delete.widget.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Trash2 className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("delete.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <FormAlertWidget field={{}} />

        <Div className="space-y-1.5">
          <Label htmlFor="trial-delete-license-id">
            {t("delete.licenseId.label")}
          </Label>
          <Input
            id="trial-delete-license-id"
            type="number"
            disabled
            readOnly
            value={result?.licenseId}
          />
          <Span className="text-xs text-muted-foreground">
            {t("delete.licenseId.description")}
          </Span>
        </Div>

        <SubmitButtonWidget<typeof definition.DELETE>
          field={{
            text: "delete.submitButton.label",
            loadingText: "delete.submitButton.loadingText",
            icon: "trash",
            variant: "destructive",
          }}
        />

        {result !== null && result !== undefined && (
          <LicenseTrialDeleteResult result={result} labels={resultLabels} />
        )}
      </Div>
    </Div>
  );
}
