/**
 * Fleet health report (admin): every peer connection on this server, all
 * owners. Rendered by the list widget on the tools page, CLI and MCP.
 * Pure view over the stored-state response: nothing here contacts a remote.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import {
  AnalyticsToolbar,
  BreakdownTable,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { Pre } from "next-vibe/ui/components/pre";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";
import { useState } from "react";

import type { CountryLanguage } from "../../core/i18n/core/config";
import { useRelatedEntityNavigation } from "../../unified-ui/_shared/related-entities";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "../../unified-ui/_shared/use-widget-context";
import { formatPeriod } from "../../unified-ui/analytics/format";
import type { ConnectionIssue } from "../health-types";
import type endpoints from "./definition";
import type { RemoteConnectionsListResponseOutput } from "./definition";
import { FleetStatusFilter, type FleetStatusFilterValue } from "./enum";

type FleetStatusValue = typeof FleetStatusFilterValue;

type Fleet = NonNullable<RemoteConnectionsListResponseOutput["fleet"]>;
type FleetRow = Fleet["rows"][number];
type FleetT = ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
type Health = FleetRow["status"];
type Transport = FleetRow["transportMode"];
type AuditAction = Fleet["audit"]["recent"][number]["action"];

const STATUS_VARIANT: Record<Health, StatusPillVariant> = {
  critical: "danger",
  warning: "warning",
  disconnected: "muted",
  healthy: "success",
};

const STATUS_BAR: Record<Health, string> = {
  critical: "bg-destructive",
  warning: "bg-warning",
  disconnected: "bg-muted-foreground/40",
  healthy: "bg-success",
};

const ISSUE_TONE: Record<ConnectionIssue, string> = {
  reauthRequired: "text-destructive",
  noToken: "text-destructive",
  accessDenied: "text-destructive",
  inactive: "text-muted-foreground",
  neverSynced: "text-warning",
  staleSync: "text-warning",
  transportDrift: "text-warning",
  transportMismatch: "text-warning",
  peerToolsStale: "text-muted-foreground",
};

const FILTER_LABEL: Record<
  FleetStatusValue,
  | "enums.fleetStatus.all"
  | "enums.fleetStatus.unhealthy"
  | "enums.fleetStatus.critical"
  | "enums.fleetStatus.warning"
  | "enums.fleetStatus.disconnected"
  | "enums.fleetStatus.healthy"
> = {
  [FleetStatusFilter.ALL]: "enums.fleetStatus.all",
  [FleetStatusFilter.UNHEALTHY]: "enums.fleetStatus.unhealthy",
  [FleetStatusFilter.CRITICAL]: "enums.fleetStatus.critical",
  [FleetStatusFilter.WARNING]: "enums.fleetStatus.warning",
  [FleetStatusFilter.DISCONNECTED]: "enums.fleetStatus.disconnected",
  [FleetStatusFilter.HEALTHY]: "enums.fleetStatus.healthy",
};

function intlLocale(locale: CountryLanguage): string {
  return locale.split("-")[0] ?? "en";
}

function relative(
  value: string | null,
  locale: CountryLanguage,
  t: FleetT,
): string {
  if (!value) {
    return t("fleet.never");
  }
  const diffSec = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), {
    numeric: "auto",
  });
  if (abs < 60) {
    return rtf.format(diffSec, "second");
  }
  if (abs < 3600) {
    return rtf.format(Math.round(diffSec / 60), "minute");
  }
  if (abs < 86_400) {
    return rtf.format(Math.round(diffSec / 3600), "hour");
  }
  return rtf.format(Math.round(diffSec / 86_400), "day");
}

function absolute(value: string | null, locale: CountryLanguage): string {
  return value
    ? new Date(value).toLocaleString(intlLocale(locale), {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";
}

function transportLabel(mode: Transport | null, t: FleetT): string {
  if (!mode) {
    return t("fleet.detail.unknown");
  }
  return mode === "reverse-ws"
    ? t("fleet.transport.reverseWs")
    : t("fleet.transport.directHttp");
}

function issueText(
  issue: ConnectionIssue,
  row: FleetRow,
  t: FleetT,
  locale: CountryLanguage,
): string {
  if (issue === "neverSynced") {
    return t("fleet.issue.neverSynced", {
      at: relative(row.createdAt, locale, t),
    });
  }
  if (issue === "inactive" && row.lastDisconnectAt) {
    return t("fleet.issue.disconnectedAt", {
      at: relative(row.lastDisconnectAt, locale, t),
    });
  }
  if (issue === "accessDenied") {
    const detail = denialText(row, t, locale);
    return detail
      ? `${t("fleet.issue.accessDenied")} · ${detail}`
      : t("fleet.issue.accessDenied");
  }
  if (issue === "transportDrift") {
    return t("fleet.issue.transportDrift", {
      used: transportLabel(row.lastTransportUsed, t),
      configured: transportLabel(row.transportMode, t),
    });
  }
  if (issue === "transportMismatch" && row.pairedPeer) {
    // The peer's row mirrors ours: its remote leg is our out, its out is our in.
    const peer = row.pairedPeer;
    // Same sentence on both ends' rows: name the sender and the receiver.
    const legs: string[] = [];
    if (peer.remoteTransportMode !== row.transportMode) {
      legs.push(
        t("fleet.issue.mismatch", {
          sender: row.instanceId,
          receiver: peer.instanceId,
          sent: transportLabel(row.transportMode, t),
          expected: transportLabel(peer.remoteTransportMode, t),
        }),
      );
    }
    if (peer.transportMode !== row.remoteTransportMode) {
      legs.push(
        t("fleet.issue.mismatch", {
          sender: peer.instanceId,
          receiver: row.instanceId,
          sent: transportLabel(peer.transportMode, t),
          expected: transportLabel(row.remoteTransportMode, t),
        }),
      );
    }
    return legs.length > 0
      ? legs.join(" · ")
      : t("fleet.issue.transportMismatch");
  }
  return t(`fleet.issue.${issue}`);
}

function actionLabel(action: AuditAction, t: FleetT): string {
  return t(`fleet.action.${action}`);
}

/** "purpose:reason" for display; "rateLimited" repeats the action, drop it. */
function reasonText(reason: string): string {
  return reason
    .split(":")
    .reduce<string[]>(
      (out, part) => (part === "rateLimited" ? out : [...out, part]),
      [],
    )
    .join(" · ");
}

function reasonLabel(key: string | null, t: FleetT): string {
  if (!key) {
    return "";
  }
  // key = action[:purpose:reason]; "rateLimited" repeats the action, drop it.
  const [action, ...rest] = key.split(":");
  const match = AUDIT_ACTIONS.find((a) => a === action);
  const head = match ? actionLabel(match, t) : (action ?? "");
  const tail = rest.reduce<string[]>(
    (out, part) => (part === "rateLimited" ? out : [...out, part]),
    [],
  );
  return tail.length > 0 ? `${head} · ${tail.join(" · ")}` : head;
}

const AUDIT_ACTIONS: readonly AuditAction[] = [
  "registered",
  "reregistered",
  "disconnected",
  "denied",
  "rate_limited",
];

const SCOPE_KEYS = [
  "memories",
  "documents",
  "skills",
  "favorites",
  "threads",
] as const;

function toolsText(row: FleetRow, t: FleetT): string {
  return row.capabilitiesCount > 0
    ? t("fleet.trust.tools", { count: row.capabilitiesCount })
    : t("fleet.trust.noTools");
}

function buildText(row: FleetRow, t: FleetT): string {
  return row.capabilitiesVersion
    ? t("fleet.trust.peerBuild", { version: row.capabilitiesVersion })
    : t("fleet.trust.noBuild");
}

/** Trust facts in priority order: role, tools, sync scope, loop, flags. */
function syncText(row: FleetRow, t: FleetT): string {
  const on: string[] = [];
  const off: string[] = [];
  for (const k of SCOPE_KEYS) {
    (row.syncScope[k] ? on : off).push(t(`fleet.scope.${k}`));
  }
  if (off.length === 0) {
    return t("fleet.trust.syncsAll");
  }
  if (on.length === 0) {
    return t("fleet.trust.syncsNone");
  }
  return off.length <= 2
    ? t("fleet.trust.syncsAllBut", { missing: off.join(", ") })
    : t("fleet.trust.syncsOnly", { list: on.join(", ") });
}

/** What the peer can do / holds: tools and sync scope. */
function capabilityParts(row: FleetRow, t: FleetT): string[] {
  return [toolsText(row, t), buildText(row, t), syncText(row, t)];
}

/** Deviations in what the peer is trusted with: role, AI loop, provider flags. */
function trustParts(row: FleetRow, t: FleetT): string[] {
  // Only what deviates from the default (customer rights, AI on the peer).
  const parts: string[] = [];
  if (row.ownerIsAdmin) {
    parts.push(t("fleet.trust.admin"));
  }
  if (row.loopLocation !== "target") {
    parts.push(t("fleet.trust.loopHere"));
  }
  if (row.isInferenceProvider) {
    parts.push(t("fleet.detail.inference"));
  }
  if (row.forceSystemProvider) {
    parts.push(t("fleet.detail.forced"));
  }
  return parts;
}

function shortDate(value: string | null, locale: CountryLanguage): string {
  return value
    ? new Date(value).toLocaleDateString(intlLocale(locale), {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "";
}

/** A bare "inactive" only repeats the Disconnected pill; show it with a date. */
function shownIssues(row: FleetRow): ConnectionIssue[] {
  return row.issues.reduce<ConnectionIssue[]>(
    (out, issue) =>
      issue === "inactive" && !row.lastDisconnectAt ? out : [...out, issue],
    [],
  );
}

function FlagIcon({ on }: { on: boolean }): JSX.Element | null {
  return on ? (
    <AlertTriangle className="mr-0.5 inline h-3 w-3 align-[-2px]" />
  ) : null;
}

const SEP = " · ";

function seg(flagged: boolean): string {
  return flagged ? "font-medium text-warning" : "";
}

function lastCallText(row: FleetRow, t: FleetT): string {
  return row.lastTransportUsed
    ? t("fleet.lastCall", { used: transportLabel(row.lastTransportUsed, t) })
    : t("fleet.lastCallNone");
}

/** Which transport segments disagree (configured vs attested vs mirror row). */
function transportFlags(row: FleetRow): {
  out: boolean;
  in: boolean;
  lastCall: boolean;
} {
  const drift =
    row.lastTransportUsed !== null &&
    row.lastTransportUsed !== row.transportMode;
  const peer = row.pairedPeer;
  return {
    out:
      drift ||
      (peer !== null && peer.remoteTransportMode !== row.transportMode),
    in: peer !== null && peer.transportMode !== row.remoteTransportMode,
    lastCall: drift,
  };
}

function denialText(
  row: FleetRow,
  t: FleetT,
  locale: CountryLanguage,
): string | null {
  const d = row.lastDenial;
  if (!d) {
    return null;
  }
  return t("fleet.issue.denial", {
    action: actionLabel(d.action, t),
    reason: d.reason ? reasonText(d.reason) : t("fleet.detail.unknown"),
    at: relative(d.createdAt, locale, t),
  });
}

// ─── Text rendering (CLI + MCP) ───────────────────────────────────────────────

function renderFleetText(
  fleet: Fleet,
  t: FleetT,
  locale: CountryLanguage,
): string {
  const lines: string[] = [];
  const c = fleet.counts;
  lines.push(t("fleet.title").toUpperCase());
  lines.push(
    t("fleet.cli.counts", {
      total: c.total,
      healthy: c.healthy,
      unhealthy: c.unhealthy,
      disconnected: c.disconnected,
    }),
  );
  lines.push(
    t("fleet.kpi.unhealthyHint", { critical: c.critical, warning: c.warning }),
  );
  lines.push(
    t("fleet.kpi.totalHint", {
      active: c.active,
      inactive: c.total - c.active,
    }),
  );
  // Rows arrive sorted critical, warning, disconnected, healthy (server).
  const attention: FleetRow[] = [];
  const disconnected: FleetRow[] = [];
  const healthy: FleetRow[] = [];
  for (const r of fleet.rows) {
    (r.status === "healthy"
      ? healthy
      : r.status === "disconnected"
        ? disconnected
        : attention
    ).push(r);
  }
  const groups: Array<{ title: string; rows: FleetRow[] }> = [
    { title: t("fleet.cli.attention"), rows: attention },
    { title: t("fleet.status.disconnected"), rows: disconnected },
    { title: t("fleet.cli.ok"), rows: healthy },
  ];
  for (const group of groups) {
    lines.push("");
    lines.push(`${group.title} (${group.rows.length})`);
    if (group.rows.length === 0) {
      lines.push(`  ${t("fleet.cli.none")}`);
    }
    for (const r of group.rows) {
      const dir = r.isReverseEntry
        ? t("fleet.direction.incoming")
        : t("fleet.direction.outgoing");
      lines.push(
        `  ${t(`fleet.status.${r.status}`).toUpperCase().padEnd(13)}${r.instanceId}  ${r.ownerEmail}${r.isMine ? ` (${t("fleet.yours")})` : ""}${r.pairedPeer ? ` (${t("fleet.otherEnd", { peer: r.pairedPeer.instanceId })})` : ""}`,
      );
      lines.push(
        `    ${dir} · ${t("fleet.transportPair", {
          out: transportLabel(r.transportMode, t),
          in: transportLabel(r.remoteTransportMode, t),
        })} · ${lastCallText(r, t)} · ${t("fleet.cli.lastContact", {
          at: r.lastContactAt
            ? `${relative(r.lastContactAt, locale, t)} (${shortDate(r.lastContactAt, locale)})`
            : t("fleet.never"),
        })}`,
      );
      lines.push(
        `    ${[
          ...(trustParts(r, t).length > 0
            ? trustParts(r, t)
            : [t("fleet.trust.standard")]),
          ...capabilityParts(r, t),
        ].join(" · ")}`,
      );
      for (const issue of shownIssues(r)) {
        lines.push(`    - ${issueText(issue, r, t, locale)}`);
      }
      const denial = r.issues.includes("accessDenied")
        ? null
        : denialText(r, t, locale);
      if (denial) {
        lines.push(`    - ${t("fleet.earlier", { text: denial })}`);
      }
    }
  }
  const a = fleet.audit;
  lines.push("");
  lines.push(
    t("fleet.cli.audit", {
      period: formatPeriod(fleet.window.from, fleet.window.to, locale),
      events: a.events.value,
      failures: a.failures.value,
    }),
  );
  for (const r of a.byReason) {
    lines.push(
      `  ${String(r.metrics.events ?? 0).padStart(4)}  ${reasonLabel(r.key, t)}`,
    );
  }
  return lines.join("\n");
}

// ─── Web rows ─────────────────────────────────────────────────────────────────

function ConnectionHealthRow({
  row,
  t,
  locale,
  localVersion,
  interactive,
}: {
  row: FleetRow;
  t: FleetT;
  locale: CountryLanguage;
  localVersion: string;
  interactive: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const navigate = useRelatedEntityNavigation();

  // An open denial is already an issue; older ones are history (muted).
  const history = row.issues.includes("accessDenied")
    ? null
    : denialText(row, t, locale);
  const denial = history ? t("fleet.earlier", { text: history }) : null;
  const flags = transportFlags(row);

  const chip = "px-1.5 py-0 text-[11px] font-normal";

  return (
    <Div className="relative flex min-w-0 flex-col gap-1.5 py-2.5 pl-4 pr-3">
      <Span
        className={`absolute inset-y-2 left-0 w-1 rounded-full ${STATUS_BAR[row.status]}`}
      />
      <Div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <StatusPill
          status={t(`fleet.status.${row.status}`)}
          variant={STATUS_VARIANT[row.status]}
        />
        <Span className="min-w-0 font-mono text-sm font-semibold [overflow-wrap:anywhere]">
          {row.instanceId}
        </Span>
        <Badge variant="outline" className={chip}>
          {row.isReverseEntry
            ? t("fleet.direction.incoming")
            : t("fleet.direction.outgoing")}
        </Badge>
        {row.isMine && (
          <Badge variant="secondary" className={chip}>
            {t("fleet.direction.mine")}
          </Badge>
        )}
        <Span
          className="basis-full text-xs tabular-nums text-muted-foreground @2xl:ml-auto @2xl:basis-auto"
          title={absolute(row.lastContactAt, locale)}
        >
          {t("fleet.detail.lastContact")}{" "}
          <Span className="font-medium text-foreground">
            {relative(row.lastContactAt, locale, t)}
          </Span>
          {row.lastContactAt
            ? ` · ${shortDate(row.lastContactAt, locale)}`
            : ""}
        </Span>
      </Div>

      {shownIssues(row).length > 0 && (
        <Div className="flex flex-col gap-0.5">
          {shownIssues(row).map((issue) => (
            <Span key={issue} className={`text-xs ${ISSUE_TONE[issue]}`}>
              {issueText(issue, row, t, locale)}
            </Span>
          ))}
        </Div>
      )}

      <Div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-1 text-xs @2xl:grid-cols-2">
        <Span className="min-w-0 [overflow-wrap:anywhere]">
          <Span className="text-muted-foreground">
            {t("fleet.meta.owner")}{" "}
          </Span>
          {row.ownerEmail}
          {row.pairedPeer
            ? `${SEP}${t("fleet.otherEnd", { peer: row.pairedPeer.instanceId })}`
            : ""}
        </Span>
        <Div className="grid min-w-0 grid-cols-3 gap-2 tabular-nums">
          {(
            [
              [
                "out",
                t("fleet.meta.out"),
                transportLabel(row.transportMode, t),
                flags.out,
              ],
              [
                "in",
                t("fleet.meta.in"),
                transportLabel(row.remoteTransportMode, t),
                flags.in,
              ],
              [
                "last",
                t("fleet.meta.lastCall"),
                row.lastTransportUsed
                  ? transportLabel(row.lastTransportUsed, t)
                  : t("fleet.meta.none"),
                row.lastTransportUsed !== null && flags.lastCall,
              ],
            ] as const
          ).map(([key, label, value, flagged]) => (
            <Span key={key} className="flex min-w-0 flex-col leading-tight">
              <Span className="truncate text-[11px] text-muted-foreground">
                {label}
              </Span>
              <Span className={flagged ? seg(true) : "font-medium"}>
                <FlagIcon on={flagged} />
                {value}
              </Span>
            </Span>
          ))}
        </Div>
        {trustParts(row, t).length > 0 ? (
          <Div className="flex min-w-0 flex-wrap items-center gap-1">
            <Span className="mr-0.5 text-muted-foreground">
              {t("fleet.meta.trust")}
            </Span>
            {trustParts(row, t).map((part) => (
              <Badge
                key={part}
                variant="secondary"
                className={`${chip} font-medium text-info`}
              >
                {part}
              </Badge>
            ))}
          </Div>
        ) : (
          <Span className="text-muted-foreground">
            {t("fleet.trust.standard")}
          </Span>
        )}
        <Div className="flex min-w-0 flex-wrap items-center gap-1">
          <Span className="mr-0.5 text-muted-foreground">
            {t("fleet.meta.capabilities")}
          </Span>
          {capabilityParts(row, t).map((part) => (
            <Badge key={part} variant="outline" className={chip}>
              {part}
            </Badge>
          ))}
        </Div>
      </Div>

      {denial && (
        <Span className="text-xs text-muted-foreground">{denial}</Span>
      )}

      {interactive && (
        <Div className="-ml-2 flex flex-wrap gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setOpen((v) => !v)}
          >
            {open
              ? t("fleet.detail.hideDetails")
              : t("fleet.detail.showDetails")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() =>
              navigate(
                async () =>
                  (await import("@/users/view/definition")).default.GET,
                { data: { userId: row.ownerUserId } },
              )
            }
          >
            {t("fleet.detail.openOwner")}
          </Button>
          {row.isMine && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() =>
                navigate(
                  async () =>
                    (await import("../[instanceId]/definition")).default.GET,
                  { urlPathParams: { instanceId: row.instanceId } },
                )
              }
            >
              {t("fleet.detail.openDetail")}
            </Button>
          )}
        </Div>
      )}

      {(open || !interactive) && (
        <ConnectionDetails
          row={row}
          t={t}
          locale={locale}
          localVersion={localVersion}
        />
      )}
    </Div>
  );
}

function ConnectionDetails({
  row,
  t,
  locale,
  localVersion,
}: {
  row: FleetRow;
  t: FleetT;
  locale: CountryLanguage;
  localVersion: string;
}): JSX.Element {
  const yesNo = (v: boolean): string =>
    v ? t("fleet.detail.yes") : t("fleet.detail.no");
  const scopeOn = SCOPE_KEYS.reduce<string[]>(
    (on, k) => (row.syncScope[k] ? [...on, t(`fleet.scope.${k}`)] : on),
    [],
  );
  return (
    <Div className="rounded-md border bg-muted/30 p-3">
      <DetailGrid columns={2}>
        <DetailField
          label={t("fleet.detail.remoteUrl")}
          value={row.remoteUrl}
          mono
        />
        <DetailField
          label={t("fleet.detail.owner")}
          value={`${row.ownerName} · ${row.ownerEmail}`}
        />
        <DetailField
          label={t("fleet.detail.outMode")}
          value={transportLabel(row.transportMode, t)}
        />
        <DetailField
          label={t("fleet.detail.inMode")}
          value={transportLabel(row.remoteTransportMode, t)}
        />
        <DetailField
          label={t("fleet.detail.lastUsed")}
          value={
            row.lastTransportUsed
              ? t("fleet.detail.lastUsedValue", {
                  transport: transportLabel(row.lastTransportUsed, t),
                  at: absolute(row.lastTransportUsedAt, locale),
                })
              : t("fleet.never")
          }
        />
        <DetailField
          label={t("fleet.detail.lastSynced")}
          value={
            row.lastSyncedAt
              ? absolute(row.lastSyncedAt, locale)
              : t("fleet.never")
          }
        />
        <DetailField
          label={t("fleet.detail.socket")}
          value={
            row.wsConnectedAt
              ? absolute(row.wsConnectedAt, locale)
              : t("fleet.detail.socketNone")
          }
        />
        <DetailField
          label={t("fleet.detail.capabilities")}
          value={t("fleet.detail.capabilitiesValue", {
            count: row.capabilitiesCount,
            version: row.capabilitiesVersion ?? t("fleet.detail.unknown"),
          })}
        />
        {!row.isReverseEntry && (
          <DetailField
            label={t("fleet.detail.ourTools")}
            value={
              row.sentCapabilitiesVersion === localVersion
                ? t("fleet.detail.ourToolsCurrent", {
                    sent: row.sentCapabilitiesVersion,
                  })
                : t("fleet.detail.ourToolsStale", {
                    sent: row.sentCapabilitiesVersion ?? t("fleet.detail.none"),
                    current: localVersion,
                  })
            }
          />
        )}
        <DetailField
          label={t("fleet.detail.syncScope")}
          value={
            scopeOn.length > 0 ? scopeOn.join(", ") : t("fleet.detail.none")
          }
        />
        <DetailField
          label={t("fleet.detail.loop")}
          value={
            row.loopLocation === "target"
              ? t("fleet.detail.loopTarget")
              : t("fleet.detail.loopCaller")
          }
        />
        <DetailField
          label={t("fleet.detail.inference")}
          value={yesNo(row.isInferenceProvider)}
        />
        <DetailField
          label={t("fleet.detail.forced")}
          value={yesNo(row.forceSystemProvider)}
        />
        <DetailField
          label={t("fleet.detail.created")}
          value={absolute(row.createdAt, locale)}
        />
      </DetailGrid>
    </Div>
  );
}

function TransportCell({
  value,
  flagged,
}: {
  value: string;
  flagged: boolean;
}): JSX.Element {
  return (
    <Span className={`tabular-nums ${flagged ? seg(true) : "font-medium"}`}>
      <FlagIcon on={flagged} />
      {value}
    </Span>
  );
}

const TABLE_COLS =
  "grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.3fr)_repeat(3,minmax(0,0.75fr))_minmax(0,1.9fr)] items-start gap-x-4";

function FleetTableHeader({ t }: { t: FleetT }): JSX.Element {
  return (
    <Div
      className={`${TABLE_COLS} border-b bg-muted/40 px-4 py-2 text-[11px] font-medium text-muted-foreground`}
    >
      <Span>{t("fleet.table.instance")}</Span>
      <Span>{t("fleet.detail.lastContact")}</Span>
      <Span>{t("fleet.meta.out")}</Span>
      <Span>{t("fleet.meta.in")}</Span>
      <Span>{t("fleet.meta.lastCall")}</Span>
      <Span>{t("fleet.table.trustTools")}</Span>
    </Div>
  );
}

function FleetTableRow({
  row,
  t,
  locale,
  localVersion,
  interactive,
}: {
  row: FleetRow;
  t: FleetT;
  locale: CountryLanguage;
  localVersion: string;
  interactive: boolean;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const navigate = useRelatedEntityNavigation();
  const flags = transportFlags(row);
  const history = row.issues.includes("accessDenied")
    ? null
    : denialText(row, t, locale);
  const trust = trustParts(row, t);
  return (
    <Div className="relative flex min-w-0 flex-col gap-1 px-4 py-2 text-xs">
      <Span
        className={`absolute inset-y-1.5 left-0 w-1 rounded-full ${STATUS_BAR[row.status]}`}
      />
      <Div className={TABLE_COLS}>
        <Div className="flex min-w-0 flex-col gap-0.5">
          <Div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <StatusPill
              status={t(`fleet.status.${row.status}`)}
              variant={STATUS_VARIANT[row.status]}
            />
            <Span className="min-w-0 truncate font-mono text-[13px] font-semibold">
              {row.instanceId}
            </Span>
          </Div>
          <Span className="min-w-0 text-muted-foreground [overflow-wrap:anywhere]">
            {row.isReverseEntry
              ? t("fleet.direction.incoming")
              : t("fleet.direction.outgoing")}
            {SEP}
            {row.ownerEmail}
            {row.isMine ? `${SEP}${t("fleet.yours")}` : ""}
          </Span>
          {row.pairedPeer && (
            <Span className="min-w-0 truncate text-muted-foreground">
              {t("fleet.otherEnd", { peer: row.pairedPeer.instanceId })}
            </Span>
          )}
        </Div>
        <Div
          className="flex min-w-0 flex-col gap-0.5"
          title={absolute(row.lastContactAt, locale)}
        >
          <Span className="font-medium">
            {relative(row.lastContactAt, locale, t)}
          </Span>
          <Span className="truncate text-muted-foreground">
            {shortDate(row.lastContactAt, locale)}
          </Span>
        </Div>
        <TransportCell
          value={transportLabel(row.transportMode, t)}
          flagged={flags.out}
        />
        <TransportCell
          value={transportLabel(row.remoteTransportMode, t)}
          flagged={flags.in}
        />
        {row.lastTransportUsed ? (
          <TransportCell
            value={transportLabel(row.lastTransportUsed, t)}
            flagged={flags.lastCall}
          />
        ) : (
          <Span className="text-muted-foreground">{t("fleet.meta.none")}</Span>
        )}
        <Div className="flex min-w-0 flex-col gap-0.5">
          {trust.length > 0 ? (
            <Span className="truncate font-medium text-info">
              {trust.join(SEP)}
            </Span>
          ) : (
            <Span className="truncate text-muted-foreground">
              {t("fleet.trust.standard")}
            </Span>
          )}
          <Span className="truncate">
            {[toolsText(row, t), buildText(row, t)].join(SEP)}
          </Span>
          <Span className="truncate text-muted-foreground">
            {syncText(row, t)}
          </Span>
        </Div>
      </Div>
      {(shownIssues(row).length > 0 || history || interactive) && (
        <Div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-0.5 pl-0.5">
          {shownIssues(row).map((issue) => (
            <Span key={issue} className={ISSUE_TONE[issue]}>
              {issueText(issue, row, t, locale)}
            </Span>
          ))}
          {history && (
            <Span className="text-muted-foreground">
              {t("fleet.earlier", { text: history })}
            </Span>
          )}
          {interactive && (
            <Span className="ml-auto flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setOpen((v) => !v)}
              >
                {open
                  ? t("fleet.detail.hideDetails")
                  : t("fleet.detail.showDetails")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() =>
                  navigate(
                    async () =>
                      (await import("@/users/view/definition")).default.GET,
                    { data: { userId: row.ownerUserId } },
                  )
                }
              >
                {t("fleet.detail.openOwner")}
              </Button>
              {row.isMine && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() =>
                    navigate(
                      async () =>
                        (await import("../[instanceId]/definition")).default
                          .GET,
                      { urlPathParams: { instanceId: row.instanceId } },
                    )
                  }
                >
                  {t("fleet.detail.openDetail")}
                </Button>
              )}
            </Span>
          )}
        </Div>
      )}
      {open && (
        <ConnectionDetails
          row={row}
          t={t}
          locale={locale}
          localVersion={localVersion}
        />
      )}
    </Div>
  );
}

// ─── Report ───────────────────────────────────────────────────────────────────

export function FleetHealthReport({
  fleet,
  isLoading,
  onRefresh,
}: {
  fleet: Fleet;
  isLoading: boolean;
  onRefresh: () => void;
}): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const form = useWidgetForm<typeof endpoints.GET>();
  const onSubmit = useWidgetOnSubmit();

  if (isCliPlatform(platform) || platform === Platform.MCP) {
    return <Pre>{renderFleetText(fleet, t, locale)}</Pre>;
  }

  const activeFilter = form?.watch("fleetStatus");
  const setFilter = (value: FleetStatusValue | undefined): void => {
    if (!form) {
      return;
    }
    form.setValue(
      "fleetStatus",
      value === FleetStatusFilter.ALL ? undefined : value,
      { shouldDirty: true },
    );
    onSubmit?.();
  };
  const c = fleet.counts;
  const a = fleet.audit;
  const clickable = interactive && form !== undefined;

  return (
    <Div className="@container flex min-w-0 flex-col gap-5 p-4">
      <Div className="flex flex-col gap-1">
        <Span className="text-base font-semibold">{t("fleet.title")}</Span>
        <P className="m-0 text-xs text-muted-foreground">
          {t("fleet.subtitle")}
        </P>
      </Div>

      <KpiGrid columns={4}>
        <KpiTile
          label={t("fleet.kpi.total")}
          value={c.total}
          locale={locale}
          hint={t("fleet.kpi.totalHint", {
            active: c.active,
            inactive: c.total - c.active,
          })}
          onClick={
            clickable ? () => setFilter(FleetStatusFilter.ALL) : undefined
          }
        />
        <KpiTile
          label={t("fleet.kpi.unhealthy")}
          value={c.unhealthy}
          locale={locale}
          tone={
            c.critical > 0 ? "negative" : c.warning > 0 ? "warning" : "muted"
          }
          hint={t("fleet.kpi.unhealthyHint", {
            critical: c.critical,
            warning: c.warning,
          })}
          onClick={
            clickable ? () => setFilter(FleetStatusFilter.UNHEALTHY) : undefined
          }
        />
        <KpiTile
          label={t("fleet.kpi.disconnected")}
          value={c.disconnected}
          locale={locale}
          tone="muted"
          hint={t("fleet.kpi.disconnectedHint")}
          onClick={
            clickable
              ? () => setFilter(FleetStatusFilter.DISCONNECTED)
              : undefined
          }
        />
        <KpiTile
          label={t("fleet.kpi.healthy")}
          value={c.healthy}
          locale={locale}
          tone="positive"
          hint={t("fleet.kpi.healthyHint")}
          onClick={
            clickable ? () => setFilter(FleetStatusFilter.HEALTHY) : undefined
          }
        />
      </KpiGrid>

      <Div className="flex min-w-0 flex-col gap-2">
        <Div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Span className="text-sm font-semibold">
            {t("fleet.table.title")}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t("fleet.table.subtitle")}
          </Span>
          <Span className="ml-auto text-xs tabular-nums text-muted-foreground">
            {t("fleet.table.count", {
              shown: fleet.rows.length,
              total: c.total,
            })}
          </Span>
        </Div>
        {clickable && (
          <Div className="flex flex-wrap gap-1.5">
            {(
              [
                [FleetStatusFilter.ALL, c.total],
                [FleetStatusFilter.UNHEALTHY, c.unhealthy],
                [FleetStatusFilter.CRITICAL, c.critical],
                [FleetStatusFilter.WARNING, c.warning],
                [FleetStatusFilter.DISCONNECTED, c.disconnected],
                [FleetStatusFilter.HEALTHY, c.healthy],
              ] as const
            ).map(([value, n]) => {
              const selected =
                (activeFilter ?? FleetStatusFilter.ALL) === value;
              return (
                <Button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  variant={selected ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 gap-1.5 px-2.5 text-xs"
                  onClick={() => setFilter(value)}
                >
                  {t(FILTER_LABEL[value])}
                  <Span className="tabular-nums text-muted-foreground">
                    {n}
                  </Span>
                </Button>
              );
            })}
          </Div>
        )}
        {fleet.rows.length === 0 ? (
          <Div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            {c.total === 0 ? t("fleet.table.emptyAll") : t("fleet.table.empty")}
          </Div>
        ) : (
          <Div className="overflow-hidden rounded-lg border bg-card">
            {/* Wide: one aligned line per connection. Narrow: cards. */}
            <Div className="hidden @4xl:block">
              <FleetTableHeader t={t} />
              <Div className="flex flex-col divide-y">
                {fleet.rows.map((row) => (
                  <FleetTableRow
                    key={row.id}
                    row={row}
                    t={t}
                    locale={locale}
                    localVersion={fleet.localCapabilitiesVersion}
                    interactive={interactive}
                  />
                ))}
              </Div>
            </Div>
            <Div className="flex min-w-0 flex-col divide-y @4xl:hidden">
              {fleet.rows.map((row) => (
                <ConnectionHealthRow
                  key={row.id}
                  row={row}
                  t={t}
                  locale={locale}
                  localVersion={fleet.localCapabilitiesVersion}
                  interactive={interactive}
                />
              ))}
            </Div>
          </Div>
        )}
      </Div>

      <Div className="flex min-w-0 flex-col gap-3">
        <Div className="flex flex-col gap-1">
          <Span className="text-sm font-semibold">
            {t("fleet.audit.title")}
          </Span>
          <P className="m-0 text-xs text-muted-foreground">
            {t("fleet.audit.subtitle")}
          </P>
        </Div>
        {form && (
          <AnalyticsToolbar
            locale={locale}
            period={fleet.window}
            isLoading={isLoading}
            onRefresh={onRefresh}
            value={{
              range: form.watch("range"),
              granularity: form.watch("granularity"),
              from: form.watch("from"),
              to: form.watch("to"),
            }}
            onChange={(patch) => {
              if (patch.range !== undefined) {
                form.setValue("range", patch.range, { shouldDirty: true });
              }
              if (patch.granularity !== undefined) {
                form.setValue("granularity", patch.granularity, {
                  shouldDirty: true,
                });
              }
              if ("from" in patch) {
                form.setValue("from", patch.from, { shouldDirty: true });
              }
              if ("to" in patch) {
                form.setValue("to", patch.to, { shouldDirty: true });
              }
              onSubmit?.();
            }}
          />
        )}
        <KpiGrid columns={2}>
          <KpiTile
            label={t("fleet.audit.events")}
            value={a.events.value}
            locale={locale}
            sparkline={a.trend.series.reduce<number[]>(
              (sum, s) => s.values.map((v, i) => v + (sum[i] ?? 0)),
              [],
            )}
          />
          <KpiTile
            label={t("fleet.audit.failures")}
            value={a.failures.value}
            previous={a.failures.previous}
            locale={locale}
            invertDelta
            tone={a.failures.value > 0 ? "negative" : "default"}
          />
        </KpiGrid>
        {a.events.value === 0 ? (
          <Div className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            {t("fleet.audit.empty")}
          </Div>
        ) : (
          <>
            <TimeSeriesChart
              title={t("fleet.audit.trend")}
              buckets={a.trend.buckets}
              bucket={fleet.window.bucket}
              variant="stacked-bar"
              locale={locale}
              series={a.trend.series.map((s) => {
                const match = AUDIT_ACTIONS.find((x) => x === s.key);
                return {
                  key: s.key,
                  label: match ? actionLabel(match, t) : s.key,
                  values: s.values,
                  color:
                    s.key === "denied"
                      ? "negative"
                      : s.key === "rate_limited"
                        ? "warning"
                        : s.key === "disconnected"
                          ? "muted"
                          : undefined,
                };
              })}
            />
            <BreakdownTable
              title={t("fleet.audit.byReason")}
              dimensionLabel={t("fleet.audit.reason")}
              columns={[{ key: "events", label: t("fleet.audit.count") }]}
              shareKey="events"
              rows={a.byReason.map((r) => ({
                id: r.key ?? "none",
                label: reasonLabel(r.key, t),
                values: r.metrics,
              }))}
              locale={locale}
            />
            <Div className="flex min-w-0 flex-col gap-1">
              <Span className="text-xs font-semibold text-muted-foreground">
                {t("fleet.audit.recent")}
              </Span>
              <Div className="flex min-w-0 flex-col divide-y rounded-lg border bg-card text-xs">
                {a.recent.map((e) => (
                  <Div
                    key={e.id}
                    className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5 px-3 py-2"
                  >
                    <Span className="w-28 shrink-0 tabular-nums text-muted-foreground">
                      {relative(e.createdAt, locale, t)}
                    </Span>
                    <Span
                      className={
                        e.action === "denied" || e.action === "rate_limited"
                          ? "font-medium text-destructive"
                          : "font-medium"
                      }
                    >
                      {actionLabel(e.action, t)}
                    </Span>
                    {e.reason && (
                      <Span className="text-muted-foreground">
                        {reasonText(e.reason)}
                      </Span>
                    )}
                    <Span className="min-w-0 truncate font-mono">
                      {e.instanceId ?? ""}
                    </Span>
                    <Span className="ml-auto min-w-0 truncate text-muted-foreground">
                      {e.ownerEmail}
                    </Span>
                  </Div>
                ))}
              </Div>
            </Div>
          </>
        )}
      </Div>
    </Div>
  );
}
