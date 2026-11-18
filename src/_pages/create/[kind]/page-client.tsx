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
import sttDefinitions from "next-vibe/agent/speech-to-text/definition";
import { SttModelId } from "next-vibe/agent/speech-to-text/models";
import ttsDefinitions from "next-vibe/agent/text-to-speech/definition";
import { TtsModelId } from "next-vibe/agent/text-to-speech/models";
import videoDefinitions from "next-vibe/agent/video-generation/definition";
import { VideoGenModelId } from "next-vibe/agent/video-generation/models";
import { Div } from "next-vibe/ui/components/div";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useRouter, useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { z } from "zod";

import {
  StudioMusic,
  StudioSpeech,
  StudioTranscribe,
} from "../_shared/audio-forms";
import { CREATE_MODEL_PARAM } from "../_shared/create-kinds";
import { StudioGallery } from "../_shared/studio-gallery";
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
  const router = useRouter();
  const requested = useSearchParams().get(CREATE_MODEL_PARAM[kind]);
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
    void router.refresh();
  };
  const mutationOptions = { onSuccess: refresh, onError: refresh };
  switch (kind) {
    case "image": {
      const id = z.enum(ImageGenModelId).parse(model.id);
      return (
        <EndpointsPage
          {...props}
          endpoint={imageDefinitions}
          widget={<StudioImage models={models} />}
          endpointOptions={{
            create: {
              formOptions: { persistForm: false },
              initialState: { model: id, saveToStudio: true },
              mutationOptions,
            },
          }}
        />
      );
    }
    case "video": {
      const id = z.enum(VideoGenModelId).parse(model.id);
      return (
        <EndpointsPage
          {...props}
          endpoint={videoDefinitions}
          widget={<StudioVideo models={models} />}
          endpointOptions={{
            create: {
              formOptions: { persistForm: false },
              initialState: { model: id, saveToStudio: true },
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
      return (
        <EndpointsPage
          {...props}
          endpoint={musicDefinitions}
          widget={<StudioMusic models={models} />}
          endpointOptions={{
            create: {
              formOptions: { persistForm: false },
              initialState: { model: id, duration, saveToStudio: true },
              mutationOptions,
            },
          }}
        />
      );
    }
    case "speech": {
      const id = z.enum(TtsModelId).parse(model.id);
      return (
        <EndpointsPage
          {...props}
          endpoint={ttsDefinitions}
          widget={<StudioSpeech models={models} />}
          endpointOptions={{
            create: {
              formOptions: { persistForm: false },
              initialState: { voiceId: id, saveToStudio: true },
              mutationOptions,
            },
          }}
        />
      );
    }
    case "transcribe": {
      const id = z.enum(SttModelId).parse(model.id);
      return (
        <EndpointsPage
          {...props}
          endpoint={sttDefinitions}
          widget={<StudioTranscribe models={models} />}
          endpointOptions={{
            create: {
              formOptions: { persistForm: false },
              initialState: { modelId: id, saveToStudio: true },
              mutationOptions,
            },
          }}
        />
      );
    }
  }
}

export function CreatePageClient(data: CreatePageData): JSX.Element {
  return (
    <StudioShell locale={data.locale} kind={data.kind}>
      <Div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-6">
        <Div className="min-w-0 rounded-2xl border bg-card shadow-sm">
          <GenerationForm key={data.kind} {...data} />
        </Div>
        <StudioGallery
          locale={data.locale}
          kind={data.kind}
          history={data.history}
        />
      </Div>
    </StudioShell>
  );
}
