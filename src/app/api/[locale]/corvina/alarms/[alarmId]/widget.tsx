"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { AlarmAction, AlarmStatus } from "../enums";
import type definition from "./definition";
import type { AlarmDetailResponseOutput } from "./definition";

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | number | null | undefined;
  mono?: boolean;
}): React.JSX.Element | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return (
    <Div className="flex items-start gap-2 py-1 min-w-0">
      <Span className="text-xs text-muted-foreground shrink-0 w-32">
        {label}
      </Span>
      <Span className={cn("text-sm break-all", mono && "font-mono")}>
        {String(value)}
      </Span>
    </Div>
  );
}

function formatTs(ts: Date | string | null | undefined): string | null {
  if (!ts) {
    return null;
  }
  return new Date(ts).toLocaleString();
}

function SectionHeader({ title }: { title: string }): React.JSX.Element {
  return (
    <Div className="px-4 py-2 bg-muted/30 border-b">
      <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </Span>
    </Div>
  );
}

export function AlarmDetailContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const isLoading = data === undefined;

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  if (isLoading) {
    return (
      <Div className="h-48 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  const alarm = data as AlarmDetailResponseOutput | null;

  if (!alarm) {
    return (
      <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
        <AlertTriangle className="h-8 w-8 opacity-30" />
        <Span className="text-sm">{t("get.response.name")}</Span>
      </Div>
    );
  }

  const isActive = alarm.status === AlarmStatus.ACTIVE;
  const isUnacked = alarm.action === AlarmAction.NO_ACK;

  return (
    <Div className="flex flex-col min-h-0">
      {/* Header */}
      <Div className="flex items-center gap-3 px-4 py-3 border-b">
        {!isCompact && (
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
        )}
        <Div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-base shrink-0",
            (alarm.severity ?? 0) >= 4
              ? "bg-red-500/10 text-red-600"
              : (alarm.severity ?? 0) >= 2
                ? "bg-yellow-500/10 text-yellow-600"
                : "bg-muted text-muted-foreground",
          )}
        >
          {alarm.severity ?? "?"}
        </Div>
        <Div className="flex-1 min-w-0">
          <Div className="flex items-center gap-2 flex-wrap">
            <Span className="font-semibold">{alarm.name}</Span>
            {isActive && (
              <Badge variant="destructive" className="text-xs">
                {t("get.response.status")}
              </Badge>
            )}
            {isUnacked && (
              <Badge
                variant="outline"
                className="text-xs border-orange-400 text-orange-500"
              >
                {t("get.response.action")}
              </Badge>
            )}
          </Div>
          {alarm.alarmId && (
            <Span className="text-xs font-mono text-muted-foreground">
              {alarm.alarmId}
            </Span>
          )}
        </Div>
      </Div>

      <Div className="overflow-y-auto max-h-[min(600px,calc(100dvh-200px))]">
        {/* Identity */}
        <SectionHeader title={t("get.widget.identity")} />
        <Div className="px-4 py-2">
          <DetailRow label={t("get.response.name")} value={alarm.name} />
          <DetailRow
            label={t("get.response.description")}
            value={alarm.description}
          />
          <DetailRow
            label={t("get.response.deviceLabel")}
            value={alarm.deviceLabel}
          />
          <DetailRow
            label={t("get.response.deviceId")}
            value={alarm.deviceId}
            mono
          />
          <DetailRow label={t("get.response.tag")} value={alarm.tag} mono />
          <DetailRow
            label={t("get.response.orgResourceId")}
            value={alarm.orgResourceId}
            mono
          />
        </Div>

        {/* Status */}
        <SectionHeader title={t("get.widget.statusSection")} />
        <Div className="px-4 py-2">
          <DetailRow
            label={t("get.response.severity")}
            value={alarm.severity}
          />
          <DetailRow
            label={t("get.response.alarmEnabled")}
            value={alarm.alarmEnabled}
          />
          <DetailRow label={t("get.response.ack")} value={alarm.ack} />
          <DetailRow label={t("get.response.reset")} value={alarm.reset} />
        </Div>

        {/* Timing */}
        <SectionHeader title={t("get.widget.timing")} />
        <Div className="px-4 py-2">
          <DetailRow
            label={t("get.response.eventTimestamp")}
            value={formatTs(alarm.eventTimestamp)}
          />
          <DetailRow
            label={t("get.response.updatedAt")}
            value={formatTs(alarm.updatedAt)}
          />
          <DetailRow
            label={t("get.response.acknowledgedDate")}
            value={formatTs(alarm.acknowledgedDate)}
          />
        </Div>

        {/* Metadata */}
        <SectionHeader title={t("get.widget.metadata")} />
        <Div className="px-4 py-2">
          <DetailRow label={t("get.response.user")} value={alarm.user} />
          <DetailRow label={t("get.response.comment")} value={alarm.comment} />
          <DetailRow
            label={t("get.response.realmId")}
            value={alarm.realmId}
            mono
          />
        </Div>
      </Div>
    </Div>
  );
}
