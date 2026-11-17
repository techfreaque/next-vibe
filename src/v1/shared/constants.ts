export const V1_CHAT_COMPLETIONS_ALIAS = "v1-chat-completions" as const;
export const V1_MODELS_ALIAS = "v1-models" as const;

/** Hard cap on completion tokens requested through the API. */
export const V1_MAX_OUTPUT_TOKENS = 32_768;
export const V1_RESPONSES_ALIAS = "v1-responses" as const;
export const V1_MESSAGES_ALIAS = "v1-messages" as const;
export const V1_MESSAGES_COUNT_TOKENS_ALIAS =
  "v1-messages-count-tokens" as const;

export const V1_IMAGES_GENERATIONS_ALIAS = "v1-images-generations" as const;
export const V1_IMAGES_EDITS_ALIAS = "v1-images-edits" as const;
export const V1_AUDIO_SPEECH_ALIAS = "v1-audio-speech" as const;
export const V1_AUDIO_TRANSCRIPTIONS_ALIAS = "v1-audio-transcriptions" as const;
export const V1_AUDIO_TRANSLATIONS_ALIAS = "v1-audio-translations" as const;
export const V1_VIDEOS_ALIAS = "v1-videos" as const;
export const V1_VIDEO_ALIAS = "v1-video" as const;
export const V1_VIDEO_CONTENT_ALIAS = "v1-video-content" as const;
export const V1_MUSIC_ALIAS = "v1-music" as const;
export const V1_MUSIC_JOB_ALIAS = "v1-music-job" as const;
export const V1_MUSIC_CONTENT_ALIAS = "v1-music-content" as const;
export const V1_MEDIA_FILE_ALIAS = "v1-media-file" as const;

/** Images per /v1/images call (each one is generated and billed). */
export const V1_MAX_IMAGES_PER_CALL = 4;
/** Characters per /v1/audio/speech call (OpenAI's limit). */
export const V1_MAX_SPEECH_CHARACTERS = 4096;
/** Upload limit of /v1/audio/transcriptions (OpenAI's limit). */
export const V1_MAX_AUDIO_BYTES = 25 * 1024 * 1024;
/** Upload limit of a reference image (images/edits, videos). */
export const V1_MAX_IMAGE_BYTES = 20 * 1024 * 1024;
/** A queued or running media job older than this died with its process. */
export const V1_MEDIA_JOB_STALE_MS = 45 * 60 * 1000;
