"use client";

/**
 * New-thread empty state: the mode spotlight.
 *
 * A companion's default mode runs a smart open model. Great daily driver, but
 * guarded on politics. People come for "uncensored", ask something political
 * on the default and leave. This screen shows which mode answers now, what its
 * model is weak at, and the mode that covers it, one tap away.
 *
 * "Uncensored" is not one capability. UncensoredLM answers politics straight;
 * the GLM uncensored model is built for security work and is as guarded on
 * politics as the default. So every mode is described by what its model is
 * good and weak at (keyed by the resolved model id), never on one
 * filtered-to-free scale, and politics always routes to UncensoredLM.
 *
 * Mode switching goes through `ChatSettingsRepositoryClient.selectFavorite`,
 * the same write the chat input selector makes.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div, type DivRefObject } from "next-vibe/ui/components/div";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { Check } from "next-vibe/ui/components/icons/Check";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { Coffee } from "next-vibe/ui/components/icons/Coffee";
import { Compass } from "next-vibe/ui/components/icons/Compass";
import { Flame } from "next-vibe/ui/components/icons/Flame";
import { Image as ImageIcon } from "next-vibe/ui/components/icons/Image";
import { Minus } from "next-vibe/ui/components/icons/Minus";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { PenTool } from "next-vibe/ui/components/icons/PenTool";
import { Scale } from "next-vibe/ui/components/icons/Scale";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { Terminal } from "next-vibe/ui/components/icons/Terminal";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import type { IconComponent } from "next-vibe/ui/lib/helper";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import type { JSX, ReactNode, RefObject } from "react";
import { useRef, useState } from "react";

import {
  ChatModelId,
  type ChatModelOption,
  getBestChatModel,
  getChatModelById,
} from "../../../../ai-stream/models";
import { useProviderAvailability } from "../../../../env-availability-store";
import {
  COMPANION_SKILLS,
  DEFAULT_SKILLS,
  type Skill,
  type SkillVariant,
} from "../../../../skills/config";
import { NO_SKILL_ID } from "../../../../skills/constants";
import { ModelSelectionType } from "../../../../skills/enum";
import { useChatFavorites } from "../../../../skills/favorites/hooks/hooks";
import {
  type SkillsT,
  scopedTranslation as skillsScopedTranslation,
} from "../../../../skills/i18n";
import { getDefaultFolderConfig } from "../../../config";
import type { DefaultFolderId } from "../../../../../core/execution-context";
import { useChatSettings } from "../../../settings/hooks";
import { ChatSettingsRepositoryClient } from "../../../settings/repository-client";
import { useTourState } from "../../../tour-state";
import { formatSkillId, parseSkillId } from "../../../slugify";
import { scopedTranslation, type ThreadsT } from "../../i18n";

/* ========================================================================== *
 * CAPABILITIES
 * What each model is actually for. Keyed by the model a mode resolves to, so
 * it holds across every companion and skill that uses the same model.
 * ========================================================================== */

type Use =
  | "everyday"
  | "politics"
  | "security"
  | "writing"
  | "images"
  | "classic"
  | "bold"
  | "general";

/** Specialties first: the order rows and quick picks appear in. */
const USE_ORDER: readonly Use[] = [
  "everyday",
  "politics",
  "security",
  "writing",
  "images",
  "classic",
  "bold",
  "general",
];

const USE_BY_MODEL: Partial<Record<ChatModelId, Use>> = {
  [ChatModelId.KIMI_K3]: "everyday",
  // The one model that answers politics straight.
  [ChatModelId.UNCENSORED_LM_V1_2]: "politics",
  // Uncensored, but built for security work. Guarded on politics.
  [ChatModelId.GLM_5_3_UNCENSORED]: "security",
  [ChatModelId.CLAUDE_SONNET_5_5]: "writing",
  [ChatModelId.CLAUDE_OPUS_5_5]: "writing",
  [ChatModelId.GEMINI_4_ARGON]: "images",
  [ChatModelId.GPT_6_1_TERRA]: "classic",
  [ChatModelId.GROK_4_7]: "bold",
};

const USE_ICON: Record<Use, IconComponent> = {
  everyday: Coffee,
  politics: Scale,
  security: Terminal,
  writing: PenTool,
  images: ImageIcon,
  classic: Sparkles,
  bold: Flame,
  general: MessageSquare,
};

/** Use icons stay neutral; color is reserved for state (hover, focus, selected). */
const USE_CHIP_CLASS = "bg-muted text-foreground/80 dark:bg-foreground/10";

/**
 * The mode that covers what the active mode is weak at: politics for every
 * guarded model, and the default daily driver when you are on the politics
 * model (which is weaker on complex tasks).
 */
function fixFor(modes: ModeView[], active: ModeView): ModeView | null {
  const target =
    active.use === "politics"
      ? (modeForUse(modes, "writing") ?? modeForUse(modes, "everyday"))
      : modeForUse(modes, "politics");
  return target && target.variantId !== active.variantId ? target : null;
}

/* ========================================================================== *
 * VIEW MODEL
 * ========================================================================== */

interface ModeView {
  variantId: string;
  /** `skill__variant`, the id selectFavorite writes into settings. */
  composite: string;
  name: string;
  modelId: ChatModelId | null;
  modelName: string | null;
  modelIcon: IconKey | null;
  use: Use;
  isDefault: boolean;
  isActive: boolean;
}

interface CompanionView {
  kind: "companion";
  name: string;
  /** The skill's own one-line description. */
  tagline: string;
  icon: IconKey;
  /** Skill order, as authored. */
  modes: ModeView[];
  active: ModeView;
}

type SkillView = CompanionView | { kind: "none" } | { kind: "custom" };

interface CompanionOption {
  id: string;
  name: string;
  tagline: string;
  icon: IconKey;
  /** Has a mode that answers politics straight. */
  hasPolitics: boolean;
}

interface FolderView {
  icon: IconKey;
  label: string;
  note: string;
  tone: string;
}

/**
 * The model a variant really runs for this user. Same resolver the favorites
 * path uses, so the name shown here is the name the chat input will show.
 */
function resolveVariantModel(
  variant: SkillVariant,
  user: ReturnType<typeof useWidgetUser>,
  availability: ReturnType<typeof useProviderAvailability>,
): ChatModelOption | null {
  const best = getBestChatModel(variant.modelSelection, user, availability);
  if (best) {
    return best;
  }
  return variant.modelSelection.selectionType === ModelSelectionType.MANUAL
    ? getChatModelById(variant.modelSelection.manualModelId)
    : null;
}

function buildModes(params: {
  skill: Skill;
  activeVariantId: string | null;
  tSkills: SkillsT;
  user: ReturnType<typeof useWidgetUser>;
  availability: ReturnType<typeof useProviderAvailability>;
}): ModeView[] {
  const { skill, activeVariantId, tSkills, user, availability } = params;
  const defaultId =
    skill.variants.find((v) => v.isDefault)?.id ?? skill.variants[0]?.id;
  const activeId =
    activeVariantId !== null &&
    skill.variants.some((v) => v.id === activeVariantId)
      ? activeVariantId
      : defaultId;
  return skill.variants.map((variant) => {
    const model = resolveVariantModel(variant, user, availability);
    const isDefault = variant.id === defaultId;
    const known = model ? USE_BY_MODEL[model.id] : undefined;
    return {
      variantId: variant.id,
      composite: formatSkillId(skill.id, variant.id),
      name: tSkills(variant.variantName),
      modelId: model?.id ?? null,
      modelName: model?.name ?? null,
      modelIcon: model?.icon ?? null,
      use: known ?? (isDefault ? "everyday" : "general"),
      isDefault,
      isActive: variant.id === activeId,
    };
  });
}

function rankOf(use: Use): number {
  return USE_ORDER.indexOf(use);
}

/** The mode to route a use to: the default for everyday, else the first match. */
function modeForUse(modes: ModeView[], use: Use): ModeView | null {
  if (use === "everyday") {
    return modes.find((m) => m.isDefault) ?? null;
  }
  return modes.find((m) => m.use === use) ?? null;
}

/* ========================================================================== *
 * SHARED ATOMS
 * ========================================================================== */

const FOLDER_TONES: Record<string, string> = {
  sky: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  teal: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  green: "bg-green-500/10 text-green-700 dark:text-green-300",
  indigo: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
};

/** Shared interaction states: keyboard ring, press feedback, no motion if asked. */
const INTERACTIVE =
  "cursor-pointer outline-none transition-[background-color,border-color,box-shadow,transform,color] duration-150 focus-visible:ring-2 focus-visible:ring-foreground/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:active:scale-[0.985] disabled:cursor-not-allowed";

const HEADING =
  "text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem] sm:leading-[1.15] lg:text-[2rem] [@media(max-height:760px)]:sm:text-2xl [@media(max-height:760px)]:lg:text-2xl";

/** Where this chat lives. Informational: tinted glyph and text, not a pill. */
function FolderPill({ folder }: { folder: FolderView }): JSX.Element {
  return (
    <Div className="inline-flex min-w-0 max-w-full items-center gap-2 py-1 text-xs">
      <Span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          folder.tone,
        )}
      >
        <Icon icon={folder.icon} className="h-3 w-3" />
      </Span>
      <Span className="shrink-0 font-semibold text-foreground">
        {folder.label}
      </Span>
      <Span
        aria-hidden="true"
        className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50"
      />
      <Span className="min-w-0 truncate text-foreground/70">{folder.note}</Span>
    </Div>
  );
}

/**
 * Who answers. A real control: opens the same companion and model selector
 * as the chat input, so it looks like one (border, chevron).
 */
function CompanionChip({
  name,
  icon,
  label,
}: {
  name: string;
  icon: IconKey;
  label: string;
}): JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      size="unset"
      aria-label={label}
      onClick={() => useTourState.getState().setModelSelectorOpen(true)}
      className={cn(
        "h-8 max-w-full gap-2 rounded-full border border-foreground/20 bg-card pl-2.5 pr-2 text-sm font-semibold text-foreground shadow-xs hover:border-foreground/40 hover:bg-accent",
        INTERACTIVE,
      )}
    >
      <Icon
        icon={icon}
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
      />
      <Span className="truncate">{name}</Span>
      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </Button>
  );
}

/** What a mode is for, as a neutral icon tile. */
function UseChip({
  use,
  size = "md",
}: {
  use: Use;
  size?: "md" | "lg";
}): JSX.Element {
  const UseIcon = USE_ICON[use];
  return (
    <Span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        size === "lg" ? "h-11 w-11" : "h-9 w-9",
        USE_CHIP_CLASS,
      )}
    >
      <UseIcon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
    </Span>
  );
}

/** The model a mode runs, with its brand mark. */
function ModelLine({
  mode,
  t,
  className,
}: {
  mode: ModeView;
  t: ThreadsT;
  className?: string;
}): JSX.Element {
  const model = mode.modelName ?? t("widget.emptyState.mode.autoModel");
  return (
    <Span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      {mode.modelIcon ? (
        <Icon icon={mode.modelIcon} className="h-3.5 w-3.5 shrink-0" />
      ) : null}
      <Span className="truncate">{model}</Span>
    </Span>
  );
}

/** Good at / weak at: the honest two-liner. */
function GoodWeak({
  use,
  t,
  weakAction,
  hideGood = false,
}: {
  use: Use;
  t: ThreadsT;
  /** Skip the good-at line when the same text is already on screen. */
  hideGood?: boolean;
  /** Inline fix for the weak spot, e.g. a link to the mode that covers it. */
  weakAction?: ReactNode;
}): JSX.Element {
  return (
    <Div className="grid gap-2 text-sm">
      {hideGood ? null : (
        <Span className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <Span className="min-w-0 text-foreground">
            <Span className="mr-1 font-semibold">
              {t("widget.emptyState.mode.goodAt")}
            </Span>
            {t(`widget.emptyState.use.${use}.good`)}
          </Span>
        </Span>
      )}
      <Span className="flex items-start gap-2">
        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <Span className="min-w-0 text-foreground">
          <Span className="mr-1 font-semibold">
            {t("widget.emptyState.mode.weakAt")}
          </Span>
          <Span className="mr-2">{t(`widget.emptyState.use.${use}.weak`)}</Span>
          {weakAction}
        </Span>
      </Span>
    </Div>
  );
}

/** The one style for "take me somewhere": bold label plus arrow, no box. */
function ActionLink({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}): JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      size="unset"
      onClick={onClick}
      className={cn(
        "group inline-flex h-auto gap-1.5 rounded-md px-1 py-0.5 text-sm font-semibold text-foreground hover:bg-transparent hover:text-foreground",
        INTERACTIVE,
        "motion-safe:active:scale-100",
      )}
    >
      {icon}
      <Span className="underline decoration-foreground/0 underline-offset-4 transition-colors group-hover:decoration-foreground/50">
        {label}
      </Span>
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
    </Button>
  );
}

function SwitchCompanionLink({
  t,
  companion,
  onSelect,
}: {
  t: ThreadsT;
  companion: CompanionOption;
  onSelect: (skillId: string) => void;
}): JSX.Element {
  return (
    <ActionLink
      label={t("widget.emptyState.single.action", {
        companion: companion.name,
      })}
      icon={<Icon icon={companion.icon} className="h-4 w-4" />}
      onClick={() => onSelect(companion.id)}
    />
  );
}

/**
 * Inner scroll. The chat input floats over the bottom of this area, so a
 * spacer keeps content clear of it. Content is anchored to a fixed top offset,
 * so switching modes or companions never moves the headline.
 */
function Shell({
  bottomPadding,
  scrollRef,
  children,
}: {
  bottomPadding: number;
  scrollRef: RefObject<DivRefObject | null>;
  children: ReactNode;
}): JSX.Element {
  return (
    <Div
      ref={scrollRef}
      className="h-full min-h-0 overflow-y-auto overscroll-contain [scrollbar-gutter:stable_both-edges]"
    >
      <Div className="flex min-h-full flex-col">
        {/* Gutters mirror the chat input wrapper so edges line up exactly. */}
        <Div className="mx-auto w-full max-w-3xl px-3 pb-6 pt-[4.5rem] sm:px-4 sm:pb-10 sm:pt-[max(2.5rem,9vh)] md:px-8 lg:px-10 [@media(max-height:760px)]:pb-4 [@media(max-height:760px)]:pt-6">
          {children}
        </Div>
        {/* Clears the floating chat input (height is dynamic). */}
        <Div style={{ height: bottomPadding, flexShrink: 0 }} />
      </Div>
    </Div>
  );
}

/** No companion chosen yet (NO_SKILL). */
function CompanionPicker({
  companions,
  t,
  onSelect,
  plainModelName,
}: {
  companions: CompanionOption[];
  t: ThreadsT;
  onSelect: (skillId: string) => void;
  plainModelName: string | null;
}): JSX.Element {
  return (
    <Div className="flex flex-col items-center text-center">
      <H1 className={cn("mt-4", HEADING)}>
        {t("widget.emptyState.companion.title")}
      </H1>
      <P className="mt-2 max-w-lg text-balance text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
        {t("widget.emptyState.companion.subtitle")}
      </P>
      <Div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {companions.map((c) => (
          <Button
            key={c.id}
            type="button"
            variant="ghost"
            size="unset"
            onClick={() => onSelect(c.id)}
            className={cn(
              "group h-auto w-full items-center gap-3 whitespace-normal rounded-2xl border border-border bg-card p-4 text-left font-normal shadow-xs hover:border-foreground/25 hover:bg-card hover:shadow-md",
              INTERACTIVE,
            )}
          >
            <Span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon icon={c.icon} className="h-5 w-5" />
            </Span>
            <Span className="flex min-w-0 flex-1 flex-col">
              <Span className="truncate text-[15px] font-semibold text-foreground">
                {c.name}
              </Span>
              <Span className="line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-muted-foreground">
                {c.tagline}
              </Span>
            </Span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Button>
        ))}
      </Div>
      <P className="mt-4 text-sm text-muted-foreground">
        {plainModelName
          ? t("widget.emptyState.companion.skipModel", {
              model: plainModelName,
            })
          : t("widget.emptyState.companion.skip")}
      </P>
    </Div>
  );
}

/** A user-made skill we hold no variant data for. Honest and brief. */
function CustomSkillNote({ t }: { t: ThreadsT }): JSX.Element {
  return (
    <Div className="flex flex-col items-center text-center">
      <H1 className={HEADING}>{t("widget.emptyState.custom.title")}</H1>
      <P className="mt-2 max-w-md text-balance text-sm leading-relaxed text-muted-foreground">
        {t("widget.emptyState.custom.subtitle")}
      </P>
    </Div>
  );
}

/** Heading block: who answers, then the headline. */
function CompanionHeading({
  t,
  view,
  title,
  subtitle,
}: {
  t: ThreadsT;
  view: CompanionView;
  title: string;
  subtitle: string;
}): JSX.Element {
  return (
    <Div className="flex flex-col items-center text-center">
      <CompanionChip
        name={view.name}
        icon={view.icon}
        label={t("widget.emptyState.changeCompanion", { name: view.name })}
      />
      <H1 className={cn("mt-4", HEADING)}>{title}</H1>
      <P className="mt-2 max-w-2xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-[15px] [@media(max-height:700px)]:hidden">
        {subtitle}
      </P>
    </Div>
  );
}

/** The one model a single-mode skill runs, named first. */
function SingleModelCard({
  t,
  view,
  footer,
}: {
  t: ThreadsT;
  view: CompanionView;
  footer: ReactNode;
}): JSX.Element {
  return (
    <Div className="w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm">
      <Div className="p-4 sm:p-5">
        <Div className="flex items-center gap-3">
          <UseChip use={view.active.use} size="lg" />
          <Div className="flex min-w-0 flex-1 flex-col">
            <Span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {t("widget.emptyState.spotlight.runsOn")}
            </Span>
            <Span className="flex min-w-0 items-center gap-1.5 text-base font-semibold text-foreground">
              {view.active.modelIcon ? (
                <Icon
                  icon={view.active.modelIcon}
                  className="h-4 w-4 shrink-0"
                />
              ) : null}
              <Span className="truncate">
                {view.active.modelName ?? view.active.name}
              </Span>
            </Span>
          </Div>
        </Div>
        <Div className="mt-3 sm:mt-4">
          <GoodWeak use={view.active.use} t={t} />
        </Div>
      </Div>
      {footer}
    </Div>
  );
}

/* ========================================================================== *
 * SPOTLIGHT
 * The mode that answers now, honestly labelled: its model and what it is weak
 * at, with a link to the mode that covers it. Underneath, every mode by its
 * real variant name, in a fixed order, one tap away.
 * ========================================================================== */

interface SpotlightBodyProps {
  t: ThreadsT;
  view: CompanionView;
  fallbackCompanion: CompanionOption | null;
  onSelectMode: (mode: ModeView) => void;
  onSelectCompanion: (skillId: string) => void;
  /** Scroll so rows revealed by "more modes" clear the floating chat input. */
  onRevealMore: () => void;
}

/** Rows past `limit` hide on these breakpoints until "show all" is pressed. */
const COLLAPSE_RULES: readonly { limit: number; hide: string; show: string }[] =
  [
    { limit: 3, hide: "max-sm:hidden", show: "max-sm:flex" },
    {
      limit: 4,
      hide: "sm:[@media(max-height:900px)]:hidden",
      show: "sm:[@media(max-height:900px)]:flex",
    },
    {
      limit: 2,
      hide: "[@media(max-height:700px)]:hidden",
      show: "[@media(max-height:700px)]:flex",
    },
  ];

function SpotlightBody({
  t,
  view,
  fallbackCompanion,
  onSelectMode,
  onSelectCompanion,
  onRevealMore,
}: SpotlightBodyProps): JSX.Element {
  const [showAll, setShowAll] = useState(false);
  const { active } = view;
  const single = view.modes.length === 1;
  // Stable order: switching modes never reshuffles the list.
  const all = view.modes.toSorted(
    (a, b) =>
      rankOf(a.use) - rankOf(b.use) ||
      Number(b.isDefault) - Number(a.isDefault),
  );
  const fix = fixFor(view.modes, active);
  const hideClass = (m: ModeView, index: number): string =>
    showAll || m.isActive
      ? ""
      : COLLAPSE_RULES.filter((r) => index >= r.limit)
          .map((r) => r.hide)
          .join(" ");
  const moreClass = showAll
    ? ""
    : COLLAPSE_RULES.filter((r) => all.length > r.limit + 1)
        .map((r) => r.show)
        .join(" ");

  return (
    <Div className="flex flex-col items-center">
      <CompanionHeading
        t={t}
        view={view}
        title={
          single
            ? t("widget.emptyState.single.title", { name: view.name })
            : t("widget.emptyState.spotlight.title", { name: view.name })
        }
        subtitle={
          single ? view.tagline : t("widget.emptyState.spotlight.subtitle")
        }
      />

      {single ? (
        <Div className="mt-6 w-full sm:mt-7 [@media(max-height:760px)]:mt-4">
          <SingleModelCard
            t={t}
            view={view}
            footer={
              fallbackCompanion ? (
                <Div className="border-t border-border/70 px-4 py-3 sm:px-5">
                  <Span className="-ml-1 flex">
                    <SwitchCompanionLink
                      t={t}
                      companion={fallbackCompanion}
                      onSelect={onSelectCompanion}
                    />
                  </Span>
                </Div>
              ) : null
            }
          />
        </Div>
      ) : (
        <Div className="mt-6 w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm sm:mt-7 [@media(max-height:760px)]:mt-4">
          {/* The mode that will answer, and what it is not for. */}
          <Div className="p-4 sm:p-5">
            <Div className="flex items-center gap-3">
              <UseChip use={active.use} size="lg" />
              <Div className="flex min-w-0 flex-1 flex-col">
                <Span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {t("widget.emptyState.spotlight.now")}
                </Span>
                <Span className="truncate text-base font-semibold text-foreground">
                  {active.name}
                </Span>
                <ModelLine mode={active} t={t} />
              </Div>
            </Div>
            <Div className="mt-3 sm:mt-4">
              <GoodWeak
                use={active.use}
                t={t}
                hideGood
                weakAction={
                  fix ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="unset"
                      onClick={() => onSelectMode(fix)}
                      className={cn(
                        "group -my-0.5 inline-flex h-auto gap-1 rounded-md px-1 py-0.5 align-baseline text-sm font-semibold text-foreground underline decoration-foreground/30 underline-offset-4 hover:bg-transparent hover:decoration-foreground",
                        INTERACTIVE,
                        "motion-safe:active:scale-100",
                      )}
                    >
                      {t(
                        active.use === "politics"
                          ? "widget.emptyState.spotlight.fix.complex"
                          : "widget.emptyState.spotlight.fix.politics",
                        {
                          mode: fix.name,
                        },
                      )}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </Button>
                  ) : undefined
                }
              />
            </Div>
          </Div>

          <Div className="border-t border-border/70 bg-muted/30 p-2.5 sm:p-3 dark:bg-muted/15">
            <Span className="block px-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {t("widget.emptyState.spotlight.allModes")}
            </Span>
            <Div
              aria-label={t("widget.emptyState.spotlight.allModes")}
              className="mt-1.5 grid grid-cols-1 gap-1 sm:grid-cols-2"
            >
              {all.map((m, index) => (
                <Button
                  key={m.variantId}
                  type="button"
                  aria-current={m.isActive ? "true" : undefined}
                  variant="ghost"
                  size="unset"
                  aria-label={`${m.name}, ${m.modelName ?? m.name}. ${t(`widget.emptyState.use.${m.use}.good`)}`}
                  onClick={() => {
                    if (!m.isActive) {
                      onSelectMode(m);
                    }
                  }}
                  className={cn(
                    "group h-auto w-full items-center justify-start gap-3 whitespace-normal rounded-xl border px-2 py-1.5 text-left font-normal",
                    INTERACTIVE,
                    m.isActive
                      ? "cursor-default border-primary/50 bg-primary/[0.07] hover:bg-primary/[0.07] motion-safe:active:scale-100 dark:border-primary/60 dark:bg-primary/[0.12] dark:hover:bg-primary/[0.12]"
                      : "border-transparent hover:bg-foreground/[0.05] dark:hover:bg-foreground/[0.07]",
                    hideClass(m, index),
                  )}
                >
                  {/* Radio marker: this is a choice, not a link. */}
                  <Span
                    aria-hidden="true"
                    className={cn(
                      "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      m.isActive
                        ? "border-primary"
                        : "border-foreground/30 group-hover:border-foreground/60 group-focus-visible:border-foreground/60",
                    )}
                  >
                    {m.isActive ? (
                      <Span className="h-2 w-2 rounded-full bg-primary" />
                    ) : null}
                  </Span>
                  <UseChip use={m.use} />
                  <Span className="flex min-w-0 flex-1 flex-col">
                    <Span className="flex min-w-0 items-center gap-2">
                      <Span className="shrink-0 text-sm font-semibold text-foreground">
                        {m.name}
                      </Span>
                      <ModelLine mode={m} t={t} className="text-[11px]" />
                    </Span>
                    <Span className="truncate text-xs text-muted-foreground">
                      {t(`widget.emptyState.use.${m.use}.good`)}
                    </Span>
                  </Span>
                </Button>
              ))}
            </Div>
            {moreClass ? (
              <Button
                type="button"
                variant="ghost"
                size="unset"
                onClick={() => {
                  setShowAll(true);
                  onRevealMore();
                }}
                className={cn(
                  "mt-1 hidden h-9 w-full gap-1 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground",
                  INTERACTIVE,
                  moreClass,
                )}
              >
                {t("widget.emptyState.spotlight.more")}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            ) : null}
          </Div>
        </Div>
      )}
    </Div>
  );
}

/* ========================================================================== *
 * ENTRY
 * ========================================================================== */

interface SpotlightEmptyStateProps {
  locale: CountryLanguage;
  /** Selected skill composite from settings; null while settings load. */
  skillId: string | null;
  rootFolderId: DefaultFolderId;
  /** Space the floating chat input covers at the bottom. */
  bottomPadding: number;
}

/**
 * Builds the view model (folder, companion, modes resolved to the real models
 * this user gets, each with its specialty) and wires mode switching through
 * the same `selectFavorite` path the chat input selector uses.
 */
export function SpotlightEmptyState({
  locale,
  skillId,
  rootFolderId,
  bottomPadding,
}: SpotlightEmptyStateProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: tSkills } = skillsScopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const availability = useProviderAvailability();
  const { favorites } = useChatFavorites(logger, { activeFavoriteId: null });
  const { settings } = useChatSettings(user, logger);
  const scrollRef = useRef<DivRefObject | null>(null);
  const requestTour = useTourState((s) => s.requestTour);

  // Settings resolve after first paint. Fall back to the same default the
  // chat input shows, so this never flashes a "no companion" state.
  const effectiveSkillId =
    skillId ??
    ChatSettingsRepositoryClient.getDefaults(user, availability).selectedSkill;
  const parsed = parseSkillId(effectiveSkillId);
  const skill = DEFAULT_SKILLS.find((s) => s.id === parsed.skillId);

  const folderConfig = getDefaultFolderConfig(rootFolderId);
  const folder: FolderView = {
    icon: folderConfig?.icon ?? "message-circle",
    label: t(`widget.emptyState.folder.${rootFolderId}.label`),
    note: t(`widget.emptyState.folder.${rootFolderId}.note`),
    tone:
      FOLDER_TONES[folderConfig?.color ?? "blue"] ?? FOLDER_TONES.blue ?? "",
  };

  const buildCompanionView = (target: Skill): CompanionView | null => {
    const modes = buildModes({
      skill: target,
      activeVariantId: parsed.variantId,
      tSkills,
      user,
      availability,
    });
    const active = modes.find((m) => m.isActive) ?? modes[0];
    if (!active) {
      return null;
    }
    return {
      kind: "companion",
      name: tSkills(target.name),
      tagline: tSkills(target.tagline),
      icon: target.icon,
      modes,
      active,
    };
  };

  const companionView =
    skill && skill.id !== NO_SKILL_ID ? buildCompanionView(skill) : null;
  const view: SkillView = companionView
    ? companionView
    : parsed.skillId === NO_SKILL_ID || skill
      ? { kind: "none" }
      : { kind: "custom" };

  const companions: CompanionOption[] = COMPANION_SKILLS.map((c) => {
    const modes = buildModes({
      skill: c,
      activeVariantId: null,
      tSkills,
      user,
      availability,
    });
    return {
      id: c.id,
      name: tSkills(c.name),
      tagline:
        c.id === "thea"
          ? t("widget.emptyState.companion.about.thea")
          : c.id === "hermes"
            ? t("widget.emptyState.companion.about.hermes")
            : tSkills(c.tagline),
      icon: c.icon,
      hasPolitics: modes.some((m) => m.use === "politics"),
    };
  });
  const fallbackCompanion =
    companions.find((c) => c.id !== parsed.skillId && c.hasPolitics) ?? null;
  const plainModelName = settings?.selectedModel
    ? getChatModelById(settings.selectedModel).name
    : null;

  /**
   * Same write the chat input selector does. Prefer the user's own favorite
   * for this skill+variant (keeps the selector's active badge right); else the
   * composite id, which the server resolves to the matching favorite row.
   */
  const selectMode = (mode: ModeView): void => {
    const favorite = favorites.find((f) => f.skillId === mode.composite);
    void ChatSettingsRepositoryClient.selectFavorite({
      favoriteId: favorite?.id ?? mode.composite,
      modelId: favorite?.modelId ?? mode.modelId,
      skillId: mode.composite,
      logger,
      locale,
      user,
    });
  };

  const selectCompanion = (id: string): void => {
    const target = DEFAULT_SKILLS.find((s) => s.id === id);
    if (!target) {
      return;
    }
    const modes = buildModes({
      skill: target,
      activeVariantId: null,
      tSkills,
      user,
      availability,
    });
    const first = modes.find((m) => m.isDefault) ?? modes[0];
    if (first) {
      selectMode(first);
    }
  };

  // After "more modes" the list grows below the fold; bring its end into view
  // above the chat input (the bottom spacer reserves exactly that space).
  const revealMore = (): void => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    });
  };

  return (
    <Shell bottomPadding={bottomPadding} scrollRef={scrollRef}>
      <Div className="flex flex-col items-center">
        <FolderPill folder={folder} />
        <Div className="mt-4 w-full [@media(max-height:760px)]:mt-3">
          {view.kind === "companion" ? (
            <SpotlightBody
              t={t}
              view={view}
              fallbackCompanion={fallbackCompanion}
              onSelectMode={selectMode}
              onSelectCompanion={selectCompanion}
              onRevealMore={revealMore}
            />
          ) : view.kind === "none" ? (
            <CompanionPicker
              companions={companions}
              t={t}
              onSelect={selectCompanion}
              plainModelName={plainModelName}
            />
          ) : (
            <CustomSkillNote t={t} />
          )}
        </Div>
        {/* The guided tour stays one click away, never forced. */}
        <Button
          type="button"
          variant="ghost"
          size="unset"
          onClick={requestTour}
          className={cn(
            "mt-5 h-8 gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-transparent hover:text-foreground [@media(max-height:760px)]:mt-3",
            INTERACTIVE,
          )}
        >
          <Compass className="h-3.5 w-3.5" />
          {t("widget.suggestedPrompts.takeTour")}
        </Button>
      </Div>
    </Shell>
  );
}
