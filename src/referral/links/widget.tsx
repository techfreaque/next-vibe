/**
 * Referral Links - Widgets
 * ReferralLinksWidget: the caller's tracked links with visits, signups,
 * paying users and earnings per link, plus copy buttons.
 * ReferralLinkCreateWidget: link builder with source quick-picks.
 * One widget for every platform: CLI/MCP get a compact text view.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Check } from "next-vibe/ui/components/icons/Check";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Link2 } from "next-vibe/ui/components/icons/Link2";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Pre } from "next-vibe/ui/components/pre";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetEndpointMutations,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useState } from "react";

import { REFERRAL_LINK_SOURCE_PRESETS } from "./constants";
import type definition from "./definition";
import type { ReferralLinksGetResponseOutput } from "./definition";

type ReferralLink = ReferralLinksGetResponseOutput["links"][number];
type LinksT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

function formatMoney(cents: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function CopyButton({
  url,
  label,
  copiedLabel,
  primary,
}: {
  url: string;
  label: string;
  copiedLabel: string;
  primary?: boolean;
}): JSX.Element {
  const [copied, setCopied] = useState(false);
  const logger = useWidgetLogger();
  return (
    <Button
      type="button"
      size="sm"
      variant={primary ? "default" : "outline"}
      className="shrink-0 gap-1.5"
      onClick={(e) => {
        e.stopPropagation();
        void (async (): Promise<void> => {
          const ok = await copyToClipboard(url, logger);
          setCopied(ok);
          if (ok) {
            setTimeout(() => setCopied(false), 1500);
          }
        })();
      }}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? copiedLabel : label}
    </Button>
  );
}

function Metric({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-0.5">
      <Span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </Span>
      <Span
        className={cn(
          "text-base font-semibold tabular-nums",
          highlight ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </Span>
      {sub ? (
        <Span className="truncate text-[11px] text-muted-foreground tabular-nums">
          {sub}
        </Span>
      ) : null}
    </Div>
  );
}

function LinkCard({
  link,
  t,
  locale,
}: {
  link: ReferralLink;
  t: LinksT;
  locale: string;
}): JSX.Element {
  const number = new Intl.NumberFormat(locale);
  return (
    <Div className="flex flex-col gap-3 px-4 py-4">
      <Div className="flex flex-col gap-1.5">
        <Span className="truncate text-sm font-semibold">{link.name}</Span>
        <Div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{link.source}</Badge>
          <Badge variant="outline">{link.campaign}</Badge>
          {link.refCode ? (
            <Badge variant="outline" className="font-mono">
              {t("get.widget.code", { code: link.refCode })}
            </Badge>
          ) : null}
          {link.destinationPath !== "/" ? (
            <Span className="text-xs text-muted-foreground">
              {t("get.widget.landsOn", { path: link.destinationPath })}
            </Span>
          ) : null}
        </Div>
      </Div>

      <Div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 @sm:grid-cols-4">
        <Metric
          label={t("get.widget.visits")}
          value={number.format(link.visits)}
        />
        <Metric
          label={t("get.widget.signups")}
          value={number.format(link.signups)}
        />
        <Metric label={t("get.widget.paid")} value={number.format(link.paid)} />
        <Metric
          label={t("get.widget.earned")}
          value={formatMoney(link.earnedCents, locale)}
          sub={
            link.pendingCents > 0
              ? t("get.widget.pending", {
                  amount: formatMoney(link.pendingCents, locale),
                })
              : undefined
          }
          highlight
        />
      </Div>

      <Div className="flex items-center gap-2">
        <Span className="min-w-0 flex-1 truncate rounded-md border bg-background px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
          {link.url}
        </Span>
        <CopyButton
          url={link.url}
          label={t("get.widget.copy")}
          copiedLabel={t("get.widget.copied")}
        />
      </Div>
    </Div>
  );
}

function renderLinksText(
  links: ReferralLink[],
  t: LinksT,
  locale: string,
): string {
  const number = new Intl.NumberFormat(locale);
  const lines: string[] = [t("get.widget.cli.header", { count: links.length })];
  for (const link of links) {
    lines.push("");
    lines.push(
      `${link.name} [${link.source}/${link.campaign}${link.refCode ? `, ${link.refCode}` : ""}]`,
    );
    lines.push(
      `  ${t("get.widget.cli.funnel", {
        visits: number.format(link.visits),
        signups: number.format(link.signups),
        paid: number.format(link.paid),
        earned: formatMoney(link.earnedCents, locale),
        pending: formatMoney(link.pendingCents, locale),
      })}`,
    );
    lines.push(`  ${link.url}`);
  }
  return lines.join("\n");
}

export function ReferralLinksWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const mutations = useWidgetEndpointMutations();

  const links = data?.links;

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return <Pre>{links ? renderLinksText(links, t, locale) : ""}</Pre>;
  }

  const openCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigate(def.default.POST, {
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  return (
    <WidgetShell>
      <Div className="flex flex-col gap-4">
        <WidgetHeader
          title={t("get.widget.title")}
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
                aria-label={t("get.widget.refresh")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={openCreate}
              >
                <Plus className="h-4 w-4" />
                {t("get.widget.create")}
              </Button>
            </>
          }
        />
        <P className="m-0 text-sm text-muted-foreground">
          {t("get.widget.subtitle")}
        </P>

        {!links ? (
          <LoadingBlock message={t("get.widget.loading")} />
        ) : links.length === 0 ? (
          <EmptyBlock
            icon={<Link2 className="h-8 w-8 text-muted-foreground" />}
            title={t("get.widget.empty.title")}
            message={t("get.widget.empty.hint")}
            action={{
              label: t("get.widget.empty.cta"),
              onClick: openCreate,
            }}
          />
        ) : (
          <Div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border bg-card">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} t={t} locale={locale} />
            ))}
          </Div>
        )}
      </Div>
    </WidgetShell>
  );
}

export function ReferralLinkCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const { pop, canGoBack } = useWidgetNavigation();
  const result = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const selectedSource = form?.watch("source");

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return <Pre>{result?.url ?? ""}</Pre>;
  }

  return (
    <Div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 pt-6 pb-6">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="-ml-1 self-start gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("post.widget.back")}
        </Button>
      )}
      <P className="m-0 text-sm text-muted-foreground">
        {t("post.widget.hint")}
      </P>

      {form ? (
        <Div className="flex flex-col gap-2">
          <Span className="text-sm font-medium">
            {t("post.widget.presets")}
          </Span>
          <Div className="flex flex-wrap gap-1.5">
            {REFERRAL_LINK_SOURCE_PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                size="sm"
                variant={selectedSource === preset ? "default" : "outline"}
                className="h-8 rounded-full px-3 text-xs"
                onClick={() =>
                  form.setValue("source", preset, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                {preset}
              </Button>
            ))}
          </Div>
        </Div>
      ) : null}

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="source"
          field={withValue(field.children.source, undefined, null)}
        />
        <TextFieldWidget
          fieldName="name"
          field={withValue(field.children.name, undefined, null)}
        />
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <TextFieldWidget
            fieldName="campaign"
            field={withValue(field.children.campaign, undefined, null)}
          />
          <TextFieldWidget
            fieldName="medium"
            field={withValue(field.children.medium, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <TextFieldWidget
            fieldName="destinationPath"
            field={withValue(field.children.destinationPath, undefined, null)}
          />
          <TextFieldWidget
            fieldName="code"
            field={withValue(field.children.code, undefined, null)}
          />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.submit" as const }}
      />

      {result?.url ? (
        <Div className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <Span className="text-sm font-semibold">
            {t("post.widget.created")}
          </Span>
          <Div className="flex items-center gap-2">
            <Span className="min-w-0 flex-1 break-all rounded-md border bg-background px-2.5 py-1.5 font-mono text-xs">
              {result.url}
            </Span>
            <CopyButton
              url={result.url}
              label={t("post.widget.copy")}
              copiedLabel={t("post.widget.copied")}
              primary
            />
          </Div>
        </Div>
      ) : null}
    </Div>
  );
}
