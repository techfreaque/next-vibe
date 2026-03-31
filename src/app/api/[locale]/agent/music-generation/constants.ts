/**
 * Music Generation Constants
 */

/** Primary alias used to register the generate_music AI tool */
export const MUSIC_GEN_ALIAS = "generate_music" as const;

/** Tool name used in synthetic tool-call/result messages for natively-generated audio */
export const AUDIO_GEN_TOOL_NAME = "audio_gen" as const;
