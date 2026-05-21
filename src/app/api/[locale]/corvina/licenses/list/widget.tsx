"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Key } from "next-vibe-ui/ui/icons/Key";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { LicenseListResponseOutput } from "./definition";
import type { LicensesListT } from "./i18n";

type License = LicenseListResponseOutput["licenses"][number];

const MS_PER_DAY = 86_400_000;
const WARNING_DAYS = 30;

function formatDate(epoch: number | null): string {
  if (epoch === null) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

function formatDateShort(epoch: number | null): string {
  if (epoch === null) {
    return "none";
  }
  return new Date(epoch).toISOString().slice(0, 10);
}

function isExpiringSoon(epoch: number | null): boolean {
  if (epoch === null) {
    return false;
  }
  return epoch - Date.now() < WARNING_DAYS * MS_PER_DAY;
}

function LicenseRow({
  license,
  t,
  onClick,
  compact,
}: {
  license: License;
  t: LicensesListT;
  onClick: (license: License) => void;
  compact: boolean;
}): React.JSX.Element {
  const expiringSoon = isExpiringSoon(license.expirationDate);

  if (compact) {
    return (
      <Div className="py-1 text-sm font-mono">
        <Span className="font-semibold">{license.code}</Span>
        <Span className="text-muted-foreground">{` [${license.productLabel}]`}</Span>
        <Span
          className={cn("ml-2", expiringSoon && "text-warning font-semibold")}
        >
          {` ${t("get.widget.compact.exp")}${formatDateShort(license.expirationDate)}`}
        </Span>
        <Span className="text-muted-foreground">
          {` ${t("get.widget.compact.autorenew")}${license.autorenew ? "Y" : "N"}`}
        </Span>
        {license.orgResourceId !== null && (
          <Span className="text-muted-foreground">
            {` ${t("get.widget.compact.org")}${license.orgResourceId}`}
          </Span>
        )}
      </Div>
    );
  }

  return (
    <Div
      className="group flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent cursor-pointer transition-colors"
      onClick={() => onClick(license)}
    >
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Key className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">{license.productLabel}</Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              license.productTrial
                ? "bg-warning/10 text-warning"
                : "bg-primary/10 text-primary",
            )}
          >
            {license.productType}
          </Span>
          {license.used && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
              {t("get.response.licenses.used")}
            </Span>
          )}
        </Div>
        <Div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <Span className="font-mono">{license.code}</Span>
          {license.orgResourceId !== null && (
            <>
              <Span>{t("get.widget.compact.separator")}</Span>
              <Span>{license.orgResourceId}</Span>
            </>
          )}
        </Div>
      </Div>

      <Div className="flex flex-col items-end gap-0.5 shrink-0">
        <Span
          className={cn(
            "text-xs font-mono",
            expiringSoon
              ? "text-warning font-semibold"
              : "text-muted-foreground",
          )}
        >
          {formatDate(license.expirationDate)}
        </Span>
        <Span className="text-xs text-muted-foreground/60">
          {license.autorenew ? "↻" : "—"}
        </Span>
      </Div>
    </Div>
  );
}

export function LicenseListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const licenses = data?.licenses ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleLicenseClick = useCallback(
    (license: License): void => {
      void (async (): Promise<void> => {
        const detail = await import("../[licenseId]/definition");
        navigate(detail.default.GET, {
          urlPathParams: { licenseId: license.licenseId },
        });
      })();
    },
    [navigate],
  );

  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({licenses.length}/{total})
          {isMcp && ` — use page/pageSize to paginate`}
        </Div>
        {licenses.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("get.widget.noLicensesFound")}
          </Div>
        ) : (
          licenses.map((lic) => (
            <LicenseRow
              key={lic.licenseId}
              license={lic}
              t={t}
              onClick={handleLicenseClick}
              compact={true}
            />
          ))
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Key className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {total > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : licenses.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Key className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noLicensesFound")}</Span>
          </Div>
        ) : (
          licenses.map((license) => (
            <LicenseRow
              key={license.licenseId}
              license={license}
              t={t}
              onClick={handleLicenseClick}
              compact={false}
            />
          ))
        )}
      </Div>
    </Div>
  );
}
