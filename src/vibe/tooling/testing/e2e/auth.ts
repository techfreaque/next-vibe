// Testing infrastructure - messages are for test debugging, not end users

import { AUTH_TOKEN_COOKIE_NAME } from "@/env/constants";

import type { ResponseType } from "../../../core/route/response.schema";
import { success } from "../../../core/route/response.schema";
import type { JwtPrivatePayloadType } from "../../../identity/auth/types";
import { createEndpointLogger } from "../../../logger/server";
import { E2E_LOCALE } from "./config";

/** Session lifetime for test-issued tokens — long enough for any single test. */
const TEST_SESSION_TTL_MS = 60 * 60 * 1000;

/**
 * Sign a JWT for `user` AND persist the matching session row — the server
 * validates every token against the sessions table, so a bare JWT is rejected.
 * Shared by the Playwright E2E suite and sendBrowserTestRequest.
 */
export async function createTestSessionToken(
  user: JwtPrivatePayloadType,
): Promise<ResponseType<string>> {
  const { AuthRepository } = await import("../../../identity/auth/repository");
  const { SessionRepository } =
    await import("../../../identity/session/repository");
  const logger = createEndpointLogger(false, E2E_LOCALE);

  const tokenResult = await AuthRepository.signJwt(user, logger, E2E_LOCALE);
  if (!tokenResult.success) {
    return tokenResult;
  }
  const sessionResult = await SessionRepository.create(
    {
      userId: user.id,
      token: tokenResult.data,
      expiresAt: new Date(Date.now() + TEST_SESSION_TTL_MS),
    },
    E2E_LOCALE,
  );
  if (!sessionResult.success) {
    return sessionResult;
  }
  return success(tokenResult.data);
}

/** Cookie name the server reads the auth token from (port-scoped in dev). */
export const E2E_AUTH_COOKIE_NAME = AUTH_TOKEN_COOKIE_NAME;
