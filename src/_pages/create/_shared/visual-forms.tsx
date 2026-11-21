"use client";

import {
  aspectRatioToImageSize,
  IMAGE_ASPECT_RATIOS,
} from "next-vibe/agent/image-generation/aspect-ratio";
import imageDefinitions from "next-vibe/agent/image-generation/definition";
import { ImageQuality, ImageSize } from "next-vibe/agent/image-generation/enum";
import { scopedTranslation as imageTranslation } from "next-vibe/agent/image-generation/i18n";
import {
  getImageGenModelById,
  ImageGenModelId,
} from "next-vibe/agent/image-generation/models";
import { calculateImageCreditCost } from "next-vibe/agent/image-generation/pricing";
import { StudioMedia } from "next-vibe/agent/media-studio/history/widget";
import videoDefinitions from "next-vibe/agent/video-generation/definition";
import { scopedTranslation as videoTranslation } from "next-vibe/agent/video-generation/i18n";
import {
  getVideoGenModelById,
  resolveVideoClipSeconds,
  videoClipCredits,
  VideoGenModelId,
} from "next-vibe/agent/video-generation/models";
import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import { Summary } from "next-vibe/ui/components/summary";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { type JSX, useId } from "react";
import { useWatch } from "react-hook-form";

import { scopedTranslation } from "../i18n";
import { StudioForm, StudioSelect } from "./studio-form";
import type { StudioModel } from "./studio-types";

const dirty = { shouldDirty: true };
const videoRatios = [...IMAGE_ASPECT_RATIOS, "9:21"] as const;
const asOption = <T extends string>(value: T): { value: T; label: string } => ({
  value,
  label: value,
});

function ReferenceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}): JSX.Element {
  const id = useId();
  return (
    <Div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="url"
        placeholder="https://"
        value={value ?? ""}
        onChangeText={onChange}
        className="min-h-11"
      />
    </Div>
  );
}

export function StudioImage({
  models,
}: {
  models: StudioModel[];
}): JSX.Element {
  const form = useWidgetForm<typeof imageDefinitions.POST>();
  const locale = useWidgetLocale();
  const result = useWidgetValue<typeof imageDefinitions.POST>();
  const { t } = scopedTranslation.scopedT(locale);
  const { t: imageT } = imageTranslation.scopedT(locale);
  const id = useWatch({ control: form?.control, name: "model" });
  const model = models.find((item) => item.id === id);
  const route = id ? getImageGenModelById(id) : undefined;
  const fixed = route?.creditCostPerImage !== undefined ? route : undefined;
  const size =
    useWatch({ control: form?.control, name: "size" }) ?? ImageSize.SQUARE_1024;
  const quality =
    useWatch({ control: form?.control, name: "quality" }) ??
    ImageQuality.STANDARD;
  const aspect = useWatch({ control: form?.control, name: "aspectRatio" });
  const prompt = useWatch({ control: form?.control, name: "prompt" }) ?? "";
  const ref = useWatch({ control: form?.control, name: "inputMediaUrl" });
  const ratios = IMAGE_ASPECT_RATIOS.filter(
    (item) =>
      !fixed?.supportedAspectRatios ||
      fixed.supportedAspectRatios.includes(item),
  );
  const sizes = Object.values(ImageSize).filter(
    (item) => !fixed?.supportedSizes || fixed.supportedSizes.includes(item),
  );
  const qualities = Object.values(ImageQuality).filter((item) =>
    fixed?.supportedQualities?.includes(item),
  );
  return (
    <StudioForm
      kind="image"
      models={models}
      model={model}
      cost={
        fixed
          ? calculateImageCreditCost(
              fixed,
              aspect && size === ImageSize.SQUARE_1024
                ? aspectRatioToImageSize(aspect, fixed.supportedSizes)
                : size,
              quality,
            )
          : model?.rate
      }
      ready={!!prompt.trim() && (!model?.requiresImage || !!ref)}
      onModel={(value) => {
        const next = Object.values(ImageGenModelId).find(
          (item) => item === value,
        );
        if (!next) {
          return;
        }
        const option = getImageGenModelById(next);
        form?.setValue("model", next, dirty);
        const selectedSize = Object.values(ImageSize).find(
          (s) =>
            option?.creditCostPerImage !== undefined &&
            option.supportedSizes?.includes(s),
        );
        form?.setValue("size", selectedSize ?? ImageSize.SQUARE_1024, dirty);
        form?.setValue("quality", ImageQuality.STANDARD, dirty);
        form?.setValue("aspectRatio", undefined, dirty);
        if (!option?.inputs.includes("image")) {
          form?.setValue("inputMediaUrl", undefined, dirty);
        }
      }}
      result={
        <StudioMedia kind="image" url={result?.imageUrl} title={prompt} />
      }
    >
      <TextareaFieldWidget
        fieldName="prompt"
        field={{ ...imageDefinitions.POST.fields.children.prompt, rows: 4 }}
      />
      {route?.inputs.includes("image") && (
        <ReferenceInput
          label={t("reference")}
          value={ref}
          onChange={(url) =>
            form?.setValue("inputMediaUrl", url || undefined, dirty)
          }
        />
      )}
      <Div className="grid gap-4 sm:grid-cols-2">
        {sizes.length > 0 && (
          <StudioSelect
            label={t("size")}
            value={size}
            options={sizes.map((v) => ({ value: v, label: imageT(v) }))}
            onChange={(v) => {
              form?.setValue("size", v, dirty);
              form?.setValue("aspectRatio", undefined, dirty);
            }}
          />
        )}
        <StudioSelect
          label={t("ratio")}
          value={
            aspect ??
            (size === ImageSize.PORTRAIT_1792
              ? "9:16"
              : size === ImageSize.LANDSCAPE_1792
                ? "16:9"
                : "1:1")
          }
          options={ratios.map(asOption)}
          onChange={(v) => {
            form?.setValue("aspectRatio", v, dirty);
            form?.setValue(
              "size",
              aspectRatioToImageSize(v, fixed?.supportedSizes),
              dirty,
            );
          }}
        />
        <StudioSelect
          label={t("quality")}
          value={quality}
          options={qualities.map((v) => ({ value: v, label: imageT(v) }))}
          onChange={(v) => form?.setValue("quality", v, dirty)}
        />
      </Div>
    </StudioForm>
  );
}

export function StudioVideo({
  models,
}: {
  models: StudioModel[];
}): JSX.Element {
  const form = useWidgetForm<typeof videoDefinitions.POST>();
  const result = useWidgetValue<typeof videoDefinitions.POST>();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const id = useWatch({ control: form?.control, name: "model" });
  const model = models.find((m) => m.id === id);
  const route = id ? getVideoGenModelById(id) : undefined;
  const requested =
    useWatch({ control: form?.control, name: "duration" }) ??
    route?.defaultDurationSeconds ??
    5;
  const seconds = route ? resolveVideoClipSeconds(route, requested) : requested;
  const durationOptions = [
    ...new Set(
      (route?.supportedDurations?.length
        ? route.supportedDurations.map(Number)
        : [seconds, 5, 10, 15]
      ).map((s) => (route ? resolveVideoClipSeconds(route, s) : s)),
    ),
  ].toSorted((a, b) => a - b);
  const resolution = useWatch({ control: form?.control, name: "resolution" });
  const ratio = useWatch({ control: form?.control, name: "aspectRatio" });
  const ratios = videoRatios.filter(
    (v) =>
      !route?.supportedAspectRatios || route.supportedAspectRatios.includes(v),
  );
  const prompt = useWatch({ control: form?.control, name: "prompt" }) ?? "";
  const frames =
    useWatch({ control: form?.control, name: "frameReferences" }) ?? [];
  const updateFrame = (role: "first" | "last", url: string): void => {
    const next = frames.filter((frame) => frame.role !== role);
    if (url) {
      next.push({ role, url });
    }
    form?.setValue("frameReferences", next.length ? next : undefined, dirty);
  };
  const negativePrompt = route?.allowedPassthroughParameters?.some(
    (param) => param === "negativePrompt" || param === "negative_prompt",
  );
  const optionalFirstFrame =
    !model?.requiresImage && route?.inputs.includes("image");
  const lastFrame = route?.supportedFrameImages?.includes("last_frame");
  return (
    <StudioForm
      kind="video"
      models={models}
      model={model}
      cost={route ? videoClipCredits(route, seconds, resolution) : undefined}
      ready={!!prompt.trim() && (!model?.requiresImage || frames.length > 0)}
      onModel={(value) => {
        const next = Object.values(VideoGenModelId).find((v) => v === value);
        if (!next) {
          return;
        }
        form?.setValue("model", next, dirty);
        const option = getVideoGenModelById(next);
        form?.setValue(
          "duration",
          option ? resolveVideoClipSeconds(option, requested) : 5,
          dirty,
        );
        form?.setValue("aspectRatio", undefined, dirty);
        form?.setValue("resolution", undefined, dirty);
        form?.setValue("frameReferences", undefined, dirty);
        form?.setValue("negativePrompt", undefined, dirty);
      }}
      result={
        <StudioMedia kind="video" url={result?.videoUrl} title={prompt} />
      }
    >
      <TextareaFieldWidget
        fieldName="prompt"
        field={{ ...videoDefinitions.POST.fields.children.prompt, rows: 4 }}
      />
      {model?.requiresImage ? (
        <ReferenceInput
          label={t("reference")}
          value={frames.find((f) => f.role === "first")?.url}
          onChange={(url) => updateFrame("first", url)}
        />
      ) : null}
      <Div className="grid grid-cols-3 gap-2 sm:gap-4">
        <StudioSelect
          label={t("duration")}
          value={String(seconds)}
          options={durationOptions.map((s) => ({
            value: String(s),
            label: `${String(s)} s`,
          }))}
          onChange={(v) => form?.setValue("duration", Number(v), dirty)}
        />
        <StudioSelect
          label={t("ratio")}
          value={ratio}
          options={ratios.map(asOption)}
          onChange={(v) => form?.setValue("aspectRatio", v, dirty)}
        />
        <StudioSelect
          label={videoTranslation.scopedT(locale).t("post.resolution.label")}
          value={resolution}
          options={(route?.supportedResolutions ?? []).map(asOption)}
          onChange={(v) => form?.setValue("resolution", v, dirty)}
        />
      </Div>
      {(optionalFirstFrame || lastFrame || negativePrompt) && (
        <Details className="rounded-lg border px-3">
          <Summary className="cursor-pointer py-3 text-sm font-medium">
            {t("moreOptions")}
          </Summary>
          <Div className="grid gap-4 pb-3">
            {optionalFirstFrame && (
              <ReferenceInput
                label={t("reference")}
                value={frames.find((f) => f.role === "first")?.url}
                onChange={(url) => updateFrame("first", url)}
              />
            )}
            {lastFrame && (
              <ReferenceInput
                label={t("lastFrame")}
                value={frames.find((f) => f.role === "last")?.url}
                onChange={(url) => updateFrame("last", url)}
              />
            )}
            {negativePrompt && (
              <TextareaFieldWidget
                fieldName="negativePrompt"
                field={videoDefinitions.POST.fields.children.negativePrompt}
              />
            )}
          </Div>
        </Details>
      )}
    </StudioForm>
  );
}
