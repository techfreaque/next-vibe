"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Key } from "next-vibe-ui/ui/icons/Key";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import definition from "./definition";
import type { LicenseGetResponseOutput } from "./definition";
import type { LicenseByIdT } from "./i18n";

const MS_PER_DAY = 86_400_000;
const WARNING_DAYS = 30;

function formatDate(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

function formatDateShort(epoch: number | null | undefined): string {
  if (epoch === null || epoch === undefined) {
    return "none";
  }
  return new Date(epoch).toISOString().slice(0, 10);
}

function isExpiringSoon(epoch: number | null | undefined): boolean {
  if (epoch === null || epoch === undefined) {
    return false;
  }
  return epoch - Date.now() < WARNING_DAYS * MS_PER_DAY;
}

function isExpired(epoch: number | null | undefined): boolean {
  if (epoch === null || epoch === undefined) {
    return false;
  }
  return epoch < Date.now();
}

function LicenseStatusBadge({
  license,
  t,
}: {
  license: LicenseGetResponseOutput;
  t: LicenseByIdT;
}): React.JSX.Element {
  const expired = isExpired(license.expirationDate);
  const expiringSoon = isExpiringSoon(license.expirationDate);

  if (expired) {
    return (
      <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
        {t("get.widget.expired")}
      </Span>
    );
  }
  if (expiringSoon) {
    return (
      <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
        {t("get.widget.expiringSoon")}
      </Span>
    );
  }
  return (
    <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
      {t("get.widget.active")}
    </Span>
  );
}

function LicenseField({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-0.5">
      <Span className="text-xs text-muted-foreground">{label}</Span>
      <Span className={cn("text-sm font-medium", mono && "font-mono")}>
        {value}
      </Span>
    </Div>
  );
}

export function LicenseDetailContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { push: navigate, pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;

  const handleUpdate = useCallback((): void => {
    if (!data) {
      return;
    }
    void (async (): Promise<void> => {
      navigate(definition.PUT, {
        urlPathParams: { licenseId: data.licenseId },
      });
    })();
  }, [data, navigate]);

  const handleRenew = useCallback((): void => {
    if (!data) {
      return;
    }
    void (async (): Promise<void> => {
      navigate(definition.POST, {
        urlPathParams: { licenseId: data.licenseId },
      });
    })();
  }, [data, navigate]);

  const handleDelete = useCallback((): void => {
    if (!data) {
      return;
    }
    void (async (): Promise<void> => {
      navigate(definition.DELETE, {
        urlPathParams: { licenseId: data.licenseId },
      });
    })();
  }, [data, navigate]);

  if (!data) {
    return <Div />;
  }

  if (isMcp) {
    const lines = [
      `license #${data.licenseId}: ${data.code} [${data.productLabel}]`,
      `  type:${data.productType} trial:${data.productTrial ? "Y" : "N"} used:${data.used ? "Y" : "N"}`,
      `  created:${formatDateShort(data.creationDate)} activated:${formatDateShort(data.activationDate)} expires:${formatDateShort(data.expirationDate)}`,
      `  autorenew:${data.autorenew ? "Y" : "N"} price:${data.price !== null && data.price !== undefined ? `${data.price} ${data.currency ?? ""}` : "none"}`,
      data.orgResourceId ? `  org:${data.orgResourceId}` : "",
    ].filter(Boolean);
    return (
      <Div className="font-mono text-sm p-2 whitespace-pre">
        {lines.join("\n")}
      </Div>
    );
  }

  const expiringSoon = isExpiringSoon(data.expirationDate);

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-2.5 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => pop()}
          title={t("get.widget.actions.back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Key className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {data.productLabel}
        </Span>
      </Div>

      <Div className="flex flex-col gap-4 p-4">
        <Div className="flex items-center gap-3">
          <Div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Key className="h-5 w-5 text-primary" />
          </Div>
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span className="font-semibold">{data.productLabel}</Span>
              {data.productTrial && (
                <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  {t("get.widget.trial")}
                </Span>
              )}
              <LicenseStatusBadge license={data} t={t} />
            </Div>
            <Span className="text-xs text-muted-foreground font-mono">
              {data.productCode}
            </Span>
          </Div>
        </Div>

        <Div className="grid grid-cols-2 gap-3">
          <LicenseField label={t("get.response.code")} value={data.code} mono />
          <LicenseField
            label={t("get.response.orgResourceId")}
            value={data.orgResourceId ?? "—"}
            mono
          />
          <LicenseField
            label={t("get.response.expirationDate")}
            value={
              <Span
                className={cn(expiringSoon && "text-warning font-semibold")}
              >
                {data.expirationDate !== null &&
                data.expirationDate !== undefined
                  ? formatDate(data.expirationDate)
                  : t("get.widget.noExpiry")}
              </Span>
            }
          />
          <LicenseField
            label={t("get.response.activationDate")}
            value={formatDate(data.activationDate)}
          />
          <LicenseField
            label={t("get.response.creationDate")}
            value={formatDate(data.creationDate)}
          />
          <LicenseField
            label={t("get.response.price")}
            value={
              data.price !== null && data.price !== undefined
                ? `${data.price} ${data.currency ?? ""}`
                : "—"
            }
          />
        </Div>

        {!isCli && (
          <Div className="flex gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUpdate}
            >
              {t("get.widget.actions.update")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRenew}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              {t("get.widget.actions.renew")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 ml-auto"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {t("get.widget.actions.delete")}
            </Button>
          </Div>
        )}
      </Div>
    </Div>
  );
}

export function LicenseUpdateContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.PUT>();
  const data = useWidgetValue<typeof definition.PUT>();
  const isMcp = platform === Platform.MCP;

  if (data && isMcp) {
    return (
      <Div className="font-mono text-sm p-2">
        {`updated license #${data.licenseId}: autorenew:${data.autorenew ? "Y" : "N"} expires:${formatDateShort(data.expirationDate)}`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />
      <Div className="grid grid-cols-2 gap-3">
        <Div className="col-span-2">
          <Span className="text-xs text-muted-foreground">
            {t("put.expirationDate.label")}
          </Span>
        </Div>
      </Div>
      <SubmitButtonWidget<typeof definition.PUT>
        field={{
          text: "put.submitButton.label",
          loadingText: "put.submitButton.loadingText",
          icon: "save",
          variant: "primary",
        }}
      />
    </Div>
  );
}

export function LicenseDeleteContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const data = useWidgetValue<typeof definition.DELETE>();
  const isMcp = platform === Platform.MCP;
  const [confirmed, setConfirmed] = useState(false);
  const { endpointMutations } = useWidgetContext();
  const user = useWidgetUser();

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!confirmed || !user || !data) {
      return;
    }
    await endpointMutations?.delete?.submit?.({});
  }, [confirmed, user, data, endpointMutations]);

  if (data && isMcp) {
    return (
      <Div className="font-mono text-sm p-2">
        {`deleted license #${data.licenseId}: ${data.code}`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />
      <Div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
        {t("delete.description")}
      </Div>
      <Div className="flex items-center gap-2">
        <Checkbox
          id="confirm-delete"
          checked={confirmed}
          onCheckedChange={(v) => setConfirmed(v === true)}
        />
        <Label
          htmlFor="confirm-delete"
          className="text-sm select-none cursor-pointer"
        >
          {t("delete.title")}
        </Label>
      </Div>
      <Button
        type="button"
        variant="destructive"
        disabled={!confirmed}
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        {t("delete.title")}
      </Button>
    </Div>
  );
}

export function LicenseRenewContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const isMcp = platform === Platform.MCP;

  if (data && isMcp) {
    return (
      <Div className="font-mono text-sm p-2">
        {`renewed license #${data.licenseId}: expires:${formatDateShort(data.expirationDate)}`}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <FormAlertWidget field={{}} />
      {data && (
        <Div className="rounded-md bg-success/10 border border-success/20 p-3 text-sm text-success">
          {t("post.success.description")}
          {data.expirationDate !== null &&
            data.expirationDate !== undefined && (
              <Span className="ml-2 font-semibold">
                {formatDate(data.expirationDate)}
              </Span>
            )}
        </Div>
      )}
      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.submitButton.label",
          loadingText: "post.submitButton.loadingText",
          icon: "refresh-cw",
          variant: "primary",
        }}
      />
    </Div>
  );
}
