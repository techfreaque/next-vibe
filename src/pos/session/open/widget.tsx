"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import terminalListDefinition from "../../terminal/list/definition";
import { posTerminalNameMap } from "../../terminal/list/widget";
import type definition from "./definition";

interface PosSessionOpenWidgetProps {
  field: (typeof definition.POST)["fields"];
}

/** Common opening floats, in the till currency. */
const QUICK_FLOATS = [0, 50, 100, 200] as const;

export function PosSessionOpenWidget({
  field,
}: PosSessionOpenWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const interactive = isInteractive && !responseOnly;
  const result = data?.result;

  const terminalId =
    useWatch({ control: form.control, name: "details.terminalId" }) ?? "";
  const openingFloat = useWatch({
    control: form.control,
    name: "details.openingFloat",
  });
  const validTerminal = z.uuid().safeParse(terminalId).success;

  // The till itself: name, place and currency come from the server.
  const terminalOptions = useMemo(
    () => ({
      read: {
        initialState: { terminalId },
        queryOptions: { enabled: interactive && validTerminal },
      },
    }),
    [terminalId, interactive, validTerminal],
  );
  const terminal = useEndpoint(
    terminalListDefinition,
    terminalOptions,
    logger,
    user,
  ).read?.data?.terminals?.find((row) => row.id === terminalId);
  const terminalName =
    terminal?.name ?? posTerminalNameMap.get(terminalId) ?? "";
  const currency = result?.currency ?? terminal?.currency;

  const back = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
      return;
    }
    void import("../../dashboard/definition").then((def) =>
      navigation.push(def.default.GET, {}),
    );
  };

  const openRegister = (sessionId: string): void => {
    void import("../[sessionId]/register/definition").then((def) =>
      navigation.push(def.default.GET, { urlPathParams: { sessionId } }),
    );
  };

  const backButton =
    interactive && navigation.canGoBack ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => navigation.pop()}
        className="-ml-1 gap-1.5"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("sessionOpen.post.widget.back")}
      </Button>
    ) : undefined;

  if (result?.id) {
    return (
      <WidgetShell layout="page" className="mx-auto max-w-2xl">
        <WidgetHeader
          size="page"
          title={terminalName || t("sessionOpen.post.widget.title")}
          titleAccessory={
            <StatusPill
              status={result.status}
              variant="success"
              label={t("sessionOpen.post.widget.selling")}
            />
          }
          backButton={backButton}
        />
        <ResultBanner
          variant="success"
          title={t("sessionOpen.post.success.title")}
          message={t("sessionOpen.post.success.description")}
        >
          <DetailGrid columns={2}>
            <DetailField
              label={t("sessionOpen.post.openingFloat.label")}
              value={formatMoney(result.openingFloat, currency, locale)}
            />
            <DetailField
              label={t("sessionOpen.post.response.openedAt")}
              value={new Date(result.openedAt).toLocaleString(locale, {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </DetailGrid>
        </ResultBanner>
        {interactive ? (
          <Div className="flex justify-end">
            <Button type="button" onClick={() => openRegister(result.id)}>
              {t("sessionOpen.post.widget.openRegister")}
            </Button>
          </Div>
        ) : null}
      </WidgetShell>
    );
  }

  const meta = [terminal?.location, terminal?.currency]
    .filter(Boolean)
    .join(" · ");

  return (
    <WidgetShell layout="page" className="mx-auto max-w-2xl">
      <WidgetHeader
        size="page"
        title={t("sessionOpen.post.widget.title")}
        subtitle={t("sessionOpen.post.widget.subtitle")}
        backButton={backButton}
      />

      <FormAlertWidget field={{}} />

      <Div className="flex items-center gap-3 rounded-xl border bg-card p-4">
        <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Monitor className="h-5 w-5 text-muted-foreground" />
        </Div>
        <Div className="min-w-0 flex-1">
          <Span className="block truncate text-base font-semibold">
            {terminalName || t("sessionOpen.post.widget.loadingTill")}
          </Span>
          {meta ? (
            <Span className="block truncate text-[13px] text-muted-foreground">
              {meta}
            </Span>
          ) : null}
        </Div>
        {terminal ? (
          <StatusPill
            status={terminal.id}
            variant={
              terminal.openSessionId
                ? "success"
                : terminal.isActive
                  ? "info"
                  : "muted"
            }
            label={
              terminal.openSessionId
                ? t("sessionOpen.post.widget.selling")
                : terminal.isActive
                  ? t("sessionOpen.post.widget.ready")
                  : t("sessionOpen.post.widget.inactive")
            }
          />
        ) : null}
      </Div>

      {terminal?.openSessionId ? (
        <ResultBanner
          variant="info"
          title={t("sessionOpen.post.widget.alreadyOpen")}
        >
          {interactive ? (
            <Div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (terminal.openSessionId) {
                    openRegister(terminal.openSessionId);
                  }
                }}
              >
                {t("sessionOpen.post.widget.openRegister")}
              </Button>
            </Div>
          ) : null}
        </ResultBanner>
      ) : (
        <Div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
          <NumberFieldWidget
            fieldName="details.openingFloat"
            presentation="money"
            field={withValue(
              field.children.details.children.openingFloat,
              undefined,
              null,
            )}
          />
          {interactive ? (
            <Div className="flex flex-wrap gap-2">
              {QUICK_FLOATS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={openingFloat === amount ? "secondary" : "outline"}
                  aria-pressed={openingFloat === amount}
                  className="h-10 min-w-20 tabular-nums"
                  onClick={() =>
                    form.setValue("details.openingFloat", amount, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  {formatMoney(amount, currency, locale)}
                </Button>
              ))}
            </Div>
          ) : null}
          <Span className="text-[13px] text-muted-foreground">
            {t("sessionOpen.post.widget.floatHint")}
          </Span>
        </Div>
      )}

      {terminal?.openSessionId ? null : (
        <Div className="flex flex-wrap items-center justify-end gap-2">
          {interactive ? (
            <Button type="button" variant="ghost" onClick={back}>
              {t("sessionOpen.post.widget.cancel")}
            </Button>
          ) : null}
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "dashboard.get.widget.openTill" }}
          />
        </Div>
      )}
    </WidgetShell>
  );
}
