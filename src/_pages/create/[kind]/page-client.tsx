"use client";

import imageDefinitions from "next-vibe/agent/image-generation/definition";
import { ImageGenModelId } from "next-vibe/agent/image-generation/models";
import { isUncensoredContent } from "next-vibe/agent/models/uncensored-consent/constants";
import musicDefinitions from "next-vibe/agent/music-generation/definition";
import { MusicDuration } from "next-vibe/agent/music-generation/enum";
import {
  getMusicGenModelById,
  MusicGenModelId,
} from "next-vibe/agent/music-generation/models";
import { STT_AUTO_LANGUAGE } from "next-vibe/agent/speech-to-text/constants";
import sttDefinitions from "next-vibe/agent/speech-to-text/definition";
import { SttModelId } from "next-vibe/agent/speech-to-text/models";
import ttsDefinitions from "next-vibe/agent/text-to-speech/definition";
import { TtsModelId } from "next-vibe/agent/text-to-speech/models";
import videoDefinitions from "next-vibe/agent/video-generation/definition";
import { VideoGenModelId } from "next-vibe/agent/video-generation/models";
import { Div } from "next-vibe/ui/components/div";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { z } from "zod";

import {
  defaultSttModel,
  StudioMusic,
  StudioSpeech,
  StudioTranscribe,
} from "../_shared/audio-forms";
import { CommercialUseOverview } from "../_shared/commercial-use-overview";
import {
  CREATE_MODEL_PARAM,
  CREATE_SETTINGS_PARAM,
  parseSettingsParam,
} from "../_shared/create-kinds";
import { refreshStudioHistory, StudioHistory } from "../_shared/studio-history";
import { StudioShell } from "../_shared/studio-shell";
import { StudioImage, StudioVideo } from "../_shared/visual-forms";
import { scopedTranslation } from "../i18n";
import type { CreatePageData } from "./page";

function GenerationForm({
  locale,
  kind,
  models,
  platform,
  user,
}: CreatePageData): JSX.Element {
  const logger = useLogger();
  const search = useSearchParams();
  const settings = parseSettingsParam(search.get(CREATE_SETTINGS_PARAM));
  const requested =
    search.get(CREATE_MODEL_PARAM[kind]) ??
    (typeof settings?.[CREATE_MODEL_PARAM[kind]] === "string"
      ? String(settings[CREATE_MODEL_PARAM[kind]])
      : null);
  const model =
    models.find((m) => m.id === requested) ??
    models.find((m) => !m.requiresImage && !isUncensoredContent(m.content)) ??
    models[0];
  if (!model) {
    return (
      <Div className="p-5">
        {scopedTranslation.scopedT(locale).t("unavailable")}
      </Div>
    );
  }
  const props = { logger, locale, platform, user };
  const refresh = (): void => {
    refreshStudioHistory(logger, kind);
    refreshStudioHistory(logger, undefined);
  };
  const mutationOptions = { onSuccess: refresh, onError: refresh };
  const prompt =
    typeof settings?.prompt === "string" ? settings.prompt : undefined;
  /** Presets only count with a model this visitor can use. */
  const canUse = (id: string | undefined): boolean =>
    models.some((m) => m.id === id);
  switch (kind) {
    case "image": {
      const id = z.enum(ImageGenModelId).parse(model.id);
      const parsed = settings
        ? imageDefinitions.POST.requestSchema.safeParse({
            model: id,
            ...settings,
          })
        : undefined;
      const preset =
        parsed?.success && canUse(parsed.data.model) ? parsed.data : undefined;
      return (
        <EndpointsPage
          {...props}
          endpoint={imageDefinitions}
          widget={<StudioImage models={models} />}
          endpointOptions={{
            create: {
              formOptions: { persistForm: false },
              initialState: preset
                ? { ...preset, saveToStudio: true }
                : { model: id, prompt, saveToStudio: true },
              mutationOptions,
            },
          }}
        />
      );
    }
    case "video": {
      const id = z.enum(VideoGenModelId).parse(model.id);
      const parsed = settings
        ? videoDefinitions.POST.requestSchema.safeParse({
            model: id,
            ...settings,
          })
        : undefined;
      const preset =
        parsed?.success && canUse(parsed.data.model) ? parsed.data : undefined;
      return (
        <EndpointsPage
          {...props}
          endpoint={videoDefinitions}
          widget={<StudioVideo models={models} />}
          endpointOptions={{
            create: {
              formOptions: { persistForm: false },
              initialState: preset
                ? { ...preset, saveToStudio: true }
                : { model: id, prompt, saveToStudio: true },
              mutationOptions,
            },
          }}
        />
      );
    }
    case "music": {
      const id = z.enum(MusicGenModelId).parse(model.id);
      const route = getMusicGenModelById(id);
      const duration =
        Object.values(MusicDuration).find((v) =>
          route?.supportedDurations?.includes(v),
        ) ?? MusicDuration.SHORT;
      const parsed = settings
        ? musicDefinitions.POST.requestSchema.safeParse({
            model: id,
            duration,
            ...settings,
          })
        : undefined;
      const preset =
        parsed?.success && canUse(parsed.data.model) ? parsed.data : undefined;
      return (
        <EndpointsPage
          {...props}
          endpoint={musicDefinitions}
          widget={<StudioMusic models={models} />}
          endpointOptions={{
            create: {
              formOptions: { persistForm: false },
              initialState: preset
                ? { ...preset, saveToStudio: true }
                : { model: id, duration, prompt, saveToStudio: true },
              mutationOptions,
            },
          }}
        />
      );
    }
    case "speech": {
      const id = z.enum(TtsModelId).parse(model.id);
      const text =
        typeof settings?.text === "string" ? settings.text : undefined;
      return (
        <EndpointsPage
          {...props}
          endpoint={ttsDefinitions}
          widget={<StudioSpeech models={models} />}
          endpointOptions={{
            create: {
              formOptions: { persistForm: false },
              initialState: { voiceId: id, text, saveToStudio: true },
              mutationOptions,
            },
          }}
        />
      );
    }
    case "transcribe": {
      const language =
        typeof settings?.language === "string"
          ? settings.language
          : STT_AUTO_LANGUAGE;
      const id = z
        .enum(SttModelId)
        .parse(
          (requested && models.some((m) => m.id === requested)
            ? model
            : (defaultSttModel(models, language) ?? model)
          ).id,
        );
      return (
        <EndpointsPage
          {...props}
          endpoint={sttDefinitions}
          widget={<StudioTranscribe models={models} />}
          endpointOptions={{
            create: {
              formOptions: { persistForm: false },
              initialState: { modelId: id, language, saveToStudio: true },
              mutationOptions,
            },
          }}
        />
      );
    }
  }
}

export function CreatePageClient(data: CreatePageData): JSX.Element {
  // A new "Run again" preset remounts the form with those values.
  const preset = useSearchParams().get(CREATE_SETTINGS_PARAM) ?? "";
  return (
    <StudioShell locale={data.locale} kind={data.kind}>
      <Div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-6">
        <Div className="min-w-0 rounded-2xl border bg-card shadow-sm lg:sticky lg:top-20">
          <GenerationForm key={`${data.kind}:${preset}`} {...data} />
        </Div>
        <Div className="min-w-0 rounded-2xl border bg-card p-4 sm:p-6">
          <StudioHistory
            locale={data.locale}
            user={data.user}
            platform={data.platform}
            kind={data.kind}
            initialData={data.history}
          />
        </Div>
      </Div>
      <CommercialUseOverview
        locale={data.locale}
        rows={data.commercialUse}
        className="mt-10 sm:mt-12"
      />
    </StudioShell>
  );
}
