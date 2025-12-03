import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * WebSocket error code enum
 */
export const {
  enum: WebSocketErrorCode,
  options: WebSocketErrorCodeOptions,
  Value: WebSocketErrorCodeValue,
} = createEnumOptions({
  UNAUTHORIZED: "app.api.user.auth.enums.webSocketErrorCode.unauthorized",
  FORBIDDEN: "app.api.user.auth.enums.webSocketErrorCode.forbidden",
  INVALID_TOKEN: "app.api.user.auth.enums.webSocketErrorCode.invalidToken",
  TOKEN_EXPIRED: "app.api.user.auth.enums.webSocketErrorCode.tokenExpired",
  SERVER_ERROR: "app.api.user.auth.enums.webSocketErrorCode.serverError",
});
