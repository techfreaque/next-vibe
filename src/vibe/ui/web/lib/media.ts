import type { EndpointLogger } from "../../../logger/types";

export function getUserAgent(): string {
  return navigator.userAgent;
}

export function getLanguage(): string {
  return navigator.language;
}

/**
 * Microphone stream or null. Every failure is reported with the rejection
 * name (permission denied vs no device vs mic busy vs insecure context).
 */
export async function getMicrophoneStream(
  logger: EndpointLogger,
): Promise<MediaStream | null> {
  const result = await requestMicrophoneStream();
  if (!result.stream) {
    logger.warn("[media] getMicrophoneStream failed", {
      platform: "web",
      errorName: result.errorName,
      errorMessage: result.errorMessage,
      permissionDenied: result.errorName === "NotAllowedError",
      noDevice: result.errorName === "NotFoundError",
      deviceBusy: result.errorName === "NotReadableError",
      isSecureContext: globalThis.isSecureContext,
    });
  }
  return result.stream;
}

export interface MicrophoneRequestResult {
  stream: MediaStream | null;
  /** getUserMedia rejection name: NotAllowedError, NotFoundError, NotReadableError, ... */
  errorName: string | null;
  errorMessage: string | null;
  /**
   * `navigator.userActivation.isActive` at the moment getUserMedia was called.
   * false = no transient user gesture, which some browsers (Firefox Android)
   * answer with NotAllowedError without ever showing a prompt. null = the
   * browser has no User Activation API.
   */
  userActivationActive: boolean | null;
}

/**
 * Like getMicrophoneStream, but keeps WHY it failed so the caller can show the
 * right message (permission denied vs no device vs mic busy) and log it.
 */
export async function requestMicrophoneStream(): Promise<MicrophoneRequestResult> {
  const userActivationActive = navigator.userActivation?.isActive ?? null;
  if (!navigator.mediaDevices?.getUserMedia) {
    // Insecure context (http) or an old browser: the API is simply absent.
    return {
      stream: null,
      errorName: "NotSupportedError",
      errorMessage: "navigator.mediaDevices.getUserMedia unavailable",
      userActivationActive,
    };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return {
      stream,
      errorName: null,
      errorMessage: null,
      userActivationActive,
    };
  } catch (err) {
    return {
      stream: null,
      errorName: err instanceof Error ? err.name : "UnknownError",
      errorMessage: err instanceof Error ? err.message : String(err),
      userActivationActive,
    };
  }
}

export interface MicrophoneDiagnostics {
  /** Permissions API state for "microphone"; null where the query is unsupported (Firefox, older Safari). */
  permissionState: PermissionState | null;
  /** audioinput devices the browser lists; null when enumerateDevices is unavailable. */
  audioInputCount: number | null;
  isSecureContext: boolean;
  hasMediaDevices: boolean;
}

/** Microphone environment snapshot - never prompts the user. */
export async function getMicrophoneDiagnostics(): Promise<MicrophoneDiagnostics> {
  const hasMediaDevices = !!navigator.mediaDevices;
  let permissionState: PermissionState | null = null;
  try {
    const status = await navigator.permissions?.query({ name: "microphone" });
    permissionState = status?.state ?? null;
  } catch {
    permissionState = null;
  }
  let audioInputCount: number | null = null;
  try {
    const devices = await navigator.mediaDevices?.enumerateDevices();
    audioInputCount = devices
      ? devices.filter((d) => d.kind === "audioinput").length
      : null;
  } catch {
    audioInputCount = null;
  }
  return {
    permissionState,
    audioInputCount,
    isSecureContext: globalThis.isSecureContext,
    hasMediaDevices,
  };
}

export function getGeolocation(): Promise<GeolocationCoordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      () => resolve(null),
    );
  });
}

/** Browser connectivity flag (false = the OS/browser reports offline). */
export function isOnline(): boolean {
  return navigator.onLine;
}
