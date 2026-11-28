/**
 * Subscription Provider Switch Widget
 *
 * GET: the "move your plan" card on the subscription page. Renders nothing
 * unless a switch provider is live and this account has a card plan to move.
 * POST (CLI / MCP / AI): the checkout link to finish the move.
 */

"use client";

import { Methods } from "next-vibe/core/definition/enums";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Link } from "next-vibe/ui/components/link";
import { P } from "next-vibe/ui/components/typography";
import { assignUrl } from "next-vibe/ui/lib/location";
import {
  useWidgetEndpoint,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiMutation } from "next-vibe/unified-ui/hooks/use-api-mutation";
import { type JSX, useState } from "react";

import { PROVIDER_SWITCH_ANCHOR } from "./anchor";
import definitions from "./definition";
import { SwitchCarryOver, SwitchOfferState } from "./enum";

interface ProviderSwitchWidgetProps {
  field: (typeof definitions.GET)["fields"];
}

export function ProviderSwitchWidget(
  // oxlint-disable-next-line no-unused-vars -- widget contract: the framework passes the field
  _props: ProviderSwitchWidgetProps,
): JSX.Element {
  const endpoint = useWidgetEndpoint<typeof definitions.POST>();
  if (endpoint?.method === Methods.POST) {
    return <ProviderSwitchCheckoutResult />;
  }
  return <ProviderSwitchCard />;
}

function ProviderSwitchCheckoutResult(): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  const data = useWidgetValue<typeof definitions.POST>();
  if (!data) {
    return <Div />;
  }
  return (
    <Div className="flex flex-col gap-2">
      <P className="m-0 text-sm">{t("widget.checkoutReady")}</P>
      <Link href={data.checkoutUrl} className="text-sm text-primary underline">
        {t("widget.openCheckout")}
      </Link>
    </Div>
  );
}

function ProviderSwitchCard(): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.GET>();
  const data = useWidgetValue<typeof definitions.GET>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const mutation = useApiMutation(definitions.POST, logger, user);
  const [error, setError] = useState<string | null>(null);

  if (
    !data ||
    (data.offer !== SwitchOfferState.AVAILABLE &&
      data.offer !== SwitchOfferState.PLAN_NOT_SUPPORTED)
  ) {
    return <Div />;
  }

  const fmt = (value: Date | string | undefined): string =>
    value ? formatSimpleDate(new Date(value), locale) : "";
  const buyPath = `/${locale}/subscription/buy`;

  const handleMove = async (): Promise<void> => {
    setError(null);
    const result = await mutation.mutateAsync({});
    if (result.success) {
      assignUrl(result.data.checkoutUrl);
      return;
    }
    setError(result.message);
  };

  const carryLine =
    data.offer !== SwitchOfferState.AVAILABLE
      ? null
      : data.carryOver === SwitchCarryOver.DEFERRED_START &&
          data.billingStartAt &&
          !data.pastDue
        ? t("widget.carryDeferred", { date: fmt(data.billingStartAt) })
        : t("widget.carryExtend", { date: fmt(data.firstPeriodEnd) });

  return (
    <Div
      id={PROVIDER_SWITCH_ANCHOR}
      className="mb-4 scroll-mt-24 rounded-lg border-2 border-warning/50 bg-warning/10 p-4 sm:p-5"
    >
      <Div className="flex flex-col gap-3">
        <Div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-warning text-warning-foreground">
            {t("widget.badge")}
          </Badge>
        </Div>
        <Div className="flex flex-col gap-1">
          <P className="m-0 text-lg font-semibold text-foreground">
            {t("widget.title")}
          </P>
          <P className="m-0 text-sm text-foreground">
            {t("widget.description")}
          </P>
        </Div>

        {data.pastDue ? (
          <Div className="flex items-start gap-2 text-sm text-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <P className="m-0 leading-5">{t("widget.pastDue")}</P>
          </Div>
        ) : (
          data.deadline && (
            <P className="m-0 text-sm font-medium text-foreground">
              {t("widget.deadline", { date: fmt(data.deadline) })}
            </P>
          )
        )}

        {carryLine && (
          <P className="m-0 text-sm text-muted-foreground">{carryLine}</P>
        )}

        {data.offer === SwitchOfferState.PLAN_NOT_SUPPORTED && (
          <P className="m-0 text-sm text-muted-foreground">
            {t("widget.unsupportedPlan")}
          </P>
        )}

        {error && (
          <Div className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <P className="m-0 leading-5">{error}</P>
          </Div>
        )}

        <Div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {data.offer === SwitchOfferState.AVAILABLE && (
            <Button
              type="button"
              onClick={() => {
                void handleMove();
              }}
              disabled={mutation.isPending}
              className="h-auto min-h-10 whitespace-normal"
            >
              {mutation.isPending ? t("widget.ctaLoading") : t("widget.cta")}
              {!mutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            className="h-auto min-h-10 whitespace-normal"
          >
            <Link href={buyPath}>{t("widget.otherOptions")}</Link>
          </Button>
        </Div>

        <Div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Shield className="mt-0.5 h-4 w-4 shrink-0" />
          <P className="m-0 leading-5">{t("widget.noDoubleCharge")}</P>
        </Div>
      </Div>
    </Div>
  );
}
