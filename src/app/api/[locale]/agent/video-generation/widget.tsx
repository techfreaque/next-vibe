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
import { useMemo, useState } from "react";

import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import {
  getDefaultModelForRole,
  getModelById,
} from "@/app/api/[locale]/agent/models/models";
import type {
  ManualModelSelection,
  ModelSelectionSimple,
} from "@/app/api/[locale]/agent/models/types";
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
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { VideoGenerationPostResponseOutput } from "./definition";
import type { VideoGenModelId } from "./enum";
import { VIDEO_GEN_MODEL_IDS, VideoDuration } from "./enum";
import { scopedTranslation } from "./i18n";

interface CustomWidgetProps {
  field: {
    value: VideoGenerationPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

const DURATION_PRESETS = [
  { label: "Short", sublabel: "~5s", value: VideoDuration.SHORT },
  { label: "Medium", sublabel: "~10s", value: VideoDuration.MEDIUM },
  { label: "Long", sublabel: "~15s", value: VideoDuration.LONG },
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

export function VideoGenerationContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const isSubmitting = useWidgetIsSubmitting();
  const form = useWidgetForm<typeof definition.POST>();
  const result = field.value;
  const children = field.children;
  const prompt = form?.watch("prompt") ?? "";
  const envAvailability = useEnvAvailability();
  const user = useWidgetUser();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const [showModelSelector, setShowModelSelector] = useState(false);

  const currentModelId = form?.watch("model");
  const currentDuration = form?.watch("duration") ?? VideoDuration.SHORT;

  const modelSelection = useMemo((): ModelSelectionSimple | undefined => {
    // model is patched from stream context into request args (streamContextPatch)
    if (!currentModelId) {
      return undefined;
    }
    return {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: currentModelId,
    };
  }, [currentModelId]);

  const defaultModelSelection = useMemo(():
    | ModelSelectionSimple
    | undefined => {
    const m = getDefaultModelForRole(["video-gen"], envAvailability);
    if (!m) {
      return undefined;
    }
    return { selectionType: ModelSelectionType.MANUAL, manualModelId: m.id };
  }, [envAvailability]);

  const resolvedModelId =
    currentModelId ??
    (defaultModelSelection?.selectionType === ModelSelectionType.MANUAL
      ? defaultModelSelection.manualModelId
      : undefined);
  const effectiveModelId =
    resolvedModelId !== undefined &&
    VIDEO_GEN_MODEL_IDS.includes(resolvedModelId)
      ? resolvedModelId
      : resolvedModelId;
  const resolvedModel = effectiveModelId
    ? getModelById(effectiveModelId)
    : undefined;

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
              form?.setValue(
                "model",
                (sel as ManualModelSelection).manualModelId as VideoGenModelId,
              );
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
            {DURATION_PRESETS.map((preset) => (
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
            {effectiveModelId && (
              <ModelCreditDisplay
                modelId={effectiveModelId}
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
