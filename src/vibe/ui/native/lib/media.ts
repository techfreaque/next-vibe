import type { EndpointLogger } from "../../../logger/types";

export function getUserAgent(): string {
  return "React Native";
}

export function getLanguage(): string {
  return "en-US";
}

export async function getMicrophoneStream(
  logger: EndpointLogger,
): Promise<null> {
  logger.debug("[media] getMicrophoneStream unsupported", {
    platform: "native",
  });
  return null;
}

export async function requestMicrophoneStream(): Promise<{
  stream: null;
  errorName: string | null;
  errorMessage: string | null;
  userActivationActive: boolean | null;
}> {
  return {
    stream: null,
    errorName: "NotSupportedError",
    errorMessage: "microphone capture unavailable on this platform",
    userActivationActive: null,
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

export async function getGeolocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
} | null> {
  const Geolocation = await import("@react-native-community/geolocation");
  return new Promise((resolve) => {
    Geolocation.default.getCurrentPosition(
      (pos) => resolve(pos.coords),
      () => resolve(null),
    );
  });
}

export function isOnline(): boolean {
  return true;
}
