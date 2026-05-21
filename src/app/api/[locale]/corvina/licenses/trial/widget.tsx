"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Key } from "next-vibe-ui/ui/icons/Key";
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

import type definition from "./definition";
import type { LicenseTrialCreateResponseOutput } from "./definition";

function formatDate(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

function LicenseTrialResult({
  result,
  labels,
}: {
  result: LicenseTrialCreateResponseOutput;
  labels: {
    resultTitle: string;
    licenseId: string;
    productLabel: string;
    productCode: string;
    code: string;
    expirationDate: string;
    autorenew: string;
    orgResourceId: string;
  };
}): React.JSX.Element {
  return (
    <Div className="mt-4 rounded-xl border bg-card p-4 space-y-3">
      <Div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-success" />
        <Span className="font-semibold text-sm">{labels.resultTitle}</Span>
      </Div>
      <Div className="grid grid-cols-2 gap-3 text-sm">
        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.licenseId}
          </Span>
          <Div className="font-mono text-xs">{result.licenseId}</Div>
        </Div>
        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">{labels.code}</Span>
          <Div className="font-mono text-xs">{result.code}</Div>
        </Div>
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
          <Span className="text-xs text-muted-foreground">
            {labels.expirationDate}
          </Span>
          <Div className="font-mono text-xs">
            {formatDate(result.expirationDate)}
          </Div>
        </Div>
        <Div className="space-y-0.5">
          <Span className="text-xs text-muted-foreground">
            {labels.autorenew}
          </Span>
          <Div className="font-mono text-xs">
            {result.autorenew ? "Yes" : "No"}
          </Div>
        </Div>
        {result.orgResourceId !== null &&
          result.orgResourceId !== undefined && (
            <Div className="col-span-2 space-y-0.5">
              <Span className="text-xs text-muted-foreground">
                {labels.orgResourceId}
              </Span>
              <Div className="font-mono text-xs">{result.orgResourceId}</Div>
            </Div>
          )}
      </Div>
    </Div>
  );
}

export function LicenseTrialContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const result = useWidgetValue<typeof definition.POST>();

  const deviceLicenseValue = form.watch("deviceLicense") ?? "";
  const targetOrganizationValue = form.watch("targetOrganization") ?? "";
  const ownerOrganizationValue = form.watch("ownerOrganization") ?? "";

  const deviceLicenseError = form.formState.errors.deviceLicense?.message;
  const targetOrganizationError =
    form.formState.errors.targetOrganization?.message;
  const ownerOrganizationError =
    form.formState.errors.ownerOrganization?.message;

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const resultLabels = {
    resultTitle: t("post.widget.resultTitle"),
    licenseId: t("post.response.licenseId"),
    productLabel: t("post.response.productLabel"),
    productCode: t("post.response.productCode"),
    code: t("post.response.code"),
    expirationDate: t("post.response.expirationDate"),
    autorenew: t("post.response.autorenew"),
    orgResourceId: t("post.response.orgResourceId"),
  };

  if (isCompact) {
    if (result !== null && result !== undefined) {
      return (
        <Div className="font-mono text-sm p-2">
          {`license #${result.licenseId}: ${result.productCode} code:${result.code}`}
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
        <Key className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))] p-4 space-y-4">
        <Div className="space-y-1.5">
          <Label htmlFor="trial-device-license">
            {t("post.deviceLicense.label")}
          </Label>
          <Input
            id="trial-device-license"
            type="text"
            value={deviceLicenseValue}
            onChange={(e) =>
              form.setValue("deviceLicense", e.target.value, {
                shouldDirty: true,
              })
            }
            placeholder={t("post.deviceLicense.placeholder")}
          />
          {deviceLicenseError ? (
            <Span className="text-xs text-destructive">
              {deviceLicenseError}
            </Span>
          ) : (
            <Span className="text-xs text-muted-foreground">
              {t("post.deviceLicense.description")}
            </Span>
          )}
        </Div>

        <Div className="grid grid-cols-2 gap-4">
          <Div className="space-y-1.5">
            <Label htmlFor="trial-target-org">
              {t("post.targetOrganization.label")}
            </Label>
            <Input
              id="trial-target-org"
              type="text"
              value={targetOrganizationValue}
              onChange={(e) =>
                form.setValue(
                  "targetOrganization",
                  e.target.value || undefined,
                  { shouldDirty: true },
                )
              }
              placeholder={t("post.targetOrganization.placeholder")}
            />
            {targetOrganizationError ? (
              <Span className="text-xs text-destructive">
                {targetOrganizationError}
              </Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.targetOrganization.description")}
              </Span>
            )}
          </Div>

          <Div className="space-y-1.5">
            <Label htmlFor="trial-owner-org">
              {t("post.ownerOrganization.label")}
            </Label>
            <Input
              id="trial-owner-org"
              type="text"
              value={ownerOrganizationValue}
              onChange={(e) =>
                form.setValue(
                  "ownerOrganization",
                  e.target.value || undefined,
                  { shouldDirty: true },
                )
              }
              placeholder={t("post.ownerOrganization.placeholder")}
            />
            {ownerOrganizationError ? (
              <Span className="text-xs text-destructive">
                {ownerOrganizationError}
              </Span>
            ) : (
              <Span className="text-xs text-muted-foreground">
                {t("post.ownerOrganization.description")}
              </Span>
            )}
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          className="w-full gap-2"
          onClick={onSubmit ?? undefined}
        >
          <Key className="h-4 w-4" />
          {t("post.submitButton.label")}
        </Button>

        {result !== null && result !== undefined && (
          <LicenseTrialResult result={result} labels={resultLabels} />
        )}
      </Div>
    </Div>
  );
}
