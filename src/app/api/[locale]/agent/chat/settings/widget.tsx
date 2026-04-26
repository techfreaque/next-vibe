/**
 * Chat Settings Widget
 * Custom widget for the settings POST endpoint, plus standalone reusable components.
 *
 * - ChatSettingsWidget: Full settings panel rendered via customWidgetObject
 * - CompactTriggerEdit: Reusable context memory budget slider
 * - SettingsModelSelectorsSection: Model selector grid for all 9 model slots
 */

"use client";

import cronBulkEndpoints from "@/app/api/[locale]/system/unified-interface/tasks/cron/bulk/definition";
import favoritesEndpoint from "@/app/api/[locale]/agent/chat/favorites/definition";
import { FavoriteSelectProvider } from "@/app/api/[locale]/agent/chat/favorites/favorite-select-context";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";
import { ScheduleAutocomplete } from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/widget/schedule-autocomplete";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Link } from "next-vibe-ui/ui/link";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { DollarSign } from "next-vibe-ui/ui/icons/DollarSign";
import { Globe } from "next-vibe-ui/ui/icons/Globe";
import { Info } from "next-vibe-ui/ui/icons/Info";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Monitor } from "next-vibe-ui/ui/icons/Monitor";
import { Moon } from "next-vibe-ui/ui/icons/Moon";
import { Play } from "next-vibe-ui/ui/icons/Play";
import { RotateCcw } from "next-vibe-ui/ui/icons/RotateCcw";
import { Settings } from "next-vibe-ui/ui/icons/Settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "next-vibe-ui/ui/slider";
import { Span } from "next-vibe-ui/ui/span";
import { Switch } from "next-vibe-ui/ui/switch";
import { Textarea } from "next-vibe-ui/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { cn } from "next-vibe/shared/utils";
import type { JSX, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";

import { buildFolderUrl } from "@/app/[locale]/chat/lib/utils/navigation";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";

import {
  getChatModelById,
  type ChatModelId,
  type ChatModelSelection,
} from "@/app/api/[locale]/agent/ai-stream/models";
import { COMPACT_TRIGGER } from "@/app/api/[locale]/agent/ai-stream/repository/core/constants";
import { getBestChatModelForFavorite } from "@/app/api/[locale]/agent/chat/favorites/[id]/definition";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { useFavoriteCreate } from "@/app/api/[locale]/agent/chat/favorites/create/hooks";
import type { FavoriteCard } from "@/app/api/[locale]/agent/chat/favorites/definition";
import { useChatFavorites } from "@/app/api/[locale]/agent/chat/favorites/hooks/hooks";
import { DEFAULT_SKILLS } from "@/app/api/[locale]/agent/chat/skills/config";
import { scopedTranslation as skillsScopedTranslation } from "@/app/api/[locale]/agent/chat/skills/i18n";
import { parseSkillId } from "@/app/api/[locale]/agent/chat/slugify";
import { SearchProviderOptions } from "@/app/api/[locale]/agent/search/enum";
import { scopedTranslation as searchScopedTranslation } from "@/app/api/[locale]/agent/search/i18n";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type definition from "./definition";
import type { ChatSettingsUpdateRequestOutput } from "./definition";
import { useChatSettings } from "./hooks";
import { scopedTranslation } from "./i18n";
import {
  AUTOPILOT_DEFAULT_SCHEDULE,
  DREAM_DEFAULT_SCHEDULE,
  MAMA_DEFAULT_SCHEDULE,
} from "./pulse/constants";

const MIN_VALUE = 1_000;
const MAX_ABSOLUTE = 200_000;
const STEP = 1_000;

/** Format token count as "32K", "128K", "2M" etc. */
function formatTokens(n: number): string {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return `${Math.round(n / 1_000)}K`;
}

/**
 * Derive the context window from a model selection.
 * Falls back to characterModelSelection when favoriteModelSelection is null/undefined,
 * then falls back to MAX_ABSOLUTE when no model is resolvable.
 */
function getModelContextWindow(
  user: JwtPayloadType,
  modelSelection: ChatModelSelection | ChatModelId | null | undefined,
  characterModelSelection?: ChatModelSelection | null,
): number {
  if (typeof modelSelection === "string") {
    const model = getChatModelById(modelSelection);
    return model.contextWindow;
  }

  // Use the same resolution logic as getBestModelForFavorite:
  // favorite override → character default → MAX_ABSOLUTE
  const best = getBestChatModelForFavorite(
    modelSelection ?? null,
    characterModelSelection ?? undefined,
    user,
  );
  return best?.contextWindow ?? MAX_ABSOLUTE;
}

// ---------------------------------------------------------------------------
// Shared internal card wrapper
// ---------------------------------------------------------------------------

function CardWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <Div
      className={cn(
        "rounded-xl border bg-card p-4 flex flex-col gap-3",
        className,
      )}
    >
      {children}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Header row (shared between edit + view)
// ---------------------------------------------------------------------------

function CardHeader({
  modelCap,
  isDefault,
  label,
  locale,
}: {
  modelCap: number;
  isDefault: boolean;
  label?: ReactNode;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="flex items-start justify-between gap-2">
      <Div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary flex-shrink-0" />
        <Div className="flex flex-col">
          <Span className="text-sm font-semibold">
            {t("post.contextMemory.title")}
          </Span>
          {label !== undefined && label !== null && label !== "" && (
            <Span className="text-xs text-muted-foreground">{label}</Span>
          )}
        </Div>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
              >
                <Info className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[280px] text-sm" side="top">
              <Div className="flex flex-col gap-1.5">
                <Span className="font-medium">
                  {t("post.contextMemory.tooltipTitle")}
                </Span>
                <Span className="text-muted-foreground">
                  {t("post.contextMemory.tooltipBody")}
                </Span>
                <Span className="text-muted-foreground">
                  {t("post.contextMemory.tooltipModelCap").replace(
                    "{cap}",
                    formatTokens(modelCap),
                  )}
                </Span>
              </Div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Div>

      {isDefault && (
        <Badge
          variant="secondary"
          className="text-xs shrink-0 bg-muted text-muted-foreground"
        >
          {t("post.contextMemory.default")}
        </Badge>
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Props for the edit component
// ---------------------------------------------------------------------------

export interface CompactTriggerEditProps {
  /** Current stored value (null = use default) */
  value: number | null | undefined;
  /** Called when user changes the value. null = reset to default */
  onChange: (value: number | null) => void;
  /**
   * Favorite's own model selection override - used to cap the slider.
   * When null/undefined, falls back to characterModelSelection.
   */
  modelSelection?: ChatModelSelection | ChatModelId | null;
  /**
   * Skill's model selection - fallback when favoriteModelSelection is null.
   * Ensures the slider cap reflects the actual resolved model.
   */
  characterModelSelection?: ChatModelSelection | null;
  /** Optional sub-label shown in the header (e.g. "Override for this slot") */
  label?: ReactNode;
  className?: string;
  /** User payload for admin-only model filtering */
  user: JwtPayloadType;
  /** Locale for translations */
  locale: CountryLanguage;
}

// ---------------------------------------------------------------------------
// Edit component
// ---------------------------------------------------------------------------

export function CompactTriggerEdit({
  value,
  onChange,
  modelSelection,
  characterModelSelection,
  label,
  className,
  user,
  locale,
}: CompactTriggerEditProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const modelCap = useMemo(
    () =>
      Math.min(
        getModelContextWindow(user, modelSelection, characterModelSelection),
        MAX_ABSOLUTE,
      ),
    [modelSelection, characterModelSelection, user],
  );

  const effectiveValue = value ?? COMPACT_TRIGGER;
  // Always keep the stored value within the model's actual cap
  const cappedValue = Math.min(effectiveValue, modelCap);
  const isDefault =
    value === null || value === undefined || value === COMPACT_TRIGGER;

  const handleChange = (values: number[]): void => {
    const v = values[0];
    if (v === undefined) {
      return;
    }
    // If user drags back to the default, store null (saves nothing, falls through)
    onChange(v === COMPACT_TRIGGER ? null : v);
  };

  const handleReset = (): void => {
    onChange(null);
  };

  return (
    <CardWrapper className={className}>
      <CardHeader
        modelCap={modelCap}
        isDefault={isDefault}
        label={label}
        locale={locale}
      />

      {/* Description */}
      <Div className="text-xs text-muted-foreground leading-relaxed">
        {`${t("post.contextMemory.description")} `}
        <Span className="inline-flex items-center gap-0.5 font-medium text-foreground/80">
          <DollarSign className="h-3 w-3" />
          {t("post.contextMemory.costNote")}
        </Span>
        {` ${t("post.contextMemory.costExplain")}`}
      </Div>

      {/* Slider */}
      <Div className="space-y-3 pt-1">
        <Slider
          value={[cappedValue]}
          onValueChange={handleChange}
          min={MIN_VALUE}
          max={modelCap}
          step={STEP}
        >
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        {/* Value readout + scale */}
        <Div className="flex items-center justify-between text-xs text-muted-foreground">
          <Span>{formatTokens(MIN_VALUE)}</Span>
          <Div className="flex flex-col items-center gap-0.5">
            <Span
              className={cn(
                "text-base font-bold tabular-nums",
                isDefault ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {formatTokens(cappedValue)}
            </Span>
            <Span className="text-[10px]">
              {t("post.contextMemory.tokens")}
            </Span>
          </Div>
          <Div className="flex flex-col items-end gap-0.5">
            <Span>{formatTokens(modelCap)}</Span>
            <Span className="text-[10px]">
              {t("post.contextMemory.modelMax")}
            </Span>
          </Div>
        </Div>
      </Div>

      {/* Cost / memory trade-off visual indicator */}
      <CostMemoryBar value={cappedValue} modelCap={modelCap} locale={locale} />

      {/* Reset button */}
      {!isDefault && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="self-start gap-1.5 h-7 text-xs text-muted-foreground hover:text-foreground px-2"
        >
          <RotateCcw className="h-3 w-3" />
          {t("post.contextMemory.resetToDefault").replace(
            "{value}",
            formatTokens(COMPACT_TRIGGER),
          )}
        </Button>
      )}
    </CardWrapper>
  );
}

// ---------------------------------------------------------------------------
// Cost/Memory trade-off bar
// ---------------------------------------------------------------------------

// Color values for the progress bar (inline style - cannot mix className + style on Div)
const BAR_COLORS = {
  cheap: "#10b981", // emerald-500
  balanced: "#eab308", // yellow-500
  rich: "#f97316", // orange-500
  max: "#ef4444", // red-500
} as const;

function CostMemoryBar({
  value,
  modelCap,
  locale,
}: {
  value: number;
  modelCap: number;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const pct = Math.round(((value - MIN_VALUE) / (modelCap - MIN_VALUE)) * 100);

  // Color logic: green (low cost) → yellow → orange → red (high cost)
  const barBg =
    pct < 30
      ? BAR_COLORS.cheap
      : pct < 60
        ? BAR_COLORS.balanced
        : pct < 85
          ? BAR_COLORS.rich
          : BAR_COLORS.max;

  const barLabel =
    pct < 30
      ? t("post.contextMemory.barCheap")
      : pct < 60
        ? t("post.contextMemory.barBalanced")
        : pct < 85
          ? t("post.contextMemory.barRich")
          : t("post.contextMemory.barMax");

  return (
    <Div className="flex flex-col gap-1">
      <Div className="flex justify-between text-[10px] text-muted-foreground">
        <Span>{`💸 ${t("post.contextMemory.cheaper")}`}</Span>
        <Span className="text-center font-medium text-foreground/70">
          {barLabel}
        </Span>
        <Span>{`🧠 ${t("post.contextMemory.moreMemory")}`}</Span>
      </Div>
      <Div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        {/* Inner bar: use style-only (StyleType constraint - no mixing style+className on Div) */}
        <Div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "9999px",
            backgroundColor: barBg,
            transition: "width 0.15s ease",
          }}
        />
      </Div>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Settings Section Card
// ---------------------------------------------------------------------------

function SettingsSection({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <Div className={cn("rounded-xl border bg-card overflow-hidden", className)}>
      <Div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Div className="flex items-center justify-center rounded-lg bg-primary/10 w-8 h-8 shrink-0">
          {icon}
        </Div>
        <Div className="flex flex-col min-w-0">
          <Span className="text-sm font-semibold">{title}</Span>
          {description && (
            <Span className="text-xs text-muted-foreground">{description}</Span>
          )}
        </Div>
      </Div>
      <Div className="px-4 pb-4 pt-2">{children}</Div>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Settings Row - inline label + control
// ---------------------------------------------------------------------------

function SettingsRow({
  label,
  description,
  children,
  className,
}: {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <Div
      className={cn(
        "flex items-center justify-between gap-4 py-2.5",
        className,
      )}
    >
      <Div className="flex flex-col min-w-0 flex-1">
        <Span className="text-sm font-medium">{label}</Span>
        {description && (
          <Span className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </Span>
        )}
      </Div>
      <Div className="shrink-0">{children}</Div>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// ChatSettingsWidget - Main custom widget for the settings POST endpoint
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// FavSlotCollapsed - compact card showing the selected favorite
// ---------------------------------------------------------------------------

function getVariantLabelForFav(
  item: FavoriteCard,
  locale: CountryLanguage,
): string | null {
  if (item.customVariantName) {
    return item.customVariantName;
  }
  const { skillId: baseSkillId, variantId } = parseSkillId(item.skillId);
  if (!variantId) {
    return null;
  }
  const skill = DEFAULT_SKILLS.find((s) => s.id === baseSkillId);
  const variant = skill?.variants?.find((v) => v.id === variantId);
  if (!variant) {
    return null;
  }
  return variant.variantName
    ? skillsScopedTranslation.scopedT(locale).t(variant.variantName)
    : null;
}

function FavSlotCollapsed({
  fav,
  open,
  onToggleOpen,
  disabled,
  locale,
  placeholder,
}: {
  fav: FavoriteCard | null;
  open: boolean;
  onToggleOpen: () => void;
  disabled: boolean;
  locale: CountryLanguage;
  placeholder: string;
}): JSX.Element {
  const variantLabel = fav ? getVariantLabelForFav(fav, locale) : null;

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "w-full h-auto py-2.5 px-3 justify-start gap-3 text-left",
        disabled && "opacity-50 pointer-events-none",
        open && "border-primary/40 bg-primary/5",
      )}
      onClick={onToggleOpen}
      disabled={disabled}
    >
      {fav ? (
        <>
          <Div className="flex items-center justify-center rounded-lg bg-primary/10 w-9 h-9 shrink-0">
            <Icon icon={fav.icon} className="h-5 w-5" />
          </Div>
          <Div className="flex-1 min-w-0">
            <Div className="flex items-center gap-1.5 flex-wrap">
              <Span className="text-sm font-semibold truncate">{fav.name}</Span>
              {variantLabel && (
                <Span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full shrink-0">
                  {variantLabel}
                </Span>
              )}
              {fav.tagline && (
                <Span className="text-xs text-muted-foreground truncate">
                  {fav.tagline}
                </Span>
              )}
            </Div>
            <Div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              {fav.modelIcon && (
                <Icon icon={fav.modelIcon} className="h-3 w-3 shrink-0" />
              )}
              {fav.modelInfo && (
                <Span className="truncate">{fav.modelInfo}</Span>
              )}
              {fav.modelProvider && (
                <>
                  <Div className="h-1 w-1 rounded-full bg-muted-foreground/40 shrink-0" />
                  <Span className="truncate">{fav.modelProvider}</Span>
                </>
              )}
              {fav.modelId && (
                <>
                  <Div className="h-1 w-1 rounded-full bg-muted-foreground/40 shrink-0" />
                  <ModelCreditDisplay
                    modelId={fav.modelId}
                    variant="text"
                    className="text-xs text-muted-foreground"
                    locale={locale}
                  />
                </>
              )}
            </Div>
          </Div>
        </>
      ) : (
        <Span className="text-sm text-muted-foreground flex-1">
          {placeholder}
        </Span>
      )}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
          open && "rotate-180",
        )}
      />
    </Button>
  );
}

// ---------------------------------------------------------------------------
// PulseFavSlot - collapsible fav picker: compact card + full fav list
// ---------------------------------------------------------------------------

function PulseFavSlot({
  favoriteId,
  onFavoriteChange,
  disabled,
  locale,
  label,
  placeholder,
  defaultSkillId,
}: {
  favoriteId: string | null;
  onFavoriteChange: (id: string | null) => void;
  disabled: boolean;
  locale: CountryLanguage;
  label: string;
  placeholder: string;
  /** Fallback skill to display when no favorite is selected */
  defaultSkillId: string;
}): JSX.Element {
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const [open, setOpen] = useState(false);

  const { favorites } = useChatFavorites(logger, { activeFavoriteId: null });
  const selectedFav = useMemo(
    () => favorites.find((f) => f.id === favoriteId) ?? null,
    [favorites, favoriteId],
  );

  // When no favorite is selected, synthesize a display card from the default skill
  const { t: tSkills } = skillsScopedTranslation.scopedT(locale);
  const displayFav = useMemo((): FavoriteCard | null => {
    if (selectedFav) {
      return selectedFav;
    }
    const skill = DEFAULT_SKILLS.find((s) => s.id === defaultSkillId);
    if (!skill) {
      return null;
    }
    return {
      id: "",
      skillId: skill.id,
      name: tSkills(skill.name),
      tagline: tSkills(skill.tagline),
      description: null,
      icon: skill.icon,
      position: 0,
      activeBadge: null,
      modelId: null,
      modelIcon: "sparkles" as const,
      modelInfo: "",
      modelProvider: "",
      voiceId: null,
      customVariantName: null,
    } satisfies FavoriteCard;
  }, [selectedFav, defaultSkillId, tSkills]);

  const handleSelect = useCallback(
    (item: FavoriteCard) => {
      onFavoriteChange(item.id);
      setOpen(false);
    },
    [onFavoriteChange],
  );

  return (
    <Div className="flex flex-col gap-1.5">
      <Span className="text-sm font-medium">{label}</Span>
      <FavSlotCollapsed
        fav={displayFav}
        open={open}
        onToggleOpen={() => setOpen((v) => !v)}
        disabled={disabled}
        locale={locale}
        placeholder={placeholder}
      />
      {open && (
        <Div className="rounded-xl border overflow-hidden">
          <FavoriteSelectProvider
            onSelectFavorite={handleSelect}
            activeSkillId={selectedFav?.skillId ?? null}
            activeModelId={selectedFav?.modelId ?? null}
            hideChrome
          >
            <EndpointsPage
              endpoint={favoritesEndpoint}
              locale={locale}
              user={user}
            />
          </FavoriteSelectProvider>
        </Div>
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// PulseSection component — shared between Dreaming and Autopilot
// ---------------------------------------------------------------------------

interface PulseSectionProps {
  mode: "dreaming" | "autopilot";
  enabled: boolean;
  favoriteId: string | null;
  schedule: string;
  prompt: string | null;
  subFolderId: string | null;
  threadCount: number;
  taskId: string;
  onToggle: (enabled: boolean) => void;
  onScheduleChange: (schedule: string) => void;
  onFavoriteChange: (favoriteId: string | null) => void;
  onPromptChange: (prompt: string | null) => void;
  locale: CountryLanguage;
}

function PulseSectionDreaming({
  enabled,
  favoriteId,
  schedule,
  prompt,
  subFolderId,
  threadCount,
  taskId,
  onToggle,
  onScheduleChange,
  onFavoriteChange,
  onPromptChange,
  locale,
}: Omit<PulseSectionProps, "mode">): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const [isRunning, setIsRunning] = useState(false);

  const folderUrl = subFolderId
    ? buildFolderUrl(locale, DefaultFolderId.BACKGROUND, subFolderId)
    : null;

  const handleRunNow = useCallback(async (): Promise<void> => {
    setIsRunning(true);
    try {
      await apiClient.mutate(
        cronBulkEndpoints.POST,
        logger,
        user,
        { ids: [taskId], action: "run" },
        undefined,
        locale,
      );
    } finally {
      setIsRunning(false);
    }
  }, [taskId, logger, user, locale]);

  return (
    <SettingsSection
      icon={<Moon className="h-4 w-4 text-primary" />}
      title={t("post.dreaming.title")}
      description={t("post.dreaming.description")}
    >
      <SettingsRow label={t("post.dreaming.toggle.label")}>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </SettingsRow>
      {(folderUrl ?? threadCount > 0) && (
        <Div className="flex items-center gap-2">
          {folderUrl && (
            <Link
              href={folderUrl}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              {t("post.dreaming.folderLink")}
            </Link>
          )}
          {threadCount > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {threadCount}
            </Badge>
          )}
        </Div>
      )}
      <SettingsRow label={t("post.dreaming.schedule.label")}>
        <ScheduleAutocomplete
          value={schedule}
          onChange={onScheduleChange}
          disabled={!enabled}
          locale={locale}
        />
      </SettingsRow>
      <Div className="py-1">
        <PulseFavSlot
          favoriteId={favoriteId}
          onFavoriteChange={onFavoriteChange}
          disabled={!enabled}
          locale={locale}
          label={t("post.dreaming.favoriteId.label")}
          placeholder={t("post.dreaming.favoriteId.defaultOption")}
          defaultSkillId="thea-dreamer"
        />
      </Div>
      <SettingsRow label={t("post.dreaming.prompt.label")}>
        <Textarea
          value={prompt ?? t("post.dreaming.prompt.defaultPrompt")}
          onChange={(e) =>
            onPromptChange(e.target.value.trim() === "" ? null : e.target.value)
          }
          placeholder={t("post.dreaming.prompt.placeholder")}
          disabled={!enabled}
          className="text-sm min-h-[80px] resize-none"
        />
      </SettingsRow>
      <Button
        variant="outline"
        size="sm"
        disabled={!enabled || isRunning}
        onClick={() => void handleRunNow()}
        className="self-start"
      >
        {isRunning ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
        ) : (
          <Play className="h-3.5 w-3.5 mr-1.5" />
        )}
        {t("post.dreaming.runNow")}
      </Button>
    </SettingsSection>
  );
}

function PulseSectionAutopilot({
  enabled,
  favoriteId,
  schedule,
  prompt,
  subFolderId,
  threadCount,
  taskId,
  onToggle,
  onScheduleChange,
  onFavoriteChange,
  onPromptChange,
  locale,
}: Omit<PulseSectionProps, "mode">): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const [isRunning, setIsRunning] = useState(false);

  const folderUrl = subFolderId
    ? buildFolderUrl(locale, DefaultFolderId.BACKGROUND, subFolderId)
    : null;

  const handleRunNow = useCallback(async (): Promise<void> => {
    setIsRunning(true);
    try {
      await apiClient.mutate(
        cronBulkEndpoints.POST,
        logger,
        user,
        { ids: [taskId], action: "run" },
        undefined,
        locale,
      );
    } finally {
      setIsRunning(false);
    }
  }, [taskId, logger, user, locale]);

  return (
    <SettingsSection
      icon={<Bot className="h-4 w-4 text-primary" />}
      title={t("post.autopilot.title")}
      description={t("post.autopilot.description")}
    >
      <SettingsRow label={t("post.autopilot.toggle.label")}>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </SettingsRow>
      {(folderUrl ?? threadCount > 0) && (
        <Div className="flex items-center gap-2">
          {folderUrl && (
            <Link
              href={folderUrl}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              {t("post.autopilot.folderLink")}
            </Link>
          )}
          {threadCount > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {threadCount}
            </Badge>
          )}
        </Div>
      )}
      <SettingsRow label={t("post.autopilot.schedule.label")}>
        <ScheduleAutocomplete
          value={schedule}
          onChange={onScheduleChange}
          disabled={!enabled}
          locale={locale}
        />
      </SettingsRow>
      <Div className="py-1">
        <PulseFavSlot
          favoriteId={favoriteId}
          onFavoriteChange={onFavoriteChange}
          disabled={!enabled}
          locale={locale}
          label={t("post.autopilot.favoriteId.label")}
          placeholder={t("post.autopilot.favoriteId.defaultOption")}
          defaultSkillId="hermes-autopilot"
        />
      </Div>
      <SettingsRow label={t("post.autopilot.prompt.label")}>
        <Textarea
          value={prompt ?? t("post.autopilot.prompt.defaultPrompt")}
          onChange={(e) =>
            onPromptChange(e.target.value.trim() === "" ? null : e.target.value)
          }
          placeholder={t("post.autopilot.prompt.placeholder")}
          disabled={!enabled}
          className="text-sm min-h-[80px] resize-none"
        />
      </SettingsRow>
      <Button
        variant="outline"
        size="sm"
        disabled={!enabled || isRunning}
        onClick={() => void handleRunNow()}
        className="self-start"
      >
        {isRunning ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
        ) : (
          <Play className="h-3.5 w-3.5 mr-1.5" />
        )}
        {t("post.autopilot.runNow")}
      </Button>
    </SettingsSection>
  );
}

/** Stable global task ID for the mama heartbeat (admin-only, userId=null) */
const MAMA_TASK_ID = "thea-mama";

interface MamaSectionProps {
  enabled: boolean;
  schedule: string;
  prompt: string | null;
  onToggle: (enabled: boolean) => void;
  onScheduleChange: (schedule: string) => void;
  onPromptChange: (prompt: string | null) => void;
  locale: CountryLanguage;
}

function PulseSectionMama({
  enabled,
  schedule,
  prompt,
  onToggle,
  onScheduleChange,
  onPromptChange,
  locale,
}: MamaSectionProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const [isRunning, setIsRunning] = useState(false);

  const handleRunNow = useCallback(async (): Promise<void> => {
    setIsRunning(true);
    try {
      await apiClient.mutate(
        cronBulkEndpoints.POST,
        logger,
        user,
        { ids: [MAMA_TASK_ID], action: "run" },
        undefined,
        locale,
      );
    } finally {
      setIsRunning(false);
    }
  }, [logger, user, locale]);

  return (
    <SettingsSection
      icon={<Brain className="h-4 w-4 text-primary" />}
      title={t("post.mama.title")}
      description={t("post.mama.description")}
    >
      <SettingsRow label={t("post.mama.toggle.label")}>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </SettingsRow>
      <SettingsRow label={t("post.mama.schedule.label")}>
        <ScheduleAutocomplete
          value={schedule}
          onChange={onScheduleChange}
          disabled={!enabled}
          locale={locale}
        />
      </SettingsRow>
      <SettingsRow label={t("post.mama.prompt.label")}>
        <Textarea
          value={prompt ?? t("post.mama.prompt.defaultPrompt")}
          onChange={(e) =>
            onPromptChange(e.target.value.trim() === "" ? null : e.target.value)
          }
          placeholder={t("post.mama.prompt.placeholder")}
          disabled={!enabled}
          className="text-sm min-h-[80px] resize-none"
        />
      </SettingsRow>
      <Button
        variant="outline"
        size="sm"
        disabled={!enabled || isRunning}
        onClick={() => void handleRunNow()}
        className="self-start"
      >
        {isRunning ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
        ) : (
          <Play className="h-3.5 w-3.5 mr-1.5" />
        )}
        {t("post.mama.runNow")}
      </Button>
    </SettingsSection>
  );
}

/** Sentinel value for the "Auto" search provider option (not a real provider ID) */
const SEARCH_AUTO_VALUE = "auto-detect";

interface ChatSettingsWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function ChatSettingsWidget({
  field,
}: ChatSettingsWidgetProps): JSX.Element {
  const children = field.children;
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { t } = scopedTranslation.scopedT(locale);
  const { t: tSearch } = searchScopedTranslation.scopedT(locale);

  const { settings, isLoading, updateSettings } = useChatSettings(user, logger);
  const { favorites } = useChatFavorites(logger, {
    activeFavoriteId: settings?.activeFavoriteId ?? null,
  });
  const { addFavorite } = useFavoriteCreate(user, logger);

  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = useCallback(
    async (
      updates: Partial<ChatSettingsUpdateRequestOutput>,
    ): Promise<void> => {
      setIsSaving(true);
      try {
        await updateSettings(updates);
      } finally {
        setIsSaving(false);
      }
    },
    [updateSettings],
  );

  /**
   * Ensure a background skill favorite exists when enabling dream/autopilot.
   * Returns the existing or newly created favoriteId.
   */
  const ensureBackgroundFavorite = useCallback(
    async (skillId: string): Promise<string | null> => {
      const existing = favorites.find(
        (f) => parseSkillId(f.skillId).skillId === skillId,
      );
      if (existing) {
        return existing.id;
      }
      const skill = DEFAULT_SKILLS.find((s) => s.id === skillId);
      return addFavorite({
        skillId,
        icon: skill?.icon,
        modelSelection: null,
        voiceModelSelection: null,
      });
    },
    [favorites, addFavorite],
  );

  const handleDreamerToggle = useCallback(
    async (val: boolean): Promise<void> => {
      if (val) {
        const favId = await ensureBackgroundFavorite("thea-dreamer");
        await updateSettings({
          dreamerEnabled: true,
          ...(favId && !settings?.dreamerFavoriteId
            ? { dreamerFavoriteId: favId }
            : {}),
        });
      } else {
        void handleUpdate({ dreamerEnabled: false });
      }
    },
    [
      ensureBackgroundFavorite,
      updateSettings,
      settings?.dreamerFavoriteId,
      handleUpdate,
    ],
  );

  const handleAutopilotToggle = useCallback(
    async (val: boolean): Promise<void> => {
      if (val) {
        const favId = await ensureBackgroundFavorite("hermes-autopilot");
        await updateSettings({
          autopilotEnabled: true,
          ...(favId && !settings?.autopilotFavoriteId
            ? { autopilotFavoriteId: favId }
            : {}),
        });
      } else {
        void handleUpdate({ autopilotEnabled: false });
      }
    },
    [
      ensureBackgroundFavorite,
      updateSettings,
      settings?.autopilotFavoriteId,
      handleUpdate,
    ],
  );

  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);

  if (isLoading || !settings) {
    return (
      <Div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-3 pb-1">
        <NavigateButtonWidget field={children.backButton} />
        <Settings className="h-5 w-5 text-primary" />
        <Span className="text-lg font-bold">{t("post.container.title")}</Span>
        {isSaving && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground ml-auto" />
        )}
      </Div>

      {/* Search Provider */}
      <SettingsSection
        icon={<Globe className="h-4 w-4 text-primary" />}
        title={t("post.searchProvider.label")}
        description={t("post.searchProvider.description")}
      >
        <SettingsRow label={t("post.searchProvider.label")}>
          <Select
            value={settings.searchProvider ?? SEARCH_AUTO_VALUE}
            onValueChange={(value) =>
              void handleUpdate({
                searchProvider:
                  value === SEARCH_AUTO_VALUE
                    ? null
                    : (value as NonNullable<
                        ChatSettingsUpdateRequestOutput["searchProvider"]
                      >),
              })
            }
          >
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SEARCH_AUTO_VALUE}>
                {t("post.searchProvider.auto")}
              </SelectItem>
              {SearchProviderOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {tSearch(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsRow>
      </SettingsSection>

      {/* Admin-only: Coding Agent */}
      {isAdmin && (
        <SettingsSection
          icon={<Monitor className="h-4 w-4 text-primary" />}
          title={t("post.codingAgent.label")}
          description={t("post.codingAgent.description")}
        >
          <SettingsRow label={t("post.codingAgent.label")}>
            <Select
              value={settings.codingAgent ?? "claude-code"}
              onValueChange={(value) =>
                void handleUpdate({
                  codingAgent: value as NonNullable<
                    ChatSettingsUpdateRequestOutput["codingAgent"]
                  >,
                })
              }
            >
              <SelectTrigger className="w-[160px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-code">
                  {t("post.codingAgent.options.claudeCode")}
                </SelectItem>
                <SelectItem value="open-code">
                  {t("post.codingAgent.options.openCode")}
                </SelectItem>
              </SelectContent>
            </Select>
          </SettingsRow>
        </SettingsSection>
      )}

      {/* Dreaming — customers only */}
      {!user.isPublic && (
        <PulseSectionDreaming
          enabled={settings.dreamerEnabled ?? false}
          favoriteId={settings.dreamerFavoriteId ?? null}
          schedule={settings.dreamerSchedule ?? DREAM_DEFAULT_SCHEDULE}
          prompt={settings.dreamerPrompt ?? null}
          subFolderId={settings.dreamerSubFolderId ?? null}
          threadCount={settings.dreamerThreadCount ?? 0}
          taskId={`dream-${user.id.slice(0, 8)}`}
          onToggle={(val) => void handleDreamerToggle(val)}
          onScheduleChange={(val) =>
            void handleUpdate({ dreamerSchedule: val })
          }
          onFavoriteChange={(val) =>
            void handleUpdate({ dreamerFavoriteId: val })
          }
          onPromptChange={(val) => void handleUpdate({ dreamerPrompt: val })}
          locale={locale}
        />
      )}

      {/* Autopilot — customers only */}
      {!user.isPublic && (
        <PulseSectionAutopilot
          enabled={settings.autopilotEnabled ?? false}
          favoriteId={settings.autopilotFavoriteId ?? null}
          schedule={settings.autopilotSchedule ?? AUTOPILOT_DEFAULT_SCHEDULE}
          prompt={settings.autopilotPrompt ?? null}
          subFolderId={settings.autopilotSubFolderId ?? null}
          threadCount={settings.autopilotThreadCount ?? 0}
          taskId={`autopilot-${user.id.slice(0, 8)}`}
          onToggle={(val) => void handleAutopilotToggle(val)}
          onScheduleChange={(val) =>
            void handleUpdate({ autopilotSchedule: val })
          }
          onFavoriteChange={(val) =>
            void handleUpdate({ autopilotFavoriteId: val })
          }
          onPromptChange={(val) => void handleUpdate({ autopilotPrompt: val })}
          locale={locale}
        />
      )}

      {/* AI Heartbeat (Mama) — admin only */}
      {isAdmin && (
        <PulseSectionMama
          enabled={settings.mamaEnabled ?? false}
          schedule={settings.mamaSchedule ?? MAMA_DEFAULT_SCHEDULE}
          prompt={settings.mamaPrompt ?? null}
          onToggle={(val) => void handleUpdate({ mamaEnabled: val })}
          onScheduleChange={(val) => void handleUpdate({ mamaSchedule: val })}
          onPromptChange={(val) => void handleUpdate({ mamaPrompt: val })}
          locale={locale}
        />
      )}
    </Div>
  );
}
