/**
 * Public generation pages: /[locale]/create/<kind>.
 * One page per media job, full control over model and options. Every
 * user-facing "generate with X" link points here (never at /tools/*).
 *
 * Client-safe: no server-only imports.
 */

/** URL segment of each create page. */
export const CREATE_KINDS = [
  "image",
  "video",
  "music",
  "speech",
  "transcribe",
] as const;

export type CreateKind = (typeof CREATE_KINDS)[number];

export function isCreateKind(value: string): value is CreateKind {
  return CREATE_KINDS.some((kind) => kind === value);
}

/** Form field that holds the model/voice selection on each page. */
export const CREATE_MODEL_PARAM: Record<CreateKind, string> = {
  image: "model",
  video: "model",
  music: "model",
  speech: "voiceId",
  transcribe: "modelId",
};

/** Link to a create page, optionally with a model/voice preselected. */
export function createHref(
  locale: string,
  kind: CreateKind,
  modelId?: string,
): string {
  const base = `/${locale}/create/${kind}`;
  if (modelId === undefined) {
    return base;
  }
  return `${base}?${CREATE_MODEL_PARAM[kind]}=${encodeURIComponent(modelId)}`;
}
