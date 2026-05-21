"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Bell } from "next-vibe-ui/ui/icons/Bell";
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

import { AlarmAction, AlarmStatus } from "../enums";
import type definition from "./definition";
import type { AlarmSearchResponseOutput } from "./definition";

type Alarm = AlarmSearchResponseOutput["alarms"][number];

const SEVERITY_COLORS: Record<number, string> = {
  1: "bg-blue-500/10 text-blue-600",
  2: "bg-yellow-500/10 text-yellow-600",
  3: "bg-orange-500/10 text-orange-600",
  4: "bg-red-500/10 text-red-600",
  5: "bg-red-700/10 text-red-700",
};

function severityColor(severity: number | null | undefined): string {
  if (severity === null || severity === undefined) {
    return "bg-muted text-muted-foreground";
  }
  return SEVERITY_COLORS[severity] ?? "bg-muted text-muted-foreground";
}

function AlarmRow({
  alarm,
  t,
}: {
  alarm: Alarm;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.POST>>;
}): React.JSX.Element {
  const isActive = alarm.status === AlarmStatus.ACTIVE;
  const isUnacked = alarm.action === AlarmAction.NO_ACK;
  const ts = alarm.eventTimestamp
    ? new Date(alarm.eventTimestamp).toLocaleString()
    : null;

  return (
    <Div className="flex items-start gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent/50 transition-colors">
      <Div
        className={cn(
          "mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm",
          severityColor(alarm.severity),
        )}
      >
        {alarm.severity ?? "?"}
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm truncate">{alarm.name}</Span>
          {isActive && (
            <Badge variant="destructive" className="text-xs px-1.5 py-0 h-5">
              {t("post.enums.alarmStatus.active")}
            </Badge>
          )}
          {isUnacked && (
            <Badge
              variant="outline"
              className="text-xs px-1.5 py-0 h-5 border-orange-400 text-orange-500"
            >
              {t("post.enums.alarmAction.noAck")}
            </Badge>
          )}
        </Div>
        <Div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
          {alarm.deviceLabel && <Span>{alarm.deviceLabel}</Span>}
          {alarm.tag && (
            <Span className="font-mono opacity-70">{alarm.tag}</Span>
          )}
          {ts && <Span>{ts}</Span>}
        </Div>
      </Div>
    </Div>
  );
}

export function AlarmSearchContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop } = useWidgetNavigation();
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  const isMcp = platform === Platform.MCP;
  const isCli = platform === Platform.CLI;
  const isCompact = isCli || isMcp;

  const alarms = data?.alarms ?? [];
  const total = data?.totalElements ?? 0;
  const isLoading = data === undefined;

  const handleRefresh = useCallback((): void => {
    void endpointMutations?.create?.submit?.({});
  }, [endpointMutations]);

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        {!isCompact && (
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
        )}
        <Bell className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
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
        ) : alarms.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <AlertTriangle className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("post.widget.noAlarmsFound")}</Span>
          </Div>
        ) : (
          alarms.map((alarm) => <AlarmRow key={alarm.id} alarm={alarm} t={t} />)
        )}
      </Div>
    </Div>
  );
}
