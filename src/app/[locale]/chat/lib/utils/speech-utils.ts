/**
 * Speech recognition utility functions
 */

/**
 * Device and browser detection
 */
export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isChrome: boolean;
  isSafari: boolean;
  isFirefox: boolean;
  isEdge: boolean;
  browserVersion: string;
}

/**
 * Detect device and browser information
 * @returns Device and browser information
 */
export function detectDevice(): DeviceInfo {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isChrome: false,
      isSafari: false,
      isFirefox: false,
      isEdge: false,
      browserVersion: "",
    };
  }

  const ua = navigator.userAgent.toLowerCase();

  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isMobile =
    isIOS ||
    isAndroid ||
    /mobile|tablet|ip(ad|hone|od)|android|silk/i.test(ua);

  const isChrome = /chrome/.test(ua) && !/edge|edg/.test(ua);
  const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
  const isFirefox = /firefox/.test(ua);
  const isEdge = /edge|edg/.test(ua);

  // Extract browser version
  let browserVersion = "";
  if (isChrome) {
    const match = ua.match(/chrome\/([\d.]+)/);
    browserVersion = match ? match[1] : "";
  } else if (isSafari) {
    const match = ua.match(/version\/([\d.]+)/);
    browserVersion = match ? match[1] : "";
  } else if (isFirefox) {
    const match = ua.match(/firefox\/([\d.]+)/);
    browserVersion = match ? match[1] : "";
  } else if (isEdge) {
    const match = ua.match(/edg\/([\d.]+)/);
    browserVersion = match ? match[1] : "";
  }

  return {
    isIOS,
    isAndroid,
    isMobile,
    isChrome,
    isSafari,
    isFirefox,
    isEdge,
    browserVersion,
  };
}

/**
 * Check if the current context is secure (HTTPS or localhost)
 * Speech recognition requires a secure context
 * @returns true if in a secure context
 */
export function isSecureContext(): boolean {
  if (typeof window === "undefined") return false;

  // Check if window.isSecureContext is available
  if (typeof window.isSecureContext === "boolean") {
    return window.isSecureContext;
  }

  // Fallback: check protocol
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  return (
    protocol === "https:" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  );
}

/**
 * Check if speech recognition is supported and available
 * @returns Object with support status and reason if not supported
 */
export function checkSpeechRecognitionSupport(): {
  supported: boolean;
  reason?: string;
} {
  if (typeof window === "undefined") {
    return { supported: false, reason: "Not in browser environment" };
  }

  // Check for secure context first
  if (!isSecureContext()) {
    return {
      supported: false,
      reason: "Speech recognition requires HTTPS or localhost",
    };
  }

  // Check for API availability
  const hasSpeechRecognition = !!(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  if (!hasSpeechRecognition) {
    return {
      supported: false,
      reason: "Speech recognition not available in this browser",
    };
  }

  // Check for known problematic environments
  const device = detectDevice();

  // Firefox doesn't support Speech Recognition API yet
  if (device.isFirefox) {
    return {
      supported: false,
      reason: "Speech recognition not supported in Firefox",
    };
  }

  // iOS Safari has limited support (iOS 14.5+)
  if (device.isIOS && device.isSafari) {
    const version = parseFloat(device.browserVersion);
    if (version && version < 14.5) {
      return {
        supported: false,
        reason: "Please update Safari to version 14.5 or later",
      };
    }
  }

  // Check if MediaDevices API is available (required for permissions)
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      supported: false,
      reason: "Microphone access not available",
    };
  }

  return { supported: true };
}

/**
 * Map locale to speech recognition language code
 * @param locale - The application locale (e.g., "en", "de", "pl")
 * @returns Speech recognition language code (e.g., "en-US", "de-DE")
 */
export function localeToSpeechLang(locale: string): string {
  const langMap: Record<string, string> = {
    en: "en-US",
    de: "de-DE",
    pl: "pl-PL",
    es: "es-ES",
    fr: "fr-FR",
    it: "it-IT",
    pt: "pt-PT",
    ru: "ru-RU",
    ja: "ja-JP",
    ko: "ko-KR",
    zh: "zh-CN",
    ar: "ar-SA",
    hi: "hi-IN",
    nl: "nl-NL",
    sv: "sv-SE",
    no: "no-NO",
    da: "da-DK",
    fi: "fi-FI",
    tr: "tr-TR",
    cs: "cs-CZ",
    hu: "hu-HU",
    ro: "ro-RO",
    uk: "uk-UA",
  };

  return langMap[locale] || "en-US";
}

/**
 * Get user-friendly name for a speech recognition error
 * @param errorCode - The error code from SpeechRecognitionErrorEvent
 * @returns User-friendly error message
 */
export function getSpeechErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    "no-speech": "No speech detected. Please try again.",
    "audio-capture": "Microphone not available. Please check your settings.",
    "not-allowed":
      "Microphone permission denied. Please allow microphone access in your browser settings.",
    network: "Network error. Please check your connection.",
    "service-not-allowed": "Speech recognition service not allowed.",
    "bad-grammar": "Speech recognition error. Please try again.",
    "language-not-supported": "This language is not supported for speech recognition.",
    aborted: "Recording cancelled.",
  };

  return errorMessages[errorCode] || `Speech recognition error: ${errorCode}`;
}

/**
 * Check microphone permission state
 * @returns Permission state: 'granted', 'denied', 'prompt', or 'unknown'
 */
export async function checkMicrophonePermission(): Promise<
  "granted" | "denied" | "prompt" | "unknown"
> {
  if (typeof navigator === "undefined" || !navigator.permissions) {
    return "unknown";
  }

  try {
    const result = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return result.state as "granted" | "denied" | "prompt";
  } catch (error) {
    console.warn("Could not check microphone permission:", error);
    return "unknown";
  }
}
