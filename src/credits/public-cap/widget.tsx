/**
 * Public Free-Tier Daily Cap Widget
 * GET: today's shared free pool, per-visitor/IP limits, top spenders and cap events.
 * POST: change the daily cap and the per-visitor/IP limits.
 */

"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "next-vibe/ui/components/alert";
import { KpiGrid, KpiTile } from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Minus } from "next-vibe/ui/components/icons/Minus";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Input } from "next-vibe/ui/components/input";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Progress, ProgressIndicator } from "next-vibe/ui/components/progress";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import type definition from "./definition";

type CapT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

const KIND_KEYS = {
  lead: "get.lead",
  ip: "get.ip",
  "global-cap": "get.globalCap",
  "lead-cap": "get.leadCap",
  "ip-cap": "get.ipCap",
  "single-request": "get.singleRequest",
  "fail-closed": "get.failClosed",
  "pool-reserved": "get.poolReserved",
  "threshold-80": "get.threshold80",
  "threshold-100": "get.threshold100",
} as const;

function kindLabel(t: CapT, kind: string): string {
  const key = Object.entries(KIND_KEYS).find(([k]) => k === kind)?.[1];
  return key ? t(key) : t("get.other");
}

/** Keys are lead ids or IP hashes: show a short, stable fragment, never the full id. */
function shortKey(key: string): string {
  return key.length > 10 ? `${key.slice(0, 8)}…` : key;
}

export function PublicCapContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const cap = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const { push } = useWidgetNavigation();
  const credits = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const time = new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  });

  const openUpdate = (): void => {
    void import("./definition").then(({ default: def }) => {
      push(def.POST, {
        data: {
          capAmount: cap?.capAmount,
          perLeadCap: cap?.perLeadCap,
          perIpCap: cap?.perIpCap,
        },
      });
      return undefined;
    });
  };

  const header = (
    <WidgetHeader
      size="page"
      title={t("get.container.title")}
      subtitle={t("get.capHint")}
      actions={
        cap ? (
          <Button type="button" onClick={openUpdate}>
            {t("get.changeCap")}
          </Button>
        ) : undefined
      }
    />
  );

  if (!cap) {
    return (
      <WidgetShell layout="page">
        {header}
        {response?.success === false ? (
          <Alert variant="destructive">
            <AlertTitle>{t("get.errors.server.title")}</AlertTitle>
            <AlertDescription>{response.message}</AlertDescription>
          </Alert>
        ) : (
          <LoadingBlock />
        )}
      </WidgetShell>
    );
  }

  const percent = Math.min(100, Math.max(0, cap.percentUsed));
  const tone =
    cap.capExceeded || percent >= 90
      ? "negative"
      : percent >= 70
        ? "warning"
        : "positive";
  const barColor =
    tone === "negative"
      ? "bg-destructive"
      : tone === "warning"
        ? "bg-warning"
        : "bg-success";

  return (
    <WidgetShell layout="page">
      {header}
      {cap.capExceeded ? (
        <Alert variant="destructive">
          <AlertTitle>{t("get.capExceeded.content")}</AlertTitle>
          <AlertDescription>{t("get.exceededHint")}</AlertDescription>
        </Alert>
      ) : null}

      <Div className="flex flex-col gap-2 rounded-xl border bg-card p-4">
        <Div className="flex flex-wrap items-baseline justify-between gap-2">
          <Span className="text-sm font-medium tabular-nums">
            {t("get.usedOfCap", {
              used: credits.format(cap.spendToday),
              cap: credits.format(cap.capAmount),
            })}
          </Span>
          <Span className="text-xs text-muted-foreground">
            {t("get.resetAt", { time: time.format(new Date(cap.lastResetAt)) })}
          </Span>
        </Div>
        <Progress value={percent} className="bg-muted">
          <ProgressIndicator value={percent} className={barColor} />
        </Progress>
      </Div>

      <KpiGrid columns={4}>
        <KpiTile
          label={t("get.spendToday.content")}
          value={cap.spendToday}
          locale={locale}
          tone={tone}
        />
        <KpiTile
          label={t("get.remainingToday.content")}
          value={cap.remainingToday}
          locale={locale}
        />
        <KpiTile
          label={t("get.perLeadCap.content")}
          value={cap.perLeadCap}
          locale={locale}
          hint={t("get.perDayUnit")}
        />
        <KpiTile
          label={t("get.perIpCap.content")}
          value={cap.perIpCap}
          locale={locale}
          hint={t("get.perDayUnit")}
        />
      </KpiGrid>

      <Div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
        <SectionGroup title={t("get.topSpenders.content")}>
          {cap.topSpenders.length === 0 ? (
            <Span className="text-sm text-muted-foreground">
              {t("get.noData")}
            </Span>
          ) : (
            <Div className="flex flex-col gap-2">
              {cap.topSpenders.map((s) => (
                <ListItem
                  key={`${s.kind}:${s.key}`}
                  title={kindLabel(t, s.kind)}
                  subtitle={shortKey(s.key)}
                  meta={
                    <Span className="tabular-nums font-medium">
                      {credits.format(s.spend)}
                    </Span>
                  }
                />
              ))}
            </Div>
          )}
        </SectionGroup>
        <SectionGroup title={t("get.recentEvents.content")}>
          {cap.recentEvents.length === 0 ? (
            <Span className="text-sm text-muted-foreground">
              {t("get.noData")}
            </Span>
          ) : (
            <Div className="flex flex-col gap-2">
              {cap.recentEvents.map((e, index) => (
                <ListItem
                  // Events can repeat kind, time and visitor (pool reservations): index keeps keys unique.
                  key={`${index}:${e.kind}:${String(e.createdAt)}`}
                  title={kindLabel(t, e.kind)}
                  subtitle={[time.format(new Date(e.createdAt)), e.model]
                    .filter(Boolean)
                    .join(" · ")}
                  meta={
                    <Span className="tabular-nums">
                      {credits.format(e.cost)}
                    </Span>
                  }
                />
              ))}
            </Div>
          )}
        </SectionGroup>
      </Div>
    </WidgetShell>
  );
}

export function PublicCapUpdateContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const postValue = useWidgetValue<typeof definition.POST>();
  const { pop, canGoBack } = useWidgetNavigation();
  const credits = new Intl.NumberFormat(locale);

  const capAmount = Number(form.watch("capAmount") ?? 500);

  function setCap(next: number): void {
    form.setValue("capAmount", Math.max(1, next), { shouldValidate: true });
  }

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("post.title")}
        subtitle={t("post.description")}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
            >
              {t("post.back")}
            </Button>
          ) : undefined
        }
      />
      <Div className="flex max-w-2xl flex-col gap-4 rounded-xl border bg-card p-4 @md:p-6">
        <FormAlertWidget field={{}} />
        {postValue?.message ? (
          <Alert variant="success">
            <AlertDescription>{postValue.message}</AlertDescription>
          </Alert>
        ) : null}

        <Div className="flex flex-col gap-2">
          <Span className="text-sm font-medium">
            {t("post.capAmount.label")}
          </Span>
          <Div className="flex items-center overflow-hidden rounded-lg border">
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-12 shrink-0 rounded-none border-r"
              aria-label={t("post.decrease")}
              onClick={() => setCap(capAmount - 100)}
              disabled={capAmount <= 1}
            >
              <Minus className="size-5" aria-hidden="true" />
            </Button>
            <Div className="flex h-12 flex-1 flex-col items-center justify-center select-none">
              <Span className="text-xl font-semibold tabular-nums">
                {credits.format(capAmount)}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {t("post.perDayUnit")}
              </Span>
            </Div>
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-12 shrink-0 rounded-none border-l"
              aria-label={t("post.increase")}
              onClick={() => setCap(capAmount + 100)}
            >
              <Plus className="size-5" aria-hidden="true" />
            </Button>
          </Div>
        </Div>

        <Div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
          {(["perLeadCap", "perIpCap"] as const).map((name) => (
            <Div key={name} className="flex flex-col gap-1">
              <Span className="text-sm font-medium">
                {t(`post.${name}.label`)}
              </Span>
              <Input
                type="number"
                min={1}
                aria-label={t(`post.${name}.label`)}
                defaultValue={form.getValues(name) ?? undefined}
                placeholder={t(`post.${name}.placeholder`)}
                onChangeText={(v) =>
                  form.setValue(name, v === "" ? undefined : Number(v), {
                    shouldValidate: true,
                  })
                }
              />
            </Div>
          ))}
        </Div>

        <Div className="flex justify-end">
          <Button type="button" className="min-h-10" onClick={onSubmit}>
            {t("post.titleShort")}
          </Button>
        </Div>
      </Div>
    </WidgetShell>
  );
}
