/**
 * Electron Preload Script
 *
 * Runs in the renderer process with Node.js access but in an isolated context.
 * Exposes a minimal, type-safe API to the web app via contextBridge.
 *
 * The renderer (Next.js app at localhost:<port>) can call these via:
 *   window.vibeElectron.restart()
 *   window.vibeElectron.hotRestart()
 *   window.vibeElectron.platform  // "darwin" | "linux" | "win32"
 *   window.vibeElectron.onVibeExit(handler)
 */

/* eslint-disable i18next/no-literal-string */

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("vibeElectron", {
  /** Full server restart (kills vibe start, respawns, waits for health check) */
  restart: (): Promise<boolean> => ipcRenderer.invoke("vibe:restart"),

  /** Hot-restart Next.js only via SIGUSR1 (same as `vibe rebuild`) */
  hotRestart: (): Promise<void> => ipcRenderer.invoke("vibe:hot-restart"),

  /** OS platform identifier */
  platform: process.platform,

  /** Subscribe to vibe process exit events */
  onVibeExit: (handler: (data: { code: number | null }) => void): void => {
    ipcRenderer.on(
      "vibe:exit",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_event: Electron.IpcRendererEvent, data: { code: number | null }) => {
        handler(data);
      },
    );
  },
});
