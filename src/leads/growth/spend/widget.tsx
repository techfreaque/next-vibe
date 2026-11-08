/**
 * Channel Spend - Widgets
 * ChannelSpendWidget: spend per channel/period with cost per paying user.
 * ChannelSpendLogWidget: log (upsert) a spend entry.
 */

"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { ChannelSpendGetResponseOutput } from "./definition";

type SpendRow = ChannelSpendGetResponseOutput["rows"][number];
type SpendT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

function SpendRowView({
  row,
  t,
  locale,
}: {
  row: SpendRow;
  t: SpendT;
  locale: string;
}): JSX.Element {
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: row.currency,
  });
  const number = new Intl.NumberFormat(locale);
  const date = (iso: string): string =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, {
      timeZone: "UTC",
    });
  const cents = (value: number | null): string =>
    value === null ? t("spend.get.widget.none") : money.format(value / 100);
  return (
    <Div className="flex flex-col gap-2 px-4 py-3">
      <Div className="flex flex-col gap-1 min-w-0">
        <Div className="flex items-center gap-2">
          <Badge variant="secondary">{row.channel}</Badge>{" "}
          <Span className="text-sm font-semibold tabular-nums">
            {money.format(row.amountCents / 100)}
          </Span>
        </Div>
        <Span className="text-xs text-muted-foreground">
          {t("spend.get.widget.period", {
            from: date(row.periodStart),
            to: date(row.periodEnd),
          })}
          {row.note ? ` · ${row.note}` : ""}
        </Span>
      </Div>
      <Div className="flex flex-col gap-0.5">
        <Span className="text-base font-bold tabular-nums">
          {`${t("spend.get.widget.costPerPaid")}: ${cents(row.costPerPaidCents)}`}
        </Span>
        <Span className="text-xs text-muted-foreground tabular-nums">
          {[
            `${t("spend.get.widget.signups")}: ${number.format(row.signups)}`,
            `${t("spend.get.widget.paid")}: ${number.format(row.paid)}`,
            `${t("spend.get.widget.costPerSignup")}: ${cents(row.costPerSignupCents)}`,
          ].join(" · ")}
        </Span>
      </Div>
    </Div>
  );
}

export function ChannelSpendWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const mutations = useWidgetEndpointMutations();

  const openLog = (): void => {
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigate(def.default.POST, {
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const rows = data?.rows;

  return (
    <WidgetShell>
      <Div className="flex flex-col gap-4">
        <WidgetHeader
          title={t("spend.get.widget.title")}
          backButton={
            canGoBack ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => pop()}
                className="-ml-1"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            ) : undefined
          }
          actions={
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void mutations?.read?.refetch?.()}
                aria-label={t("spend.get.widget.refresh")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={openLog}
              >
                <Plus className="h-4 w-4" />
                {t("spend.get.widget.add")}
              </Button>
            </>
          }
        />
        <P className="text-sm text-muted-foreground">
          {t("spend.get.widget.subtitle")}
        </P>

        {!rows ? (
          <LoadingBlock message={t("spend.get.widget.loading")} />
        ) : rows.length === 0 ? (
          <EmptyBlock
            icon={<Wallet className="h-8 w-8 text-muted-foreground" />}
            title={t("spend.get.widget.empty.title")}
            message={t("spend.get.widget.empty.hint")}
            action={{
              label: t("spend.get.widget.empty.cta"),
              onClick: openLog,
            }}
          />
        ) : (
          <>
            <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
              {rows.map((row) => (
                <SpendRowView key={row.id} row={row} t={t} locale={locale} />
              ))}
            </Div>
            <P className="text-xs text-muted-foreground">
              {t("spend.get.widget.attribution")}
            </P>
          </>
        )}
      </Div>
    </WidgetShell>
  );
}

export function ChannelSpendLogWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const { pop, canGoBack } = useWidgetNavigation();

  return (
    <Div className="max-w-lg mx-auto w-full px-4 pt-6 pb-6 flex flex-col gap-4">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("spend.post.widget.back")}
        </Button>
      )}
      <P className="text-sm text-muted-foreground">
        {t("spend.post.widget.hint")}
      </P>
      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="channel"
          field={withValue(field.children.channel, undefined, null)}
        />
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <DateFieldWidget
            fieldName="periodStart"
            field={withValue(field.children.periodStart, undefined, null)}
          />
          <DateFieldWidget
            fieldName="periodEnd"
            field={withValue(field.children.periodEnd, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <NumberFieldWidget
            fieldName="amount"
            field={withValue(field.children.amount, undefined, null)}
          />
          <SelectFieldWidget
            fieldName="currency"
            field={withValue(field.children.currency, undefined, null)}
          />
        </Div>
        <TextFieldWidget
          fieldName="note"
          field={withValue(field.children.note, undefined, null)}
        />
      </Div>
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "spend.post.title" as const }}
      />
    </Div>
  );
}
