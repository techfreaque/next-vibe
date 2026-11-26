import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError } from "pg";

import { isTransientConnectError } from "./pool";

/** Drizzle errors include bound values in their messages. Report only the
 * operation and driver diagnostics on paths that handle identity data. */
export function databaseFailureDiagnostics(error: Error): {
  errorType: string;
  databaseCode?: string;
  constraint?: string;
  driverFailure?: string;
  waitingForAdvisoryLock?: boolean;
} {
  const driver = error.cause instanceof Error ? error.cause : error;
  const databaseCode =
    "code" in driver &&
    typeof driver.code === "string" &&
    /^(?:[0-9A-Z]{5}|E[A-Z_]{4,18})$/.test(driver.code)
      ? driver.code
      : undefined;
  const driverFailure = [
    "Guest lead database deadline exceeded",
    "canceling statement due to statement timeout",
    "canceling statement due to lock timeout",
    "Query read timeout",
    "timeout exceeded when trying to connect",
    "Connection terminated",
    "Connection terminated unexpectedly",
    "Connection terminated due to connection timeout",
  ].find((message) => message === driver.message);
  return {
    errorType: driver.name,
    databaseCode,
    constraint: driver instanceof DatabaseError ? driver.constraint : undefined,
    driverFailure:
      driverFailure ??
      (databaseCode &&
      (isTransientConnectError(driver) ||
        /^(?:08[A-Z0-9]{3}|53300|55P03)$/.test(databaseCode))
        ? databaseCode
        : undefined),
    waitingForAdvisoryLock:
      error instanceof DrizzleQueryError
        ? /^\s*select\s+pg_advisory_xact_lock\s*\(/i.test(error.query)
        : undefined,
  };
}
