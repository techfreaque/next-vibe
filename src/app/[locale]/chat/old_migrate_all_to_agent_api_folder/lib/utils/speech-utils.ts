/**
 * Speech recognition utility functions
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { TranslationKey } from "@/i18n/core/static-types";

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
  const isAndroid = ua.includes("android");
  const isMobile =
    isIOS || isAndroid || /mobile|tablet|ip(ad|hone|od)|android|silk/i.test(ua);

  const isChrome = ua.includes("chrome") && !/edge|edg/.test(ua);
  const isSafari = ua.includes("safari") && !ua.includes("chrome");
  const isFirefox = ua.includes("firefox");
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
  if (typeof window === "undefined") {
    return false;
  }

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
 * @returns Object with support status and translation key for reason if not supported
 */
export function checkSpeechRecognitionSupport(): {
  supported: boolean;
  reasonKey?: TranslationKey;
} {
  if (typeof window === "undefined") {
    return {
      supported: false,
      reasonKey: "app.chat.speechRecognition.errors.notInBrowser",
    };
  }

  // Check for secure context first
  if (!isSecureContext()) {
    return {
      supported: false,
      reasonKey: "app.chat.speechRecognition.errors.requiresHttps",
    };
  }

  // Check for API availability
  const hasSpeechRecognition = !!(
    (
      window as Window & {
        // eslint-disable-next-line no-restricted-syntax -- Browser API check requires unknown type
        SpeechRecognition?: unknown;
        // eslint-disable-next-line no-restricted-syntax -- Browser API check requires unknown type
        webkitSpeechRecognition?: unknown;
      }
    ).SpeechRecognition ||
    (
      window as Window & {
        // eslint-disable-next-line no-restricted-syntax -- Browser API check requires unknown type
        SpeechRecognition?: unknown;
        // eslint-disable-next-line no-restricted-syntax -- Browser API check requires unknown type
        webkitSpeechRecognition?: unknown;
      }
    ).webkitSpeechRecognition
  );

  if (!hasSpeechRecognition) {
    return {
      supported: false,
      reasonKey: "app.chat.speechRecognition.errors.notAvailable",
    };
  }

  // Check for known problematic environments
  const device = detectDevice();

  // Firefox doesn't support Speech Recognition API yet
  if (device.isFirefox) {
    return {
      supported: false,
      reasonKey: "app.chat.speechRecognition.errors.firefoxNotSupported",
    };
  }

  // iOS Safari has limited support (iOS 14.5+)
  if (device.isIOS && device.isSafari) {
    const version = parseFloat(device.browserVersion);
    if (version && version < 14.5) {
      return {
        supported: false,
        reasonKey: "app.chat.speechRecognition.errors.safariVersionTooOld",
      };
    }
  }

  // Check if MediaDevices API is available (required for permissions)
  if (!navigator.mediaDevices?.getUserMedia) {
    return {
      supported: false,
      reasonKey: "app.chat.speechRecognition.errors.microphoneNotAvailable",
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
 * Get translation key for a speech recognition error
 * @param errorCode - The error code from SpeechRecognitionErrorEvent
 * @returns Translation key for the error message
 */
export function getSpeechErrorTranslationKey(
  errorCode: string,
): TranslationKey {
  const errorKeyMap: Record<string, TranslationKey> = {
    "no-speech": "app.chat.speechRecognition.errors.noSpeech",
    "audio-capture": "app.chat.speechRecognition.errors.audioCapture",
    "not-allowed": "app.chat.speechRecognition.errors.notAllowed",
    "network": "app.chat.speechRecognition.errors.network",
    "service-not-allowed":
      "app.chat.speechRecognition.errors.serviceNotAllowed",
    "bad-grammar": "app.chat.speechRecognition.errors.badGrammar",
    "language-not-supported":
      "app.chat.speechRecognition.errors.languageNotSupported",
    "aborted": "app.chat.speechRecognition.errors.aborted",
  };

  return errorKeyMap[errorCode] || "app.chat.speechRecognition.errors.unknown";
}

/**
 * Check microphone permission state
 * @returns Permission state: 'granted', 'denied', 'prompt', or 'unknown'
 */
export async function checkMicrophonePermission(
  logger: EndpointLogger,
): Promise<"granted" | "denied" | "prompt" | "unknown"> {
  if (typeof navigator === "undefined" || !navigator.permissions) {
    return "unknown";
  }

  try {
    const result = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return result.state as "granted" | "denied" | "prompt";
  } catch (error) {
    logger.warn("Speech", "Could not check microphone permission", error);
    return "unknown";
  }
}
