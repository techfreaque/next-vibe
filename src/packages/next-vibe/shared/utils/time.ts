import {
  createErrorResponse,
  createSuccessResponse,
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
      "validationErrors.time.invalid_time_format",
      ErrorResponseTypes.VALIDATION_ERROR,
      {
        inputValue: timeStr,
      },
    );
  }
  return createSuccessResponse(hours * 3600 + minutes * 60);
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
      "validationErrors.time.invalid_time_range",
      ErrorResponseTypes.VALIDATION_ERROR,
      {
        inputValue: seconds,
      },
    );
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return createSuccessResponse(
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}` as SimpleTimeFormat,
  );
}
