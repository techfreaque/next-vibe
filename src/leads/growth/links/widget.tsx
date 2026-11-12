/**
 * Campaign Links - Widgets
 * CampaignLinksWidget: link list with visits → signups → paid.
 * CampaignLinkCreateWidget: UTM builder form.
 */

"use client";

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
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetEndpointMutations,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useState } from "react";

import type definition from "./definition";
import type { CampaignLinksGetResponseOutput } from "./definition";

type CampaignLink = CampaignLinksGetResponseOutput["links"][number];
type LinksT = ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;

function CopyButton({
  url,
  label,
  copiedLabel,
}: {
  url: string;
  label: string;
  copiedLabel: string;
}): JSX.Element {
  const [copied, setCopied] = useState(false);
  const logger = useWidgetLogger();
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="gap-1.5"
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

function LinkRow({
  link,
  t,
  locale,
}: {
  link: CampaignLink;
  t: LinksT;
  locale: string;
}): JSX.Element {
  const number = new Intl.NumberFormat(locale);
  const percent = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  });
  const paidRate = link.visits > 0 ? link.paid / link.visits : null;
  return (
    <Div className="flex flex-col gap-2 px-4 py-3">
      <Span className="text-sm font-medium truncate">{link.name}</Span>
      <Div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary">{link.source}</Badge>
        <Badge variant="outline">{link.medium}</Badge>
        <Badge variant="outline">{link.campaign}</Badge>
        {link.refCode ? (
          <Badge variant="outline">
            {t("links.get.widget.refCode", { code: link.refCode })}
          </Badge>
        ) : null}
      </Div>
      <Span className="text-sm font-semibold tabular-nums">
        {t("links.get.widget.funnel", {
          visits: number.format(link.visits),
          signups: number.format(link.signups),
          paid: number.format(link.paid),
        })}
      </Span>
      <Span className="text-xs text-muted-foreground">
        {t("links.get.widget.landsOn", { path: link.destinationPath })}
        {paidRate !== null
          ? ` · ${t("links.get.widget.paidRate", { rate: percent.format(paidRate) })}`
          : ""}
      </Span>
      <Div className="flex items-center gap-2">
        <Span className="flex-1 min-w-0 truncate rounded bg-muted px-2 py-1 font-mono text-xs">
          {link.url}
        </Span>
        <CopyButton
          url={link.url}
          label={t("links.get.widget.copy")}
          copiedLabel={t("links.get.widget.copied")}
        />
      </Div>
    </Div>
  );
}

export function CampaignLinksWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const mutations = useWidgetEndpointMutations();

  const openCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigate(def.default.POST, {
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const openSpend = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../spend/definition");
      navigate(def.default.GET, {});
    })();
  };

  const links = data?.links;

  return (
    <WidgetShell>
      <Div className="flex flex-col gap-4">
        <WidgetHeader
          title={t("links.get.widget.title")}
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
                aria-label={t("links.get.widget.refresh")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={openSpend}
              >
                <Wallet className="h-4 w-4" />
                {t("links.get.widget.spend")}
              </Button>
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                onClick={openCreate}
              >
                <Plus className="h-4 w-4" />
                {t("links.get.widget.create")}
              </Button>
            </>
          }
        />
        <P className="text-sm text-muted-foreground">
          {t("links.get.widget.subtitle")}
        </P>

        {!links ? (
          <LoadingBlock message={t("links.get.widget.loading")} />
        ) : links.length === 0 ? (
          <EmptyBlock
            icon={<Link2 className="h-8 w-8 text-muted-foreground" />}
            title={t("links.get.widget.empty.title")}
            message={t("links.get.widget.empty.hint")}
            action={{
              label: t("links.get.widget.empty.cta"),
              onClick: openCreate,
            }}
          />
        ) : (
          <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
            {links.map((link) => (
              <LinkRow key={link.id} link={link} t={t} locale={locale} />
            ))}
          </Div>
        )}
      </Div>
    </WidgetShell>
  );
}

export function CampaignLinkCreateWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const { pop, canGoBack } = useWidgetNavigation();
  const result = useWidgetValue<typeof definition.POST>();

  return (
    <Div className="max-w-xl mx-auto w-full px-4 pt-6 pb-6 flex flex-col gap-4">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("links.post.widget.back")}
        </Button>
      )}
      <P className="text-sm text-muted-foreground">
        {t("links.post.widget.hint")}
      </P>

      <Div className="flex flex-col gap-3">
        <TextFieldWidget
          fieldName="name"
          field={withValue(field.children.name, undefined, null)}
        />
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <TextFieldWidget
            fieldName="source"
            field={withValue(field.children.source, undefined, null)}
          />
          <TextFieldWidget
            fieldName="medium"
            field={withValue(field.children.medium, undefined, null)}
          />
        </Div>
        <TextFieldWidget
          fieldName="campaign"
          field={withValue(field.children.campaign, undefined, null)}
        />
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <TextFieldWidget
            fieldName="content"
            field={withValue(field.children.content, undefined, null)}
          />
          <TextFieldWidget
            fieldName="term"
            field={withValue(field.children.term, undefined, null)}
          />
        </Div>
        <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          <TextFieldWidget
            fieldName="destinationPath"
            field={withValue(field.children.destinationPath, undefined, null)}
          />
          <TextFieldWidget
            fieldName="refCode"
            field={withValue(field.children.refCode, undefined, null)}
          />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "links.post.title" as const }}
      />

      {result?.url ? (
        <Div className="flex flex-col gap-2 rounded-lg border p-3">
          <Span className="text-sm font-medium">
            {t("links.post.widget.created")}
          </Span>
          <Div className="flex items-center gap-2">
            <Span className="flex-1 min-w-0 break-all rounded bg-muted px-2 py-1 font-mono text-xs">
              {result.url}
            </Span>
            <CopyButton
              url={result.url}
              label={t("links.post.widget.copy")}
              copiedLabel={t("links.post.widget.copied")}
            />
          </Div>
        </Div>
      ) : null}
    </Div>
  );
}
