import "server-only";

import { count, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";

import { humanUserSql } from "../audience-sql";
import { USERS_LIST_ALIAS } from "../list/constants";
import { AccountStateFilter, UsersAudience } from "../list/enum";
import type { UsersSummaryOutput } from "./definition";
import type { UsersSummaryT } from "./i18n";

export class UsersSummaryRepository {
  static async get(
    t: UsersSummaryT,
    now = new Date(),
  ): Promise<ResponseType<UsersSummaryOutput>> {
    const day = 86_400_000;
    const tomorrow = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
    );
    const from = new Date(tomorrow - 7 * day).toISOString().slice(0, 10);
    const to = now.toISOString().slice(0, 10);
    const previous = new Date(tomorrow - 14 * day).toISOString().slice(0, 10);
    const during = sql`${users.createdAt} >= ${from}::date AND ${users.createdAt} < ${to}::date + interval '1 day'`;
    const audience = UsersAudience.HUMANS;
    const accounts = { alias: USERS_LIST_ALIAS, args: { audience } };
    const signupWindow = { audience, signupFrom: from, signupTo: to };
    try {
      const [row] = await db
        .select({
          accounts: count(),
          verified: sql<number>`count(*) FILTER (WHERE ${users.emailVerified})::int`,
          signups: sql<number>`count(*) FILTER (WHERE ${during})::int`,
          priorSignups: sql<number>`count(*) FILTER (WHERE ${users.createdAt} >= ${previous}::date AND ${users.createdAt} < ${from}::date)::int`,
          awaiting: sql<number>`count(*) FILTER (WHERE ${during} AND NOT ${users.emailVerified})::int`,
        })
        .from(users)
        .where(humanUserSql(users.id, users.email));
      if (!row) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      return success({
        summary: {
          from,
          to,
          attentionAvailable: true,
          recent: [],
          kpis: [
            {
              label: "accounts",
              format: "number",
              value: row.accounts,
              drill: accounts,
            },
            {
              label: "signups",
              format: "number",
              value: row.signups,
              previous: row.priorSignups,
              drill: { alias: USERS_LIST_ALIAS, args: signupWindow },
            },
            {
              label: "verified",
              format: "number",
              value: row.verified,
              drill: {
                alias: USERS_LIST_ALIAS,
                args: { audience, requiredState: AccountStateFilter.VERIFIED },
              },
            },
            {
              label: "unverified",
              format: "number",
              value: row.accounts - row.verified,
              drill: {
                alias: USERS_LIST_ALIAS,
                args: {
                  audience,
                  requiredState: AccountStateFilter.UNVERIFIED,
                },
              },
            },
          ],
          attention:
            row.awaiting > 0
              ? [
                  {
                    label: "reviewUnverified",
                    count: row.awaiting,
                    severity: "info",
                    drill: {
                      alias: USERS_LIST_ALIAS,
                      args: {
                        ...signupWindow,
                        requiredState: AccountStateFilter.UNVERIFIED,
                      },
                    },
                  },
                ]
              : [],
        },
      });
    } catch {
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
