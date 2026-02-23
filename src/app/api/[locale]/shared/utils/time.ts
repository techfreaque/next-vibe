import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as sharedScopedTranslation } from "../i18n";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "../types/response.schema";

/**
 * Converts a time string in HH:MM format to seconds since midnight
 * @param timeStr - Time string in HH:MM format
 * @returns Success response with seconds or error response
 */
export function timeToSeconds(
  timeStr: `${number}:${number}`,
  locale: CountryLanguage,
): ResponseType<number> {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (hours === undefined || minutes === undefined) {
    const { t: sharedT } = sharedScopedTranslation.scopedT(locale);

    return fail({
      message: sharedT("utils.time.errors.invalid_time_format.title"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
      messageParams: {
        inputValue: timeStr,
      },
    });
  }
  return success(hours * 3600 + minutes * 60);
}

export type SimpleTimeFormat = `${number}:${number}`;

/**
 * Converts seconds since midnight to a time string in HH:MM format
 * @param seconds - Seconds since midnight
 * @returns Success response with time string or error response
 */
export function secondsToTime(
  seconds: number,
  locale: CountryLanguage,
): ResponseType<string> {
  if (seconds < 0 || seconds >= 86_400) {
    const { t: sharedT } = sharedScopedTranslation.scopedT(locale);

    return fail({
      message: sharedT("utils.time.errors.invalid_time_range.title"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
      messageParams: {
        inputValue: seconds,
      },
    });
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  return success(timeString);
}
