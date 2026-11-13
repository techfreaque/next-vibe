"use client";

/**
 * Uncensored-model consent widgets (GET status, POST agree, DELETE withdraw).
 * Web: a status card with the terms and the one action that applies.
 * CLI / MCP / AI: plain status lines (agreeing is a human step, see POST).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { isAgentPlatform, isCliPlatform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useState } from "react";

import type definitions from "../definition";
import type { UncensoredConsentStatus } from "../definition";
import { useUncensoredConsent } from "../hooks";
import { scopedTranslation } from "../i18n";
import { UncensoredConsentTerms } from "./consent-terms";

function formatDate(value: Date | string, locale: CountryLanguage): string {
  return new Date(value).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Terminal / agent output: one line of status, one line of what to do. */
function ConsentStatusText({
  status,
  locale,
}: {
  status: UncensoredConsentStatus | undefined;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  if (!status) {
    return <Span>{t("widget.loading")}</Span>;
  }
  return (
    <Div className="flex flex-col gap-1">
      <Span className="font-semibold">
        {`${t("widget.title")}: ${status.consented ? t("widget.statusOn") : t("widget.statusOff")}`}
        {status.consented && status.consentedAt
          ? ` (${t("widget.since", { date: formatDate(status.consentedAt, locale) })})`
          : ""}
      </Span>
      <Span>
        {status.consented
          ? t("widget.onBody")
          : status.consentedAt
            ? t("widget.outdatedBody")
            : t("widget.offBody")}
      </Span>
    </Div>
  );
}

/**
 * Status + action card. Owns the live consent state (shared cache), so it
 * stays right when the chat dialog or another tab changes it.
 */
export function UncensoredConsentCard({
  user,
  logger,
  locale,
}: {
  user: JwtPayloadType;
  logger: EndpointLogger;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const consent = useUncensoredConsent(user, logger);
  const [error, setError] = useState<string | null>(null);

  if (consent.consented === null) {
    return (
      <Div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("widget.loading")}
      </Div>
    );
  }

  const run = (action: () => ReturnType<typeof consent.agree>): void => {
    setError(null);
    void (async (): Promise<void> => {
      const result = await action();
      if (!result.success) {
        setError(result.message);
      }
    })();
  };

  const on = consent.consented;
  return (
    <Div
      className="flex flex-col gap-4 rounded-xl border bg-card p-4"
      data-testid="uncensored-consent-card"
    >
      <Div className="flex items-start gap-3">
        <Span
          className={
            on
              ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning"
              : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          }
        >
          {on ? (
            <ShieldOff className="h-4 w-4" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
        </Span>
        <Div className="flex min-w-0 flex-1 flex-col gap-1">
          <Div className="flex flex-wrap items-center gap-2">
            <Span className="text-sm font-semibold">{t("widget.title")}</Span>
            <StatusPill
              status={on ? "on" : "off"}
              label={on ? t("widget.statusOn") : t("widget.statusOff")}
              variant={on ? "warning" : "muted"}
            />
          </Div>
          {on && consent.consentedAt ? (
            <Span className="text-xs text-muted-foreground">
              {t("widget.since", {
                date: formatDate(consent.consentedAt, locale),
              })}
            </Span>
          ) : null}
          <P className="m-0 text-sm leading-relaxed text-muted-foreground">
            {on
              ? t("widget.onBody")
              : consent.isOutdated
                ? t("widget.outdatedBody")
                : t("widget.offBody")}
          </P>
        </Div>
      </Div>

      {on ? null : <UncensoredConsentTerms locale={locale} />}

      {error ? (
        <P className="m-0 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </P>
      ) : null}

      {on ? (
        <Button
          type="button"
          variant="outline"
          className="h-10 self-start"
          disabled={consent.isSaving}
          onClick={(): void => run(consent.withdraw)}
          data-testid="uncensored-consent-withdraw"
        >
          {consent.isSaving ? t("widget.withdrawing") : t("widget.withdraw")}
        </Button>
      ) : (
        <Button
          type="button"
          className="h-11 w-full font-semibold @sm:w-auto @sm:self-start"
          disabled={consent.isSaving}
          onClick={(): void => run(consent.agree)}
          data-testid="uncensored-consent-unlock"
        >
          {consent.isSaving ? t("dialog.agreeing") : t("dialog.agree")}
        </Button>
      )}

      {user.isPublic ? (
        <Span className="text-xs text-muted-foreground">
          {t("widget.guestNote")}
        </Span>
      ) : null}
    </Div>
  );
}

/** Shared body of the three endpoint widgets. */
function ConsentEndpointView({
  status,
}: {
  status: UncensoredConsentStatus | undefined;
}): JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const platform = useWidgetPlatform();
  const { pop, canGoBack } = useWidgetNavigation();
  const { t } = scopedTranslation.scopedT(locale);

  if (isCliPlatform(platform) || isAgentPlatform(platform)) {
    return <ConsentStatusText status={status} locale={locale} />;
  }

  return (
    <WidgetShell className="gap-4">
      {/* The card carries the title; the header only adds a way back. */}
      {canGoBack ? (
        <WidgetHeader
          title={t("widget.title")}
          backButton={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(): void => {
                pop();
              }}
              className="-ml-1 gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("widget.back")}
            </Button>
          }
        />
      ) : null}
      <UncensoredConsentCard user={user} logger={logger} locale={locale} />
    </WidgetShell>
  );
}

export function UncensoredConsentStatusWidget(): JSX.Element {
  const status = useWidgetValue<typeof definitions.GET>();
  return <ConsentEndpointView status={status} />;
}

export function UncensoredConsentAgreeWidget(): JSX.Element {
  const status = useWidgetValue<typeof definitions.POST>();
  return <ConsentEndpointView status={status} />;
}

export function UncensoredConsentWithdrawWidget(): JSX.Element {
  const status = useWidgetValue<typeof definitions.DELETE>();
  return <ConsentEndpointView status={status} />;
}
