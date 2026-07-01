import { execSync } from "node:child_process";

export async function copyToClipboard(text: string): Promise<boolean> {
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
  } catch {
    return false;
  }
}

export async function copyImageToClipboard(url: string): Promise<boolean> {
  void url;
  return false;
}

export function hasClipboardAccess(): boolean {
  return (
    process.platform === "darwin" ||
    process.platform === "win32" ||
    process.platform === "linux"
  );
}
