/**
 * Task Budget Caps - Widgets
 * BudgetCapsWidget: every cap with today's task spend.
 * BudgetCapSetWidget: create / update a cap.
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
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function BudgetCapsWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const mutations = useWidgetEndpointMutations();
  const numberFormat = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  });

  const openSet = (): void => {
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
          title={t("budgetCaps.get.widget.title")}
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
                aria-label={t("budgetCaps.get.widget.refresh")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={openSet}
              >
                <Plus className="h-4 w-4" />
                {t("budgetCaps.get.widget.add")}
              </Button>
            </>
          }
        />
        <P className="text-sm text-muted-foreground">
          {t("budgetCaps.get.widget.subtitle")}
        </P>

        {!rows ? (
          <LoadingBlock message={t("budgetCaps.get.widget.loading")} />
        ) : (
          <>
            <P className="text-sm font-medium tabular-nums">
              {t("budgetCaps.get.widget.spentToday", {
                spent: numberFormat.format(data.daySpent),
              })}
            </P>
            {rows.length === 0 ? (
              <EmptyBlock
                icon={<Wallet className="h-8 w-8 text-muted-foreground" />}
                title={t("budgetCaps.get.widget.empty.title")}
                message={t("budgetCaps.get.widget.empty.hint")}
                action={{
                  label: t("budgetCaps.get.widget.empty.cta"),
                  onClick: openSet,
                }}
              />
            ) : (
              <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
                {rows.map((row) => (
                  <Div
                    key={row.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <Div className="flex flex-col gap-1 min-w-0">
                      <Div className="flex items-center gap-2">
                        <Badge variant="secondary">{t(row.scope)}</Badge>
                        <Span className="text-sm font-semibold truncate">
                          {row.key}
                        </Span>
                      </Div>
                      {row.note && (
                        <Span className="text-xs text-muted-foreground">
                          {row.note}
                        </Span>
                      )}
                    </Div>
                    <Div className="flex flex-col items-end gap-1">
                      <Span className="text-sm font-bold tabular-nums">
                        {t("budgetCaps.get.widget.credits", {
                          amount: numberFormat.format(row.maxCredits),
                        })}
                      </Span>
                      <Badge variant={row.enabled ? "secondary" : "outline"}>
                        {row.enabled
                          ? t("budgetCaps.get.widget.enabled")
                          : t("budgetCaps.get.widget.disabled")}
                      </Badge>
                    </Div>
                  </Div>
                ))}
              </Div>
            )}
          </>
        )}
      </Div>
    </WidgetShell>
  );
}

export function BudgetCapSetWidget({
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
          {t("budgetCaps.post.widget.back")}
        </Button>
      )}
      <P className="text-sm text-muted-foreground">
        {t("budgetCaps.post.widget.hint")}
      </P>
      <Div className="flex flex-col gap-3">
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <SelectFieldWidget
            fieldName="scope"
            field={withValue(field.children.scope, undefined, null)}
          />
          <TextFieldWidget
            fieldName="key"
            field={withValue(field.children.key, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <NumberFieldWidget
            fieldName="maxCredits"
            field={withValue(field.children.maxCredits, undefined, null)}
          />
          <BooleanFieldWidget
            fieldName="enabled"
            field={withValue(field.children.enabled, undefined, null)}
          />
        </Div>
        <TextFieldWidget
          fieldName="note"
          field={withValue(field.children.note, undefined, null)}
        />
      </Div>
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "budgetCaps.post.title" as const }}
      />
    </Div>
  );
}
