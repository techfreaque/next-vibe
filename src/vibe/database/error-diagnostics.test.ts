import { describe, expect, it } from "bun:test";
import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError } from "pg";

import { databaseFailureDiagnostics } from "./error-diagnostics";

describe("databaseFailureDiagnostics", () => {
  it("classifies connection, pool and lock failures without retrying ordinary SQL errors", () => {
    for (const code of [
      "08006",
      "08P01",
      "57P01",
      "57P02",
      "57P03",
      "53300",
      "55P03",
      "ECONNREFUSED",
      "EAI_AGAIN",
    ]) {
      const failure = Object.assign(new Error("private diagnostic"), { code });
      expect(databaseFailureDiagnostics(failure).driverFailure).toBe(code);
    }
    const constraint = Object.assign(new Error("private diagnostic"), {
      code: "23503",
    });
    expect(
      databaseFailureDiagnostics(constraint).driverFailure,
    ).toBeUndefined();
  });
  it("identifies the timed-out lock without exposing the signup key", () => {
    const cause = new DatabaseError(
      "canceling statement due to statement timeout",
      0,
      "error",
    );
    cause.code = "57014";
    const result = databaseFailureDiagnostics(
      new DrizzleQueryError(
        "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
        ["signup:email:test@example.invalid"],
        cause,
      ),
    );
    expect(result.waitingForAdvisoryLock).toBe(true);
    expect(result.databaseCode).toBe("57014");
    expect(JSON.stringify(result)).not.toContain("example.invalid");
  });

  it("identifies a missing column without exposing query values", () => {
    const cause = new DatabaseError(
      'column "accept_language" of relation "leads" does not exist',
      0,
      "error",
    );
    cause.code = "42703";
    const result = databaseFailureDiagnostics(
      new DrizzleQueryError(
        "insert into leads (accept_language) values ($1)",
        ["private parameter"],
        cause,
      ),
    );
    expect(result.databaseCode).toBe("42703");
    expect(result.missingColumn).toBe("accept_language");
    expect(result.driverFailure).toBeUndefined();
    expect(JSON.stringify(result)).not.toContain("private");
  });

  it("distinguishes foreign keys from client read timeouts without exposing query values", () => {
    const cause = new DatabaseError("foreign key violation", 0, "error");
    cause.code = "23503";
    cause.constraint = "lead_lead_links_lead_id_2_leads_id_fk";
    cause.detail = "private detail";
    const result = databaseFailureDiagnostics(
      new DrizzleQueryError(
        "insert into lead_lead_links values ($1)",
        ["private parameter"],
        cause,
      ),
    );
    expect(result.databaseCode).toBe("23503");
    expect(result.constraint).toBe(cause.constraint);
    expect(result.waitingForAdvisoryLock).toBe(false);
    expect(JSON.stringify(result)).not.toContain("private");
    expect(
      databaseFailureDiagnostics(new Error("Query read timeout")).driverFailure,
    ).toBe("Query read timeout");
  });
});
