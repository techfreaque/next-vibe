/**
 * Audience SQL for the admin user tools.
 * "Humans" = accounts that are neither admins nor on a reserved test domain
 * (RFC 2606 / 6761: example.com/.net/.org, *.example, *.invalid, *.localhost,
 * plus example.test used by fixtures). Reports and the drilled users-list use
 * the same predicate so their counts agree.
 */

import "server-only";

import { type AnyColumn, type SQL, sql } from "drizzle-orm";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

/** Reserved test domains, matched on the part after "@" (lowercased). */
export const RESERVED_TEST_DOMAINS = [
  "example.com",
  "example.net",
  "example.org",
  "example.test",
] as const;

/** Reserved test TLDs, matched as a suffix of the domain. */
export const RESERVED_TEST_TLDS = [
  ".example",
  ".invalid",
  ".localhost",
] as const;

/** TRUE when the email belongs to a reserved test domain. */
export function testEmailSql(email: AnyColumn | SQL): SQL {
  const domain = sql`lower(split_part(${email}, '@', 2))`;
  const exact = sql.join(
    RESERVED_TEST_DOMAINS.map((d) => sql`${d}`),
    sql`, `,
  );
  const suffixes = sql.join(
    RESERVED_TEST_TLDS.map((tld) => sql`${domain} LIKE ${`%${tld}`}`),
    sql` OR `,
  );
  return sql`(${domain} IN (${exact}) OR ${domain} = 'localhost' OR ${suffixes})`;
}

/** TRUE when the user id holds the admin role. */
export function adminUserSql(userId: AnyColumn | SQL): SQL {
  return sql`EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = ${userId} AND ur.role = ${UserPermissionRole.ADMIN})`;
}

/** TRUE for a real human account (not admin, not a test domain). */
export function humanUserSql(
  userId: AnyColumn | SQL,
  email: AnyColumn | SQL,
): SQL {
  return sql`(NOT ${adminUserSql(userId)} AND NOT ${testEmailSql(email)})`;
}
