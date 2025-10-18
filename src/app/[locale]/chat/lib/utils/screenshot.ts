/**
 * Screenshot Utilities
 *
 * Functions for capturing chat interface as images
 */

import html2canvas from "html2canvas";
import {
  ErrorResponseTypes,
  throwErrorResponse,
} from "next-vibe/shared/types/response.schema";

/**
 * Generate a sanitized filename for screenshots
 * Technical function - filenames are not user-facing strings
 */
export function generateScreenshotFilename(threadTitle?: string): string {
  if (!threadTitle) {
    return "chat-conversation";
  }
  // eslint-disable-next-line i18next/no-literal-string
  return `chat-${threadTitle.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
}

export type ScreenshotErrorTranslationKey =
  | "app.chat.screenshot.noMessages"
  | "app.chat.screenshot.quotaExceeded"
  | "app.chat.screenshot.canvasError"
  | "app.chat.screenshot.tryAgain";

/**
 * Get the appropriate translation key for a screenshot error
 * @param error - The error that occurred
 * @returns Translation key for the error message
 */
export function getScreenshotErrorKey(
  error: Error | ScreenshotError,
): ScreenshotErrorTranslationKey {
  if (!(error instanceof ScreenshotError)) {
    return "app.chat.screenshot.tryAgain";
  }

  switch (error.code) {
    case SCREENSHOT_ERROR_CODES.NO_MESSAGES_AREA:
      return "app.chat.screenshot.noMessages";
    case SCREENSHOT_ERROR_CODES.QUOTA_EXCEEDED:
      return "app.chat.screenshot.quotaExceeded";
    case SCREENSHOT_ERROR_CODES.CANVAS_CONVERSION_FAILED:
      return "app.chat.screenshot.canvasError";
    default:
      return "app.chat.screenshot.tryAgain";
  }
}

/**
 * Screenshot error codes for proper error handling
 */
export const SCREENSHOT_ERROR_CODES = {
  NO_MESSAGES_AREA: "NO_MESSAGES_AREA",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  CANVAS_CONVERSION_FAILED: "CANVAS_CONVERSION_FAILED",
} as const;

export type ScreenshotErrorCode =
  (typeof SCREENSHOT_ERROR_CODES)[keyof typeof SCREENSHOT_ERROR_CODES];

/**
 * Custom error class for screenshot operations
 */
export class ScreenshotError extends Error {
  constructor(
    message: string,
    public code: ScreenshotErrorCode,
  ) {
    super(message);
    // eslint-disable-next-line i18next/no-literal-string -- Error class name, not user-facing
    this.name = "ScreenshotError";
  }
}

/**
 * Screenshot configuration constants
 */
const SCREENSHOT_CONFIG = {
  /** Quality of the exported image (0-1) */
  IMAGE_QUALITY: 0.95,

  /** Image format for export */
  IMAGE_FORMAT: "image/png" as const,

  /** Default filename for downloads */
  DEFAULT_FILENAME: "chat-screenshot",

  /** File extension */
  FILE_EXTENSION: "png",

  /** html2canvas configuration options */
  CANVAS_OPTIONS: {
    backgroundColor: null, // Preserve transparency
    scale: 2, // Retina/HiDPI support
    logging: false, // Disable console logs
    useCORS: true, // Allow cross-origin images
  },
} as const;

/**
 * Capture a DOM element as an image
 *
 * @param element - The DOM element to capture
 * @returns Promise<Blob> - Image blob
 */
async function captureElementAsBlob(element: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(element, SCREENSHOT_CONFIG.CANVAS_OPTIONS);

  return await new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throwErrorResponse(
            "app.chat.screenshot.canvasError",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
        }
      },
      SCREENSHOT_CONFIG.IMAGE_FORMAT,
      SCREENSHOT_CONFIG.IMAGE_QUALITY,
    );
  });
}

/**
 * Download a blob as a file
 *
 * @param blob - The blob to download
 * @param filename - Optional custom filename (without extension)
 */
function downloadBlob(blob: Blob, filename?: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${filename || SCREENSHOT_CONFIG.DEFAULT_FILENAME}-${Date.now()}.${SCREENSHOT_CONFIG.FILE_EXTENSION}`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Capture chat messages area as screenshot and download it
 *
 * This function:
 * 1. Finds the chat messages container by ID
 * 2. Captures it as an image using html2canvas
 * 3. Downloads the image
 *
 * @param filename - Optional custom filename (without extension)
 * @throws Error if chat container not found
 *
 * @example
 * await captureAndDownloadScreenshot("my-conversation");
 */
export async function captureAndDownloadScreenshot(
  filename?: string,
): Promise<void> {
  // Find the messages content container (has the actual messages)
  const chatMessages = document.getElementById("chat-messages-content");

  if (!chatMessages) {
    // Fallback: try the outer container
    const chatContainer = document.getElementById("chat-messages-container");

    if (!chatContainer) {
      throwErrorResponse(
        "app.chat.screenshot.noMessages",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }

    const blob = await captureElementAsBlob(chatContainer);
    downloadBlob(blob, filename);
    return;
  }

  const blob = await captureElementAsBlob(chatMessages);
  downloadBlob(blob, filename);
}

/**
 * Capture element and save to localStorage
 *
 * Note: localStorage has size limits (~5-10MB), so this is best for
 * smaller screenshots or temporary storage.
 *
 * @param element - The element to capture
 * @param storageKey - Key to store the screenshot under
 * @returns Promise<string> - Data URL of the screenshot
 */
export async function captureAndSaveToStorage(
  element: HTMLElement,
  storageKey: string,
): Promise<string> {
  const canvas = await html2canvas(element, SCREENSHOT_CONFIG.CANVAS_OPTIONS);
  const dataUrl = canvas.toDataURL(
    SCREENSHOT_CONFIG.IMAGE_FORMAT,
    SCREENSHOT_CONFIG.IMAGE_QUALITY,
  );

  try {
    localStorage.setItem(storageKey, dataUrl);
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof Error && error.name === "QuotaExceededError") {
      throwErrorResponse(
        "app.chat.screenshot.quotaExceeded",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
    throwErrorResponse(
      "app.chat.screenshot.failed",
      ErrorResponseTypes.INTERNAL_ERROR,
    );
  }

  return dataUrl;
}

/**
 * Retrieve screenshot from localStorage
 *
 * @param storageKey - Key where screenshot was stored
 * @returns Data URL or null if not found
 */
export function getScreenshotFromStorage(storageKey: string): string | null {
  return localStorage.getItem(storageKey);
}

/**
 * Delete screenshot from localStorage
 *
 * @param storageKey - Key of screenshot to delete
 */
export function deleteScreenshotFromStorage(storageKey: string): void {
  localStorage.removeItem(storageKey);
}
