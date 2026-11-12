import { execSync } from "node:child_process";

import type { EndpointLogger } from "../../../logger/types";

export async function copyToClipboard(
  text: string,
  logger: EndpointLogger,
): Promise<boolean> {
  try {
    const platform = process.platform;
    if (platform === "darwin") {
      execSync(`echo ${JSON.stringify(text)} | pbcopy`, { stdio: "ignore" });
    } else if (platform === "win32") {
      execSync(`echo ${JSON.stringify(text)} | clip`, { stdio: "ignore" });
    } else {
      execSync(`echo ${JSON.stringify(text)} | xclip -selection clipboard`, {
        stdio: "ignore",
      });
    }
    return true;
  } catch (error) {
    logger.warn("Clipboard write failed", {
      operation: "copyToClipboard",
      platform: process.platform,
      error: error instanceof Error ? error.message : String(error),
      textLength: text.length,
    });
    return false;
  }
}

export async function copyImageToClipboard(
  url: string,
  logger: EndpointLogger,
): Promise<boolean> {
  void url;
  void logger;
  return false;
}

export function hasClipboardAccess(): boolean {
  return (
    process.platform === "darwin" ||
    process.platform === "win32" ||
    process.platform === "linux"
  );
}
