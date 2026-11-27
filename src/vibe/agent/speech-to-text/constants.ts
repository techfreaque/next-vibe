import {
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../skills/enum";
import type { SttModelSelection } from "./models";
import { SttModelId } from "./models";

/** Alias used when this endpoint is called as an AI tool */
export const TRANSCRIBE_AUDIO_ALIAS = "transcribe_audio" as const;

/** `language` value that lets the model detect the spoken language. */
export const STT_AUTO_LANGUAGE = "auto" as const;

/**
 * Spoken languages offered in the Studio language picker (ISO-639-1). All of
 * them are supported by the multilingual models below.
 */
export const STT_LANGUAGES = [
  "ar",
  "bg",
  "bn",
  "ca",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "es",
  "fa",
  "fi",
  "fr",
  "he",
  "hi",
  "hr",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "ms",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sl",
  "sr",
  "sv",
  "ta",
  "th",
  "tr",
  "uk",
  "ur",
  "vi",
  "zh",
] as const;

/**
 * Studio default for auto-detected or non-English audio, best first.
 * Measured 2026-11-27 on a 25 s Brazilian Portuguese clip: Qwen3 ASR 0.6B
 * (cheapest, the old default) wrote it as Spanish with or without a
 * language hint; Whisper Large V3 was readable with errors; Voxtral Mini
 * was near perfect at $0.0039/min.
 */
export const STT_MULTILINGUAL_MODEL_IDS: readonly SttModelId[] = [
  SttModelId.VOXTRAL_MINI_TRANSCRIBE,
  SttModelId.VOXTRAL_SMALL_TRANSCRIBE,
  SttModelId.WHISPER_LARGE_V3,
  SttModelId.OPENAI_WHISPER,
];

/** Default speech-to-text model */
export const DEFAULT_STT_MODEL_ID: SttModelId = SttModelId.OPENAI_WHISPER;

export const DEFAULT_STT_MODEL_SELECTION: SttModelSelection = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: SttModelId.OPENAI_WHISPER,
  sortBy: ModelSortField.INTELLIGENCE,
  sortDirection: ModelSortDirection.DESC,
  sortBy2: ModelSortField.PRICE,
  sortDirection2: ModelSortDirection.ASC,
};
