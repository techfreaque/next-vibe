"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetIsInteractive,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";
import type { PosTerminalListGetResponseOutput } from "./definition";

/**
 * Module-level map: terminalId → terminal name.
 * Lets screens reached from a till card show its name on the first frame.
 */
export const posTerminalNameMap = new Map<string, string>();

type TerminalRow = NonNullable<
  PosTerminalListGetResponseOutput["terminals"]
>[number];

export function PosTerminalListWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const onPick = usePickerCallback<TerminalRow>();
  const isPickerMode = !!onPick;

  const openRegister = (sessionId: string): void => {
    void import("../../session/[sessionId]/register/definition").then((def) =>
      navigation.push(def.default.GET, { urlPathParams: { sessionId } }),
    );
  };

  const openTill = (terminal: TerminalRow): void => {
    posTerminalNameMap.set(terminal.id, terminal.name);
    void Promise.all([
      import("../../session/open/definition"),
      import("../../session/[sessionId]/register/definition"),
    ]).then(([openDef, registerDef]) =>
      navigation.push(openDef.default.POST, {
        data: { details: { terminalId: terminal.id, openingFloat: 0 } },
        replaceOnSuccess: {
          endpoint: registerDef.default.GET,
          getUrlPathParams: (response) => ({ sessionId: response.result.id }),
        },
      }),
    );
  };

  const createTill = (): void => {
    void import("../create/definition").then((def) =>
      navigation.push(def.default.POST, { popNavigationOnSuccess: 1 }),
    );
  };

  const terminals = data?.terminals ?? [];
  const selling = terminals.filter((row) => row.openSessionId).length;
  const companyCount = new Set(terminals.map((row) => row.companyName)).size;

  const header = (
    <WidgetHeader
      size="page"
      title={
        isPickerMode
          ? t("terminalList.get.widget.pickTitle")
          : t("terminalList.get.widget.title")
      }
      subtitle={
        data && terminals.length > 0
          ? t("terminalList.get.widget.summary", {
              total: String(terminals.length),
              selling: String(selling),
            })
          : t("terminalList.get.widget.subtitle")
      }
      backButton={
        interactive && navigation.canGoBack && !isPickerMode ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigation.pop()}
            className="-ml-1 gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("terminalList.get.widget.back")}
          </Button>
        ) : undefined
      }
      actions={
        interactive && !isPickerMode ? (
          <Button type="button" onClick={createTill} className="gap-1.5">
            <Plus className="h-4 w-4" />
            {t("terminalList.get.widget.newTill")}
          </Button>
        ) : undefined
      }
    />
  );

  if (!data) {
    return (
      <WidgetShell layout="page">
        {header}
        <LoadingBlock message={t("terminalList.get.widget.loading")} />
      </WidgetShell>
    );
  }

  return (
    <WidgetShell layout="page">
      {header}
      {terminals.length === 0 ? (
        <EmptyBlock
          size="page"
          icon={<Monitor className="h-6 w-6" />}
          title={t("terminalList.get.widget.emptyTitle")}
          message={t("terminalList.get.widget.emptyMessage")}
          action={
            interactive && !isPickerMode
              ? {
                  label: t("terminalList.get.widget.createTill"),
                  onClick: createTill,
                }
              : undefined
          }
        />
      ) : (
        <Div className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
          {terminals.map((terminal) => (
            <TerminalItem
              key={terminal.id}
              terminal={terminal}
              showCompany={companyCount > 1}
              interactive={interactive}
              onPick={onPick}
              onOpenRegister={openRegister}
              onOpenTill={openTill}
            />
          ))}
        </Div>
      )}
    </WidgetShell>
  );
}

function TerminalItem({
  terminal,
  showCompany,
  interactive,
  onPick,
  onOpenRegister,
  onOpenTill,
}: {
  terminal: TerminalRow;
  showCompany: boolean;
  interactive: boolean;
  onPick?: (terminal: TerminalRow) => void;
  onOpenRegister: (sessionId: string) => void;
  onOpenTill: (terminal: TerminalRow) => void;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const sessionId = terminal.openSessionId;
  const meta = [
    terminal.location,
    terminal.currency,
    showCompany ? terminal.companyName : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const info = (
    <Div className="flex min-w-0 flex-1 items-center gap-3">
      <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Monitor className="h-5 w-5 text-muted-foreground" />
      </Div>
      <Div className="min-w-0 flex-1">
        <Span className="block truncate text-sm font-semibold">
          {terminal.name}
        </Span>
        <Span className="block truncate text-[13px] text-muted-foreground">
          {meta}
        </Span>
      </Div>
      <StatusPill
        status={terminal.id}
        variant={sessionId ? "success" : terminal.isActive ? "info" : "muted"}
        label={
          sessionId
            ? t("terminalList.get.widget.selling")
            : terminal.isActive
              ? t("terminalList.get.widget.ready")
              : t("terminalList.get.widget.inactive")
        }
      />
    </Div>
  );

  if (onPick) {
    return (
      <Button
        type="button"
        variant="ghost"
        className="h-auto justify-start rounded-none px-4 py-3 text-left"
        onClick={() => onPick(terminal)}
      >
        {info}
      </Button>
    );
  }

  return (
    <Div
      className={`flex flex-col gap-3 px-4 py-3 @md:flex-row @md:items-center @md:gap-4 ${terminal.isActive ? "" : "opacity-70"}`}
    >
      {info}
      {interactive ? (
        sessionId ? (
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full @md:w-44"
            onClick={() => onOpenRegister(sessionId)}
          >
            {t("terminalList.get.widget.openRegister")}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full @md:w-44"
            disabled={!terminal.isActive}
            onClick={() => onOpenTill(terminal)}
          >
            {t("terminalList.get.widget.openTill")}
          </Button>
        )
      ) : null}
    </Div>
  );
}
