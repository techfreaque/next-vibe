"use client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Check } from "next-vibe/ui/components/icons/Check";
import { Li } from "next-vibe/ui/components/li";
import { Span } from "next-vibe/ui/components/span";
import { Ul } from "next-vibe/ui/components/ul";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";
import { useState } from "react";

import { scopedTranslation } from "./i18n";
import { getLocaleModel, type RegionEntry } from "./model";
import { CurrencyTag, SearchField, SectionLabel } from "./parts";
import { useLocaleChoice } from "./use-locale-choice";

export interface PanelProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  /** Called right before a choice navigates (closes the host surface). */
  onDone: () => void;
}

/**
 * Language + region picker: two panes side by side, like a settings window.
 * Languages on the left, regions (with their own filter) on the right, both
 * always visible. Narrow containers stack the panes: language buttons on top,
 * regions below.
 */
export function LocalePickerPanel({
  locale,
  user,
  onDone,
}: PanelProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const model = getLocaleModel(locale);
  const { choose } = useLocaleChoice(locale, user);
  const [query, setQuery] = useState("");
  const { currentRegion } = model;

  const featuredList = model.featuredFor(model.language);
  const featured = featuredList.some(
    (region) => region.code === currentRegion.code,
  )
    ? featuredList
    : [currentRegion, ...featuredList];
  const shownCodes = new Set(featured.map((region) => region.code));
  const rest = model.regions.filter((region) => !shownCodes.has(region.code));
  const matches = model.filterRegions(query);

  const regionRow = (region: RegionEntry): JSX.Element => {
    const isCurrent = region.code === currentRegion.code;
    return (
      <Button
        key={region.code}
        variant="ghost"
        size="unset"
        aria-current={isCurrent ? "true" : undefined}
        aria-label={`${region.name}, ${t("pricesIn", { currency: region.currency })}`}
        onClick={() => {
          if (isCurrent) {
            return;
          }
          onDone();
          choose(model.language, region.code);
        }}
        className={cn(
          "flex h-10 w-full min-w-0 items-center gap-2.5 rounded-md px-3 text-left text-sm hover:bg-muted",
          isCurrent &&
            "bg-primary/15 font-semibold text-foreground hover:bg-primary/15",
        )}
      >
        <Span className="text-base leading-none">{region.flag}</Span>
        <Span className="min-w-0 flex-1 truncate">{region.name}</Span>
        {isCurrent && <Check className="h-4 w-4 shrink-0 text-primary" />}
        <CurrencyTag region={region} />
      </Button>
    );
  };

  return (
    <Div className="@container flex min-h-0 w-full flex-1 flex-col">
      <Div className="flex min-h-0 flex-1 flex-col @[34rem]:flex-row">
        {/* Language pane */}
        <Div
          className={cn(
            "shrink-0 border-b border-border p-3 @[34rem]:block @[34rem]:w-48 @[34rem]:border-b-0 @[34rem]:border-r @[34rem]:bg-muted/40",
            // Phone/narrow: hand the space to results while filtering
            query && "hidden",
          )}
        >
          <SectionLabel className="px-1 pt-0">{t("language")}</SectionLabel>
          <Ul
            aria-label={t("language")}
            className="grid list-none grid-cols-3 gap-1.5 @[34rem]:grid-cols-1 @[34rem]:gap-0.5"
          >
            {model.languages.map((entry) => {
              const active = entry.code === model.language;
              return (
                <Li key={entry.code} className="flex">
                  <Button
                    variant="outline"
                    size="unset"
                    aria-current={active ? "true" : undefined}
                    title={entry.localName}
                    onClick={() => {
                      if (active) {
                        return;
                      }
                      onDone();
                      choose(entry.code, model.country);
                    }}
                    className={cn(
                      "relative flex h-9 w-full items-center justify-center rounded-md px-2 text-sm hover:bg-muted @[34rem]:justify-start @[34rem]:border-transparent @[34rem]:bg-transparent @[34rem]:px-3",
                      active &&
                        "border-primary bg-primary/15 font-semibold text-foreground hover:bg-primary/15 @[34rem]:border-transparent @[34rem]:bg-primary/15",
                    )}
                  >
                    {active && (
                      <Span className="absolute bottom-2 left-0 top-2 hidden w-0.5 rounded-full bg-primary @[34rem]:block" />
                    )}
                    {entry.nativeName}
                  </Button>
                </Li>
              );
            })}
          </Ul>
        </Div>

        {/* Region pane */}
        <Div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Div className="flex items-baseline justify-between gap-2 px-4 pt-3">
            <Span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t("region")}
            </Span>
            <Span className="truncate text-[11px] text-muted-foreground">
              {t("regionHint")}
            </Span>
          </Div>
          <Div className="px-3 pb-1 pt-2">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder={t("searchRegions")}
            />
          </Div>
          <Div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
            {query ? (
              matches.length === 0 ? (
                <Div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {t("noResults")}
                </Div>
              ) : (
                <Div className="flex flex-col">{matches.map(regionRow)}</Div>
              )
            ) : (
              <>
                <Div className="flex flex-col">{featured.map(regionRow)}</Div>
                <Div className="mx-3 my-1.5 border-t border-border" />
                <Div className="flex flex-col">{rest.map(regionRow)}</Div>
              </>
            )}
          </Div>
        </Div>
      </Div>
    </Div>
  );
}
