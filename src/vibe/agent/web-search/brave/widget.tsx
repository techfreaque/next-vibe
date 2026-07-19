/**
 * Brave Search Widget
 *
 * - No results: Google-style start page — centered logo, large search bar, optional filters.
 * - Has results: compact bar at top + result cards.
 */

"use client";

import { useChatSettings } from "next-vibe/agent/chat/settings/hooks";
import { Button } from "next-vibe/ui/ui/button";
import { Card, CardContent } from "next-vibe/ui/ui/card";
import { Div } from "next-vibe/ui/ui/div";
import { Clock } from "next-vibe/ui/ui/icons/Clock";
import { ExternalLink as ExternalLinkIcon } from "next-vibe/ui/ui/icons/ExternalLink";
import { Search } from "next-vibe/ui/ui/icons/Search";
import { Star } from "next-vibe/ui/ui/icons/Star";
import { ExternalLink } from "next-vibe/ui/ui/link";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SearchBarWidget } from "next-vibe/unified-ui/widgets/interactive/search-bar/widget";
import type { JSX } from "react";

import { SearchProvider } from "../enum";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

function SetAsDefaultBanner(): JSX.Element | null {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { settings, updateSettings } = useChatSettings(user, logger);

  // null = no explicit preference = Brave is already default
  if (
    settings === null ||
    settings.searchProvider === SearchProvider.BRAVE ||
    settings.searchProvider === null
  ) {
    return null;
  }

  return (
    <Div className="flex items-center justify-between gap-2 px-4 py-2 bg-muted/50 border-b text-xs text-muted-foreground">
      <Span>
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        Your AI searches with Kagi
      </Span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-6 gap-1 text-xs"
        onClick={(): void => {
          void updateSettings({ searchProvider: SearchProvider.BRAVE });
        }}
      >
        <Star className="h-3 w-3" />
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        Use Brave
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

export function BraveSearchResultsContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();

  const results = value?.results ?? [];
  const hasResults = results.length > 0;

  // ── Start page ───────────────────────────────────────────────────────────────
  if (!hasResults) {
    return (
      <Div className="flex flex-col">
        <SetAsDefaultBanner />
        <Div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 px-4 py-8">
          <Div className="flex flex-col items-center gap-1">
            <Div className="flex items-center gap-2">
              <Search className="h-8 w-8 text-primary" />
              <Span className="text-3xl font-bold tracking-tight">
                {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                Brave Search
              </Span>
            </Div>
            <Span className="text-sm text-muted-foreground">
              {t("get.description")}
            </Span>
          </Div>

          <Div className="w-full max-w-xl flex flex-col gap-3">
            <SearchBarWidget<typeof definition.GET> field={children.query} />
            <FormAlertWidget field={{}} />
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
          </Div>
        </Div>
      </Div>
    );
  }

  // ── Results page ─────────────────────────────────────────────────────────────
  return (
    <Div className="flex flex-col gap-4">
      <SetAsDefaultBanner />
      <Div className="flex flex-col gap-2 p-4 border-b">
        <SearchBarWidget<typeof definition.GET>
          field={{ ...children.query, size: "default" as const }}
        />
        <Div className="grid grid-cols-3 gap-3">
          <NumberFieldWidget
            fieldName="maxResults"
            field={children.maxResults}
          />
          <BooleanFieldWidget
            fieldName="includeNews"
            field={children.includeNews}
          />
          <SelectFieldWidget fieldName="freshness" field={children.freshness} />
        </Div>
        <FormAlertWidget field={{}} />
      </Div>

      <Div className="flex flex-col gap-2 px-4 pb-4">
        {results.map((result, index) => (
          <ResultCard key={index} result={result} />
        ))}
      </Div>
    </Div>
  );
}
