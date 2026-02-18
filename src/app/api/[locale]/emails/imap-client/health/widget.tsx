/**
 * Custom Widget for IMAP Health Status
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import { ImapHealthStatus } from "../enum";
import type definition from "./definition";
import type { ImapHealthGetResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ImapHealthGetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

const STATUS_COLORS: Record<string, string> = {
  [ImapHealthStatus.HEALTHY]: "#22c55e",
  [ImapHealthStatus.WARNING]: "#f97316",
  [ImapHealthStatus.ERROR]: "#ef4444",
  [ImapHealthStatus.MAINTENANCE]: "#6b7280",
};

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}): React.JSX.Element {
  return (
    <Div className="rounded-lg border p-4 flex flex-col gap-1">
      <Span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </Span>
      <Div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{value}</Div>
    </Div>
  );
}

export function ImapHealthContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const t = useWidgetTranslation();
  const isLoading = data === null || data === undefined;

  const statusColor =
    data !== null && data !== undefined
      ? (STATUS_COLORS[data.status] ?? "#6b7280")
      : "#6b7280";

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.imapClient.health.title")}
        </Span>
        {!isLoading && (
          <Div
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 10px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: `${statusColor}22`,
              color: statusColor,
            }}
          >
            {t(data.status)}
          </Div>
        )}
      </Div>

      {isLoading ? (
        <Div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      ) : (
        <Div className="p-4 flex flex-col gap-6">
          {/* Accounts */}
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label={t("app.api.emails.imapClient.health.accountsHealthy")}
              value={data.accountsHealthy}
            />
            <StatCard
              label={t("app.api.emails.imapClient.health.accountsTotal")}
              value={data.accountsTotal}
            />
            <StatCard
              label={t("app.api.emails.imapClient.health.connectionsActive")}
              value={data.connectionsActive}
            />
            <StatCard
              label={t("app.api.emails.imapClient.health.connectionErrors")}
              value={data.connectionErrors}
            />
          </Div>

          {/* Performance */}
          <Div className="rounded-lg border p-4 flex flex-col gap-2">
            <Span className="text-sm font-semibold">
              {t("app.api.emails.imapClient.health.performance")}
            </Span>
            <Div className="flex items-center justify-between text-sm">
              <Span className="text-muted-foreground">
                {t("app.api.emails.imapClient.health.avgResponseTime")}
              </Span>
              <Span className="font-semibold">
                {Math.round(data.avgResponseTime)}
                {"ms"}
              </Span>
            </Div>
            <Div className="flex items-center justify-between text-sm">
              <Span className="text-muted-foreground">
                {t("app.api.emails.imapClient.health.uptime")}
              </Span>
              <Span className="font-semibold">{data.uptime}</Span>
            </Div>
            <Div className="flex items-center justify-between text-sm">
              <Span className="text-muted-foreground">
                {t("app.api.emails.imapClient.health.serverStatus")}
              </Span>
              <Span className="font-semibold">{data.serverStatus}</Span>
            </Div>
          </Div>

          {/* Sync stats */}
          <Div className="rounded-lg border p-4 flex flex-col gap-2">
            <Span className="text-sm font-semibold">
              {t("app.api.emails.imapClient.health.syncStats")}
            </Span>
            <Div className="flex items-center justify-between text-sm">
              <Span className="text-muted-foreground">
                {t("app.api.emails.imapClient.health.totalSyncs")}
              </Span>
              <Span className="font-semibold">{data.syncStats.totalSyncs}</Span>
            </Div>
            {data.syncStats.lastSyncTime !== null &&
              data.syncStats.lastSyncTime !== undefined && (
                <Div className="flex items-center justify-between text-sm">
                  <Span className="text-muted-foreground">
                    {t("app.api.emails.imapClient.health.lastSyncTime")}
                  </Span>
                  <Span className="font-semibold">
                    {data.syncStats.lastSyncTime}
                  </Span>
                </Div>
              )}
          </Div>
        </Div>
      )}
    </Div>
  );
}
