"use client";

import { Audio } from "next-vibe-ui/ui/audio";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Music } from "next-vibe-ui/ui/icons/Music";
import { ExternalLink } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { H3 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import { getBestMusicGenModel } from "@/app/api/[locale]/agent/music-generation/models";
import type { MusicGenModelSelection } from "@/app/api/[locale]/agent/music-generation/models";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";
import {
  ModelSelector,
  ModelSelectorTrigger,
} from "@/app/api/[locale]/agent/models/widget/model-selector";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";
import { MusicDuration } from "./enum";
import { scopedTranslation } from "./i18n";
import { DEFAULT_MUSIC_GEN_MODEL_SELECTION } from "./constants";
import { getMusicGenModelById, MusicGenModelId } from "./models";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

const DURATION_PRESETS = [
  { label: "Short", sublabel: "~8s", value: MusicDuration.SHORT },
  { label: "Medium", sublabel: "~20s", value: MusicDuration.MEDIUM },
  { label: "Long", sublabel: "~30s", value: MusicDuration.LONG },
] as const;

const STYLE_CHIPS = [
  "Upbeat electronic",
  "Ambient chill",
  "Cinematic orchestra",
  "Lo-fi hip hop",
  "Epic rock",
  "Jazz piano",
  "Deep bass",
  "Acoustic folk",
];

export function MusicGenerationContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const isSubmitting = useWidgetIsSubmitting();
  const form = useWidgetForm<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const children = field.children;
  const prompt = form?.watch("prompt") ?? "";
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const [showModelSelector, setShowModelSelector] = useState(false);

  const currentModelId = form?.watch("model");
  const currentDuration = form?.watch("duration") ?? MusicDuration.MEDIUM;

  const modelSelection = useMemo((): MusicGenModelSelection | undefined => {
    // model is resolved via serverDefault on the field definition
    if (!currentModelId) {
      return undefined;
    }
    return {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: currentModelId,
    };
  }, [currentModelId]);

  const defaultModelSelection = useMemo(():
    | MusicGenModelSelection
    | undefined => {
    const m = getBestMusicGenModel(DEFAULT_MUSIC_GEN_MODEL_SELECTION, user);
    if (!m) {
      return undefined;
    }
    return { selectionType: ModelSelectionType.MANUAL, manualModelId: m.id };
  }, [user]);

  const resolvedModelId =
    currentModelId ??
    (defaultModelSelection?.selectionType === ModelSelectionType.MANUAL
      ? defaultModelSelection.manualModelId
      : undefined);
  const resolvedModel = resolvedModelId
    ? getMusicGenModelById(resolvedModelId)
    : undefined;
  const resolvedAudioBased = resolvedModel;

  // Filter duration presets to only show supported durations
  const availableDurationPresets = DURATION_PRESETS.filter(
    (p) =>
      !resolvedAudioBased?.supportedDurations ||
      resolvedAudioBased.supportedDurations.includes(p.value),
  );

  const appendStyle = (style: string): void => {
    const current = form?.getValues("prompt") ?? "";
    const sep = current.trim().length > 0 ? ", " : "";
    form?.setValue("prompt", `${current}${sep}${style}`);
  };

  if (showModelSelector) {
    return (
      <Div className="flex flex-col gap-4 p-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowModelSelector(false)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <ModelSelector
          allowedRoles={["audio-gen"]}
          modelSelection={modelSelection}
          onChange={(sel) => {
            if (
              sel !== null &&
              sel.selectionType === ModelSelectionType.MANUAL
            ) {
              const modelId = Object.values(MusicGenModelId).find(
                (id) => id === sel.manualModelId,
              );
              if (modelId !== undefined) {
                form?.setValue("model", modelId);
              }
            }
            setShowModelSelector(false);
          }}
          locale={locale}
          user={user}
        />
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <Div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Music className="h-3.5 w-3.5 text-primary" />
        </Div>
        <H3 className="text-sm font-semibold">{t("post.title")}</H3>
      </Div>

      <Div className="flex flex-col gap-4 px-4 pb-4">
        <FormAlertWidget field={{}} />

        {/* Prompt */}
        <Div className="flex flex-col gap-1.5">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("post.prompt.label")}
          </Span>
          <Textarea
            className="w-full min-h-[80px] resize-none"
            placeholder={t("post.prompt.placeholder")}
            value={prompt}
            onChange={(e) => form?.setValue("prompt", e.target.value)}
          />
          {/* Style chips */}
          <Div className="flex flex-wrap gap-1.5">
            {STYLE_CHIPS.map((style) => (
              <Button
                key={style}
                type="button"
                variant="outline"
                size="sm"
                className="h-6 px-2 text-[10px] rounded-full"
                onClick={() => appendStyle(style)}
              >
                {style}
              </Button>
            ))}
          </Div>
        </Div>

        {/* Duration presets */}
        <Div className="flex flex-col gap-1.5">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("post.duration.label")}
          </Span>
          <Div className="flex gap-2">
            {availableDurationPresets.map((preset) => (
              <Button
                key={preset.value}
                type="button"
                variant={
                  currentDuration === preset.value ? "default" : "outline"
                }
                size="sm"
                className="flex-1 h-auto py-2 flex flex-col gap-0.5"
                onClick={() => form?.setValue("duration", preset.value)}
              >
                <Span className="text-xs font-medium">{preset.label}</Span>
                <Span className="text-[10px] opacity-70">
                  {preset.sublabel}
                </Span>
              </Button>
            ))}
          </Div>
        </Div>

        {/* Model selector */}
        <Div className="flex flex-col gap-1.5">
          <Div className="flex items-center justify-between">
            <Span className="text-xs font-medium text-muted-foreground">
              {t("post.model.label")}
            </Span>
            {resolvedModelId && (
              <ModelCreditDisplay
                modelId={resolvedModelId}
                variant="badge"
                badgeVariant="secondary"
                className="text-[10px] h-5"
                locale={locale}
              />
            )}
          </Div>
          <ModelSelectorTrigger
            modelSelection={modelSelection ?? null}
            allowedRoles={["audio-gen"]}
            defaultModelSelection={defaultModelSelection}
            placeholder={t("post.model.label")}
            onClick={() => setShowModelSelector(true)}
            locale={locale}
            user={user}
          />
        </Div>

        {/* Generate button */}
        <Div className="flex gap-2">
          <NavigateButtonWidget field={children.backButton} />
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "post.submitButton.text",
              loadingText: "post.submitButton.loadingText",
              icon: "music",
              variant: "primary",
            }}
          />
        </Div>

        {/* Generating state */}
        {isSubmitting && (
          <Div className="flex flex-col items-center justify-center gap-3 py-12 rounded-xl border bg-muted/30">
            <Div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </Div>
            <Span className="text-sm text-muted-foreground">
              {t("post.submitButton.loadingText")}
            </Span>
          </Div>
        )}

        {/* Result */}
        {!isSubmitting && result?.audioUrl && (
          <Div className="flex flex-col gap-3">
            {/* Waveform-style player card */}
            <Div className="rounded-xl border bg-gradient-to-br from-primary/5 via-background to-muted/30 p-4 flex flex-col gap-3">
              <Div className="flex items-center gap-3">
                <Div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Music className="h-5 w-5 text-primary" />
                </Div>
                <Div className="flex-1 min-w-0">
                  <Span className="block text-sm font-medium truncate">
                    {resolvedModel?.name ?? "Generated Audio"}
                  </Span>
                  <Span className="block text-[11px] text-muted-foreground">
                    {DURATION_PRESETS.find((p) => p.value === currentDuration)
                      ?.sublabel ?? ""}{" "}
                    {t("post.separator")}{" "}
                    {result.durationSeconds ? `${result.durationSeconds}s` : ""}
                  </Span>
                </Div>
                <ExternalLink
                  href={result.audioUrl}
                  download="generated-audio.mp3"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </ExternalLink>
              </Div>
              <Audio controls src={result.audioUrl} className="w-full h-10" />
            </Div>

            {/* Meta row */}
            <Div className="flex items-center gap-2 flex-wrap">
              {resolvedModel && (
                <Badge variant="secondary" className="text-[10px]">
                  {resolvedModel.name}
                </Badge>
              )}
              {result.creditCost !== undefined && (
                <Badge variant="outline" className="text-[10px]">
                  {result.creditCost}{" "}
                  {result.creditCost === 1 ? "credit" : "credits"}
                </Badge>
              )}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
