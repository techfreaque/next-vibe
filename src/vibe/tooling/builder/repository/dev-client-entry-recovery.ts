import {
  CHUNK_LOAD_ERROR_MESSAGE,
  CHUNK_RELOAD_DELAY_MS,
  CHUNK_RELOAD_KEY,
  CHUNK_RELOAD_WINDOW_MS,
} from "../../../logger/chunk-reload-policy";

/** Wrap TanStack's entry import after its React Refresh preamble. */
export function withDevClientEntryRecovery(code: string): string | undefined {
  const entryImport = /\n(await import\("[^\n]+"\));?\s*$/;
  if (!entryImport.test(code)) {
    return undefined;
  }
  // Both imports can fail together. The last resort must run within this
  // module and use persistent storage so the normal guard sees its reload.
  return code.replace(
    entryImport,
    `\ntry { $1; } catch (error) {
  const entryError = error instanceof Error ? error : new Error(String(error));
  try {
    const { reportDevClientEntryError } = await import("next-vibe/logger/browser-startup-error");
    reportDevClientEntryError(entryError);
  } catch (reportError) {
    let fallbackReloadScheduled = false;
    try {
      if (entryError.name === "ChunkLoadError" || ${CHUNK_LOAD_ERROR_MESSAGE}.test(entryError.message)) {
        const storage = window.sessionStorage;
        const key = ${JSON.stringify(CHUNK_RELOAD_KEY)};
        const previous = JSON.parse(storage.getItem(key) ?? "null");
        const previousAt = typeof previous === "number" ? previous : previous?.at;
        const at = Date.now();
        if (!Number.isFinite(previousAt) || at - previousAt >= ${CHUNK_RELOAD_WINDOW_MS}) {
          const record = JSON.stringify({ at, source: "error-boundary:devClientEntry", level: "error" });
          storage.setItem(key, record);
          if (storage.getItem(key) === record) {
            setTimeout(() => window.location.reload(), ${CHUNK_RELOAD_DELAY_MS});
            fallbackReloadScheduled = true;
          }
        }
      }
    } catch (storageError) {
      console.error("[client] dev entry fallback could not use the reload guard:", storageError);
    }
    console.error("[client] dev entry failed and its startup reporter failed:", error, reportError, { fallbackReloadScheduled });
  }
}`,
  );
}
