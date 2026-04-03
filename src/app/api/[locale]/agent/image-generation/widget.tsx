"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Sparkles } from "next-vibe-ui/ui/icons/Sparkles";
import { Image } from "next-vibe-ui/ui/image";
import { ExternalLink } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { H3 } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import { ModelSelectionType } from "@/app/api/[locale]/agent/chat/skills/enum";
import { SkillsRepositoryClient } from "@/app/api/[locale]/agent/chat/skills/repository-client";
import { useEnvAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import { getImageGenModelById } from "@/app/api/[locale]/agent/image-generation/models";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/models/types";
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
import type { ImageGenerationPostResponseOutput } from "./definition";
import { ImageSize } from "./enum";
import { scopedTranslation } from "./i18n";
import { ImageGenModelId } from "./models";

interface CustomWidgetProps {
  field: {
    value: ImageGenerationPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

const SIZE_PRESETS = [
  {
    label: "Square",
    value: ImageSize.SQUARE_1024,
    aspect: "aspect-square",
    w: 1024,
    h: 1024,
  },
  {
    label: "Landscape",
    value: ImageSize.LANDSCAPE_1792,
    aspect: "aspect-video",
    w: 1792,
    h: 1024,
  },
  {
    label: "Portrait",
    value: ImageSize.PORTRAIT_1792,
    aspect: "aspect-[9/16]",
    w: 1024,
    h: 1792,
  },
] as const;

const QUALITY_OPTIONS = [
  { label: "Standard", value: "post.quality.standard" as const },
  { label: "HD", value: "post.quality.hd" as const },
] as const;

export function ImageGenerationContainer({
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
  const currentSize = form?.watch("size") ?? ImageSize.SQUARE_1024;
  const currentQuality = form?.watch("quality") ?? "post.quality.standard";

  const modelSelection = useMemo((): ImageGenModelSelection | undefined => {
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
    | ImageGenModelSelection
    | undefined => {
    const m = SkillsRepositoryClient.getBestImageGenModel(
      DEFAULT_IMAGE_GEN_MODEL_SELECTION,
      user,
      envAvailability,
    );
    if (!m) {
      return undefined;
    }
    const modelId = Object.values(ImageGenModelId).includes(m.id)
      ? m.id
      : undefined;
    if (!modelId) {
      return undefined;
    }
    return { selectionType: ModelSelectionType.MANUAL, manualModelId: modelId };
  }, [user, envAvailability]);

  const resolvedModelId =
    currentModelId ??
    (defaultModelSelection?.selectionType === ModelSelectionType.MANUAL
      ? Object.values(ImageGenModelId).includes(
          defaultModelSelection.manualModelId,
        )
        ? defaultModelSelection.manualModelId
        : undefined
      : undefined);
  const resolvedModel = resolvedModelId
    ? getImageGenModelById(resolvedModelId)
    : undefined;

  const activeSize =
    SIZE_PRESETS.find((p) => p.value === currentSize) ?? SIZE_PRESETS[0];

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
          allowedRoles={["image-gen"]}
          modelSelection={modelSelection}
          onChange={(sel) => {
            if (
              sel !== null &&
              sel.selectionType === ModelSelectionType.MANUAL
            ) {
              const selectedId = Object.values(ImageGenModelId).find(
                (id) => id === sel.manualModelId,
              );
              if (selectedId !== undefined) {
                form?.setValue("model", selectedId);
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
          <Sparkles className="h-3.5 w-3.5 text-primary" />
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
        </Div>

        {/* Size presets */}
        <Div className="flex flex-col gap-1.5">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("post.size.label")}
          </Span>
          <Div className="flex gap-2">
            {SIZE_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                type="button"
                variant={currentSize === preset.value ? "default" : "outline"}
                size="sm"
                className="flex-1 h-auto py-2 flex flex-col gap-1"
                onClick={() => form?.setValue("size", preset.value)}
              >
                <Div
                  className={`w-6 border-2 rounded-sm ${currentSize === preset.value ? "border-primary-foreground/70" : "border-current opacity-60"} ${preset.aspect}`}
                />
                <Span className="text-[10px]">{preset.label}</Span>
                <Span className="text-[9px] opacity-60">
                  {preset.w}
                  {t("post.dimensionSeparator")}
                  {preset.h}
                </Span>
              </Button>
            ))}
          </Div>
        </Div>

        {/* Quality + Model row */}
        <Div className="flex gap-3">
          {/* Quality toggle */}
          <Div className="flex flex-col gap-1.5 flex-1">
            <Span className="text-xs font-medium text-muted-foreground">
              {t("post.quality.label")}
            </Span>
            <Div className="flex gap-1.5">
              {QUALITY_OPTIONS.map((q) => (
                <Button
                  key={q.value}
                  type="button"
                  variant={currentQuality === q.value ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => form?.setValue("quality", q.value)}
                >
                  {q.label}
                </Button>
              ))}
            </Div>
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
            allowedRoles={["image-gen"]}
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
              icon: "sparkles",
              variant: "primary",
            }}
          />
        </Div>

        {/* Result */}
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

        {!isSubmitting && result?.imageUrl && (
          <Div className="flex flex-col gap-3">
            {/* Image preview */}
            <Div className="relative rounded-xl overflow-hidden border bg-muted/20 group">
              <Image
                src={result.imageUrl}
                alt={prompt}
                unoptimized
                width={activeSize?.w ?? 1024}
                height={activeSize?.h ?? 1024}
                className="w-full object-contain"
              />
              {/* Overlay actions */}
              <Div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end justify-end p-3 opacity-0 group-hover:opacity-100">
                <ExternalLink
                  href={result.imageUrl}
                  download="generated-image.png"
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
                <Badge variant="secondary" className="text-[10px] gap-1">
                  {resolvedModel.name}
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px]">
                {activeSize?.label ?? "Square"}
              </Badge>
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
