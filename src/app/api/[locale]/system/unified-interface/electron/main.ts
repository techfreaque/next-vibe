/**
 * Electron Main Process
 *
 * Entry point for the Electron desktop app. Spawns `vibe start` as a child
 * process, waits for the HTTP health check, then opens a BrowserWindow.
 *
 * The heavy lifting (Docker, migrations, task runner, Next.js) is handled
 * entirely by the existing vibe start pipeline. Electron is just a shell.
 */

/* eslint-disable i18next/no-literal-string */
// Main process - no i18n needed, stdout output only

import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import path from "node:path";

import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  nativeImage,
  shell,
} from "electron";

// Must be set before app is ready - used by Wayland compositor as window class
app.setName("Unbottled");
// Wayland app ID must match appId in electron-builder config for compositor icon lookup
app.commandLine.appendSwitch("enable-features", "WaylandWindowDecorations");
if (process.platform === "linux") {
  app.commandLine.appendSwitch("ozone-platform-hint", "auto");
}

// ─── Configuration ────────────────────────────────────────────────────────────

// vibe start takes ~35s (Next.js build + migrations). Give plenty of headroom.
const HEALTH_CHECK_TIMEOUT_MS = 120_000;
const HEALTH_CHECK_INTERVAL_MS = 500;

/**
 * Derive the port that `vibe start` will serve on.
 *
 * Mirrors the logic in environment.ts: when IS_PREVIEW_MODE is true and
 * NEXT_PUBLIC_APP_URL is a localhost URL, the port is swapped to PREVIEW_PORT
 * (default 3001) before the env singleton loads. We must apply the same swap
 * so the health check polls the right port.
 */
function derivePort(): number {
  const rawUrl = process.env["NEXT_PUBLIC_APP_URL"];
  const isPreviewMode = process.env["IS_PREVIEW_MODE"] === "true";

  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      if (
        isPreviewMode &&
        (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
      ) {
        return parseInt(process.env["PREVIEW_PORT"] ?? "3001", 10);
      }
      if (parsed.port) {
        return parseInt(parsed.port, 10);
      }
    } catch {
      // ignore malformed URL
    }
  }

  return isPreviewMode
    ? parseInt(process.env["PREVIEW_PORT"] ?? "3001", 10)
    : 3000;
}

// Whether to spawn vibe start internally (false when electron:start already did it)
const spawnVibeStartInternally =
  process.env["ELECTRON_SPAWN_VIBE_START"] !== "false";

// ─── State ────────────────────────────────────────────────────────────────────

let mainWindow: BrowserWindow | null = null;
let vibeProcess: ChildProcess | null = null;

// ─── Vibe Start ───────────────────────────────────────────────────────────────

function spawnVibeStart(): ChildProcess {
  // Always use bun from PATH - the AppImage is a thin shell that runs against
  // the user's local next-vibe project. A fully self-contained bundle would
  // require shipping bun + node_modules + Next.js build inside the AppImage.
  const vibeCmd = "bun";
  const vibeArgs = ["run", "vibe", "start"];

  // Use the directory the AppImage was launched from, not the mount point.
  const projectDir = process.env["APPDIR"] ? process.cwd() : process.cwd();

  process.stdout.write(
    `[electron] Spawning: ${vibeCmd} ${vibeArgs.join(" ")}\n`,
  );

  const child = spawn(vibeCmd, vibeArgs, {
    stdio: "pipe",
    env: {
      ...process.env,
      NODE_ENV: "production",
      NEXT_PUBLIC_LOCAL_MODE: "true",
      IS_PREVIEW_MODE: "true",
    },
    cwd: projectDir,
  });

  child.stdout?.on("data", (chunk: Buffer) => {
    const text = chunk.toString();
    process.stdout.write(`[vibe] ${text}`);

    // After `vibe rebuild` sends SIGUSR1, vibe start restarts Next.js and logs
    // this line when it's ready. Reload the window to pick up the new build.
    if (
      text.includes("✅ Server restarted successfully") &&
      mainWindow &&
      !mainWindow.isDestroyed()
    ) {
      process.stdout.write("[electron] Reloading window after rebuild\n");
      mainWindow.webContents.reload();
    }
  });

  child.stderr?.on("data", (chunk: Buffer) => {
    process.stderr.write(`[vibe:err] ${chunk.toString()}`);
  });

  child.on("exit", (code) => {
    process.stdout.write(`[electron] vibe start exited with code ${code}\n`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("vibe:exit", { code });
    }
  });

  return child;
}

// ─── Health Check ─────────────────────────────────────────────────────────────

async function waitForServer(port: number): Promise<boolean> {
  const serverUrl = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + HEALTH_CHECK_TIMEOUT_MS;

  process.stdout.write(`[electron] Waiting for server at ${serverUrl}...\n`);

  while (Date.now() < deadline) {
    try {
      // redirect:"manual" avoids chasing locale redirect loops (307 → /en-GLOBAL → ...).
      // Any response except 502/503/504 means the server is up.
      const res = await fetch(serverUrl, {
        method: "HEAD",
        redirect: "manual",
      });
      if (res.status !== 502 && res.status !== 503 && res.status !== 504) {
        process.stdout.write(`[electron] Server ready at ${serverUrl}\n`);
        return true;
      }
    } catch {
      // Connection refused - not ready yet
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, HEALTH_CHECK_INTERVAL_MS);
    });
  }

  process.stderr.write(
    `[electron] Server did not start within ${HEALTH_CHECK_TIMEOUT_MS}ms\n`,
  );
  return false;
}

// ─── Window ───────────────────────────────────────────────────────────────────

function createWindow(): BrowserWindow {
  // import.meta.url → .../app.asar/dist/electron/main.js
  // go up two levels to reach the asar root where assets/ lives
  const appDir = path.dirname(path.dirname(new URL(import.meta.url).pathname));
  const iconPath = path.join(appDir, "assets", "icon.png");
  const icon = nativeImage.createFromPath(iconPath);

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    show: false,
    icon,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: path.join(
        path.dirname(new URL(import.meta.url).pathname),
        "preload.js",
      ),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }: { url: string }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  win.on("closed", () => {
    mainWindow = null;
  });

  mainWindow = win;
  return win;
}

function showLoadingScreen(win: BrowserWindow): void {
  void win.loadURL(`data:text/html,
    <html>
      <head>
        <meta charset="utf-8">
        <title>Starting...</title>
        <style>
          body { margin:0; background:#09090b; color:#a1a1aa; font-family:system-ui,sans-serif;
                 display:flex; flex-direction:column; align-items:center; justify-content:center;
                 height:100vh; gap:16px; }
          .spinner { width:32px; height:32px; border:3px solid #27272a;
                     border-top-color:#a855f7; border-radius:50%;
                     animation:spin 0.8s linear infinite; }
          @keyframes spin { to { transform:rotate(360deg); } }
          p { font-size:14px; opacity:0.7; }
        </style>
      </head>
      <body>
        <div class="spinner"></div>
        <p>Starting server...</p>
      </body>
    </html>
  `);
  win.show();
}

// ─── App Lifecycle ────────────────────────────────────────────────────────────

app.on("ready", async () => {
  // Derive port before spawning - env vars are already set by this point
  // (either from shell or from the ELECTRON_SPAWN_VIBE_START env the caller set).
  // IS_PREVIEW_MODE is set to "true" in the vibe start child env, but Electron
  // itself also sets it so derivePort() reads the right value here.
  process.env["IS_PREVIEW_MODE"] = "true";
  const port = derivePort();

  const win = createWindow();
  showLoadingScreen(win);

  if (spawnVibeStartInternally) {
    vibeProcess = spawnVibeStart();
  }

  const ready = await waitForServer(port);

  if (win.isDestroyed()) {
    return;
  }

  if (ready) {
    await win.loadURL(`http://localhost:${port}`);
  } else {
    const { response } = await dialog.showMessageBox(win, {
      type: "error",
      title: "Startup Failed",
      message: "The vibe server failed to start within the timeout.",
      detail: `Check logs for details. Port: ${port}`,
      buttons: ["Retry", "Quit"],
    });

    if (response === 0) {
      app.relaunch();
      app.quit();
    } else {
      app.quit();
    }
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    process.env["IS_PREVIEW_MODE"] = "true";
    const port = derivePort();
    const win = createWindow();
    void win.loadURL(`http://localhost:${port}`);
  }
});

app.on("before-quit", () => {
  if (vibeProcess && !vibeProcess.killed) {
    process.stdout.write("[electron] Sending SIGTERM to vibe process...\n");
    vibeProcess.kill("SIGTERM");
    setTimeout(() => {
      if (vibeProcess && !vibeProcess.killed) {
        vibeProcess.kill("SIGKILL");
      }
    }, 5000);
  }
});

// ─── IPC Handlers ─────────────────────────────────────────────────────────────

ipcMain.handle("vibe:restart", async () => {
  if (vibeProcess && !vibeProcess.killed) {
    vibeProcess.kill("SIGTERM");
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
  process.env["IS_PREVIEW_MODE"] = "true";
  const port = derivePort();
  vibeProcess = spawnVibeStart();
  const ready = await waitForServer(port);
  if (ready && mainWindow && !mainWindow.isDestroyed()) {
    await mainWindow.loadURL(`http://localhost:${port}`);
  }
  return ready;
});

ipcMain.handle("vibe:hot-restart", () => {
  if (vibeProcess && !vibeProcess.killed) {
    vibeProcess.kill("SIGUSR1");
  }
});
