/**
 * Type declarations for window.vibeElectron
 * Exposed by the preload script when running inside Electron.
 * Import or reference this file to get type safety in the renderer.
 */

interface VibeElectronAPI {
  /** Full server restart - kills vibe start, respawns, waits for health check */
  restart: () => Promise<boolean>;
  /** Hot-restart Next.js via SIGUSR1 (same as `vibe rebuild`) */
  hotRestart: () => Promise<void>;
  /** OS platform */
  platform: NodeJS.Platform;
  /** Subscribe to vibe process exit events */
  onVibeExit: (handler: (event: { code: number | null }) => void) => void;
}

declare global {
  interface Window {
    /** Only defined when running inside the Electron desktop app */
    vibeElectron?: VibeElectronAPI;
  }
}
