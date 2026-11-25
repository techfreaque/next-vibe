/** Shared with the Vite bootstrap, which can run before the logger loads. */
export const CHUNK_RELOAD_KEY = "vibe-chunk-reload";
export const CHUNK_RELOAD_WINDOW_MS = 10 * 60_000;
export const CHUNK_RELOAD_DELAY_MS = 800;
export const CHUNK_LOAD_ERROR_MESSAGE =
  /Loading (CSS )?chunk .+ failed|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i;
