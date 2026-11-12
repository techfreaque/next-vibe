"use client";

import {
  ContentLevel,
  type ContentLevelValue,
} from "next-vibe/agent/skills/enum";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import type { DivMouseEvent } from "next-vibe/ui/components/div";
import { Div } from "next-vibe/ui/components/div";
import { Download } from "next-vibe/ui/components/icons/Download";
import { Pause } from "next-vibe/ui/components/icons/Pause";
import { Play } from "next-vibe/ui/components/icons/Play";
import { Square } from "next-vibe/ui/components/icons/Square";
import { Volume2 } from "next-vibe/ui/components/icons/Volume2";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H3 } from "next-vibe/ui/components/typography";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { CONTENT_TIER_ORDER } from "@/_pages/models/_shared/model-facts";
import { tierName } from "@/_pages/models/_shared/model-format";

import {
  classifyPlayRejection,
  describeAudioElement,
} from "./audio-diagnostics";
import { DEFAULT_TTS_VOICE_ID } from "./constants";
import type definition from "./definition";
import { scopedTranslation } from "./i18n";
import {
  getTtsModelById,
  type TtsModelId,
  type TtsModelOption,
  ttsModelOptions,
} from "./models";

const TIER_DOT: Record<typeof ContentLevelValue, string> = {
  [ContentLevel.MAINSTREAM]: "bg-primary",
  [ContentLevel.OPEN]: "bg-info",
  [ContentLevel.UNCENSORED]: "bg-warning",
};

interface VoiceGroup {
  tier: typeof ContentLevelValue;
  voices: TtsModelOption[];
}

/** Catalog voices (deduped by id), grouped by content tier, uncensored first. */
function buildVoiceGroups(): VoiceGroup[] {
  const seen = new Set<TtsModelId>();
  const unique: TtsModelOption[] = [];
  for (const option of ttsModelOptions) {
    if (!seen.has(option.id)) {
      seen.add(option.id);
      unique.push(option);
    }
  }
  return CONTENT_TIER_ORDER.map((tier) => ({
    tier,
    voices: unique.filter((v) => v.content === tier),
  })).filter((g) => g.voices.length > 0);
}

const VOICE_GROUPS: VoiceGroup[] = buildVoiceGroups();

function genderIcon(gender: string | undefined): string {
  if (gender === "female") {
    return "♀";
  }
  if (gender === "male") {
    return "♂";
  }
  return "◈";
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m)}:${String(sec).padStart(2, "0")}`;
}

interface TextToSpeechContainerProps {
  field: (typeof definition.POST)["fields"];
}

export function TextToSpeechContainer({
  field,
}: TextToSpeechContainerProps): JSX.Element {
  const isSubmitting = useWidgetIsSubmitting();
  const isDisabled = useWidgetDisabled();
  const form = useWidgetForm<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const { t } = scopedTranslation.scopedT(locale);

  const currentText = form?.watch("text") ?? "";
  const currentVoiceId = form?.watch("voiceId") ?? DEFAULT_TTS_VOICE_ID;

  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Voice in effect for the current audio - read by the async error handlers
  const currentVoiceIdRef = useRef(currentVoiceId);
  useEffect(() => {
    currentVoiceIdRef.current = currentVoiceId;
  }, [currentVoiceId]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  // When a new result arrives, reset player state during render (no cascading effect render)
  const resultAudioUrl = result?.audioUrl;
  if (resultAudioUrl && resultAudioUrl !== currentAudioUrl) {
    setCurrentAudioUrl(resultAudioUrl);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }

  // Load and auto-play the current audio URL
  useEffect(() => {
    if (!currentAudioUrl) {
      return;
    }

    const audio = new Audio(currentAudioUrl);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    audio.addEventListener("error", () => {
      setIsPlaying(false);
      // network vs decode vs unsupported source, from audio.error.code
      logger.error("TTS widget: audio element error", {
        ...describeAudioElement(audio),
        voiceId: currentVoiceIdRef.current,
        chunkIndex: 0,
        totalChunks: 1,
        phase: "load",
      });
    });

    void audio
      .play()
      .then(() => {
        setIsPlaying(true);
        return undefined;
      })
      .catch((error: Error) => {
        const failureKind = classifyPlayRejection(error);
        const context = {
          ...describeAudioElement(audio),
          failureKind,
          errorName: error instanceof Error ? error.name : "UnknownError",
          errorMessage: error instanceof Error ? error.message : String(error),
          voiceId: currentVoiceIdRef.current,
          chunkIndex: 0,
          totalChunks: 1,
          phase: "autoplay",
        };
        // Autoplay blocked is expected (user clicks play) - still recorded
        if (
          failureKind === "autoplay-policy" ||
          failureKind === "interrupted"
        ) {
          logger.warn("TTS widget: autoplay did not start", context);
          return;
        }
        logger.error("TTS widget: autoplay failed", context);
      });
  }, [currentAudioUrl, logger]);

  const togglePlay = useCallback((): void => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      void audio
        .play()
        .then(() => {
          setIsPlaying(true);
          return undefined;
        })
        .catch((error: Error) => {
          // User pressed play and nothing happened - always an error row
          setIsPlaying(false);
          logger.error("TTS widget: play() rejected", {
            ...describeAudioElement(audio),
            failureKind: classifyPlayRejection(error),
            errorName: error instanceof Error ? error.name : "UnknownError",
            errorMessage:
              error instanceof Error ? error.message : String(error),
            voiceId: currentVoiceIdRef.current,
            chunkIndex: 0,
            totalChunks: 1,
            phase: "user-play",
          });
        });
    }
  }, [isPlaying, logger]);

  const stopAudio = useCallback((): void => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const seekTo = useCallback(
    (e: DivMouseEvent): void => {
      const audio = audioRef.current;
      if (!audio || !duration) {
        return;
      }
      // DivMouseEvent has clientX and currentTarget with getBoundingClientRect
      const target = e.currentTarget as HTMLDivElement;
      const rect = target.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      audio.currentTime = ratio * duration;
    },
    [duration],
  );

  const resolvedModel = getTtsModelById(currentVoiceId);
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <Div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Volume2 className="h-3.5 w-3.5 text-primary" />
        </Div>
        <H3 className="text-sm font-semibold">{t("post.title")}</H3>
      </Div>

      <Div className="flex flex-col gap-4 px-4 pb-4">
        {/* Text input */}
        <Div className="flex flex-col gap-1.5">
          <TextareaFieldWidget fieldName="text" field={field.children.text} />
          <Span className="text-[10px] text-muted-foreground text-right">
            {`${currentText.length} / 5000`}
          </Span>
        </Div>

        {/* Voice selector */}
        <Div className="flex flex-col gap-1.5">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("post.voice.label")}
          </Span>
          <Div className="flex flex-col gap-3">
            {VOICE_GROUPS.map((group) => (
              <Div
                key={group.tier}
                className="flex flex-col gap-1.5"
                data-tier={group.tier}
              >
                <Div className="flex items-center gap-1.5">
                  <Span
                    className={`h-1.5 w-1.5 rounded-full ${TIER_DOT[group.tier]}`}
                  />
                  <Span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {tierName(group.tier, locale)}
                  </Span>
                </Div>
                <Div className="grid grid-cols-3 gap-1.5">
                  {group.voices.map((voice) => {
                    const voiceId = voice.id;
                    const isSelected = currentVoiceId === voiceId;
                    const meta = voice.voiceMeta;
                    return (
                      <Button
                        key={voiceId}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className="h-auto py-2 px-2 flex flex-col gap-0.5 items-center"
                        disabled={isDisabled}
                        onClick={() =>
                          form?.setValue("voiceId", voiceId, {
                            shouldDirty: true,
                          })
                        }
                      >
                        <Span className="text-xs font-semibold">
                          {voice.name}
                        </Span>
                        <Span
                          className={`text-[9px] ${isSelected ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                        >
                          {genderIcon(meta?.gender)}{" "}
                          {meta?.style ?? meta?.gender ?? "neutral"}
                        </Span>
                      </Button>
                    );
                  })}
                </Div>
              </Div>
            ))}
          </Div>
        </Div>

        {/* Generate button */}
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "post.submitButton.label",
            loadingText: "post.submitButton.loadingText",
            icon: "volume-2",
            variant: "primary",
          }}
        />

        {/* Audio player */}
        {isSubmitting !== true && currentAudioUrl && (
          <Div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-3">
            {/* Controls row */}
            <Div className="flex items-center gap-2">
              <Button
                type="button"
                variant="default"
                size="icon"
                className="h-9 w-9 rounded-full shrink-0"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-full shrink-0"
                onClick={stopAudio}
              >
                <Square className="h-3 w-3" />
              </Button>
              <ExternalLink
                href={currentAudioUrl}
                download="generated-speech.mp3"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 rounded-full shrink-0"
                  title={t("post.download")}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </ExternalLink>

              {/* Progress bar */}
              <Div
                className="flex-1 flex flex-col gap-1 cursor-pointer"
                onClick={seekTo}
              >
                <Div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <Div
                    style={{
                      height: "100%",
                      borderRadius: "9999px",
                      backgroundColor: "hsl(var(--primary))",
                      width: `${progressPct}%`,
                      transition: "width 100ms",
                    }}
                  />
                </Div>
                <Div className="flex justify-between">
                  <Span className="text-[10px] text-muted-foreground">
                    {formatTime(currentTime)}
                  </Span>
                  {duration > 0 && (
                    <Span className="text-[10px] text-muted-foreground">
                      {formatTime(duration)}
                    </Span>
                  )}
                </Div>
              </Div>
            </Div>

            {/* Meta row */}
            <Div className="flex items-center gap-2 flex-wrap">
              {resolvedModel && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  {resolvedModel.name}
                </Badge>
              )}
              {resolvedModel?.voiceMeta?.gender && (
                <Badge variant="outline" className="text-[10px]">
                  {genderIcon(resolvedModel.voiceMeta.gender)}{" "}
                  {resolvedModel.voiceMeta.style ??
                    resolvedModel.voiceMeta.gender}
                </Badge>
              )}
              {result?.creditCost !== undefined && (
                <Badge variant="outline" className="text-[10px]">
                  {`${t("post.response.creditCost")}: ${String(result.creditCost)}`}
                </Badge>
              )}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
