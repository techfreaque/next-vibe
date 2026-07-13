/**
 * Web Search Widget
 *
 * - No results yet: Google-style start page — centered logo, large search bar,
 *   provider tabs (Brave / Kagi), inline default provider control.
 * - Has results: full-width results page with AI answer (Kagi) + result cards,
 *   compact search bar at top with provider tabs.
 */

"use client";

import { useChatSettings } from "next-vibe/agent/chat/settings/hooks";
import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Card, CardContent } from "next-vibe/ui/ui/card";
import { Div } from "next-vibe/ui/ui/div";
import { Clock } from "next-vibe/ui/ui/icons/Clock";
import { ExternalLink as ExternalLinkIcon } from "next-vibe/ui/ui/icons/ExternalLink";
import { Search } from "next-vibe/ui/ui/icons/Search";
import { Sparkles } from "next-vibe/ui/ui/icons/Sparkles";
import { Star } from "next-vibe/ui/ui/icons/Star";
import { ExternalLink } from "next-vibe/ui/ui/link";
import { Span } from "next-vibe/ui/ui/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { MarkdownWidget } from "next-vibe/unified-ui/display-only/markdown/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SearchBarWidget } from "next-vibe/unified-ui/interactive/search-bar/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { WebSearchGetRequestOutput } from "./definition";
import { SearchProvider } from "./enum";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type Provider = WebSearchGetRequestOutput["provider"];

const PROVIDER_TABS: { value: NonNullable<Provider>; label: string }[] = [
  { value: SearchProvider.BRAVE, label: "Brave" },
  { value: SearchProvider.KAGI, label: "Kagi" },
];

function ProviderTabs({
  value,
  onChange,
}: {
  value: Provider;
  onChange: (v: Provider) => void;
}): JSX.Element {
  return (
    <Div className="flex items-center gap-1">
      {PROVIDER_TABS.map((tab) => (
        <Button
          key={tab.value}
          type="button"
          size="sm"
          variant={value === tab.value ? "default" : "ghost"}
          className="h-7 px-3 text-xs rounded-full"
          onClick={(): void => onChange(tab.value)}
        >
          {tab.label}
        </Button>
      ))}
    </Div>
  );
}

function DefaultProviderControl(): JSX.Element | null {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { settings, updateSettings } = useChatSettings(user, logger);

  if (settings === null) {
    return null;
  }

  const currentDefault = settings.searchProvider ?? SearchProvider.BRAVE;
  const otherProvider =
    currentDefault === SearchProvider.BRAVE
      ? SearchProvider.KAGI
      : SearchProvider.BRAVE;
  const otherLabel = otherProvider === SearchProvider.BRAVE ? "Brave" : "Kagi";
  const currentLabel =
    currentDefault === SearchProvider.BRAVE ? "Brave" : "Kagi";

  return (
    <Div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Star className="h-3 w-3 shrink-0" />
      {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
      <Span>AI default: {currentLabel}</Span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={(): void => {
          void updateSettings({ searchProvider: otherProvider });
        }}
      >
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        Switch to {otherLabel}
      </Button>
    </Div>
  );
}

function ResultCard({
  result,
}: {
  result: {
    title: string;
    url: string;
    snippet?: string | null;
    age?: string | null;
    source?: string | null;
  };
}): JSX.Element {
  let hostname = result.url;
  try {
    hostname = new URL(result.url).hostname.replace(/^www\./, "");
  } catch {
    // keep raw
  }

  return (
    <Card className="overflow-hidden hover:border-primary/40 transition-colors">
      <CardContent className="p-0">
        <ExternalLink
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 hover:bg-muted/40 transition-colors"
        >
          <Div className="flex items-start gap-3">
            <Div className="rounded-lg bg-muted p-2 mt-0.5 shrink-0">
              <ExternalLinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </Div>
            <Div className="flex-1 min-w-0">
              <Div className="font-medium text-sm mb-1 line-clamp-2">
                {result.title}
              </Div>
              {result.snippet ? (
                <Div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {result.snippet}
                </Div>
              ) : null}
              <Div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Span className="truncate">{hostname}</Span>
                {result.age ? (
                  <>
                    {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                    <Span>·</Span>
                    <Div className="flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      <Span>{result.age}</Span>
                    </Div>
                  </>
                ) : null}
                {result.source ? (
                  <>
                    {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                    <Span>·</Span>
                    <Span className="shrink-0">{result.source}</Span>
                  </>
                ) : null}
              </Div>
            </Div>
          </Div>
        </ExternalLink>
      </CardContent>
    </Card>
  );
}

export function WebSearchResultsContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();

  const results = value?.results ?? [];
  const hasResults = results.length > 0 || !!value?.output;

  const currentProvider = form?.watch("provider") ?? SearchProvider.BRAVE;

  const handleProviderChange = (p: Provider): void => {
    form?.setValue("provider", p);
  };

  // Replace Kagi reference markers 【1】 with markdown links
  const output = value?.output
    ? value.output.replace(/【(\d+)】/g, (match, num) => {
        const index = parseInt(num, 10) - 1;
        const ref = results[index];
        return ref ? `[${num}](${ref.url})` : match;
      })
    : undefined;

  const isBraveOptions = currentProvider === SearchProvider.BRAVE;

  // ── Start page (no results yet) ─────────────────────────────────────────────
  if (!hasResults) {
    return (
      <Div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 px-4 py-8">
        {/* Wordmark */}
        <Div className="flex flex-col items-center gap-1">
          <Div className="flex items-center gap-2">
            <Search className="h-8 w-8 text-primary" />
            <Span className="text-3xl font-bold tracking-tight">
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
              Web Search
            </Span>
          </Div>
          <Span className="text-sm text-muted-foreground">
            {t("get.description")}
          </Span>
        </Div>

        {/* Search box */}
        <Div className="w-full max-w-xl flex flex-col gap-3">
          <SearchBarWidget<typeof definition.GET> field={children.query} />
          <FormAlertWidget field={{}} />

          {/* Provider tabs */}
          <Div className="flex items-center justify-between gap-2 flex-wrap">
            <ProviderTabs
              value={currentProvider}
              onChange={handleProviderChange}
            />
            <DefaultProviderControl />
          </Div>

          {/* Brave-only options */}
          {isBraveOptions ? (
            <Div className="grid grid-cols-3 gap-3 pt-1">
              <NumberFieldWidget
                fieldName="maxResults"
                field={children.maxResults}
              />
              <BooleanFieldWidget
                fieldName="includeNews"
                field={children.includeNews}
              />
              <SelectFieldWidget
                fieldName="freshness"
                field={children.freshness}
              />
            </Div>
          ) : null}
        </Div>
      </Div>
    );
  }

  // ── Results page ─────────────────────────────────────────────────────────────
  return (
    <Div className="flex flex-col gap-4">
      {/* Compact search bar */}
      <Div className="flex flex-col gap-2 p-4 border-b">
        <SearchBarWidget<typeof definition.GET>
          field={{ ...children.query, size: "default" as const }}
        />
        <Div className="flex items-center justify-between gap-2 flex-wrap">
          <ProviderTabs
            value={currentProvider}
            onChange={handleProviderChange}
          />
          <Div className="flex items-center gap-2">
            {value?.usedProvider ? (
              <Badge variant="secondary" className="text-xs font-normal">
                {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                via{" "}
                {value.usedProvider === SearchProvider.BRAVE ? "Brave" : "Kagi"}
              </Badge>
            ) : null}
            <DefaultProviderControl />
          </Div>
        </Div>
        {isBraveOptions ? (
          <Div className="grid grid-cols-3 gap-3">
            <NumberFieldWidget
              fieldName="maxResults"
              field={children.maxResults}
            />
            <BooleanFieldWidget
              fieldName="includeNews"
              field={children.includeNews}
            />
            <SelectFieldWidget
              fieldName="freshness"
              field={children.freshness}
            />
          </Div>
        ) : null}
        <FormAlertWidget field={{}} />
      </Div>

      {/* AI Answer (Kagi) */}
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

      {/* Results */}
      {results.length > 0 ? (
        <Div className="flex flex-col gap-2 px-4 pb-4">
          {results.map((result, index) => (
            <ResultCard key={index} result={result} />
          ))}
        </Div>
      ) : null}
    </Div>
  );
}
