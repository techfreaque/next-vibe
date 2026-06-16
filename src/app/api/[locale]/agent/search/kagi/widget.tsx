/**
 * Kagi Search Widget
 *
 * - No results: Google-style start page — centered logo, large search bar.
 * - Has results: compact bar at top + AI answer card + reference list.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { ExternalLink as ExternalLinkIcon } from "next-vibe-ui/ui/icons/ExternalLink";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Star } from "next-vibe-ui/ui/icons/Star";
import { ExternalLink } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import { MarkdownWidget } from "next-vibe-ui/unified/display-only/markdown/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SearchBarWidget } from "next-vibe-ui/unified/interactive/search-bar/widget";

import { SearchProvider } from "../enum";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

function SetAsDefaultBanner(): JSX.Element | null {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { settings, updateSettings } = useChatSettings(user, logger);

  if (settings === null || settings.searchProvider === SearchProvider.KAGI) {
    return null;
  }

  return (
    <Div className="flex items-center justify-between gap-2 px-4 py-2 bg-muted/50 border-b text-xs text-muted-foreground">
      <Span>
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        Your AI searches with Brave
      </Span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-6 gap-1 text-xs"
        onClick={(): void => {
          void updateSettings({ searchProvider: SearchProvider.KAGI });
        }}
      >
        <Star className="h-3 w-3" />
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        Use Kagi
      </Button>
    </Div>
  );
}

function ReferenceCard({
  ref: r,
  index,
}: {
  ref: { title: string; url: string; snippet?: string | null };
  index: number;
}): JSX.Element {
  let hostname = r.url;
  try {
    hostname = new URL(r.url).hostname.replace(/^www\./, "");
  } catch {
    // keep raw
  }

  return (
    <Card className="overflow-hidden hover:border-primary/40 transition-colors">
      <CardContent className="p-0">
        <ExternalLink
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 hover:bg-muted/40 transition-colors"
        >
          <Div className="flex items-start gap-3">
            <Span className="text-xs font-mono text-muted-foreground shrink-0 mt-0.5 w-5 text-right">
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              {index + 1}
            </Span>
            <Div className="rounded-lg bg-muted p-1.5 mt-0.5 shrink-0">
              <ExternalLinkIcon className="h-3 w-3 text-muted-foreground" />
            </Div>
            <Div className="flex-1 min-w-0">
              <Div className="font-medium text-sm mb-0.5 line-clamp-2">
                {r.title}
              </Div>
              {r.snippet ? (
                <Div className="text-xs text-muted-foreground line-clamp-2 mb-1">
                  {r.snippet}
                </Div>
              ) : null}
              <Span className="text-xs text-muted-foreground truncate block">
                {hostname}
              </Span>
            </Div>
          </Div>
        </ExternalLink>
      </CardContent>
    </Card>
  );
}

export function KagiSearchResultsContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();

  const references = value?.references ?? [];

  const output = value?.output
    ? value.output.replace(/【(\d+)】/g, (match, num) => {
        const index = parseInt(num, 10) - 1;
        const ref = references[index];
        return ref ? `[${num}](${ref.url})` : match;
      })
    : undefined;

  const hasResults =
    output !== null && output !== undefined ? true : references.length > 0;

  // ── Start page ───────────────────────────────────────────────────────────────
  if (!hasResults) {
    return (
      <Div className="flex flex-col">
        <SetAsDefaultBanner />
        <Div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 px-4 py-8">
          <Div className="flex flex-col items-center gap-1">
            <Div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <Span className="text-3xl font-bold tracking-tight">
                {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                Kagi Search
              </Span>
            </Div>
            <Span className="text-sm text-muted-foreground">
              {t("get.description")}
            </Span>
          </Div>

          <Div className="w-full max-w-xl flex flex-col gap-3">
            <SearchBarWidget<typeof definition.GET> field={children.query} />
            <FormAlertWidget field={{}} />
          </Div>
        </Div>
      </Div>
    );
  }

  // ── Results page ─────────────────────────────────────────────────────────────
  return (
    <Div className="flex flex-col gap-4">
      <SetAsDefaultBanner />
      <Div className="p-4 border-b">
        <SearchBarWidget<typeof definition.GET>
          field={{ ...children.query, size: "default" as const }}
        />
        <FormAlertWidget field={{}} />
      </Div>

      {output ? (
        <Div className="px-4">
          <Card className="border-info/20 bg-info/5">
            <CardContent className="p-0">
              <Div className="flex items-center gap-2 px-4 py-3 border-b border-info/20 bg-info/10">
                <Sparkles className="h-4 w-4 text-info" />
                <Span className="text-sm font-semibold">
                  {t("get.response.output.title")}
                </Span>
              </Div>
              <Div className="p-4">
                <MarkdownWidget
                  fieldName="output"
                  field={withValue(children.output, output, value)}
                />
              </Div>
            </CardContent>
          </Card>
        </Div>
      ) : null}

      {references.length > 0 ? (
        <Div className="flex flex-col gap-2 px-4 pb-4">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
            {t("get.response.references.title")}
          </Span>
          {references.map((ref, index) => (
            <ReferenceCard key={index} ref={ref} index={index} />
          ))}
        </Div>
      ) : null}
    </Div>
  );
}
