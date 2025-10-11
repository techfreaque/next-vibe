import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * WebSocket error code enum
 */
export const {
  enum: WebSocketErrorCode,
  options: WebSocketErrorCodeOptions,
  Value: WebSocketErrorCodeValue,
} = createEnumOptions({
  UNAUTHORIZED:
    "app.api.v1.core.user.auth.enums.webSocketErrorCode.unauthorized",
  FORBIDDEN: "app.api.v1.core.user.auth.enums.webSocketErrorCode.forbidden",
  INVALID_TOKEN:
    "app.api.v1.core.user.auth.enums.webSocketErrorCode.invalidToken",
  TOKEN_EXPIRED:
    "app.api.v1.core.user.auth.enums.webSocketErrorCode.tokenExpired",
  SERVER_ERROR:
    "app.api.v1.core.user.auth.enums.webSocketErrorCode.serverError",
});
