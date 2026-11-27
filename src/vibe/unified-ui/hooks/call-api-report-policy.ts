import { ErrorResponseTypes } from "../../core/route/response.schema";

/**
 * Auth/permission denials a logged-out visitor gets by design (the client
 * probes /me and role-gated endpoints on public pages). The server marks these
 * `expected` and logs them at debug; mirror that so every anonymous page view
 * doesn't become an error row. A logged-IN user getting one is a real auth
 * drop and IS reported.
 */
const PUBLIC_EXPECTED_ERROR_KEYS: ReadonlySet<string> = new Set<string>([
  ErrorResponseTypes.AUTH_ERROR.errorKey,
  ErrorResponseTypes.UNAUTHORIZED.errorKey,
  ErrorResponseTypes.FORBIDDEN.errorKey,
]);

/**
 * Whether callApi's central failure report writes a client row for a failed
 * call with this error key. Callers that would log the same failure again
 * (submitForm) skip their row exactly when this is true, so a failure is
 * reported once and none goes unreported.
 */
export function callApiReportsFailure(
  errorKey: string,
  isPublicUser: boolean,
): boolean {
  // Both prompts ask the caller to complete the next sign-in step.
  if (
    errorKey === ErrorResponseTypes.TWO_FACTOR_REQUIRED.errorKey ||
    errorKey === ErrorResponseTypes.EMAIL_CONFIRMATION_REQUIRED.errorKey
  ) {
    return false;
  }
  return !(isPublicUser && PUBLIC_EXPECTED_ERROR_KEYS.has(errorKey));
}
