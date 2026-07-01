import "server-only";

import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

import { listMonitors } from "../shared/repository";
import type { DesktopData, SupportedDesktopEnv } from "./prompt";
import { DesktopPlatform } from "./prompt";

function getPlatform(): DesktopPlatform {
  switch (process.platform) {
    case "linux":
      return DesktopPlatform.LINUX;
    case "darwin":
      return DesktopPlatform.MACOS;
    case "win32":
      return DesktopPlatform.WINDOWS;
    default:
      return DesktopPlatform.UNKNOWN;
  }
}

function detectDesktopEnv(): SupportedDesktopEnv | null {
  if (process.platform === "win32") {
    return "windows";
  }
  if (process.platform !== "linux") {
    return null;
  }
  const xdg = (process.env.XDG_CURRENT_DESKTOP ?? "").toLowerCase();
  const session = (process.env.DESKTOP_SESSION ?? "").toLowerCase();
  if (xdg.includes("kde") || session.includes("plasma")) {
    return "kde";
  }
  return null;
}

export async function loadDesktopData(
  params: SystemPromptServerParams,
): Promise<DesktopData> {
  const isAdmin =
    !params.user.isPublic &&
    params.user.roles.includes(UserPermissionRole.ADMIN);

  const platform = getPlatform();

  if (!isAdmin) {
    return { isAdmin: false, desktopEnv: null, platform, monitors: [] };
  }

  const desktopEnv = detectDesktopEnv();

  let monitors: DesktopData["monitors"] = [];
  if (desktopEnv) {
    try {
      monitors = await listMonitors(params.logger);
    } catch {
      // non-fatal — fragment still renders without monitor list
    }
  }

  return { isAdmin: true, desktopEnv, platform, monitors };
}
