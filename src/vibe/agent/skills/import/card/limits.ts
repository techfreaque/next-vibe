/** Decoded upload limit and the equivalent base64 limit with a data URL prefix. */
export const CARD_MAX_BYTES = 10 * 1024 * 1024;
export const CARD_MAX_BASE64_CHARS = Math.ceil(CARD_MAX_BYTES / 3) * 4;
export const CARD_MAX_INPUT_CHARS = CARD_MAX_BASE64_CHARS + 64;

/** A card's text is separate from its artwork and has a much smaller budget. */
export const CARD_MAX_JSON_BYTES = 512 * 1024;
