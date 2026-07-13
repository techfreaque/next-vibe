"use client";

import {
  ModelSelector,
  ModelSelectorTrigger,
} from "next-vibe/agent/models/widget/model-selector";
import { ModelSelectionType } from "next-vibe/agent/skills/enum";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import { Badge } from "next-vibe/ui/ui/badge";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { AlertCircle } from "next-vibe/ui/ui/icons/AlertCircle";
import { ArrowLeft } from "next-vibe/ui/ui/icons/ArrowLeft";
import { Check } from "next-vibe/ui/ui/icons/Check";
import { Copy } from "next-vibe/ui/ui/icons/Copy";
import { Loader2 } from "next-vibe/ui/ui/icons/Loader2";
import { Mic } from "next-vibe/ui/ui/icons/Mic";
import { MicOff } from "next-vibe/ui/ui/icons/MicOff";
import { Square } from "next-vibe/ui/ui/icons/Square";
import { Upload } from "next-vibe/ui/ui/icons/Upload";
import type { InputChangeEvent, InputRefObject } from "next-vibe/ui/ui/input";
import { Input } from "next-vibe/ui/ui/input";
import { Span } from "next-vibe/ui/ui/span";
import { H3, P } from "next-vibe/ui/ui/typography";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";
import { useCallback, useRef, useState } from "react";

import { DEFAULT_STT_MODEL_ID } from "./constants";
import type definition from "./definition";
import { useEdenAISpeech } from "./hooks";
import { scopedTranslation } from "./i18n";
import type { SttModelSelection } from "./models";
import { SttModelId } from "./models";

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m)}:${String(sec).padStart(2, "0")}`;
}

export function SpeechToTextContainer(): JSX.Element {
  const isSubmitting = useWidgetIsSubmitting();
  const form = useWidgetForm<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const { t } = scopedTranslation.scopedT(locale);

  const [showModelSelector, setShowModelSelector] = useState(false);

  const currentModelId = form?.watch("modelId") ?? DEFAULT_STT_MODEL_ID;
  const modelSelection: SttModelSelection = {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: currentModelId,
  };

  const [copied, setCopied] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<InputRefObject | null>(null);

  const startTimer = useCallback((): void => {
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback((): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecordingSeconds(0);
  }, []);

  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    error: recordingError,
    clearError,
  } = useEdenAISpeech({
    locale,
    user,
    logger,
    onTranscript: () => {
      stopTimer();
    },
    onError: () => {
      stopTimer();
    },
  });

  const handleMicClick = useCallback(async (): Promise<void> => {
    if (isRecording) {
      stopRecording();
      stopTimer();
    } else {
      clearError();
      await startRecording();
      startTimer();
    }
  }, [
    isRecording,
    startRecording,
    stopRecording,
    startTimer,
    stopTimer,
    clearError,
  ]);

  const handleFileChange = useCallback(
    (e: InputChangeEvent<"file">): void => {
      const files = e.target.files;
      if (!files || files.length === 0) {
        return;
      }
      const fileArray = [...files];
      form?.setValue("fileUpload.files", fileArray, { shouldDirty: true });
    },
    [form],
  );

  const copyText = useCallback((): void => {
    const text = result?.response?.text;
    if (!text) {
      return;
    }
    void copyToClipboard(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return undefined;
    });
  }, [result?.response?.text]);

  const selectedFiles = form?.watch("fileUpload.files") as File[] | undefined;
  const hasFile = selectedFiles && selectedFiles.length > 0;
  const transcribedText = result?.response?.text;
  const isActive = isRecording || isProcessing || isSubmitting === true;

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
          allowedRoles={["stt"]}
          modelSelection={modelSelection}
          onChange={(sel) => {
            if (
              sel !== null &&
              sel.selectionType === ModelSelectionType.MANUAL
            ) {
              const modelId = Object.values(SttModelId).find(
                (id) => id === sel.manualModelId,
              );
              if (modelId !== undefined) {
                form?.setValue("modelId", modelId, { shouldDirty: true });
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
          <Mic className="h-3.5 w-3.5 text-primary" />
        </Div>
        <H3 className="text-sm font-semibold">{t("post.title")}</H3>
      </Div>

      <Div className="flex flex-col gap-4 px-4 pb-4">
        {/* Model selector trigger */}
        <ModelSelectorTrigger
          modelSelection={modelSelection}
          allowedRoles={["stt"]}
          placeholder={t("post.model.label")}
          onClick={
            isProcessing || isSubmitting === true
              ? undefined
              : () => setShowModelSelector(true)
          }
          locale={locale}
          user={user}
        />

        {/* Record button area */}
        <Div className="flex flex-col items-center gap-3 py-6">
          <Div className="relative flex items-center justify-center w-16 h-16">
            {/* Pulse ring when recording */}
            {isRecording && (
              <Div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
            )}
            <Button
              type="button"
              variant={isRecording ? "destructive" : "default"}
              className="relative z-10 w-16 h-16 rounded-full p-0"
              onClick={() => void handleMicClick()}
              disabled={isProcessing || isSubmitting === true}
            >
              {isRecording ? (
                <Square className="h-6 w-6" />
              ) : isProcessing || isSubmitting === true ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          </Div>

          {/* Status label */}
          {isRecording && (
            <Div className="flex items-center gap-2">
              <Div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <Span className="text-sm font-medium text-red-500">
                {formatTime(recordingSeconds)}
              </Span>
            </Div>
          )}
          {(isProcessing || isSubmitting === true) && (
            <Span className="text-sm text-muted-foreground">
              {t("post.success.transcribing")}
            </Span>
          )}
          {!isActive && (
            <Span className="text-xs text-muted-foreground">
              {t("post.audio.label")}
            </Span>
          )}
        </Div>

        {/* Recording error */}
        {recordingError && (
          <Div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <Span className="text-xs text-destructive">{recordingError}</Span>
          </Div>
        )}

        {/* File upload — secondary option */}
        <Div className="flex flex-col gap-1.5">
          <Span className="text-xs font-medium text-muted-foreground">
            {t("post.fileUpload.title")}
          </Span>
          <Div
            className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-4 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => fileInputRef.current?.click?.()}
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <Span className="text-xs text-muted-foreground text-center">
              {t("post.audio.description")}
            </Span>
            {hasFile && selectedFiles && (
              <Badge variant="secondary" className="text-[10px]">
                {selectedFiles[0]?.name}
              </Badge>
            )}
          </Div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/webm,video/ogg"
            multiple={false}
            className="hidden"
            onChange={handleFileChange}
          />
        </Div>

        {/* Submit for file uploads */}
        {hasFile && (
          <>
            <FormAlertWidget field={{}} />
            <SubmitButtonWidget<typeof definition.POST>
              field={{
                text: "post.title",
                loadingText: "post.success.transcribing",
                icon: "mic",
                variant: "primary",
              }}
            />
          </>
        )}

        {/* Result */}
        {!isActive && transcribedText && (
          <Div className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-3">
            <Div className="flex items-center justify-between">
              <Span className="text-xs font-medium text-muted-foreground">
                {t("post.response.text")}
              </Span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={copyText}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </Div>
            <P className="text-sm leading-relaxed">{transcribedText}</P>

            <Div className="flex items-center gap-2 flex-wrap pt-1">
              {result?.response?.provider && (
                <Badge variant="secondary" className="text-[10px]">
                  {result.response.provider}
                </Badge>
              )}
              {result?.response?.confidence !== undefined && (
                <Badge variant="outline" className="text-[10px]">
                  {`${Math.round((result.response.confidence as number) * 100)}%`}
                </Badge>
              )}
              {result?.creditCost !== undefined && (
                <Badge variant="outline" className="text-[10px]">
                  {result.creditCost === 1
                    ? `${result.creditCost} credit`
                    : `${result.creditCost} credits`}
                </Badge>
              )}
            </Div>
          </Div>
        )}

        {/* Idle hint */}
        {!isActive && !transcribedText && !recordingError && (
          <Div className="flex items-center justify-center gap-2 py-2">
            <MicOff className="h-3.5 w-3.5 text-muted-foreground/40" />
            <Span className="text-xs text-muted-foreground/40">
              {t("post.description")}
            </Span>
          </Div>
        )}
      </Div>
    </Div>
  );
}
