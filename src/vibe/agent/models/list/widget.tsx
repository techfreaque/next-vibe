"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Image as ImageIcon } from "next-vibe/ui/components/icons/Image";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Music } from "next-vibe/ui/components/icons/Music";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Video } from "next-vibe/ui/components/icons/Video";
import { Wrench } from "next-vibe/ui/components/icons/Wrench";
import { Input } from "next-vibe/ui/components/input";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "next-vibe/ui/components/tabs";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetEndpoint,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetResponseOnly,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useApiQuery } from "next-vibe/unified-ui/hooks/use-api-query";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CONTENT_DISPLAY } from "../../skills/enum";
import { ModelUtility } from "../enum";
import { scopedTranslation as modelsScopedTranslation } from "../i18n";
import type { AnyModelId } from "../models";
import { ModelCreditDisplay } from "../widget/model-credit-display";
import type definition from "./definition";
import type { ModelListItem } from "./definition";
import { scopedTranslation } from "./i18n";

// ── Labels and colors ─────────────────────────────────────────────────────────

type ListT = ReturnType<typeof scopedTranslation.scopedT>["t"];
type ModelsT = ReturnType<typeof modelsScopedTranslation.scopedT>["t"];

const TYPE_ORDER = ["text", "image", "video", "audio"] as const;
type ModelTypeKey = (typeof TYPE_ORDER)[number];
type ModelFilters = typeof definition.GET.types.RequestOutput;

const TYPE_ICONS: Record<ModelTypeKey, typeof MessageSquare> = {
  text: MessageSquare,
  image: ImageIcon,
  video: Video,
  audio: Music,
};

const TYPE_LABELS = {
  text: "enums.modelType.text",
  image: "enums.modelType.image",
  video: "enums.modelType.video",
  audio: "enums.modelType.audio",
} as const;

const INTELLIGENCE_LABELS: Partial<
  Record<
    string,
    | "enums.intelligence.quick"
    | "enums.intelligence.smart"
    | "enums.intelligence.brilliant"
  >
> = {
  quick: "enums.intelligence.quick",
  smart: "enums.intelligence.smart",
  brilliant: "enums.intelligence.brilliant",
};

const CONTENT_LABELS: Partial<
  Record<
    string,
    | "enums.content.mainstream"
    | "enums.content.open"
    | "enums.content.uncensored"
  >
> = {
  mainstream: "enums.content.mainstream",
  open: "enums.content.open",
  uncensored: "enums.content.uncensored",
};

/** Content level is a property, not a problem: no red. */
const CONTENT_VARIANT: Partial<Record<string, StatusPillVariant>> = {
  mainstream: "muted",
  open: "info",
  uncensored: "warning",
};

const UTILITY_KEYS = Object.values(ModelUtility);

function utilityLabel(utility: string, tModels: ModelsT): string {
  const key = UTILITY_KEYS.find((k) => k.endsWith(`.${utility}`));
  return key ? tModels(key) : utility;
}

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

const MAX_TAGS = 3;

// ── Model Card ────────────────────────────────────────────────────────────────

function ModelCard({
  model,
  locale,
  t,
  tModels,
  onClick,
}: {
  model: ModelListItem;
  locale: Parameters<typeof ModelCreditDisplay>[0]["locale"];
  t: ListT;
  tModels: ModelsT;
  onClick?: () => void;
}): JSX.Element {
  const intelligenceKey = INTELLIGENCE_LABELS[model.intelligence];
  const contentKey = CONTENT_LABELS[model.content];
  const context = formatContext(model.contextWindow);
  // The content level already shows as a pill; don't repeat it as a tag.
  const tags = model.utilities.filter(
    (u) => u !== model.content && u !== model.intelligence,
  );

  return (
    <Div
      className={`flex min-w-0 flex-col gap-2.5 rounded-lg border bg-card p-4 transition-colors${onClick ? " cursor-pointer hover:bg-muted/40" : ""}`}
      onClick={onClick}
    >
      <Div className="min-w-0">
        <Div className="truncate text-sm font-semibold" title={model.name}>
          {model.name}
        </Div>
        <Div className="truncate text-[13px] text-muted-foreground">
          {`${model.provider} · ${intelligenceKey ? t(intelligenceKey) : model.intelligence}`}
        </Div>
      </Div>

      <Div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <StatusPill
          status={model.content}
          label={contentKey ? t(contentKey) : model.content}
          variant={CONTENT_VARIANT[model.content] ?? "muted"}
        />
        {context && (
          <Span className="text-xs text-muted-foreground">
            {t("get.browser.context", { size: context })}
          </Span>
        )}
        {model.supportsTools && (
          <Span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Wrench className="h-3 w-3" />
            {t("get.browser.toolCalls")}
          </Span>
        )}
      </Div>

      {tags.length > 0 && (
        <Div className="flex flex-wrap gap-1">
          {tags.slice(0, MAX_TAGS).map((u) => (
            <Badge
              key={u}
              variant="outline"
              className="h-5 px-1.5 text-[11px] font-normal text-muted-foreground"
            >
              {utilityLabel(u, tModels)}
            </Badge>
          ))}
          {tags.length > MAX_TAGS && (
            <Span
              className="self-center text-[11px] text-muted-foreground"
              title={tags
                .slice(MAX_TAGS)
                .map((u) => utilityLabel(u, tModels))
                .join(", ")}
            >
              +{String(tags.length - MAX_TAGS)}
            </Span>
          )}
        </Div>
      )}

      <Div className="mt-auto flex min-w-0 items-center justify-between gap-3 pt-1">
        <Span
          className="min-w-0 truncate font-mono text-[11px] text-muted-foreground/70"
          title={model.id}
        >
          {model.id}
        </Span>
        <Div className="shrink-0">
          <ModelCreditDisplay
            modelId={model.id as AnyModelId}
            variant="badge"
            badgeVariant="outline"
            locale={locale}
          />
        </Div>
      </Div>
    </Div>
  );
}

// ── Model Grid ────────────────────────────────────────────────────────────────

function ModelGrid({
  models,
  t,
  tModels,
  locale,
  onPick,
  onClear,
}: {
  models: ModelListItem[];
  t: ListT;
  tModels: ModelsT;
  locale: Parameters<typeof ModelCreditDisplay>[0]["locale"];
  onPick?: (model: ModelListItem) => void;
  onClear?: () => void;
}): JSX.Element {
  if (models.length === 0) {
    return (
      <EmptyBlock
        icon={<Search className="h-6 w-6" />}
        title={t("get.browser.emptyTitle")}
        message={t("get.browser.emptyHint")}
        action={
          onClear
            ? {
                label: t("get.browser.clearFilters"),
                onClick: onClear,
                variant: "outline",
              }
            : undefined
        }
      />
    );
  }
  return (
    <Div className="grid grid-cols-1 gap-3 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {models.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          locale={locale}
          t={t}
          tModels={tModels}
          onClick={onPick ? (): void => onPick(model) : undefined}
        />
      ))}
    </Div>
  );
}

function ModelGridSkeleton(): JSX.Element {
  return (
    <Div className="grid grid-cols-1 gap-3 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Div
          key={i}
          className="flex flex-col gap-3 rounded-lg border bg-card p-4"
        >
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-24" />
        </Div>
      ))}
    </Div>
  );
}

// ── Main Widget ───────────────────────────────────────────────────────────────

interface ModelsListWidgetProps {
  field: (typeof definition.GET)["fields"];
}

/** Server-side filters (the request form). Applies on change, no submit button. */
function ModelsListFilters({
  fields: children,
}: {
  fields: ModelsListWidgetProps["field"]["children"];
}): JSX.Element {
  return (
    <Div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <Div className="grid grid-cols-2 gap-3 @4xl:grid-cols-4">
        <Div className="col-span-2 @lg:col-span-1">
          <TextFieldWidget fieldName="query" field={children.query} />
        </Div>
        <SelectFieldWidget fieldName="modelType" field={children.modelType} />
        <SelectFieldWidget
          fieldName="contentLevel"
          field={children.contentLevel}
        />
        <Div className="col-span-2 @lg:col-span-1">
          <SelectFieldWidget
            fieldName="intelligence"
            field={children.intelligence}
          />
        </Div>
      </Div>
      <FormAlertWidget field={{}} />
    </Div>
  );
}

export function ModelsListWidget({
  field,
}: ModelsListWidgetProps): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const { t: tModels } = modelsScopedTranslation.scopedT(locale);
  const initialData = useWidgetValue<typeof definition.GET>();
  const endpoint = useWidgetEndpoint<typeof definition.GET>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const form = useWidgetForm<typeof definition.GET>();
  const onPick = usePickerCallback<ModelListItem>();
  const isPickerMode = !!onPick;
  const responseOnly = useWidgetResponseOnly();
  const canFilter = !isPickerMode && !responseOnly;

  const [localQuery, setLocalQuery] = useState("");
  const [activeContent, setActiveContent] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<ModelFilters>();
  const scheduledFilters = useRef<string | undefined>(undefined);
  const query = form?.watch("query");
  const modelType = form?.watch("modelType");
  const contentLevel = form?.watch("contentLevel");
  const intelligence = form?.watch("intelligence");

  useEffect((): (() => void) | undefined => {
    const parsed = endpoint.requestSchema.safeParse({
      query,
      modelType,
      contentLevel,
      intelligence,
    });
    if (!canFilter || !parsed.success) {
      return;
    }
    const key = JSON.stringify(parsed.data);
    if (scheduledFilters.current === undefined) {
      scheduledFilters.current = key;
      return;
    }
    if (scheduledFilters.current === key) {
      return;
    }
    const timer = setTimeout((): void => {
      scheduledFilters.current = key;
      setAppliedFilters(parsed.data);
    }, 300);
    return (): void => clearTimeout(timer);
  }, [
    canFilter,
    contentLevel,
    endpoint.requestSchema,
    intelligence,
    modelType,
    query,
  ]);

  const filteredRead = useApiQuery({
    endpoint,
    requestData: appliedFilters ?? {},
    options: {
      enabled: canFilter && appliedFilters !== undefined,
      queryKey: JSON.stringify([
        "model-catalog-filter",
        user.isPublic ? user.leadId : user.id,
        locale,
        appliedFilters,
      ]),
    },
    logger,
    user,
  });
  const value = appliedFilters ? filteredRead.data : initialData;

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

  const hasServerFilters = Boolean(
    query || modelType || contentLevel || intelligence,
  );
  const clearServerFilters = (): void => {
    form?.reset({});
  };

  // Picker mode: instant local search + content filter over the loaded list.
  if (isPickerMode) {
    if (!value) {
      return <ModelGridSkeleton />;
    }
    const contentLevels = [...new Set(value.models.map((m) => m.content))];
    return (
      <Div className="@container flex flex-col gap-3">
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
            <Div className="flex flex-wrap gap-1">
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
              {contentLevels.map((level) => {
                const tier = CONTENT_DISPLAY.find((d) =>
                  d.value.endsWith(`.${level}`),
                );
                return (
                  <Button
                    key={level}
                    variant={activeContent === level ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    title={tier?.help ? tModels(tier.help) : undefined}
                    onClick={() => {
                      setActiveContent(activeContent === level ? null : level);
                    }}
                  >
                    {tier ? tModels(tier.label) : level}
                  </Button>
                );
              })}
            </Div>
          )}
        </Div>
        <ModelGrid
          models={filtered}
          t={t}
          tModels={tModels}
          locale={locale}
          onPick={onPick}
          onClear={() => {
            setLocalQuery("");
            setActiveContent(null);
          }}
        />
      </Div>
    );
  }

  const types = value
    ? TYPE_ORDER.filter((type) => value.models.some((m) => m.type === type))
    : [];
  const defaultTab = types[0] ?? "text";

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("get.title")}
        subtitle={t("get.browser.subtitle")}
      />
      <ModelsListFilters fields={field.children} />

      {appliedFilters && filteredRead.error ? (
        <EmptyBlock
          title={t("get.errors.server.title")}
          message={filteredRead.error.message}
        />
      ) : !value ? (
        <ModelGridSkeleton />
      ) : types.length === 0 ? (
        <ModelGrid
          models={[]}
          t={t}
          tModels={tModels}
          locale={locale}
          onClear={hasServerFilters ? clearServerFilters : undefined}
        />
      ) : (
        // Remount when the type set changes (a refetch narrowed to other types),
        // else the uncontrolled tab stays on a type that no longer exists.
        <Tabs
          key={types.join(",")}
          defaultValue={defaultTab}
          className="flex flex-col gap-3"
        >
          <Div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <Div className="-mx-1 min-w-0 max-w-full overflow-x-auto px-1">
              <TabsList>
                {types.map((type) => {
                  const TypeIcon = TYPE_ICONS[type];
                  const count = value.models.filter(
                    (m) => m.type === type,
                  ).length;
                  return (
                    <TabsTrigger key={type} value={type} className="gap-1.5">
                      <TypeIcon className="h-4 w-4" />
                      {t(TYPE_LABELS[type])}
                      <Span className="tabular-nums text-xs opacity-70">
                        {String(count)}
                      </Span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Div>
            <Div className="flex flex-wrap items-center gap-2">
              <Span className="text-[13px] tabular-nums text-muted-foreground">
                {t("get.browser.statsLabel", {
                  matched: value.models.length,
                  total: value.totalCount,
                })}
              </Span>
              {hasServerFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearServerFilters}
                >
                  {t("get.browser.clearFilters")}
                </Button>
              )}
            </Div>
          </Div>
          {types.map((type) => (
            <TabsContent key={type} value={type} className="mt-0">
              <ModelGrid
                models={value.models.filter((m) => m.type === type)}
                t={t}
                tModels={tModels}
                locale={locale}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </WidgetShell>
  );
}

// Alias so lazyWidget factory (and definition.ts) resolves the right export
export { ModelsListWidget as ModelsListContainer };
