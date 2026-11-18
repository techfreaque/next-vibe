"use client";

import imageDefinitions from "next-vibe/agent/image-generation/definition";
import { ImageGenModelId } from "next-vibe/agent/image-generation/models";
import { ImageGenerationContainer } from "next-vibe/agent/image-generation/widget";
import musicDefinitions from "next-vibe/agent/music-generation/definition";
import { MusicGenModelId } from "next-vibe/agent/music-generation/models";
import sttDefinitions from "next-vibe/agent/speech-to-text/definition";
import { SttModelId } from "next-vibe/agent/speech-to-text/models";
import ttsDefinitions from "next-vibe/agent/text-to-speech/definition";
import { TtsModelId } from "next-vibe/agent/text-to-speech/models";
import videoDefinitions from "next-vibe/agent/video-generation/definition";
import { VideoGenModelId } from "next-vibe/agent/video-generation/models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ArrowLeft } from "next-vibe/ui/components/icons/ArrowLeft";
import { MessageSquare } from "next-vibe/ui/components/icons/MessageSquare";
import { Link } from "next-vibe/ui/components/link";
import { Nav } from "next-vibe/ui/components/nav";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import { useSearchParams } from "next-vibe/ui/hooks/use-navigation";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/web/EndpointsPage";
import type { JSX } from "react";
import { useState } from "react";
import { z } from "zod";

import {
  CREATE_KINDS,
  CREATE_MODEL_PARAM,
  createHref,
  type CreateKind,
} from "../_shared/create-kinds";
import { scopedTranslation } from "../i18n";

export interface CreatePageClientProps {
  locale: CountryLanguage;
  kind: CreateKind;
  user: JwtPayloadType;
  platform: Platform;
}

interface FormProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
  platform: Platform;
  /** Raw ?model= / ?voiceId= / ?modelId= value, validated per kind. */
  requested: string | null;
}

function ImageForm({
  locale,
  user,
  platform,
  requested,
}: FormProps): JSX.Element {
  const logger = useLogger();
  const parsed = z.enum(ImageGenModelId).safeParse(requested);
  return (
    <EndpointsPage
      logger={logger}
      endpoint={imageDefinitions}
      widget={<ImageGenerationContainer field={imageDefinitions.POST.fields} />}
      user={user}
      locale={locale}
      platform={platform}
      endpointOptions={{
        create: {
          initialState: parsed.success ? { model: parsed.data } : undefined,
        },
      }}
    />
  );
}

function VideoForm({
  locale,
  user,
  platform,
  requested,
}: FormProps): JSX.Element {
  const logger = useLogger();
  const parsed = z.enum(VideoGenModelId).safeParse(requested);
  return (
    <EndpointsPage
      logger={logger}
      endpoint={videoDefinitions}
      user={user}
      locale={locale}
      platform={platform}
      endpointOptions={{
        create: {
          initialState: parsed.success ? { model: parsed.data } : undefined,
        },
      }}
    />
  );
}

function MusicForm({
  locale,
  user,
  platform,
  requested,
}: FormProps): JSX.Element {
  const logger = useLogger();
  const parsed = z.enum(MusicGenModelId).safeParse(requested);
  return (
    <EndpointsPage
      logger={logger}
      endpoint={musicDefinitions}
      user={user}
      locale={locale}
      platform={platform}
      endpointOptions={{
        create: {
          initialState: parsed.success ? { model: parsed.data } : undefined,
        },
      }}
    />
  );
}

function SpeechForm({
  locale,
  user,
  platform,
  requested,
}: FormProps): JSX.Element {
  const logger = useLogger();
  const parsed = z.enum(TtsModelId).safeParse(requested);
  return (
    <EndpointsPage
      logger={logger}
      endpoint={ttsDefinitions}
      user={user}
      locale={locale}
      platform={platform}
      endpointOptions={{
        create: {
          initialState: parsed.success ? { voiceId: parsed.data } : undefined,
        },
      }}
    />
  );
}

function TranscribeForm({
  locale,
  user,
  platform,
  requested,
}: FormProps): JSX.Element {
  const logger = useLogger();
  const parsed = z.enum(SttModelId).safeParse(requested);
  return (
    <EndpointsPage
      logger={logger}
      endpoint={sttDefinitions}
      user={user}
      locale={locale}
      platform={platform}
      endpointOptions={{
        create: {
          initialState: parsed.success ? { modelId: parsed.data } : undefined,
        },
      }}
    />
  );
}

const FORMS: Record<CreateKind, (props: FormProps) => JSX.Element> = {
  image: ImageForm,
  video: VideoForm,
  music: MusicForm,
  speech: SpeechForm,
  transcribe: TranscribeForm,
};

export function CreatePageClient({
  locale,
  kind,
  user,
  platform,
}: CreatePageClientProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const searchParams = useSearchParams();
  // Read once: the form owns the selection after the first render.
  const [requested] = useState(() =>
    searchParams.get(CREATE_MODEL_PARAM[kind]),
  );
  const Form = FORMS[kind];

  return (
    <Div className="bg-background">
      <Div className="mx-auto flex max-w-4xl flex-col gap-4 py-8 sm:py-12">
        <Div className="flex flex-col gap-4 px-4">
          <Link
            href={`/${locale}/models`}
            className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>
          <Div className="flex flex-col gap-2">
            <Span className="text-xs font-semibold uppercase tracking-wide text-primary">
              {t("eyebrow")}
            </Span>
            <H1 className="m-0 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              {t(`kinds.${kind}.title`)}
            </H1>
            <P className="m-0 max-w-2xl text-base text-muted-foreground">
              {t(`kinds.${kind}.description`)}
            </P>
          </Div>
          <Nav className="flex flex-wrap gap-2">
            {CREATE_KINDS.map((k) => (
              <Link
                key={k}
                href={createHref(locale, k)}
                aria-current={k === kind ? "page" : undefined}
                className={
                  k === kind
                    ? "inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground"
                    : "inline-flex h-9 items-center rounded-full border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted"
                }
              >
                {t(`kinds.${k}.label`)}
              </Link>
            ))}
          </Nav>
        </Div>

        <Form
          locale={locale}
          user={user}
          platform={platform}
          requested={requested}
        />

        <Div className="mx-4 flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-sm font-semibold">{t("chat.title")}</Span>
            <Span className="text-sm text-muted-foreground">
              {t("chat.body")}
            </Span>
          </Div>
          <Button asChild variant="outline" className="h-10 shrink-0 gap-2">
            <Link href={`/${locale}/threads/private/new`}>
              <MessageSquare className="h-4 w-4" />
              {t("chat.cta")}
            </Link>
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
