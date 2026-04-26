"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Video as VideoIcon } from "next-vibe-ui/ui/icons/Video";
import { ExternalLink } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { H3 } from "next-vibe-ui/ui/typography";
import { Video } from "next-vibe-ui/ui/video";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import { ModelCreditDisplay } from "@/app/api/[locale]/agent/models/widget/model-credit-display";
import {
  ModelSelector,
  ModelSelectorTrigger,
} from "@/app/api/[locale]/agent/models/widget/model-selector";
import { DEFAULT_VIDEO_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/video-generation/constants";
import type { VideoGenModelSelection } from "@/app/api/[locale]/agent/video-generation/models";
import {
  getBestVideoGenModel,
  getVideoGenModelById,
} from "@/app/api/[locale]/agent/video-generation/models";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import { objectValues } from "../../shared/utils";
import type definition from "./definition";
import { scopedTranslation } from "./i18n";
import { VideoGenModelId } from "./models";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

/** Default duration presets when model has no supportedDurations */
const DEFAULT_DURATION_PRESETS = [
  { label: "Short", sublabel: "~5s", seconds: 5 },
  { label: "Medium", sublabel: "~10s", seconds: 10 },
  { label: "Long", sublabel: "~15s", seconds: 15 },
] as const;

const STYLE_CHIPS = [
  "Cinematic",
  "Aerial drone",
  "Slow motion",
  "Time-lapse",
  "Anime style",
  "Photorealistic",
  "Abstract",
  "Documentary",
];

/** Build duration presets from model's supportedDurations (seconds as strings) */
function buildDurationPresets(
  supportedDurations: readonly string[] | undefined,
): Array<{ label: string; sublabel: string; seconds: number }> {
  if (!supportedDurations || supportedDurations.length === 0) {
    return [...DEFAULT_DURATION_PRESETS];
  }
  const sorted = [...supportedDurations]
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n) && n > 0)
    .toSorted((a, b) => a - b);

  if (sorted.length === 0) {
    return [...DEFAULT_DURATION_PRESETS];
  }

  // Label: Short = first, Long = last, Medium = middle (if 3+), otherwise numbered
  return sorted.map((seconds, i) => {
    let label: string;
    if (sorted.length === 1) {
      label = `${String(seconds)}s`;
    } else if (sorted.length === 2) {
      label = i === 0 ? "Short" : "Long";
    } else if (sorted.length === 3) {
      label = i === 0 ? "Short" : i === 1 ? "Medium" : "Long";
    } else {
      // 4+ options: label first/last specially, number the rest
      if (i === 0) {
        label = "Short";
      } else if (i === sorted.length - 1) {
        label = "Long";
      } else {
        label = `${String(seconds)}s`;
      }
    }
    return { label, sublabel: `~${String(seconds)}s`, seconds };
  });
}

export function VideoGenerationContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const isSubmitting = useWidgetIsSubmitting();
  const isDisabled = useWidgetDisabled();
  const form = useWidgetForm<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const children = field.children;
  const prompt = form?.watch("prompt") ?? "";
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const [showModelSelector, setShowModelSelector] = useState(false);

  const currentModelId = form?.watch("model");
  const currentDuration = form?.watch("duration") ?? 5;
  const currentAspectRatio = form?.watch("aspectRatio");
  const currentResolution = form?.watch("resolution");

  const modelSelection = useMemo((): VideoGenModelSelection | undefined => {
    if (!currentModelId) {
      return undefined;
    }
    return {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: currentModelId,
    };
  }, [currentModelId]);

  const defaultModelSelection = useMemo(():
    | VideoGenModelSelection
    | undefined => {
    const m = getBestVideoGenModel(DEFAULT_VIDEO_GEN_MODEL_SELECTION, user);
    if (!m) {
      return undefined;
    }
    const modelId = objectValues(VideoGenModelId).includes(m.id)
      ? m.id
      : undefined;
    if (!modelId) {
      return undefined;
    }
    return { selectionType: ModelSelectionType.MANUAL, manualModelId: modelId };
  }, [user]);

  const resolvedModelId: VideoGenModelId | undefined =
    currentModelId ??
    (defaultModelSelection?.selectionType === ModelSelectionType.MANUAL
      ? defaultModelSelection.manualModelId
      : undefined);
  const resolvedModel = resolvedModelId
    ? getVideoGenModelById(resolvedModelId)
    : undefined;
  const resolvedVideoBased = resolvedModel;

  // Build dynamic duration presets from model capabilities
  const durationPresets = useMemo(
    () => buildDurationPresets(resolvedVideoBased?.supportedDurations),
    [resolvedVideoBased?.supportedDurations],
  );

  // Aspect ratio options from model capabilities - memoized to avoid stale deps in useEffect
  const aspectRatioOptions = useMemo(
    () => resolvedVideoBased?.supportedAspectRatios || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolvedModelId],
  );
  const resolutionOptions = useMemo(
    () => resolvedVideoBased?.supportedResolutions ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolvedModelId],
  );

  // When model changes, reset duration/aspectRatio/resolution to valid defaults
  useEffect(() => {
    if (!resolvedModel) {
      return;
    }
    const validDurations = durationPresets.map((p) => p.seconds);
    if (!validDurations.includes(currentDuration)) {
      form?.setValue("duration", validDurations[0] ?? 5);
    }
    if (
      aspectRatioOptions.length > 0 &&
      currentAspectRatio &&
      !aspectRatioOptions.includes(currentAspectRatio)
    ) {
      form?.setValue("aspectRatio", aspectRatioOptions[0]);
    }
    if (
      resolutionOptions.length > 0 &&
      currentResolution &&
      !resolutionOptions.includes(currentResolution)
    ) {
      form?.setValue("resolution", resolutionOptions[0]);
    }
  }, [
    resolvedModelId,
    durationPresets,
    aspectRatioOptions,
    resolutionOptions,
    currentDuration,
    currentAspectRatio,
    currentResolution,
    form,
    resolvedModel,
  ]);

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
          allowedRoles={["video-gen"]}
          modelSelection={modelSelection}
          onChange={(sel) => {
            if (
              sel !== null &&
              sel.selectionType === ModelSelectionType.MANUAL
            ) {
              const modelId = Object.values(VideoGenModelId).find(
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
          <VideoIcon className="h-3.5 w-3.5 text-primary" />
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
            disabled={isDisabled}
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
                disabled={isDisabled}
                onClick={() => appendStyle(style)}
              >
                {style}
              </Button>
            ))}
          </Div>
        </Div>

        {/* Duration presets - dynamic per model */}
        <Div className="flex flex-col gap-1.5">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("post.duration.label")}
          </Span>
          <Div className="flex gap-2">
            {durationPresets.map((preset) => (
              <Button
                key={preset.seconds}
                type="button"
                variant={
                  currentDuration === preset.seconds ? "default" : "outline"
                }
                size="sm"
                className="flex-1 h-auto py-2 flex flex-col gap-0.5"
                disabled={isDisabled}
                onClick={() => form?.setValue("duration", preset.seconds)}
              >
                <Span className="text-xs font-medium">{preset.label}</Span>
                <Span className="text-[10px] opacity-70">
                  {preset.sublabel}
                </Span>
              </Button>
            ))}
          </Div>
        </Div>

        {/* Aspect ratio - only shown when model supports multiple ratios */}
        {aspectRatioOptions.length > 1 && (
          <Div className="flex flex-col gap-1.5">
            <Span className="text-xs font-medium text-muted-foreground">
              {t("post.aspectRatio.label")}
            </Span>
            <Div className="flex flex-wrap gap-1.5">
              {aspectRatioOptions.map((ratio) => (
                <Button
                  key={ratio}
                  type="button"
                  variant={currentAspectRatio === ratio ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  disabled={isDisabled}
                  onClick={() => form?.setValue("aspectRatio", ratio)}
                >
                  {ratio}
                </Button>
              ))}
            </Div>
          </Div>
        )}

        {/* Resolution - only shown when model supports multiple resolutions */}
        {resolutionOptions.length > 1 && (
          <Div className="flex flex-col gap-1.5">
            <Span className="text-xs font-medium text-muted-foreground">
              {t("post.resolution.label")}
            </Span>
            <Div className="flex flex-wrap gap-1.5">
              {resolutionOptions.map((res) => (
                <Button
                  key={res}
                  type="button"
                  variant={currentResolution === res ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  disabled={isDisabled}
                  onClick={() => form?.setValue("resolution", res)}
                >
                  {res}
                </Button>
              ))}
            </Div>
          </Div>
        )}

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
            allowedRoles={["video-gen"]}
            defaultModelSelection={defaultModelSelection}
            placeholder={t("post.model.label")}
            onClick={isDisabled ? undefined : () => setShowModelSelector(true)}
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
              icon: "video",
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
            <Span className="text-xs text-muted-foreground/70">
              {t("post.generatingNote")}
            </Span>
          </Div>
        )}

        {/* Result */}
        {!isSubmitting && result?.videoUrl && (
          <Div className="flex flex-col gap-3">
            {/* Video player */}
            <Div className="relative rounded-xl overflow-hidden border bg-black group">
              <Video
                src={result.videoUrl}
                controls
                className="w-full max-h-[400px] object-contain"
              />
              {/* Download overlay */}
              <Div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink
                  href={result.videoUrl}
                  download="generated-video.mp4"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="gap-1.5 shadow-lg"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t("post.download")}
                  </Button>
                </ExternalLink>
              </Div>
            </Div>

            {/* Meta row */}
            <Div className="flex items-center gap-2 flex-wrap">
              {resolvedModel && (
                <Badge variant="secondary" className="text-[10px]">
                  {resolvedModel.name}
                </Badge>
              )}
              {result.durationSeconds !== undefined && (
                <Badge variant="outline" className="text-[10px]">
                  {result.durationSeconds}s
                </Badge>
              )}
              {currentAspectRatio && (
                <Badge variant="outline" className="text-[10px]">
                  {currentAspectRatio}
                </Badge>
              )}
              {currentResolution && (
                <Badge variant="outline" className="text-[10px]">
                  {currentResolution}
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
