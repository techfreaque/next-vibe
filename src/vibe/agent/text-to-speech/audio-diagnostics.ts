/**
 * Audio playback failure classification for TTS players.
 *
 * Two failure channels exist and both used to be swallowed:
 *  - `audio.play()` rejects (DOMException): NotAllowedError = autoplay policy
 *    (no recent user gesture), AbortError = interrupted by pause()/new src,
 *    NotSupportedError = the source cannot be decoded/played.
 *  - the element fires `error` with `audio.error.code` (MediaError):
 *    1 ABORTED, 2 NETWORK, 3 DECODE, 4 SRC_NOT_SUPPORTED.
 */

export type AudioFailureKind =
  | "autoplay-policy"
  | "interrupted"
  | "network"
  | "decode"
  | "unsupported-source"
  | "aborted"
  | "unknown";

const MEDIA_ERROR_KIND: Record<number, AudioFailureKind> = {
  1: "aborted",
  2: "network",
  3: "decode",
  4: "unsupported-source",
};

/** Kind of an HTMLMediaElement `error` event, from `audio.error.code`. */
export function classifyMediaError(code: number | null): AudioFailureKind {
  return code === null ? "unknown" : (MEDIA_ERROR_KIND[code] ?? "unknown");
}

/** Kind of an `audio.play()` rejection. */
export function classifyPlayRejection(
  error: Error | string | null,
): AudioFailureKind {
  const name = error instanceof Error ? error.name : "";
  const message = error instanceof Error ? error.message : String(error);
  if (name === "NotAllowedError" || /user (gesture|interact)/i.test(message)) {
    return "autoplay-policy";
  }
  if (name === "AbortError" || /interrupted/i.test(message)) {
    return "interrupted";
  }
  if (name === "NotSupportedError" || /no supported source/i.test(message)) {
    return "unsupported-source";
  }
  return "unknown";
}

/**
 * What the player was handed, safe to log: the data URI header (never the
 * base64 payload) or the URL path (never the query, which may carry tokens),
 * plus whether this browser claims it can decode the declared format.
 */
export function describeAudioSource(
  audio: HTMLAudioElement,
  audioData: string,
): {
  audioDataLength: number;
  srcPrefix: string;
  declaredMime: string | null;
  canPlayDeclared: string | null;
  canPlayMpeg: string;
} {
  let srcPrefix = "";
  let declaredMime: string | null = null;
  if (audioData.startsWith("data:")) {
    const comma = audioData.indexOf(",");
    srcPrefix = audioData.slice(0, comma === -1 ? 40 : comma + 1).slice(0, 40);
    const mime = audioData.slice(5, comma === -1 ? 5 : comma).split(";")[0];
    declaredMime = mime && mime.length > 0 ? mime : null;
  } else if (audioData.startsWith("blob:")) {
    srcPrefix = "blob:";
  } else if (audioData.length > 0) {
    const queryStart = audioData.search(/[?#]/);
    srcPrefix = (
      queryStart === -1 ? audioData : audioData.slice(0, queryStart)
    ).slice(0, 120);
  }
  return {
    audioDataLength: audioData.length,
    srcPrefix,
    declaredMime,
    canPlayDeclared: declaredMime ? audio.canPlayType(declaredMime) : null,
    canPlayMpeg: audio.canPlayType("audio/mpeg"),
  };
}

/** `audio.error` + element state, safe to log (no audio data, no URL query). */
export function describeAudioElement(audio: HTMLAudioElement): {
  mediaErrorCode: number | null;
  mediaErrorMessage: string | null;
  failureKind: AudioFailureKind;
  networkState: number;
  readyState: number;
  currentTime: number;
  duration: number | null;
  srcKind: "blob" | "data" | "http" | "none";
} {
  const code = audio.error?.code ?? null;
  const src = audio.currentSrc || audio.src || "";
  return {
    mediaErrorCode: code,
    mediaErrorMessage: audio.error?.message || null,
    failureKind: classifyMediaError(code),
    networkState: audio.networkState,
    readyState: audio.readyState,
    currentTime: audio.currentTime,
    duration: Number.isFinite(audio.duration) ? audio.duration : null,
    srcKind: src.startsWith("blob:")
      ? "blob"
      : src.startsWith("data:")
        ? "data"
        : src.length > 0
          ? "http"
          : "none",
  };
}
