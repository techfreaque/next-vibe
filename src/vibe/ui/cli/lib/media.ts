import type { EndpointLogger } from "../../../logger/types";

export function getUserAgent(): string {
  return `Node.js/${process.version} (${process.platform})`;
}

export function getLanguage(): string {
  return process.env["LANG"]?.split(".")[0]?.replace("_", "-") ?? "en-US";
}

export async function getMicrophoneStream(
  logger: EndpointLogger,
): Promise<null> {
  logger.debug("[media] getMicrophoneStream unsupported", {
    platform: "cli",
  });
  return null;
}

export async function requestMicrophoneStream(): Promise<{
  stream: null;
  errorName: string | null;
  errorMessage: string | null;
}> {
  return {
    stream: null,
    errorName: "NotSupportedError",
    errorMessage: "microphone capture unavailable on this platform",
  };
}

export async function getMicrophoneDiagnostics(): Promise<{
  permissionState: null;
  audioInputCount: number | null;
  isSecureContext: boolean;
  hasMediaDevices: boolean;
}> {
  return {
    permissionState: null,
    audioInputCount: null,
    isSecureContext: true,
    hasMediaDevices: false,
  };
}

export function getGeolocation(): Promise<null> {
  return Promise.resolve(null);
}

export function isOnline(): boolean {
  return true;
}
