"use client";

import { StudioMedia } from "next-vibe/agent/media-studio/history/widget";
import {
  ApiProvider,
  calculateSttCreditCost,
  calculateTtsCreditCost,
} from "next-vibe/agent/models/models";
import musicDefinitions from "next-vibe/agent/music-generation/definition";
import {
  MUSIC_DURATION_SECONDS,
  MusicDuration,
} from "next-vibe/agent/music-generation/enum";
import {
  getMusicGenModelById,
  MusicGenModelId,
} from "next-vibe/agent/music-generation/models";
import {
  STT_AUTO_LANGUAGE,
  STT_LANGUAGES,
  STT_MULTILINGUAL_MODEL_IDS,
} from "next-vibe/agent/speech-to-text/constants";
import type sttDefinitions from "next-vibe/agent/speech-to-text/definition";
import { SttModelId } from "next-vibe/agent/speech-to-text/models";
import ttsDefinitions from "next-vibe/agent/text-to-speech/definition";
import { TtsModelId } from "next-vibe/agent/text-to-speech/models";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { Div } from "next-vibe/ui/components/div";
import { Input } from "next-vibe/ui/components/input";
import { Label } from "next-vibe/ui/components/label";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { type JSX, useEffect, useId, useState } from "react";
import { useWatch } from "react-hook-form";

import { scopedTranslation } from "../i18n";
import { StudioForm, StudioSelect } from "./studio-form";
import type { StudioModel } from "./studio-types";

const dirty = { shouldDirty: true };

/**
 * Default transcription model for a spoken language: the cheapest one for
 * English, a strong multilingual one for anything else or auto-detect
 * (small cheap models mangle e.g. Portuguese).
 */
export function defaultSttModel(
  models: StudioModel[],
  language: string | undefined,
): StudioModel | undefined {
  const usable = models.filter((m) => !m.requiresImage);
  if (language === "en") {
    return usable[0];
  }
  return (
    STT_MULTILINGUAL_MODEL_IDS.map((id) =>
      usable.find((m) => m.id === id),
    ).find((m) => m !== undefined) ?? usable[0]
  );
}

export function StudioMusic({
  models,
}: {
  models: StudioModel[];
}): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const form = useWidgetForm<typeof musicDefinitions.POST>();
  const result = useWidgetValue<typeof musicDefinitions.POST>();
  const id = useWatch({ control: form?.control, name: "model" });
  const route = id ? getMusicGenModelById(id) : undefined;
  const model = models.find((m) => m.id === id);
  const duration =
    useWatch({ control: form?.control, name: "duration" }) ??
    MusicDuration.SHORT;
  const prompt = useWatch({ control: form?.control, name: "prompt" }) ?? "";
  const ref = useWatch({ control: form?.control, name: "inputMediaUrl" });
  const refId = useId();
  const durations = Object.values(MusicDuration).filter(
    (v) =>
      !route?.supportedDurations?.length ||
      route.supportedDurations.includes(v) ||
      route.supportedDurations.includes(String(MUSIC_DURATION_SECONDS[v])),
  );
  return (
    <StudioForm
      kind="music"
      models={models}
      model={model}
      cost={model?.rate}
      ready={!!prompt.trim()}
      onModel={(value) => {
        const next = Object.values(MusicGenModelId).find((v) => v === value);
        if (!next) {
          return;
        }
        const option = getMusicGenModelById(next);
        form?.setValue("model", next, dirty);
        form?.setValue(
          "duration",
          Object.values(MusicDuration).find((v) =>
            option?.supportedDurations?.includes(v),
          ) ?? MusicDuration.SHORT,
          dirty,
        );
        form?.setValue("inputMediaUrl", undefined, dirty);
      }}
      result={
        <StudioMedia
          kind="music"
          url={result?.audioUrl}
          title={prompt}
          model={id}
        />
      }
    >
      <TextareaFieldWidget
        fieldName="prompt"
        field={{ ...musicDefinitions.POST.fields.children.prompt, rows: 4 }}
      />
      {route?.apiProvider !== ApiProvider.OPENROUTER && (
        <StudioSelect
          label={t("duration")}
          value={durations.includes(duration) ? duration : durations[0]}
          options={durations.map((v) => ({
            value: v,
            label: `${String(MUSIC_DURATION_SECONDS[v])} s`,
          }))}
          onChange={(v) => form?.setValue("duration", v, dirty)}
        />
      )}
      {route?.inputs.includes("audio") && (
        <Div className="flex flex-col gap-2">
          <Label htmlFor={refId}>{t("referenceAudio")}</Label>
          <Input
            id={refId}
            type="url"
            placeholder="https://"
            value={ref ?? ""}
            onChangeText={(v) =>
              form?.setValue("inputMediaUrl", v || undefined, dirty)
            }
          />
        </Div>
      )}
    </StudioForm>
  );
}

export function StudioSpeech({
  models,
}: {
  models: StudioModel[];
}): JSX.Element {
  const form = useWidgetForm<typeof ttsDefinitions.POST>();
  const result = useWidgetValue<typeof ttsDefinitions.POST>();
  const id = useWatch({ control: form?.control, name: "voiceId" });
  const model = models.find((m) => m.id === id);
  const text = useWatch({ control: form?.control, name: "text" }) ?? "";
  return (
    <StudioForm
      kind="speech"
      models={models}
      model={model}
      cost={
        model && text.trim()
          ? calculateTtsCreditCost(
              { creditCostPerCharacter: model.providerRate },
              text.length,
            )
          : undefined
      }
      ready={!!text.trim()}
      onModel={(value) => {
        const next = Object.values(TtsModelId).find((v) => v === value);
        if (next) {
          form?.setValue("voiceId", next, dirty);
        }
      }}
      result={
        <StudioMedia
          kind="speech"
          title={text}
          url={result?.audioUrl}
          model={id}
        />
      }
    >
      <TextareaFieldWidget
        fieldName="text"
        field={{ ...ttsDefinitions.POST.fields.children.text, rows: 6 }}
      />
    </StudioForm>
  );
}

export function StudioTranscribe({
  models,
}: {
  models: StudioModel[];
}): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const form = useWidgetForm<typeof sttDefinitions.POST>();
  const result = useWidgetValue<typeof sttDefinitions.POST>();
  const id = useWatch({ control: form?.control, name: "modelId" });
  const model = models.find((m) => m.id === id);
  const file = useWatch({
    control: form?.control,
    name: "fileUpload.files",
  })?.[0];
  const language =
    useWatch({ control: form?.control, name: "language" }) ?? STT_AUTO_LANGUAGE;
  const names = new Intl.DisplayNames([getLanguageFromLocale(locale)], {
    type: "language",
  });
  // Until the visitor picks a model, it follows the spoken language.
  const [modelPicked, setModelPicked] = useState(false);
  const languageOptions = [
    { value: STT_AUTO_LANGUAGE, label: t("languageAuto") },
    ...STT_LANGUAGES.map((code) => ({
      value: code,
      label: names.of(code) ?? code,
    })).toSorted((a, b) => a.label.localeCompare(b.label, locale)),
  ];
  const fileId = useId();
  const durationId = useId();
  const [duration, setDuration] = useState<number>();
  const [needsDuration, setNeedsDuration] = useState(false);
  useEffect(() => {
    if (!file || typeof Audio === "undefined") {
      return;
    }
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = "metadata";
    const onMetadata = (): void => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      } else {
        setNeedsDuration(true);
      }
    };
    const onError = (): void => setNeedsDuration(true);
    audio.addEventListener("loadedmetadata", onMetadata);
    audio.addEventListener("error", onError);
    const timer = setTimeout(() => {
      if (!Number.isFinite(audio.duration)) {
        setNeedsDuration(true);
      }
    }, 4000);
    audio.src = url;
    return (): void => {
      clearTimeout(timer);
      audio.removeEventListener("loadedmetadata", onMetadata);
      audio.removeEventListener("error", onError);
      audio.removeAttribute("src");
      audio.load();
      URL.revokeObjectURL(url);
    };
  }, [file]);
  return (
    <StudioForm
      kind="transcribe"
      models={models}
      model={model}
      cost={
        duration && model
          ? calculateSttCreditCost(
              { creditCostPerSecond: model.providerRate },
              duration,
            )
          : undefined
      }
      ready={!!file && !!duration}
      onModel={(value) => {
        const next = Object.values(SttModelId).find((v) => v === value);
        if (next) {
          setModelPicked(true);
          form?.setValue("modelId", next, dirty);
        }
      }}
      result={
        <StudioMedia
          kind="transcribe"
          transcript={result?.response?.text}
          title={file?.name ?? ""}
        />
      }
    >
      <Div className="flex flex-col gap-2">
        <Label htmlFor={fileId}>{t("file")}</Label>
        <Input
          id={fileId}
          type="file"
          accept="audio/*,video/webm,video/ogg"
          className="h-auto min-h-20 rounded-xl border-dashed bg-muted/30 px-3 py-6 file:mr-3 file:rounded-md file:bg-secondary file:px-2 file:py-1"
          onChange={(event) => {
            setDuration(undefined);
            setNeedsDuration(false);
            form?.setValue(
              "fileUpload.files",
              [...(event.target.files ?? [])],
              { ...dirty, shouldValidate: true },
            );
          }}
        />
      </Div>
      <StudioSelect
        label={t("language")}
        value={language}
        options={languageOptions}
        onChange={(v) => {
          form?.setValue("language", v, dirty);
          const next = modelPicked ? undefined : defaultSttModel(models, v);
          const nextId = Object.values(SttModelId).find(
            (value) => value === next?.id,
          );
          if (nextId) {
            form?.setValue("modelId", nextId, dirty);
          }
        }}
      />
      {file && needsDuration && (
        <Div className="flex flex-col gap-2">
          <Label htmlFor={durationId}>{t("durationSeconds")}</Label>
          <Input
            id={durationId}
            type="number"
            min={1}
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value > 0 ? e.target.value : undefined)
            }
          />
        </Div>
      )}
    </StudioForm>
  );
}
