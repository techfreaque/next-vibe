"use client";

/**
 * Searchable model picker. Used on the model page ("Compare") and on both
 * columns of the compare page ("Change model"). Rows are plain links, so it
 * works for guests and without client routing.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Input } from "next-vibe/ui/components/input";
import { Link } from "next-vibe/ui/components/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe/ui/components/popover";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import type { JSX, ReactNode } from "react";
import { useState } from "react";

import { scopedTranslation } from "../i18n";
import type { PickerModel } from "./model-facts";
import { tierName } from "./model-format";

interface ModelPickerProps {
  locale: CountryLanguage;
  models: PickerModel[];
  /** Where picking a model goes. */
  hrefFor: (slug: string) => string;
  /** Trigger label. */
  label: string;
  icon?: IconComponent;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  testId?: string;
}

function Row({
  model,
  locale,
  href,
}: {
  model: PickerModel;
  locale: CountryLanguage;
  href: string;
}): JSX.Element {
  return (
    <Link
      href={href}
      className="flex min-h-11 items-center justify-between gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent"
    >
      <Span className="min-w-0 truncate font-medium">{model.name}</Span>
      <Span className="shrink-0 text-xs text-muted-foreground">
        {`${model.labName} · ${tierName(model.content, locale)}`}
      </Span>
    </Link>
  );
}

export function ModelPicker({
  locale,
  models,
  hrefFor,
  label,
  icon: Icon,
  variant = "secondary",
  className,
  testId,
}: ModelPickerProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const filtered =
    needle === ""
      ? models
      : models.filter((model) =>
          `${model.name} ${model.labName}`.toLowerCase().includes(needle),
        );
  const suggested = filtered.filter((model) => model.suggested);
  const others = filtered.filter((model) => !model.suggested);

  const group = (title: string, rows: PickerModel[]): ReactNode =>
    rows.length === 0 ? null : (
      <Div className="py-1">
        <Span className="block px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </Span>
        {rows.map((model) => (
          <Row
            key={model.id}
            model={model}
            locale={locale}
            href={hrefFor(model.slug)}
          />
        ))}
      </Div>
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          data-testid={testId}
          className={cn(
            "h-12 w-full gap-2 px-6 text-base font-medium sm:w-auto",
            variant === "secondary" && "bg-card",
            className,
          )}
        >
          {Icon !== undefined && <Icon className="h-4 w-4" />}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        collisionPadding={16}
        className="w-[min(22rem,calc(100vw-2rem))] p-2"
      >
        <Div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder={t("picker.search")}
            aria-label={t("picker.search")}
            className="h-11 pl-9"
          />
        </Div>
        <Div
          className="mt-2 max-h-60 overflow-y-auto"
          data-testid="model-picker-list"
        >
          {group(t("picker.suggested"), suggested)}
          {group(t("picker.all"), others)}
          {filtered.length === 0 && (
            <Span className="block px-3 py-6 text-center text-sm text-muted-foreground">
              {t("picker.empty")}
            </Span>
          )}
        </Div>
      </PopoverContent>
    </Popover>
  );
}
