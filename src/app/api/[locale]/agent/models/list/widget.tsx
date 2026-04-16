"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Input } from "next-vibe-ui/ui/input";
import { Span } from "next-vibe-ui/ui/span";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import type { AnyModelId } from "@/app/api/[locale]/agent/models/models";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";
import {
  useWidgetLocale,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { ModelListItem } from "./definition";
import { scopedTranslation } from "./i18n";

// ── Tier colors ───────────────────────────────────────────────────────────────

const INTELLIGENCE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline"
> = {
  quick: "outline",
  smart: "secondary",
  brilliant: "default",
};

const CONTENT_VARIANT: Record<string, "default" | "secondary" | "destructive"> =
  {
    mainstream: "secondary",
    open: "default",
    uncensored: "destructive",
  };

const TYPE_ICONS: Record<string, string> = {
  text: "💬",
  image: "🖼",
  video: "🎬",
  audio: "🎵",
};

const TYPE_ORDER = ["text", "image", "video", "audio"] as const;

function formatContext(ctx: number | null): string | null {
  if (!ctx) {
    return null;
  }
  if (ctx >= 1_000_000) {
    return `${String(Math.round(ctx / 1_000_000))}M`;
  }
  if (ctx >= 1_000) {
    return `${String(Math.round(ctx / 1_000))}k`;
  }
  return String(ctx);
}

// ── Model Card ────────────────────────────────────────────────────────────────

function ModelCard({
  model,
  locale,
  t,
  nameClassName,
}: {
  model: ModelListItem;
  locale: Parameters<typeof ModelCreditDisplay>[0]["locale"];
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
  nameClassName?: string;
}): JSX.Element {
  const typeIcon = TYPE_ICONS[model.type] ?? "•";

  return (
    <Div className="group flex flex-col gap-2 rounded-xl border bg-card p-3 transition-colors hover:bg-accent/40">
      {/* Header row */}
      <Div className="flex items-start gap-2">
        <Span className="text-base leading-none mt-0.5" aria-hidden="true">
          {typeIcon}
        </Span>
        <Div className="flex-1 min-w-0">
          <Div className="flex items-center gap-1.5 flex-wrap">
            <Span
              className={`font-semibold text-sm truncate${nameClassName ? ` ${nameClassName}` : ""}`}
            >
              {model.name}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {model.provider}
            </Span>
          </Div>
          {/* Tier badges */}
          <Div className="flex flex-wrap gap-1 mt-1">
            <Badge
              variant={INTELLIGENCE_VARIANT[model.intelligence] ?? "outline"}
              className="text-[10px] h-4 px-1"
            >
              {model.intelligence}
            </Badge>
            <Badge
              variant={CONTENT_VARIANT[model.content] ?? "secondary"}
              className="text-[10px] h-4 px-1"
            >
              {model.content}
            </Badge>
          </Div>
        </Div>
        {/* Price */}
        <Div className="shrink-0">
          <ModelCreditDisplay
            modelId={model.id as AnyModelId}
            variant="badge"
            badgeVariant="outline"
            locale={locale}
          />
        </Div>
      </Div>

      {/* Meta row */}
      <Div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {model.contextWindow ? (
          <Span>
            {formatContext(model.contextWindow)} {t("get.browser.ctx")}
          </Span>
        ) : null}
        {model.supportsTools && (
          <Span className="text-success">{t("get.browser.supportsTools")}</Span>
        )}
        <Span className="font-mono text-[10px] opacity-60 truncate">
          {model.id}
        </Span>
      </Div>

      {/* Capability tags (top 5) */}
      {model.utilities.length > 0 && (
        <Div className="flex flex-wrap gap-1">
          {model.utilities.slice(0, 5).map((u) => (
            <Badge
              key={u}
              variant="outline"
              className="text-[10px] h-4 px-1 font-normal"
            >
              {u}
            </Badge>
          ))}
          {model.utilities.length > 5 && (
            <Span className="text-[10px] text-muted-foreground self-center">
              +{String(model.utilities.length - 5)}
            </Span>
          )}
        </Div>
      )}
    </Div>
  );
}

// ── Model Grid ────────────────────────────────────────────────────────────────

function ModelGrid({
  models,
  t,
  locale,
}: {
  models: ModelListItem[];
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
  locale: Parameters<typeof ModelCreditDisplay>[0]["locale"];
}): JSX.Element {
  if (models.length === 0) {
    return (
      <P className="text-sm text-muted-foreground text-center py-8">
        {t("get.browser.noModels")}
      </P>
    );
  }
  return (
    <Div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} locale={locale} t={t} />
      ))}
    </Div>
  );
}

// ── Main Widget ───────────────────────────────────────────────────────────────

export function ModelsListWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const value = useWidgetValue<typeof definition.GET>();

  const [localQuery, setLocalQuery] = useState("");
  const [activeContent, setActiveContent] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!value) {
      return [];
    }
    let models = value.models;
    if (activeContent) {
      models = models.filter((m) => m.content === activeContent);
    }
    if (localQuery.trim()) {
      const q = localQuery.toLowerCase();
      models = models.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          m.utilities.some((u) => u.toLowerCase().includes(q)) ||
          m.content.includes(q) ||
          m.intelligence.includes(q),
      );
    }
    return models;
  }, [value, localQuery, activeContent]);

  if (!value) {
    return <Div />;
  }

  const types = TYPE_ORDER.filter((type) =>
    value.models.some((m) => m.type === type),
  );
  const contentLevels = [...new Set(value.models.map((m) => m.content))];
  const defaultTab = types[0] ?? "text";

  return (
    <Div className="space-y-3">
      {/* Search + content filter */}
      <Div className="flex flex-col gap-2">
        <Div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder={t("get.fields.query.placeholder")}
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
            }}
          />
        </Div>
        {contentLevels.length > 1 && (
          <Div className="flex gap-1 flex-wrap">
            <Button
              variant={activeContent === null ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                setActiveContent(null);
              }}
            >
              {t("get.browser.allLabel")}
            </Button>
            {contentLevels.map((level) => (
              <Button
                key={level}
                variant={activeContent === level ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  setActiveContent(activeContent === level ? null : level);
                }}
              >
                {level}
              </Button>
            ))}
          </Div>
        )}
      </Div>

      {/* Stats */}
      <Div className="text-xs text-muted-foreground">
        <Span>
          {t("get.browser.statsLabel", {
            matched: filtered.length,
            total: value.totalCount,
          })}
        </Span>
      </Div>

      {/* Tabs by model type */}
      <Tabs defaultValue={defaultTab}>
        <TabsList>
          {types.map((type) => {
            const count = filtered.filter((m) => m.type === type).length;
            return (
              <TabsTrigger key={type} value={type}>
                {TYPE_ICONS[type]} {type}
                {count > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 text-[10px] h-4 px-1"
                  >
                    {String(count)}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {types.map((type) => (
          <TabsContent key={type} value={type} className="mt-3">
            <ModelGrid
              models={filtered.filter((m) => m.type === type)}
              t={t}
              locale={locale}
            />
          </TabsContent>
        ))}
      </Tabs>
    </Div>
  );
}

// Alias so lazyWidget factory (and definition.ts) resolves the right export
export { ModelsListWidget as ModelsListContainer };
