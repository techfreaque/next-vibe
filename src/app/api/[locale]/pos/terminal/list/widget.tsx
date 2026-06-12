"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Monitor } from "next-vibe-ui/ui/icons/Monitor";
import { Terminal } from "next-vibe-ui/ui/icons/Terminal";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";

import type definition from "./definition";
import type { PosTerminalListGetResponseOutput } from "./definition";

/**
 * Module-level map: terminalId → terminal name.
 * Used to pass human-readable terminal name to the session open widget
 * without polluting the API schema.
 */
export const posTerminalNameMap = new Map<string, string>();

type TerminalType = NonNullable<
  PosTerminalListGetResponseOutput["terminals"]
>[number];

function TerminalRow({
  terminal,
  onOpenSession,
  activeLabel,
  inactiveLabel,
  openSessionLabel,
}: {
  terminal: TerminalType;
  onOpenSession: (terminal: TerminalType) => void;
  activeLabel: string;
  inactiveLabel: string;
  openSessionLabel: string;
}): JSX.Element {
  return (
    <Div
      className={`flex items-center gap-3 px-4 py-4 border-b last:border-b-0 transition-colors ${terminal.isActive ? "hover:bg-muted/30" : "opacity-60"}`}
    >
      {/* Terminal icon */}
      <Div
        className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${terminal.isActive ? "bg-blue-500/10 border border-blue-500/30" : "bg-muted"}`}
      >
        <Monitor
          className={`h-5 w-5 ${terminal.isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}
        />
      </Div>

      {/* Terminal info — no UUID shown */}
      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="text-sm font-semibold truncate">
            {terminal.name}
          </Span>
          <Badge
            variant={terminal.isActive ? "default" : "secondary"}
            className={`text-xs py-0 h-4 ${terminal.isActive ? "bg-green-600 hover:bg-green-600" : ""}`}
          >
            {terminal.isActive ? activeLabel : inactiveLabel}
          </Badge>
        </Div>
        <Div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {terminal.location ? (
            <Span className="text-xs text-muted-foreground">
              {terminal.location}
            </Span>
          ) : null}
          <Badge variant="outline" className="text-xs py-0 h-4 font-mono">
            {terminal.currency}
          </Badge>
        </Div>
      </Div>

      {/* Open session CTA */}
      <Button
        type="button"
        size="sm"
        variant={terminal.isActive ? "default" : "ghost"}
        className="shrink-0"
        onClick={(): void => onOpenSession(terminal)}
        disabled={!terminal.isActive}
      >
        {openSessionLabel}
      </Button>
    </Div>
  );
}

export function PosTerminalListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const navigation = useWidgetNavigation();

  // Store terminal name in module-level map so session open widget can display it
  const handleOpenSession = (terminal: TerminalType): void => {
    void (async (): Promise<void> => {
      posTerminalNameMap.set(terminal.id, terminal.name);
      const sessionDef = await import("../../session/open/definition");
      navigation.push(sessionDef.default.POST, {
        data: {
          details: {
            terminalId: terminal.id,
            openingFloat: 0,
          },
        },
      });
    })();
  };

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigation.push(def.default.POST, {});
    })();
  };

  // Loading state
  if (!data) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col items-center gap-4 py-12 rounded-lg border border-dashed">
        <Div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border-2 border-dashed border-muted-foreground/30">
          <Terminal className="h-6 w-6 text-muted-foreground" />
        </Div>
        <Div className="flex flex-col gap-1 text-center px-4">
          <Span className="text-base font-semibold">
            {t("terminalList.get.widget.loading")}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {t("terminalList.get.widget.loadingHint")}
          </Span>
        </Div>
      </Div>
    );
  }

  const terminals = data.terminals ?? [];
  const activeCount = terminals.filter((term) => term.isActive).length;

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {/* Back button */}
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("terminalList.get.widget.back")}
        </Button>
      )}

      {/* Header */}
      <Div className="flex items-center justify-between gap-3">
        <Div className="flex items-center gap-2">
          <Span className="text-sm font-semibold">
            {terminals.length} {t("terminalList.get.widget.total")}
          </Span>
          {terminals.length > 0 ? (
            <Badge variant="secondary" className="text-xs tabular-nums">
              {activeCount} {t("terminalList.get.widget.active")}
            </Badge>
          ) : null}
        </Div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCreate}
        >
          + {t("terminalList.get.widget.createTerminal")}
        </Button>
      </Div>

      {/* Terminal list or empty state */}
      {terminals.length === 0 ? (
        <Div className="flex flex-col items-center gap-5 py-14 text-center rounded-lg border border-dashed">
          <Div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border border-muted-foreground/20">
            <Terminal className="h-6 w-6 text-muted-foreground" />
          </Div>
          <Div className="flex flex-col gap-2 px-6">
            <Span className="text-base font-semibold">
              {t("terminalList.get.widget.empty")}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t("terminalList.get.widget.emptyHint")}
            </Span>
            <Span className="text-sm font-medium text-muted-foreground mt-1">
              {t("terminalList.get.widget.emptyContact")}
            </Span>
          </Div>
        </Div>
      ) : (
        <Div className="rounded-lg border overflow-hidden">
          {/* Active terminals first, inactive grayed out */}
          {[...terminals]
            .toSorted((a, b) =>
              a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1,
            )
            .map((terminal: TerminalType) => (
              <TerminalRow
                key={terminal.id}
                terminal={terminal}
                onOpenSession={handleOpenSession}
                activeLabel={t("terminalList.get.widget.active")}
                inactiveLabel={t("terminalList.get.widget.inactive")}
                openSessionLabel={t("terminalList.get.widget.openSession")}
              />
            ))}
        </Div>
      )}
    </Div>
  );
}
