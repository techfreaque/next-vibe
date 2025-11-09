import {
  createErrorResponse,
  success,
  ErrorResponseTypes,
  type ResponseType,
} from "../types/response.schema";

/**
 * Converts a time string in HH:MM format to seconds since midnight
 * @param timeStr - Time string in HH:MM format
 * @returns Success response with seconds or error response
 */
export function timeToSeconds(
  timeStr: `${number}:${number}`,
): ResponseType<number> {
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (hours === undefined || minutes === undefined) {
    return createErrorResponse(
      "app.api.v1.core.shared.utils.time.errors.invalid_time_format.title",
      ErrorResponseTypes.VALIDATION_ERROR,
      {
        inputValue: timeStr,
      },
    );
  }
  return success(hours * 3600 + minutes * 60);
}

export type SimpleTimeFormat = `${number}:${number}`;

/**
 * Converts seconds since midnight to a time string in HH:MM format
 * @param seconds - Seconds since midnight
 * @returns Success response with time string or error response
 */
export function secondsToTime(seconds: number): ResponseType<SimpleTimeFormat> {
  if (seconds < 0 || seconds >= 86_400) {
    return createErrorResponse(
      "app.api.v1.core.shared.utils.time.errors.invalid_time_range.title",
      ErrorResponseTypes.VALIDATION_ERROR,
      {
        inputValue: seconds,
      },
    );
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return success(
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}` as SimpleTimeFormat,
  );
}
