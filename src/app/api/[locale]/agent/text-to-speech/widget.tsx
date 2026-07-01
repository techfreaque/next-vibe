"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import type { DivMouseEvent } from "next-vibe/ui/web/ui/div";
import { Div } from "next-vibe/ui/web/ui/div";
import { Pause } from "next-vibe/ui/web/ui/icons/Pause";
import { Play } from "next-vibe/ui/web/ui/icons/Play";
import { Square } from "next-vibe/ui/web/ui/icons/Square";
import { Volume2 } from "next-vibe/ui/web/ui/icons/Volume2";
import { Span } from "next-vibe/ui/web/ui/span";
import { Textarea } from "next-vibe/ui/web/ui/textarea";
import { H3 } from "next-vibe/ui/web/ui/typography";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { DEFAULT_TTS_VOICE_ID } from "./constants";
import type definition from "./definition";
import { scopedTranslation } from "./i18n";
import { getTtsModelById, ttsModelDefinitions, TtsModelId } from "./models";

const VOICE_DISPLAY_ORDER: TtsModelId[] = [
  TtsModelId.OPENAI_NOVA,
  TtsModelId.OPENAI_ALLOY,
  TtsModelId.OPENAI_ONYX,
  TtsModelId.OPENAI_ECHO,
  TtsModelId.OPENAI_SHIMMER,
  TtsModelId.OPENAI_FABLE,
];

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

export function TextToSpeechContainer(): JSX.Element {
  const isSubmitting = useWidgetIsSubmitting();
  const isDisabled = useWidgetDisabled();
  const form = useWidgetForm<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);

  const currentText = form?.watch("text") ?? "";
  const currentVoiceId = form?.watch("voiceId") ?? DEFAULT_TTS_VOICE_ID;

  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  // When a new result arrives, load and auto-play
  useEffect(() => {
    const audioUrl = result?.audioUrl;
    if (!audioUrl || audioUrl === currentAudioUrl) {
      return;
    }

    setCurrentAudioUrl(audioUrl);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    const audio = new Audio(audioUrl);
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
    });

    void audio
      .play()
      .then(() => {
        setIsPlaying(true);
        return undefined;
      })
      .catch(() => {
        // Autoplay blocked — user will click play
      });
  }, [result?.audioUrl, currentAudioUrl]);

  const togglePlay = useCallback((): void => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      void audio.play().then(() => {
        setIsPlaying(true);
        return undefined;
      });
    }
  }, [isPlaying]);

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
          <Span className="text-xs font-medium text-muted-foreground">
            {t("post.text.label")}
          </Span>
          <Textarea
            className="w-full min-h-[100px] resize-none"
            placeholder={t("post.text.placeholder")}
            value={currentText}
            disabled={isDisabled}
            onChange={(e) =>
              form?.setValue("text", e.target.value, { shouldDirty: true })
            }
          />
          <Span className="text-[10px] text-muted-foreground text-right">
            {`${currentText.length} / 5000`}
          </Span>
        </Div>

        {/* Voice selector */}
        <Div className="flex flex-col gap-1.5">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("post.voice.label")}
          </Span>
          <Div className="grid grid-cols-3 gap-1.5">
            {VOICE_DISPLAY_ORDER.map((voiceId) => {
              const def = ttsModelDefinitions[voiceId];
              const isSelected = currentVoiceId === voiceId;
              const meta = def.voiceMeta;
              return (
                <Button
                  key={voiceId}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="h-auto py-2 px-2 flex flex-col gap-0.5 items-center"
                  disabled={isDisabled}
                  onClick={() =>
                    form?.setValue("voiceId", voiceId, { shouldDirty: true })
                  }
                >
                  <Span className="text-xs font-semibold">{def.name}</Span>
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

        {/* Generate button */}
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "post.title",
            loadingText: "post.success.description",
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
                  {result.creditCost}
                  {result.creditCost === 1 ? " credit" : " credits"}
                </Badge>
              )}
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
}
